-- =============================================
-- Content Board 이벤트 날짜 업데이트
-- 현재 날짜 기준으로 진행중/종료된 이벤트 날짜 수정
-- =============================================

-- 진행 중인 이벤트 1: 신규 가입 이벤트 (이번 달 말까지)
UPDATE content_board 
SET 
    event_start_date = DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00'),
    event_end_date = LAST_DAY(NOW()),
    updated_at = NOW()
WHERE content_code = 'c_20250201120000_evt001';

-- 진행 중인 이벤트 2: 경기 데이터 10개 업로드 챌린지 (다음 달 말까지)
UPDATE content_board 
SET 
    event_start_date = DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00'),
    event_end_date = LAST_DAY(DATE_ADD(NOW(), INTERVAL 1 MONTH)),
    updated_at = NOW()
WHERE content_code = 'c_20250201120100_evt002';

-- 진행 중인 이벤트 3: 특별 이벤트 (오늘부터 일주일)
UPDATE content_board 
SET 
    event_start_date = DATE_SUB(NOW(), INTERVAL 3 DAY),
    event_end_date = DATE_ADD(NOW(), INTERVAL 4 DAY),
    updated_at = NOW()
WHERE content_code = 'c_20250115090000_evt003';

-- 종료된 이벤트: 크리스마스 이벤트 (지난 달)
UPDATE content_board 
SET 
    event_start_date = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-20 00:00:00'),
    event_end_date = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-26 23:59:59'),
    updated_at = NOW()
WHERE content_code = 'c_20241220100000_evt004';

-- 확인용 쿼리
SELECT 
    content_code,
    title,
    event_start_date,
    event_end_date,
    CASE 
        WHEN event_start_date <= NOW() AND event_end_date >= NOW() THEN '진행중'
        WHEN event_end_date < NOW() THEN '종료'
        ELSE '예정'
    END AS status
FROM content_board
WHERE category = 'event' AND deleted_at IS NULL
ORDER BY event_start_date;
