import os, json, logging
import onetimepass as otp
import qrcode
from django.core.mail import EmailMessage
from django.http import JsonResponse
from sdk.api.message import Message
from sdk.exceptions import CoolsmsException
from users.models import User, UserKey
from users.jwt import decode_access
from users.utils import random_key, access_get_name, jsonMessage

logger = logging.getLogger(__name__)

def enroll_key(name, code, what2fa, otp_secret):
    user = User.objects.get(username=name)
    key = UserKey.objects.get(me=user)
    key.auth2fa = what2fa
    key.twofactorkey = code
    if what2fa == 3:
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

def send_sms(request, value):
    name = access_get_name(request)
    try:
        user = User.objects.get(username=name)
    except User.DoesNotExist:
        return False
    if len(value) != 11:
        return False
    user.phone_number = value
    user.save()
    code = random_key(6)
    api_key = os.environ.get('COOLSMS_API_KEY')
    api_secret = os.environ.get('COOLSMS_API_SECRET')
    params = dict()
    params['type'] = 'sms'
    params['to'] = user.phone_number
    params['from'] = os.environ.get('COOLSMS_NUMBER')
    params['text'] = "transcendence code 알림 : " + code
    cool = Message(api_key, api_secret)
    cool.send(params)
    enroll_key(name, code, 2, "")
    return True

def send_email(request):
    name = access_get_name(request)
    try:
        user = User.objects.get(username=name)
    except User.DoesNotExist:
        return False
    email = user.email
    code = random_key(6)
    subject = "transcendence.kgnj.kr 2fa 코드"
    to = [email]
    from_email = "wnwoduq@naver.com"
    message = "아래 코드를 입력해주세요\n" + code
    EmailMessage(subject=subject, body=message, to=to, from_email=from_email).send()
    enroll_key(name, code, 1, "")
    return True

def send_otp(request):
    name = access_get_name(request)
    try:
        user = User.objects.get(username=name)
    except User.DoesNotExist:
        return False
    key = UserKey.objects.get(me=user)
    if key.auth2fa == 3:
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
    usr_name = access_get_name(request)
    if usr_name:
        try:
            user = User.objects.get(username=usr_name)
            key = UserKey.objects.get(me=user)
            if key.auth2fa == 3:
                result = otp.valid_totp(code, key.otp_secret)           
            elif key.auth2fa != 0:
                result = (code == key.twofactorkey)
            else:
                result = False
            key.twofactorkey = ""
            key.save()
            if result == True:
                return jsonMessage("Y", None, None)
        except User.DoesNotExist:
            return jsonMessage("N", "fail.input2fa", None)
    return jsonMessage("N", "fail.input2fa", None)