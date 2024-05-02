from django.db import models

class GameRoom(models.Model):
	cnt = models.IntegerField(default=0)
	room_name = models.CharField(default="", max_length=100, unique=True) # group_name
	mode = models.CharField(default="") # "pingpong", "fighting"
	status = models.CharField(max_length=20, default="") # "waiting", "playing", "end"
	player0 = models.CharField(default="", max_length=100)
	player0rating = models.IntegerField(default=0)
	player0displayName = models.CharField(default="", max_length=100)
	player1 = models.CharField(default="", max_length=100)
	player1rating = models.IntegerField(default=0)
	player1displayName = models.CharField(default="", max_length=100)
	set1_winner = models.CharField(default="", max_length=100)
	set2_winner = models.CharField(default="", max_length=100)
	final_winner = models.CharField(default="", max_length=100)