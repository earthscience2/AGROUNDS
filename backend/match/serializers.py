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


    class Meta:
        model = UserMatchInfo
        fields = ['match_code', 'match_schedule', 'match_location',
                    'thumbnail', 'match_title', 'match_time', 'distance', 
                    'top_speed', 'rating', 'home_team', 'home_team_logo', 'away_team',
                  'away_team_logo']
        
    default_team_logo = get_file_url('img/teamlogo/default-team-logo.png')
    default_thumbnail = get_file_url('video/thumbnail/thumbnail1.png')
        
    def get_match_location(self, obj):
        return obj.ground_name
    
    def get_thumbnail(self, obj):
        return self.default_thumbnail

    def get_match_title(self, obj):
        return obj.match_name
    
    def get_distance(self, obj):
        return '-'
    
    def get_top_speed(self, obj):
        return '-'
    
    def get_rating(self, obj):
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
    match_result = serializers.SerializerMethodField()
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
        return '-'
    
    def get_match_result(self, obj):
        return '-'
    
    def get_participation(self, obj):
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
            return TeamInfo.objects.get(team_code = obj.away_team).team_logo
        except TeamInfo.DoesNotExist:
            return self.default_team_logo