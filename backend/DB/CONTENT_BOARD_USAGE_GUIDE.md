# Content Board 사용 가이드

## 📋 개요

`content_board` 테이블은 **이벤트, 공지사항, 문의사항**을 통합 관리하는 테이블입니다.

## 🚀 설치 방법

### 1. DB 테이블 생성

```bash
# MySQL에 접속
mysql -u your_username -p your_database

# SQL 파일 실행
source /home/ubuntu/agrounds/mysite/backend/DB/create_content_board_tables.sql
```

### 2. Django 모델 확인

모델은 이미 `/backend/DB/models.py`에 추가되어 있습니다:
- `ContentBoard`
- `ContentEventParticipation`
- `ContentComment`

## 📊 테이블 구조

### content_board 테이블

```
content_board
├── content_code (PK)          # 컨텐츠 고유 코드
├── category                    # event/notice/inquiry
├── author_code                 # 작성자 user_code
├── title                       # 제목
├── content                     # 본문
├── [이벤트 전용 필드]
├── [공지사항 전용 필드]
├── [문의사항 전용 필드]
└── [타임스탬프]
```

## 💡 사용 예시

### 1️⃣ 이벤트 생성

```python
from DB.models import ContentBoard
from django.utils import timezone
import uuid

# content_code 생성 함수
def generate_content_code():
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    random_str = str(uuid.uuid4())[:8]
    return f"c_{timestamp}_{random_str}"

# 이벤트 등록
event = ContentBoard.objects.create(
    content_code=generate_content_code(),
    category='event',
    author_code='admin_001',
    title='설날 특별 이벤트',
    content='설날을 맞아 특별한 보상을 드립니다!',
    thumbnail_url='https://s3.amazonaws.com/.../event_lunar.jpg',
    event_start_date=timezone.datetime(2025, 1, 28),
    event_end_date=timezone.datetime(2025, 2, 2, 23, 59, 59),
    event_link='https://agrounds.com/event/lunar2025',
    event_reward='프리미엄 분석권 7일',
    target_user_type='all',
    tags=['이벤트', '설날', '보상']
)
```

### 2️⃣ 공지사항 생성

```python
# 중요 공지사항 등록 (상단 고정)
notice = ContentBoard.objects.create(
    content_code=generate_content_code(),
    category='notice',
    author_code='admin_001',
    title='[긴급] 서버 점검 안내',
    content='2025년 2월 1일 새벽 2시~4시 서버 점검이 진행됩니다.',
    priority='urgent',
    is_pinned=True,
    notice_start_date=timezone.now(),
    notice_end_date=timezone.datetime(2025, 2, 1, 12, 0, 0),
    target_user_type='all',
    tags=['공지', '점검', '긴급']
)
```

### 3️⃣ 문의사항 생성

```python
# 경기 분석 관련 문의
inquiry = ContentBoard.objects.create(
    content_code=generate_content_code(),
    category='inquiry',
    author_code='u_12345',
    title='경기 분석 데이터가 이상합니다',
    content='1월 30일 경기의 스프린트 횟수가 실제와 다릅니다...',
    inquiry_type='match_analysis',
    related_match_code='m_202501301500_xyz',
    related_quarter_code='q_202501301500_q1',
    status='pending',
    is_private=True
)
```

### 4️⃣ 문의사항 답변

```python
# 문의사항 답변 추가
inquiry.answer = '확인 결과 GPS 데이터 노이즈로 인한 오차였습니다. 재분석 완료했습니다.'
inquiry.answered_by = 'admin_001'
inquiry.answered_at = timezone.now()
inquiry.status = 'completed'
inquiry.save()
```

## 🔍 조회 쿼리 예시

### 활성 이벤트 목록

```python
from django.utils import timezone

active_events = ContentBoard.objects.filter(
    category='event',
    deleted_at__isnull=True,
    is_published=True,
    event_end_date__gte=timezone.now()
).order_by('-created_at')
```

### 상단 고정 공지사항

```python
pinned_notices = ContentBoard.objects.filter(
    category='notice',
    deleted_at__isnull=True,
    is_pinned=True,
    is_published=True
).order_by('-priority', '-created_at')
```

