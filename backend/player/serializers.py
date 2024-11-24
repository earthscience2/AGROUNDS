from rest_framework import serializers
from DB.models import *

class User_main_page(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = '__all__'

class TeamMatchInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMatchInfo
        fields = ['match_code', 'match_team_code', 'match_quarter_info', 'match_name', 'match_schedule', 'gps_url']

class UserMatchInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMatchInfo
        fields = ['match_code', 'match_name', 'match_schedule', 'match_quarter_info', 'gps_url']

# usercode로 user_match_info 접근해서 개인 경기 불러오기
class MatchProcessSerializer(serializers.Serializer):
    user_code = serializers.CharField()

    def validate(self, data):
        user_code = data.get('user_code')

        # user_code가 비어 있으면 에러
        if not user_code:
            raise serializers.ValidationError({"user_code": "This field is required."})

        # UserMatch에서 user_code로 match_code 조회
        user_matches = UserMatch.objects.filter(user_code=user_code)

        if not user_matches.exists():
            raise serializers.ValidationError({"user_code": "No matches found for this user_code."})

        data['user_matches'] = user_matches
        return data

    def get_match_info(self, user_matches):
        # match_code 리스트 추출
        match_codes = user_matches.values_list('match_code', flat=True)

        # UserMatchInfo에서 match_code로 데이터 조회
        match_info = UserMatchInfo.objects.filter(match_code__in=match_codes)

        if not match_info.exists():
            return []

        # 직렬화하여 반환
        return UserMatchInfoSerializer(match_info, many=True).data

    def process(self):
        # 검증된 데이터 가져오기
        validated_data = self.validated_data

        # UserMatch 데이터 가져오기
        user_matches = validated_data['user_matches']

        # UserMatchInfo 데이터 가져오기
        match_info = self.get_match_info(user_matches)

        # 결과 반환
        return {
            "user_matches": [
                {
                    "index": match.index,
                    "match_code": match.match_code,
                    "user_code": match.user_code,
                }
                for match in user_matches
            ],
            "match_info": match_info,
        }

# user_code로 team_match_info 접근해서 팀 경기 결과 불러오기 
class MatchProcessTeamSerializer(serializers.Serializer):
    user_code = serializers.CharField()

    def validate(self, data):
        user_code = data.get('user_code')

        # user_code가 비어 있으면 에러
        if not user_code:
            raise serializers.ValidationError({"user_code": "This field is required."})

        # UserMatchAsTeam에서 user_code로 match_code 조회
        user_matches = UserMatchAsTeam.objects.filter(user_code=user_code)

        if not user_matches.exists():
            raise serializers.ValidationError({"user_code": "No matches found for this user_code."})

        data['user_matches'] = user_matches
        return data

    def get_team_match_info(self, user_matches):
        # match_code 리스트 추출
        match_codes = user_matches.values_list('match_code', flat=True)

        # TeamMatchInfo에서 match_code로 데이터 조회
        match_info = TeamMatchInfo.objects.filter(match_code__in=match_codes)

        if not match_info.exists():
            return []

        # 직렬화하여 반환
        return TeamMatchInfoSerializer(match_info, many=True).data

    def process(self):
        # 검증된 데이터 가져오기
        validated_data = self.validated_data

        # UserMatchAsTeam 데이터 가져오기
        user_matches = validated_data['user_matches']

        # TeamMatchInfo 데이터 가져오기
        match_info = self.get_team_match_info(user_matches)

        # 결과 반환
        return {
            "user_matches": [
                {
                    "match_code": match.match_code,
                    "user_code": match.user_code,
                }
                for match in user_matches
            ],
            "match_info": match_info,
        }