# 모달 분석 및 디자인 시스템 비교 문서

## 📋 모달 목록

### 1. Anal_Folder.js
- **모달**: `MatchActionModal` (경기 설정 모달)
- **위치**: `components/MatchActionModal.js`
- **용도**: 경기 이름 변경, 경기 삭제

### 2. Anal.js
- **모달**: `MatchActionModal` (쿼터 설정 모달)
- **위치**: `components/MatchActionModal.js`
- **용도**: 쿼터 이름 변경 (삭제 기능 숨김)

### 3. Video_Folder.js
- **모달 1**: `FolderActionModal` (폴더 설정 모달)
- **위치**: `components/FolderActionModal.js`
- **용도**: 폴더 이름 변경, 폴더 삭제

- **모달 2**: `FolderCreateModal` (폴더 생성 모달)
- **위치**: `components/FolderCreateModal.js`
- **용도**: 새 폴더 생성

### 4. Video_List.js
- **모달 1**: `VideoAddModal` (영상 추가 모달)
- **위치**: `components/VideoAddModal.js`
- **용도**: YouTube URL 입력 및 쿼터 연결

- **모달 2**: `VideoActionModal` (영상 액션 모달)
- **위치**: `components/VideoActionModal.js`
- **용도**: 영상보기, 분석결과 확인

- **모달 3**: `VideoOptionModal` (영상 옵션 모달)
- **위치**: `components/VideoOptionModal.js`
- **용도**: 관련 쿼터 변경, 삭제

- **모달 4**: `VideoChangeQuarterModal` (쿼터 변경 모달)
- **위치**: `components/VideoChangeQuarterModal.js`
- **용도**: 영상에 연결된 쿼터 변경

- **모달 5**: `VideoDeleteModal` (영상 삭제 확인 모달)
- **위치**: `components/VideoDeleteModal.js`
- **용도**: 영상 삭제 확인

### 5. Anal_Detail.js
- **모달**: 없음

---

## 🔍 디자인 시스템 준수 여부 비교표

