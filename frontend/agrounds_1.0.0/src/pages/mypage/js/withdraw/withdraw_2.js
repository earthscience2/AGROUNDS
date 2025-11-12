import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/withdraw/withdraw_2.scss';
import BackTitle_Btn from '../../../../components/BackTitle_Btn';
import Login_title from '../../../../components/Login_title';
import Circle_common_btn from '../../../../components/Circle_common_btn';
import Modal from '../../../../components/Modal';
import Small_Common_Btn from '../../../../components/Small_Common_Btn';

const SecessionLast = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const selectedReason = location.state?.reason || '선택된 이유가 없습니다.';

  // 테스트 유저 체크 함수
  const isTestUser = () => {
    const userCode = sessionStorage.getItem('userCode');
    return userCode === 'test_player' || userCode === 'test_team';
  };

  // 컴포넌트 마운트 시 테스트 유저 체크
  useEffect(() => {
    if (isTestUser()) {
      alert('테스트 유저는 사용할 수 없는 기능입니다');
      navigate(-1); // 이전 페이지로 돌아가기
    }
  }, [navigate]);

  const openModal = () => {
    // 테스트 유저 체크
    if (isTestUser()) {
      alert('테스트 유저는 사용할 수 없는 기능입니다');
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const secessionbtn = () => {
    // 테스트 유저 체크
    if (isTestUser()) {
      alert('테스트 유저는 사용할 수 없는 기능입니다');
      return;
    }
    alert('회원탈퇴 기능이 현재 비활성화되어 있습니다.');
  };

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
      <div className="button-container">
        <div className="circle-btn">
          <Circle_common_btn title="탈퇴하기" onClick={openModal} />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <p style={{ margin: '2vh 0 1vh 0', fontFamily: 'Pretendard', fontSize: '1.8vh', fontWeight: '600' }}>
          정말로 서비스 탈퇴하시겠습니까?
        </p>
        <p style={{ margin: '0 0 3vh 0', fontFamily: 'Pretendard', fontSize: '1.8vh', fontWeight: '600' }}>
          탈퇴 시 되돌릴 수 없습니다
        </p>
        <div className='buttonbox'>
          <Small_Common_Btn onClick={closeModal} title='취소' backgroundColor='#F2F4F8' color='black' />
          <Small_Common_Btn onClick={secessionbtn} title='탈퇴하기' backgroundColor='#262626' color='white' />
        </div>
      </Modal>
    </div>
  );
};

export default SecessionLast;