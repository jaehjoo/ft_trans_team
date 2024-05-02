import json, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from users.models import User, UserRecordPongGame
from users.utils import access_token_get_name
from game.models import GameRoom
from srcs.requirements.django.src.game.info_pong import Player
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from collections import deque
from urllib.parse import parse_qs

# 게임 큐는 GameRoom 인스턴스를 저장 및 관리
game_queue = {
    "onebyone" : deque(),
    "twobytwo" : deque(),
    "tournament" : deque(),
}

class PongOneMatch(AsyncWebsocketConsumer):
    rating_differece = 100
    group_name = ""

    async def connect(self):
        query_string = parse_qs(self.scope['query_string'].decode())
        access_token = query_string.get('access_token', [None])[0]
        user_name = access_token_get_name(access_token)

        if user_name == None:
            await self.close()
            return None
        
        user = await get_user_by_username(user_name)
        if user == None:
            await self.close()
            return None

        await self.accept()
        player = Player(user, user_name)
        await self.try_matching(player)

    async def try_matching(self, player):
        room_count = len(game_queue["onebyone"])

        # 방이 없으면 방을 만들고 사용자를 추가
        if room_count == 0:
             # 그룹 이름은 방을 생성한 플레이어의 고유한 user_name 사용
            self.group_name = f"pong_one_{player.name}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            new_room = GameRoom(room_name=self.group_name, player0=player.name, status="waiting", mode="pingpong")
            await database_sync_to_async(new_room.save)()
            game_queue["onebyone"].append(new_room)
        # 방이 존재
        else:
            matched = False
            # game_queue["onebyone"]에서 "waiting"인 방을 찾는다
            for room in game_queue["onebyone"]:
                if room.mode == "pingpong" and room.status == "waiting":
                    if await self.check_rating(room.player0, player):
                        await self.channel_layer.group_add(room.room_name, self.channel_name)
                        room.player1 = player.name
                        room.status = "playing"
                        await database_sync_to_async(room.save)()
                        self.group_name = room.room_name
                        matched = True
                        self.channel_layer.group_send(
                            self.group_name, {
                                "type" : 'game_message',
                                "data" : {
                                    "room_name" : self.group_name,
                                    "mode" : room.mode,
                                    "status": room.status,
                                    "player0" : room.player0,
                                    "player1" : room.player1,
                                }
                            }
                        )
                        self.game_start()
                    else:
                        self.try_matching(player)
            # "waiting"인 방이 없으면 새로운 방을 만든다
            if not matched:
                self.group_name = f"pong_one_{player.name}"
                await self.channel_layer.group_add(self.group_name, self.channel_name)
                new_room = GameRoom(room_name=self.group_name, player0=player.name, status="waiting", mode="pingpong")
                await database_sync_to_async(new_room.save)()
                game_queue["onebyone"].append(new_room)


    async def check_rating(self, player, oppnent):
        player_rating = await self.get_player_rating(player.name)
        oppnent_rating = await self.get_player_rating(oppnent.name)
        if abs(player_rating - oppnent_rating) <= self.rating_differece:
            return True
        else:
            self.rating_differece += 200
            return False
        
    @database_sync_to_async
    def get_player_rating(self, player_name):
        return UserRecordPongGame.objects.get(user_name=player_name).rating
    
    # 웹소켓에 보낼 메세지들을 처리한다
    async def game_message(self, event):
        await self.send(text_data=json.dumps(event))

    # 연결을 종료
    async def disconnect(self, close_code):
        if self.group_name:
            try:
                room = await database_sync_to_async(GameRoom.objects.get)(room_name=self.group_name)
                self.channel_layer.group_discard(self.group_name, self.channel_name)

                if room in game_queue["onebyone"]:
                    game_queue["onebyone"].remove(room)

                # 정상 종료가 아니면 abnormal termination 메세지를 보낸다
                if close_code != 1000:
                    await self.channel_layer.group_send(
                        self.group_name, {
                            'type' : 'game_message',
                            'data' : {
                                'status' : 'abnormal.termination',
                            }
                        }
                    )
                await database_sync_to_async(room.delete)()
            except GameRoom.DoesNotExist:
                pass

    # # 웹소켓에서 받는 메세지를 처리
    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     msg_type = data.get('type')
    #     msg_data = data.get('data', [])
    #     # 연결 후에 웹소켓에서 플레이어 정보를 보낸다
    #     if msg_type == "set.game":
    #         cnt = await self.db_cnt()
    #         room = await self.get_room()
    #         if cnt == 1 and room == None:
    #             setattr(self.RoomList, self.game_group_name, Room())
    #             room = await self.get_room()
    #             room.setPlayer({"name": msg_data['player0'], "rating": 0}, {"name": msg_data['player1'], "rating": 0})
    #         if cnt == 2 and room != None:
    #             await self.channel_layer.group_send(
    #                 self.game_group_name, {
    #                     "type" : 'game.message',
    #                     "data" : {
    #                         "mode" : "game.start",
    #                     }
    #                 }
    #             )
    #     # 각 플레이어들의 탁구채 위치 정보. 정보를 받으면 최신화
    #     if msg_type == 'bar.info':
    #         room = await self.get_room()
    #         if room.player0.name == self.channel_name:
    #             room.player0.bar.x = msg_data['bar']['x']
    #             room.player0.bar.y = msg_data['bar']['y']
    #         else:
    #             room.player1.bar.x = msg_data['bar']['x']
    #             room.player1.bar.y = msg_data['bar']['y']
    #         await self.update_bar_info()
    #     # 게임이 전부 끝나면 종료한다
    #     if msg_type == "game.clear":
    #         self.disconnect(1001)
    
    # # 사용자에게 받은 탁구채 위치 정보를 최신화
    # async def update_bar_info(self):
    #     room = await self.get_room()
    #     if room.player0.name == self.channel_name:
    #         bar = {"x" : room.player0.bar.x, "y" : room.player0.bar.y}
    #     elif room.player1.name == self.channel_name:
    #         bar = {"x" : room.player1.bar.x, "y" : room.player1.bar.y}
    #     await self.channel_layer.group_send(
    #         self.game_group_name, {
    #             "type" : 'game.message',
    #             "data" : {
    #                 "mode" : "update.bar",
    #                 "name" : self.channel_name,
    #                 "bar" : {
    #                     "x" : bar['x'],
    #                     "y" : bar['y']
    #                 }
    #             }
    #         }
    #     )

