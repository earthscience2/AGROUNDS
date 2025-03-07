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
    client.post('api/match/get-upload-url/', formData).then((res)=>{
      match_code = res.data.match_code
      url = res.data.url
      if (window.UploadChannel) {
        window.UploadChannel.postMessage(JSON.stringify({
            user_code: user_code,
            match_code: match_code,
            url: url
        }))
      } else {
        alert("해당 기능은 앱에서만 사용 가능합니다.")
      }
    }).catch((err)=>{
      alert(err)
    })
}