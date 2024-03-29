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

def random_key(digits):
	len = digits
	ascii_str = string.ascii_letters
	res = "".join(random.choices(ascii_str,k=len))
	return res