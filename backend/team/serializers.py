from rest_framework import serializers
from DB.models import *
from django.http import JsonResponse
import datetime
from staticfiles.make_code import make_code
from rest_framework.response import Response
from rest_framework import status
from V2_login.serializers import V2_UpdateUserInfoSerializer, V2_User_info_Serializer_summary
from staticfiles.get_file_url import get_file_url

class Team_Info_Serializer(serializers.ModelSerializer):
    class Meta:
        model = TeamInfo
        fields = '__all__'
        extra_kwargs = {
            'team_code': {'required': False},
            'team_logo': {'required': False},
            'created_at' : {'required': False}
        }

    def to_representation(self, instance): # serializer.data 값 사용자 정의
        data = super().to_representation(instance) # 기본 직렬화된 데이터 가져오기
        data['team_logo'] = get_file_url(data['team_logo'])  # path -> URL로 변환
        return data

    def validate_team_name(self, value):
        if not (2 <= len(value) <= 15):
            raise serializers.ValidationError("team_name은 2글자 이상 15글자 이하로 설정해야 합니다.")
        if not all(char.isalnum() or char in "!@#$%^&*()_+-=<>?/.,;:[]{}" for char in value):
            raise serializers.ValidationError("team_name은 영문, 한글, 숫자, 특수문자로만 구성되어야 합니다.")
        return value

    def validate_team_host(self, value):
        if not UserInfo.objects.filter(user_code=value).exists():
            raise serializers.ValidationError(f"team_host({value})에 해당하는 유저가 존재하지 않습니다.")
        if UserTeam.objects.filter(user_code=value).exists():
            raise serializers.ValidationError(f"team_host({value})는 이미 팀에 소속되어 있습니다.")
        return value

    def validate(self, data):
        # 필수 항목 확인
        required_fields = ['team_name', 'team_host']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if field not in data}
        if errors:
            raise serializers.ValidationError(errors)
        return data
    
    def create(self, validated_data):
        team_code = make_code('t')  # 먼저 team_code 생성
        validated_data['team_code'] = team_code  # validated_data에 추가
        user_code = validated_data['team_host']
        
        # UserTeam 테이블에 추가
        user_team_data = {
            'user_code': user_code,
            'team_code': team_code
        }
        user_team_instance = UserTeam(**user_team_data)  # UserTeam 인스턴스 생성
        user_team_instance.save()

        # TeamInfo 테이블에 데이터 생성
        instance = super().create(validated_data)  # 인스턴스 생성
        instance.save()
        return instance
        

class User_Team_Serializer(serializers.ModelSerializer):
    class Meta:
        model = UserTeam
        fields = '__all__'
        
    def validate(self, data):
        # 필수 항목 확인
        required_fields = ['team_code', 'user_code']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if field not in data}
        if errors:
            raise serializers.ValidationError(errors)
        return data
    
    def validate_team_code(self, value):
        if not TeamInfo.objects.filter(team_code=value).exists():
            raise serializers.ValidationError(f"team_code({value})에 해당하는 팀이 존재하지 않습니다.")
        return value
    
    def validate_user_code(self, value):
        if not UserInfo.objects.filter(user_code=value).exists():
            raise serializers.ValidationError(f"user_code({value})에 해당하는 유저가 존재하지 않습니다.")
        return value