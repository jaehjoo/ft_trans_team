from django.urls import path
from users import views

urlpatterns = [
	path('index', views.index, name='index'),
	path('login', views.login, name='login'),
	path('auth42', views.login, name='auth42')
	# path('auth2fa', views.auth_2fa, name='auth2fa')
]