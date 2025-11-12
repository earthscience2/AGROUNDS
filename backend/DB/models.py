from django.db import models

# 사용자 기본 정보 테이블
class User(models.Model):
    LOGIN_TYPE_CHOICES = [
        ('apple', 'Apple'),
        ('kakao', 'Kakao'),
        ('naver', 'Naver'),
        ('messi', 'Messi'),
        ('guest', 'Guest'),
    ]
    
    user_code = models.CharField(primary_key=True, max_length=45)
    user_id = models.CharField(max_length=45)
    password = models.CharField(max_length=200)
    login_type = models.CharField(max_length=45, choices=LOGIN_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "user"

# 사용자 상세 정보 테이블
class UserInfo(models.Model):
    USER_TYPE_CHOICES = [
        ('player', 'Player'),
        ('coach', 'Coach'),
        ('youth', 'Youth'),
        ('parents', 'Parents'),
    ]
    
    LEVEL_CHOICES = [
        ('youth', 'Youth'),
        ('adult', 'Adult'),
        ('pro', 'Pro'),
    ]
    
    POSITION_CHOICES = [
        ('LWF', 'LWF'),
        ('ST', 'ST'),
        ('RWF', 'RWF'),
        ('LWM', 'LWM'),
        ('CAM', 'CAM'),
        ('RWM', 'RWM'),
        ('LM', 'LM'),
        ('CM', 'CM'),
        ('RM', 'RM'),
        ('CDM', 'CDM'),
        ('LWB', 'LWB'),
        ('RWB', 'RWB'),
        ('LB', 'LB'),
        ('CB', 'CB'),
        ('RB', 'RB'),
        ('GK', 'GK'),
    ]
    
    AI_TYPE_CHOICES = [
        ('strict_leader', 'Strict Leader'),
        ('emotional_support_girl', 'Emotional Support Girl'),
        ('emotional_support_boy', 'Emotional Support Boy'),
        ('mentor', 'Mentor'),
        ('data_analyst', 'Data Analyst'),
        ('cheerleader', 'Cheerleader'),
        ('casual_friend', 'Casual Friend'),
    ]
    
    user_code = models.CharField(primary_key=True, max_length=45)
    birth = models.CharField(max_length=45)
    name = models.CharField(max_length=45)
    gender = models.CharField(max_length=45)
    marketing_agree = models.JSONField()
    user_type = models.CharField(max_length=45, choices=USER_TYPE_CHOICES)
    level = models.CharField(max_length=45, choices=LEVEL_CHOICES)
    height = models.IntegerField()
    weight = models.IntegerField()
    preferred_position = models.CharField(max_length=45, choices=POSITION_CHOICES)
    activity_area = models.CharField(max_length=45)
    ai_type = models.CharField(max_length=45, choices=AI_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "user_info"

# 팀 정보 테이블
class TeamInfo(models.Model):
    team_code = models.CharField(primary_key=True, max_length=45)
    name = models.CharField(max_length=45)
    local = models.CharField(max_length=45)
    introduce = models.CharField(max_length=200, null=True, blank=True)
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

# 통합 알림 테이블
class Notification(models.Model):
    CATEGORY_CHOICES = [
        ('team', '팀'),
        ('analysis', '분석'),
        ('system', '시스템'),
        ('event', '이벤트'),
        ('social', '소셜'),
        ('achievement', '성취'),
    ]
    
    NOTIFICATION_TYPE_CHOICES = [
        # 팀 관련
        ('team_join_request', '팀 가입 신청'),
        ('team_join_accepted', '팀 가입 수락'),
        ('team_join_rejected', '팀 가입 거절'),
        ('team_invite_sent', '팀 초대 발송'),
        ('team_invite_received', '팀 초대 수신'),
        ('team_invite_accepted', '팀 초대 수락'),
        ('team_invite_rejected', '팀 초대 거절'),
        ('team_member_joined', '팀 멤버 가입'),
        ('team_member_left', '팀 멤버 탈퇴'),
        ('team_member_kicked', '팀 멤버 추방'),
        ('team_role_changed', '팀 역할 변경'),
        ('team_created', '팀 생성'),
        ('team_updated', '팀 정보 수정'),
        # 분석 관련
        ('analysis_completed', '분석 완료'),
        ('analysis_failed', '분석 실패'),
        ('performance_report', '성능 리포트'),
        ('weekly_summary', '주간 요약'),
        ('monthly_summary', '월간 요약'),
        # 시스템 관련
        ('system_maintenance', '시스템 점검'),
        ('app_update', '앱 업데이트'),
        ('feature_announcement', '기능 공지'),
        ('service_notice', '서비스 공지'),
        ('account_security', '계정 보안'),
        # 이벤트 관련
        ('event_start', '이벤트 시작'),
        ('event_end', '이벤트 종료'),
        ('event_reward', '이벤트 보상'),
        # 소셜 관련
        ('friend_request', '친구 요청'),
        ('friend_accepted', '친구 수락'),
        ('player_follow', '플레이어 팔로우'),
        ('mention', '멘션'),
        # 성취 관련
        ('goal_achieved', '목표 달성'),
        ('milestone_reached', '마일스톤 달성'),
        ('badge_earned', '배지 획득'),
        ('level_up', '레벨 업'),
        ('record_broken', '기록 갱신'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', '낮음'),
        ('normal', '보통'),
        ('high', '높음'),
        ('urgent', '긴급'),
        ('critical', '중요'),
    ]
    
    notification_id = models.AutoField(primary_key=True)
    recipient_code = models.CharField(max_length=45)
    sender_code = models.CharField(max_length=45, null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    title = models.CharField(max_length=100)
    message = models.TextField()
    short_message = models.CharField(max_length=50, null=True, blank=True)
    related_data = models.JSONField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "notification"

# 팀 매치 테이블
class TeamMatch(models.Model):
    STANDARD_CHOICES = [
        ('south', 'South'),
        ('north', 'North'),
    ]
    
    match_code = models.CharField(primary_key=True, max_length=45)
    ground_code = models.CharField(max_length=45)
    upload_code = models.CharField(max_length=45)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    name = models.CharField(max_length=45)
    standard = models.CharField(max_length=45, choices=STANDARD_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

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
class TeamMatchQuarterCross(models.Model):
    id = models.AutoField(primary_key=True)
    match_code = models.CharField(max_length=45)
    quarter_code = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_match_quarter_cross"

# 팀 쿼터 테이블
class TeamQuarter(models.Model):
    HOME_CHOICES = [
        ('west', 'West'),
        ('east', 'East'),
    ]
    
    quarter_code = models.CharField(primary_key=True, max_length=45)
    name = models.CharField(max_length=45)
    player_anal = models.JSONField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    home = models.CharField(max_length=10, choices=HOME_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        managed = False
        db_table = "team_quarter"

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
    quarter_code = models.CharField(max_length=45)
    url = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_video"

# 팀 AI 테이블
class TeamAi(models.Model):
    match_code = models.CharField(primary_key=True, max_length=45)
    answer = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_ai"

# 팀 분석 테이블 (실제 DB 구조에 맞게 완전히 재구성)
class TeamAnal(models.Model):
    quarter_code = models.CharField(primary_key=True, max_length=50)  # varchar(50)
    
    # Total 관련 필드들
    T_D = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동거리 (km)
    T_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동시간 (분)
    T_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 평균속력 (km/h)
    T_HS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 최고속력 (km/h)
    T_HS_T = models.DateTimeField(null=True, blank=True)  # 최고속력 발생시각 (time)
    T_Q1_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1사분 평균속력 (km/h)
    T_Q2_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 후반 평균속력 (km/h)
    T_Drop_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 전반 후반 속도 차이 (km/h)
    T_HTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위 10% 속력 (km/h)
    T_LTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 하위 10% 속력 (km/h)
    T_GS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위-하위 속력차 (km/h)
    T_AA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 평균가속도 (m/s^2)
    T_HA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 최고가속도 (m/s^2)
    T_HA_T = models.DateTimeField(null=True, blank=True)  # 최고가속도 발생시각 (time)
    T_AS_L = models.JSONField(null=True, blank=True)  # 평균속력 리스트 (JSON)
    T_AA_L = models.JSONField(null=True, blank=True)  # 평균가속도 리스트 (JSON)
    
    # Attack 관련 필드들
    A_D = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동거리 (km)
    A_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동시간 (분)
    A_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 평균속력 (km/h)
    A_HS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 최고속력 (km/h)
    A_HS_T = models.DateTimeField(null=True, blank=True)  # 최고속력 발생시각 (time)
    A_Q1_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1사분 평균속력 (km/h)
    A_Q2_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 후반 평균속력 (km/h)
    A_Drop_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 전반 후반 속도 차이 (km/h)
    A_HTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위 10% 속력 (km/h)
    A_LTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 하위 10% 속력 (km/h)
    A_GS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위-하위 속력차 (km/h)
    A_AA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 평균가속도 (m/s^2)
    A_HA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 최고가속도 (m/s^2)
    A_HA_T = models.DateTimeField(null=True, blank=True)  # 최고가속도 발생시각 (time)
    A_AS_L = models.JSONField(null=True, blank=True)  # 평균속력 리스트 (JSON)
    A_AA_L = models.JSONField(null=True, blank=True)  # 평균가속도 리스트 (JSON)
    
    # Defense 관련 필드들
    D_D = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동거리 (km)
    D_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동시간 (분)
    D_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 평균속력 (km/h)
    D_HS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 최고속력 (km/h)
    D_HS_T = models.DateTimeField(null=True, blank=True)  # 최고속력 발생시각 (time)
    D_Q1_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1사분 평균속력 (km/h)
    D_Q2_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 후반 평균속력 (km/h)
    D_Drop_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 전반 후반 속도 차이 (km/h)
    D_HTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위 10% 속력 (km/h)
    D_LTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 하위 10% 속력 (km/h)
    D_GS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위-하위 속력차 (km/h)
    D_AA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 평균가속도 (m/s^2)
    D_HA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 최고가속도 (m/s^2)
    D_HA_T = models.DateTimeField(null=True, blank=True)  # 최고가속도 발생시각 (time)
    D_AS_L = models.JSONField(null=True, blank=True)  # 평균속력 리스트 (JSON)
    D_AA_L = models.JSONField(null=True, blank=True)  # 평균가속도 리스트 (JSON)
    
    # 팀 전용 필드들 (Coordination, Density, Stretch, Synchronization, Length, Width)
    T_CO = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)  # Total 팀 조율
    A_CO = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)  # Attack 팀 조율
    D_CO = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)  # Defense 팀 조율
    T_CO_L = models.JSONField(null=True, blank=True)  # Total 팀 조율 리스트
    A_CO_L = models.JSONField(null=True, blank=True)  # Attack 팀 조율 리스트
    D_CO_L = models.JSONField(null=True, blank=True)  # Defense 팀 조율 리스트
    
    T_DE = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)  # Total 밀도
    A_DE = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)  # Attack 밀도
    D_DE = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)  # Defense 밀도
    T_DE_L = models.JSONField(null=True, blank=True)  # Total 밀도 리스트
    A_DE_L = models.JSONField(null=True, blank=True)  # Attack 밀도 리스트
    D_DE_L = models.JSONField(null=True, blank=True)  # Defense 밀도 리스트
    
    T_SS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Total 신축성
    A_SS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Attack 신축성
    D_SS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Defense 신축성
    T_SS_L = models.JSONField(null=True, blank=True)  # Total 신축성 리스트
    A_SS_L = models.JSONField(null=True, blank=True)  # Attack 신축성 리스트
    D_SS_L = models.JSONField(null=True, blank=True)  # Defense 신축성 리스트
    
    T_SI = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Total 동기화
    A_SI = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Attack 동기화
    D_SI = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Defense 동기화
    T_SI_L = models.JSONField(null=True, blank=True)  # Total 동기화 리스트
    A_SI_L = models.JSONField(null=True, blank=True)  # Attack 동기화 리스트
    D_SI_L = models.JSONField(null=True, blank=True)  # Defense 동기화 리스트
    
    T_L = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Total 길이
    A_L = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Attack 길이
    D_L = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Defense 길이
    T_L_L = models.JSONField(null=True, blank=True)  # Total 길이 리스트
    A_L_L = models.JSONField(null=True, blank=True)  # Attack 길이 리스트
    D_L_L = models.JSONField(null=True, blank=True)  # Defense 길이 리스트
    
    T_W = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Total 너비
    A_W = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Attack 너비
    D_W = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Defense 너비
    T_W_L = models.JSONField(null=True, blank=True)  # Total 너비 리스트
    A_W_L = models.JSONField(null=True, blank=True)  # Attack 너비 리스트
    D_W_L = models.JSONField(null=True, blank=True)  # Defense 너비 리스트
    
    # 팀 전용 맵 데이터
    T_HMAP = models.JSONField(null=True, blank=True)  # 히트맵 데이터
    T_PMAP = models.JSONField(null=True, blank=True)  # 포지션 맵 데이터
    T_ZMAP = models.JSONField(null=True, blank=True)  # 존 맵 데이터
    
    # 노이즈 관련 필드들
    N_T = models.JSONField(null=True, blank=True)  # 노이즈 시간 (JSON)
    N_G = models.JSONField(null=True, blank=True)  # 노이즈 GPS (JSON)
    N_P = models.JSONField(null=True, blank=True)  # 노이즈 성능 (JSON)
    
    # 분석 타입
    ANALYSIS_TYPE_CHOICES = [
        ('youth', 'Youth'),
        ('amateur', 'Amateur'),
        ('pro', 'Pro'),
    ]
    AN_T = models.CharField(max_length=10, choices=ANALYSIS_TYPE_CHOICES, null=True, blank=True)  # 분석 타입
    
    # 팀 전용 평균 필드
    available_players_avg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 참여 선수 평균
    
    # 포인트 관련 필드들 (팀 전용 포인트 추가)
    point_total = models.IntegerField(null=True, blank=True)  # 평점 점수
    point_attack = models.IntegerField(null=True, blank=True)  # 공격 점수  
    point_defense = models.IntegerField(null=True, blank=True)  # 수비 점수
    point_stamina = models.IntegerField(null=True, blank=True)  # 체력 점수
    point_organization = models.IntegerField(null=True, blank=True)  # 조직력 점수 (팀 전용)
    point_speed = models.IntegerField(null=True, blank=True)  # 속력 점수
    point_acceleration = models.IntegerField(null=True, blank=True)  # 가속도 점수
    point_balance = models.IntegerField(null=True, blank=True)  # 균형 점수 (팀 전용)
    
    # 타임스탬프 필드들
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        managed = False
        db_table = "team_anal"

