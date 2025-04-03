import { useEffect, useState } from 'react';
import useAppleScriptLoader from './useAppleScriptLoader';
import client from '../client'

export default function useAppleRedirectLogin() {
  const isReady = useAppleScriptLoader();

  const signInWithApple = () => {
    if (isReady && window.AppleID?.auth) {
      window.AppleID.auth.init({
        clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: 'https://agrounds.com/app/loading-for-login',
        usePopup: true,
      });

      window.AppleID.auth.signIn().then(({ authorization }) => {
        const id_token = authorization.id_token;

        window.location.replace(
          process.env.REACT_APP_BASE_URL + 
          "/api/login/apple/callback/?hostname=" + 
          window.location.hostname + 
          "&id_token=" + id_token);

        console.log(id_token)
      })
      .catch(err => {
        if (err?.error === 'popup_closed_by_user') {
          console.log('사용자가 로그인 팝업을 닫았습니다.');
        } else {
          console.error('Apple 로그인 에러:', err);
        }
      });
    } else {
      console.error("AppleID SDK not loaded yet");
    }
  };

  return { signInWithApple };
}