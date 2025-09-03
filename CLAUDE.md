# CLAUDE 개발 규칙 가이드라인

이 문서는 Agrounds 프로젝트에서 Claude가 따라야 하는 개발 규칙과 가이드라인을 정의합니다.

## 📋 목차
- [프론트엔드 규칙](#프론트엔드-규칙)
- [API 개발 규칙](#api-개발-규칙)
- [백엔드 규칙](#백엔드-규칙)
- [공통 규칙](#공통-규칙)

---

## 🎨 프론트엔드 규칙

### 디자인 시스템 준수
**필수 경로**: `/home/ubuntu/agrounds/mysite/frontend/agrounds_1.0.0/src/pages/design`

#### 1. 색상 사용
```javascript
// 디자인 시스템 색상 사용
const colors = {
  primary: '#079669',      // 메인 액션 버튼, CTA
  primaryHover: '#068A5B', // 호버 상태
  success: '#079669',      // 성공 상태
  error: '#EF4444',        // 오류 상태
  warning: '#f59e0b',      // 경고 상태
  info: '#3b82f6',         // 정보 상태
  textPrimary: '#262626',  // 메인 텍스트
  textSecondary: '#6B7078', // 보조 텍스트
  textDisabled: '#8A8F98', // 비활성 텍스트
  bgPrimary: '#F2F4F6',    // 페이지 배경
  bgSurface: '#FFFFFF',    // 카드 배경
  border: '#E2E8F0'        // 테두리
};
```

#### 2. 타이포그래피 클래스
```css
/* 브랜드 폰트 (Paperlogy-8ExtraBold) - 제목용 */
.text-display  /* 48px, 800, 1.1 - 메인 제목 */
.text-h1       /* 32px, 800, 1.2 - 페이지 제목 */
.text-h2       /* 24px, 800, 1.3 - 섹션 제목 */

/* 텍스트 폰트 (Pretendard) - 본문용 */
.text-h3       /* 20px, 600, 1.4 - 하위 섹션 제목 */
.text-h4       /* 18px, 600, 1.4 - 카드 제목 */
.text-body-lg  /* 16px, 400, 1.5 - 큰 본문 */
.text-body     /* 14px, 400, 1.5 - 일반 본문 */
.text-body-sm  /* 12px, 400, 1.4 - 작은 본문 */
.text-caption  /* 11px, 400, 1.3 - 라벨, 단위 */
```

#### 3. 간격 시스템
```css
/* 간격 변수 사용 */
--spacing-xs: 4px;   /* 매우 작은 간격 */
--spacing-sm: 8px;   /* 작은 간격 */
--spacing-md: 12px;  /* 기본 간격 */
--spacing-lg: 16px;  /* 큰 간격 */
--spacing-xl: 20px;  /* 매우 큰 간격 */
--spacing-2xl: 24px; /* 섹션 간격 */
--spacing-3xl: 32px; /* 컴포넌트 간격 */
--spacing-4xl: 40px; /* 페이지 간격 */
```

#### 4. 아이콘 사용
```javascript
// 아이콘 import 경로 (common 폴더 기준)
import bellIcon from '../../../assets/common/bell.png';
import searchIcon from '../../../assets/common/search.png';
import userBlackIcon from '../../../assets/common/user-black.png';

// 아이콘 크기 클래스
.icon-small  { width: 16px; height: 16px; }
.icon-medium { width: 20px; height: 20px; }
.icon-large  { width: 24px; height: 24px; }
.icon-xl     { width: 32px; height: 32px; }
```

#### 5. 버튼 스타일
```css
.btn-primary {
  background: #079669;
  color: #FFFFFF;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #FFFFFF;
  color: #6B7078;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
}
```

---

## 🔌 API 개발 규칙

### 1. API 작업 시 검증 절차
```bash
# 백엔드 API 확인
1. 모델 정의 확인: backend/DB/models.py
2. 시리얼라이저 확인: backend/{app}/serializers.py
3. 뷰 로직 확인: backend/{app}/views.py
4. URL 매핑 확인: backend/{app}/urls.py

# 프론트엔드 API 연동 확인
1. API 함수 정의: frontend/src/function/api/
2. 컴포넌트 연동 확인
3. 에러 핸들링 확인
4. 로딩 상태 처리 확인
```

### 2. API 응답 형식
```python
# 성공 응답
{
    "success": True,
    "data": {...},
    "message": "성공 메시지"
}

# 실패 응답
{
    "success": False,
    "error": "오류 코드",
    "message": "오류 메시지",
    "details": {...}  # 선택적
}
```

### 3. 프론트엔드 API 호출 패턴
```javascript
// API 호출 시 에러 핸들링 필수
try {
  setLoading(true);
  const response = await ApiFunction(params);
  
  if (response.data.success) {
    // 성공 처리
    setData(response.data.data);
  } else {
    // 실패 처리
    console.error('API 오류:', response.data.message);
    alert(response.data.message || '요청 처리 중 오류가 발생했습니다.');
  }
} catch (error) {
  console.error('네트워크 오류:', error);
  alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
} finally {
  setLoading(false);
}
```

---

## 🐍 백엔드 규칙

### 1. Django 프로젝트 구조
```
backend/
├── agrounds/          # 메인 프로젝트 설정
│   ├── settings/      # 환경별 설정 분리
│   │   ├── base.py    # 공통 설정
│   │   ├── local.py   # 로컬 환경
│   │   └── prod.py    # 프로덕션 환경
│   └── urls.py        # 메인 URL 설정
├── DB/                # 메인 데이터베이스 모델
├── user/              # 사용자 관련
├── login/             # 로그인 관련
├── ground/            # 경기장 관련
├── upload/            # 파일 업로드 관련
└── staticfiles/       # 유틸리티 함수들
```

### 2. 모델 작성 규칙
```python
# backend/DB/models.py - 메인 모델들
class User(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    user_id = models.CharField(max_length=45)
    password = models.CharField(max_length=200)
    login_type = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        managed = False  # 기존 DB 테이블 사용
        db_table = "user"

# 새로운 모델 추가 시
class NewModel(models.Model):
    # 필드 정의
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = "new_model"
        ordering = ['-created_at']
```

### 3. 뷰 작성 규칙
```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET', 'POST'])
def api_function(request):
    try:
        if request.method == 'GET':
            # GET 로직
            data = get_data()
            return Response({
                'success': True,
                'data': data,
                'message': '조회 성공'
            }, status=status.HTTP_200_OK)
            
        elif request.method == 'POST':
            # POST 로직
            serializer = DataSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': '등록 성공'
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'error': 'VALIDATION_ERROR',
                    'message': '입력 데이터가 올바르지 않습니다.',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
    except Exception as e:
        return Response({
            'success': False,
            'error': 'SERVER_ERROR',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

### 4. URL 패턴
```python
# backend/{app}/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/{app}/<action>/', views.api_function, name='{app}-{action}'),
    # RESTful API 패턴 권장
    path('api/{app}/', views.list_create, name='{app}-list-create'),
    path('api/{app}/<str:id>/', views.detail, name='{app}-detail'),
]
```

### 5. 시리얼라이저 규칙
```python
from rest_framework import serializers
from .models import Model

class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = '__all__'  # 또는 특정 필드 리스트
        
    def validate_field(self, value):
        # 필드별 유효성 검사
        if not value:
            raise serializers.ValidationError("필수 입력 항목입니다.")
        return value
```

### 6. 유틸리티 함수 사용
```python
# staticfiles/ 폴더의 유틸리티 함수들 활용
from staticfiles.s3 import upload_file_to_s3
from staticfiles.get_user_info_from_token import get_user_info
from staticfiles.make_code import generate_unique_code
```

---

## 🔧 공통 규칙

### 1. 코드 스타일
- **기존 파일 수정 우선**: 새 파일 생성보다 기존 파일 수정
- **일관된 네이밍**: camelCase (JS), snake_case (Python)
- **주석 최소화**: 코드 자체로 의미 전달
- **에러 핸들링 필수**: 모든 API 호출과 데이터 처리에 에러 처리

### 2. 보안 규칙
- **시크릿 키 노출 금지**: 환경변수 사용
- **SQL 인젝션 방지**: ORM 사용
- **XSS 방지**: 사용자 입력 검증
- **CSRF 보호**: Django CSRF 토큰 사용

### 3. 성능 최적화
- **데이터베이스 쿼리 최적화**: N+1 문제 방지
- **이미지 최적화**: WebP 포맷 사용 권장
- **캐싱 활용**: 적절한 캐시 전략 사용
- **번들 크기 최적화**: 불필요한 import 제거

### 4. 테스트 규칙
```bash
# 백엔드 테스트 실행 (있을 경우)
python manage.py test

# 프론트엔드 빌드 테스트
cd frontend/agrounds_1.0.0
npm run build
npm run lint  # 린트 검사 (있을 경우)
```

### 5. Git 커밋 규칙
```bash
# 커밋 메시지 형식
[type] subject

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>

# 타입 예시
[feat] 새로운 기능 추가
[fix] 버그 수정
[style] 코드 스타일 변경
[refactor] 코드 리팩토링
[docs] 문서 수정
```

---

## 📝 체크리스트

### 프론트엔드 작업 시
- [ ] 디자인 시스템 색상/폰트/간격 사용
- [ ] 반응형 디자인 적용 (모바일 우선)
- [ ] 아이콘 경로 확인 (assets/common/)
- [ ] API 에러 핸들링 구현
- [ ] 로딩 상태 처리

### 백엔드 작업 시
- [ ] 모델 정의 및 마이그레이션
- [ ] 시리얼라이저 유효성 검사
- [ ] API 응답 형식 통일
- [ ] 에러 핸들링 구현
- [ ] URL 패턴 RESTful 설계

### API 연동 시
- [ ] 백엔드 API 엔드포인트 확인
- [ ] 프론트엔드 API 함수 구현
- [ ] 요청/응답 데이터 형식 검증
- [ ] 에러 케이스 처리
- [ ] 성공/실패 시나리오 테스트

---

*이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.*