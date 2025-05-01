from rest_framework import serializers
from DB.models import *
from staticfiles.get_file_url import get_file_url

class Default_User_Match_Info_Serializer(serializers.ModelSerializer):
    class Meta:
        model = UserMatchInfo
        fields = '__all__'

class User_Match_Info_Serializer(serializers.ModelSerializer):
    match_location = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    match_title = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()
    top_speed = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    home_team = serializers.SerializerMethodField()
    home_team_logo = serializers.SerializerMethodField()
    away_team = serializers.SerializerMethodField()
    away_team_logo = serializers.SerializerMethodField()
    sprint = serializers.SerializerMethodField()


    class Meta:
        model = UserMatchInfo
        fields = ['match_code', 'match_schedule', 'match_location',
                    'thumbnail', 'match_title', 'match_time', 'distance', 
                    'top_speed', 'rating', 'home_team', 'home_team_logo', 'away_team',
                  'away_team_logo', 'sprint']
        
    default_team_logo = get_file_url('img/teamlogo/default-team-logo.png')
    default_thumbnail = get_file_url('video/thumbnail/thumbnail1.png')

    def __init__(self, instance=None, data=..., **kwargs):
        self.user_code = kwargs.pop('user_code', None)
        super().__init__(instance, data, **kwargs)
        
    def get_match_location(self, obj):
        return obj.ground_name
    
    def get_thumbnail(self, obj):
        return self.default_thumbnail

    def get_match_title(self, obj):
        return obj.match_name
    
    def get_distance(self, obj):
        self.match_info = UserAnalMatch.objects.filter(
            match_code=obj.match_code, 
            user_code=self.user_code
        )
        
        if self.match_info.exists():
            # 모든 객체의 T_D 값 추출 (None 제외)
            t_d_values = [item.T_D for item in self.match_info if item.T_D is not None]
            
            if t_d_values:
                # 합계 계산 변경
                total_sum = sum(t_d_values) 
                return int(total_sum * 100) / 100 # 소숫점 2자리로 절삭
            else:
                return '-'
        else:
            return '-'


    
    def get_top_speed(self, obj):
        # match_info 대신 새로운 쿼리셋 생성 (또는 get_distance에서 저장한 match_info2 재활용)
        match_info = UserAnalMatch.objects.filter(
            match_code=obj.match_code, 
            user_code=self.user_code
        )
        
        if match_info.exists():
            # 모든 객체의 T_HS 값을 추출
            t_hs_values = [item.T_HS for item in match_info if item.T_HS is not None]
            return f"{sum(t_hs_values)/len(t_hs_values):.1f}" if t_hs_values else '-'
        return '-'
    
    def get_rating(self, obj):
        # 새로운 쿼리셋 생성 (기존 match_info 재사용 X)
        match_info = UserAnalMatch.objects.filter(
            match_code=obj.match_code, 
            user_code=self.user_code
        )
        
        if match_info.exists():
            # 모든 객체의 point 값 추출
            points = [item.point.get('total', 0) for item in match_info if item.point]
            return f"{sum(points)/len(points):.1f}" if points else '-'
        return '-'

    def get_sprint(self, obj):
        match_info = UserAnalMatch.objects.filter(
            match_code=obj.match_code, 
            user_code=self.user_code
        )

        if match_info.exists():
            # 모든 객체의 T_S 값을 추출
            t_s_values = [item.T_S for item in match_info if item.T_S is not None]
            return f"{sum(t_s_values)}" if t_s_values else '-'
        return '-'

    
    def get_home_team(self, obj):
        team_match = TeamMatch.objects.filter(match_code = obj.match_code)
        if team_match.exists():
            return team_match.first().team_code
        else:
            return '-'
    
    def get_home_team_logo(self, obj):
        team_match = TeamMatch.objects.filter(match_code = obj.match_code)
        if team_match.exists():
            team_code = team_match.first().team_code
            try:
                team_info = TeamInfo.objects.get(team_code = team_code)
                return get_file_url(team_info.team_logo)
            except TeamInfo.DoesNotExist:
                return self.default_team_logo
        else:
            return self.default_team_logo
    
    def get_away_team(self, obj):
        if obj.away_team is None:
            return '-'
        else:
            return obj.away_team
    
    def get_away_team_logo(self, obj):
        try:
            return get_file_url(TeamInfo.objects.get(team_code = obj.away_team).team_logo)
        except TeamInfo.DoesNotExist:
            return self.default_team_logo

class Team_Match_Info_Serializer(serializers.ModelSerializer):
    match_location = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    match_title = serializers.SerializerMethodField()
    match_mom = serializers.SerializerMethodField()
    participation = serializers.SerializerMethodField()
    home_team = serializers.SerializerMethodField()
    home_team_logo = serializers.SerializerMethodField()
    away_team = serializers.SerializerMethodField()
    away_team_logo = serializers.SerializerMethodField()

    class Meta:
        model = TeamMatchInfo
        fields = ['match_code', 'match_schedule', 'match_location', 'thumbnail', 'match_title', 'match_time',
                  'match_mom', 'match_result', 'participation', 'home_team', 'home_team_logo', 'away_team',
                  'away_team_logo']
        
    default_team_logo = get_file_url('img/teamlogo/default-team-logo.png')
    default_thumbnail = get_file_url('video/thumbnail/thumbnail1.png')
        
    def get_match_location(self, obj):
        return obj.ground_name
    
    def get_thumbnail(self, obj):
        return self.default_thumbnail

    def get_match_title(self, obj):
        return obj.match_name
    
    def get_match_time(self, obj):
        try:
            match_info = TeamMatchInfo.objects.get(match_code = obj.match_code)
            return match_info.match_time
        except TeamMatchInfo.DoesNotExist:
            return '-'
    
    def get_match_mom(self, obj):
        user_info = UserInfo.objects.filter(user_code = obj.match_mom)
        if user_info.exists():
            return user_info.first().user_nickname
        return '-'
    
    def get_participation(self, obj):
        return UserMatch.objects.filter(match_code=obj.match_code).count()
    
    def get_home_team(self, obj):
        team_match = TeamMatch.objects.filter(match_code = obj.match_code)
        if team_match.exists():
            return team_match.first().team_code
        else:
            return '-'
    
    def get_home_team_logo(self, obj):
        team_match = TeamMatch.objects.filter(match_code = obj.match_code)
        if team_match.exists():
            team_code = team_match.first().team_code
            try:
                team_info = TeamInfo.objects.get(team_code = team_code)
                return get_file_url(team_info.team_logo)
            except TeamInfo.DoesNotExist:
                return self.default_team_logo
        else:
            return self.default_team_logo
    
    def get_away_team(self, obj):
        if obj.away_team is None:
            return '-'
        else:
            return obj.away_team
    
    def get_away_team_logo(self, obj):
        try:
            return TeamInfo.objects.get(team_code = obj.away_team).team_logo
        except TeamInfo.DoesNotExist:
            return self.default_team_logo