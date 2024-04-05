import string, random, json
from users.jwt import decode_access

def access_get_name(request):
	if request.method == 'GET':
		access = request.GET.get('access')
	elif request.method == 'POST':
		access = json.loads(request.body).get('access', None)
	else:
		access = None
	if access is None:
		return None
	payload = decode_access(access)
	name = payload.get('user', None)
	return name

# 메달 색을 정한다.
# 0 = 동, 1 = 은, 2 = 금
def medalcolor_calculate(rating):
	if 0 <= rating < 600:
		return 0
	elif 0 <= rating < 1200:
		return 1
	else:
		return 2

def random_key(digits):
	len = digits
	ascii_str = string.ascii_letters
	res = "".join(random.choices(ascii_str,k=len))
	return res