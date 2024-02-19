from rest_framework import serializers
from DB.models import TeamInfo
from DB.models import UserInfo
from django.http import JsonResponse
import datetime

import re

class Team_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = TeamInfo
        extra_kwargs = {
            'team_code': {'default': 2}
        }

    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.save()
        return instance
    
    def validate(self, data):
        required_fields = ['team_host', 'team_name', 'team_player', 'team_area']
        errors = {field: f"팀 {field}는 필수 항목입니다." for field in required_fields if not data.get(field)}

        if errors:
            raise serializers.ValidationError(errors)

        team_player = data.get('team_player', [])
        team_logo = data.get('team_logo')
        team_description = data.get('team_description')

        # Calculate team_age based on user_birth for each team player
        team_age_list = []
        for player_code in team_player:
            try:
                user_info = UserInfo.objects.get(user_code=player_code)
                user_birth = user_info.user_birth
                # Assuming user_birth is in YYYYMMDD format
                current_date = datetime.datetime.now()
                birth_year = int(user_birth[:4])
                birth_month = int(user_birth[4:6])
                birth_day = int(user_birth[6:8])
                birth_date = datetime.datetime(birth_year, birth_month, birth_day)
                age_timedelta = current_date - birth_date
                team_age = age_timedelta.days // 365
                team_age_list.append(team_age)
            except UserInfo.DoesNotExist:
                raise serializers.ValidationError(f"유저 코드 {player_code}에 해당하는 사용자가 존재하지 않습니다.")

        # Check for duplicate team players
        seen = set()
        for player in team_player:
            if player in seen:
                raise serializers.ValidationError("error : team_player에 중복된 값이 있습니다.")
            seen.add(player)
        
        # Assign the average team age to the data
        if team_age_list:
            data['team_age'] = sum(team_age_list) // len(team_age_list)

        return data