import json
from django.http import JsonResponse, Http404
from django.middleware.csrf import get_token
from datetime import datetime
from users.models import User, UserKey, UserAvatar, UserRecordFriends, UserRecordGame
from users import jwt, enroll42, enroll2fa
from users.utils import access_get_name
from users.changevalue import change_user_value, change_avatar_value

# jwt access 토큰이 정상/비정상 여부 확인
def auth_access(request):
	dict_access = None
	if request.method == 'GET':
		try:
			data = request.GET.get('access')
			dict_access = jwt.decode_access(data)
		except:
			return None
	elif request.method == 'POST':
		try:
			token_json = json.loads(request.body)
			dict_access = jwt.decode_access(token_json.get('access', None))
		except json.JSONDecodeError:
			return None
	else:
		return None
	if dict_access:
			date = dict_access.get('exp', None)
			if date:
				try:
					user = User.objects.get(username=dict_access.get('user', None))
				except User.DoesNotExist:
					return None
				if date > float(datetime.now()):
					user.connect = "Y"
					user.save()
					return dict_access
				else:
					user.connect = "N"
					user.save()
	return None

# jwt refresh 토큰 정상/비정상 여부 확인
def auth_refresh(request):
	if request.method == 'GET':
		try:
			data = request.GET.get('refresh')
			dict_access = jwt.decode_access(data)
		except json.JSONDecodeError:
			return None
	elif request.method == 'POST':
		try:
			token_json = json.loads(request.body)
			dict_access = jwt.decode_access(token_json.get('refresh', None))
		except json.JSONDecodeError:
			return None
	else:
		return None
	if dict_access:
			date = dict_access.get('exp', None)
			if date:
				try:
					user = User.objects.get(username=dict_access.get('user', None))
				except User.DoesNotExist:
					return None
				if date > datetime.now():
					user.connect = "Y"
					user.save()
					return dict_access
				else:
					user.connect = "N"
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
# POST : 들어온 jwt 토큰 및 42 인가 코드 확인
def login(request):
	if request.method == 'POST':
		return JsonResponse(
			{
				'success' : 'N',
				'message' : 'fail.login.nopost',
				'redirect_uri' : 'main'
			}
		)
	if auth_access(request):
		csrftoken = get_token(request)
		return JsonResponse(
			{
				'success' : 'Y',
				'message' : 'success.login.already',
				'redirect_uri' : 'main',
				'content' : {
					'csrftoken' : csrftoken
				}
			}
		)
	user = auth_42(request)
	if user:
		csrftoken = get_token(request)
		return JsonResponse(
			{
				'success' : 'Y',
				'message' : 'success.auth.42',
				'redirect_uri' : 'auth2fa',
				'content' : {
					'access' : jwt.generate_access(user),
					'refresh' : jwt.generate_refresh(user),
					'csrftoken' : csrftoken
				}
			}
		)
	return JsonResponse(
		{
			'success' : 'N',
			'meesage' : 'fail.auth.42',
			'redirect_uri' : 'login'
		}
	)

# 가장 처음 불러올 api
# GET : 로그인 여부 확인하고 답장 보냄 
def main(request):
	if request.method == 'GET':
		access = auth_access(request)
		refresh = auth_access(request)
		if access:
			return JsonResponse( 
				{
					"success" : "Y",
					"messages" : "success.login",
					"redirect_uri" : "main",
				}
			)
		elif refresh:
			user_obj = User.objects.get(username=refresh.get('name'))
			if user_obj:
				return JsonResponse(
					{
						"success" : "N",
						"message" : "fail.auth.access",
						"redirect_uri" : "main",
						"content" : {
							'access' : jwt.generate_access(user_obj)
						}
					}
				)
	return JsonResponse(
		{
			"success" : "N",
			"message" : "fail.auth.all",
			"redirect_uri" : "login"
		}
	)

# 2차 인증 시도
# POST : 토큰 값과 선택한 2차 인증을 확인하고 코드를 전송
def TwoFactor(request):
	if request.method == 'GET':
		return JsonResponse(
			{
				'success' : 'N',
				'message' : 'fail.auth.2fa',
				'redirect_uri' : 'login'
			}
		)
	content = json.loads(request.body)
	if content.get('email', None):
		if enroll2fa.send_email(request):
			return JsonResponse(
				{
					'success' : 'Y',
					'meesage' : 'success.auth.2fa',
					'redirect_uri' : 'input2fa'
				}
			)
	elif content.get('SMS', None):
		data = enroll2fa.send_sms(request)
		if data:
			return JsonResponse(
				{
					'success' : 'Y',
					'message' : 'success.auth.2fa',
					'redirect_url' : 'input2fa'
				}
			)
	elif content.get('OTP', None):
		data = enroll2fa.send_otp(request)
		if data:
			return JsonResponse(
				{
					'success' : 'Y',
					'message' : 'success.response.2fa',
					'redirect_uri' : 'input2fa'
				}
			)
	return JsonResponse(
		{
			'success' : "N",
			'message' : 'fail.response.2fa',
			'redirect uri' : 'login'
		}
	)