| 모달명 | 파일 | Border Radius | Z-Index | Padding | Box Shadow | 오버레이 배경 | CSS 변수 사용 | 하드코딩 색상 | 디자인 시스템 준수 |
|--------|------|---------------|---------|---------|------------|---------------|---------------|----------------|-------------------|
| **MatchActionModal** | `MatchActionModal.js` | ❌ **24px** (시스템: 16px) | ❌ **1000** (시스템: 2000) | ❌ **24px 20px** (시스템: var(--spacing-xl)) | ❌ 없음 (시스템: 0 10px 30px rgba(0,0,0,0.2)) | ✅ rgba(0,0,0,0.5) | ❌ 하드코딩 (#FFFFFF, #079669 등) | ✅ 있음 | ❌ **불일치** |
| **FolderActionModal** | `FolderActionModal.js` + `.scss` | ✅ **16px** | ✅ **2000** | ✅ **var(--spacing-xl)** | ✅ **0 10px 30px rgba(0,0,0,0.2)** | ✅ rgba(0,0,0,0.5) | ✅ CSS 변수 사용 | ✅ 없음 | ✅ **준수** |
| **FolderCreateModal** | `FolderCreateModal.js` + `.scss` | ✅ **16px** | ✅ **2000** | ✅ **var(--spacing-xl)** | ✅ **0 10px 30px rgba(0,0,0,0.2)** | ✅ rgba(0,0,0,0.5) | ✅ CSS 변수 사용 | ✅ 없음 | ✅ **준수** |
| **VideoAddModal** | `VideoAddModal.js` (styled-components) | ❌ **24px** (시스템: 16px) | ❌ **1000** (시스템: 2000) | ❌ **24px 20px** (시스템: var(--spacing-xl)) | ❌ 없음 (시스템: 0 10px 30px rgba(0,0,0,0.2)) | ✅ rgba(0,0,0,0.5) | ❌ 하드코딩 (#FFFFFF, #079669 등) | ✅ 있음 | ❌ **불일치** |
| **VideoActionModal** | `VideoActionModal.js` + `.scss` | ✅ **16px** | ✅ **2000** | ✅ **var(--spacing-xl)** | ✅ **0 10px 30px rgba(0,0,0,0.2)** | ✅ rgba(0,0,0,0.5) | ✅ CSS 변수 사용 | ✅ 없음 | ✅ **준수** |
| **VideoOptionModal** | `VideoOptionModal.js` + `.scss` | ✅ **16px** | ✅ **2000** | ✅ **var(--spacing-xl)** | ✅ **0 10px 30px rgba(0,0,0,0.2)** | ✅ rgba(0,0,0,0.5) | ✅ CSS 변수 사용 | ✅ 없음 | ✅ **준수** |
| **VideoChangeQuarterModal** | `VideoChangeQuarterModal.js` (styled-components) | ❌ **24px** (시스템: 16px) | ❌ **1000** (시스템: 2000) | ❌ **24px 20px** (시스템: var(--spacing-xl)) | ❌ 없음 (시스템: 0 10px 30px rgba(0,0,0,0.2)) | ✅ rgba(0,0,0,0.5) | ❌ 하드코딩 (#FFFFFF, #079669 등) | ✅ 있음 | ❌ **불일치** |
| **VideoDeleteModal** | `VideoDeleteModal.js` + `.scss` | ✅ **16px** | ✅ **2000** | ✅ **var(--spacing-xl)** | ✅ **0 10px 30px rgba(0,0,0,0.2)** | ✅ rgba(0,0,0,0.5) | ✅ CSS 변수 사용 | ✅ 없음 | ✅ **준수** |

---

## ⚠️ 디자인 시스템 위반 상세 분석

### 1. MatchActionModal (경기 설정 모달)
**위반 사항:**
- ❌ `border-radius: 24px` → **시스템: 16px**
- ❌ `z-index: 1000` → **시스템: 2000**
- ❌ `padding: 24px 20px` → **시스템: var(--spacing-xl) (20px)**
- ❌ `box-shadow` 없음 → **시스템: 0 10px 30px rgba(0,0,0,0.2)**
- ❌ 하드코딩된 색상 사용 (#FFFFFF, #079669, #EF4444 등)
- ❌ CSS 변수 미사용

**사용 위치:**
- `Anal_Folder.js` - 경기 이름 변경/삭제
- `Anal.js` - 쿼터 이름 변경

---

### 2. VideoAddModal (영상 추가 모달)
**위반 사항:**
- ❌ `border-radius: 24px` → **시스템: 16px**
- ❌ `z-index: 1000` → **시스템: 2000**
- ❌ `padding: 24px 20px` → **시스템: var(--spacing-xl) (20px)**
- ❌ `box-shadow` 없음 → **시스템: 0 10px 30px rgba(0,0,0,0.2)**
- ❌ 하드코딩된 색상 사용 (#FFFFFF, #079669, #E2E8F0 등)
- ❌ CSS 변수 미사용

**사용 위치:**
- `Video_List.js` - YouTube URL 입력 및 쿼터 연결

---

### 3. VideoChangeQuarterModal (쿼터 변경 모달)
**위반 사항:**
- ❌ `border-radius: 24px` → **시스템: 16px**
- ❌ `z-index: 1000` → **시스템: 2000**
- ❌ `padding: 24px 20px` → **시스템: var(--spacing-xl) (20px)**
- ❌ `box-shadow` 없음 → **시스템: 0 10px 30px rgba(0,0,0,0.2)**
- ❌ 하드코딩된 색상 사용 (#FFFFFF, #079669, #ef4444 등)
- ❌ CSS 변수 미사용

**사용 위치:**
- `Video_List.js` - 영상에 연결된 쿼터 변경

---

## ✅ 디자인 시스템 준수 모달

### 1. FolderActionModal
- ✅ 모든 스타일이 디자인 시스템 준수
- ✅ CSS 변수 사용
- ✅ SCSS 파일로 관리

### 2. FolderCreateModal
- ✅ 모든 스타일이 디자인 시스템 준수
- ✅ CSS 변수 사용
- ✅ SCSS 파일로 관리

### 3. VideoActionModal
- ✅ 모든 스타일이 디자인 시스템 준수
- ✅ CSS 변수 사용
- ✅ SCSS 파일로 관리

### 4. VideoOptionModal
- ✅ 모든 스타일이 디자인 시스템 준수
- ✅ CSS 변수 사용
- ✅ SCSS 파일로 관리

### 5. VideoDeleteModal
- ✅ 모든 스타일이 디자인 시스템 준수
- ✅ CSS 변수 사용
- ✅ SCSS 파일로 관리

---

## 📊 요약 통계

- **총 모달 수**: 8개
- **디자인 시스템 준수**: 5개 (62.5%)
- **디자인 시스템 위반**: 3개 (37.5%)

### 위반 모달 목록:
1. MatchActionModal
2. VideoAddModal
3. VideoChangeQuarterModal

### 공통 위반 패턴:
- `styled-components` 사용 모달들이 모두 위반
- `border-radius: 24px` (시스템: 16px)
- `z-index: 1000` (시스템: 2000)
- 하드코딩된 색상 사용
- CSS 변수 미사용

---

## 🔧 권장 수정 사항

### MatchActionModal 수정 필요:
1. `border-radius: 24px` → `16px`
2. `z-index: 1000` → `2000`
3. `padding: 24px 20px` → `var(--spacing-xl)`
4. `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2)` 추가
5. 하드코딩 색상을 CSS 변수로 변경
6. SCSS 파일로 전환 고려

### VideoAddModal 수정 필요:
1. `border-radius: 24px` → `16px`
2. `z-index: 1000` → `2000`
3. `padding: 24px 20px` → `var(--spacing-xl)`
4. `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2)` 추가
5. 하드코딩 색상을 CSS 변수로 변경
6. SCSS 파일로 전환 고려

### VideoChangeQuarterModal 수정 필요:
1. `border-radius: 24px` → `16px`
2. `z-index: 1000` → `2000`
3. `padding: 24px 20px` → `var(--spacing-xl)`
4. `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2)` 추가
5. 하드코딩 색상을 CSS 변수로 변경
6. SCSS 파일로 전환 고려

---

## 📝 디자인 시스템 기준값 (참고)

### 모달 기본 스타일:
- **배경**: `var(--bg-surface)` (#FFFFFF)
- **Border Radius**: `16px`
- **Padding**: `var(--spacing-xl)` (20px)
- **Box Shadow**: `0 10px 30px rgba(0, 0, 0, 0.2)`
- **Z-Index**: `2000`
- **오버레이 배경**: `rgba(0, 0, 0, 0.5)`

### 모달 헤더:
- **Padding**: `var(--spacing-xl)` (20px)
- **Border Bottom**: `1px solid var(--border)`
- **타이틀**: 중앙 정렬

### 모달 푸터:
- **Padding**: `var(--spacing-xl)` (20px)
- **Border Top**: `1px solid var(--border)`
- **버튼 간격**: `var(--spacing-sm)` (8px)

### 버튼:
- **Primary Button**: `var(--primary)` 배경, `var(--bg-surface)` 텍스트
- **Secondary Button**: `var(--bg-surface)` 배경, `2px solid var(--border)` 테두리
- **Min Height**: `44px` (접근성 기준)
- **Border Radius**: `12px`

---

**생성일**: 2024년
**분석 대상**: player 페이지 내 모든 모달 컴포넌트

