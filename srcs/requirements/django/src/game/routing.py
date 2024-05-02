from django.urls import re_path
from . import pongConsumers
from django.urls import path
from game.consumers import practicePongConsumers, practiceFightingConsumers, fightConsumers

websocket_urlpatterns = [
	re_path("ws/game/pongonebyone", pongConsumers.PongOneMatch.as_asgi()),
	re_path("ws/game/pongtwobytwo", pongConsumers.PongTwoMatch.as_asgi()),
	re_path("ws/game/pongtournament", pongConsumers.PongTournamentMatch.as_asgi()),
	path("ws/game/fighting", fightConsumers.fightingConsumers.as_asgi()),
]