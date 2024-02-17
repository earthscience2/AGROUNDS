from rest_framework import serializers
from DB.models import TeamInfo

from django.http import JsonResponse


import re

class Team_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = TeamInfo
        extra_kwargs = {
            'team_code' : {'default' : 321123}
        }
    def create(self, validated_data):
        instance = super().create(validated_data)


        instance.save()
        return instance
    
    def validate(self, data):
        # Not Null 처리 
        required_fields = ['team_host', 'team_name', 'team_player', 'team_area']
        errors = {field: f"팀 {field}는 필수 항목입니다." for field in required_fields if not data.get(field)}

        if errors:
            raise serializers.ValidationError(errors)

        team_player = data.get('team_player', []) # 배열로 받음 
        team_logo = data.get('team_logo')
        team_description = data.get('team_description')

        # team_player 중복 확인
        seen = set()
        for player in team_player:
            if player in seen:
                raise serializers.ValidationError("error : team_player에 중복된 값이 있습니다.")
            seen.add(player)
        
        return data