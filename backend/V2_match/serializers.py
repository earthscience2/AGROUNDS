from rest_framework import serializers
from DB.models import *
from staticfiles.make_code import make_code
from staticfiles.get_info import get_team_code_by_team_name
from staticfiles.get_info import update_team_match_code
import re

# 경기 정보 불러오기
class Match_main_page(serializers.ModelSerializer):
    class Meta:
        model = V2_MatchInfo
        fields = '__all__'

# 경기 전 일정잡기
class Before_Match_info_Serializer(serializers.ModelSerializer):
    '''
    v2_match_location, v2_match_home, v2_match_away, v2_match_schedule - 필수
    v2_match_home, v2_match_away 중복 안됨
    '''
    class Meta:
        model = V2_MatchInfo
        fields = ['v2_match_host', 'v2_match_location', 'v2_match_home', 'v2_match_away', 'v2_match_schedule']
        extra_kwargs = {
            'v2_match_code': {'required': False}
        }

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        # Generate match_code and inject into data for validation purposes
        v2_match_code = make_code('m')
        self._v2_match_code = v2_match_code  # Store it for use in validation and creation
        data['v2_match_code'] = v2_match_code
        return data

    def create(self, validated_data):
        v2_match_code = self._v2_match_code  # Use the stored match_code
        validated_data['v2_match_code'] = v2_match_code
        instance = super().create(validated_data)
        return instance

    def validate(self, data):
        # 필수 필드 확인
        required_fields = ['v2_match_location', 'v2_match_home', 'v2_match_away', 'v2_match_schedule']
        errors = {field: f"{field} 필드는 필수입니다." for field in required_fields if not data.get(field)}
        if errors:
            raise serializers.ValidationError(errors)

        v2_match_home = data.get('v2_match_home')
        v2_match_away = data.get('v2_match_away')

        # match_home과 match_away 중복 확인
        if v2_match_home == v2_match_away:
            raise serializers.ValidationError("v2_match_home과 v2_match_away는 중복될 수 없습니다.")

        def get_team_code(team_name):
            return get_team_code_by_team_name(team_name=team_name)

        v2_match_code = self._v2_match_code  # Use the stored match_code

        # match추가하게 되면 v2_team_match에 해당 match_code 업데이트
        if(get_team_code(v2_match_home) != 0 ):
            update_team_match_code(get_team_code(v2_match_home), v2_match_code)
        if(get_team_code(v2_match_away) != 0 ):    
            update_team_match_code(get_team_code(v2_match_away), v2_match_code)

        return data


class After_Match_info_Serializer(serializers.ModelSerializer):
    '''
    POST
    v2_match_code, v2_match_result, v2_match_players, v2_match_GPSplayers, v2_match_location, v2_match_schedule - 필수
    v2_match_goalplayers - 선택 
    '''
    class Meta:
        model = V2_MatchInfo
        fields = ['v2_match_result','v2_match_location','v2_match_schedule', 'v2_match_code', 'v2_match_players', 'v2_match_goalplayers', 'v2_match_GPSplayers']

    def validate(self, data):
        match_code = data.get('v2_match_code')
       
        before_match_info = V2_MatchInfo.objects.filter(v2_match_code=match_code)
        
        if not before_match_info.exists():
            raise serializers.ValidationError("이전 매치 정보를 찾을 수 없습니다.")

        before_match_info = before_match_info.last()

        if before_match_info.v2_match_code != match_code:
            raise serializers.ValidationError("주어진 v2_match_code에 해당하는 매치 정보를 찾을 수 없습니다.")

        # v2_match_result = data.get('v2_match_result')
        # v2_match_players = data.get('v2_match_players')
        # v2_match_GPSplayers = data.get('v2_match_GPSplayers')
        
        # 필수 필드를 확인하고 부족한 경우 오류를 발생시킵니다.
        required_fields = ['v2_match_schedule','v2_match_location', 'v2_match_result', 'v2_match_players', 'v2_match_GPSplayers']
        errors = {field: f"{field} 필드는 필수입니다." for field in required_fields if not data.get(field)}

        # 오류가 있는 경우 예외를 발생시킵니다.
        if errors:
            raise serializers.ValidationError(errors)

        return data

# 매치코드로 매치정보 찾기
class MatchSearchByMatchcode(serializers.ModelSerializer):
    class Meta:
        model = V2_MatchInfo
        fields = '__all__'

