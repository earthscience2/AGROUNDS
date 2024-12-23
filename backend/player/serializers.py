from rest_framework import serializers
from DB.models import *

from datetime import datetime

from staticfiles.get_file_url import get_file_url 

class Pending_Invite_Team_Serializer(serializers.ModelSerializer):
    class Meta:
        model = PendingInviteTeam
        fields = '__all__'

    def validate(self, data):
        # 필수 항목 확인
        required_fields = ['team_code', 'user_code', 'direction']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if field not in data}
        if errors:
            raise serializers.ValidationError(errors)
        
        if PendingInviteTeam.objects.filter(team_code=data['team_code'], user_code=data['user_code']).exists():
            raise serializers.ValidationError({"error":"이미 요청하였습니다."})
        
        if UserTeam.objects.filter(user_code=data['user_code']).exists():
            raise serializers.ValidationError({"error":"이미 팀에 소속되어 있습니다."})
        return data
    
    def validate_direction(self, value):
        directions = ['user_to_team', 'team_to_user']
        if value not in directions:
            raise serializers.ValidationError(f"잘못된 direction : {value}")
        return value

    def validate_team_code(self, value):
        if not TeamInfo.objects.filter(team_code=value).exists():
            raise serializers.ValidationError(f"team_code({value})에 해당하는 팀이 존재하지 않습니다.")
        return value
    
    def validate_user_code(self, value):
        if not UserInfo.objects.filter(user_code=value).exists():
            raise serializers.ValidationError(f"user_code({value})에 해당하는 유저가 존재하지 않습니다.")
        return value
    
class Essencial_User_Info(serializers.ModelSerializer):
    user_age = serializers.SerializerMethodField()  # 사용자 정의 필드 추가
    user_logo = serializers.SerializerMethodField()

    class Meta:
        model = UserInfo
        fields = ['user_code', 'user_nickname', 'user_id', 'user_age', 'user_logo', 'user_position', 'user_type']

    def get_user_age(self, obj):
        if hasattr(obj, 'user_birth') and obj.user_birth:
            try:
                birth_date = datetime.strptime(obj.user_birth, '%Y-%m-%d').date()
                today = datetime.today().date()
                age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                return age
            except ValueError:
                raise serializers.ValidationError("user_birth의 형식이 잘못되었습니다. 'yyyy-mm-dd' 형식이어야 합니다.")
        return None  # user_birth가 없거나 유효하지 않은 경우
    
    def get_user_logo(self, obj):
        user_team = UserTeam.objects.filter(user_code = obj.user_code)
        if user_team.exists():
            team = TeamInfo.objects.filter(team_code = user_team.first().team_code)
            if team.exists():
                return get_file_url(team.first().team_logo)
        return get_file_url('img/teamlogo/default-team-logo.png')

class Essencial_Player_Info(serializers.ModelSerializer):
    user_age = serializers.SerializerMethodField()  # 사용자 정의 필드 추가
    user_team = serializers.SerializerMethodField()
    recent_match = serializers.SerializerMethodField()
    recent_match_date = serializers.SerializerMethodField()

    class Meta:
        model = UserInfo
        fields = ['user_name', 'user_gender','user_nickname', 
                  'user_type', 'user_height', 'user_weight', 'user_position', 
                  'user_age', 'user_team', 'recent_match', 'recent_match_date']
        
    def get_user_age(self, obj):
        if hasattr(obj, 'user_birth') and obj.user_birth:
            try:
                birth_date = datetime.strptime(obj.user_birth, '%Y-%m-%d').date()
                today = datetime.today().date()
                age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                return age
            except ValueError:
                raise serializers.ValidationError("user_birth의 형식이 잘못되었습니다. 'yyyy-mm-dd' 형식이어야 합니다.")
        return None  # user_birth가 없거나 유효하지 않은 경우
    
    def get_user_team(self, obj):
        user_team = UserTeam.objects.filter(user_code = obj.user_code)
        if user_team.exists():
            team = TeamInfo.objects.filter(team_code = user_team.first().team_code)
            if team.exists():
                return team.first().team_code
        return ''
    
    # 수정 필요
    def get_recent_match(self, obj):
        return 'm_0001'
    
    # 수정 필요
    def get_recent_match_date(self, obj):
        return '2024-12-25'
        


