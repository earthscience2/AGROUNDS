-- test_player 유저를 위한 더미 알림 데이터 삽입
-- 사용법: mysql -u root -p < /home/ubuntu/agrounds/mysite/backend/scripts/insert_test_player_notifications.sql

USE agrounds;

-- test_player 유저 코드 확인 (존재하지 않으면 종료)
-- test_player의 실제 user_code를 사용해야 합니다.

-- 기존 test_player 알림 삭제 (재실행 시 중복 방지)
DELETE FROM notification WHERE recipient_code = 'test_player';

-- 1. 팀 가입 승인 알림 (읽지 않음)
INSERT INTO notification (
    recipient_code, sender_code, category, notification_type, priority,
    title, message, short_message, related_data, is_read, is_deleted,
    created_at, read_at, updated_at, deleted_at
) VALUES (
    'test_player',
    't_001',
    'team',
    'team_join_accepted',
    'normal',
    '팀 가입이 승인되었습니다',
    'FC 서울 팀 가입 신청이 승인되었습니다. 이제 팀 멤버로 활동하실 수 있습니다.',
    '팀 가입 승인',
    '{"team_code": "t_001", "team_name": "FC 서울"}',
    FALSE,
    FALSE,
    DATE_SUB(NOW(), INTERVAL 1 HOUR),
    NULL,
    NOW(),
    NULL
);

-- 2. 분석 완료 알림 (읽지 않음)
INSERT INTO notification (
    recipient_code, sender_code, category, notification_type, priority,
    title, message, short_message, related_data, is_read, is_deleted,
    created_at, read_at, updated_at, deleted_at
) VALUES (
    'test_player',
    NULL,
    'analysis',
    'analysis_completed',
    'normal',
    '경기 분석이 완료되었습니다',
    '2024년 11월 5일 경기에 대한 분석이 완료되었습니다. 이제 상세 분석 결과를 확인하실 수 있습니다.',
    '분석 완료',
    '{"match_code": "pm_001"}',
    FALSE,
    FALSE,
    DATE_SUB(NOW(), INTERVAL 2 HOUR),
    NULL,
    NOW(),
    NULL
);

-- 3. 주간 리포트 알림 (읽지 않음)
INSERT INTO notification (
    recipient_code, sender_code, category, notification_type, priority,
    title, message, short_message, related_data, is_read, is_deleted,
    created_at, read_at, updated_at, deleted_at
) VALUES (
    'test_player',
    NULL,
    'analysis',
    'weekly_summary',
    'high',
    '이번 주 활동 요약이 도착했습니다',
    '이번 주 총 3경기에 참여하셨으며, 평균 주행거리는 8.5km입니다. 지난 주 대비 15% 향상되었습니다.',
    '주간 요약',
    '{"total_matches": 3, "avg_distance": 8.5, "improvement": 15}',
    FALSE,
    FALSE,
    DATE_SUB(NOW(), INTERVAL 5 HOUR),
    NULL,
    NOW(),
    NULL
);

-- 4. 시스템 공지 (읽음)
INSERT INTO notification (
    recipient_code, sender_code, category, notification_type, priority,
    title, message, short_message, related_data, is_read, is_deleted,
    created_at, read_at, updated_at, deleted_at
) VALUES (
    'test_player',
    NULL,
    'system',
    'feature_announcement',
    'normal',
    '새로운 기능이 추가되었습니다',
    '팀 분석 기능이 새롭게 업데이트되었습니다. 이제 팀 전체의 포메이션 분석과 협동 지표를 확인하실 수 있습니다.',
    '기능 업데이트',
    NULL,
    TRUE,
    FALSE,
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    DATE_SUB(NOW(), INTERVAL 20 HOUR),
    NOW(),
    NULL
);

-- 5. 이벤트 시작 알림 (읽지 않음)
INSERT INTO notification (
    recipient_code, sender_code, category, notification_type, priority,
    title, message, short_message, related_data, is_read, is_deleted,
    created_at, read_at, updated_at, deleted_at
) VALUES (
    'test_player',
    NULL,
    'event',
    'event_start',
    'high',
    '11월 특별 이벤트가 시작되었습니다',
    '이번 달 10경기 이상 참여 시 프리미엄 분석 리포트를 무료로 제공합니다. 지금 바로 참여하세요!',
    '이벤트 시작',
    '{"event_code": "ev_202411", "deadline": "2024-11-30"}',
    FALSE,
    FALSE,
    DATE_SUB(NOW(), INTERVAL 3 HOUR),
    NULL,
    NOW(),
    NULL
);

