from django.db import models

##================ 앱 개발 ==================

class UserInfo(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    user_id = models.CharField(max_length=45)
    password = models.CharField(max_length=200)
    user_birth = models.CharField(max_length=45)
    user_name = models.CharField(max_length=45)
    user_gender = models.CharField(max_length=45)
    user_nickname = models.CharField(max_length=45)
    marketing_agree = models.BooleanField(default=0)
    login_type = models.CharField(max_length=45)
    user_type = models.CharField(max_length=45)
    user_height = models.IntegerField()
    user_weight = models.IntegerField()
    user_position = models.CharField(max_length=45)
    
    class Meta:
        managed = False
        db_table = "user_info"

# user_match 
class UserMatch(models.Model):
    match_code = models.CharField(max_length=45)
    user_code = models.CharField(max_length=45)
    match_schedule = models.DateField()
    service_type = models.CharField(max_length=20)
    match_type = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'user_match'

# user_match_info 테이블
class UserMatchInfo(models.Model):
    match_code = models.CharField(primary_key=True, max_length=45)
    ground_name = models.CharField(max_length=45)
    away_team = models.CharField(max_length=45, null=True, blank=True)
    away_team_name = models.CharField(max_length=45, null=True, blank=True)
    match_time = models.IntegerField(null=True, blank=True)
    match_name = models.CharField(max_length=45)
    match_schedule = models.DateField() 

    class Meta:
        managed = False
        db_table = "user_match_info"

class UserTeam(models.Model):
    user_code = models.CharField(max_length=45)
    team_code = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = "user_team"

class PendingInviteTeam(models.Model):
    user_code = models.CharField(max_length=45)
    team_code = models.CharField(max_length=45)
    direction = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = "pending_invite_team"

# team_info
class TeamInfo(models.Model):
    team_code = models.CharField(primary_key=True, max_length=45)
    team_host = models.CharField(max_length=45, null=True, blank=True)
    team_logo = models.CharField(max_length=200, null=True, blank=True)
    team_name = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "team_info"

class TeamMatch(models.Model):
    match_code = models.CharField(max_length=45)
    team_code = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'team_match'

# team_match_info 테이블
class TeamMatchInfo(models.Model):
    match_code = models.CharField(max_length=45, primary_key=True)
    ground_name = models.CharField(max_length=45)
    away_team = models.CharField(max_length=45, null=True, blank=True)
    away_team_name = models.CharField(max_length=45, null=True, blank=True)
    match_time = models.IntegerField()
    match_name = models.CharField(max_length=45)
    match_schedule = models.CharField(max_length=45)
    quarter_name_list = models.JSONField()

    class Meta:
        managed = False
        db_table = "team_match_info"

class VideoInfo(models.Model):
    match_code = models.CharField(max_length=45, null=True, blank=True)
    user_code = models.CharField(max_length=45, null=True, blank=True)
    quarter_name_list = models.JSONField(null=True, blank=True)
    type = models.CharField(max_length=20, null=True, blank=True)
    title = models.CharField(max_length=45)
    date = models.DateField()
    path = models.CharField(max_length=100, null=True)

    class Meta:
        managed = False
        db_table = "video_info"

class UserAnalMatch(models.Model):
    anal_code = models.AutoField(primary_key=True)
    match_code = models.CharField(max_length=45, null=True, blank=True)
    user_code = models.CharField(max_length=45, null=True, blank=True)
    ground_code = models.CharField(max_length=45, null=True, blank=True)
    quarter_name = models.CharField(max_length=45, null=True, blank=True)
    start = models.DateTimeField(null=True, blank=True)
    end = models.DateTimeField(null=True, blank=True)
    position = models.CharField(max_length=45, null=True, blank=True)
    home = models.CharField(max_length=45, null=True, blank=True)
    
    T_D = models.FloatField(null=True, blank=True)
    T_T = models.IntegerField(null=True, blank=True)
    T_DPM = models.FloatField(null=True, blank=True)
    T_LDT = models.IntegerField(null=True, blank=True)
    T_LDT_L = models.JSONField(null=True, blank=True)
    T_HDT = models.IntegerField(null=True, blank=True)
    T_HDT_L = models.JSONField(null=True, blank=True)
    T_MR = models.FloatField(null=True, blank=True)
    TI_H = models.JSONField(null=True, blank=True)
    T_AS = models.FloatField(null=True, blank=True)
    T_HS = models.FloatField(null=True, blank=True)
    T_HS_T = models.CharField(max_length=45, null=True, blank=True)
    T_IAS = models.FloatField(null=True, blank=True)
    T_MAS = models.FloatField(null=True, blank=True)
    T_FAS = models.FloatField(null=True, blank=True)
    T_MDAS = models.FloatField(null=True, blank=True)
    T_HTS = models.FloatField(null=True, blank=True)
    T_LTS = models.FloatField(null=True, blank=True)
    T_GS = models.FloatField(null=True, blank=True)
    T_LDTAS = models.FloatField(null=True, blank=True)
    T_LDTHS = models.FloatField(null=True, blank=True)
    T_HDTAS = models.FloatField(null=True, blank=True)
    T_HDTHS = models.FloatField(null=True, blank=True)
    TI_ST = models.JSONField(null=True, blank=True)
    TI_HH = models.JSONField(null=True, blank=True)
    T_AA = models.FloatField(null=True, blank=True)
    T_HA = models.FloatField(null=True, blank=True)
    T_HA_T = models.CharField(max_length=45, null=True, blank=True)
    T_LDTAA = models.FloatField(null=True, blank=True)
    T_LDTHA = models.FloatField(null=True, blank=True)
    T_HDTAA = models.FloatField(null=True, blank=True)
    T_HDTHA = models.FloatField(null=True, blank=True)
    TI_SA = models.JSONField(null=True, blank=True)
    T_S = models.IntegerField(null=True, blank=True)
    T_ASD = models.FloatField(null=True, blank=True)
    T_ASS = models.FloatField(null=True, blank=True)
    T_ASA = models.FloatField(null=True, blank=True)
    T_TSD = models.FloatField(null=True, blank=True)
    T_HSD = models.FloatField(null=True, blank=True)
    T_LSD = models.FloatField(null=True, blank=True)
    T_SDPD = models.FloatField(null=True, blank=True)
    T_S_L = models.JSONField(null=True, blank=True)

    A_D = models.FloatField(null=True, blank=True)
    A_T = models.IntegerField(null=True, blank=True)
    A_TPT = models.IntegerField(null=True, blank=True)
    A_DPM = models.FloatField(null=True, blank=True)
    A_LDT = models.FloatField(null=True, blank=True)
    A_LDT_L = models.JSONField(null=True, blank=True)
    A_HDT = models.FloatField(null=True, blank=True)
    A_HDT_L = models.JSONField(null=True, blank=True)
    A_MR = models.FloatField(null=True, blank=True)
    AI_H = models.JSONField(null=True, blank=True)
    A_AS = models.FloatField(null=True, blank=True)
    A_HS = models.FloatField(null=True, blank=True)
    A_HS_T = models.CharField(max_length=45, null=True, blank=True)
    A_HTS = models.FloatField(null=True, blank=True)
    A_LTS = models.FloatField(null=True, blank=True)
    A_GS = models.FloatField(null=True, blank=True)
    A_LDTAS = models.FloatField(null=True, blank=True)
    A_LDTHS = models.FloatField(null=True, blank=True)
    A_HDTAS = models.IntegerField(null=True, blank=True)
    A_HDTHS = models.IntegerField(null=True, blank=True)
    A_ASPT = models.IntegerField(null=True, blank=True)
    AI_HH = models.JSONField(null=True, blank=True)
    A_AA = models.FloatField(null=True, blank=True)
    A_HA = models.FloatField(null=True, blank=True)
    A_HA_T = models.CharField(max_length=45, null=True, blank=True)
    A_LDTAA = models.FloatField(null=True, blank=True)
    A_LDTHA = models.FloatField(null=True, blank=True)
    A_HDTAA = models.FloatField(null=True, blank=True)
    A_HDTHA = models.FloatField(null=True, blank=True)
    A_AAPT = models.IntegerField(null=True, blank=True)
    A_S = models.IntegerField(null=True, blank=True)
    A_ASD = models.FloatField(null=True, blank=True)
    A_ASS = models.FloatField(null=True, blank=True)
    A_ASA = models.FloatField(null=True, blank=True)
    A_TSD = models.FloatField(null=True, blank=True)
    A_HSD = models.FloatField(null=True, blank=True)
    A_LSD = models.FloatField(null=True, blank=True)
    A_SDPD = models.FloatField(null=True, blank=True)
    A_S_L = models.JSONField(null=True, blank=True)

    D_D = models.FloatField(null=True, blank=True)
    D_T = models.IntegerField(null=True, blank=True)
    D_TPT = models.IntegerField(null=True, blank=True)
    D_DPM = models.FloatField(null=True, blank=True)
    D_LDT = models.IntegerField(null=True, blank=True)
    D_LDT_L = models.JSONField(null=True, blank=True)
    D_HDT = models.FloatField(null=True, blank=True)
    D_HDT_L = models.JSONField(null=True, blank=True)
    D_MR = models.FloatField(null=True, blank=True)
    DI_H = models.JSONField(null=True, blank=True)
    D_AS = models.FloatField(null=True, blank=True)
    D_HS = models.FloatField(null=True, blank=True)
    D_HS_T = models.CharField(max_length=45, null=True, blank=True)
    D_HTS = models.FloatField(null=True, blank=True)
    D_LTS = models.FloatField(null=True, blank=True)
    D_GS = models.FloatField(null=True, blank=True)
    D_LDTAS = models.FloatField(null=True, blank=True)
    D_LDTHS = models.FloatField(null=True, blank=True)
    D_HDTAS = models.FloatField(null=True, blank=True)
    D_HDTHS = models.FloatField(null=True, blank=True)
    D_ASPT = models.IntegerField(null=True, blank=True)
    DI_HH = models.JSONField(null=True, blank=True)
    D_AA = models.FloatField(null=True, blank=True)
    D_HA = models.FloatField(null=True, blank=True)
    D_HA_T = models.CharField(max_length=45, null=True, blank=True)
    D_LDTAA = models.FloatField(null=True, blank=True)
    D_LDTHA = models.FloatField(null=True, blank=True)
    D_HDTAA = models.FloatField(null=True, blank=True)
    D_HDTHA = models.FloatField(null=True, blank=True)
    D_AAPT = models.IntegerField(null=True, blank=True)
    D_S = models.IntegerField(null=True, blank=True)
    D_ASD = models.FloatField(null=True, blank=True)
    D_ASS = models.FloatField(null=True, blank=True)
    D_ASA = models.FloatField(null=True, blank=True)
    D_TSD = models.FloatField(null=True, blank=True)
    D_HSD = models.FloatField(null=True, blank=True)
    D_LSD = models.FloatField(null=True, blank=True)
    D_SDPD = models.FloatField(null=True, blank=True)
    D_S_L = models.JSONField(null=True, blank=True)

    point = models.JSONField (null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'user_anal_match'

        




# ===========================================

# =============== old version ===============

# ===========================================

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