# 플레이어 팀 교차 테이블
class PlayerTeamCross(models.Model):
    id = models.AutoField(primary_key=True)
    user_code = models.CharField(max_length=45)
    team_code = models.CharField(max_length=45)
    role = models.CharField(max_length=45)
    number = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "player_team_cross"

# 플레이어 매치 테이블 (경기 정보)
class PlayerMatch(models.Model):
    STATUS_CHOICES = [
        ('anal', 'Analysis'),
        ('anal_done', 'Analysis Done'),
        ('ai', 'AI Processing'),
        ('ai_done', 'AI Done'),
        ('anal_fail', 'Analysis Failed'),
        ('ai_fail', 'AI Failed'),
    ]
    
    STANDARD_CHOICES = [
        ('south', 'South'),
        ('north', 'North'),
    ]
    
    match_code = models.CharField(primary_key=True, max_length=45)
    ground_code = models.CharField(max_length=45)
    upload_code = models.CharField(max_length=45)
    status = models.CharField(max_length=45, choices=STATUS_CHOICES)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    name = models.CharField(max_length=45)
    standard = models.CharField(max_length=45, choices=STANDARD_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
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
    STATUS_CHOICES = [
        ('play', 'Play'),
        ('rest', 'Rest'),
    ]
    
    HOME_CHOICES = [
        ('west', 'West'),
        ('east', 'East'),
        ('rest', 'Rest'),
    ]
    
    quarter_code = models.CharField(primary_key=True, max_length=45)
    name = models.CharField(max_length=45)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=45, choices=STATUS_CHOICES)
    home = models.CharField(max_length=45, choices=HOME_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        managed = False
        db_table = "player_quarter"

# 플레이어 분석 데이터 테이블 (각 쿼터의 분석 데이터)
class PlayerAnal(models.Model):
    quarter_code = models.CharField(primary_key=True, max_length=50)  # varchar(50)
    
    # Total 관련 필드들
    T_D = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동거리 (km)
    T_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동시간 (분) - decimal로 변경
    T_DPM = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1분당 이동거리 (m)
    T_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 평균속력 (km/h)
    T_HS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 최고속력 (km/h)
    T_HS_T = models.DateTimeField(null=True, blank=True)  # 최고속력 발생시각 (time)
    T_Q1_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1사분 평균속력 (km/h)
    T_Q2_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 후반 평균속력 (km/h)
    T_Drop_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 전반 후반 속도 차이 (km/h)
    T_HTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위 10% 속력 (km/h)
    T_LTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 하위 10% 속력 (km/h)
    T_GS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위-하위 속력차 (km/h)
    T_AA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 평균가속도 (m/s^2)
    T_HA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 최고가속도 (m/s^2)
    T_HA_T = models.DateTimeField(null=True, blank=True)  # 최고가속도 발생시각 (time)
    T_LDT = models.IntegerField(null=True, blank=True)  # 90-150° 방향전환 횟수 (번)
    T_HDT = models.IntegerField(null=True, blank=True)  # 150-180° 방향전환 횟수 (번)
    T_MR = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 활동 면적 (%)
    T_S = models.IntegerField(null=True, blank=True)  # 스프린트 횟수 (번)
    T_TSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 총 거리 (m)
    T_ASD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균 거리 (m)
    T_HSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최장 거리 (m)
    T_LSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최소 거리 (m)
    T_SDPD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 총 이동거리 당 스프린트 거리 (%)
    T_ASS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균속력 (km/h)
    T_HSS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고속력 (km/h)
    T_ASA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균가속도 (m/s^2)
    T_HSA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고가속도 (m/s^2)
    T_AS_L = models.JSONField(null=True, blank=True)  # 평균속력 리스트 (JSON)
    T_AA_L = models.JSONField(null=True, blank=True)  # 평균가속도 리스트 (JSON)
    T_S_L = models.JSONField(null=True, blank=True)  # 스프린트 리스트 (JSON)
    T_LDT_L = models.JSONField(null=True, blank=True)  # 90-150° 방향전환 리스트 (JSON)
    T_HDT_L = models.JSONField(null=True, blank=True)  # 150-180° 방향전환 리스트 (JSON)
    T_HMAP = models.JSONField(null=True, blank=True)  # 히트맵 데이터 (JSON)
    T_SMAP = models.JSONField(null=True, blank=True)  # 스프린트 맵 데이터 (JSON)
    T_DMAP = models.JSONField(null=True, blank=True)  # 방향전환 맵 데이터 (JSON)
    
    # Attack 관련 필드들
    A_D = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동거리 (km)
    A_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동시간 (분) - decimal로 변경
    A_DPM = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1분당 이동거리 (m)
    A_TPT = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 해당 시간 비율 (%)
    A_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 평균속력 (km/h)
    A_HS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 최고속력 (km/h)
    A_HS_T = models.DateTimeField(null=True, blank=True)  # 최고속력 발생시각 (time)
    A_Q1_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1사분 평균속력 (km/h)
    A_Q2_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 후반 평균속력 (km/h)
    A_Drop_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 전반 후반 속도 차이 (km/h)
    A_HTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위 10% 속력 (km/h)
    A_LTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 하위 10% 속력 (km/h)
    A_GS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위-하위 속력차 (km/h)
    A_AA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 평균가속도 (m/s^2)
    A_HA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 최고가속도 (m/s^2)
    A_HA_T = models.DateTimeField(null=True, blank=True)  # 최고가속도 발생시각 (time)
    A_LDT = models.IntegerField(null=True, blank=True)  # 90-150° 방향전환 횟수 (번)
    A_HDT = models.IntegerField(null=True, blank=True)  # 150-180° 방향전환 횟수 (번)
    A_MR = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 활동 면적 (%)
    A_S = models.IntegerField(null=True, blank=True)  # 스프린트 횟수 (번)
    A_TSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 총 거리 (m)
    A_ASD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균 거리 (m)
    A_HSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최장 거리 (m)
    A_LSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최소 거리 (m)
    A_SDPD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Attack 스프린트 거리 비율 (%)
    A_ASS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균속력 (km/h)
    A_HSS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고속력 (km/h)
    A_ASA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균가속도 (m/s^2)
    A_HSA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고가속도 (m/s^2)
    A_AS_L = models.JSONField(null=True, blank=True)  # 평균속력 리스트 (JSON)
    A_AA_L = models.JSONField(null=True, blank=True)  # 평균가속도 리스트 (JSON)
    A_S_L = models.JSONField(null=True, blank=True)  # 스프린트 리스트 (JSON)
    A_LDT_L = models.JSONField(null=True, blank=True)  # 90-150° 방향전환 리스트 (JSON)
    A_HDT_L = models.JSONField(null=True, blank=True)  # 150-180° 방향전환 리스트 (JSON)
    
    # Defense 관련 필드들
    D_D = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동거리 (km)
    D_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동시간 (분) - decimal로 변경
    D_DPM = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1분당 이동거리 (m)
    D_TPT = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 해당 시간 비율 (%)
    D_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 평균속력 (km/h)
    D_HS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 최고속력 (km/h)
    D_HS_T = models.DateTimeField(null=True, blank=True)  # 최고속력 발생시각 (time)
    D_Q1_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1사분 평균속력 (km/h)
    D_Q2_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 후반 평균속력 (km/h)
    D_Drop_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 전반 후반 속도 차이 (km/h)
    D_HTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위 10% 속력 (km/h)
    D_LTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 하위 10% 속력 (km/h)
    D_GS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위-하위 속력차 (km/h)
    D_AA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 평균가속도 (m/s^2)
    D_HA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 최고가속도 (m/s^2)
    D_HA_T = models.DateTimeField(null=True, blank=True)  # 최고가속도 발생시각 (time)
    D_LDT = models.IntegerField(null=True, blank=True)  # 90-150° 방향전환 횟수 (번)
    D_HDT = models.IntegerField(null=True, blank=True)  # 150-180° 방향전환 횟수 (번)
    D_MR = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 활동 면적 (%)
    D_S = models.IntegerField(null=True, blank=True)  # 스프린트 횟수 (번)
    D_TSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 총 거리 (m)
    D_ASD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균 거리 (m)
    D_HSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최장 거리 (m)
    D_LSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최소 거리 (m)
    D_SDPD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Defense 스프린트 거리 비율 (%)
    D_ASS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균속력 (km/h)
    D_HSS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고속력 (km/h)
    D_ASA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균가속도 (m/s^2)
    D_HSA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고가속도 (m/s^2)
    D_AS_L = models.JSONField(null=True, blank=True)  # 평균속력 리스트 (JSON)
    D_AA_L = models.JSONField(null=True, blank=True)  # 평균가속도 리스트 (JSON)
    D_S_L = models.JSONField(null=True, blank=True)  # 스프린트 리스트 (JSON)
    D_LDT_L = models.JSONField(null=True, blank=True)  # 90-150° 방향전환 리스트 (JSON)
    D_HDT_L = models.JSONField(null=True, blank=True)  # 150-180° 방향전환 리스트 (JSON)
    
    # 노이즈 관련 필드들 (실제 DB 구조에 맞게 수정)
    N_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 노이즈 시간
    N_G = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 노이즈 GPS
    N_P = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 노이즈 성능
    
    # 분석 타입
    ANALYSIS_TYPE_CHOICES = [
        ('youth', 'Youth'),
        ('amateur', 'Amateur'),
        ('pro', 'Pro'),
    ]
    AN_T = models.CharField(max_length=10, choices=ANALYSIS_TYPE_CHOICES, null=True, blank=True)  # 분석 타입
    
    # 포인트 관련 필드들
    point_total = models.IntegerField(null=True, blank=True)  # 평점 점수
    point_attack = models.IntegerField(null=True, blank=True)  # 공격 점수  
    point_defense = models.IntegerField(null=True, blank=True)  # 수비 점수
    point_stamina = models.IntegerField(null=True, blank=True)  # 체력 점수
    point_positiveness = models.IntegerField(null=True, blank=True)  # 적극성 점수
    point_speed = models.IntegerField(null=True, blank=True)  # 속력 점수
    point_acceleration = models.IntegerField(null=True, blank=True)  # 가속도 점수
    point_sprint = models.IntegerField(null=True, blank=True)  # 스프린트 점수
    
    # 타임스탬프 필드들
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        managed = False
        db_table = "player_anal"

# 팀 플레이어 분석 데이터 테이블 (각 쿼터의 분석 데이터)
class TeamPlayerAnal(models.Model):
    quarter_code = models.CharField(primary_key=True, max_length=50)  # varchar(50)
    
    # Total 관련 필드들
    T_D = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동거리 (km)
    T_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동시간 (분) - decimal로 변경
    T_DPM = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1분당 이동거리 (m)
    T_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 평균속력 (km/h)
    T_HS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 최고속력 (km/h)
    T_HS_T = models.DateTimeField(null=True, blank=True)  # 최고속력 발생시각 (time)
    T_Q1_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1사분 평균속력 (km/h)
    T_Q2_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 후반 평균속력 (km/h)
    T_Drop_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 전반 후반 속도 차이 (km/h)
    T_HTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위 10% 속력 (km/h)
    T_LTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 하위 10% 속력 (km/h)
    T_GS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위-하위 속력차 (km/h)
    T_AA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 평균가속도 (m/s^2)
    T_HA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 최고가속도 (m/s^2)
    T_HA_T = models.DateTimeField(null=True, blank=True)  # 최고가속도 발생시각 (time)
    T_LDT = models.IntegerField(null=True, blank=True)  # 90-150° 방향전환 횟수 (번)
    T_HDT = models.IntegerField(null=True, blank=True)  # 150-180° 방향전환 횟수 (번)
    T_MR = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 활동 면적 (%)
    T_S = models.IntegerField(null=True, blank=True)  # 스프린트 횟수 (번)
    T_TSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 총 거리 (m)
    T_ASD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균 거리 (m)
    T_HSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최장 거리 (m)
    T_LSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최소 거리 (m)
    T_SDPD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 총 이동거리 당 스프린트 거리 (%)
    T_ASS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균속력 (km/h)
    T_HSS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고속력 (km/h)
    T_ASA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균가속도 (m/s^2)
    T_HSA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고가속도 (m/s^2)
    T_AS_L = models.JSONField(null=True, blank=True)  # 평균속력 리스트 (JSON)
    T_AA_L = models.JSONField(null=True, blank=True)  # 평균가속도 리스트 (JSON)
    T_S_L = models.JSONField(null=True, blank=True)  # 스프린트 리스트 (JSON)
    T_LDT_L = models.JSONField(null=True, blank=True)  # 90-150° 방향전환 리스트 (JSON)
    T_HDT_L = models.JSONField(null=True, blank=True)  # 150-180° 방향전환 리스트 (JSON)
    T_HMAP = models.JSONField(null=True, blank=True)  # 히트맵 데이터 (JSON)
    T_SMAP = models.JSONField(null=True, blank=True)  # 스프린트 맵 데이터 (JSON)
    T_DMAP = models.JSONField(null=True, blank=True)  # 방향전환 맵 데이터 (JSON)
    
    # Attack 관련 필드들
    A_D = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동거리 (km)
    A_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동시간 (분) - decimal로 변경
    A_DPM = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1분당 이동거리 (m)
    A_TPT = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 해당 시간 비율 (%)
    A_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 평균속력 (km/h)
    A_HS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 최고속력 (km/h)
    A_HS_T = models.DateTimeField(null=True, blank=True)  # 최고속력 발생시각 (time)
    A_Q1_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1사분 평균속력 (km/h)
    A_Q2_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 후반 평균속력 (km/h)
    A_Drop_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 전반 후반 속도 차이 (km/h)
    A_HTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위 10% 속력 (km/h)
    A_LTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 하위 10% 속력 (km/h)
    A_GS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위-하위 속력차 (km/h)
    A_AA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 평균가속도 (m/s^2)
    A_HA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 최고가속도 (m/s^2)
    A_HA_T = models.DateTimeField(null=True, blank=True)  # 최고가속도 발생시각 (time)
    A_LDT = models.IntegerField(null=True, blank=True)  # 90-150° 방향전환 횟수 (번)
    A_HDT = models.IntegerField(null=True, blank=True)  # 150-180° 방향전환 횟수 (번)
    A_MR = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 활동 면적 (%)
    A_S = models.IntegerField(null=True, blank=True)  # 스프린트 횟수 (번)
    A_TSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 총 거리 (m)
    A_ASD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균 거리 (m)
    A_HSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최장 거리 (m)
    A_LSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최소 거리 (m)
    A_SDPD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Attack 스프린트 거리 비율 (%)
    A_ASS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균속력 (km/h)
    A_HSS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고속력 (km/h)
    A_ASA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균가속도 (m/s^2)
    A_HSA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고가속도 (m/s^2)
    A_AS_L = models.JSONField(null=True, blank=True)  # 평균속력 리스트 (JSON)
    A_AA_L = models.JSONField(null=True, blank=True)  # 평균가속도 리스트 (JSON)
    A_S_L = models.JSONField(null=True, blank=True)  # 스프린트 리스트 (JSON)
    A_LDT_L = models.JSONField(null=True, blank=True)  # 90-150° 방향전환 리스트 (JSON)
    A_HDT_L = models.JSONField(null=True, blank=True)  # 150-180° 방향전환 리스트 (JSON)
    
    # Defense 관련 필드들
    D_D = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동거리 (km)
    D_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 이동시간 (분) - decimal로 변경
    D_DPM = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1분당 이동거리 (m)
    D_TPT = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 해당 시간 비율 (%)
    D_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 평균속력 (km/h)
    D_HS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 최고속력 (km/h)
    D_HS_T = models.DateTimeField(null=True, blank=True)  # 최고속력 발생시각 (time)
    D_Q1_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 1사분 평균속력 (km/h)
    D_Q2_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 후반 평균속력 (km/h)
    D_Drop_AS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 전반 후반 속도 차이 (km/h)
    D_HTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위 10% 속력 (km/h)
    D_LTS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 하위 10% 속력 (km/h)
    D_GS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 상위-하위 속력차 (km/h)
    D_AA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 평균가속도 (m/s^2)
    D_HA = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)  # 최고가속도 (m/s^2)
    D_HA_T = models.DateTimeField(null=True, blank=True)  # 최고가속도 발생시각 (time)
    D_LDT = models.IntegerField(null=True, blank=True)  # 90-150° 방향전환 횟수 (번)
    D_HDT = models.IntegerField(null=True, blank=True)  # 150-180° 방향전환 횟수 (번)
    D_MR = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 활동 면적 (%)
    D_S = models.IntegerField(null=True, blank=True)  # 스프린트 횟수 (번)
    D_TSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 총 거리 (m)
    D_ASD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균 거리 (m)
    D_HSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최장 거리 (m)
    D_LSD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최소 거리 (m)
    D_SDPD = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Defense 스프린트 거리 비율 (%)
    D_ASS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균속력 (km/h)
    D_HSS = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고속력 (km/h)
    D_ASA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 평균가속도 (m/s^2)
    D_HSA = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 스프린트 최고가속도 (m/s^2)
    D_AS_L = models.JSONField(null=True, blank=True)  # 평균속력 리스트 (JSON)
    D_AA_L = models.JSONField(null=True, blank=True)  # 평균가속도 리스트 (JSON)
    D_S_L = models.JSONField(null=True, blank=True)  # 스프린트 리스트 (JSON)
    D_LDT_L = models.JSONField(null=True, blank=True)  # 90-150° 방향전환 리스트 (JSON)
    D_HDT_L = models.JSONField(null=True, blank=True)  # 150-180° 방향전환 리스트 (JSON)
    
    # 노이즈 관련 필드들 (실제 DB 구조에 맞게 수정)
    N_T = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 노이즈 시간
    N_G = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 노이즈 GPS
    N_P = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 노이즈 성능
    
    # 분석 타입
    ANALYSIS_TYPE_CHOICES = [
        ('youth', 'Youth'),
        ('amateur', 'Amateur'),
        ('pro', 'Pro'),
    ]
    AN_T = models.CharField(max_length=10, choices=ANALYSIS_TYPE_CHOICES, null=True, blank=True)  # 분석 타입
    
    # 포인트 관련 필드들
    point_total = models.IntegerField(null=True, blank=True)  # 평점 점수
    point_attack = models.IntegerField(null=True, blank=True)  # 공격 점수  
    point_defense = models.IntegerField(null=True, blank=True)  # 수비 점수
    point_stamina = models.IntegerField(null=True, blank=True)  # 체력 점수
    point_positiveness = models.IntegerField(null=True, blank=True)  # 적극성 점수
    point_speed = models.IntegerField(null=True, blank=True)  # 속력 점수
    point_acceleration = models.IntegerField(null=True, blank=True)  # 가속도 점수
    point_sprint = models.IntegerField(null=True, blank=True)  # 스프린트 점수
    
    # 타임스탬프 필드들
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "team_player_anal"

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
    answer = models.JSONField()
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
    upload_code = models.CharField(primary_key=True, max_length=45)
    user_code = models.CharField(max_length=45)
    uuid = models.CharField(max_length=45)
    name = models.CharField(max_length=45)
    hz = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "upload"

