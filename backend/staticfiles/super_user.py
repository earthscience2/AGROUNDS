from django.conf import settings

def is_super_user(user_code):
    return user_code in settings.SUPERUSER_CODES