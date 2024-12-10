import React, {useState} from 'react';
import img from '../../../assets/onboard_bg.png';
import '../css/Onboard.scss';
import Circle_common_btn from '../../../components/Circle_common_btn';
import Rec_Common_btn from '../../../components/Rec_common_btn';
import Symbol from '../../../assets/symbol.png';
import LoginModal from './LoginModal';

const Onboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
    <div className='background'>
      <img src={img} className='img'/>
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
          <Rec_Common_btn backgroundColor='#F7DE0C' title='카카오로 시작하기' color='black'></Rec_Common_btn>
        </div>
      </LoginModal>
    </div>
  );
};

export default Onboard;
