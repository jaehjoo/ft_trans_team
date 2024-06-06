import json, logging, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from users.models import User, UserRecordPongGame
from game.info_pong import Room
from game.models import GameRoom
from game.utils import rating_calculator
from datetime import datetime
from users.utils import random_key, access_token_get_name
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs

logger = logging.getLogger(__name__)

class PongOneConsumers(AsyncWebsocketConsumer):
    class RoomList:
        pass

    # 웹소켓에서 연결 요청이 들어오면 받고 상대방 매칭 시도
    async def connect(self):
        self.game_group_name = ""
        self.rating_difference = 100
        self.create_time = datetime.now()
        query_string = parse_qs(self.scope['query_string'].decode())
        access_token = query_string.get('access', None)[0]
        self.user_name = access_token_get_name(access_token)

        if access_token == None or self.user_name == None:
            await self.close()
        
        self.rating = await self.get_rating()
        await self.channel_layer.group_add("game_queue", self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({
            "type" : "game.message",
            "data" : {
                "mode" : "connect",
                "name" : self.user_name,
            }
        }))
        try:
            await asyncio.wait_for(self.join_matching(), 10)
        except asyncio.TimeoutError:
            await self.close()

    async def disconnect(self, close_code):
        try:
            cnt = await self.db_cnt()
            if cnt == 1:
                await self.db_delete()
                delattr(self.RoomList, self.game_group_name)
        except:
            logger.error("No room")

        if close_code == 1000:
            if self.game_group_name:
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        'type' : 'game.message',
                        'data' : {
                            'mode' : 'normal.termination',
                        }
                    }
                )
                await self.channel_layer.group_discard(self.game_group_name, self.channel_name)
            class_room = self.get_class_room()
            if class_room != None:
                delattr(self.RoomList, self.game_group_name)
        else:
            logger.error("websocket " + self.channel_name + ": abnormal termination")
            if self.game_group_name:
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        'type' : 'game.message',
                        'data' : {
                            'mode' : 'abnormal.termination',
                        }
                    }
                )
                await self.channel_layer.group_discard(self.game_group_name, self.channel_name)
        await self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data.get('type')
        msg_data = data.get('data', [])
        # 연결 후에 웹소켓에서 플레이어 정보를 보낸다
        if msg_type == "set.game":
            num_players = await self.db_cnt()
            class_room = await self.get_class_room()
            if num_players == 1 and class_room == None:
                setattr(self.RoomList, self.game_group_name, Room("one"))
                class_room = await self.get_class_room()
                class_room.setPlayerOneByOne({"name": msg_data['player0'], "rating": 0}, {"name": msg_data['player1'], "rating": 0})
            if num_players == 2 and class_room != None:
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : 'game.message',
                        "data" : {
                            "mode" : "game.start",
                            "player0" : {"x" : class_room.player0bar.x, "y" : class_room.player0bar.y},
                            "player1" : {"x" : class_room.player1bar.x, "y" : class_room.player1bar.y},
                            "ball" : {"x" : class_room.ball.ballX, "y" : class_room.ball.ballY},
                            "score" : {"ONE" : class_room.score.ONE, "TWO" : class_room.score.TWO},
                        }
                    }
                )
                asyncio.create_task(self.game_update_task())
                
        # 각 플레이어들의 탁구채 위치 정보. 정보를 받으면 최신화
        if msg_type == 'bar.info':
            class_room = await self.get_class_room()
            if msg_data['name'] == class_room.player0.name:
                class_room.player0bar.up = msg_data['up']
                class_room.player0bar.down = msg_data['down']
            else:
                class_room.player1bar.up = msg_data['up']
                class_room.player1bar.down = msg_data['down']
        # 게임이 전부 끝나면 종료한다
        if msg_type == "game.clear":
            self.disconnect(1000)

    # 매칭 시도
    async def join_matching(self):
        flag = False
        while flag == False:
            count = await self.get_db_room_cnt()
            db_room_name = await self.get_db_room_name()
            # 방이 하나도 안 만들어졌거나 전부 게임중이면 방을 새로 판다. 방이 있으면 해당 방에 참여
            if count == 0 or db_room_name == "not":
                await self.create_db_room()
                await self.channel_layer.group_add(self.game_group_name, self.channel_name)
                await self.channel_layer.group_discard("game_queue", self.channel_name)
                flag = True
            else:
                if db_room_name != "not":
                    self.game_group_name = db_room_name
                    if await self.rating_check(db_room_name):
                        await self.channel_layer.group_add(self.game_group_name, self.channel_name)
                        await self.channel_layer.group_discard("game_queue", self.channel_name)
                        await self.set_enemy()
                        player = await self.get_player()
                        await self.channel_layer.group_send(
                            self.game_group_name, {
                                "type" : 'game.message',
                                "data" : {
                                    "mode" : "set.game",
                                    "player0" : player["player0"],
                                    "player1" : player["player1"],
                                    "group" : self.game_group_name,
                                }
                            }
                        )
                        flag = True
                    else:
                        self.rating_difference += 200

    # 본인이 속한 방을 불러온다. 없으면 None
    async def get_class_room(self):
        return getattr(self.RoomList, self.game_group_name, None)

    async def matching_timeout(self):
        difference = self.create_time - datetime.now()
        if difference.seconds > 10:
            return False
        return True
    
    async def get_group_member_count(self, group_name):
        channel_layer = get_channel_layer()
        group_info = await channel_layer.group_layer.group_status(group_name)
        if group_info:
            return len(group_info['channel_names'])
        else:
            return -1

    # 웹소켓에 보낼 메세지들을 처리한다
    async def game_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def calculate_rating(self):
        class_room = getattr(self.RoomList, self.game_group_name, None)
        if class_room.winner == class_room.player0.name:
            player0rating = rating_calculator(class_room.player0.rating, class_room.player1.rating, 0)
            player1rating = rating_calculator(class_room.player1.rating, class_room.player0.rating, 1)
        else:
            player0rating = rating_calculator(class_room.player0.rating, class_room.player1.rating, 1)
            player1rating = rating_calculator(class_room.player1.rating, class_room.player0.rating, 0)
        await self.set_rating([class_room.player0.name, player0rating], [class_room.player1.name, player1rating], class_room.winner)

    async def game_update_task(self):
        await asyncio.sleep(2.1)
        class_room = getattr(self.RoomList, self.game_group_name)

        while True:
            await asyncio.sleep(0.0005)
            class_room.update()
            if class_room.winner != "":
                await self.calculate_rating()
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : "game.message",
                        "data" : {
                            "mode" : "game.complete",
                            "winner" : class_room.winner,
                        }
                    }
                )
                break
            else:
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : 'game.message',
                        "data" : {
                            "mode" : "info.update",
                            "player0" : {"x" : class_room.player0bar.x, "y" : class_room.player0bar.y},
                            "player1" : {"x" : class_room.player1bar.x, "y" : class_room.player1bar.y},
                            "ball" : {"x" : class_room.ball.ballX, "y" : class_room.ball.ballY},
                            "score" : {"ONE" : class_room.score.ONE, "TWO" : class_room.score.TWO},
                        }
                    }
                )



    # database를 이용하여 사람 수를 세거나 할 때 사용
    @database_sync_to_async
    def db_cnt(self):
        db_room = GameRoom.objects.get(room_name=self.game_group_name)
        cnt = db_room.cnt
        cnt += 1
        if cnt < 2:
            db_room.cnt = cnt
        else:
            db_room.cnt = 0
        db_room.save()
        return cnt

    # 게임방이 얼마나 있는 지 확인할 때 사용
    @database_sync_to_async
    def get_db_room_cnt(self):
        return GameRoom.objects.count()
    
    # 방을 만든다. 방 이름은 "방장의 이름" + 랜덤 생성 아스키 코드 6자리
    @database_sync_to_async
    def create_db_room(self):
        self.game_group_name = self.user_name + random_key(6)
        db_room = GameRoom(room_name=self.game_group_name, status="waiting", player0=self.user_name, player0rating=self.rating)
        db_room.save()
    
    # 들어갈 수 있는 방을 검색하고 들어간 방의 이름을 알려준다
    @database_sync_to_async
    def get_db_room_name(self):
        db_rooms = GameRoom.objects.all()
        for db_room in db_rooms:
            if db_room.status == "waiting":
                return db_room.room_name
        return "not"
    
    # 게임방에 두번째 사용자 등록
    @database_sync_to_async
    def set_enemy(self):
        db_room = GameRoom.objects.get(room_name=self.game_group_name)
        db_room.player1 = self.user_name
        db_room.status = "playing"
        db_room.save()
    
    # 게임방에 속한 플레이어들을 불러온다
    @database_sync_to_async
    def get_player(self):
        db_room = GameRoom.objects.get(room_name=self.game_group_name)
        return {"player0": db_room.player0, "player1": db_room.player1}
    
    @database_sync_to_async
    def db_delete(self):
        db_room = GameRoom.objects.get(room_name=self.game_group_name)
        db_room.delete()

    @database_sync_to_async
    def get_rating(self):
        is_user = User.objects.get(username=self.user_name)
        record = UserRecordPongGame.objects.get(me=is_user)
        return record.rating
    
    @database_sync_to_async
    def rating_check(self, group_name):
        db_room = GameRoom.objects.get(room_name=group_name)
        if abs(db_room.player0rating - self.rating) > self.rating_difference:
            return False
        return True
    
    @database_sync_to_async
    def set_rating(self, player0Info, player1Info, winner):
        player0 = User.objects.get(username=player0Info[0])
        player0record = UserRecordPongGame.objects.get(me=player0)
        player1 = User.objects.get(username=player1Info[0])
        player1record = UserRecordPongGame.objects.get(me=player1)
        player0record.rating = player0Info[1]
        player1record.rating = player1Info[1]
        if winner == player0.username:
            player0record.win += 1
            player1record.lose += 1
        else:
            player0record.lose += 1
            player1record.win += 1
        player0record.save()
        player1record.save()