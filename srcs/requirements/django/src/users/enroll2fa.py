import os
import onetimepass as otp
import qrcode
from django.core.mail import EmailMessage
from django.http import JsonResponse
from users.models import User
from users.jwt import decode_access

def enroll_key(request, key):
    jwt_access = request.POST.get('access')
    payload = decode_access(jwt_access)
    name = payload.get('user')
    user = User.objects.get(username=name)
    user.twofactor_key = key


def send_email(request):
    code = "123456"
    subject = "transcendence.kgnj.kr 코드 알림"							# 타이틀
    to = ["united94@naver.com"]					# 수신할 이메일 주소
    from_email = "wnwoduq@naver.com"			# 발신할 이메일 주소
    message = "코드 알림입니다\n" + code					# 본문 내용
    EmailMessage(subject=subject, body=message, to=to, from_email=from_email).send()
    enroll_key(request, code)
    return True

def get_code_otp(request):
    secret_key = os.environ.get('OTP_SECRET_KEY')
    code = otp.get_totp(secret_key)
    return code

def valid_code_otp(request):
     secret_key = os.environ.get('OTP_SECRET_KEY')   

def send_otp(request):
    secret_key = os.environ.get('OTP_SECRET_KEY')
    code = otp.get_totp(secret_key)
    result = otp.valid_totp(code, secret_key)
    if result:
        img = qrcode.make(code)
        img.save("qr.img")
        enroll_key(request, code)
        return True
    return False

def check_code_2fa(request):
    key = request.POST.get('key')
    user = User.objects.get(twofactor_key=key)
    if user:
        user.twofactor_key = ''
        return JsonResponse(
            {
                'success' : 'Y',
                'messsage' : 'success.input2fa',
                'redirct_uri' : 'main'
            }
        )
    return JsonResponse(
        {
            'success' : 'N',
            'messsage' : 'fail.input2fa',
            'redirect_uri' : 'login'
        }
    )
