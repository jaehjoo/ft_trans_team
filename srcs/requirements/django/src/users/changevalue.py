from users.models import User, UserKey, UserAvatar
import logging

logger = logging.getLogger(__name__)

def change_user_value(user, user_value):
	if user_value is None:
		return False
	displayname = user_value.get('displayname', None)
	email = user_value.get('email', None)
	phone_number = user_value.get('phone_number', None)
	if displayname:
		user.display_name = displayname
	if email:
		user.email = email
	if phone_number:
		user.phone_number = phone_number
	user.save()
	return True

def change_avatar_value(avatar, avatar_value):
	if avatar_value is None:
		return False
	hair = avatar_value.get('hair', None)
	eye = avatar_value.get('eye', None)
	lip = avatar_value.get('lip', None)
	face = avatar_value.get('face', None)
	body = avatar_value.get('body', None)
	pongmedal_color = avatar_value.get('pongmedal_color', None)
	fightingmedal_color = avatar_value.get('fighting_color', None)
	if hair:
		avatar.hair = hair
	if eye:
		avatar.eye = eye
	if lip:
		avatar.lip = lip
	if face:
		avatar.face = face
	if body:
		avatar.body = body
	if pongmedal_color:
		avatar.pongmedal_color = pongmedal_color
	if fightingmedal_color:
		avatar.fightingmedal_color = fightingmedal_color
	avatar.save()
	return True
