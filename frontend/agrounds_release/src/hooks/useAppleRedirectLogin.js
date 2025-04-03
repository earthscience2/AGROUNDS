import { useEffect, useState } from 'react';
import useAppleScriptLoader from './useAppleScriptLoader';

export default function useAppleRedirectLogin() {
  const isReady = useAppleScriptLoader();

  const signInWithApple = () => {
    if (isReady && window.AppleID?.auth) {
      window.AppleID.auth.init({
        clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
        scope: 'name email',
        // redirectURI: process.env.REACT_APP_BASE_URL + '/api/login/apple/callback/',
        redirectURI: 'https://agrounds.com/api/login/apple/callback/',
        usePopup: false, // 리디렉션 방식
      });

      window.AppleID.auth.signIn();
    } else {
      console.error("AppleID SDK not loaded yet");
    }
  };

  return { signInWithApple };
}