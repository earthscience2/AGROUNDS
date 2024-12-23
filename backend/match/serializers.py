from rest_framework import serializers
from DB.models import *
from backend.staticfiles import get_file_url
from staticfiles.make_code import make_code
from staticfiles.get_info import get_team_code_by_team_name
from staticfiles.get_info import update_team_match_code

class User_Match_Info_Serializer(serializers.ModelSerializer):
    class Meta:
        model = UserMatchInfo
        fields = '__all__'

class User_Match_Serializer(serializers.ModelSerializer):
    class Meta:
        models = UserMatch
        fields = ['match_code', 'user_code', 'match_schedule', 'service_type',
                  'match_type', 'match_location', 'thumbnail', 'match_title', 'match_time',
                  'distance', 'top_speed', 'rating', 'home_team', 'home_team_logo', 'away_team',
                  'away_team_logo']
        
    default_team_logo = get_file_url('img/teamlogo/default-team-logo.png')
    default_thumbnail = get_file_url('video/thumbnail/thumbnail1.png')
        
    def get_match_location(self, obj):
        match_info = UserMatchInfo.objects.filter(match_code = obj.match_code, user_code = obj.user_code).first()
        return match_info.ground_name
    
    def get_thumbnail(self, obj):
        return self.default_thumbnail

    def get_match_title(self, obj):
        match_info = UserMatchInfo.objects.filter(match_code = obj.match_code, user_code = obj.user_code).first()
        return match_info.match_name
    
    def get_match_time(self, obj):
        match_info = UserMatchInfo.objects.filter(match_code = obj.match_code, user_code = obj.user_code).first()
        return match_info.match_time
    
    def get_distance(self, obj):
        return '-'
    
    def get_top_speed(self, obj):
        return '-'
    
    def get_rating(self, obj):
        return '-'
    
    def get_home_team(self, obj):
        if obj.match_type == 'player':
            return '-'
        try:
            return TeamMatch.objects.filter(match_code = obj.match_code).first().team_code
        except TeamMatch.DoesNotExist:
            return '-'
    
    def get_home_team_logo(self, obj):
        if obj.match_type == 'player':
            return self.default_team_logo
        try:
            team_code = TeamMatch.objects.filter(match_code = obj.match_code).first().team_code
            return TeamInfo.objects.get(team_code = team_code).team_logo
        except TeamMatch.DoesNotExist:
            return '-'
        except TeamInfo.DoesNotExist:
            return '-'
    
    def get_away_team(self, obj):
        match_info = UserMatchInfo.objects.filter(match_code = obj.match_code, user_code = obj.user_code).first()
        return match_info.away_team
    
    def get_away_team_logo(self, obj):
        match_info = UserMatchInfo.objects.filter(match_code = obj.match_code, user_code = obj.user_code).first()
        try:
            return TeamInfo.objects.get(team_code = match_info.away_team).team_logo
        except TeamInfo.DoesNotExist:
            return self.default_team_logo

class Team_Match_Serializer(serializers.ModelSerializer):
    class Meta:
        models = TeamMatch
        fields = ['match_code', 'match_schedule', 'match_location', 'thumbnail', 'match_title', 'match_time',
                  'match_mom', 'match_result', 'participation', 'home_team', 'home_team_logo', 'away_team',
                  'away_team_logo']
        
    default_team_logo = get_file_url('img/teamlogo/default-team-logo.png')
    default_thumbnail = get_file_url('video/thumbnail/thumbnail1.png')
        
    def get_match_location(self, obj):
        try:
            match_info = TeamMatchInfo.objects.get(match_code = obj.match_code)
            return match_info.ground_name
        except TeamMatchInfo.DoesNotExist:
            return '-'
        
    def get_thumbnail(self, obj):
        return self.default_thumbnail

    def get_match_title(self, obj):
        try:
            match_info = TeamMatchInfo.objects.get(match_code = obj.match_code)
            return match_info.match_name
        except TeamMatchInfo.DoesNotExist:
            return '-'
    
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
        return obj.team_code
    
    def get_home_team_logo(self, obj):
        try:
            return TeamInfo.objects.get(team_code = obj.team_code).team_logo
        except TeamInfo.DoesNotExist:
            return self.default_team_logo
    
    def get_away_team(self, obj):
        try:
            match_info = TeamMatchInfo.objects.get(match_code = obj.match_code)
            return match_info.away_team
        except TeamMatchInfo.DoesNotExist:
            return '-'
    
    def get_away_team_logo(self, obj):
        try:
            match_info = TeamMatchInfo.objects.get(match_code = obj.match_code)
            away_team_info = TeamInfo.objects.get(team_code = match_info.away_team)
            return away_team_info.team_logo
        except TeamMatchInfo.DoesNotExist:
            return '-'
        except TeamInfo.DoesNotExist:
            return '-'
