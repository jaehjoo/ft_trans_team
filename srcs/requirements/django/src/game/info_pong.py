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

class Team:
	winner0: str
	winner1: str
	team0_player0: Player
	team0_player1: Player
	team1_player0: Player
	team1_player1: Player

	def __init__(self):
		self.winner0 = ""
		self.winner1 = ""

	def setTeam(self, team0_player0, team0_player1, team1_player0, team1_player1):
		self.team0_player0 = Player(team0_player0['name'], team0_player0['rating'], Bar(1024 / 50, 768 / 2 - 768 / 14))
		self.team0_player1 = Player(team0_player1['name'], team0_player1['rating'], Bar(1024 / 50, 768 / 2 + 768 / 14))
		self.team1_player0 = Player(team1_player0['name'], team1_player0['rating'], Bar(1024 / 50 * 48 + 3, 768 / 2 + 768 / 14))
		self.team1_player1 = Player(team1_player1['name'], team1_player1['rating'], Bar(1024 / 50 * 48 + 3, 768 / 2 - 768 / 14))

	def matchTeam(self, player0, player1, player2, player3):
		players = [player0, player1, player2, player3]
		# 플레이어들의 레이팅을 오름차순으로 정렬
		players.sort(ket=lambda x: x['rating'])
		self.setTeam(players[0], players[3], players[1], players[2])

	def setWinnerTeam(self, winner0, winner1):
		self.winner0 = winner0
		self.winner1 = winner1

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
