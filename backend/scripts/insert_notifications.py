#!/usr/bin/env python
"""
test_player 유저를 위한 더미 알림 데이터 삽입 스크립트
실행 방법: python manage.py shell < scripts/insert_notifications.py
또는: cd backend && python manage.py shell < scripts/insert_notifications.py
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Django 설정
sys.path.append('/home/ubuntu/agrounds/mysite/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agrounds.settings.prod')
django.setup()

from DB.models import Notification
from django.utils import timezone

print("=" * 60)
print("test_player 유저용 더미 알림 데이터 삽입 시작")
print("=" * 60)

# 기존 test_player 알림 삭제 (재실행 시 중복 방지)
deleted_count = Notification.objects.filter(recipient_code='test_player').delete()[0]
print(f"\n기존 알림 {deleted_count}개 삭제됨")

notifications_data = [
    {
        'recipient_code': 'test_player',
        'sender_code': 't_001',
        'category': 'team',
        'notification_type': 'team_join_accepted',
        'priority': 'normal',
        'title': '팀 가입이 승인되었습니다',
        'message': 'FC 서울 팀 가입 신청이 승인되었습니다. 이제 팀 멤버로 활동하실 수 있습니다.',
        'short_message': '팀 가입 승인',
        'related_data': {'team_code': 't_001', 'team_name': 'FC 서울'},
        'is_read': False,
        'created_at': timezone.now() - timedelta(hours=1),
    },
    {
        'recipient_code': 'test_player',
        'sender_code': None,
        'category': 'analysis',
        'notification_type': 'analysis_completed',
        'priority': 'normal',
        'title': '경기 분석이 완료되었습니다',
        'message': '2024년 11월 5일 경기에 대한 분석이 완료되었습니다. 이제 상세 분석 결과를 확인하실 수 있습니다.',
        'short_message': '분석 완료',
        'related_data': {'match_code': 'pm_001'},
        'is_read': False,
        'created_at': timezone.now() - timedelta(hours=2),
    },
    {
        'recipient_code': 'test_player',
        'sender_code': None,
        'category': 'analysis',
        'notification_type': 'weekly_summary',
        'priority': 'high',
        'title': '이번 주 활동 요약이 도착했습니다',
        'message': '이번 주 총 3경기에 참여하셨으며, 평균 주행거리는 8.5km입니다. 지난 주 대비 15% 향상되었습니다.',
        'short_message': '주간 요약',
        'related_data': {'total_matches': 3, 'avg_distance': 8.5, 'improvement': 15},
        'is_read': False,
        'created_at': timezone.now() - timedelta(hours=5),
    },
    {
        'recipient_code': 'test_player',
        'sender_code': None,
        'category': 'system',
        'notification_type': 'feature_announcement',
        'priority': 'normal',
        'title': '새로운 기능이 추가되었습니다',
        'message': '팀 분석 기능이 새롭게 업데이트되었습니다. 이제 팀 전체의 포메이션 분석과 협동 지표를 확인하실 수 있습니다.',
        'short_message': '기능 업데이트',
        'related_data': None,
        'is_read': True,
        'read_at': timezone.now() - timedelta(hours=20),
        'created_at': timezone.now() - timedelta(days=1),
    },
    {
        'recipient_code': 'test_player',
        'sender_code': None,
        'category': 'event',
        'notification_type': 'event_start',
        'priority': 'high',
        'title': '11월 특별 이벤트가 시작되었습니다',
        'message': '이번 달 10경기 이상 참여 시 프리미엄 분석 리포트를 무료로 제공합니다. 지금 바로 참여하세요!',
        'short_message': '이벤트 시작',
        'related_data': {'event_code': 'ev_202411', 'deadline': '2024-11-30'},
        'is_read': False,
        'created_at': timezone.now() - timedelta(hours=3),
    },
    {
        'recipient_code': 'test_player',
        'sender_code': None,
        'category': 'achievement',
        'notification_type': 'badge_earned',
        'priority': 'normal',
        'title': '새로운 배지를 획득했습니다!',
        'message': '축하합니다! "주간 러너" 배지를 획득하셨습니다. 일주일 동안 50km 이상 주행하신 것을 인정받았습니다.',
        'short_message': '배지 획득',
        'related_data': {'badge_name': '주간 러너', 'badge_type': 'runner', 'total_distance': 52.3},
        'is_read': False,
        'created_at': timezone.now() - timedelta(hours=4),
    },
    {
        'recipient_code': 'test_player',
        'sender_code': 'u_newmember',
        'category': 'team',
        'notification_type': 'team_member_joined',
        'priority': 'normal',
        'title': '새로운 팀원이 가입했습니다',
        'message': '김민수님이 FC 서울 팀에 가입하셨습니다. 환영 메시지를 보내보세요!',
        'short_message': '팀원 가입',
        'related_data': {'team_code': 't_001', 'new_member_code': 'u_newmember', 'new_member_name': '김민수'},
        'is_read': True,
        'read_at': timezone.now() - timedelta(days=1),
        'created_at': timezone.now() - timedelta(days=2),
    },
    {
        'recipient_code': 'test_player',
        'sender_code': None,
        'category': 'achievement',
        'notification_type': 'record_broken',
        'priority': 'high',
        'title': '개인 최고 기록을 경신했습니다!',
        'message': '최고 속도 기록을 경신하셨습니다! 이전 기록 28.5km/h에서 29.8km/h로 향상되었습니다.',
        'short_message': '기록 경신',
        'related_data': {'record_type': 'max_speed', 'previous_value': 28.5, 'new_value': 29.8},
        'is_read': False,
        'created_at': timezone.now() - timedelta(hours=6),
    },
    {
        'recipient_code': 'test_player',
        'sender_code': None,
        'category': 'system',
        'notification_type': 'system_maintenance',
        'priority': 'urgent',
        'title': '시스템 정기 점검 안내',
        'message': '2024년 11월 10일 02:00-04:00 정기 점검이 예정되어 있습니다. 이 시간 동안 서비스 이용이 제한됩니다.',
        'short_message': '시스템 점검',
        'related_data': {'maintenance_start': '2024-11-10 02:00:00', 'maintenance_end': '2024-11-10 04:00:00'},
        'is_read': True,
        'read_at': timezone.now() - timedelta(days=2),
        'created_at': timezone.now() - timedelta(days=3),
    },
    {
        'recipient_code': 'test_player',
        'sender_code': 'u_friend01',
        'category': 'social',
        'notification_type': 'friend_request',
        'priority': 'normal',
        'title': '새로운 친구 요청',
        'message': '박지성님이 친구 요청을 보냈습니다.',
        'short_message': '친구 요청',
        'related_data': {'user_code': 'u_friend01', 'user_name': '박지성'},
        'is_read': False,
        'created_at': timezone.now() - timedelta(hours=8),
    },
]

# 알림 생성
created_count = 0
for data in notifications_data:
    try:
        notification = Notification.objects.create(**data)
        created_count += 1
        print(f"✓ 알림 생성: {notification.title} (ID: {notification.notification_id})")
    except Exception as e:
        print(f"✗ 알림 생성 실패: {data['title']} - {str(e)}")

print(f"\n총 {created_count}개의 알림이 생성되었습니다.")

# 결과 확인
print("\n" + "=" * 60)
print("생성된 알림 목록:")
print("=" * 60)

notifications = Notification.objects.filter(
    recipient_code='test_player',
    deleted_at__isnull=True
).order_by('-created_at')

for notif in notifications:
    read_status = "✓ 읽음" if notif.is_read else "○ 읽지 않음"
    print(f"{read_status} | {notif.category:12} | {notif.title}")

# 카테고리별 통계
print("\n" + "=" * 60)
print("카테고리별 통계:")
print("=" * 60)

from django.db.models import Count, Q

stats = Notification.objects.filter(
    recipient_code='test_player',
    deleted_at__isnull=True
).values('category').annotate(
    total=Count('notification_id'),
    unread=Count('notification_id', filter=Q(is_read=False))
).order_by('category')

for stat in stats:
    print(f"{stat['category']:12} | 전체: {stat['total']:2}개 | 읽지 않음: {stat['unread']:2}개")

total_notifications = notifications.count()
unread_notifications = notifications.filter(is_read=False).count()

print("\n" + "=" * 60)
print(f"전체 알림: {total_notifications}개")
print(f"읽지 않은 알림: {unread_notifications}개")
print("=" * 60)
print("\n✅ 더미 알림 데이터 삽입 완료!")
print("=" * 60)

