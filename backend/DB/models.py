from django.db import models

##================ 현재 사용중인 실제 DB 테이블 ==================

# 사용자 기본 정보 테이블
class User(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    user_id = models.CharField(max_length=45)
    password = models.CharField(max_length=200)
    login_type = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "user"

# 사용자 상세 정보 테이블
class UserInfo(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    birth = models.CharField(max_length=45)
    name = models.CharField(max_length=45)
    gender = models.CharField(max_length=45)
    marketing_agree = models.JSONField()
    user_type = models.CharField(max_length=45)
    level = models.CharField(max_length=45)
    height = models.IntegerField()
    weight = models.IntegerField()
    preferred_position = models.CharField(max_length=45)
    activity_area = models.CharField(max_length=45)
    ai_type = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "user_info"

# 팀 정보 테이블
class TeamInfo(models.Model):
    team_code = models.CharField(primary_key=True, max_length=45)
    host = models.CharField(max_length=45)
    name = models.CharField(max_length=45)
    local = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_info"

# 팀 가입 요청 테이블
class TeamJoinRequest(models.Model):
    REQUEST_TYPE_CHOICES = [
        ('player_to_team', '선수가 팀에 가입 신청'),
        ('team_to_player', '팀이 선수에게 영입 제안'),
    ]
    
    STATUS_CHOICES = [
        ('pending', '대기중'),
        ('accepted', '수락됨'),
        ('rejected', '거절됨'),
        ('cancelled', '취소됨'),
    ]
    
    request_id = models.AutoField(primary_key=True)
    team_code = models.CharField(max_length=45)
    user_code = models.CharField(max_length=45)
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(null=True, blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    responded_by = models.CharField(max_length=45, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_join_request"

# 팀 알림 테이블
class TeamNotification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('join_request', '가입 신청'),
        ('join_accepted', '가입 수락'),
        ('join_rejected', '가입 거절'),
        ('team_invite', '팀 초대'),
        ('invite_accepted', '초대 수락'),
        ('invite_rejected', '초대 거절'),
        ('member_left', '멤버 탈퇴'),
        ('member_kicked', '멤버 추방'),
    ]
    
    notification_id = models.AutoField(primary_key=True)
    recipient_code = models.CharField(max_length=45)
    sender_code = models.CharField(max_length=45, null=True, blank=True)
    team_code = models.CharField(max_length=45)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=100)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_request_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_notification"

# 팀 매치 테이블
class TeamMatch(models.Model):
    match_code = models.CharField(max_length=45)
    team_code = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'team_match'

# 팀 매치 교차 테이블
class TeamMatchCross(models.Model):
    id = models.AutoField(primary_key=True)
    match_code = models.CharField(max_length=45)
    team_code = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_match_cross"

# 팀 매치 쿼터 교차 테이블
class TeamMatchQuaterCross(models.Model):
    id = models.AutoField(primary_key=True)
    match_code = models.CharField(max_length=45)
    quater_code = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_match_quater_cross"

# 팀 쿼터 테이블
class TeamQuater(models.Model):
    quater_code = models.CharField(primary_key=True, max_length=45)
    name = models.CharField(max_length=45)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=45)
    home = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_quater"

# 팀 비디오 폴더 테이블
class TeamVideoFolder(models.Model):
    folder_code = models.CharField(primary_key=True, max_length=45)
    team_code = models.CharField(max_length=45)
    name = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_video_folder"

# 팀 비디오 테이블
class TeamVideo(models.Model):
    video_code = models.CharField(primary_key=True, max_length=45)
    folder_code = models.CharField(max_length=45)
    quater_code = models.CharField(max_length=45)
    url = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_video"

# 플레이어 팀 교차 테이블
class PlayerTeamCross(models.Model):
    id = models.AutoField(primary_key=True)
    user_code = models.CharField(max_length=45)
    team_code = models.CharField(max_length=45)
    role = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "player_team_cross"

# 플레이어 매치 테이블 (경기 정보)
class PlayerMatch(models.Model):
    match_code = models.CharField(primary_key=True, max_length=45)
    ground_code = models.CharField(max_length=45)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    name = models.CharField(max_length=45)
    standard = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "player_match"

# 플레이어 매치 교차 테이블 (플레이어가 참여한 경기 정보)
class PlayerMatchCross(models.Model):
    id = models.AutoField(primary_key=True)
    match_code = models.CharField(max_length=45)
    user_code = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "player_match_cross"

# 플레이어 매치 쿼터 교차 테이블 (각 경기의 쿼터 정보)
class PlayerMatchQuarterCross(models.Model):
    id = models.AutoField(primary_key=True)
    match_code = models.CharField(max_length=45)
    quarter_code = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "player_match_quarter_cross"

# 플레이어 쿼터 테이블
class PlayerQuarter(models.Model):
    quarter_code = models.CharField(primary_key=True, max_length=45)
    name = models.CharField(max_length=45)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=45)
    home = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "player_quarter"

