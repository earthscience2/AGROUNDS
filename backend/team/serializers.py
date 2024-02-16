from rest_framework import serializers
from DB.models import TeamInfo

from django.http import JsonResponse


import re


class Team_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = TeamInfo

    def create(self,validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance
    
    def validate(self, data):
        try:
            team_host = data.get('team_host')
            team_name = data.get('team_name')
            team_player = data.get('team_player', [])
            team_logo = data.get('team_logo')
            team_point = data.get('team_point')
            team_area = data.get('team_area')
            team_description = data.get('team_description')
            team_age = data.get('team_age')

            if(
                not team_host 
                or not team_name
                or not team_player
                or not team_logo
                or not team_point
                or not team_area
                or not team_description
                or not team_age
            ):
                raise serializers.ValidationError("error : 모든 필드는 필수입니다.")
            
            seen = set()
            for player in team_player:
                if player in seen:
                    raise serializers.ValidationError("team_player에 중복된 값이 있습니다.")
                seen.add(player)
            
            
        except Exception as e:  
            raise serializers.ValidationError('error : ' + str(e))
        return data