# AGROUNDS 개발 가이드라인

## 📋 개요
이 문서는 AGROUNDS 프로젝트의 효율적이고 일관된 개발을 위한 가이드라인을 제공합니다.

---

## 🎨 프론트엔드 개발 가이드라인

### 1. 디자인 시스템 활용
- **디자인 시스템 경로**: `/home/ubuntu/agrounds/mysite/frontend/agrounds_1.0.0/src/pages/design`
- 모든 UI 개발 시 반드시 기존 디자인 시스템을 기반으로 작업할 것
- 새로운 컴포넌트 개발 시 기존 디자인 토큰과 일관성 유지

### 2. 색상 사용 규칙
```scss
// CSS 변수 활용 (Design.scss 참조)
:root {
  --primary: #079669;
  --primary-hover: #068A5B;
  --text-primary: #262626;
  --text-secondary: #6B7078;
  --bg-primary: #F2F4F6;
  --bg-surface: #FFFFFF;
  // ... 기타 색상 변수들
}

// 사용 예시
.my-component {
  background-color: var(--primary);
  color: var(--bg-surface);
}
```

### 3. 타이포그래피 가이드라인
```scss
// 기존 타이포그래피 클래스 활용
.text-display { font-family: var(--font-brand); font-size: 48px; }
.text-h1 { font-family: var(--font-brand); font-size: 32px; }
.text-h2 { font-family: var(--font-brand); font-size: 24px; }
.text-body { font-family: var(--font-text); font-size: 14px; }
.text-caption { font-family: var(--font-text); font-size: 11px; }
```

### 4. 컴포넌트 개발 원칙
- **재사용성**: 기존 `.btn-primary`, `.btn-secondary` 클래스 활용
- **일관성**: 디자인 시스템의 간격 시스템 활용 (`var(--spacing-xs)` ~ `var(--spacing-4xl)`)
- **접근성**: 최소 터치 영역 44px 확보, 색상 대비 WCAG AA 기준 준수

### 5. Assets 사용 가이드
```javascript
// 이미지 import 방식 (Design.js 참조)
import bellIcon from '../../../assets/common/bell.png';
import userIcon from '../../../assets/common/user-black.png';

// 사용 예시
<img src={bellIcon} alt="알림" className="icon-medium" />
```

### 6. 컴포넌트 상태 관리
- **상태 종류**: Default, Hover, Active, Focus, Disabled, Loading
- **CSS 클래스 네이밍**: `.component-state` 형식 (예: `.btn-primary:hover`)

---

## 🚀 백엔드 API 개발 가이드라인

### 1. 파일 수정 원칙
- **기존 파일 수정만 허용**: 새로운 파일 생성 금지
- **모듈별 수정 범위**:
  - `views.py`: API 로직 추가/수정
  - `models.py`: 데이터 모델 확장
  - `serializers.py`: 직렬화 로직 수정
  - `urls.py`: URL 패턴 추가/수정

### 2. 주요 앱 구조
```
backend/
├── DB/              # 메인 데이터베이스 모델
├── user/            # 사용자 관리
├── login/           # 인증/로그인
├── upload/          # 파일 업로드
├── ground/          # 경기장 관리
└── agrounds/        # 프로젝트 설정
```

### 3. API 개발 패턴
```python
# views.py 수정 예시
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ExistingModel
from .serializers import ExistingSerializer

@api_view(['GET', 'POST'])
def existing_view_function(request):
    # 기존 함수에 로직 추가
    if request.method == 'GET':
        # GET 로직
        pass
    elif request.method == 'POST':
        # POST 로직 추가
        pass
    return Response(data)
```

### 4. 모델 확장 가이드라인
```python
# models.py에서 기존 모델 확장
class ExistingModel(models.Model):
    # 기존 필드들...
    
    # 새 필드 추가 시
    new_field = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
```

### 5. URL 패턴 추가
```python
# urls.py에서 기존 패턴에 추가
urlpatterns = [
    # 기존 패턴들...
    path('new-endpoint/', views.existing_view_function, name='new_endpoint'),
]
```

### 6. 데이터베이스 마이그레이션
```bash
# 모델 변경 후 마이그레이션 생성 및 적용
python manage.py makemigrations
python manage.py migrate
```

---

## 🔧 공통 개발 원칙

### 1. 코드 품질
- **명명 규칙**: 의미있고 일관된 변수/함수명 사용
- **주석**: 복잡한 로직에 대한 설명 추가
- **에러 처리**: 적절한 예외 처리 및 사용자 친화적 에러 메시지

### 2. Git 커밋 메시지
```
feat: 새로운 기능 추가
fix: 버그 수정
style: 스타일 변경 (기능에 영향 없음)
refactor: 코드 리팩토링
docs: 문서 수정
```

### 3. 테스트
- **프론트엔드**: 주요 컴포넌트 동작 확인
- **백엔드**: API 엔드포인트 정상 작동 확인

### 4. 성능 최적화
- **프론트엔드**: 불필요한 리렌더링 방지, 이미지 최적화
- **백엔드**: 데이터베이스 쿼리 최적화, 캐싱 활용

---

## 📝 체크리스트

### 프론트엔드 개발 전
- [ ] 디자인 시스템 확인 (`/design` 페이지 참조)
- [ ] 기존 컴포넌트 재사용 가능성 검토
- [ ] CSS 변수 및 클래스 활용 계획 수립

### 백엔드 개발 전
- [ ] 기존 파일 구조 파악
- [ ] 수정할 파일 목록 확정 (새 파일 생성 금지)
- [ ] 데이터베이스 영향도 분석

### 개발 완료 후
- [ ] 디자인 시스템 일관성 확인
- [ ] 반응형 디자인 테스트
- [ ] API 엔드포인트 정상 작동 확인
- [ ] 에러 처리 검증
- [ ] 코드 리뷰 및 문서 업데이트

---

## 🔗 참고 자료

1. **디자인 시스템**: `/frontend/agrounds_1.0.0/src/pages/design/`
2. **백엔드 구조**: `/backend/` 각 앱별 파일
3. **Assets**: `/frontend/agrounds_1.0.0/src/assets/` 폴더별 정리

---

## ⚠️ 주의사항

1. **프론트엔드**: 기존 디자인 시스템과 다른 스타일 적용 금지
2. **백엔드**: 새로운 파일 생성 절대 금지, 기존 파일 내에서만 수정
3. **공통**: 특정 요청과 직접 관련된 코드만 수정, 관련 없는 기능 변경 금지
4. **단계별 접근**: 문제를 작은 단계로 나누어 개별적으로 구현

이 가이드라인을 따라 개발하면 일관되고 유지보수 가능한 코드를 작성할 수 있습니다.
