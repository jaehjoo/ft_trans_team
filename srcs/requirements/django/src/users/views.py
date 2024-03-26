import requests, base64, hashlib, json, os
from django.http import JsonResponse
from django.middleware.csrf import get_token
from datetime import datetime
from users.models import User
from users import jwt
from users import enroll42
from users import enroll2fa

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
				user = User.objects.get(username=dict_access.get('user', None))
				if date > datetime.now():
					user.connect = "Y"
					user.save()
					return dict_access
				else:
					user.connect = "N"
					user.save()
	return None

def auth_refresh(request):
	if request.method == 'GET':
		try:
			data = request.GET.get('refresh')
			dict_access = jwt.decode_access(data)
		except:
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
				user = User.objects.get(username=dict_access.get('user', None))
				if date > datetime.now():
					user.connect = "Y"
					user.save()
					return dict_access
				else:
					user.connect = "N"
					user.save()
	return None

# GET : 42 인증 요청
# POST : invalid
def auth_42(request):
	if request.method == 'GET':
		return enroll42.generate_42(request)
	return None


def login(request):
	if request.method == 'POST':
		return JsonResponse(
			{
				'success' : 'N',
				'message' : 'fail.login.nopost',
				'redirect_uri' : 'index'
			}
		)
	csrftoken = get_token(request)
	if auth_access(request):
		return JsonResponse(
			{
				'success' : 'Y',
				'message' : 'success.login.already',
				'redirect_uri' : 'index',
				'csrftoken' : csrftoken
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

def main(request):
	if request.method == 'GET':
		access = auth_access(request)
		refresh = auth_access(request)
		if access:
			return JsonResponse( 
				{
					"success" : "Y",
					"messages" : "success.login",
					"redirect_uri" : "profile",
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
						'access' : jwt.generate_access(user_obj),
					}
				)
	return JsonResponse(
		{
			"success" : "N",
			"message" : "fail.auth.all",
			"redirect_uri" : "login"
		}
	)
	
def TwoFactor(request):
	if request.GET.get('email'):
		if enroll2fa.send_email(request):
			return JsonResponse(
				{
					'success' : 'Y',
					'meesage' : 'success.auth.2fa',
					'redirect_uri' : 'index'
				}
			)
	elif request.GET.get('OTP'):
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