from rest_framework import serializers
from DB.models import LeagueInfo

from django.http import JsonResponse


import re

class League_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = LeagueInfo
        extra_kwargs = {
            'league_code' : {'default' : 321}
        }
    def create(self, validated_data):
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


        
        return data