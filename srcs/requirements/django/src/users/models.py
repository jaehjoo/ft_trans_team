from django.db import models
from django.contrib.auth.models import AbstractUser

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
	twofactor_key = models.CharField(default="")
	# login 여부
	connect = models.BooleanField(default=False)

	def __str__(self):
		return self.username

# class UserRecordGame(models.model):
# 	me = models.ForeignKey(User, on_delete=models.CASCADE)
# 	win = models.IntegerField(default=0)
# 	lose = models.IntegerField(default=0)
# 	rating = models.IntegerField(defualt=0)

# class UserRecentlyRecode(models.model):
# 	me = models.ForeignKey(User, on_delete=models.CASCADE)
	
# class UserAvatar(models.model):
# 	me = models.ForeignKey(User, on_delete=models.CASCADE)
# 	hair = models.IntegerField(default=0)
# 	eye = models.IntegerField(default=0)
# 	lip = models.IntegerField(default=0)
# 	skin_color = models.IntegerField(default=0)
# 	medal_color = models.IntegerField(default=0)

# class UserRecordFriends(models.model):
# 	me = models.ForeignKey(User, on_delete=models.CASCADE)
# 	friends = models.CharField(default="")