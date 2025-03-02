// flutter 앱의 업로드 기능 트리거
// match_code, user_code, 생성한 gps파일 업로드 url을 flutter로 넘겨줌

export function triggerUpload() {
    const match_code = "m_test"
    if (window.UploadChannel) {
        window.UploadChannel.postMessage(JSON.stringify({
            user_code: sessionStorage.getItem("userCode"),
            match_code: match_code,
            url: "https://agrounds.com"
        }))
      } else {
        alert("해당 기능은 앱에서만 사용 가능합니다.")
      }
}