from django.urls import re_path
from django.urls import path
from game.consumers import practiceFightingConsumers, fightConsumers, PongConsumers

websocket_urlpatterns = [
	re_path("ws/game/pongonebyone", PongConsumers.PongOneConsumers.as_asgi()),
	re_path("ws/game/pongtwobytwo", PongConsumers.PongTwoConsumers.as_asgi()),
	re_path("ws/game/pongtournament", PongConsumers.PongTournamentConsumers.as_asgi()),
	path("ws/game/fighting", fightConsumers.fightingConsumers.as_asgi()),
]