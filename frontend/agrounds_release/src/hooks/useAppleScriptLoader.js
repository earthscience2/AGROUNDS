import { useEffect, useState } from 'react';

export default function useAppleScriptLoader() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const scriptId = "apple-login-script";

    if (document.getElementById(scriptId)) {
      setIsReady(true); // 이미 로드된 경우 바로 true
      return;
    }

    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.id = scriptId;
    script.async = true;
    script.onload = () => {
      console.log("Apple JS SDK loaded");
      setIsReady(true); // ✅ SDK 로드 완료됨
    };

    document.body.appendChild(script);
  }, []);

  return isReady;
}
