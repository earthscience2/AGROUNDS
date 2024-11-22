from rest_framework import serializers
from DB.models import *

class User_main_page(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = '__all__'


class UserMatchInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMatchInfo
        fields = ['match_code', 'match_name', 'match_schedule', 'match_quarter_info', 'gps_url']


class TeamMatchInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMatchInfo
        fields = ['match_code', 'match_name', 'match_schedule', 'match_quarter_info', 'gps_url', 'match_team_code']


class UserMatchSerializer(serializers.ModelSerializer):
    # `player_or_team` 필드는 `UserMatch`에만 존재하므로, `UserMatch` 모델을 사용해야 합니다.
    user_match_info = serializers.SerializerMethodField()
    team_match_info = serializers.SerializerMethodField()

    class Meta:
        model = UserMatch  # 올바른 모델로 수정
        fields = ['match_code', 'player_or_team', 'user_match_info', 'team_match_info']

    def get_user_match_info(self, obj):
        # `player`일 경우 `UserMatchInfo` 데이터 직렬화
        if obj.player_or_team == 'player':
            match_info = UserMatchInfo.objects.filter(match_code=obj.match_code).first()
            if match_info:
                return {
                    "match_code": match_info.match_code,
                    "match_name": match_info.match_name,
                    "match_schedule": match_info.match_schedule,
                    "match_quarter_info": match_info.match_quarter_info,
                    "gps_url": match_info.gps_url,
                }
        return None

    def get_team_match_info(self, obj):
        # `team`일 경우 `TeamMatchInfo` 데이터 직렬화
        if obj.player_or_team == 'team':
            match_info = TeamMatchInfo.objects.filter(match_code=obj.match_code).first()
            if match_info:
                return {
                    "match_code": match_info.match_code,
                    "match_name": match_info.match_name,
                    "match_schedule": match_info.match_schedule,
                    "match_quarter_info": match_info.match_quarter_info,
                    "gps_url": match_info.gps_url,
                    "match_team_code": match_info.match_team_code,
                }
        return None