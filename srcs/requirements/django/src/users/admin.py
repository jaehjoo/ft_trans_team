from django.contrib import admin
from users.models import User

# add content to admin site
admin.site.register(User)