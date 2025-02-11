import React, { useState } from 'react';
import '../../css/secession/SecessionLast.scss';
import BackTitle_Btn from '../../../../components/BackTitle_Btn';
import Login_title from '../../../../components/Login_title';
import Circle_common_btn from '../../../../components/Circle_common_btn';
import Modal from '../../../../components/Modal';
import Small_Common_Btn from '../../../../components/Small_Common_Btn';
import { useLocation, useNavigate } from 'react-router-dom';
import { reasonForWithdrawApi, withdrawApi } from '../../../../function/MyPageApi';

const SecessionLast = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  const selectedReason = location.state?.reason || '선택된 이유가 없습니다.'

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();

  const secessionbtn = () => {
    reasonForWithdrawApi({"user_code" : sessionStorage.getItem("userCode"), "reason": selectedReason});
    withdrawApi({"user_code": sessionStorage.getItem("userCode")})
    .then(() => {
      navigate('/app/secessioncomplete');
    })
    .catch((error) => {
      alert('회원탈퇴에 실패했습니다.');
    })
  }

  return (
    <div className='secessionlast'>
      <BackTitle_Btn navTitle='서비스 탈퇴'/>
      <Login_title title='서비스 탈퇴' explain='탈퇴하기 전에 아래 내용을 확인해주세요.' />
      <div className='quidebox'>
        <div className='explain'>
          <div className='dot'></div>
          에이그라운즈에 저장된 모든 정보들을 더 이상 볼 수 없어요.
        </div>
        <div className='explain'>
          <div className='dot'></div>
          다양한 혜택과 이벤트가 모두 사라져요.
        </div>
        <div className='explain'>
          <div className='dot'></div>
          가입했던 팀과 관련된 정보도 모두 삭제되요.
        </div>
        <div className='explain'>
          <div className='dot'></div>
          에이그라운즈에서 기록된 동영상은 모두 삭제되요.
        </div>
        <div className='explain'>
          <div className='dot'></div>
            탈퇴 후 다시 되돌릴 수 없어요.
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <p style={{margin:'2vh 0 1vh 0', fontFamily: 'Pretendard',fontSize:'1.8vh', fontWeight:'600'}}>정말로 서비스 탈퇴하시겠습니까?</p>
        <p style={{margin:'0 0 3vh 0', fontFamily: 'Pretendard', fontSize:'1.8vh', fontWeight:'600'}}>탈퇴 시 되돌릴 수 없습니다</p>
        <div className='buttonbox'>
          <Small_Common_Btn onClick={closeModal} title='취소' backgroundColor='#F2F4F8' color='black'></Small_Common_Btn>
          <Small_Common_Btn  onClick={secessionbtn} title='탈퇴하기' backgroundColor='#262626' color='white'></Small_Common_Btn>
        </div>
      </Modal>
      <div style={{marginTop:'45vh'}}/>
      <Circle_common_btn title="탈퇴하기" onClick={openModal} />
    </div>
  );
};

export default SecessionLast;