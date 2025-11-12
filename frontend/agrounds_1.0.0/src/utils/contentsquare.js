// Contentsquare 초기화 유틸리티

const CONTENTSQUARE_SCRIPT_ID = 'contentsquare-tracker';
const CONTENTSQUARE_SRC = 'https://t.contentsquare.net/uxa/ec61b01b97502.js';

export const initializeContentsquare = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // 이미 스크립트가 로드된 경우 중복 추가 방지
  if (document.getElementById(CONTENTSQUARE_SCRIPT_ID)) {
    return;
  }

  // Contentsquare 글로벌 객체 초기화 (권장 패턴)
  window._uxa = window._uxa || [];

  const script = document.createElement('script');
  script.src = CONTENTSQUARE_SRC;
  script.async = true;
  script.id = CONTENTSQUARE_SCRIPT_ID;

  document.head.appendChild(script);
};