# 컨텐츠 게시판 테이블 (이벤트, 공지사항, 문의사항 통합)
class ContentBoard(models.Model):
    """
    이벤트, 공지사항, 문의사항을 통합 관리하는 테이블
    카테고리별로 구분하여 관리
    """
    
    CATEGORY_CHOICES = [
        ('event', 'Event'),
        ('notice', 'Notice'),
        ('inquiry', 'Inquiry'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    INQUIRY_TYPE_CHOICES = [
        ('account', 'Account'),
        ('payment', 'Payment'),
        ('match_analysis', 'Match Analysis'),
        ('team', 'Team'),
        ('ground', 'Ground'),
        ('app_feature', 'App Feature'),
        ('bug_report', 'Bug Report'),
        ('suggestion', 'Suggestion'),
        ('other', 'Other'),
    ]
    
    TARGET_USER_TYPE_CHOICES = [
        ('all', 'All'),
        ('player', 'Player'),
        ('coach', 'Coach'),
        ('parents', 'Parents'),
        ('youth', 'Youth'),
        ('adult', 'Adult'),
        ('pro', 'Pro'),
    ]
    
    # 기본 필드
    content_code = models.CharField(primary_key=True, max_length=45)
    category = models.CharField(max_length=45, choices=CATEGORY_CHOICES)
    author_code = models.CharField(max_length=45)
    
    # 제목 및 내용
    title = models.CharField(max_length=200)
    content = models.TextField()
    
    # 이미지 및 첨부파일
    thumbnail_url = models.CharField(max_length=500, null=True, blank=True)
    image_urls = models.JSONField(null=True, blank=True)
    attachment_urls = models.JSONField(null=True, blank=True)
    
    # 조회수 및 통계
    view_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    
    # 이벤트 전용 필드
    event_start_date = models.DateTimeField(null=True, blank=True)
    event_end_date = models.DateTimeField(null=True, blank=True)
    event_link = models.CharField(max_length=500, null=True, blank=True)
    event_reward = models.CharField(max_length=200, null=True, blank=True)
    event_conditions = models.JSONField(null=True, blank=True)
    
    # 공지사항 전용 필드
    priority = models.CharField(max_length=45, choices=PRIORITY_CHOICES, null=True, blank=True)
    is_pinned = models.BooleanField(default=False)
    notice_start_date = models.DateTimeField(null=True, blank=True)
    notice_end_date = models.DateTimeField(null=True, blank=True)
    
    # 문의사항 전용 필드
    inquiry_type = models.CharField(max_length=45, choices=INQUIRY_TYPE_CHOICES, null=True, blank=True)
    status = models.CharField(max_length=45, choices=STATUS_CHOICES, null=True, blank=True)
    
    # 관련 엔티티 참조
    related_match_code = models.CharField(max_length=45, null=True, blank=True)
    related_quarter_code = models.CharField(max_length=45, null=True, blank=True)
    related_team_code = models.CharField(max_length=45, null=True, blank=True)
    related_ground_code = models.CharField(max_length=45, null=True, blank=True)
    
    # 답변 정보
    answer = models.TextField(null=True, blank=True)
    answered_by = models.CharField(max_length=45, null=True, blank=True)
    answered_at = models.DateTimeField(null=True, blank=True)
    
    # 비공개 여부
    is_private = models.BooleanField(default=True)
    
    # 대상 사용자 설정
    target_user_type = models.CharField(max_length=45, choices=TARGET_USER_TYPE_CHOICES, default='all', null=True, blank=True)
    
    # 공개 설정
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    # 메타 데이터
    metadata = models.JSONField(null=True, blank=True)
    tags = models.JSONField(null=True, blank=True)
    
    # 타임스탬프
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "content_board"

# 이벤트 참여 추적 테이블
class ContentEventParticipation(models.Model):
    """
    이벤트 참여 기록 추적
    누가 어떤 이벤트에 참여했는지 기록
    """
    id = models.AutoField(primary_key=True)
    content_code = models.CharField(max_length=45)
    user_code = models.CharField(max_length=45)
    
    # 참여 정보
    is_completed = models.BooleanField(default=False)
    reward_received = models.BooleanField(default=False)
    
    # 참여 데이터
    participation_data = models.JSONField(null=True, blank=True)
    
    # 타임스탬프
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "content_event_participation"

# 컨텐츠 댓글 테이블
class ContentComment(models.Model):
    """
    컨텐츠에 대한 댓글
    이벤트, 공지사항에 댓글 가능
    """
    comment_code = models.CharField(primary_key=True, max_length=45)
    content_code = models.CharField(max_length=45)
    user_code = models.CharField(max_length=45)
    
    # 댓글 내용
    comment = models.TextField()
    
    # 대댓글 지원
    parent_comment_code = models.CharField(max_length=45, null=True, blank=True)
    
    # 좋아요
    like_count = models.IntegerField(default=0)
    
    # 타임스탬프
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = "content_comment"