import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Django 설정
sys.path.append('/home/ubuntu/agrounds/mysite/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agrounds.settings.local')
django.setup()

from DB.models import ContentBoard

def update_event_dates():
    """이벤트 날짜를 현재 기준으로 업데이트"""
    print("이벤트 날짜 업데이트 시작...")
    
    now = timezone.now()
    
    # 진행 중인 이벤트 1: 신규 가입 이벤트 (이번 달 1일 ~ 말일)
    event1 = ContentBoard.objects.filter(content_code='c_20250201120000_evt001').first()
    if event1:
        event1.event_start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # 이번 달 말일 구하기
        if now.month == 12:
            next_month = now.replace(year=now.year+1, month=1, day=1)
        else:
            next_month = now.replace(month=now.month+1, day=1)
        last_day_of_month = next_month - timedelta(days=1)
        event1.event_end_date = last_day_of_month.replace(hour=23, minute=59, second=59, microsecond=0)
        event1.updated_at = now
        event1.save()
        print(f"✓ {event1.title}: {event1.event_start_date} ~ {event1.event_end_date} (진행중)")
    
    # 진행 중인 이벤트 2: 경기 데이터 업로드 챌린지 (이번 달 1일 ~ 다음 달 말일)
    event2 = ContentBoard.objects.filter(content_code='c_20250201120100_evt002').first()
    if event2:
        event2.event_start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # 다음 달 말일 구하기
        if now.month == 11:
            next_next_month = now.replace(year=now.year+1, month=1, day=1)
        elif now.month == 12:
            next_next_month = now.replace(year=now.year+1, month=2, day=1)
        else:
            next_next_month = now.replace(month=now.month+2, day=1)
        last_day_of_next_month = next_next_month - timedelta(days=1)
        event2.event_end_date = last_day_of_next_month.replace(hour=23, minute=59, second=59, microsecond=0)
        event2.updated_at = now
        event2.save()
        print(f"✓ {event2.title}: {event2.event_start_date} ~ {event2.event_end_date} (진행중)")
    
    # 진행 중인 이벤트 3: 특별 이벤트 (3일 전 ~ 4일 후)
    event3 = ContentBoard.objects.filter(content_code='c_20250115090000_evt003').first()
    if event3:
        event3.event_start_date = now - timedelta(days=3)
        event3.event_end_date = now + timedelta(days=4)
        event3.updated_at = now
        event3.save()
        print(f"✓ {event3.title}: {event3.event_start_date} ~ {event3.event_end_date} (진행중)")
    
    # 종료된 이벤트: 크리스마스 이벤트 (지난 달 20일 ~ 26일)
    event4 = ContentBoard.objects.filter(content_code='c_20241220100000_evt004').first()
    if event4:
        if now.month == 1:
            last_month = now.replace(year=now.year-1, month=12, day=20, hour=0, minute=0, second=0, microsecond=0)
        else:
            last_month = now.replace(month=now.month-1, day=20, hour=0, minute=0, second=0, microsecond=0)
        event4.event_start_date = last_month
        event4.event_end_date = last_month.replace(day=26, hour=23, minute=59, second=59)
        event4.updated_at = now
        event4.save()
        print(f"✓ {event4.title}: {event4.event_start_date} ~ {event4.event_end_date} (종료)")
    
    print("\n이벤트 상태 확인:")
    print("=" * 80)
    events = ContentBoard.objects.filter(
        category='event',
        deleted_at__isnull=True
    ).order_by('event_start_date')
    
    for event in events:
        if event.event_start_date and event.event_end_date:
            if event.event_start_date <= now <= event.event_end_date:
                status = "✅ 진행중"
            elif event.event_end_date < now:
                status = "⏹️ 종료"
            else:
                status = "📅 예정"
            
            print(f"{status} | {event.title}")
            print(f"   시작: {event.event_start_date.strftime('%Y-%m-%d %H:%M')}")
            print(f"   종료: {event.event_end_date.strftime('%Y-%m-%d %H:%M')}")
            print()
    
    print("이벤트 날짜 업데이트 완료!")

if __name__ == '__main__':
    update_event_dates()
