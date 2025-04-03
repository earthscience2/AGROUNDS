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
        redirectURI: 'https://agrounds.com/app',
        usePopup: true,
      });

      window.AppleID.auth.signIn().then(({ authorization }) => {
        const id_token = authorization.id_token;

        window.location.replace(process.env.REACT_APP_BASE_URL + "/api/login/apple/?hostname=" + window.location.hostname);
      });
    } else {
      console.error("AppleID SDK not loaded yet");
    }
  };

  return { signInWithApple };
}