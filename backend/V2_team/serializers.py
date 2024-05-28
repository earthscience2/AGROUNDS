from rest_framework import serializers
from DB.models import *
from django.http import JsonResponse
import datetime
from staticfiles.make_code import make_code
from rest_framework.response import Response
from rest_framework import status
from V2_login.serializers import V2_UpdateUserInfoSerializer

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
        team_code = make_code('t')  # 먼저 team_code 생성
        validated_data['v2_team_code'] = team_code  # validated_data에 추가
        validated_data['v2_team_players'] = [validated_data['v2_team_host']] #여기서는 생성만하고 추가 불가능

        # ===============================================================
        # 팀을 생성한 유저의 V2_user_info 레코드의 team_code 필드에 생성한 team_code 업데이트
        v2_user_info = V2_UserInfo.objects.get(user_code = validated_data['v2_team_host'])
        user_info_update_data = {
            'team_code' : team_code,
            'user_type' : 0 # 감독임을 의미
        }
        user_info_serializer = V2_UpdateUserInfoSerializer(v2_user_info, data=user_info_update_data, partial=True)
        if user_info_serializer.is_valid():
            user_info_serializer.save()
        else:
            raise serializers.ValidationError(user_info_serializer.errors)
        # ===============================================================
        
        # v2_team_host는 user_code로 대체 
        instance = super().create(validated_data)  # 인스턴스 생성
        instance.save()
        return instance

    def validate(self, data):
        required_fields = ['v2_team_name', 'v2_team_host']
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
        
        # 새로운 플레이어들을 기존 플레이어 리스트에 추가
        new_players = validated_data.get("v2_team_players", [])
        instance.v2_team_players.extend(new_players)
        
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
        
    