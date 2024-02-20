from rest_framework import serializers
from DB.models import LeagueInfo
from DB.models import UserInfo
from DB.models import TeamInfo
from django.http import JsonResponse
from staticfiles.make_code import make_code

import re

class League_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = LeagueInfo
        extra_kwargs = {
            'league_code' : {'required' : False}
	    }
    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.league_code = make_code('l')
        instance.save()
        return instance
    
    def validate(self, data):
        league_host = data.get('league_host')
        league_name = data.get('league_name')
        league_startdate = data.get('league_startdate')
        league_enddate = data.get('league_enddate')
        league_startjoin = data.get('league_startjoin')
        league_endjoin = data.get('league_endjoin')
        league_team = data.get('league_team', [])
        league_area = data.get('league_area')
        league_logo = data.get('league_logo')
        league_winner = data.get('league_winner')
        league_gametype = data.get('league_gametype')
        league_official = data.get('league_official')
        league_description = data.get('league_description')

        required_fields = [
        'league_host', 'league_name', 'league_startdate', 'league_enddate', 
        'league_startjoin', 'league_endjoin', 'league_gametype', 'league_official'
        ]
    
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field} is required.")

        ## league_host가 존재하는 user_code인지 확인
        try:
            user_info = UserInfo.objects.get(user_code=league_host)
        except UserInfo.DoesNotExist:
            raise serializers.ValidationError(f"User with user code {league_host} does not exist.")

        ## lague_team리스트에 있는 팀들이 실제로 Teaminfo 테이블에 있는 정식으로 등록된 팀인지 확인
        for team_code in league_team:
            try:
                TeamInfo.objects.get(team_code=team_code)
            except TeamInfo.DoesNotExist:
                raise serializers.ValidationError(f"Team with team code {team_code} does not exist.")

        return data