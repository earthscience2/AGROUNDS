from rest_framework import serializers
from DB.models import MatchInfo
from DB.models import TeamInfo
from DB.models import UserInfo
from DB.models import PlayerInfo
from django.http import JsonResponse
from staticfiles.make_code import make_code
from staticfiles.get_info import get_team_name_by_team_code
from staticfiles.get_info import get_general_position

import re

# 경기 정보 불러오기
class Match_main_page(serializers.ModelSerializer):
    class Meta:
        model = MatchInfo
        fields = '__all__'

# 매치 처음에 설정에서 입력
class Before_Match_info_Serializer(serializers.ModelSerializer):
    class Meta:
        model = MatchInfo
        fields = ['match_host', 'match_home', 'match_away', 'match_starttime', 'match_official', 'match_type']
        extra_kwargs = {
            'match_code': {'required': False}  # 필수 필드가 아니므로 False로 설정
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
        match_starttime = data.get('match_starttime')
        match_official = data.get('match_official')
        match_type = data.get('match_type', {})

        required_fields = ['match_host', 'match_home', 'match_away',
                            'match_starttime', 'match_official', 'match_type']
        errors = {field: f"{field} 필드는 필수입니다." for field in required_fields if not data.get(field)}

        ## match_home과 match_away 중복확인 
        if match_home == match_away:
            raise serializers.ValidationError("match_home와 match_away가 중복되는 값입니다.")

        ## match_host와 동일한 user_code가 있는지 확인
        try:
            user_info = UserInfo.objects.get(user_code=match_host)
        except UserInfo.DoesNotExist:
            raise serializers.ValidationError(f"유저 코드 {match_host}에 해당하는 사용자가 존재하지 않습니다.")
        

        return data

# 매치가 끝난 뒤 입력
class After_Match_info_Serializer(serializers.ModelSerializer):
    
    class Meta:
        model = MatchInfo
        fields = ['match_code', 'match_home_player', 'match_away_player', 'match_home_result', 'match_away_result','match_total_result', 'match_goal']
        extra_kwargs = {
            'match_home': {'read_only': True},
            'match_away': {'read_only': True},
            'match_starttime': {'read_only': True},
            'match_official': {'read_only': True},
            'match_type': {'read_only': True}
        }

    def update(self, instance, validated_data):
        instance.match_home_player = validated_data.get('match_home_player', instance.match_home_player)
        instance.match_away_player = validated_data.get('match_away_player', instance.match_away_player)
        instance.match_home_result = validated_data.get('match_home_result', instance.match_home_result)
        instance.match_away_result = validated_data.get('match_away_result', instance.match_away_result)
        instance.match_goal = validated_data.get('match_goal', instance.match_goal)
        instance.match_total_result = validated_data.get('match_total_result',instance.match_total_result)
        instance.save()
        return instance

    def validate(self, data):
        match_code = data.get('match_code')
        before_match_info = MatchInfo.objects.filter(match_code=match_code)
        
        if not before_match_info.exists():
            raise serializers.ValidationError("이전 매치 정보를 찾을 수 없습니다.")

        before_match_info = before_match_info.last()

        if before_match_info.match_code != match_code:
            raise serializers.ValidationError("주어진 match_host에 해당하는 매치 정보를 찾을 수 없습니다.")

        # 이전 매치 정보의 데이터를 현재 요청의 데이터와 결합합니다.
        data['match_home'] = before_match_info.match_home
        data['match_away'] = before_match_info.match_away
        data['match_starttime'] = before_match_info.match_starttime
        data['match_official'] = before_match_info.match_official
        data['match_type'] = before_match_info.match_type

        match_home_player = data.get('match_home_player')
        match_away_player = data.get('match_away_player')
        match_home_result = data.get('match_home_result')
        match_away_result = data.get('match_away_result')
        match_total_result = data.get('match_total_result')

        # 필수 필드를 확인하고 부족한 경우 오류를 발생시킵니다.
        required_fields = ['match_home_player', 'match_away_player', 'match_home_result',
                            'match_away_result','match_total_result', 'match_goal']
        errors = {field: f"{field} 필드는 필수입니다." for field in required_fields if not data.get(field)}


        # 각 팀에 입력된 선수들이 팀의 선수 목록에 포함되어 있는지 확인합니다.
        validate_team_players(data['match_home'], data['match_home'], match_home_player, 'team_player')
        validate_team_players(data['match_away'], data['match_away'], match_away_player, 'team_player')

        # 팀의 점수를 업데이트합니다.
        update_team_points(data['match_home'], match_home_result)
        update_team_points(data['match_away'], match_away_result)
        
        # 각 팀의 gaems수 증가
        update_team_games(data['match_home'],match_code)
        update_team_games(data['match_away'],match_code)

        # TeamInfo.objects.get(team_code=data['match_home']).append("sx")
        # TeamInfo.objects.get(team_code=data['match_away']).append("sx")

        # # 오류가 있는 경우 예외를 발생시킵니다.
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

# team_games 필드 업데이트 
def update_team_games(team_code,match_code):
    try:
            # Find the corresponding team and update team_point
        team_info = TeamInfo.objects.get(team_code=team_code)
        team_info.team_games.append(match_code)
        team_info.save()
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


# 경기 상세 정보 API  
class PlayerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerInfo
        fields = '__all__'

class Match_More_info(serializers.ModelSerializer):
    class Meta:
        model = MatchInfo
        fields = '__all__'

    home_team_code = ''
    # custom_field
    home_team_name = serializers.SerializerMethodField('get_home_team_name')
    home_team_FW = serializers.SerializerMethodField('get_home_team_FW')
    home_team_MF = serializers.SerializerMethodField('get_home_team_MF')
    home_team_DF = serializers.SerializerMethodField('get_home_team_DF')
    home_team_GK = serializers.SerializerMethodField('get_home_team_GK')
    home_team_scorer = serializers.SerializerMethodField('get_home_team_scorer')

    away_team_name = serializers.SerializerMethodField('get_away_team_name')
    away_team_FW = serializers.SerializerMethodField('get_away_team_FW')
    away_team_MF = serializers.SerializerMethodField('get_away_team_MF')
    away_team_DF = serializers.SerializerMethodField('get_away_team_DF')
    away_team_GK = serializers.SerializerMethodField('get_away_team_GK')
    away_team_scorer = serializers.SerializerMethodField('get_away_team_scorer')

    # functions

    def get_team_name(self, team_code):
        return get_team_name_by_team_code(team_code=team_code)
    
    def get_team_lineup(self, user_codes, position):
        player_list = []
        for user_code in user_codes:
            if(get_general_position(user_code=user_code) == position):
                player_list.append(user_code)
        return player_list
    
    # interfaces

    # home team

    def get_home_team_name(self, obj):
        return self.get_team_name(team_code=obj.match_home)
    
    def get_home_team_FW(self, obj):
       return self.get_team_lineup(user_codes = obj.match_home_player, position = 'FW')
    
    def get_home_team_MF(self, obj):
       return self.get_team_lineup(user_codes = obj.match_home_player, position = 'MF')
    
    def get_home_team_DF(self, obj):
       return self.get_team_lineup(user_codes = obj.match_home_player, position = 'DF')
    
    def get_home_team_GK(self, obj):
       return self.get_team_lineup(user_codes = obj.match_home_player, position = 'GK')
    
    # away team

    def get_away_team_name(self, obj):
        return self.get_team_name(team_code=obj.match_away)
    
    def get_away_team_FW(self, obj):
       return self.get_team_lineup(user_codes = obj.match_away_player, position = 'FW')
    
    def get_away_team_MF(self, obj):
       return self.get_team_lineup(user_codes = obj.match_away_player, position = 'MF')
    
    def get_away_team_DF(self, obj):
       return self.get_team_lineup(user_codes = obj.match_away_player, position = 'DF')
    
    def get_away_team_GK(self, obj):
       return self.get_team_lineup(user_codes = obj.match_away_player, position = 'GK')
    
    def get_home_team_scorer(self, obj):
        team_code = obj.match_home
        match_goal = obj.match_goal
        home_team_scorer = []
        for each_score in match_goal:
            if(each_score['team'] == team_code):
                home_team_scorer.append(each_score['goal'])
        return home_team_scorer
    
    def get_away_team_scorer(self, obj):
        team_code = obj.match_away
        match_goal = obj.match_goal
        away_team_scorer = []
        for each_score in match_goal:
            if(each_score['team'] == team_code):
                away_team_scorer.append(each_score['goal'])
        return away_team_scorer
        