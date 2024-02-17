from rest_framework import serializers
from DB.models import LeagueInfo

from django.http import JsonResponse


import re

class League_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = LeagueInfo
        extra_kwargs = {
            'league_code' : {'default' : 1}
        }
    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.save()
        return instance
    
    def validate(self, data):
        leageu_host = data.get('leageu_host')
        leageu_name = data.get('leageu_name')
        leageu_startdate = data.get('leageu_startdate')
        leageu_enddate = data.get('leageu_enddate')
        leageu_startjoin = data.get('leageu_startjoin')
        leageu_endjoin = data.get('leageu_endjoin')
        leageu_team = data.get('leageu_team',[])
        leageu_area = data.get('leageu_area')
        leageu_logo = data.get('leageu_logo')
        leageu_winner = data.get('leageu_winner')
        leage_gametype = data.get('leage_gametype')
        league_official = data.get('league_official')
        league_description = data.get('league_description')


        
        return data