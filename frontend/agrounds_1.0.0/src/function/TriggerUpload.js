// flutter 앱의 업로드 기능 트리거
// match_code, user_code, 생성한 gps파일 업로드 url을 flutter로 넘겨줌

import client from "../client";

export function triggerUpload() {
    let match_code = ""
    let user_code = sessionStorage.getItem("userCode");
    let url = ""
    
    const formData = {
      user_code : user_code
    }
    // 타임아웃과 함께 API 호출
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('요청 시간 초과')), 15000); // 15초 타임아웃
    });

    Promise.race([
      client.post('api/match/get-upload-url/', formData),
      timeoutPromise
    ]).then((res)=>{
      match_code = res.data.match_code
      url = res.data.url
      if (window.UploadChannel) {
        window.UploadChannel.postMessage(JSON.stringify({
            user_code: user_code,
            match_code: match_code,
            url: url
        }))
      } else {
        // 웹 환경에서는 Upload 페이지로 이동
        window.location.href = '/app/upload';
      }
    }).catch((err)=>{
      console.error('업로드 URL 요청 실패:', err);
      
      if (err.message === '요청 시간 초과') {
        alert('서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        alert('네트워크 연결이 불안정합니다. 네트워크 상태를 확인해주세요.');
      } else {
        alert('오류가 발생했습니다: ' + (err.response?.data?.message || err.message));
      }
      
      // 오류 발생 시에도 Upload 페이지로 이동 (오프라인 기능용)
      if (!window.UploadChannel) {
        window.location.href = '/app/upload';
      }
    })
}