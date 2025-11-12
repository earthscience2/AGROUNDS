-- =============================================
-- 이벤트 데이터 재생성 (현재 날짜 기준)
-- 더미 데이터 생성 규칙 준수
-- =============================================

-- 기존 이벤트 데이터 소프트 삭제
UPDATE content_board 
SET deleted_at = NOW()
WHERE category = 'event' AND deleted_at IS NULL;

-- 이벤트 참여 데이터도 소프트 삭제
UPDATE content_event_participation
SET deleted_at = NOW()
WHERE deleted_at IS NULL;

-- 새로운 이벤트 데이터 생성 (현재 날짜 기준)
INSERT INTO content_board (
    content_code, category, author_code, title, content, 
    thumbnail_url, view_count, like_count,
    event_start_date, event_end_date, event_link, event_reward,
    target_user_type, is_published, is_private,
    tags, created_at, updated_at, deleted_at
) VALUES
-- 진행 중인 이벤트 1: 신규 가입 이벤트 (이번 달 1일 ~ 말일)
(
    'c_20251031_evt001', 'event', 'admin_001',
    '🎉 신규 가입 이벤트',
    '이번 달 한정! 신규 가입 회원에게 프리미엄 분석권 7일을 무료로 제공합니다. 이번 기회를 놓치지 마세요!',
    'https://dnt5c7vilse71.cloudfront.net/events/new_user_event.jpg',
    245, 89,
    DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00'), 
    LAST_DAY(NOW()),
    'https://agrounds.com/event/new-user-2025',
    '프리미엄 분석권 7일',
    'all', 1, 0,
    '["이벤트", "신규", "무료"]',
    NOW(), NOW(), NULL
),
-- 진행 중인 이벤트 2: 경기 데이터 업로드 챌린지 (이번 달 ~ 다음 달 말일)
(
    'c_20251031_evt002', 'event', 'admin_001',
    '⚽ 경기 데이터 10개 업로드 챌린지',
    '경기 데이터를 10개 이상 업로드하신 분들께 특별 보상을 드립니다! 더 많은 데이터를 분석하고 성장하세요.',
    'https://dnt5c7vilse71.cloudfront.net/events/upload_challenge.jpg',
    178, 65,
    DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00'),
    LAST_DAY(DATE_ADD(NOW(), INTERVAL 1 MONTH)),
    'https://agrounds.com/event/upload-challenge',
    '프리미엄 분석권 30일, 팀 분석권 7일',
    'player', 1, 0,
    '["이벤트", "챌린지", "보상"]',
    NOW(), NOW(), NULL
),
-- 진행 중인 이벤트 3: 가을 시즌 특별 이벤트 (3일 전 ~ 7일 후)
(
    'c_20251031_evt003', 'event', 'admin_001',
    '🍂 가을 시즌 특별 이벤트',
    '가을 시즌을 맞이하여 모든 사용자에게 특별한 혜택을 드립니다!',
    'https://dnt5c7vilse71.cloudfront.net/events/autumn_special.jpg',
    892, 234,
    DATE_SUB(NOW(), INTERVAL 3 DAY),
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    'https://agrounds.com/event/autumn-2025',
    '프리미엄 분석권 14일',
    'all', 1, 0,
    '["이벤트", "가을", "특별"]',
    NOW(), NOW(), NULL
),
-- 종료된 이벤트: 지난 달 이벤트 (지난 달 20일 ~ 26일)
(
    'c_20251031_evt004', 'event', 'admin_001',
    '🏆 지난 달 특별 이벤트',
    '지난 달 특별 이벤트! 많은 참여 감사드립니다.',
    'https://dnt5c7vilse71.cloudfront.net/events/last_month_event.jpg',
    1523, 456,
    DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-20 00:00:00'),
    DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-26 23:59:59'),
    'https://agrounds.com/event/last-month-2025',
    '프리미엄 분석권 7일',
    'all', 1, 0,
    '["이벤트", "종료"]',
    DATE_SUB(NOW(), INTERVAL 1 MONTH), 
    DATE_SUB(NOW(), INTERVAL 1 MONTH), 
    NULL
);

-- 확인용 쿼리
SELECT 
    content_code,
    title,
    event_start_date,
    event_end_date,
    CASE 
        WHEN event_start_date <= NOW() AND event_end_date >= NOW() THEN '✅ 진행중'
        WHEN event_end_date < NOW() THEN '⏹️ 종료'
        ELSE '📅 예정'
    END AS status,
    is_published
FROM content_board
WHERE category = 'event' AND deleted_at IS NULL
ORDER BY event_start_date DESC;
