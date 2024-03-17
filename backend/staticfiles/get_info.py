from DB.models import UserInfo
from DB.models import PlayerInfo
from DB.models import TeamInfo
from rest_framework import serializers
from datetime import datetime
def get_user_code_by_user_nickname(nickname):
    """
    user nickname을 받아 user_code를 리턴해주는 함수
    """
    try:
        user_code = getattr(UserInfo.objects.get(user_nickname = nickname), 'user_code')
    except UserInfo.DoesNotExist:
        user_code = None
    return user_code

def get_player_info_by_user_code(user_code):
    """
    user_code를 받아 player info를 리턴해주는 함수
    """
    try:
        player_info = PlayerInfo.objects.get(user_code=user_code)
    except PlayerInfo.DoesNotExist:
        raise ValueError(f"유저 코드 {user_code}에 해당하는 선수 정보가 존재하지 않습니다.")
    return player_info

def get_team_name_by_team_code(team_code):
    """
    team_code를 받아 team_name을 리턴해주는 함수
    """
    try:
        team_name = getattr(TeamInfo.objects.get(team_code = team_code), 'team_name')
    except TeamInfo.DoesNotExist:
        raise ValueError(f"팀 코드 {team_code}에 해당하는 선수 정보가 존재하지 않습니다.")
    return team_name

def get_general_position(user_code):
    """
    user_code를 받아 해당 유저의 포지션(공격수/미드필더/수비수/골키퍼)를 리턴해주는 함수
    """
    try:
        player_position = getattr(PlayerInfo.objects.get(user_code = user_code), 'player_position')
        if(player_position[-1] == 'F' or player_position == 'ST'):
            player_position = 'FW'
        elif(player_position[-1] == 'M'):
            player_position = 'MF'
        elif(player_position[-1] == 'B'):
            player_position = 'DF'
        elif(player_position == 'GK'):
            player_position = 'GK'
        else:
            player_position = '알 수 없음'
    except PlayerInfo.DoesNotExist:
        raise ValueError(f"유저 코드 {user_code}에 해당하는 선수 정보가 존재하지 않습니다.")
    return player_position

# def get_team_age_by_user_code(usercode):
#     try:
#         User_info = UserInfo.objects.get(user_code=usercode)

#     except UserInfo.DoesNotExist:
#         raise ValueError(f"유저 코드 {usercode}에 해당하는 선수 정보가 존재하지 않습니다.")
#     return 
# from datetime import datetime

def calculate_age(birthday):
    """
    birthday(yyyy-mm-dd)를 받아 나이를 계산해주는 함수
    """
    birthday = datetime.strptime(birthday, '%Y-%m-%d')

    current_date = datetime.now()

    age = current_date.year - birthday.year - ((current_date.month, current_date.day) < (birthday.month, birthday.day))

    return age