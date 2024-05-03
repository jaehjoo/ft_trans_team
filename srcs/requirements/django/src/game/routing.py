from django.urls import path
from game.consumers import fightConsumers
from game.consumers import pongOneConsumers, pongTwoConsumers, pongTournamentConsumers

websocket_urlpatterns = [
	path("ws/game/pongonebyone", pongOneConsumers.PongOneConsumers.as_asgi()),
	path("ws/game/pongtwobytwo", pongTwoConsumers.PongTwoConsumers.as_asgi()),
	# path("ws/game/pongtournament", pongTournamentConsumers.PongTournamentConsumers.as_asgi()),
	path("ws/game/fighting", fightConsumers.fightingConsumers.as_asgi()),
]