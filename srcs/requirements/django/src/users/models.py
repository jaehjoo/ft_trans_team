from django.db import models
from django.contrib.auth.models import AbstractUser

# 사용자 정보
class User(AbstractUser):
	id = models.AutoField(primary_key=True)
	username = models.CharField(max_length=50, unique=True)
	emailaddress = models.CharField(max_length=200, unique=True)
	access_token = models.CharField(max_length=50, blank=True)
	refresh_token = models.CharField(max_length=50, blank=True)
	display_name = models.CharField(max_length=50)
	avatar_base64 = models.TextField(default="", blank=True)
	status = models.CharField(max_length=50, default="offline")
	game_win = models.IntegerField(default=0)
	game_lose = models.IntegerField(default=0)
	games_play = models.IntegerField(default=0)
	has_2fa = models.BooleanField(default=False)
	from_42 = models.BooleanField(default=False)
	friends = models.CharField(max_length=1000, default="")

	def __str__(self):
		return self.username