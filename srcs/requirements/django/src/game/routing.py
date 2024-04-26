from django.urls import path
from game.consumers import practicePongConsumers

websocket_urlpatterns = [
	path("ws/game/practice", practicePongConsumers.practicePongConsumers.as_asgi()),
]