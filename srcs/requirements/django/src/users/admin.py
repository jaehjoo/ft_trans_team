from django.contrib import admin
from users.models import User, UserKey, UserAvatar, UserRecordPongGame, UserRecordFightingGame, UserRecordFriends

# add content to admin site
admin.site.register(User)
admin.site.register(UserKey)
admin.site.register(UserAvatar)
admin.site.register(UserRecordPongGame)
admin.site.register(UserRecordFightingGame)
admin.site.register(UserRecordFriends)