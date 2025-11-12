import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginModal.scss';
import startLogo from '../../../assets/big_icons/logo_green.png';
import appleLogo from '../../../assets/identify_icon/apple.png';
import kakaoLogo from '../../../assets/identify_icon/kakao.png';
import naverLogo from '../../../assets/identify_icon/naver.png';
import bottomLogo from '../../../assets/text_icon/logo_text_gray.png';
import leftArrow from '../../../assets/main_icons/back_black.png';

const Sign_in_type = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    // 뒤로가기 시 /app으로 이동하여 회원가입 문구가 나오지 않도록 함
    navigate('/app');
  };

  const kakaoSignup = () => { // 카카오 로그인 처리를 위해 절대주소로 이동
    localStorage.setItem('login_type', 'kakao'); // 카카오 로그인 타입 설정
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    const serverBase = 'https://agrounds.com';
    const callbackHost = 'agrounds.com';
    const clientParam = isLocal ? 'localhost' : 'agrounds.com';
    window.location.href = `${serverBase}/api/login/kakao/?hostname=${callbackHost}&client=${clientParam}&intent=signup`;
  };

  const naverSignup = () => { // 네이버 로그인 처리를 위해 절대주소로 이동
    localStorage.setItem('login_type', 'naver'); // 네이버 로그인 타입 설정
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    const serverBase = 'https://agrounds.com';
    const callbackHost = 'agrounds.com';
    const clientParam = isLocal ? 'localhost' : 'agrounds.com';
    window.location.href = `${serverBase}/api/login/naver/?hostname=${callbackHost}&client=${clientParam}&intent=signup`;
  };

  const appleSignup = () => { // 애플 로그인 처리를 위해 절대주소로 이동
    localStorage.setItem('login_type', 'apple'); // 애플 로그인 타입 설정
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    const serverBase = 'https://agrounds.com';
    const callbackHost = 'agrounds.com';
    const clientParam = isLocal ? 'localhost' : 'agrounds.com';
    window.location.href = `${serverBase}/api/login/apple/?hostname=${callbackHost}&client=${clientParam}&intent=signup`;
  };



  return (
    <div className={`login-page ${isVisible ? 'visible' : ''}`}>
      <div className='login-content'>
        <button 
          className='back-button'
          onClick={handleGoBack}
          aria-label='뒤로가기'
        >
          <img src={leftArrow} alt='뒤로가기' className='back-icon' />
        </button>

        <div className='login-header'>
          <div className='symbol-badge'>
            <img 
              className='symbol-img' 
              src={startLogo} 
              alt='AGROUNDS 로고'
            />
          </div>
          <h1 className='login-title text-h2'>서툰 시작은<br />부끄러운 게 아니에요</h1>
        </div>

        <div className='login-footer'>
          <div className='login-buttons'>
            <button 
              className='social-login-btn apple-btn'
              onClick={appleSignup}
              aria-label='애플로 회원가입'
            >
              <img src={appleLogo} alt='Apple' className='social-icon' />
              <span className='btn-text'>애플로 회원가입</span>
            </button>
            
            <button 
              className='social-login-btn kakao-btn'
              onClick={kakaoSignup}
              aria-label='카카오톡으로 회원가입'
            >
              <img src={kakaoLogo} alt='Kakao' className='social-icon' />
              <span className='btn-text'>카카오톡으로 회원가입</span>
            </button>
            
            <button 
              className='social-login-btn naver-btn'
              onClick={naverSignup}
              aria-label='네이버로 회원가입'
            >
              <img src={naverLogo} alt='Naver' className='social-icon' />
              <span className='btn-text'>네이버로 회원가입</span>
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

export default Sign_in_type;
