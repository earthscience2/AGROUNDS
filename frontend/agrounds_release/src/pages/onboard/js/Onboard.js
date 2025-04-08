import React, {useState} from 'react';
import img from '../../../assets/onboard_bg.png';
import '../css/Onboard.scss';
import Circle_common_btn from '../../../components/Circle_common_btn';
import Rec_Common_btn from '../../../components/Rec_common_btn';
import Rec_half_btn from '../../../components/Rec_half_btn'
import Symbol from '../../../assets/symbol.png';
import LoginModal from './LoginModal';
import kakao from '../../../assets/kakao.png'
import apple from '../../../assets/apple-logo.png'
import useAppleRedirectLogin from '../../../hooks/useAppleRedirectLogin';

const Onboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);


  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const { signInWithApple } = useAppleRedirectLogin();
  const kakaoLogin = () => { // 카카오 로그인 처리를 위해 서버 측 url로 redirect
    let hostname = window.location.hostname
    if(hostname !== 'localhost')
        hostname = 'agrounds.com'
    window.location.replace(process.env.REACT_APP_BASE_URL + "/api/login/kakao/?hostname=" + hostname);
  };

  return (
    <div className='background'>
      <img src={img} className='img'/>
      <div className='img-gradation'></div>
      <p className='logo'>AGROUNDS</p>
      <p className='ment'>나의 축구 실력을 <br/>기록하고 공유해보세요</p>
      <Circle_common_btn title="시작하기" onClick={handleModalOpen}/>

      <LoginModal isOpen={isModalOpen} onClose={handleModalClose}>
        <div className="modal-inner">
          <img className='symbol' src={Symbol} />
          <p className="modal-title">환영해요!</p>
          <p className="modal-description">
            GPS와 AI CAM을 통해 나의 경기 데이터를 <br/>분석하고 더 높이 성장해보세요.
          </p>
          <div className="modal-button-area">
            <Rec_half_btn onClick={kakaoLogin} backgroundColor='#F7DE0C' title='카카오 로그인' color='black' src={kakao}></Rec_half_btn>
            <Rec_half_btn onClick={signInWithApple} backgroundColor='#F4F4F4' title='Apple 로그인' color='black' src={apple}></Rec_half_btn>
          </div>
        </div>
      </LoginModal>
    </div>
  );
};

export default Onboard;
