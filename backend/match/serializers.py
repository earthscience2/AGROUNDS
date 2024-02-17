from rest_framework import serializers
from DB.models import MatchInfo

from django.http import JsonResponse


import re

class Match_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = MatchInfo
        extra_kwargs = {
            'match_code' : {'default' : 3622}
        }
    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.save()
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

        if errors:
            raise serializers.ValidationError(errors)

        
        return data