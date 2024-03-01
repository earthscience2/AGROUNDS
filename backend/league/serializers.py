from rest_framework import serializers
from DB.models import LeagueInfo
from DB.models import UserInfo
from DB.models import TeamInfo
from django.http import JsonResponse
from staticfiles.make_code import make_code

## main page
class League_main_page(serializers.ModelSerializer):
    class Meta:
        model = LeagueInfo
        fields = '__all__'


class League_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = LeagueInfo
        extra_kwargs = {
            'league_code': {'required': False},
            'league_team': {'required': False},
            'league_official': {'required': False},
        }
    
    def create(self, validated_data):
        league_code = make_code('m')
        validated_data['league_code'] = league_code
        instance = super().create(validated_data)
        instance.save()
        return instance
    
    def validate(self, data):
        league_host = data.get('league_host')
        league_name = data.get('league_name')
        league_startdate = data.get('league_startdate')
        league_enddate = data.get('league_enddate')
        league_startjoin = data.get('league_startjoin')
        league_endjoin = data.get('league_endjoin')
        league_area = data.get('league_area')
        league_logo = data.get('league_logo')
        league_winner = data.get('league_winner')
        league_gametype = data.get('league_gametype')
        league_official = data.get('league_official')
        league_description = data.get('league_description')

        required_fields = [
            'league_host', 'league_name', 'league_startdate', 'league_enddate', 
            'league_startjoin', 'league_endjoin', 'league_area', 'league_gametype'
        ]
    
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field} is required.")

        try:
            user_info = UserInfo.objects.get(user_code=league_host)
        except UserInfo.DoesNotExist:
            raise serializers.ValidationError(f"User with user code {league_host} does not exist.")


        ## league_team입력이 null일 경우 null, 있으면 중복검사
        league_team = data.get('league_team', [])
        if league_team:
            for team_code in league_team:
                try:
                    TeamInfo.objects.get(team_code=team_code)
                except TeamInfo.DoesNotExist:
                    raise serializers.ValidationError(f"Team with team code {team_code} does not exist.")

        return data
