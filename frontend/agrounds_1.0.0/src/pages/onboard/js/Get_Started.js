import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/GetStarted.scss';
import Circle_common_btn from '../../../components/Circle_common_btn';
import startLogo from '../../../assets/big_icons/logo_green.png';
import bottomLogo from '../../../assets/text_icon/logo_text_gray.png';

const GetStarted = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 페이지 로드 애니메이션
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/app/login');
  };

  return (
    <div className={`background ${isVisible ? 'visible' : ''}`}>
      <div className='content'>
        <div className='symbol-badge'>
          <img 
            className='symbol-img' 
            src={startLogo} 
            alt='AGROUNDS 로고'
          />
        </div>
        <p className='subtitle text-body-lg'>자신의 성장과 즐거움에 집중하세요</p>
        <div className='headline'>
          <h1 className='word text-display'>AI</h1>
          <h1 className='word highlight text-display'>Assist</h1>
          <h1 className='word text-display'>Amateur</h1>
        </div>
      </div>
      <div className='footer'>
        <div className='cta-area'>
          <Circle_common_btn
            title="시작하기"
            onClick={handleGetStarted}
            backgroundColor='#079669'
            height='54px'
            radius='28px'
            width='100%'
            fontSize='16px'
            fontWeight='600'
            ariaLabel='AGROUNDS 시작하기'
          />
        </div>
        <img 
          className='brand-image' 
          src={bottomLogo} 
          alt='AGROUNDS'
        />
      </div>
    </div>
  );
};

export default GetStarted;