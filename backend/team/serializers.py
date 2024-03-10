from rest_framework import serializers
from DB.models import TeamInfo
from DB.models import UserInfo
from DB.models import PlayerInfo
from django.http import JsonResponse
import datetime
from staticfiles.make_code import make_code
from staticfiles.get_info import get_user_code_by_user_nickname 
from staticfiles.get_info import get_player_info_by_user_code 
import re
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg
from staticfiles.get_info import calculate_age

# 팀 정보 불러오기
class Team_main_page(serializers.ModelSerializer):
    class Meta:
        model = TeamInfo
        fields = '__all__'
        
# team_player 입력은 update에서만 가능 
class Team_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = TeamInfo
        extra_kwargs = {
            'team_code': {'required' : False}
        }

    def create(self, validated_data):
        team_code = make_code('t')  # 먼저 match_code 생성
        validated_data['team_code'] = team_code  # validated_data에 추가
        validated_data['team_point'] = 0
        validated_data['team_games'] = 0
        validated_data['team_player'] =[]
        validated_data['team_5_match'] =[]
        
        instance = super().create(validated_data)  # 인스턴스 생성
        instance.save()
        return instance

    def validate(self, data):
        required_fields = ['team_host', 'team_name', 'team_area']
        errors = {field: f"팀 {field}는 필수 항목입니다." for field in required_fields if not data.get(field)}

        if errors:
            raise serializers.ValidationError(errors)
        return data



## Team 수정페이지
class UpdateTeamInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamInfo
        exclude = ('team_code', 'team_name', 'team_point', 'team_5_match',)

    def update(self, instance, validated_data):
        instance.team_host = validated_data.get('team_host', instance.team_host)
        instance.team_logo = validated_data.get('team_logo', instance.team_logo)
        instance.team_area = validated_data.get('team_area', instance.team_area)
        instance.team_description = validated_data.get('team_description', instance.team_description)

        new_team_player = [get_user_code_by_user_nickname(nickname) for nickname in validated_data.get('team_player')]
        
        print(new_team_player)
        # If new_team_player is provided, execute the following logic.
        if new_team_player:
            # Check if the new players are already in the existing team
            existing_team_player_set = set(instance.team_player)
            
            # Raise error if there's duplicate player in the team
            if existing_team_player_set & set(new_team_player):
                raise serializers.ValidationError("error : team_player에 중복된 값이 있습니다.")
            
            # Add new team player codes to the existing team player
            instance.team_player.extend(new_team_player)

            # Calculate team_age based on user_birth for each team player
            team_age_list = calculate_team_age(instance.team_player, new_team_player)
            # Assign the average team age to the data
            if team_age_list:
                instance.team_age = sum(team_age_list) // len(team_age_list)

        instance.save()
        return instance
        
# team_age 계산 
def calculate_team_age(existing_team_player, new_team_player):
    team_age_list = []
    all_team_players = existing_team_player + new_team_player
    for player_code in all_team_players:
        try:

            user_info = UserInfo.objects.get(user_code=player_code)
            # print("asdfasdfas")
            # print("user_info: ", user_info)
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
    return team_age_list

# team search
class Team_Search(serializers.ModelSerializer):
    class Meta:
        model = TeamInfo
        fields = '__all__'  

    def to_representation(self, instance):
        tier = self.context.get('tier', None)
        area = self.context.get('area', None)

        if tier is not None and instance.team_tier == tier:
            return super().to_representation(instance)
        
        elif area is not None and instance.team_area == area:
            return super().to_representation(instance)
        
        else:
            raise serializers.ValidationError("No team information found")
  


# 팀 요약 조회 API 
class Team_Short_info(serializers.Serializer):
    area = serializers.CharField()
    total_teams = serializers.SerializerMethodField()
    total_players = serializers.SerializerMethodField()
    total_avg_age = serializers.SerializerMethodField()
    total_avg_tier = serializers.SerializerMethodField()

    class Meta:
        fields = ['area', 'total_teams', 'total_players', 'total_avg_age','total_avg_tier']

    def get_total_teams(self, obj):
        return TeamInfo.objects.filter(team_area=obj["area"]).count()

    def get_total_players(self, obj):
        teams = TeamInfo.objects.filter(team_area=obj["area"])
        total_players = 0
        for team in teams:
            total_players += len(team.team_player)
        return total_players

    def get_total_avg_age(self, obj):
        teams = TeamInfo.objects.filter(team_area=obj["area"])
        total_age = 0
        total_teams = 0
        for team in teams:
            if team.team_age: 
                total_age += team.team_age
                total_teams += 1
        return int(total_age / total_teams) if total_teams > 0 else 0

    def get_total_avg_tier(self,obj):
        return


# 팀 상세 조희 API
class PlayerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerInfo
        fields = ['player_num', 'player_position', 'player_goal', 'player_assist', 'player_foot']

class Team_More_info(serializers.ModelSerializer):
    team_percent = serializers.SerializerMethodField()
    players = serializers.SerializerMethodField() 
    
    class Meta:
        model = TeamInfo
        fields = ['team_logo','team_tier','team_name','team_games','team_percent','team_age','team_games','players']

    def get_team_percent(self, obj):
        
        return 

    def get_players(self, obj):
        player_infos = PlayerInfo.objects.filter(user_code__in=obj.team_player)
        return PlayerInfoSerializer(player_infos, many=True).data



# 팀 선수 상세 조회 API
class Team_Player_More_info(serializers.ModelSerializer):
    player_age = serializers.SerializerMethodField()  
    player_gender = serializers.SerializerMethodField()  
    player_attend = serializers.SerializerMethodField()  
    player_games = serializers.SerializerMethodField()  
    player_attendpoint = serializers.SerializerMethodField()  
    

    class Meta:
        model = PlayerInfo
        fields = ['player_height','player_weight','player_foot','player_position','player_age','player_num'
        ,'player_gender','player_goal','player_assist','player_games','player_attend','player_attendpoint']

    def get_player_age(self, obj):
        user_code = self.context.get('user_code', None)
        user_info = UserInfo.objects.filter(user_code=user_code).first()
        if not user_info:
            return None  # user_code에 해당하는 UserInfo 객체가 없는 경우
        return calculate_age(user_info.user_birth)


    def get_player_gender(self, obj):
        user_code = self.context.get('user_code', None)
        user_info = UserInfo.objects.filter(user_code=user_code).first()
        if not user_info:
            return None  # user_code에 해당하는 UserInfo 객체가 없는 경우
        return user_info.user_gender
    
    # 다음회의
    def get_player_games(self,obj): 
        
        return
    # 다음회의 
    def get_player_attend(self,obj):

        return
    # 다음회의
    def get_player_attendpoint(self,obj):
        
        return
    

    def to_representation(self, instance):
        user_code = self.context.get('user_code', None)
        try:
            player_info = get_player_info_by_user_code(user_code)
            
        except ValueError as e:
            # 유저 코드에 해당하는 선수 정보가 없는 경우
            return {"error": str(e)}

        if player_info == instance:
            return super().to_representation(instance)
        else:
            return None
