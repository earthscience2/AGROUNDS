from DB.models import *
from rest_framework import serializers
from datetime import datetime

def get_team_code_by_team_name(team_name):
    """
    team_name을 받아 team_code를 리턴해주는 함수
    """
    try:
        v2_team_code = getattr(V2_TeamInfo.objects.get(v2_team_name = team_name), 'v2_team_code')
    except V2_TeamInfo.DoesNotExist:
        # 0이면 해당 team_name에 대한 v2_team_name이 없다. 즉, V2_TeamInfo에 해당 team_name이 없다. 
        v2_team_code = 0
    return v2_team_code

def update_team_match_code(team_code, match_code):
    """
    team_code 받아 match_code를 업데이트. 
    """
    team = V2_TeamInfo.objects.get(v2_team_code=team_code)
    if team.v2_team_match:
        team.v2_team_match.append(match_code)
    else:
        team.v2_team_match = [match_code]
    team.save()
    return team.v2_team_match
    
# def get_general_position(user_code):
#     """
#     user_code를 받아 해당 유저의 포지션(공격수/미드필더/수비수/골키퍼)를 리턴해주는 함수
#     """
#     try:
#         player_position = getattr(PlayerInfo.objects.get(user_code = user_code), 'player_position')
#         if(player_position[-1] == 'F' or player_position == 'ST'):
#             player_position = 'FW'
#         elif(player_position[-1] == 'M'):
#             player_position = 'MF'
#         elif(player_position[-1] == 'B'):
#             player_position = 'DF'
#         elif(player_position == 'GK'):
#             player_position = 'GK'
#         else:
#             player_position = '알 수 없음'
#     except PlayerInfo.DoesNotExist:
#         raise ValueError(f"유저 코드 {user_code}에 해당하는 선수 정보가 존재하지 않습니다.")
#     return player_position

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