class PongTwoMatch(AsyncWebsocketConsumer):
    rating_differece = 100
    group_name = ""

    async def connect(self):
        query_string = parse_qs(self.scope['query_string'].decode())
        access_token = query_string.get('access_token', [None])[0]
        user_name = access_token_get_name(access_token)

        if user_name == None:
            await self.close()
            return None
        
        user = await get_user_by_username(user_name)
        if user == None:
            await self.close()
            return None

        await self.accept()
        player = Player(user, user_name)
        await self.try_matching(player)

    async def try_matching(self, player):
        room_count = len(game_queue["twobytwo"])

        # 방이 없으면 방을 만들고 사용자를 추가
        if room_count == 0:
             # 그룹 이름은 방을 생성한 플레이어의 고유한 user_name 사용
            self.group_name = f"pong_two_{player.name}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            new_room = GameRoom(room_name=self.group_name, player0=player.name, status="waiting", mode="pingpong")
            await database_sync_to_async(new_room.save)()
            game_queue["twobytwo"].append(new_room)
        # 방이 존재
        else:
            matched = False
            # game_queue["twobytwo"]에서 "waiting"인 방을 찾는다
            for room in game_queue["twobytwo"]:
                if room.mode == "pingpong" and room.status == "waiting":
                    if await self.check_rating(room.player0, player):
                        await self.channel_layer.group_add(room.room_name, self.channel_name)
                        room.player1 = player.name
                        room.status = "playing"
                        await database_sync_to_async(room.save)()
                        self.group_name = room.room_name
                        matched = True
                        self.channel_layer.group_send(
                            self.group_name, {
                                "type" : 'game_message',
                                "data" : {
                                    "room_name" : self.group_name,
                                    "mode" : room.mode,
                                    "status": room.status,
                                    "player0" : room.player0,
                                    "player1" : room.player1,
                                }
                            }
                        )
                        self.game_start()
                    else:
                        self.try_matching(player)
            # "waiting"인 방이 없으면 새로운 방을 만든다
            if not matched:
                self.group_name = f"pong_one_{player.name}"
                await self.channel_layer.group_add(self.group_name, self.channel_name)
                new_room = GameRoom(room_name=self.group_name, player0=player.name, status="waiting", mode="pingpong")
                await database_sync_to_async(new_room.save)()
                game_queue["one"].append(new_room)


    async def check_rating(self, player, oppnent):
        player_rating = await self.get_player_rating(player.name)
        oppnent_rating = await self.get_player_rating(oppnent.name)
        if abs(player_rating - oppnent_rating) <= self.rating_differece:
            return True
        else:
            self.rating_differece += 200
            return False
        
    @database_sync_to_async
    def get_player_rating(self, player_name):
        try:
            return UserRecordPongGame.objects.get(user_name=player_name).rating
        except UserRecordPongGame.DoesNotExist:
            return 1000


# class PongTournamentMatch(AsyncWebsocketConsumer):

@database_sync_to_async
def get_user_by_username(username):
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        return None