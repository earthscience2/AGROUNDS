# 📋 AGROUNDS Cursor Rules 설정 요약

## ✅ 완료된 작업

### 1️⃣ 폴더 구조화
```
.cursor/rules/
├── 최상위 (항상 참조)
│   ├── guidelines.mdc ⭐ AI - 항상 적용
│   ├── 00-navigation-hub.mdc ⭐ AI - 항상 적용
│
├── database/ 📊
├── backend/ 💻
├── frontend/ 🎨
├── cloud/ ☁️
├── features/ 🎯
└── general/ 🏗️
```

### 2️⃣ 영문/한글 분리
- **영문판 (`.mdc`)** ⭐ AI가 참조
- **한글판 (`-ko.mdc`)** 👤 사람이 참조

### 3️⃣ AI 참조 규칙 설정
- ✅ 한글 파일 무시 규칙 추가
- ✅ 영문판 변경시 한글판도 업데이트 규칙 추가
- ✅ 모든 한글 파일에 경고 헤더 추가

---

## 🤖 AI가 참조하는 파일

### ⭐ 항상 참조 (alwaysApply: true)

1. **`guidelines.mdc`**
   - 핵심 제약사항
   - 빠른 네비게이션
   - 한글 파일 무시 규칙 포함

2. **`00-navigation-hub.mdc`**
   - 전체 규칙 카탈로그
   - 카테고리별 네비게이션
   - 파일 업데이트 프로토콜

### 🔍 선택적 참조 (필요시 자동 선택)

| 카테고리 | 파일 | 용도 |
|---------|------|------|
| **데이터베이스** | `database/access.mdc` | MySQL DB 접근 및 검증 |
| | `database/patterns.mdc` | 모델 패턴 및 쿼리 |
| **백엔드** | `backend/api-development.mdc` | Django REST API |
| **프론트엔드** | `frontend/components.mdc` | React 컴포넌트 |
| | `frontend/design-system.mdc` | 디자인 시스템 |
| **일반** | `general/project-guidelines.mdc` | 프로젝트 가이드 |

### ❌ 절대 참조하지 않음

모든 **`*-ko.mdc`** 파일 (한글판)
- AI는 읽지 않음
- 사람 개발자만 읽음

---

## 📝 파일 업데이트 규칙

### 영문판 수정시
1. ✅ 영문 파일 수정 (예: `access.mdc`)
2. ✅ 한글 파일도 수정 (예: `access-ko.mdc`)
3. ✅ 내용 일관성 확인
4. ✅ 번역 정확성 확인

### AI가 자동으로 체크
- 영문판 수정시 한글판도 함께 수정하도록 알림
- 두 파일의 동기화 유지

---

## 🎯 항상 참고해야 하는 파일 목록

### AI용 (alwaysApply: true)
```
.cursor/rules/
├── guidelines.mdc           ← 항상 참조
└── 00-navigation-hub.mdc    ← 항상 참조
```

### 나머지 모드
- **선택적 참조** (기본): 나머지 모든 영문 `.mdc` 파일
- **절대 참조 안 함**: 모든 `-ko.mdc` 한글 파일

---

## 🔧 Cursor Rules 모드 설정 방법

### alwaysApply (항상 적용)
```markdown
---
alwaysApply: true
---
# 파일 내용...
```
✅ 적용 파일: `guidelines.mdc`, `00-navigation-hub.mdc`

### 선택적 참조 (기본)
```markdown
# 파일 내용...
(메타데이터 없음)
```
✅ 적용 파일: 나머지 모든 영문 `.mdc` 파일

### 참조 제외 (한글 파일)
```markdown
---
# ⚠️ 이 파일은 AI가 읽지 않습니다
---
# 파일 내용...
```
✅ 적용 파일: 모든 `-ko.mdc` 파일

---

## 📊 파일 통계

- 총 규칙 파일: **16개**
  - 영문판 (AI용): **8개**
  - 한글판 (사람용): **8개**
- 폴더: **6개**
- 항상 참조 파일: **2개**

---

## 🚀 사용 예시

### 질문 → AI 자동 참조
```
질문: "DB와 models.py 일치 확인해줘"
AI 참조: guidelines.mdc + 00-navigation-hub.mdc + database/access.mdc

질문: "팀 생성 API 만들어줘"  
AI 참조: guidelines.mdc + 00-navigation-hub.mdc + backend/api-development.mdc

질문: "버튼 스타일 확인해줘"
AI 참조: guidelines.mdc + 00-navigation-hub.mdc + frontend/design-system.mdc
```

### 개발자가 직접 참조
```
한글 파일 직접 열기:
- database/access-ko.mdc
- backend/api-development-ko.mdc  
- frontend/design-system-ko.mdc
```

---

## ⚠️ 중요 규칙

### 절대 하지 말 것
- ❌ 한글판만 수정하고 영문판 안 함
- ❌ 영문판과 한글판 내용 불일치
- ❌ `-ko.mdc` 파일에 `alwaysApply: true` 설정

### 반드시 할 것
- ✅ 영문판 + 한글판 동시 수정
- ✅ 내용 일관성 유지
- ✅ `alwaysApply: true`는 2개 파일만

---

## 📞 참고 문서

- **전체 문서**: `README.md`
- **네비게이션**: `00-navigation-hub.mdc` (영문) / `00-navigation-hub-ko.mdc` (한글)
- **빠른 참조**: `guidelines.mdc` (영문) / `guidelines-ko.mdc` (한글)

---

**작성일**: 2025-10-28  
**상태**: ✅ 완료

