from django.db import models

class PracticeGameRoom(models.Model):
	mode = models.IntegerField(default=0)
	status = models.CharField(max_length=20, default="waiting")
	name = models.CharField(max_length=100, unique=True)
	player0 = models.CharField(max_length=100)
	player1 = models.CharField(max_length=100)
	winner = models.IntegerField(default=-1)
	cnt = models.IntegerField(default=0)