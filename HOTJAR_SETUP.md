# Contentsquare 통합 가이드

## 개요
- **도구**: Contentsquare (UX Analytics)
- **스크립트 URL**: `https://t.contentsquare.net/uxa/ec61b01b97502.js`
- **통합 방식**: `src/utils/contentsquare.js` 유틸을 통해 동적 로드

## 1단계: Contentsquare 프로젝트 설정

1. **Contentsquare 대시보드 접속**
   - https://contentsquare.com 에서 계정 생성 또는 로그인

2. **사이트/프로젝트 선택**
   - 기존 프로젝트 사용 또는 새 프로젝트 생성
   - 제공된 **Project ID: 395524** 확인 (요청 시 사용)

3. **태그 정보 확인**
   - 대시보드에서 제공하는 기본 스크립트 URL이 `https://t.contentsquare.net/uxa/ec61b01b97502.js`인지 확인

## 2단계: 프로젝트에 Contentsquare 스크립트 추가

### 자동 초기화 (이미 적용됨)
- `frontend/agrounds_1.0.0/src/utils/contentsquare.js`
  - 스크립트 중복 로드 방지 및 글로벌 객체 초기화 처리
- `frontend/agrounds_1.0.0/src/index.js`
  - 앱 시작 시 `initializeContentsquare()` 호출
  ```javascript
  import { initializeContentsquare } from './utils/contentsquare';
  
  // Contentsquare(Xiti) 추적 스크립트 초기화
  initializeContentsquare();
  ```

### 직접 스크립트 태그 추가가 필요한 경우 (대안)
- `public/index.html` 의 `</head>` 직전에 아래의 스크립트 삽입
  ```html
  <script src="https://t.contentsquare.net/uxa/ec61b01b97502.js" async></script>
  ```
- 현재는 JS 유틸을 통해 자동으로 로드하고 있으므로 별도 추가는 필요하지 않음

## 3단계: 설치 확인
1. 개발자 도구 (F12) > Console에서 `window._uxa` 존재 여부 확인
2. Contentsquare 대시보드에서 실시간 데이터 수집 여부 확인 (몇 분 소요 가능)

## 4단계: 사용자/이벤트 추적 (선택 사항)
Contentsquare는 기본적으로 페이지뷰, 클릭, 스크롤 등을 자동 추적합니다.
추가적인 사용자 속성이나 이벤트 전송이 필요하면 공식 문서를 참고하세요.

## 문제 해결
- **스크립트가 로드되지 않을 때**
  - 네트워크 탭에서 `https://t.contentsquare.net/uxa/ec61b01b97502.js` 요청이 성공했는지 확인
  - Ad-blocker 또는 브라우저 확장 프로그램이 스크립트를 차단하는지 점검

- **데이터가 대시보드에 나타나지 않을 때**
  - 도메인이 Contentsquare 프로젝트 설정에 등록되어 있는지 확인
  - 데이터 반영까지 최대 수 분 소요될 수 있음

## 참고
- 이전 Hotjar 연동 코드는 제거되었으며, 현재는 Contentsquare 기반으로 사용자 행동이 수집됩니다.
- 필요 시 다시 Hotjar 또는 다른 도구를 병행할 수 있으며, 중복 추적에 따른 성능/프라이버시 고려가 필요합니다.

