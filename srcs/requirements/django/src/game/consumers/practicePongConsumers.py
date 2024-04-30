import json, logging, asyncio

from channels.generic.websocket import AsyncWebsocketConsumer
from game.info import Room
from game.models import PracticeGameRoom
from users.models import UserRecordPongGame
from users.utils import random_key
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)

class practicePongConsumers(AsyncWebsocketConsumer):
    rating_differece = 100
    # 생성된 게임방을 저장할 게임방 명단 클래스
    class RoomList:
        pass

    # 웹소켓에서 연결 요청이 들어오면 받고 상대방 매칭 시도
    async def connect(self):
        self.game_group_name = ""
        await self.channel_layer.group_add("game_queue", self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({
            "type" : "game.message",
            "data" : {
                "mode" : "connect",
                "name" : self.channel_name,
            }
        }))
        await self.join_matching()

    # 연결을 종료
    async def disconnect(self, close_code):
        if close_code == 1001:
            if self.game_group_name:
                self.channel_layer.group_discard(self.game_group_name, self.channel_name)
            room = self.get_room()
            if room != None:
                delattr(self.RoomList, self.game_group_name)
        else:
            if self.game_group_name:
                self.channel_layer.group_send(
                    self.game_group_name, {
                        'type' : 'game.message',
                        'data' : {
                            'mode' : 'abnormal.termintaion',
                        }
                    }
                )
                self.channel_layer.group_discard(self.game_group_name, self.channel_name)

    # 웹소켓에서 받는 메세지를 처리
    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data.get('type')
        msg_data = data.get('data', [])
        # 연결 후에 웹소켓에서 플레이어 정보를 보낸다
        if msg_type == "set.game":
            cnt = await self.db_cnt()
            room = await self.get_room()
            if cnt == 1 and room == None:
                setattr(self.RoomList, self.game_group_name, Room())
                room = await self.get_room()
                room.setPlayer({"name": msg_data['player0'], "rating": 0}, {"name": msg_data['player1'], "rating": 0})
            if cnt == 2 and room != None:
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : 'game.message',
                        "data" : {
                            "mode" : "game.start",
                        }
                    }
                )
        # 각 플레이어들의 탁구채 위치 정보. 정보를 받으면 최신화
        if msg_type == 'bar.info':
            room = await self.get_room()
            if room.player0.name == self.channel_name:
                room.player0.bar.x = msg_data['bar']['x']
                room.player0.bar.y = msg_data['bar']['y']
            else:
                room.player1.bar.x = msg_data['bar']['x']
                room.player1.bar.y = msg_data['bar']['y']
            await self.update_bar_info()
        # 게임이 전부 끝나면 종료한다
        if msg_type == "game.clear":
            self.disconnect(1001)

    # 매칭 시도
    async def join_matching(self):
        count = await self.get_room_cnt()
        name = await self.get_room_name()
        # 방이 하나도 안 만들어졌거나 전부 게임중이면 방을 새로 판다. 방이 있으면 해당 방에 참여
        if count == 0 or name == "not":
            await self.create_room()
            await self.channel_layer.group_add(self.game_group_name, self.channel_name)
            await self.channel_layer.group_discard("game_queue", self.channel_name)
        else:
            if name != "not":
                self.game_group_name = name
                await self.channel_layer.group_add(self.game_group_name, self.channel_name)
                await self.channel_layer.group_discard("game_queue", self.channel_name)
                await self.set_player1()
                player = await self.get_player()
                # if await self.check_rating():
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
            else:
                await self.join_matching()
    
    # 두 플레이어의 레이팅을 확인하여 게임을 시작할지 말지 결정
    # @database_sync_to_async
    # def check_rating(self):
    #     player = self.get_player()
    #     player0 = player.player0
    #     player1 = player.player1
    #     logger.error(f"Player0 rating: {player0.rating}, Player1 rating: {player1.rating}")
    #     # rating_difference의 default 값은 100.
    #     if abs(player0.rating - player1.rating) < self.rating_differece:
    #         self.rating_differece = 100
    #         return True
    #     else:
    #         self.rating_differece += 200
    #         return False

    # 본인이 속한 방을 불러온다. 없으면 None
    async def get_room(self):
        return getattr(self.RoomList, self.game_group_name, None)
    
    # 사용자에게 받은 탁구채 위치 정보를 최신화
    async def update_bar_info(self):
        room = await self.get_room()
        if room.player0.name == self.channel_name:
            bar = {"x" : room.player0.bar.x, "y" : room.player0.bar.y}
        elif room.player1.name == self.channel_name:
            bar = {"x" : room.player1.bar.x, "y" : room.player1.bar.y}
        await self.channel_layer.group_send(
            self.game_group_name, {
                "type" : 'game.message',
                "data" : {
                    "mode" : "update.bar",
                    "name" : self.channel_name,
                    "bar" : {
                        "x" : bar['x'],
                        "y" : bar['y']
                    }
                }
            }
        )

    # 웹소켓에 보낼 메세지들을 처리한다
    async def game_message(self, event):
        await self.send(text_data=json.dumps(event))

    # database를 이용하여 사람 수를 세거나 할 때 사용
    @database_sync_to_async
    def db_cnt(self):
        is_room = PracticeGameRoom.objects.get(name=self.game_group_name)
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
        return PracticeGameRoom.objects.count()
    
    # 방을 만든다. 방 이름은 연습 게임이기에 test + 랜덤 생성 아스키 코드 6자리
    @database_sync_to_async
    def create_room(self):
        self.game_group_name = "test" + random_key(6)
        is_room = PracticeGameRoom(name=self.game_group_name, player0=self.channel_name)
        is_room.save()
    
    # 들어갈 수 있는 방을 검색하고 들어간 방의 이름을 알려준다
    @database_sync_to_async
    def get_room_name(self):
        room_all = PracticeGameRoom.objects.all()
        for room in room_all:
            if room.status == "waiting":
                room.player1 = self.channel_name
                room.status = "full"
                room.save()
                return room.name
        return "not"
    
    # 게임방에 두번째 사용자 등록
    @database_sync_to_async
    def set_player1(self):
        is_room = PracticeGameRoom.objects.get(name=self.game_group_name)
        is_room.player1 = self.channel_name
        is_room.save()
    
    # 게임방에 속한 플레이어들을 불러온다
    @database_sync_to_async
    def get_player(self):
        is_room = PracticeGameRoom.objects.get(name=self.game_group_name)
        return {"player0": is_room.player0, "player1": is_room.player1}