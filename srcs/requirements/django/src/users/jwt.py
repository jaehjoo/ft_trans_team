import json, base64, hashlib, hmac, os
from datetime import datetime, timedelta

def generate_refresh(user_obj):
	name = user_obj.username
	payload = {
		'user' : name,
		'exp' : datetime.timestamp(datetime.now() + timedelta(days=15))
	}

	encode_payload = base64.urlsafe_b64encode(json.dumps(payload).encode('utf-8'))
	secret_key = os.environ.get("REFRESH_SECRET")
	signature = hmac.new(secret_key.encode('utf-8'), encode_payload, hashlib.sha256).digest()
	encode_signature = base64.urlsafe_b64encode(signature)

	refresh = f"{encode_payload.decode('utf-8')}.{encode_signature.decode('utf-8')}"

	return refresh

def decode_refresh(refresh):
	array = refresh.split('.')

	decode_payload = json.loads(base64.urlsafe_b64decode(array[0].encode('utf-8')).decode('utf-8'))
	secret_key = os.environ.get("REFRESH_SECRET")
	make_signature = base64.urlsafe_b64encode(hmac.new(secret_key.encode('utf-8'), array[0].encode('utf-8'), hashlib.sha256).digest())
	if make_signature.decode('utf-8') == array[1]:
		return decode_payload
	else:
		return {
			'error': 'Invalid token signature'
		}

def generate_access(user_obj):
	name = user_obj.username
	payload = {
		'user' : name,
		'exp' : datetime.timestamp(datetime.now() + timedelta(days=1))
	}

	encode_payload = base64.urlsafe_b64encode(json.dumps(payload).encode('utf-8'))
	secret_key = os.environ.get("ACCESS_SECRET")
	signature = hmac.new(secret_key.encode('utf-8'), encode_payload, hashlib.sha256).digest()
	encode_signature = base64.urlsafe_b64encode(signature)

	access = f"{encode_payload.decode('utf-8')}.{encode_signature.decode('utf-8')}"

	return access

def decode_access(access):
	if access is None:
		return {
			'error': 'token dose not exist'
		}
	array = access.split('.')

	decode_payload = json.loads(base64.urlsafe_b64decode(array[0].encode('utf-8')).decode('utf-8'))
	secret_key = os.environ.get("ACCESS_SECRET")
	make_signature = base64.urlsafe_b64encode(hmac.new(secret_key.encode('utf-8'), array[0].encode('utf-8'), hashlib.sha256).digest())
	if make_signature.decode('utf-8') == array[1]:
		return decode_payload
	else:
		return {
			'error': 'Invalid token signature'
		}

