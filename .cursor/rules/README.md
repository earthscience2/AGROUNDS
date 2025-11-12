# 📚 AGROUNDS Cursor Rules Documentation

## 📁 폴더 구조 개요

```
.cursor/rules/
├── 00-navigation-hub.mdc           ⭐ AI용 - 항상 참조 (alwaysApply: true)
├── 00-navigation-hub-ko.mdc        👤 사람용 - 한글 참조
├── guidelines.mdc                   ⭐ AI용 - 항상 참조 (alwaysApply: true)
├── guidelines-ko.mdc                👤 사람용 - 한글 참조
│
├── database/                        📊 데이터베이스 규칙
│   ├── access.mdc                  ⭐ AI용 - 실제 DB 접근 방법
│   ├── access-ko.mdc               👤 사람용
│   ├── patterns.mdc                ⭐ AI용 - DB 패턴
│   └── patterns-ko.mdc             👤 사람용
│
├── backend/                         💻 백엔드 규칙
│   ├── api-development.mdc         ⭐ AI용 - API 개발
│   └── api-development-ko.mdc      👤 사람용
│
├── frontend/                        🎨 프론트엔드 규칙
│   ├── components.mdc              ⭐ AI용 - React 컴포넌트
│   ├── components-ko.mdc           👤 사람용
│   ├── design-system.mdc           ⭐ AI용 - 디자인 시스템
│   └── design-system-ko.mdc        👤 사람용
│
├── cloud/                           ☁️ 클라우드 규칙 (향후)
├── features/                        🎯 기능별 규칙 (향후)
└── general/                         🏗️ 일반 규칙
    ├── project-guidelines.mdc      ⭐ AI용 - 프로젝트 가이드
    └── project-guidelines-ko.mdc   👤 사람용
```

---

## 🤖 AI 참조 설정

### ⭐ 항상 참조 (alwaysApply: true)
AI가 모든 대화에서 자동으로 읽는 파일:

1. **`guidelines.mdc`** - 핵심 제약사항 및 빠른 네비게이션
2. **`00-navigation-hub.mdc`** - 전체 규칙 네비게이션 허브

### 🔍 선택적 참조 (기본 모드)
필요할 때만 AI가 자동으로 선택하는 파일:

- `database/access.mdc` - DB 관련 질문시
- `database/patterns.mdc` - 모델 패턴 관련 질문시
- `backend/api-development.mdc` - API 개발 질문시
- `frontend/components.mdc` - React 컴포넌트 질문시
- `frontend/design-system.mdc` - 디자인/스타일 질문시
- `general/project-guidelines.mdc` - 프로젝트 구조 질문시

### ❌ 절대 참조하지 않음
**모든 `-ko.mdc` 파일** (한글판)
- AI는 영문판만 읽습니다
- 한글판은 개발자가 읽기 위한 참조용입니다

---

## 📝 파일 명명 규칙

### 영문판 (AI용)
```
파일명.mdc
```
예: `access.mdc`, `api-development.mdc`

### 한글판 (사람용)
```
파일명-ko.mdc
```
예: `access-ko.mdc`, `api-development-ko.mdc`

---

## 🔄 규칙 업데이트 프로토콜

규칙 파일을 수정할 때는 **반드시 영문판과 한글판 모두 업데이트**해야 합니다.

### 업데이트 순서
1. ✅ 영문판 수정 (예: `access.mdc`)
2. ✅ 한글판도 같은 내용으로 수정 (예: `access-ko.mdc`)
3. ✅ 두 파일의 내용이 일치하는지 확인
4. ✅ 번역 정확성 확인

### 예시
```bash
# 1. 영문판 수정
vi database/access.mdc

# 2. 한글판도 수정 (번역)
vi database/access-ko.mdc

# 3. 변경사항 확인
git diff database/access.mdc
git diff database/access-ko.mdc
```

---

## 🎯 카테고리별 규칙 파일

### 📊 데이터베이스
| 영문 (AI용) | 한글 (사람용) | 설명 |
|------------|-------------|------|
| `database/access.mdc` | `database/access-ko.mdc` | MySQL DB 접근 및 검증 |
| `database/patterns.mdc` | `database/patterns-ko.mdc` | 모델 패턴 및 쿼리 작성 |

### 💻 백엔드
| 영문 (AI용) | 한글 (사람용) | 설명 |
|------------|-------------|------|
| `backend/api-development.mdc` | `backend/api-development-ko.mdc` | Django REST API 개발 |

### 🎨 프론트엔드
| 영문 (AI용) | 한글 (사람용) | 설명 |
|------------|-------------|------|
| `frontend/components.mdc` | `frontend/components-ko.mdc` | React 컴포넌트 개발 |
| `frontend/design-system.mdc` | `frontend/design-system-ko.mdc` | 디자인 시스템 |

### 🏗️ 일반
| 영문 (AI용) | 한글 (사람용) | 설명 |
|------------|-------------|------|
| `general/project-guidelines.mdc` | `general/project-guidelines-ko.mdc` | 전체 프로젝트 가이드 |

---

## 🚀 향후 추가 예정

### P1 - 높음
```
cloud/
├── lambda.mdc / lambda-ko.mdc          # AWS Lambda 개발
└── storage.mdc / storage-ko.mdc        # S3/CloudFront 관리

backend/
└── authentication.mdc / authentication-ko.mdc  # JWT/소셜 로그인
```

### P2 - 중간
```
features/
├── analytics.mdc / analytics-ko.mdc    # 분석 로직
└── video.mdc / video-ko.mdc            # 비디오 처리
```

---

## 💡 사용 예시

### AI에게 질문할 때
```
"DB와 models.py가 일치하는지 확인해줘"
→ AI가 자동으로 database/access.mdc 참조

"팀 생성 API 만들어줘"
→ AI가 자동으로 backend/api-development.mdc 참조

"버튼 디자인이 시스템과 맞는지 확인"
→ AI가 자동으로 frontend/design-system.mdc 참조
```

### 개발자가 참조할 때
한글판 파일을 직접 열어서 읽으세요:
- `database/access-ko.mdc`
- `backend/api-development-ko.mdc`
- `frontend/design-system-ko.mdc`

---

## ⚠️ 주의사항

### 절대 하지 말 것
- ❌ 한글판만 수정하고 영문판 업데이트 안 함
- ❌ 영문판과 한글판 내용이 다르게 됨
- ❌ `-ko.mdc` 파일에 `alwaysApply: true` 설정

### 반드시 할 것
- ✅ 영문판과 한글판 모두 동시에 업데이트
- ✅ 내용의 일관성 유지
- ✅ 번역 정확성 확인

---

## 📞 문의 및 기여

규칙 파일 개선이 필요하거나 새로운 카테고리가 필요한 경우:
1. 이슈 생성
2. 영문판과 한글판 모두 작성
3. PR 제출

---

**마지막 업데이트**: 2025-10-28

