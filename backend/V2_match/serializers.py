from rest_framework import serializers
from DB.models import *
from staticfiles.make_code import make_code

import re

# 경기 정보 불러오기
class Match_main_page(serializers.ModelSerializer):
    class Meta:
        model = V2_MatchInfo
        fields = '__all__'

# 경기 전 일정잡기
class Before_Match_info_Serializer(serializers.ModelSerializer):
    '''
    장소, 홈팀, 어웨이팀 필수입력
    홈팀, 어웨이팀 검색, 입력 아직. 
    '''
    class Meta:
        model = V2_MatchInfo
        fields = ['v2_match_location', 'v2_match_home', 'v2_match_away']
        extra_kwargs = {
            'v2_match_code': {'required': False}
        }

    def create(self, validated_data):
        v2_match_code = make_code('m')  # 먼저 match_code 생성
        validated_data['v2_match_code'] = v2_match_code 
        instance = super().create(validated_data) 
        return instance

    def validate(self, data):
        # v2_match_host는 user_code로 대체
        v2_match_location = data.get('v2_match_location')
        v2_match_home = data.get('v2_match_home')
        v2_match_away = data.get('v2_match_away')

        required_fields = ['v2_match_location', 'v2_match_home', 'v2_match_away']
        errors = {field: f"{field} 필드는 필수입니다." for field in required_fields if not data.get(field)}

        ## match_home과 match_away 중복확인 
        if v2_match_home == v2_match_away:
            raise serializers.ValidationError("v2_match_home v2_match_away 중복되는 값입니다.")

        return data


class After_Match_info_Serializer(serializers.ModelSerializer):
    '''
    v2_match_code 
    v2_total_result,v2_game_type - 받아야됨. v2_game_type은 어떻게 받는지에 따라 데이터타입 바꿀 예정 
    '''
    class Meta:
        model = V2_MatchInfo
        fields = ['v2_match_result','v2_match_code']

    def validate(self, data):
        match_code = data.get('v2_match_code')
        print(match_code)
        before_match_info = V2_MatchInfo.objects.filter(v2_match_code=match_code)
        
        if not before_match_info.exists():
            raise serializers.ValidationError("이전 매치 정보를 찾을 수 없습니다.")

        before_match_info = before_match_info.last()

        if before_match_info.v2_match_code != match_code:
            raise serializers.ValidationError("주어진 v2_match_code 해당하는 매치 정보를 찾을 수 없습니다.")

        v2_match_result = data.get('v2_match_result')

        # 필수 필드를 확인하고 부족한 경우 오류를 발생시킵니다.
        required_fields = ['v2_match_result']
        errors = {field: f"{field} 필드는 필수입니다." for field in required_fields if not data.get(field)}

        # # 오류가 있는 경우 예외를 발생시킵니다.
        if errors:
            raise serializers.ValidationError(errors)

        return data