from django.db import models

# 순위?
class ARank(models.Model):
    a_team_code = models.CharField(primary_key=True, max_length=45)
    a_team_score = models.CharField(max_length=45)
    a_update_time = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = "a_rank"

# 경기 분석
class AnalGame(models.Model):
    anal_code = models.CharField(primary_key=True, max_length=45)
    anal_game_code = models.CharField(max_length=45)
    anal_gps_code = models.CharField(max_length=45)
    anal_team_code = models.CharField(max_length=45)
    anal_result = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = "anal_game"

# 선수 분석
class AnalPlayer(models.Model):
    anal_code = models.CharField(primary_key=True, max_length=45)
    anal_gps_code = models.CharField(max_length=45)
    anal_player_code = models.CharField(max_length=45)
    anal_result = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = "anal_player"

# 경기 GPS정보
class GameGps(models.Model):
    gps_code = models.CharField(primary_key=True, max_length=45)
    gps_game_code = models.CharField(max_length=45)
    gps_team_code = models.CharField(max_length=45)
    gps_player_code = models.CharField(max_length=45)
    gps_device_code = models.CharField(max_length=45)
    gps_time = models.CharField(max_length=45)
    gps_lat = models.CharField(max_length=45)
    gps_lon = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = "game_gps"

# 삭제필요(경기정보와 중복)
class GameInfo(models.Model):
    game_code = models.IntegerField(primary_key=True)
    game_home_team = models.CharField(max_length=45)
    game_away_team = models.CharField(max_length=45)
    game_home_player = models.CharField(max_length=45)
    game_away_player = models.CharField(max_length=45)
    game_home_result = models.CharField(max_length=45)
    game_away_result = models.CharField(max_length=45)
    game_type = models.CharField(max_length=45)
    game_time = models.CharField(max_length=45)
    game_place = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = "game_info"

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

# 리그 정보 
class LeagueInfo(models.Model):
    league_code = models.CharField(primary_key=True, max_length=45)
    league_host = models.CharField(max_length=45)
    league_name = models.CharField(max_length=45)
    league_startdate = models.CharField(max_length=45)
    league_enddate = models.CharField(max_length=45)
    league_startjoin = models.CharField(max_length=45)
    league_endjoin = models.CharField(max_length=45)
    league_team = models.JSONField()
    league_area = models.CharField(max_length=45, blank=True)
    league_logo = models.CharField(max_length=45, null=True, blank=True)
    league_winner = models.CharField(max_length=45, null=True, blank=True)
    league_gametype = models.CharField(max_length=45)
    league_official = models.CharField(max_length=45)
    league_description = models.CharField(max_length=45, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'league_info'

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

# 유저 정보 
class UserInfo(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    user_id = models.CharField(max_length=45)
    password = models.CharField(max_length=200)
    user_birth = models.CharField(max_length=45)
    user_name = models.CharField(max_length=45)
    user_gender = models.CharField(max_length=45)
    user_nickname = models.CharField(max_length=45)
    marketing_agree = models.BooleanField()
    login_type = models.IntegerField()

    class Meta:
        managed = False
        db_table = "user_info"

# 선수 정보 
class PlayerInfo(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    player_height = models.IntegerField(blank=True)
    player_weight = models.IntegerField(blank=True)
    player_point = models.IntegerField()
    player_area = models.CharField(max_length=45, blank=True)
    player_position = models.CharField(max_length=45, blank=True)
    player_description = models.CharField(max_length=200, blank=True)
    player_goal = models.IntegerField()
    player_assist = models.IntegerField()
    player_foot = models.CharField(max_length=10, blank=True)
    player_num = models.IntegerField(blank=True)
    player_team = models.CharField(max_length=45, blank=True)

    class Meta:
        managed = False
        db_table = "player_info"

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
    user_concept = models.IntegerField()
    user_height = models.IntegerField()
    user_weight = models.IntegerField()
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