# 플레이어 분석 데이터 테이블 (각 쿼터의 분석 데이터)
class PlayerAnal(models.Model):
    quarter_code = models.CharField(primary_key=True, max_length=45)
    
    # Total 관련 필드들
    T_D = models.DecimalField(max_digits=8, decimal_places=2)  # 이동거리 (km)
    T_T = models.IntegerField()  # 이동시간 (분)
    T_DPM = models.DecimalField(max_digits=6, decimal_places=2)  # 1분당 이동거리 (m)
    T_AS = models.DecimalField(max_digits=5, decimal_places=2)  # 평균속력 (km/h)
    T_HS = models.DecimalField(max_digits=5, decimal_places=2)  # 최고속력 (km/h)
    T_HS_T = models.DateTimeField()  # 최고속력 발생시각 (time)
    T_Q1_AS = models.DecimalField(max_digits=5, decimal_places=2)  # 1사분 평균속력 (km/h)
    T_Q2_AS = models.DecimalField(max_digits=5, decimal_places=2)  # 후반 평균속력 (km/h)
    T_Drop_AS = models.DecimalField(max_digits=7, decimal_places=2)  # 전반 후반 속도 차이 (km/h)
    T_HTS = models.DecimalField(max_digits=5, decimal_places=2)  # 상위 10% 속력 (km/h)
    T_LTS = models.DecimalField(max_digits=5, decimal_places=2)  # 하위 10% 속력 (km/h)
    T_GS = models.DecimalField(max_digits=5, decimal_places=2)  # 상위-하위 속력차 (km/h)
    T_AA = models.DecimalField(max_digits=5, decimal_places=2)  # 평균가속도 (m/s^2)
    T_HA = models.DecimalField(max_digits=5, decimal_places=2)  # 최고가속도 (m/s^2)
    T_HA_T = models.DateTimeField()  # 최고가속도 발생시각 (time)
    T_LDT = models.IntegerField()  # 90-150° 방향전환 횟수 (번)
    T_HDT = models.IntegerField()  # 150-180° 방향전환 횟수 (번)
    T_MR = models.DecimalField(max_digits=5, decimal_places=2)  # 활동 면적 (%)
    T_S = models.IntegerField()  # 스프린트 횟수 (번)
    T_TSD = models.DecimalField(max_digits=8, decimal_places=2)  # 스프린트 총 거리 (m)
    T_ASD = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 평균 거리 (m)
    T_HSD = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최장 거리 (m)
    T_LSD = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최소 거리 (m)
    T_SDPD = models.DecimalField(max_digits=5, decimal_places=2)  # 총 이동거리 당 스프린트 거리 (%)
    T_ASS = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 평균속력 (km/h)
    T_HSS = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최고속력 (km/h)
    T_ASA = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 평균가속도 (m/s^2)
    T_HSA = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최고가속도 (m/s^2)
    T_AS_L = models.TextField()  # 평균속력 10개 리스트 (-)
    T_AA_L = models.TextField()  # 평균가속도 10개 리스트 (-)
    T_S_L = models.TextField()  # 스프린트 리스트 (-)
    T_LDT_L = models.TextField()  # 90-150° 방향전환 리스트 (-)
    T_HDT_L = models.TextField()  # 150-180° 방향전환 리스트 (-)
    T_HMAP = models.JSONField()  # 히트맵 리스트 (-)
    T_SMAP = models.JSONField()  # 스프린트 리스트 (-)
    T_DMAP = models.JSONField()  # 방향전환 리스트 (-)
    
    # Attack 관련 필드들
    A_D = models.DecimalField(max_digits=8, decimal_places=2)  # 이동거리 (km)
    A_T = models.IntegerField()  # 이동시간 (분)
    A_DPM = models.DecimalField(max_digits=6, decimal_places=2)  # 1분당 이동거리 (m)
    A_TPT = models.DecimalField(max_digits=5, decimal_places=2)  # 해당 시간 비율 (%)
    A_AS = models.DecimalField(max_digits=5, decimal_places=2)  # 평균속력 (km/h)
    A_HS = models.DecimalField(max_digits=5, decimal_places=2)  # 최고속력 (km/h)
    A_HS_T = models.DateTimeField()  # 최고속력 발생시각 (time)
    A_Q1_AS = models.DecimalField(max_digits=5, decimal_places=2)  # 1사분 평균속력 (km/h)
    A_Q2_AS = models.DecimalField(max_digits=5, decimal_places=2)  # 후반 평균속력 (km/h)
    A_Drop_AS = models.DecimalField(max_digits=7, decimal_places=2)  # 전반 후반 속도 차이 (km/h)
    A_HTS = models.DecimalField(max_digits=5, decimal_places=2)  # 상위 10% 속력 (km/h)
    A_LTS = models.DecimalField(max_digits=5, decimal_places=2)  # 하위 10% 속력 (km/h)
    A_GS = models.DecimalField(max_digits=5, decimal_places=2)  # 상위-하위 속력차 (km/h)
    A_AA = models.DecimalField(max_digits=5, decimal_places=2)  # 평균가속도 (m/s^2)
    A_HA = models.DecimalField(max_digits=5, decimal_places=2)  # 최고가속도 (m/s^2)
    A_HA_T = models.DateTimeField()  # 최고가속도 발생시각 (time)
    A_LDT = models.IntegerField()  # 90-150° 방향전환 횟수 (번)
    A_HDT = models.IntegerField()  # 150-180° 방향전환 횟수 (번)
    A_MR = models.DecimalField(max_digits=5, decimal_places=2)  # 활동 면적 (%)
    A_S = models.IntegerField()  # 스프린트 횟수 (번)
    A_TSD = models.DecimalField(max_digits=8, decimal_places=2)  # 스프린트 총 거리 (m)
    A_ASD = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 평균 거리 (m)
    A_HSD = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최장 거리 (m)
    A_LSD = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최소 거리 (m)
    A_ASS = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 평균속력 (km/h)
    A_HSS = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최고속력 (km/h)
    A_ASA = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 평균가속도 (m/s^2)
    A_HSA = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최고가속도 (m/s^2)
    A_AS_L = models.TextField()  # 평균속력 10개 리스트 (-)
    A_AA_L = models.TextField()  # 평균가속도 10개 리스트 (-)
    A_S_L = models.TextField()  # 스프린트 리스트 (-)
    A_LDT_L = models.TextField()  # 90-150° 방향전환 리스트 (-)
    A_HDT_L = models.TextField()  # 150-180° 방향전환 리스트 (-)
    
    # Defense 관련 필드들
    D_D = models.DecimalField(max_digits=8, decimal_places=2)  # 이동거리 (km)
    D_T = models.IntegerField()  # 이동시간 (분)
    D_DPM = models.DecimalField(max_digits=6, decimal_places=2)  # 1분당 이동거리 (m)
    D_TPT = models.DecimalField(max_digits=5, decimal_places=2)  # 해당 시간 비율 (%)
    D_AS = models.DecimalField(max_digits=5, decimal_places=2)  # 평균속력 (km/h)
    D_HS = models.DecimalField(max_digits=5, decimal_places=2)  # 최고속력 (km/h)
    D_HS_T = models.DateTimeField()  # 최고속력 발생시각 (time)
    D_Q1_AS = models.DecimalField(max_digits=5, decimal_places=2)  # 1사분 평균속력 (km/h)
    D_Q2_AS = models.DecimalField(max_digits=5, decimal_places=2)  # 후반 평균속력 (km/h)
    D_Drop_AS = models.DecimalField(max_digits=7, decimal_places=2)  # 전반 후반 속도 차이 (km/h)
    D_HTS = models.DecimalField(max_digits=5, decimal_places=2)  # 상위 10% 속력 (km/h)
    D_LTS = models.DecimalField(max_digits=5, decimal_places=2)  # 하위 10% 속력 (km/h)
    D_GS = models.DecimalField(max_digits=5, decimal_places=2)  # 상위-하위 속력차 (km/h)
    D_AA = models.DecimalField(max_digits=5, decimal_places=2)  # 평균가속도 (m/s^2)
    D_HA = models.DecimalField(max_digits=5, decimal_places=2)  # 최고가속도 (m/s^2)
    D_HA_T = models.DateTimeField()  # 최고가속도 발생시각 (time)
    D_LDT = models.IntegerField()  # 90-150° 방향전환 횟수 (번)
    D_HDT = models.IntegerField()  # 150-180° 방향전환 횟수 (번)
    D_MR = models.DecimalField(max_digits=5, decimal_places=2)  # 활동 면적 (%)
    D_S = models.IntegerField()  # 스프린트 횟수 (번)
    D_TSD = models.DecimalField(max_digits=8, decimal_places=2)  # 스프린트 총 거리 (m)
    D_ASD = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 평균 거리 (m)
    D_HSD = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최장 거리 (m)
    D_LSD = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최소 거리 (m)
    D_ASS = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 평균속력 (km/h)
    D_HSS = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최고속력 (km/h)
    D_ASA = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 평균가속도 (m/s^2)
    D_HSA = models.DecimalField(max_digits=5, decimal_places=2)  # 스프린트 최고가속도 (m/s^2)
    D_AS_L = models.TextField()  # 평균속력 10개 리스트 (-)
    D_AA_L = models.TextField()  # 평균가속도 10개 리스트 (-)
    D_S_L = models.TextField()  # 스프린트 리스트 (-)
    D_LDT_L = models.TextField()  # 90-150° 방향전환 리스트 (-)
    D_HDT_L = models.TextField()  # 150-180° 방향전환 리스트 (-)
    
    # 포인트 관련 필드들
    point_total = models.IntegerField()  # 평점 점수
    point_attack = models.IntegerField()  # 공격 점수  
    point_defense = models.IntegerField()  # 수비 점수
    point_stamina = models.IntegerField()  # 체력 점수
    point_positiveness = models.IntegerField()  # 적극성 점수
    point_speed = models.IntegerField()  # 속력 점수
    point_acceleration = models.IntegerField()  # 가속도 점수
    point_sprint = models.IntegerField()  # 스프린트 점수
    
    # 노이즈 관련 필드들
    noise_time = models.DecimalField(max_digits=5, decimal_places=2)  # 시간 노이즈 (-)
    noise_gps = models.DecimalField(max_digits=5, decimal_places=2)  # GPS 리스트 (-)
    noise_reliability = models.DecimalField(max_digits=5, decimal_places=2)  # 노이즈 신뢰도 (-)
    
    # 타임스탬프 필드들
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "player_anal"

