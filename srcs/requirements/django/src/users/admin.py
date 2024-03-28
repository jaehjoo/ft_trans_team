from django.contrib import admin
from users.models import User, UserKey, UserAvatar

# add content to admin site
admin.site.register(User)
admin.site.register(UserKey)
admin.site.register(UserAvatar)