-- 6. 성취 배지 획득 (읽지 않음)
INSERT INTO notification (
    recipient_code, sender_code, category, notification_type, priority,
    title, message, short_message, related_data, is_read, is_deleted,
    created_at, read_at, updated_at, deleted_at
) VALUES (
    'test_player',
    NULL,
    'achievement',
    'badge_earned',
    'normal',
    '새로운 배지를 획득했습니다!',
    '축하합니다! "주간 러너" 배지를 획득하셨습니다. 일주일 동안 50km 이상 주행하신 것을 인정받았습니다.',
    '배지 획득',
    '{"badge_name": "주간 러너", "badge_type": "runner", "total_distance": 52.3}',
    FALSE,
    FALSE,
    DATE_SUB(NOW(), INTERVAL 4 HOUR),
    NULL,
    NOW(),
    NULL
);

-- 7. 팀 멤버 가입 알림 (읽음)
INSERT INTO notification (
    recipient_code, sender_code, category, notification_type, priority,
    title, message, short_message, related_data, is_read, is_deleted,
    created_at, read_at, updated_at, deleted_at
) VALUES (
    'test_player',
    'u_newmember',
    'team',
    'team_member_joined',
    'normal',
    '새로운 팀원이 가입했습니다',
    '김민수님이 FC 서울 팀에 가입하셨습니다. 환영 메시지를 보내보세요!',
    '팀원 가입',
    '{"team_code": "t_001", "new_member_code": "u_newmember", "new_member_name": "김민수"}',
    TRUE,
    FALSE,
    DATE_SUB(NOW(), INTERVAL 2 DAY),
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    NOW(),
    NULL
);

-- 8. 기록 갱신 알림 (읽지 않음)
INSERT INTO notification (
    recipient_code, sender_code, category, notification_type, priority,
    title, message, short_message, related_data, is_read, is_deleted,
    created_at, read_at, updated_at, deleted_at
) VALUES (
    'test_player',
    NULL,
    'achievement',
    'record_broken',
    'high',
    '개인 최고 기록을 경신했습니다!',
    '최고 속도 기록을 경신하셨습니다! 이전 기록 28.5km/h에서 29.8km/h로 향상되었습니다.',
    '기록 경신',
    '{"record_type": "max_speed", "previous_value": 28.5, "new_value": 29.8}',
    FALSE,
    FALSE,
    DATE_SUB(NOW(), INTERVAL 6 HOUR),
    NULL,
    NOW(),
    NULL
);

-- 9. 시스템 점검 공지 (읽음)
INSERT INTO notification (
    recipient_code, sender_code, category, notification_type, priority,
    title, message, short_message, related_data, is_read, is_deleted,
    created_at, read_at, updated_at, deleted_at
) VALUES (
    'test_player',
    NULL,
    'system',
    'system_maintenance',
    'urgent',
    '시스템 정기 점검 안내',
    '2024년 11월 10일 02:00-04:00 정기 점검이 예정되어 있습니다. 이 시간 동안 서비스 이용이 제한됩니다.',
    '시스템 점검',
    '{"maintenance_start": "2024-11-10 02:00:00", "maintenance_end": "2024-11-10 04:00:00"}',
    TRUE,
    FALSE,
    DATE_SUB(NOW(), INTERVAL 3 DAY),
    DATE_SUB(NOW(), INTERVAL 2 DAY),
    NOW(),
    NULL
);

-- 10. 친구 요청 (소셜 - 읽지 않음)
INSERT INTO notification (
    recipient_code, sender_code, category, notification_type, priority,
    title, message, short_message, related_data, is_read, is_deleted,
    created_at, read_at, updated_at, deleted_at
) VALUES (
    'test_player',
    'u_friend01',
    'social',
    'friend_request',
    'normal',
    '새로운 친구 요청',
    '박지성님이 친구 요청을 보냈습니다.',
    '친구 요청',
    '{"user_code": "u_friend01", "user_name": "박지성"}',
    FALSE,
    FALSE,
    DATE_SUB(NOW(), INTERVAL 8 HOUR),
    NULL,
    NOW(),
    NULL
);

-- 결과 확인
SELECT 
    notification_id,
    category,
    notification_type,
    title,
    is_read,
    created_at
FROM notification
WHERE recipient_code = 'test_player'
ORDER BY created_at DESC;

-- 카테고리별 개수 확인
SELECT 
    category,
    COUNT(*) as count,
    SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as unread_count
FROM notification
WHERE recipient_code = 'test_player' AND deleted_at IS NULL
GROUP BY category;

SELECT '더미 알림 데이터 삽입 완료!' as status;

