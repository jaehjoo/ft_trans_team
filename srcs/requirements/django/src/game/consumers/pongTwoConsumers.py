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

class PongTwoConsumers(AsyncWebsocketConsumer):
    class RoomList:
        pass

    async def connect(self):
        self.game_group_name = ""
        self.rating_difference  = 100
        self.create_time = datetime.now()
        query_string = parse_qs(self.scope['query_string'].decode())
        access_token = query_string.get('access', None)[0]
        self.user_name = access_token_get_name(access_token)

        if access_token == None or self.user_name == None:
            await self.close()
        
        self.rating = await self.get_rating(self.user_name)
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
            room = self.room()
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

    async def join_matching(self):
        flag = False
        while flag == False:
            count = await self.get_room_cnt()
            name = await self.get_room_name()

            if count == 0 or name == "not":
                await self.create_room()
                await self.channel_layer.group_add(self.game_group_name, self.channel_name)
                await self.channel_layer.group_discard("game_queue_twobytwo", self.channel_name)
                flag = True
            else:
                if name != "not":
                    
    
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
    
    # 방을 만든다. 방 이름은 "pong_one_" + 랜덤 생성 아스키 코드 6자리
    @database_sync_to_async
    def create_room(self):
        self.game_group_name = self.user_name + random_key(6)
        is_room = GameRoom(room_name=self.game_group_name, mode="pingpong", status="waiting", player0=self.user_name)
        is_room.save()

    # 들어갈 수 있는 방을 검색하고 들어간 방의 이름을 알려준다
    @database_sync_to_async
    def get_room_name(self):
        room_all = GameRoom.objects.all()
        for room in room_all:
            if room.status == "waiting":
                room.player1 = self.user_name
                room.status = "full"
                room.save()
                return room.room_name
        return "not"
    
    # 게임방에 두번째 사용자 등록
    @database_sync_to_async
    def set_player(self, player_num):
        is_room = GameRoom.objects.get(room_name=self.game_group_name)
        if player_num == 0:
            is_room.player0 = self.user_name
        else:
            is_room.player1 = self.user_name
        is_room.save()

    @database_sync_to_async
    def get_player(self):
        is_room = GameRoom.objects.get(room_name=self.game_group_name)
        return {"player0" : is_room.player0, "player1" : is_room.player1}

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
        if is_room.player0rating > self.rating + self.rating_differece or is_room.player0rating < self.rating - self.rating_differece:
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
