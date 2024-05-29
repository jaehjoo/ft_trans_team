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
            class_room = await self.get_class_room()
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

        if msg_type == "set.game":
            num_players = await self.db_cnt()
            class_room = await self.get_class_room()
            if num_players == 1 and class_room == None:
                setattr(self.RoomList, self.game_group_name, Room("one"))
                class_room = await self.get_class_room()
                class_room.setPlayerOneByOne({"name": msg_data['player0'], "rating": 0}, {"name": msg_data['player1'], "rating": 0})
            if num_players == 4 and class_room != None:
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : "game.message",
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

        elif msg_type == "next.game" and msg_data['status'] == "match1" and msg_data['name'] == self.user_name:
            class_room = await self.get_class_room()
            # class_room.winner = msg_data['name']
            class_room.status = "match2"
            class_room.setForNextMatch()
            db_room = await self.get_db_room()
            await self.channel_layer.group_send(
                self.game_group_name, {
                    "type" : "game.message",
                    "data" : {
                        "mode" : "set.game",
                        "status" : "match2",
                        "player0" : db_room.players[2],
                        "player1" : db_room.players[3],
                        "group" : self.game_group_name
                    }
                }
            )
            await self.channel_layer.group_send(
                self.game_group_name, {
                    "type" : "game.message",
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

        elif msg_type == "next.game" and msg_data['status'] == "match2" and msg_data['name'] == self.user_name:
            class_room = await self.get_class_room()
            # class_room.winner2 = msg_data['name']
            class_room.status = "match3"
            class_room.setForNextMatch()
            await self.channel_layer.group_send(
                self.game_group_name, {
                    "type" : "game.message",
                    "data" : {
                        "mode" : "set.game",
                        "status" : "match3",
                        "player0" : class_room.winner,
                        "player1" : class_room.winner2,
                        "group" : self.game_group_name
                    }
                }
            )
            await self.channel_layer.group_send(
                self.game_group_name, {
                    "type" : "game.message",
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

        if msg_type == 'bar.info':
            class_room = await self.get_class_room()
            if msg_data['name'] == class_room.player0.name:
                class_room.player0bar.up = msg_data['up']
                class_room.player0bar.down = msg_data['down']
            else:
                class_room.player1bar.up = msg_data['up']
                class_room.player1bar.down = msg_data['down']

        if msg_type == "game.clear":
            self.disconnect(1000)

    async def game_update_task(self):
        await asyncio.sleep(2.1)
        class_room = await self.get_class_room()

        while True:
            await asyncio.sleep(0.01)
            class_room.update()
            # match1이 종료된 조건
            if class_room.status == "match1" and class_room.winner != "":
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : "game.message",
                        "data" : {
                            "mode" : "match.game.complete",
                            "status"  : "match1",
                            "winner" : class_room.winner,
                        }
                    }
                )
                break
            # match2 종료된 조건
            elif class_room.status == "match2" and class_room.winner2 != "":
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : "game.message",
                        "data" : {
                            "mode" : "match.game.complete",
                            "status" : "match2",
                            "winner" : class_room.winner2,
                        }
                    }
                )
                break
            elif class_room.status == "match3" and class_room.winner3 != "":
                await self.channel_layer.group_send(
                    self.game_group_name, {
                        "type" : "game.message",
                        "data" : {
                            "mode" : "game.complete",
                            "status" : "match3",
                            "winner" : class_room.winner3,
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

    async def join_matching(self):
            flag = False
            while flag == False:
                count = await self.get_db_room_cnt()
                room_name_in_db = await self.find_room_in_db()
                # 데이터베이스에 방이 없거나 "대기 중"인 방이 없을 때
                if count == 0 or room_name_in_db == "not":
                    await self.create_db_room()
                    await self.channel_layer.group_add(self.game_group_name, self.channel_name)
                    await self.channel_layer.group_discard("game_queue_tournament", self.channel_name)
                    flag = True
                elif room_name_in_db:
                    self.game_group_name = room_name_in_db
                    db_room = await self.get_db_room()
                    await self.set_players(db_room)
                    await self.channel_layer.group_add(db_room.room_name, self.channel_name)
                    await self.channel_layer.group_discard("game_queue_tournament", self.channel_name)
                    if await self.is_room_full(db_room) == True:
                        # 매치 메이킹 시스템으로 적으로 레이팅이 비슷한 플레이어와 매치가 됩니다.
                        await self.match_players(db_room)
                        await self.channel_layer.group_send(
                            self.game_group_name, {
                                "type" : "game.message",
                                "data" : {
                                    "mode" : "set.game",
                                    "status" : "match1",
                                    "player0" : db_room.player0,
                                    "player1" : db_room.player1,
                                    "group" : self.game_group_name
                                }
                            }
                        )
                    flag = True

    async def find_room_in_db(self):
            db_room = await self.get_waiting_db_room()
            if db_room == None:
                return "not"
            else:
                return db_room.room_name
        
    @database_sync_to_async
    def get_waiting_db_room(self):
        with transaction.atomic():
            return GameRoom.objects.filter(status="waiting").first()

    @database_sync_to_async
    def get_db_room(self):
        return GameRoom.objects.get(room_name=self.game_group_name)

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

    async def game_message(self, event):
        await self.send(text_data=json.dumps(event))


    @database_sync_to_async
    def db_cnt(self):
        db_room = GameRoom.objects.get(room_name=self.game_group_name)
        cnt = db_room.cnt
        cnt += 1
        if cnt < 4:
            db_room.cnt = cnt
        else:
            db_room.cnt = 0
        db_room.save()
        return cnt

    @database_sync_to_async
    def is_room_full(self, db_room):
        if all(player != "" for player in db_room.players):
            db_room.status = "playing"
            db_room.save()
            return True
        return False

    @database_sync_to_async
    def set_players(self, db_room):
        # players의 크기는 4이며, 비어있는 위치에 현재 들어온 유저를 할당합니다.
        for i in range(4):
            if db_room.players[i] == "":
                db_room.players[i] = self.user_name
                break
        db_room.save()

    async def match_players(self, db_room):
        players = [db_room.players[0], db_room.players[1], db_room.players[2], db_room.players[3]]

        players_with_ratings = []
        
        for player in players:
            rating = await self.get_rating(player)
            players_with_ratings.append((player, rating))
        
        # 레이팅을 기준으로 오름차순으로 정렬
        sorted_players = sorted(players_with_ratings, key=lambda x: x[1])
        
        # 정렬된 데이터를 GameRoom 인스턴스의 해당 필드에 할당
        db_room.player0, db_room.player0rating = sorted_players[0][0], sorted_players[0][1]
        db_room.player1, db_room.player1rating = sorted_players[1][0], sorted_players[1][1]
        db_room.player2, db_room.player2rating = sorted_players[2][0], sorted_players[2][1]
        db_room.player3, db_room.player3rating = sorted_players[3][0], sorted_players[3][1]

        save_room = database_sync_to_async(db_room.save)

        await save_room()
    
    @database_sync_to_async
    def get_db_room_cnt(self):
        return GameRoom.objects.count()
    
    @database_sync_to_async
    def create_db_room(self):
        self.game_group_name = self.user_name + random_key(6)
        players = [self.user_name, "", "", ""]
        db_room = GameRoom(room_name=self.game_group_name, status="waiting", player0=self.user_name, players = players)
        db_room.save()

    @database_sync_to_async
    def db_delete(self):
        db_room = GameRoom.objects.get(room_name=self.game_group_name)
        db_room.delete()

    @database_sync_to_async
    def get_rating(self, name):
        is_user = User.objects.get(username=name)
        record = UserRecordPongGame.objects.get(me=is_user)
        return record.rating
    
    # async def calculate_rating(self):
    #     class_room = await self.get_class_room()
    #     if class_room.winner == class_room.player0.name:
    #         player0rating = rating_calculator(class_room.player0.rating, class_room.player1.rating, 0)
    #         player1rating = rating_calculator(class_room.player1.rating, class_room.player0.rating, 1)
    #         player2rating = rating_calculator(class_room.player2.rating, class_room.player0.rating, 1)
    #         player3rating = rating_calculator(class_room.player3.rating, class_room.player0.rating, 1)
    #     elif class_room.winner == class_room.player1.name:
    #         player1rating = rating_calculator(class_room.player1.rating, class_room.player0.rating, 0)
    #         player0rating = rating_calculator(class_room.player0.rating, class_room.player1.rating, 1)
    #         player2rating = rating_calculator(class_room.player2.rating, class_room.player1.rating, 1)
    #         player3rating = rating_calculator(class_room.player3.rating, class_room.player1.rating, 1)
    #     elif class_room.winner == class_room.player2.name:
    #         player2rating = rating_calculator(class_room.player2.rating, class_room.player3.rating, 0)
    #         player0rating = rating_calculator(class_room.player0.rating, class_room.player2.rating, 1)
    #         player1rating = rating_calculator(class_room.player1.rating, class_room.player2.rating, 1)
    #         player3rating = rating_calculator(class_room.player3.rating, class_room.player2.rating, 1)
    #     elif class_room.winner == class_room.player3.name:
    #         player3rating = rating_calculator(class_room.player3.rating, class_room.player2.rating, 0)
    #         player0rating = rating_calculator(class_room.player0.rating, class_room.player3.rating, 1)
    #         player1rating = rating_calculator(class_room.player1.rating, class_room.player3.rating, 1)
    #         player2rating = rating_calculator(class_room.player2.rating, class_room.player3.rating, 1)

    #     await self.set_rating([class_room.player0.name, player0rating], [class_room.player1.name, player1rating], [class_room.player2.name, player2rating], [class_room.player3.name, player3rating], class_room.winner)
    
    # @database_sync_to_async
    # def set_rating(self, player0Info, player1Info, player2Info, player3Info, winner):
    #     player0 = User.objects.get(username=player0Info[0])
    #     player0record = UserRecordPongGame.objects.get(me=player0)
    #     player1 = User.objects.get(username=player1Info[0])
    #     player1record = UserRecordPongGame.objects.get(me=player1)
    #     player2 = User.objects.get(username=player0Info[0])
    #     player2record = UserRecordPongGame.objects.get(me=player2)
    #     player3 = User.objects.get(username=player1Info[0])
    #     player3record = UserRecordPongGame.objects.get(me=player3)
    #     player0record.rating = player0Info[1]
    #     player1record.rating = player1Info[1]
    #     player2record.rating = player2Info[1]
    #     player3record.rating = player3Info[1]
    #     if winner == player0.username:
    #         player0record.win += 1
    #         player1record.lose += 1
    #         player2record.lose += 1
    #         player3record.lose += 1
    #     elif winner == player1.username:
    #         player1record.win += 1
    #         player0record.lose += 1
    #         player2record.lose += 1
    #         player3record.lose += 1
    #     elif winner == player2.username:
    #         player2record.win += 1
    #         player0record.lose += 1
    #         player1record.lose += 1
    #         player3record.lose += 1
    #     elif winner == player3.username:
    #         player3record.win += 1
    #         player0record.lose += 1
    #         player1record.lose += 1
    #         player2record.lose += 1

    #     player0record.save()
    #     player1record.save()
    #     player2record.save()
    #     player3record.save()