### 내 문의사항 목록

```python
my_inquiries = ContentBoard.objects.filter(
    category='inquiry',
    author_code=user_code,
    deleted_at__isnull=True
).order_by('-created_at')
```

### 미답변 문의사항 (관리자용)

```python
pending_inquiries = ContentBoard.objects.filter(
    category='inquiry',
    status='pending',
    deleted_at__isnull=True
).order_by('created_at')
```

### 특정 사용자 타입 대상 컨텐츠

```python
player_contents = ContentBoard.objects.filter(
    target_user_type__in=['all', 'player'],
    deleted_at__isnull=True,
    is_published=True
).order_by('-created_at')
```

## 🎯 이벤트 참여 추적

### 이벤트 참여 등록

```python
from DB.models import ContentEventParticipation

participation = ContentEventParticipation.objects.create(
    content_code='c_202501281200_abc',
    user_code='u_12345',
    participation_data={'action': 'share', 'completed_at': timezone.now().isoformat()}
)
```

### 이벤트 완료 처리

```python
participation.is_completed = True
participation.reward_received = True
participation.save()
```

### 이벤트 참여자 목록

```python
participants = ContentEventParticipation.objects.filter(
    content_code='c_202501281200_abc',
    deleted_at__isnull=True
).select_related('user')
```

## 💬 댓글 기능

### 댓글 작성

```python
from DB.models import ContentComment

comment = ContentComment.objects.create(
    comment_code=generate_comment_code(),
    content_code='c_202501281200_abc',
    user_code='u_12345',
    comment='좋은 이벤트네요!'
)
```

### 대댓글 작성

```python
reply = ContentComment.objects.create(
    comment_code=generate_comment_code(),
    content_code='c_202501281200_abc',
    user_code='u_67890',
    comment='저도 동의합니다!',
    parent_comment_code='cm_202501281205_abc'
)
```

## 🔐 권한 처리

### 비공개 문의사항 조회 권한

```python
def can_view_inquiry(user_code, inquiry):
    # 작성자 본인 또는 관리자만 조회 가능
    if inquiry.is_private:
        return user_code == inquiry.author_code or is_admin(user_code)
    return True
```

### 수정/삭제 권한

```python
def can_edit_content(user_code, content):
    # 작성자 본인 또는 관리자만 수정 가능
    return user_code == content.author_code or is_admin(user_code)
```

## 🔄 소프트 삭제

### 삭제 처리

```python
# 소프트 삭제
content.deleted_at = timezone.now()
content.save()
```

### 복구 처리

```python
# 복구
content.deleted_at = None
content.save()
```

## 📈 통계 쿼리

### 조회수 증가

```python
content.view_count += 1
content.save(update_fields=['view_count'])
```

### 좋아요 증가

```python
from django.db.models import F

ContentBoard.objects.filter(
    content_code=content_code
).update(like_count=F('like_count') + 1)
```

### 카테고리별 통계

```python
from django.db.models import Count

stats = ContentBoard.objects.filter(
    deleted_at__isnull=True
).values('category').annotate(
    total=Count('content_code')
)
```

## ⚠️ 주의사항

1. **소프트 삭제 필수**: 절대 `.delete()` 메서드를 직접 호출하지 마세요
2. **content_code 생성**: UUID + timestamp 조합으로 고유성 보장
3. **category별 필드**: 각 카테고리에 맞는 필드만 사용
4. **권한 체크**: is_private 필드 확인 필수
5. **타임존**: 항상 `timezone.now()` 사용

## 🔗 관련 모델

- `User`: 작성자/답변자 참조
- `PlayerMatch`: 문의사항의 related_match_code
- `TeamInfo`: 문의사항의 related_team_code
- `GroundInfo`: 문의사항의 related_ground_code

## 📝 TODO

- [ ] API 엔드포인트 작성
- [ ] 프론트엔드 UI 구현
- [ ] 알림 시스템 연동 (Notification 테이블)
- [ ] 이미지 S3 업로드 기능
- [ ] 검색 기능 구현
- [ ] 페이징 처리

