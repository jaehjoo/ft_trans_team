import string, random, json, logging
from django.http import JsonResponse
from users.jwt import decode_access

logger = logging.getLogger(__name__)

def refresh_get_exp(request):
	if request.method == 'GET':
		access = request.GET.get('refresh')
	elif request.method == 'POST':
		access = json.loads(request.body).get('refresh', None)
	else:
		access = None
	if access == None:
		return None
	payload = decode_access(access)
	name = payload.get('exp', None)
	return name

def refresh_get_name(request):
	if request.method == 'GET':
		access = request.GET.get('refresh')
	elif request.method == 'POST':
		access = json.loads(request.body).get('refresh', None)
	else:
		access = None
	if access == None:
		return None
	payload = decode_access(access)
	name = payload.get('user', None)
	return name

def access_get_exp(request):
	if request.method == 'GET':
		access = request.GET.get('access')
	elif request.method == 'POST':
		access = json.loads(request.body).get('access', None)
	else:
		access = None
	if access == None:
		return None
	payload = decode_access(access)
	name = payload.get('exp', None)
	return name

def access_get_name(request):
	if request.method == 'GET':
		access = request.GET.get('access')
	elif request.method == 'POST':
		access = json.loads(request.body).get('access', None)
	else:
		access = None
	if access == None:
		return None
	payload = decode_access(access)
	name = payload.get('user', None)
	return name

def access_token_get_name(access):
	if access == None:
		return None
	payload = decode_access(access)
	name = payload.get('user', None)
	return name

# 메달 색을 정한다.
# 0 = 동, 1 = 은, 2 = 금
def medalcolor_calculate(rating):
	if 0 <= rating < 600:
		return 0
	elif 0 <= rating < 1200:
		return 1
	else:
		return 2

def random_key(digits):
	len = digits
	ascii_str = string.ascii_letters
	res = "".join(random.choices(ascii_str,k=len))
	return res

def jsonMessage(success, message, content):
	return JsonResponse(
		{
			'success' : success,
			'message' : message,
			'content' : content,
		}
	)

def jsonAvatarMessage(user, avatar, ponggame_record, fightinggame_record):
	return JsonResponse(
				{
					'user' : {
						'displayname' : user.display_name,
						'email' : user.email,
					},
					'avatar' : {
						'hair' : avatar.hair,
						'eye' : avatar.eye,
						'lip' : avatar.lip,
						'face' : avatar.face,
						'body' : avatar.body,
					},
					'ponggame_record' : {
						'win' : ponggame_record.win,
						'lose' : ponggame_record.lose,
						'rating' : ponggame_record.rating
					},
					'fightinggame_record' : {
						'win' : fightinggame_record.win,
						'lose' : fightinggame_record.lose,
						'rating' : fightinggame_record.rating
					}
				}
			)

def jsonUserMessage(user, avatar):
	return JsonResponse(
		{
			'user' : {
				'displayname' : user.display_name,
				'email' : user.email,
			},
			'avatar' : {
				'hair' : avatar.hair,
				'eye' : avatar.eye,
				'lip' : avatar.lip,
				'face' : avatar.face,
				'body' : avatar.body,
			},
		}
	)
