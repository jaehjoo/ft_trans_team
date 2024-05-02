from users.models import User

class Paddle:
    x: int
    y: int
    width: int
    height: int
    speed: int
    angle: int
    color: str

    def __init__(self, x, y, width, height, speed, angle, color):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.speed = speed
        self.angle = angle
        self.color = color

class Ball:
    x: int
    y: int
    radius: int
    speed: int
    velocity: int
    color: str

    def __init__(self, x, y, radius, speed, velocity, color):
        self.x = x
        self.y = y
        self.radius = radius
        self.speed = speed
        self.velocity = velocity
        self.color = color

class Player:
    info: User
    name: str 
    paddle: Paddle

    def __init__(self, User, name, rating):
        self.info = User
        self.name = name
        self.rating = rating
        self.paddle = None

class Team:
    team0_player0: Player
    team0_player1: Player
    team1_player0: Player
    team1_player1: Player

    def __init__(self, team0_player0, team0_player1, team1_player0, team1_player1):
        self.team0_player0 = team0_player0
        self.team0_player1 = team0_player1
        self.team1_player0 = team1_player0
        self.team1_player1 = team1_player1

# 게임 방을 만들기 전에 임시로 사용하는 클래스
# class Room:
#     room_name: str
#     status: str
#     player0: Player
#     player1: Player
#     player_number: int

#     def __init__(self):
#         self.room_name = ""
#         self.status = "waiting"
#         self.player_number = 1

#     def setPlayer(self, player0, player1):
#         self.player0 = Player(player0['info'], player0['name'], None, "not_ready")
#         self.player1 = Player(player1['info'], player1['name'], None, "not_ready")
    