# 2차 인증 코드 확인
# POST : 받은 코드를 확인해서 성공 여부 반환
def inputTwoFactor(request):
	if request.method == 'POST':
		return enroll2fa.check_code_2fa(request)
	else:
		JsonResponse(
			{
				'success' : 'N',
				'message' : 'fail.auth.2fa',
				'redirect_uri' : 'auth2fa'
			}
		)

# 사용자 정보를 출력
# GET : 사용자 정보 전달
# POST : 사용자 정보 변경(user : {user_parameter}, avatar : {avatar_parameter})
def info(request):
	name = access_get_name(request)
	if name is None:
		return JsonResponse(
			{
				'success' : 'N',
				'message' : 'fail.info',
				'redirect_uri' : 'main'
			}
		)
	if request.method == 'GET':
		try:
			user = User.objects.get(name)
			avatar = UserAvatar.objects.get(me=user)
			game_record = UserRecordGame.objects.get(me=user)
			return JsonResponse(
				{
					'basic' : {
						'username' : user.username,
						'displayname' : user.display_name,
						'email' : user.email,
						'phone_number' : user.phone_number
					},
					'avatar' : {
						'hair' : avatar.hair,
						'eye' : avatar.eye,
						'lip' : avatar.lip,
						'skin_color' : avatar.skin_color,
						'medal_color' : avatar.medal_color
					},
					'game_record' : {
						'win' : game_record.win,
						'lose' : game_record.lose,
						'rating' : game_record.rating
					}
				}
			)
		except User.DoesNotExist:
			return JsonResponse(
				{
					'success' : 'N',
					'message' : 'fail.search.user',
					'redirect_uri' : 'login'
				}
			)
	elif request.method == 'POST':
		try:
			user = User.objects.get(name)
			avatar = UserAvatar.objects.get(me=user)
			change_value = json.loads(request.body)
			user_val = change_user_value(user, change_value.get('user', None))
			ava_val = change_avatar_value(avatar, change_value.get('avatar', None))
			return JsonResponse(
				{
					'user' : {
						json.dumps(user_val)
					},
					'avatar' : {
						json.dumps(ava_val)
					}
				}
			)
		except User.DoesNotExist:
			return JsonResponse(
				{
					'success' : 'N',
					'message' : 'fail.search.user',
					'redirect_uri' : 'login'				
				}
			)
	else:
		return JsonResponse(
			{
				'success' : 'N',
				'message' : 'fail.search.user',
				'redirect_uri' : 'login'				
			}
		)		

# 친구 정보를 출력
# GET : 친구 정보를 전송
# POST : mode is add(친구를 추가) or del(친구 삭제), friend_name is friend username
def friends(request):
	name = access_get_name(request)
	if name is None:
		return JsonResponse(
			{
				'success' : 'N',
				'message' : 'fail.get.friends',
				'redirect_uri' : 'login'
			}
		)
	if request.method is 'GET':
		try:
			user = User.objects.get(username=name)
		except User.DoesNotExist:
			return JsonResponse(
				{
					'success' : 'N',
					'message' : 'fail.user.dosenotexist',
					'redirect_uri' : 'login'
				}
			)
		user_friends = user.friends.all()
		for idx, friend in user_friends:
			dict[idx] = friend.name
		return JsonResponse(json.dumps(dict))
	elif request.method is 'POST':
		try:
			user = User.objects.get(username=name)
		except User.DoesNotExist:
			return JsonResponse(
				{
					'success' : 'N',
					'message' : 'fail.user.doesnotexist',
					'redirect_uri' : 'login'
				}
			)
		mode = json.loads(request.body).get('mode', None)
		if mode is 'add':
			friend_name = json.loads(request.body).get('friend_name')
			try:
				friend = User.objects.get(username=friend_name)
				user_add_friend = UserRecordFriends(me=user, friends=friend)
				user_add_friend.save()
				return JsonResponse(
					{
						'success' : 'Y',
						'message' : 'success.add.friends',
						'redirect_uri' : 'friend_list'
					}
				)
			except User.DoesNotExist:
				return JsonResponse(
					{
						'success' : 'N',
						'message' : 'fail.find.friend',
						'redirect_uri' : 'main'
					}
				)
		elif mode is 'del':
			friend_name = json.loads(request.body).get('friend_name')
			try:
				friend = User.objects.get(username=friend_name)
				user_del_friend = UserRecordFriends.objects.get(friends=friend)
				user_del_friend.delete()
				return JsonResponse(
					{
						'success' : 'Y',
						'message' : 'success.del.friends',
						'redirect_uri' : 'friend_list'
					}
				)
			except User.DoesNotExist:
				return JsonResponse(
					{
						'success' : 'Y',
						'message' : 'success.add.friends',
						'redirect_uri' : 'friend_list'
					}
				)
	else:
		return JsonResponse(
			{
				'success' : 'N',
				'message' : 'fail.request.method',
				'redirect_uri' : 'main'
			}
		)

# 사용자 명단을 알려준다
# GET : 사용자 명단 전달
def userlist(request):
	if request.method is 'GET':
		u_list = User.ogjects.all()
		for idx, user in u_list:
			dict[idx] = user.username
		return JsonResponse(json.dumps(dict))
	else:
		return JsonResponse(
			{
				'success' : 'N',
				'message' : 'fail.request.method',
				'redirect_uri' : 'main'
			}
		)