class Character:
	x: int
	y: int
	state: str
	health: int

	def updateInfo(self, x, y, state, health):
		self.x = x
		self.y = y
		self.state = state
		self.health = health

class Player:
	name: str
	rating: int
	fighter: int
	character: Character

	def __init__(self, name, rating):
		self.name = name
		self.rating = rating
		self.fighter = 0
		self.character = Character()
	
	def setFighter(self, fighter):
		self.fighter = fighter


class Room:
	player0: Player
	player1: Player
	winner: str

	def __init__(self):
		self.winner = ""
	
	def setPlayer(self, player0, player1):
		self.player0 = Player(player0['name'], player0['rating'])
		self.player1 = Player(player1['name'], player1['rating'])
	
	def setWinner(self, winner):
		self.winner = winner