# class User_main_page(serializers.ModelSerializer):
#     class Meta:
#         model = UserInfo
#         fields = '__all__'

# class TeamMatchInfoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TeamMatchInfo
#         fields = ['match_code', 'match_team_code', 'match_quarter_info', 'match_name', 'match_schedule', 'gps_url']

# class UserMatchInfoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserMatchInfo
#         fields = ['match_code', 'match_name', 'match_schedule', 'match_quarter_info', 'gps_url']

# # usercode로 user_match_info 접근해서 개인 경기 불러오기
# class MatchProcessSerializer(serializers.Serializer):
#     user_code = serializers.CharField()

#     def validate(self, data):
#         user_code = data.get('user_code')

#         # user_code가 비어 있으면 에러
#         if not user_code:
#             raise serializers.ValidationError({"user_code": "This field is required."})

#         # UserMatch에서 user_code로 match_code 조회
#         user_matches = UserMatch.objects.filter(user_code=user_code)

#         if not user_matches.exists():
#             raise serializers.ValidationError({"user_code": "No matches found for this user_code."})

#         data['user_matches'] = user_matches
#         return data

#     def get_match_info(self, user_matches):
#         # match_code 리스트 추출
#         match_codes = user_matches.values_list('match_code', flat=True)

#         # UserMatchInfo에서 match_code로 데이터 조회
#         match_info = UserMatchInfo.objects.filter(match_code__in=match_codes)

#         if not match_info.exists():
#             return []

#         # 직렬화하여 반환
#         return UserMatchInfoSerializer(match_info, many=True).data

#     def process(self):
#         # 검증된 데이터 가져오기
#         validated_data = self.validated_data

#         # UserMatch 데이터 가져오기
#         user_matches = validated_data['user_matches']

#         # UserMatchInfo 데이터 가져오기
#         match_info = self.get_match_info(user_matches)

#         # 결과 반환
#         return {
#             "user_matches": [
#                 {
#                     "index": match.index,
#                     "match_code": match.match_code,
#                     "user_code": match.user_code,
#                 }
#                 for match in user_matches
#             ],
#             "match_info": match_info,
#         }

# # user_code로 team_match_info 접근해서 팀 경기 결과 불러오기 
# class MatchProcessTeamSerializer(serializers.Serializer):
#     user_code = serializers.CharField()

#     def validate(self, data):
#         user_code = data.get('user_code')

#         # user_code가 비어 있으면 에러
#         if not user_code:
#             raise serializers.ValidationError({"user_code": "This field is required."})

#         # UserMatchAsTeam에서 user_code로 match_code 조회
#         user_matches = UserMatchAsTeam.objects.filter(user_code=user_code)

#         if not user_matches.exists():
#             raise serializers.ValidationError({"user_code": "No matches found for this user_code."})

#         data['user_matches'] = user_matches
#         return data

#     def get_team_match_info(self, user_matches):
#         # match_code 리스트 추출
#         match_codes = user_matches.values_list('match_code', flat=True)

#         # TeamMatchInfo에서 match_code로 데이터 조회
#         match_info = TeamMatchInfo.objects.filter(match_code__in=match_codes)

#         if not match_info.exists():
#             return []

#         # 직렬화하여 반환
#         return TeamMatchInfoSerializer(match_info, many=True).data

#     def process(self):
#         # 검증된 데이터 가져오기
#         validated_data = self.validated_data

#         # UserMatchAsTeam 데이터 가져오기
#         user_matches = validated_data['user_matches']

#         # TeamMatchInfo 데이터 가져오기
#         match_info = self.get_team_match_info(user_matches)

#         # 결과 반환
#         return {
#             "user_matches": [
#                 {
#                     "match_code": match.match_code,
#                     "user_code": match.user_code,
#                 }
#                 for match in user_matches
#             ],
#             "match_info": match_info,
#         }