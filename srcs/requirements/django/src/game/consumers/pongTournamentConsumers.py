import json, logging, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from users.models import User, UserRecordPongGame
from game.info_pong import Room
from game.models import GameRoom
from game.utils import rating_calculator
from datetime import datetime
from users.utils import random_key, access_token_get_name
from django.db import transaction
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs

logger = logging.getLogger(__name__)

class PongTournamentConsumers(AsyncWebsocketConsumer):
    class RoomList:
        pass

    async def connect(self):
        self.game_group_name = ""
        self.create_time = datetime.now()
        query_string = parse_qs(self.scope['query_string'].decode())
        access_token = query_string.get('access', None)[0]
        self.user_name = access_token_get_name(access_token)

        if access_token == None or self.user_name == None:
            await self.close()
        
        await self.channel_layer.group_add("game_queue_tournament", self.channel_name)
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
            member_count = await self.get_group_member_count(self.game_group_name)
            if member_count == 1:
                await delattr(self.RoomList, self.game_group_name)
                await self.db_delete()
        except AttributeError:
            logger.debug("No room")

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
            room = self.get_room()
            if room != None:
                delattr(self.RoomList, self.game_group_name)
        else:
            logger.error("websocket " + self.channel_name + ": abnormal termination")
            if self.game_group_name:
                self.channel_layer.group_send(
                    self.game_group_name, {
                        'type' : 'game.message',
                        'data' : {
                            'mode' : 'abnormal.termintaion',
                        }
                    }
                )
                await self.channel_layer.group_discard(self.game_group_name, self.channel_name)
        self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data.get('type')
        msg_data = data.get('data', [])
        # 연결 후에 웹소켓에서 플레이어 정보를 보낸다
        if msg_type == "set.game":
            cnt = await self.db_cnt()
            room = await self.get_room()
            if cnt == 1 and room == None:
                setattr(self.RoomList, self.game_group_name, Room("one"))
                room = await self.get_room()
                room.setPlayer({"name": msg_data['player0'], "rating": 0}, {"name": msg_data['player1'], "rating": 0})
            if cnt == 2 and room != None:
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : 'game.message',
                        "data" : {
                            "mode" : "game.start",
                            "player0" : {"x" : room.player0bar.x, "y" : room.player0bar.y},
                            "player1" : {"x" : room.player1bar.x, "y" : room.player1bar.y},
                            "ball" : {"x" : room.ball.ballX, "y" : room.ball.ballY},
                            "score" : {"ONE" : room.score.ONE, "TWO" : room.score.TWO},
                        }
                    }
                )
                asyncio.create_task(self.game_update_task())
        # 각 플레이어들의 탁구채 위치 정보. 정보를 받으면 최신화
        if msg_type == 'bar.info':
            room = await self.get_room()
            if msg_data['name'] == room.player0.name:
                room.player0bar.up = msg_data['up']
                room.player0bar.down = msg_data['down']
            else:
                room.player1bar.up = msg_data['up']
                room.player1bar.down = msg_data['down']
        # 게임이 전부 끝나면 종료한다
        if msg_type == "game.clear":
            self.disconnect(1000)

    # 매칭 시도
    async def join_matching(self):
            count = await self.get_room_cnt()
            name = await self.enter_room()

            if count == 0 or name == "not":
                await self.create_room()
                await self.channel_layer.group_send(self.game_group_name, self.channel_name)
                await self.channel_layer.group_send("game_queue_tournament", self.channel_name)
            self.game_group_name = name
            room = await self.get_room()

    @database_sync_to_async
    def get_db_room(self):
        return GameRoom.objects.get(room_name=self.game_group_name)

    @database_sync_to_async
    def matchPlayers(self, room, player0, player1, player2, player3):
        players = [player0, player1, player2, player3]

        players_with_ratings = [(player, self.get_rating(player)) for player in players]
        
        # 레이팅을 기준으로 오름차순으로 정렬
        sorted_players = sorted(players_with_ratings, key=lambda x: x[1])
        
        # 정렬된 데이터를 GameRoom 인스턴스의 해당 필드에 할당
        room.player0, room.player0rating = sorted_players[0][0], sorted_players[0][1]
        room.player1, room.player1rating = sorted_players[1][0], sorted_players[1][1]
        room.player2, room.player2rating = sorted_players[2][0], sorted_players[2][1]
        room.player3, room.player3rating = sorted_players[3][0], sorted_players[3][1]
        room.save()

    # 본인이 속한 방을 불러온다. 없으면 None
    async def get_room(self):
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
        is_room = getattr(self.RoomList, self.game_group_name, None)
        if is_room.winner == is_room.player0.name:
            player0rating = rating_calculator(is_room.player0.rating, is_room.player1.rating, 0)
            player1rating = rating_calculator(is_room.player1.rating, is_room.player0.rating, 1)
        else:
            player0rating = rating_calculator(is_room.player0.rating, is_room.player1.rating, 1)
            player1rating = rating_calculator(is_room.player1.rating, is_room.player0.rating, 0)
        await self.set_rating([is_room.player0.name, player0rating], [is_room.player1.name, player1rating], is_room.winner)

    async def game_update_task(self):
        await asyncio.sleep(2.1)
        room = getattr(self.RoomList, self.game_group_name)

        while True:
            await asyncio.sleep(0.01)
            room.update()
            if room.winner != "":
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : "game.message",
                        "data" : {
                            "mode" : "game.complete",
                            "winner" : room.winner,
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
                            "player0" : {"x" : room.player0bar.x, "y" : room.player0bar.y},
                            "player1" : {"x" : room.player1bar.x, "y" : room.player1bar.y},
                            "ball" : {"x" : room.ball.ballX, "y" : room.ball.ballY},
                            "score" : {"ONE" : room.score.ONE, "TWO" : room.score.TWO},
                        }
                    }
                )



    # database를 이용하여 사람 수를 세거나 할 때 사용
    @database_sync_to_async
    def db_cnt(self):
        is_room = GameRoom.objects.get(room_name=self.game_group_name)
        cnt = is_room.cnt
        cnt += 1
        if cnt < 2:
            is_room.cnt = cnt
        else:
            is_room.cnt = 0
        is_room.save()
        return cnt

    # 게임방이 얼마나 있는 지 확인할 때 사용
    @database_sync_to_async
    def get_room_cnt(self):
        return GameRoom.objects.count()
    
    # 방을 만든다. 방 이름은 "방장의 이름" + 랜덤 생성 아스키 코드 6자리
    @database_sync_to_async
    def create_room(self):
        self.game_group_name = self.user_name + random_key(6)
        players = [""] * 4
        players[0] = self.user_name
        is_room = GameRoom(room_name=self.game_group_name, mode="pingpong", status="waiting", players = players)
        is_room.save()
    
    # 데이터 베이스 게임 방에 플레이어를 넣는다
    @database_sync_to_async
    def set_player(self, player_num):
        is_room = GameRoom.objects.get(room_name=self.game_group_name)
        if player_num == 0:
            is_room.player0 = self.user_name
        elif player_num == 1:
            is_room.player1 = self.user_name
        elif player_num == 2:
            is_room.player2 = self.user_name
        elif player_num == 3:
            is_room.player3 = self.user_name
        is_room.save()
    
    # 게임방에 속한 플레이어들을 불러온다
    @database_sync_to_async
    def get_player(self):
        is_room = GameRoom.objects.get(room_name=self.game_group_name)
        return {"player0": is_room.player0, "player1": is_room.player1}
    
    @database_sync_to_async
    async def enter_room(self):
        with transaction.atomic():
            is_room = GameRoom.objects.filter(status="waiting").first()
            if is_room:
                for i in range(len(is_room.players)):
                    if not is_room.players[i]:
                        is_room.players[i] = self.user_name
                        await self.channel_layer.group_add(is_room.room_name, self.channel_name)
                        await self.channel_layer.group_discard("game_queue_tournament", self.channel_name)
                        break

                if all(player != "" for player in is_room.players):
                    is_room.status = "playing"

                    setattr(self.RoomList, is_room.room_name, Room("two"))
                    room = getattr(self.RoomList, is_room.room_name, None)
                    room.setPlayer({"name": is_room.players[0], "rating": self.get_rating(is_room.players[0])}, {"name": is_room.players[1], "rating": self.get_rating(is_room.players[1])}, {"name": is_room.players[2], "rating": self.get_rating(is_room.players[2])}, {"name": is_room.players[3], "rating": self.get_rating(is_room.players[3])})
                
                    # 레이팅을 기준으로 오름차순으로 정렬
                    self.matchSet(room)

                is_room.save()
                return is_room.room_name
            return "not"

    def matchSet(self, room):
        players = [room.player0, room.player1, room.player0, room.player1]

        players_with_ratings = [(player, self.get_rating(player)) for player in players]

    @database_sync_to_async
    def db_delete(self):
        is_room = GameRoom.objects.get(room_name=self.game_group_name)
        is_room.delete()

    @database_sync_to_async
    def get_rating(self, name):
        is_user = User.objects.get(username=name)
        record = UserRecordPongGame.objects.get(me=is_user)
        return record.rating
    
    @database_sync_to_async
    def rating_check(self, group_name):
        is_room = GameRoom.objects.get(room_name=group_name)
        if is_room.player0rating > self.rating + self.rating_difference or is_room.player0rating < self.rating - self.rating_difference:
            return False
        return True
    
    @database_sync_to_async
    def room_depart(self):
        is_room = GameRoom.objects.get(room_name=self.game_group_name)
        is_room.status = "waiting"
        is_room.save()
        self.game_group_name = ""

    
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