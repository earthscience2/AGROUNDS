from DB.models import UserInfo

from rest_framework import serializers
def get_user_code_by_user_nickname(nickname_list):
    user_code_list = []
    for nickname in nickname_list:
        try:
            user_code = getattr(UserInfo.objects.get(user_nickname = nickname), 'user_code')
            user_code_list.append(user_code)
        except UserInfo.DoesNotExist:
            raise serializers.ValidationError(f"유저 닉네임 {nickname}에 해당하는 사용자가 존재하지 않습니다.")
    return user_code_list



from datetime import datetime

def calculate_age(birthdate):
    birthdate = datetime.strptime(birthdate, '%Y%m%d')

    current_date = datetime.now()

    age = current_date.year - birthdate.year - ((current_date.month, current_date.day) < (birthdate.month, birthdate.day))

    return age