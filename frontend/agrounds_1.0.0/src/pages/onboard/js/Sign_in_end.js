import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/GetStarted.scss';
import Circle_common_btn from '../../../components/Circle_common_btn';
import startLogo from '../../../assets/big_icons/logo_green.png';
import bottomLogo from '../../../assets/text_icon/logo_text_gray.png';

const Sign_in_end = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 이전 페이지에서 저장된 사용자 정보 가져오기
    const nickname = localStorage.getItem('userNickname');
    const height = localStorage.getItem('userHeight');
    const weight = localStorage.getItem('userWeight');
    const birthDate = localStorage.getItem('userBirthDate');
    const gender = localStorage.getItem('userGender');
    const userType = localStorage.getItem('userType');
    const userLevel = localStorage.getItem('userLevel');
    const preferredPosition = localStorage.getItem('preferredPosition');
    const aiPersonality = localStorage.getItem('aiPersonality');
    
    if (nickname) {
      setUserInfo({
        nickname,
        height,
        weight,
        birthDate,
        gender,
        userType,
        userLevel,
        preferredPosition,
        aiPersonality
      });
    } else {
      // 사용자 정보가 없으면 첫 번째 페이지로 리다이렉트
      navigate('/app/sign-in-1');
    }
  }, [navigate]);

  const handleStart = () => {
    // 로그인 페이지로 이동
    navigate('/app/login');
  };

  return (
    <div className={`background ${isVisible ? 'visible' : ''}`}>
      <div className='content'>
        <div className='symbol-badge'>
          <img className='symbol-img' src={startLogo} alt='AGROUNDS 로고' />
        </div>
        
        <p className='subtitle'>회원가입이 완료되었어요</p>
        
        <div className='headline'>
          <div className='word'>Ai</div>
          <div className='word highlight'>Assist</div>
          <div className='word'>Amateur</div>
        </div>
      </div>
      
      <div className='footer'>
        <div className='cta-area'>
          <Circle_common_btn
            title="시작하기"
            onClick={handleStart}
            backgroundColor='#079669'
            height='60px'
            radius='60px'
            width='100%'
            fontSize='16px'
            fontWeight='600'
          />
        </div>
        <img className='brand-image' src={bottomLogo} alt='AGROUNDS' />
      </div>
    </div>
  );
};

export default Sign_in_end;
