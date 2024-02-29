from DB.models import UserInfo


def get_user_code_by_user_nickname(self, nickname):
    return getattr(UserInfo.objects.get(user_nickname = nickname), 'user_code')


from datetime import datetime

def calculate_age(birthdate):
    birthdate = datetime.strptime(birthdate, '%Y%m%d')

    current_date = datetime.now()

    age = current_date.year - birthdate.year - ((current_date.month, current_date.day) < (birthdate.month, birthdate.day))

    return age