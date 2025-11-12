-- 맨시티 선수 20명 더미 데이터 생성 (팀 코드: t_1761716761_wfne)
-- 2024-25 시즌 기준 실제 맨시티 선수단

-- ===================================================
-- 1단계: User 테이블 (기본 로그인 정보)
-- ===================================================
INSERT INTO user (user_code, user_id, password, login_type, created_at, deleted_at) VALUES
('u_mancity_ederson', 'ederson@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_ortega', 'ortega@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_walker', 'walker@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_stones', 'stones@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_dias', 'dias@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_ake', 'ake@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_gvardiol', 'gvardiol@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_akanji', 'akanji@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_rodri', 'rodri@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_kovacic', 'kovacic@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_bernardo', 'bernardo@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_debruyne', 'debruyne@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_foden', 'foden@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_gundogan', 'gundogan@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_phillips', 'phillips@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_haaland', 'haaland@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_alvarez', 'alvarez@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_grealish', 'grealish@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_doku', 'doku@mancity.com', 'dummy_password', 'guest', NOW(), NULL),
('u_mancity_mahrez', 'mahrez@mancity.com', 'dummy_password', 'guest', NOW(), NULL);

-- ===================================================
-- 2단계: UserInfo 테이블 (선수 상세 정보)
-- ===================================================
INSERT INTO user_info (user_code, birth, name, gender, marketing_agree, user_type, level, height, weight, preferred_position, activity_area, ai_type, created_at, updated_at, deleted_at) VALUES
-- 골키퍼
('u_mancity_ederson', '1993-08-17', '에데르손', 'male', '{}', 'player', 'pro', 188, 86, 'GK', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_ortega', '1992-05-12', '오르테가', 'male', '{}', 'player', 'pro', 183, 79, 'GK', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),

-- 수비수
('u_mancity_walker', '1990-05-28', '카일 워커', 'male', '{}', 'player', 'pro', 183, 83, 'RB', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_stones', '1994-05-28', '존 스톤스', 'male', '{}', 'player', 'pro', 188, 70, 'CB', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_dias', '1997-05-14', '루벤 디아스', 'male', '{}', 'player', 'pro', 187, 82, 'CB', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_ake', '1995-02-18', '나단 아케', 'male', '{}', 'player', 'pro', 180, 75, 'CB', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_gvardiol', '2002-01-23', '그바르디올', 'male', '{}', 'player', 'pro', 185, 80, 'LB', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_akanji', '1995-07-19', '마누엘 아칸지', 'male', '{}', 'player', 'pro', 190, 82, 'CB', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),

-- 미드필더
('u_mancity_rodri', '1996-06-22', '로드리', 'male', '{}', 'player', 'pro', 191, 80, 'CDM', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_kovacic', '1994-05-06', '마테오 코바치치', 'male', '{}', 'player', 'pro', 178, 78, 'CM', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_bernardo', '1994-08-10', '베르나르두 실바', 'male', '{}', 'player', 'pro', 173, 64, 'CAM', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_debruyne', '1991-06-28', '케빈 더 브라위너', 'male', '{}', 'player', 'pro', 181, 68, 'CAM', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_foden', '2000-05-28', '필 포든', 'male', '{}', 'player', 'pro', 171, 69, 'LWM', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_gundogan', '1990-10-24', '일카이 귄도안', 'male', '{}', 'player', 'pro', 180, 80, 'CM', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_phillips', '1995-12-02', '칼빈 필립스', 'male', '{}', 'player', 'pro', 178, 75, 'CDM', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),

-- 공격수
('u_mancity_haaland', '2000-07-21', '엘링 홀란드', 'male', '{}', 'player', 'pro', 194, 88, 'ST', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_alvarez', '2000-01-31', '줄리안 알바레스', 'male', '{}', 'player', 'pro', 170, 71, 'ST', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_grealish', '1995-09-10', '잭 그릴리시', 'male', '{}', 'player', 'pro', 180, 70, 'LWF', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_doku', '2002-05-27', '제레미 도쿠', 'male', '{}', 'player', 'pro', 173, 67, 'RWF', '맨체스터', 'data_analyst', NOW(), NOW(), NULL),
('u_mancity_mahrez', '1991-02-13', '리야드 마레즈', 'male', '{}', 'player', 'pro', 179, 67, 'RWF', '맨체스터', 'data_analyst', NOW(), NOW(), NULL);

-- ===================================================
-- 3단계: PlayerTeamCross 테이블 (팀 멤버십)
-- ===================================================
-- 에데르손: 팀장(owner), 오르테가: 매니저(manager), 나머지: 멤버(member)
INSERT INTO player_team_cross (user_code, team_code, role, number, created_at, updated_at, deleted_at) VALUES
('u_mancity_ederson', 't_1761716761_wfne', 'owner', 31, NOW(), NOW(), NULL),
('u_mancity_ortega', 't_1761716761_wfne', 'manager', 18, NOW(), NOW(), NULL),
('u_mancity_walker', 't_1761716761_wfne', 'member', 2, NOW(), NOW(), NULL),
('u_mancity_stones', 't_1761716761_wfne', 'member', 5, NOW(), NOW(), NULL),
('u_mancity_dias', 't_1761716761_wfne', 'member', 3, NOW(), NOW(), NULL),
('u_mancity_ake', 't_1761716761_wfne', 'member', 6, NOW(), NOW(), NULL),
('u_mancity_gvardiol', 't_1761716761_wfne', 'member', 24, NOW(), NOW(), NULL),
('u_mancity_akanji', 't_1761716761_wfne', 'member', 25, NOW(), NOW(), NULL),
('u_mancity_rodri', 't_1761716761_wfne', 'member', 16, NOW(), NOW(), NULL),
('u_mancity_kovacic', 't_1761716761_wfne', 'member', 8, NOW(), NOW(), NULL),
('u_mancity_bernardo', 't_1761716761_wfne', 'member', 20, NOW(), NOW(), NULL),
('u_mancity_debruyne', 't_1761716761_wfne', 'member', 17, NOW(), NOW(), NULL),
('u_mancity_foden', 't_1761716761_wfne', 'member', 47, NOW(), NOW(), NULL),
('u_mancity_gundogan', 't_1761716761_wfne', 'member', 19, NOW(), NOW(), NULL),
('u_mancity_phillips', 't_1761716761_wfne', 'member', 4, NOW(), NOW(), NULL),
('u_mancity_haaland', 't_1761716761_wfne', 'member', 9, NOW(), NOW(), NULL),
('u_mancity_alvarez', 't_1761716761_wfne', 'member', 19, NOW(), NOW(), NULL),
('u_mancity_grealish', 't_1761716761_wfne', 'member', 10, NOW(), NOW(), NULL),
('u_mancity_doku', 't_1761716761_wfne', 'member', 11, NOW(), NOW(), NULL),
('u_mancity_mahrez', 't_1761716761_wfne', 'member', 26, NOW(), NOW(), NULL);

-- ===================================================
-- 4단계: 데이터 확인
-- ===================================================
-- 생성된 사용자 확인
SELECT 
    u.user_code, 
    ui.name, 
    ui.preferred_position, 
    TIMESTAMPDIFF(YEAR, ui.birth, CURDATE()) as age,
    ui.height,
    ui.weight
FROM user u
JOIN user_info ui ON u.user_code = ui.user_code
WHERE u.user_code LIKE 'u_mancity_%'
ORDER BY ui.preferred_position, ui.name;

-- 팀 멤버십 확인
SELECT 
    ptc.user_code,
    ui.name,
    ptc.role,
    ptc.number,
    ui.preferred_position
FROM player_team_cross ptc
JOIN user_info ui ON ptc.user_code = ui.user_code
WHERE ptc.team_code = 't_1761716761_wfne'
  AND ptc.deleted_at IS NULL
ORDER BY 
    FIELD(ptc.role, 'owner', 'manager', 'member'),
    ptc.number;

-- 팀 통계
SELECT 
    COUNT(*) as total_members,
    SUM(CASE WHEN role = 'owner' THEN 1 ELSE 0 END) as owners,
    SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) as managers,
    SUM(CASE WHEN role = 'member' THEN 1 ELSE 0 END) as members
FROM player_team_cross
WHERE team_code = 't_1761716761_wfne'
  AND deleted_at IS NULL;

-- 포지션별 통계
SELECT 
    ui.preferred_position,
    COUNT(*) as player_count,
    GROUP_CONCAT(ui.name ORDER BY ui.name SEPARATOR ', ') as players
FROM player_team_cross ptc
JOIN user_info ui ON ptc.user_code = ui.user_code
WHERE ptc.team_code = 't_1761716761_wfne'
  AND ptc.deleted_at IS NULL
GROUP BY ui.preferred_position
ORDER BY 
    FIELD(ui.preferred_position, 'GK', 'LB', 'CB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LWM', 'RWM', 'LWF', 'ST', 'RWF');

