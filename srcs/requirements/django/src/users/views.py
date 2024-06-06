import json, logging
from django.http import JsonResponse
from django.middleware.csrf import get_token
from datetime import datetime
from users.models import User, UserAvatar, UserKey, UserRecordFriends, UserRecordPongGame, UserRecordFightingGame
from users import jwt, enroll42, enroll2fa
from users.utils import access_get_name, access_get_exp, refresh_get_exp, refresh_get_name, jsonMessage, jsonAvatarMessage, jsonUserMessage
from users.changevalue import change_user_value, change_avatar_value

logger = logging.getLogger(__name__)

# jwt access, refresh 토큰이 정상/비정상 여부 확인
def auth_token(request, token):
	if token == 'access':
		name = access_get_name(request)
		exp = access_get_exp(request)
	elif token == 'refresh':
		name = refresh_get_name(request)
		exp = refresh_get_exp(request)
	if exp:
		try:
			user = User.objects.get(username=name)
		except User.DoesNotExist:
			return None
		if float(exp) > datetime.now().timestamp():
			user.connect = True
			user.save()
			return name
		else:
			user.connect = False
			user.save()
	return None

# auth42 : 42 인증 절차 처리
# GET : 42 인증 요청
# POST : invalid
def auth_42(request):
	if request.method == 'GET':
		return enroll42.generate_42(request)
	return None

# login 검증
# GET : 들어온 jwt 토큰 및 42 인가 코드 확인
def login(request):
	if request.method == 'POST':
		return jsonMessage("N", "fail.login.nopost", None)
	name = auth_token(request, 'access')
	if name:
		user = User.objects.get(username=name)
		key = UserKey.objects.get(me=user)
		has2fa = key.auth2fa
		if has2fa:
			return jsonMessage("Y", "success.login.already", {'name' : name})
	user = auth_42(request)
	if user:
		csrf_token = get_token(request)
		return jsonMessage("Y", None, {"access" : jwt.generate_access(user), "refresh" : jwt.generate_refresh(user)})
	return jsonMessage("N", "fail.auth.42", None)

# 가장 처음 불러올 api
# GET : 로그인 여부 확인하고 답장 보냄 
def main(request):
	if request.method == 'GET':
		access = auth_token(request, 'access')
		refresh = auth_token(request, 'refresh')
		if access:
			user = User.objects.get(username=access)
			key = UserKey.objects.get(me=user)
			has2fa = key.auth2fa
			if has2fa:
				return jsonMessage("Y", None, {"name" : access})
		elif refresh:
			user_obj = User.objects.get(username=refresh.get('name'))
			if user_obj:
				return jsonMessage("N", "fail.auth.access", {"access" : jwt.generate_access(user_obj)})
	return jsonMessage("N", "fail.auth.all", None)

# 2차 인증 시도
# POST : 토큰 값과 선택한 2차 인증을 확인하고 코드를 전송
def TwoFactor(request):
	if request.method == 'GET':
		return jsonMessage("N", "fail.auth.2fa", None)
	content = json.loads(request.body)
	if content.get('email', None):
		if enroll2fa.send_email(request):
			return jsonMessage("Y", None, None)
	elif content.get('sms', None):
		sms = content.get('sms')
		if enroll2fa.send_sms(request, sms):
			return jsonMessage("Y", None, None)
	elif content.get('otp', None):
		if enroll2fa.send_otp(request):
			return jsonMessage("Y", None, None)
	return jsonMessage("N", "fail.response.2fa", None)

# 2차 인증 코드 확인
# POST : 받은 코드를 확인해서 성공 여부 반환
def inputTwoFactor(request):
	if request.method == 'POST':
		return enroll2fa.check_code_2fa(request)
	else:
		jsonMessage("N", "fail.auth.2fa", None)

# 사용자 정보를 출력
# GET : 사용자 정보 전달
# POST : 사용자 정보 변경(user : {user_parameter}, avatar : {avatar_parameter})
def info(request):
	name = access_get_name(request)
	if name == None:
		return jsonMessage("N", "fail.info", None)
	user = User.objects.get(username=name)
	key = UserKey.objects.get(me=user)
	has2fa = key.auth2fa
	if has2fa == 0:
		return jsonMessage("N", "fail.nhave.2fa", None)
	if request.method == 'GET':
		try:
			user = User.objects.get(username=name)
			avatar = UserAvatar.objects.get(me=user)
			ponggame_record = UserRecordPongGame.objects.get(me=user)
			fightinggame_record = UserRecordFightingGame.objects.get(me=user)
			return jsonAvatarMessage(user, avatar, ponggame_record, fightinggame_record)
		except User.DoesNotExist:
			return jsonMessage("N", "fail.search.user", None)
	elif request.method == 'POST':
		try:
			user = User.objects.get(username=name)
			avatar = UserAvatar.objects.get(me=user)
			change_value = json.loads(request.body)
			user_val = change_user_value(user, change_value.get('user', None))
			ava_val = change_avatar_value(avatar, change_value.get('avatar', None))
			if user_val or ava_val:
				return jsonUserMessage(user, avatar)
		except User.DoesNotExist:
			return jsonMessage("N", "fail.search.user", None)
	return jsonMessage("N", "fail.user", None)

