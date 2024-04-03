from django.urls import path
from . import consumers

websocket_urlpatterns = [
	path("ws/pong/onebyone", consumers.PongOneConsumer.as_asgi()),
	path("ws/pong/twobytwo", consumers.PongTwoConsumer.as_asgi()),
	path("ws/pong/tournament", consumers.PongTournamentConusumer.as_asgi()),
	path("ws/fighter", consumers.FighterConsumer.as_asgi())
]