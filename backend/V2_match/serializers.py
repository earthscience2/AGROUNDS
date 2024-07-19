from rest_framework import serializers
from DB.models import *
from V2_login.serializers import V2_UpdateUserInfoSerializer, V2_User_info_Serializer_summary
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
    """
    v2_match_location, v2_match_home, v2_match_away, v2_match_schedule - 필수
    v2_match_home, v2_match_away 중복 안됨
    """
    class Meta:
        model = V2_MatchInfo
        fields = ['v2_match_host', 'v2_match_location', 'v2_match_home', 'v2_match_away', 'v2_match_schedule']
        extra_kwargs = {
            'v2_match_code': {'required': False}
        }

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        v2_match_code = make_code('m')
        self._v2_match_code = v2_match_code 
        data['v2_match_code'] = v2_match_code
        return data

    def create(self, validated_data):
        v2_match_code = self._v2_match_code  # Use the stored match_code
        validated_data['v2_match_code'] = v2_match_code
        validated_data['v2_match_teamcode'] = []
        # Update team match codes
        self.update_team_codes(validated_data)

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

        return data

    def update_team_codes(self, validated_data):
        v2_match_teamcode = []

        home_team = validated_data.get('v2_match_home')
        away_team = validated_data.get('v2_match_away')
        match_code = validated_data.get('v2_match_code')

        home_code = get_team_code_by_team_name(home_team)
        if home_code:
            v2_match_teamcode.append(home_code)
            update_team_match_code(home_code, match_code)

        away_code = get_team_code_by_team_name(away_team)
        if away_code:
            v2_match_teamcode.append(away_code)
            update_team_match_code(away_code, match_code)

        validated_data['v2_match_teamcode'] = v2_match_teamcode


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
        required_fields = ['v2_match_result', 'v2_match_players', 'v2_match_GPSplayers']
        errors = {field: f"{field} 필드는 필수입니다." for field in required_fields if not data.get(field)}

        # 오류가 있는 경우 예외를 발생시킵니다.
        if errors:
            raise serializers.ValidationError(errors)
        
        return data
    
    def update(self, instance, validated_data):
        v2_match_players = validated_data['v2_match_players']
        v2_match_code = validated_data['v2_match_code']
        print(v2_match_players)
        for match_players in v2_match_players:
                try:
                    user = V2_UserInfo.objects.get(user_code = match_players)
                except V2_UserInfo.DoesNotExist:
                    print('경기 참여자 입력 중 에러 발생 : 해당 유저 코드가 존재하지 않습니다.')
                    continue
                user_match_list_new = user.user_match_list
                if user_match_list_new is None or user_match_list_new == "":
                    user_match_list_new = []
                user_match_list_new.append(v2_match_code)
                print(user_match_list_new)
                user_info_update_data = {
                    'user_match_list' : user_match_list_new,
                }
                user_info_serializer = V2_UpdateUserInfoSerializer(user, data=user_info_update_data, partial=True)
                if user_info_serializer.is_valid():
                    user_info_serializer.save()
                else:
                    raise serializers.ValidationError(user_info_serializer.errors)
        return super().update(instance, validated_data)

# 매치코드로 매치정보 찾기
class MatchSearchByMatchcode(serializers.ModelSerializer):
    v2_match_players_detail = serializers.SerializerMethodField()

    class Meta:
        model = V2_MatchInfo
        fields = ['v2_match_code', 'v2_match_host', 'v2_match_location',
                  'v2_match_home', 'v2_match_away', 'v2_match_result', 'v2_match_schedule',
                  'v2_match_players_detail', 'v2_match_goalplayers', 'v2_match_GPSplayers', 'v2_match_teamcode']

    # 경기에 참여한 선수들의 세부 정보를 리턴
    def get_v2_match_players_detail(self, obj):
        def getPlayrsDetail(user_code):
            if user_code.startswith("u_"):
                try:
                    uesr_info_serializer = V2_User_info_Serializer_summary(V2_UserInfo.objects.get(user_code = user_code))
                except V2_UserInfo.DoesNotExist:
                    print('case 4')
                    raise serializers.ValidationError(f"유저 코드 {user_code}에 해당하는 유저가 존재하지 않습니다.")
                return uesr_info_serializer.data
            else:
                print('case 1')
                return user_code
        if obj.v2_match_players is not None :
            players_names = map(getPlayrsDetail, obj.v2_match_players)
        else :
            return None
        return players_names

# 팀코드로 매치정보 찾기 
class MatchSearchByTeamcode(serializers.ModelSerializer):
    class Meta:
        model = V2_MatchInfo
        fields = '__all__'