# 플레이어 비디오 폴더 테이블
class PlayerVideoFolder(models.Model):
    folder_code = models.CharField(primary_key=True, max_length=45)
    user_code = models.CharField(max_length=45)
    name = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "player_video_folder"

# 플레이어 비디오 테이블
class PlayerVideo(models.Model):
    video_code = models.CharField(primary_key=True, max_length=45)
    folder_code = models.CharField(max_length=45)
    quarter_code = models.CharField(max_length=45)
    url = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "player_video"

# 플레이어 AI 테이블
class PlayerAi(models.Model):
    match_code = models.CharField(primary_key=True, max_length=45)
    answer = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "player_ai"

# 그라운드 정보 테이블
class GroundInfo(models.Model):
    ground_code = models.CharField(primary_key=True, max_length=45)
    who_make = models.CharField(max_length=45)
    name = models.CharField(max_length=45)
    address = models.CharField(max_length=45)
    corner_gps = models.JSONField()
    corner_utm = models.JSONField()
    center = models.JSONField()
    long_side_length = models.FloatField()
    short_side_length = models.FloatField()
    rotate_deg = models.FloatField()
    rotated_corners = models.JSONField()
    new_long = models.JSONField()
    new_short = models.JSONField()
    north_side_utm = models.JSONField()
    south_side_utm = models.JSONField()
    east_side_utm = models.JSONField()
    west_side_utm = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'ground_info'

# 업로드 테이블
class Upload(models.Model):
    id = models.AutoField(primary_key=True)
    # 추가 필드는 실제 테이블 구조에 따라 정의 필요
    
    class Meta:
        managed = False
        db_table = "upload"