from rest_framework import serializers
from DB.models import TeamInfo

from django.http import JsonResponse


import re

class Team_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = TeamInfo
        extra_kwargs = {
            'team_code' : {'default' : 24}
        }
    def create(self, validated_data):
        instance = super().create(validated_data)

        instance.team_age = 0  # default값
        instance.team_point = 0  # default값 
        instance.save()
        return instance
    
    def validate(self, data):
        team_player = data.get('team_player', [])  # user_code
        
        if not team_player:
            raise serializers.ValidationError("error : team_player는 필수입니다.")
        
        # team_player 중복 확인
        seen = set()
        for player in team_player:
            if player in seen:
                raise serializers.ValidationError("error : team_player에 중복된 값이 있습니다.")
            seen.add(player)
        
        return data