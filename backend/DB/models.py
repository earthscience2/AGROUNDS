from django.db import models

# 경기 정보 
class MatchInfo(models.Model):
    match_code = models.CharField(max_length=50, unique=True, primary_key=True)
    match_host = models.CharField(max_length=45)
    match_home = models.CharField(max_length=45)
    match_away = models.CharField(max_length=45)
    match_home_player = models.JSONField()
    match_away_player = models.JSONField()
    match_home_result = models.IntegerField()
    match_away_result = models.IntegerField()
    match_total_result = models.JSONField()
    match_official = models.CharField(max_length=45)
    match_starttime = models.CharField(max_length=45)
    match_type = models.JSONField()
    match_goal = models.JSONField(null=True)
    match_area = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'match_info'

# 팀 정보 
class TeamInfo(models.Model):
    team_code = models.CharField(primary_key=True, max_length=45)
    team_host = models.CharField(max_length=45, blank=True, null=True)
    team_name = models.CharField(max_length=45, blank=True, null=True)
    team_player = models.JSONField(blank=True)
    team_logo = models.CharField(max_length=45, blank=True, null=True)
    team_point = models.IntegerField(blank=True, null=True)
    team_area = models.CharField(max_length=45, blank=True, null=True)
    team_description = models.CharField(max_length=45, blank=True, null=True)
    team_games = models.JSONField(blank=True)
    

    class Meta:
        managed = False
        db_table = 'team_info'

# V2 로그인
class V2_UserInfo(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    user_id = models.CharField(max_length=45)
    password = models.CharField(max_length=200)
    user_birth = models.CharField(max_length=45)
    user_name = models.CharField(max_length=45)
    user_gender = models.CharField(max_length=45)
    user_nickname = models.CharField(max_length=45)
    marketing_agree = models.BooleanField()
    login_type = models.IntegerField()
    team_code = models.CharField(max_length=20)
    user_type = models.IntegerField()
    user_height = models.IntegerField()
    user_weight = models.IntegerField()
    user_position = models.CharField(max_length=45)
    user_match_list = models.JSONField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = "V2_user_info"

# V2 팀 생성
class V2_TeamInfo(models.Model):
    v2_team_code = models.CharField(primary_key=True, max_length=45)
    v2_team_host = models.CharField(max_length=45, blank=True, null=True)
    v2_team_players = models.JSONField(blank=True, null=True)
    v2_team_logo = models.CharField(max_length=200, blank=True, null=True)
    v2_team_name = models.CharField(max_length=45)
    v2_team_match = models.JSONField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'V2_team_info'

class V2_MatchInfo(models.Model):
    v2_match_code = models.CharField(primary_key=True, max_length=45)
    v2_match_host = models.CharField(max_length=45, blank=True, null=True)
    v2_match_location = models.CharField(max_length=45, blank=True, null=True) #장소
    v2_match_home = models.CharField(max_length=45)
    v2_match_away = models.CharField(max_length=45)
    v2_match_result = models.JSONField(blank=True, null=True)
    v2_match_schedule = models.CharField(max_length=45, default=None)
    v2_match_players = models.JSONField(blank=True, null=True)
    v2_match_goalplayers = models.JSONField(blank=True, null=True)
    v2_match_GPSplayers = models.JSONField(blank=True, null=True)
    v2_match_teamcode = models.JSONField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'V2_match_info'
