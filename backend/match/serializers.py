from rest_framework import serializers
from DB.models import MatchInfo
from DB.models import TeamInfo
from DB.models import UserInfo
from django.http import JsonResponse
from staticfiles.make_code import make_code

import re

class Match_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = MatchInfo
        extra_kwargs = {
            'match_code' : {'required' : False}
        }

    def create(self, validated_data):
        match_code = make_code('m')  # 먼저 match_code 생성
        validated_data['match_code'] = match_code  # validated_data에 추가
        instance = super().create(validated_data)  # 인스턴스 생성
        return instance
    
    def validate(self, data):
        match_host = data.get('match_host')
        match_home = data.get('match_home')
        match_away = data.get('match_away')
        match_home_player = data.get('match_home_player', [])
        match_away_player = data.get('match_away_player', [])
        match_home_result = data.get('match_home_result')
        match_away_result = data.get('match_away_result')
        match_starttime = data.get('match_starttime')
        match_official = data.get('match_official')
        match_type = data.get('match_type', {})
        match_goal = data.get('match_goal', {})

        required_fields = ['match_host', 'match_home', 'match_away', 'match_home_player', 'match_away_player',
                           'match_home_result', 'match_away_result', 'match_starttime', 'match_official', 'match_type']
        errors = {field: f"{field} 필드는 필수입니다." for field in required_fields if not data.get(field)}

        ## match_home과 match_away 중복확인 
        if match_home == match_away:
            raise serializers.ValidationError("match_home와 match_away가 중복되는 값입니다.")

        ## match_host와 동일한 user_code가 있는지 확인
        try:
            user_info = UserInfo.objects.get(user_code=match_host)
        except UserInfo.DoesNotExist:
            raise serializers.ValidationError(f"유저 코드 {match_host}에 해당하는 사용자가 존재하지 않습니다.")
        
        ## 각 팀에 입력되어 있는 선수들인지 확인 
        validate_team_players(match_home, match_home, match_home_player, 'team_player')
        validate_team_players(match_away, match_away, match_away_player, 'team_player')

        ##득점을 team_point에 업데이트 
        update_team_points(match_home, match_home_result)
        update_team_points(match_away, match_away_result)

        if errors:
            raise serializers.ValidationError(errors)

        
        
        
        return data


## 각 팀에 입력되어 있는 선수들인지 확인 
def validate_team_players(match_code, team_code, match_players, player_attr):
    try:
        team_info = TeamInfo.objects.get(team_code=team_code)
        team_players = set(getattr(team_info, player_attr)) if getattr(team_info, player_attr) else set()
        match_players_set = set(match_players)
        
        if not match_players_set.issubset(team_players):
            raise serializers.ValidationError(f"{match_code}의 {player_attr}가 팀의 선수 목록의 부분집합이 아닙니다.")
    except TeamInfo.DoesNotExist:
        raise serializers.ValidationError(f"팀 코드 {team_code}에 해당하는 팀이 존재하지 않습니다.")

##득점을 team_point에 업데이트 
def update_team_points(team_code, match_result):
    if match_result is not None:
        try:
            # Find the corresponding team and update team_point
            team_info = TeamInfo.objects.get(team_code=team_code)
            team_info.team_point += match_result
            team_info.save()
        except TeamInfo.DoesNotExist:
            raise serializers.ValidationError(f"팀 코드 {team_code}에 해당하는 팀이 존재하지 않습니다.")