# 친구 정보를 출력
# GET : 친구 정보를 전송
# POST : mode is add(친구를 추가) or del(친구 삭제)
def friends(request):
	name = access_get_name(request)
	if name == None:
		return jsonMessage("N", "fail.get.friends", None)
	try:
		user = User.objects.get(username=name)
	except User.DoesNotExist:
		return jsonMessage("N", "fail.user.doexnotexist", None)
	key = UserKey.objects.get(me=user)
	has2fa = key.auth2fa
	if has2fa == 0:
		return jsonMessage("N", "fail.nhave.2fa", None)
	if request.method == 'GET':
		friends_dict = {}
		user_friends = user.friends.all()
		tmp_idx = 0
		for friend_relation in user_friends:
			friend = friend_relation.friends
			pong_record = friend.pongrecord.first()
			fighting_record = friend.fightingrecord.first()
			friends_dict[tmp_idx] = {
				'name' : friend.display_name,
				'connect' : friend.connect,
				'pongWin' : pong_record.win,
				'pongLose' : pong_record.lose,
				'fightingWin' : fighting_record.win,
				'fightingLose' : fighting_record.lose,
			}
			tmp_idx += 1
		if len(friends_dict) > 0:
			total = {'friendsList': friends_dict}
			return JsonResponse(total)
		else:
			return jsonMessage("Y", "fail.frineds.None", None)
	elif request.method == 'POST':
		mode = json.loads(request.body).get('mode', None)
		if mode == 'add':
			friend_name = json.loads(request.body).get('friend_name')
			try:
				friend = User.objects.get(username=friend_name)
				user_add_friend = UserRecordFriends(me=user, friends=friend)
				user_add_friend.save()
				return jsonMessage("Y", None, None)
			except User.DoesNotExist:
				return jsonMessage("N", "fail.find.friend", None)
		elif mode == 'del':
			friend_name = json.loads(request.body).get('friend_name')
			try:
				friend = User.objects.get(username=friend_name)
				user_del_friend = UserRecordFriends.objects.get(friends=friend)
				user_del_friend.delete()
				return jsonMessage("Y", None, None)
			except User.DoesNotExist:
				return jsonMessage("Y", None, None)
	else:
		return jsonMessage("N", "fail.request.method", None)

# 사용자 명단을 알려준다
# GET : 사용자 명단 전달
def userlist(request):
	name = access_get_name(request)
	if name == None:
		return jsonMessage("N", "fail.list.notUser", None)
	user = User.objects.get(username=name)
	key = UserKey.objects.get(me=user)
	has2fa = key.auth2fa
	if has2fa == 0:
		return jsonMessage("N", "fail.nhave.2fa", None)
	if request.method == 'GET':
		userList = {}
		u_list = User.objects.all()
		tmp_idx = 0
		for users in u_list:
			if users.username == name:
				continue
			userList[tmp_idx] = {
				'name' : users.display_name,
			}
			tmp_idx += 1
		total = {'userList': userList}
		return JsonResponse(total)
	else:
		return jsonMessage("N", "fail.request.method", None)

# 사용자 접속 종료
# POST : 사용자 접속 종료
def logout(request):
	name = access_get_name(request)
	if name == None:
		return jsonMessage("N", "fail.logout.notAccess", None)
	user = User.objects.get(username=name)
	key = UserKey.objects.get(me=user)
	has2fa = key.auth2fa
	if has2fa == 0:
		return jsonMessage("N", "fail.nhave.2fa", None)
	if request.method == 'POST':
		try:
			is_user = User.objects.get(username=name)
			is_user.connect = False
			is_key = UserKey.objects.get(me=is_user)
			is_key.auth42 = 0
			is_key.auth2fa = 0
			is_user.save()
			is_key.save()
			return jsonMessage("Y", None, None)
		except User.DoesNotExist:
			is_user = None
	return jsonMessage("N", "fail.logout.notUser", None)

# 사용자 정보를 영구 제거
# POST : 제거
def delete(request):
	name = access_get_name(request)
	if name == None:
		return jsonMessage("N", "fail.delete.nptAccess", None)
	user = User.objects.get(username=name)
	key = UserKey.objects.get(me=user)
	has2fa = key.auth2fa
	if has2fa == 0:
		return jsonMessage("N", "fail.nhave.2fa", None)
	if request.method == 'POST':
		try:
			is_user = User.objects.get(username=name)
			is_user.delete()
			return jsonMessage("Y", None, None)
		except User.DoesNotExist:
			is_user = None
	return jsonMessage("N", "fail.delete.notUser", None)
