from django.db import models
from django.contrib.postgres.fields import ArrayField

# 2대2 매치 시, player0과 player1은 한 팀, player2와 player3은 한 팀
class GameRoom(models.Model):
	cnt = models.IntegerField(default=0)
	room_name = models.CharField(default="", max_length=100, unique=True) # group_name
	mode = models.CharField(default="") # "pingpong", "fighting"
	status = models.CharField(max_length=20, default="") # "waiting", "playing", "end"
	players = ArrayField(models.CharField(max_length=100, blank=True), size=4)
	player0 = models.CharField(default="", max_length=100)
	player0rating = models.IntegerField(default=0)
	player0displayName = models.CharField(default="", max_length=100)
	player1 = models.CharField(default="", max_length=100)
	player1rating = models.IntegerField(default=0)
	player2 = models.CharField(default="", max_length=100)
	player2rating = models.IntegerField(default=0)
	player3 = models.CharField(default="", max_length=100)
	player3rating = models.IntegerField(default=0)
	player1displayName = models.CharField(default="", max_length=100)
	set1_winner = models.CharField(default="", max_length=100)
	set2_winner = models.CharField(default="", max_length=100)
	final_winner = models.CharField(default="", max_length=100)