import requests, json, os
from users.models import User, UserKey, UserAvatar, UserRecordPongGame, UserRecordFightingGame

def generate_42(request):
	code = request.GET.get('code')
	uri = os.environ.get('SERVER_ADDRESS')
	uri = uri + "/shallwe"
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
			is_record_ponggame = UserRecordPongGame(me=is_user)
			is_record_ponggame.save()
			is_record_fightinggame = UserRecordFightingGame(me=is_user)
			is_record_fightinggame.save()

			# debug용
			try:
				User.objects.get(username="jjh")
			except User.DoesNotExist:
				one = User(
					username="jjh", display_name="jjh",
					email="jjh@ac.kr", phone_number="01048103778",
					connect=False
				)
				one.save()
				is_key = UserKey(me=one, auth42=True, access_42=access_token)
				is_key.save()
				is_avatar = UserAvatar(me=one)
				is_avatar.save()
				is_record_ponggame = UserRecordPongGame(me=one)
				is_record_ponggame.save()
				is_record_fightinggame = UserRecordFightingGame(me=one)
				is_record_fightinggame.save()
				two = User(
					username="knk", display_name="knk",
					email="knk@ac.kr", phone_number="01029797512",
					connect=False
				)
				two.save()
				is_key = UserKey(me=two, auth42=True, access_42=access_token)
				is_key.save()
				is_avatar = UserAvatar(me=two)
				is_avatar.save()
				is_record_ponggame = UserRecordPongGame(me=two)
				is_record_ponggame.save()
				is_record_fightinggame = UserRecordFightingGame(me=two)
				is_record_fightinggame.save()
				three = User(
					username="ccw", display_name="ccw",
					email="ccw@ac.kr", phone_number="",
					connect=False
				)
				three.save()
				is_key = UserKey(me=three, auth42=True, access_42=access_token)
				is_key.save()
				is_avatar = UserAvatar(me=three)
				is_avatar.save()
				is_record_ponggame = UserRecordPongGame(me=three)
				is_record_ponggame.save()
				is_record_fightinggame = UserRecordFightingGame(me=three)
				is_record_fightinggame.save()
			return is_user
	return None
