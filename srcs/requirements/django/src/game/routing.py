from django.urls import re_path
from django.urls import path
from game.consumers import fightConsumers, PongConsumers

websocket_urlpatterns = [
	re_path("ws/game/pongonebyone", PongConsumers.PongOneConsumers.as_asgi()),
	# re_path("ws/game/pongtwobytwo", matching.PongTwoMatch.as_asgi()),
	# re_path("ws/game/pongtournament", matching.PongTournamentMatch.as_asgi()),
	path("ws/game/fighting", fightConsumers.fightingConsumers.as_asgi()),
]