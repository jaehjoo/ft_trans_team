class Window:
	width: int
	height: int
	border: int
	middle: {int, int}

	def __init__(self, width, height, border, middle):
		self.width = width
		self.height = height
		self.border = border
		self.middle = middle

class Player:
	name: str
	rating: int

	def __init__(self, name, rating):
		self.name = name
		self.rating = rating

class Bar:
	x: int
	y: int
	width: int
	height: int
	up: bool
	down: bool

	def __init__(self, width, height, x, y):
		self.width = width
		self.height = height
		self.x = x
		self.y = y
		self.up = False
		self.down = False

	def set_bar(self, x, y):
		self.x = x
		self.y = y
	
	def update(self):
		if self.up == True:
			self.y -= 7
		elif self.down == True:
			self.y += 7

class Score:
	ONE: int
	TWO: int
	WIN: int

	def __init__(self):
		self.ONE = 0
		self.TWO = 0
		self.WIN = 11

	def setScore(self, ONE, TWO):
		self.ONE = ONE
		self.TWO = TWO

class Ball:
	initLoca: {int, int}
	ballX: int
	ballY: int
	radius: int
	velocityX: int
	velocityY: int
	serve: int

	def __init__(self, x1, y1, x2, y2, radius):
		self.ballX = x1
		self.ballY = y1
		self.velocityX = x2
		self.velocityY = y2
		self.radius = radius
		self.serve = 0
		self.initLoca = {x1, y1}

	def set_ball(self, x, y):
		self.ballX = x
		self.ballY = y

	def set_velocity(self, x, y):
		self.velocityX = x
		self.velocityY = y

	def update(self):
		self.ballX += self.velocityX
		self.ballY += self.velocityY
	
	def init(self):
		self.ballX, self.ballY = self.initLoca
		if self.velocityX < 0 and self.velocityX != -3:
			self.velocityX = -3
		elif self.velocityX > 0 and self.velocityX != 3:
			self.velocityX = 3
		if self.velocityY < 0 and self.velocityY != -3:
			self.velocityY = -3
		elif self.velocityY > 0 and self.velocityY != 3:
			self.velocityY = 3

		if self.serve == 2:
			self.velocityX *= -1
			self.velocityY *= -1
			self.serve = 0

class Room:
	winner: str
	window: Window
	player0: Player
	player1: Player
	player0bar: Bar
	player1bar: Bar
	ball: Ball
	score: Score
	frameTime: int

	def __init__(self):
		self.winner = ""
		self.window = Window(1024, 768, 1024 / 50, {1024 / 80, 768})
		self.player0bar = Bar(self.window.width / 60, self.window.height / 7, self.window.width / 50, self.window.height / 2 - self.window.height / 14)
		self.player1bar = Bar(self.window.width / 60, self.window.height / 7, self.window.width / 50 * 48 + 3, self.window.height / 2 - self.window.height / 14)
		self.ball = Ball(self.window.width / 2, self.window.height / 2, 3, 3, self.window.width / 100)
		self.score = Score()

	def setTeam(self, team):
		self.team = team

	def setPlayer(self, player0, player1):
		self.player0 = Player(player0['name'], player0['rating'])
		self.player1 = Player(player1['name'], player1['rating'])
	
	def setBarLocation(self, x1, y1, x2, y2):
		self.player0bar.set_bar(x1, y1)
		self.player1bar.set_bar(x2, y2)
	
	def setBallLocation(self, x, y):
		self.ball.set_ball(x, y)
	
	def setBallVelocity(self, x, y):
		self.ball.set_velocity(x, y)
	
	def setScore(self, ONE, TWO):
		self.score.setScore(ONE, TWO)
	
	def setWinner(self, winner):
		self.winner = winner
	
	def setplayer0barState(self, state, value):
		if state == "up":
			self.player0bar.up = value
		if state == "down":
			self.player0bar.down = value
	
	def setplayer1barState(self, state, value):
		if state == "up":
			self.player1bar.up = value
		if state == "down":
			self.player1bar.down = value
	
	def update(self):
		self.player0bar.update()
		self.player1bar.update()
		self.ball.update()
		self.checkWallCollision()
		self.checkBarCollision()
		self.checkBoundary()
		self.checkScore()

	def checkWallCollision(self):
		if (self.ball.ballY + self.ball.velocityY > self.window.height - self.window.border - self.ball.radius) or (self.ball.ballY + self.ball.velocityY < self.window.border + self.ball.radius):
			self.ball.velocityY *= -1
		if self.player0bar.y < self.window.border:
			self.player0bar.y = self.window.border
		if self.player0bar.y > self.window.height - self.window.border - self.player0bar.height:
			self.player0bar.y = self.window.height - self.window.border - self.player0bar.height
		if self.player1bar.y < self.window.border:
			self.player1bar.y = self.window.border
		if self.player1bar.y > self.window.height - self.window.border - self.player1bar.height:
			self.player1bar.y = self.window.height - self.window.border - self.player1bar.height

	def checkBarCollision(self):
		if self.ball.ballX - self.ball.radius < self.player0bar.x + 10 and self.ball.ballY + self.ball.velocityY >= self.player0bar.y and self.ball.ballY + self.ball.velocityY <= self.player0bar.y + self.player0bar.height:
			self.ball.velocityX *= -1.1
			self.ball.velocityY *= 1.1
		if self.ball.ballX + self.ball.radius > self.player1bar.x + self.player1bar.width - 10 and self.ball.ballY + self.ball.velocityY >= self.player1bar.y and self.ball.ballY + self.ball.velocityY <= self.player1bar.y + self.player1bar.height:
			self.ball.velocityX *= -1.1
			self.ball.velocityY *= 1.1

	def checkBoundary(self):
		if self.ball.ballX < self.player0bar.x:
			self.ball.serve += 1
			self.ball.init()
			self.score.TWO += 1
		elif self.ball.ballX > self.player1bar.x + self.player1bar.width:
			self.ball.serve += 1
			self.ball.init()
			self.score.ONE += 1

	def checkScore(self):
		if self.score.ONE == self.score.TWO and self.score.ONE > 9:
			self.score.WIN = self.score.ONE + 2
		elif self.score.ONE > self.score.TWO and self.score.ONE == self.score.WIN:
			self.winner = self.player0.name
		elif self.score.TWO > self.score.TWO and self.score.TWO == self.score.WIN:
			self.winner = self.player1.name

