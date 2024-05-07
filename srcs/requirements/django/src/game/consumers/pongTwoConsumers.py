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

class PongTwoConsumers(AsyncWebsocketConsumer):
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
        
        await self.channel_layer.group_add("game_queue_twobytwo", self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({
            "type" : "game.message",
            "data" : {
                "mode" : "connect",
                "name" : self.user_name
            }
            }))
        try:
            asyncio.wait(self.join_matching(), 10)
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
                        "type" : "game.message",
                        "data" : {
                            "mode" : "normal.termination",
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
                        "type" : "game.message",
                        "data" : {
                            "mode" : "abnormal.termination",
                        }
                    }
                )
                await self.channel_layer.group_discard(self.game_group_name, self.channel_name)
        self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data.get("type")
        msg_data = data.get("data", [])

        if msg_type == "set.game":
            cnt = await self.db_cnt()
            room = await self.get_room()
            if cnt == 1 and room == None:
                setattr(self.RoomList, self.game_group_name, Room("two"))
                room = await self.get_room()
                room.setPlayer({"name": msg_data["player0"], "rating": 0}, {"name": msg_data["player1"], "rating": 0}, {"name": msg_data["player2"], "rating": 0}, {"name": msg_data["player3"], "rating": 0})
            if cnt == 4 and room != None:
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : "game.message",
                        "data" : {
                            "mode" : "set.game",
                            "player0" : {"x" : room.player0bar.x, "y" : room.player0bar.y},
                            "player1" : {"x" : room.player1bar.x, "y" : room.player1bar.y},
                            "player2" : {"x" : room.player2bar.x, "y" : room.player2bar.y},
                            "player3" : {"x" : room.player3bar.x, "y" : room.player3bar.y},
                            "ball" : {"x" : room.ball.ballX, "y" : room.ball.ballY},
                            "score" : {"ONE" : room.score.ONE, "TWO" : room.score.TWO},
                        }
                    }
                )
                asyncio.create_task(self.game_update_task())
        if msg_type == "bar.info":
            room = await self.get_room()
            if msg_data['name'] == room.player0.name:
                room.player0bar.x = msg_data['up']
                room.player0bar.y = msg_data['down']
            elif msg_data['name'] == room.player1.name:
                room.player1bar.x = msg_data['up']
                room.player1bar.y = msg_data['down']
            elif msg_data['name'] == room.player2.name:
                room.player2bar.x = msg_data['up']
                room.player2bar.y = msg_data['down']
            elif msg_data['name'] == room.player3.name:
                room.player3bar.x = msg_data['up']
                room.player3bar.y = msg_data['down']
        if msg_type == "game.clear":
            self.disconnect(1000)

    async def join_matching(self):
        count = await self.get_room_cnt()
        room = await self.enter_room()
        # 방이 없거나 대기 중인 방이 없을 때
        if count == 0 or room == "not":
            await self.create_room()
            await self.channel_layer.group_add(self.game_group_name, self.channel_name)
            await self.channel_layer.group_discard("game_queue_twobytwo", self.channel_name)
        room = await self.get_db_room()
        if room.status == "playing":
            await self.matchPlayers(room, room.players[0], room.players[1], room.players[2], room.players[3])
            await self.channel_layer.group_send(
                self.game_group_name, {
                    "type" : "game.message",
                    "data" : {
                        "mode" : "set.game",
                        "player0" : room.player0,
                        "player1" : room.player1,
                        "player2" : room.player2,
                        "player3" : room.player3,
                        "group" : self.game_group_name,
                    }
                }
            )
        
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
        
    async def game_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def calculate_rating(self):
        is_room = getattr(self.RoomList, self.game_group_name, None)
        if is_room.winner == is_room.player0.name:
            player0rating = rating_calculator(is_room.player0.rating, is_room.player1.rating, 0)
            player1rating = rating_calculator(is_room.player1.rating, is_room.player0.rating, 1)
        else:
            player0rating = rating_calculator(is_room.player0.rating, is_room.player1.rating, 0)
            player1rating = rating_calculator(is_room.player1.rating, is_room.player0.rating, 1)
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
                            "mode" : "game.compelete",
                            "winner" : room.winner,
                            "winner2" : room.winner2,
                        }
                    }
                )
            else:
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : 'game.message',
                        "data" : {
                            "mode" : "info.update",
                            "player0" : {"x" : room.player0bar.x, "y" : room.player0bar.y},
                            "player1" : {"x" : room.player1bar.x, "y" : room.player1bar.y},
                            "player2" : {"x" : room.player2bar.x, "y" : room.player2bar.y},
                            "player3" : {"x" : room.player3bar.x, "y" : room.player3bar.y},
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
        if cnt < 4:
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

    # 들어갈 수 있는 방을 검색하고 들어간 방의 이름을 알려준다
    @database_sync_to_async
    async def enter_room(self):
        with transaction.atomic():
            is_room = GameRoom.objects.filter(status="waiting").first()
            if is_room:
                for i in range(len(is_room.players)):
                    if not is_room.players[i]:
                        is_room.players[i] = self.user_name
                        await self.channel_layer.group_add(is_room.room_name, self.channel_name)
                        await self.channel_layer.group_discard("game_queue_twobytwo", self.channel_name)
                        break

                if all(player != "" for player in is_room.players):
                    is_room.status = "playing"

                    setattr(self.RoomList, is_room.room_name, Room())
                    room = getattr(self.RoomList, is_room.room_name)
                    room.setPlayer({"name": is_room.player0, "rating": 0}, {"name": is_room.player1, "rating": 0}, {"name": is_room.player2, "rating": 0}, {"name": is_room.player3, "rating": 0})
                is_room.save()
                return is_room.room_name
            return "not"

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
    def set_rating(self, player0Info, player1Info, player2Info, player3Info, winner1, winner2):
        player0 = User.objects.get(username=player0Info[0])
        player0record = UserRecordPongGame.objects.get(me=player0)
        player1 = User.objects.get(username=player1Info[0])
        player1record = UserRecordPongGame.objects.get(me=player1)
        player2 = User.objects.get(username=player2Info[0])
        player2record = UserRecordPongGame.objects.get(me=player2)
        player3 = User.objects.get(username=player3Info[0])
        player3record = UserRecordPongGame.objects.get(me=player3)
        player0record.rating = player0Info[1]
        player1record.rating = player1Info[1]
        player2record.rating = player2Info[1]
        player3record.rating = player3Info[1]
        if winner1 == player0.username and winner2 == player1.username:
            player0record.win += 1
            player1record.win +=1
            player2record.lose += 1
            player3record.lose += 1
        else:
            player0record.lose += 1
            player1record.lose += 1
            player2record.win += 1
            player3record.win += 1
        player0record.save()
        player1record.save()
        player2record.save()
        player3record.save()
