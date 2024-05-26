from rest_framework import serializers
from DB.models import *
from django.http import JsonResponse
import datetime
from staticfiles.make_code import make_code
from rest_framework.response import Response
from rest_framework import status

# V2_team 정보 불러오기
class Team_main_page(serializers.ModelSerializer):
    class Meta:
        model = V2_TeamInfo
        fields = '__all__'
        
# V2_team 생성
''' v2_team_name 필수 나머지는 미입력가능
'''
class Team_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = V2_TeamInfo
        extra_kwargs = {
            'v2_team_code': {'required': False}
        }

    def create(self, validated_data):
        team_code = make_code('t')  # 먼저 match_code 생성
        validated_data['v2_team_code'] = team_code  # validated_data에 추가
        validated_data['v2_team_players'] = [] #여기서는 생성만하고 추가 불가능
        # v2_team_host는 user_code로 대체 
        instance = super().create(validated_data)  # 인스턴스 생성
        instance.save()
        return instance

    def validate(self, data):
        required_fields = ['v2_team_name']
        errors = {field: f"팀 {field}는 필수 항목입니다." for field in required_fields if not data.get(field)}
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return data


## V2_Team 수정페이지 (팀 이름)
class UpdateTeamInfoSerializer(serializers.ModelSerializer):
    '''
    Host 변경 - 주장 변경
    Logo 변경 
    Name 변경 - 팀 이름 변경
    Players 변경 - 팀원 추가 / 삭제 만들예정
    '''
    class Meta:
        model = V2_TeamInfo
        exclude = ('v2_team_code',)

    def update(self, instance, validated_data):
        instance.v2_team_host = validated_data.get('v2_team_host', instance.v2_team_host)
        instance.v2_team_logo = validated_data.get('v2_team_logo', instance.v2_team_logo)
        instance.v2_team_name = validated_data.get("v2_team_name", instance.v2_team_name)
        instance.v2_team_players = validated_data.get("v2_team_players", instance.v2_team_players)
        instance.save()
        return instance
    
class TeamSearchByTeamcode(serializers.ModelSerializer):
    class Meta:
        model = V2_TeamInfo
        fields = '__all__'
        
    
class TeamSearchByTeamname(serializers.ModelSerializer):
    class Meta:
        model = V2_TeamInfo
        fields = '__all__'
        
    