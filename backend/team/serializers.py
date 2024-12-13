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
            'team_logo': {'required': False}
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
        return value

    def validate(self, data):
        # 필수 항목 확인
        required_fields = ['team_name', 'team_host']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if not data.get(field)}
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
        
    


# V2_team 정보 불러오기
class Team_main_page(serializers.ModelSerializer):
    class Meta:
        model = TeamInfo
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

    
## 팀 플레이어의 세부정보를 포함하여 데이터 직렬화
class TeamInfoIncludedPlayersNames(serializers.ModelSerializer):
    v2_team_players_detail = serializers.SerializerMethodField()
    v2_team_logo = serializers.SerializerMethodField()

    class Meta:
        model = V2_TeamInfo
        fields = ['v2_team_code', 'v2_team_host', 'v2_team_players',
                   'v2_team_logo', 'v2_team_name', 'v2_team_match', 'v2_team_players_detail']
        
    # 팀 프레이어의 세부 정보를 리턴
    def get_v2_team_players_detail(self, obj):
        def getPlayrsDetail(user_code):
            if user_code.startswith("u_"):
                try:
                    uesr_info_serializer = V2_User_info_Serializer_summary(V2_UserInfo.objects.get(user_code = user_code))
                except V2_UserInfo.DoesNotExist:
                    raise serializers.ValidationError(f"유저 코드 {user_code}에 해당하는 유저가 존재하지 않습니다.")
                return uesr_info_serializer.data
            else:
                return user_code
        if obj.v2_team_players is not None :
            players_names = map(getPlayrsDetail, obj.v2_team_players)
        else :
            return None
        return players_names
    
    # 파일경로로 된 로고를 url로 변환
    def get_v2_team_logo(self, obj):
        return get_file_url(obj.v2_team_logo)
    
    

    