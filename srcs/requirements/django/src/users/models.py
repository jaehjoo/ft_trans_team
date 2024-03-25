from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

class User(AbstractUser):
	# 프로필 표시 정보
	username = models.CharField(max_length=80, unique=True)
	display_name = models.CharField(max_length=50)
	# 42 인증
	auth42 = models.BooleanField(default=False)
	password = models.CharField(default="")
	# 2fa (not = 0, eamil = 1, phone = 2, authenticatorApp = 3)
	has2fa = models.IntegerField(default=0)
	email = models.CharField(max_length=80, blank=True)
	phone_number = models.CharField(max_length=80, blank=True)
	verification_code = models.IntegerField(default=0)
	# login 여부
	connect = models.BooleanField(default=False)

	def __str__(self):
		return self.username

# class UserRecordGame(models.model):

# class UserRecordFriends(models.model):