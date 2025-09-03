import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/GetStarted.scss';
import Circle_common_btn from '../../../components/Circle_common_btn';
import startLogo from '../../../assets/logo/start_logo.png';
import bottomLogo from '../../../assets/logo/buttom_logo.png';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className='background'>
      <div className='content'>
        <div className='symbol-badge'>
          <img className='symbol-img' src={startLogo} />
        </div>
        <p className='subtitle'>자신의 성장과 즐거움에 집중하세요</p>
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
            onClick={() => navigate('/app/login')}
            backgroundColor='#079669'
            height='54px'
            radius='28px'
            width='100%'
            fontSize='16px'
            fontWeight='600'
          />
        </div>
        <img className='brand-image' src={bottomLogo} />
      </div>
    </div>
  );
};

export default GetStarted;


