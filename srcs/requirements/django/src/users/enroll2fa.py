import os, json
import onetimepass as otp
import qrcode
from django.core.mail import EmailMessage
from django.http import JsonResponse
from sdk.api.message import Message
from sdk.exceptions import CoolsmsException
from users.models import User, UserKey
from users.jwt import decode_access
from users.utils import random_key, access_get_name

def enroll_key(name, code, what2fa):
    user = User.objects.get(username=name)
    key = UserKey.objects.get(me=user)
    key.auth2fa = what2fa
    key.twofactorkey = code
    key.save()

def enroll_key(name, code, what2fa, otp_secret):
    user = User.objects.get(username=name)
    key = UserKey.objects.get(me=user)
    key.auth2fa = what2fa
    key.twofactorkey = code
    key.otp_secret = otp_secret
    key.save()

def make_otp_qrcode(key):
    prefix = "otpauth://"
    type = "totp/"
    label = "transcendence:" + "wnwoduq@naver.com"
    secret = "secret=" + key
    issuer = "issuer=" + "transcendecne"
    digits = "6"
    return prefix + type + label + "?" + secret + "&" + issuer + "&" + digits

def send_sms(request):
    name = access_get_name(request)
    try:
        user = User.objects.get(username=name)
    except User.DoesNotExist:
        return False
    key = UserKey.objects.get(me=user)
    code = random_key(6)
    api_key = os.environ.get('COOLSMS_API_KEY')
    api_secret = os.environ.get('COOLSMS_API_SECRET')
    params = dict()
    params['type'] = 'sms'
    params['to'] = '01029797512'
    params['from'] = '01048103778'
    params['text'] = '18234234'
    cool = Message(api_key, api_secret)
    response = cool.send(params)
    enroll_key(name, code, 2)
    return True

def send_email(request):
    name = access_get_name(request)
    try:
        user = User.objects.get(username=name)
    except User.DoesNotExist:
        return False
    email = user.email
    code = random_key(6)
    subject = "transcendence.kgnj.kr 2fa 코드"							# 타이틀
    to = [email]					# 수신할 이메일 주소
    from_email = "wnwoduq@naver.com"			# 발신할 이메일 주소
    message = "아래 코드를 입력해주세요\n" + code					# 본문 내용
    EmailMessage(subject=subject, body=message, to=to, from_email=from_email).send()
    enroll_key(name, code, 1)
    return True

def send_otp(request):
    name = access_get_name(request)
    try:
        user = User.objects.get(username=name)
    except User.DoesNotExist:
        return False
    key = UserKey.objects.get(me=user)
    if key.auth2fa is 3:
        secret_key = key.otp_secret
    else:
        secret_key = random_key(32)
    code = otp.get_totp(secret_key)
    result = otp.valid_totp(code, secret_key)
    if result:
        img = qrcode.make(make_otp_qrcode(secret_key))
        img.save("/app/src/django/.media/qr.jpg")
        enroll_key(name, code, 3, secret_key)
        return True
    return False

def check_code_2fa(request):
    code = json.loads(request.body).get('code', None)
    payload = decode_access(json.loads(request.body).get('access', None))
    usr_name = payload.get('user', None)
    if usr_name:
        try:
            user = User.objects.get(username=usr_name)
            key = UserKey.objects.get(me=user)
            if key.auth2fa is 3:
                result = otp.valid_totp(code, key.otp_secret)           
            elif key.auth2fa is not 0:
                result = code is key.twofactorkey
            else:
                result = False
            key.twofactorkey = ""
            key.save()
            if result:
                return JsonResponse(
                    {
                        'success' : 'Y',
                        'messsage' : 'success.input2fa',
                        'redirct_uri' : 'main'
                    }
                )                
        except User.DoesNotExist:
            return JsonResponse(
                {
                    'success' : 'N',
                    'messsage' : 'fail.input2fa',
                    'redirect_uri' : 'login'
                }
            )
    return JsonResponse(
        {
            'success' : 'N',
            'messsage' : 'fail.input2fa',
            'redirect_uri' : 'login'
        }
    )
