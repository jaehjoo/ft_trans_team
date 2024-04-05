from django.db import models
from django.contrib.auth.models import AbstractUser

# 사용자의 기본 정보를 담아둔 모델
class User(AbstractUser):
	# 사용자마다 발행하는 고유 번호
	id = models.BigAutoField(help_text="USER ID", primary_key=True)
	username = models.CharField(max_length=80, unique=True)
	# 프로필 표시 정보
	display_name = models.CharField(max_length=80)
	email = models.CharField(max_length=80, blank=True)
	phone_number = models.CharField(max_length=80, blank=True)
	# login 여부
	connect = models.BooleanField(default=False)

	def __str__(self):
		return self.username

# 사용자에게 필요한 인증키(42, 2fa)를 담아둔 모델
class UserKey(models.Model):
	me = models.ForeignKey(User, related_name="key", on_delete=models.CASCADE)
	# 42 인증 여부와 42 액세스 토큰
	auth42 = models.BooleanField(default=False)
	access_42 = models.CharField(max_length=80, default="")
	# 0 : 등록 안 함, 1 : email, 2 : sms, 3 : otp
	auth2fa = models.IntegerField(default=0)
	otp_secret = models.CharField(max_length=32, default="")
	twofactorkey = models.CharField(max_length=32, default="")

# 사용자의 아바타 기록
class UserAvatar(models.Model):
	me = models.ForeignKey(User, related_name="avatar", on_delete=models.CASCADE)
	# 각 종류 개수에 따라 maximum 추후 지정 예정
	hair = models.IntegerField(default=0)
	eye = models.IntegerField(default=0)
	lip = models.IntegerField(default=0)
	skin_color = models.IntegerField(default=0)
	pongmedal_color = models.IntegerField(default=0)
	fightingmedal_color = models.IntegerField(default=0)

# 사용자의 탁구 게임 기록
class UserRecordPongGame(models.Model):
	me = models.ForeignKey(User, related_name="pongrecord", on_delete=models.CASCADE)
	win = models.IntegerField(default=0)
	lose = models.IntegerField(default=0)
	rating = models.IntegerField(default=0)

# 사용자의 격투 게임 기록
class UserRecordFightingGame(models.Model):
	me = models.ForeignKey(User, related_name="fightingrecord", on_delete=models.CASCADE)
	win = models.IntegerField(default=0)
	lose = models.IntegerField(default=0)
	rating = models.IntegerField(default=0)

# 사용자의 친구 기록
class UserRecordFriends(models.Model):
	me = models.ForeignKey(User, related_name="friends", on_delete=models.CASCADE)
	friends = models.ForeignKey(User, related_name="friend_of", on_delete=models.CASCADE)


# class UserRecentlyRecode(models.model):
# 	me = models.ForeignKey(User, on_delete=models.CASCADE)