class Bar:
	x: int
	y: int

	def __init__(self, x, y):
		self.x = x
		self.y = y

class Player:
	name: str
	rating: int
	bar: Bar

	def __init__(self, name, rating, bar):
		self.name = name
		self.rating = rating
		self.bar = bar


class Room:
	winner: str
	player0: Player
	player1: Player

	def __init__(self):
		self.winner = ""

	def setPlayer(self, player0, player1):
		self.player0 = Player(player0['name'], player0['rating'], Bar(1024 / 50, 768 / 2 - 768 / 14))
		self.player1 = Player(player1['name'], player1['rating'], Bar(1024 / 50 * 48 + 3, 768 / 2 - 768 / 14))
	
	def setWinner(self, winner):
		self.winner = winner