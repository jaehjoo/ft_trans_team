from django.urls import re_path
from . import matching
from django.urls import path
from game.consumers import practicePongConsumers, practiceFightingConsumers, fightConsumers

websocket_urlpatterns = [
	re_path("ws/game/pongonebyone", matching.PongOneMatch.as_asgi()),
	# re_path("ws/game/pongtwobytwo", matching.PongTwoMatch.as_asgi()),
	# re_path("ws/game/pongtournament", matching.PongTournamentMatch.as_asgi()),
	path("ws/game/fighting", fightConsumers.fightingConsumers.as_asgi()),
]