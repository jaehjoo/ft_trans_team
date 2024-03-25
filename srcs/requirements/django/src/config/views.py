from django.http import JsonResponse

def pong(request):
	if request.method == "GET":
		return JsonResponse(
			{
				"ping" : "pong"
			}
		)
	else:
		return JsonResponse(
			{
				"ping" : "fail"
			}
		)