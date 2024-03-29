import requests, json, os
from users.models import User, UserKey, UserAvatar, UserRecordGame

def generate_42(request):
	code = request.GET.get('code')
	uri = "transcendence.kgnj.kr"
	uri = "https://" + uri + "/shallwe"
	if code:
		data = {
			'grant_type' : 'authorization_code',
			'client_id' : os.environ.get('42_CLIENT_ID'),
			'client_secret' : os.environ.get('42_CLIENT_SECRET'),
			'code' : code,
			'redirect_uri' : uri
		}
		data_42 = requests.post('https://api.intra.42.fr/oauth/token', data=data)
		try:
			access_token = data_42.json()["access_token"]
		except KeyError:
			return None
		data_user = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
		user_name = data_user.json()["login"]
		display_name = data_user.json()['displayname']
		user_email_address = data_user.json()['email']
		user_phone_number = data_user.json()['phone']
		try:
			user = User.objects.get(username=user_name)
			return user
		except User.DoesNotExist:
			is_user = User(
				username=user_name, display_name=display_name,
				email=user_email_address, phone_number=user_phone_number,
				connect=True
				)
			is_user.save()
			is_key = UserKey(me=is_user, auth42=True, access_42=access_token)
			is_key.save()
			is_avatar = UserAvatar(me=is_user)
			is_avatar.save()
			is_record_game = UserRecordGame(me=is_user)
			is_record_game.save()
			return is_user
	return None