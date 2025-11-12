import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginModal.scss';
import appleLogo from '../../../assets/identify_icon/apple.png';
import kakaoLogo from '../../../assets/identify_icon/kakao.png';
import naverLogo from '../../../assets/identify_icon/naver.png';
import startLogo from '../../../assets/big_icons/logo_green.png';
import bottomLogo from '../../../assets/text_icon/logo_text_gray.png';
import blackLogo from '../../../assets/big_icons/logo_black.png';
import { GetUserInfoForTokenApi } from '../../../function/login/loginApi';

const Login = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 콜백에서 미가입자일 경우 알림 후 회원가입 페이지로 이동
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signupPrompt') === '1') {
      const encryptedId = params.get('id');
      const signupFromType = params.get('signupFromType');
      
      if (encryptedId) {
        localStorage.setItem('social_email', encryptedId);
      }
      
      if (signupFromType === '1') {
        navigate('/app/sign-in-1');
      } else {
        const confirmed = window.confirm('등록되지 않은 계정입니다. 회원가입을 진행하시겠습니까?');
        if (confirmed) {
          navigate('/app/sign-in-type');
        }
      }
    }
  }, [navigate]);

  const kakaoLogin = () => {
    // 백엔드 카카오 로그인 API 호출
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    // 인증은 배포 서버에서 처리, 콜백 후 리다이렉트 대상은 client 파라미터로 지정
    const serverBase = 'https://agrounds.com';
    const callbackHost = isLocal ? 'agrounds.com' : 'agrounds.com';
    const clientParam = isLocal ? 'localhost' : 'agrounds.com';
    const kakaoLoginUrl = `${serverBase}/api/login/kakao/?hostname=${callbackHost}&client=${clientParam}`;
    window.location.href = kakaoLoginUrl;
  };

  const handleAppleLogin = () => {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    const serverBase = 'https://agrounds.com';
    const callbackHost = isLocal ? 'agrounds.com' : 'agrounds.com';
    const clientParam = isLocal ? 'localhost' : 'agrounds.com';
    const appleLoginUrl = `${serverBase}/api/login/apple/?hostname=${callbackHost}&client=${clientParam}`;
    window.location.href = appleLoginUrl;
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 처리
    // 실제 구현에서는 카카오 OAuth 로그인 로직 추가
    checkUserInfoAndRedirect();
  };

  const handleNaverLogin = () => {
    // 백엔드 네이버 로그인 API 호출
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    const serverBase = 'https://agrounds.com';
    const callbackHost = isLocal ? 'agrounds.com' : 'agrounds.com';
    const clientParam = isLocal ? 'localhost' : 'agrounds.com';
    const naverLoginUrl = `${serverBase}/api/login/naver/?hostname=${callbackHost}&client=${clientParam}`;
    window.location.href = naverLoginUrl;
  };

  // 유저 정보 확인 및 리다이렉트 처리
  const checkUserInfoAndRedirect = async () => {
    try {
      // loginApi를 사용하여 사용자 정보 조회
      const response = await GetUserInfoForTokenApi();
      
      if (response.status === 200) {
        const userData = response.data;
        if (userData && userData.user_code) {
          // 유저 정보가 있으면 메인 페이지로 이동
          navigate('/app/main');
        } else {
          // 유저 정보가 없으면 알림창 표시 후 회원가입 페이지로 이동
          showUserNotFoundAlert();
        }
      } else {
        // API 호출 실패 시에도 회원가입 페이지로 이동
        showUserNotFoundAlert();
      }
    } catch (error) {
      // 네트워크 오류 등으로 인해 유저 정보 확인 실패 시 회원가입 페이지로 이동
      showUserNotFoundAlert();
    }
  };

  // 유저 정보 없음 알림창 표시
  const showUserNotFoundAlert = () => {
    alert('등록된 정보가 없습니다. 회원가입 페이지로 이동합니다.');
    navigate('/app/sign-in-type');
  };

  return (
    <div className={`login-page ${isVisible ? 'visible' : ''}`}>
      <div className='login-content'>
        <div className='login-header'>
          <div className='symbol-badge'>
            <img 
              className='symbol-img' 
              src={startLogo} 
              alt='AGROUNDS 로고'
            />
          </div>
          <h1 className='login-title text-h2'>오늘의 시작이<br />내일의 나를 키워요</h1>
        </div>

        <div className='login-footer'>
          <div className='login-buttons'>
            <button 
              className='social-login-btn apple-btn'
              onClick={handleAppleLogin}
              aria-label='애플로 로그인'
            >
              <img src={appleLogo} alt='Apple' className='social-icon' />
              <span className='btn-text'>애플로 로그인</span>
            </button>
            
            <button 
              className='social-login-btn kakao-btn'
              onClick={kakaoLogin}
              aria-label='카카오톡으로 로그인'
            >
              <img src={kakaoLogo} alt='Kakao' className='social-icon' />
              <span className='btn-text'>카카오톡으로 로그인</span>
            </button>
            
            <button 
              className='social-login-btn naver-btn'
              onClick={handleNaverLogin}
              aria-label='네이버로 로그인'
            >
              <img src={naverLogo} alt='Naver' className='social-icon' />
              <span className='btn-text'>네이버로 로그인</span>
            </button>
            
            <button 
              className='social-login-btn agrounds-btn'
              onClick={() => navigate('/app/sign-in-type')}
              aria-label='AGROUNDS 회원가입'
            >
              <img src={blackLogo} alt='AGROUNDS' className='social-icon' />
              <span className='btn-text'>AGROUNDS 회원가입</span>
            </button>
          </div>
          
          <img 
            className='brand-image' 
            src={bottomLogo} 
            alt='AGROUNDS'
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
