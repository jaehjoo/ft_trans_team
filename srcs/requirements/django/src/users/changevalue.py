from users.models import User, UserKey, UserAvatar

def change_user_value(user, user_value):
	if user_value is None:
		return False
	displayname = user_value.get('display_name', None)
	email = user_value.get('email', None)
	phone_number = user_value.get('phone_number', None)
	if displayname:
		user.display_name = displayname
		dict['display_name'] = displayname
	if email:
		user.email = email
		dict['email'] = email
	if phone_number:
		user.phone_number = phone_number
		dict['phone_number'] = phone_number
	user.save()
	return True

def change_avatar_value(avatar, avatar_value):
	if avatar_value is None:
		return False
	hair = avatar_value.get('hair', None)
	eye = avatar_value.get('eye', None)
	lip = avatar_value.get('lip', None)
	skin_color = avatar_value.get('skin_color', None)
	medal_color = avatar_value.get('medal_color', None)
	if hair:
		avatar.hair = hair
		dict['hair'] = hair
	if eye:
		avatar.eye = eye
		dict['eye'] = eye
	if lip:
		avatar.lip = lip
		dict['lip'] = lip
	if skin_color:
		avatar.skin_color = skin_color
		dict['skin_color'] = skin_color
	if medal_color:
		avatar.medal_color = medal_color
		dict['medal_color'] = medal_color
	avatar.save()
	return dict