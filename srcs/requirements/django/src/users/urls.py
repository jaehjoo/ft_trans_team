from django.urls import path
from users import views

urlpatterns = [
	path('main', views.main, name='main'),
	path('login', views.login, name='login'),
	path('auth42', views.login, name='auth42'),
	path('auth2fa', views.TwoFactor, name='auth2fa'),
	path('input2fa', views.inputTwoFactor, name='input2fa')
]