import requests, base64, hashlib, json, os
from django.core import serializers
from django.http import JsonResponse
from datetime import datetime
from users.models import User
from users import jwt
from users import enroll42

def auth_access(request):
	try:
		token_json = json.loads(request.body)
	except json.JSONDecodeError:
		return None
	token = token_json.get('access', None)
	if token:
		payload = jwt.decode_access(token)
		date = payload.get('exp', None)
		if date:
			user = User.objects.get(username=payload.get('user', None))
			if date > datetime.now():
				user.connect = "Y"
				user.save()
				return payload
			else:
				user.connect = "N"
				user.save()
	return None

def auth_refresh(request):
	try:
		token_json = json.loads(request.body)
	except json.JSONDecodeError:
		return None
	token = token_json.get('refresh', None)
	if token:
		payload = jwt.decode_refresh(token)
		date = payload.get('exp', None)
		if date:
			if date > datetime.now():
				return payload
	return None

# GET : 42 인증 요청
# POST : invalid
def auth_42(request):
	if request.method == 'GET':
		return enroll42.generate_42(request)
	return None

# def auth_2fa(request):


def login(request):
	if auth_access(request):
		return JsonResponse(
			{
				'success' : 'Y',
				'message' : 'success.login.already',
				'redirect_uri' : 'index'
			}
		)
	user = auth_42(request)
	if user:
		return JsonResponse(
			{
				'success' : 'Y',
				'message' : 'success.auth.42',
				'redirect_uri' : 'auth2fa',
				'context' : {
					'access' : jwt.generate_access(user),
					'refresh' : jwt.generate_refresh(user)
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

def index(request):
	access = auth_access(request)
	refresh = auth_refresh(request)
	if access:
		return JsonResponse( 
			{
				"success" : "Y",
				"messages" : "success.login",
				"redirect_uri" : "profile"
			}
		)
	elif refresh:
		user_obj = User.objects.get(username=refresh.get('name'))
		if user_obj:
			return JsonResponse(
				{
					"success" : "N",
					"message" : "fail.auth.access",
					"redirect_uri" : "index",
					"content" : {
						'access' : jwt.generate_access(user_obj)
					}
				}
			)
	else:
		return JsonResponse(
			{
				"success" : "N",
				"message" : "fail.auth.all",
				"redirect_uri" : "login"
			} 
		)