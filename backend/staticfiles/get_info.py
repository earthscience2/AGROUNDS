from DB.models import UserInfo
from DB.models import PlayerInfo
from DB.models import TeamInfo
from rest_framework import serializers
def get_user_code_by_user_nickname(nickname):
    try:
        user_code = getattr(UserInfo.objects.get(user_nickname = nickname), 'user_code')
    except UserInfo.DoesNotExist:
        user_code = None
    return user_code

def get_player_info_by_user_code(usercode):
    try:
        player_info = PlayerInfo.objects.get(user_code=usercode)
    except PlayerInfo.DoesNotExist:
        raise ValueError(f"유저 코드 {usercode}에 해당하는 선수 정보가 존재하지 않습니다.")
    return player_info

# def get_team_age_by_user_code(usercode):
#     try:
#         User_info = UserInfo.objects.get(user_code=usercode)

#     except UserInfo.DoesNotExist:
#         raise ValueError(f"유저 코드 {usercode}에 해당하는 선수 정보가 존재하지 않습니다.")
#     return 
# from datetime import datetime

def calculate_age(birthdate):
    birthdate = datetime.strptime(birthdate, '%Y%m%d')

    current_date = datetime.now()

    age = current_date.year - birthdate.year - ((current_date.month, current_date.day) < (birthdate.month, birthdate.day))

    return age