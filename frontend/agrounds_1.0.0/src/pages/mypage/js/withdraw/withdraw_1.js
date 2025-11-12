import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/withdraw/withdraw_1.scss';
import BackTitle_Btn from '../../../../components/BackTitle_Btn';
import Login_title from '../../../../components/Login_title';
import rightarrow from '../../../../assets/common/left.png';

const SelectReason = () => {
  const navigate = useNavigate();

  // 테스트 유저 체크 함수
  const isTestUser = () => {
    const userCode = sessionStorage.getItem('userCode');
    return userCode === 'test_player' || userCode === 'test_team';
  };

  // 컴포넌트 마운트 시 테스트 유저 체크
  React.useEffect(() => {
    if (isTestUser()) {
      alert('테스트 유저는 사용할 수 없는 기능입니다');
      navigate(-1); // 이전 페이지로 돌아가기
    }
  }, [navigate]);

  // 탈퇴 사유 선택 핸들러
  const handleReasonClick = (reason, path) => {
    // 테스트 유저 체크
    if (isTestUser()) {
      alert('테스트 유저는 사용할 수 없는 기능입니다');
      return;
    }
    if (reason) {
      navigate(path, {state: {reason: reason}});
    } else {
      navigate(path);
    }
  };

  const Contents = ({ title, onClick }) => {
    return (
      <div className='reasontitlebox' onClick={onClick}>
        <p className='title1'>{title}</p>
        <img className='arrow1' src={rightarrow} alt='arrow' />
      </div>
    );
  };

  return (
    <div className='selectreason'>
      <BackTitle_Btn navTitle='서비스 탈퇴' />
      <Login_title title='탈퇴하시는 이유가 무엇인가요?' explain='더 나은 서비스가 될 수 있도록 의견을 들려주세요' />
      <Contents title='사용하지 않는 앱이에요' onClick={() => handleReasonClick('사용하지 않는 앱이에요', '/app/withdrawlast')} />
      <Contents title='사용법이 어려워요' onClick={() => handleReasonClick('사용법이 어려워요', '/app/withdrawlast')} />
      <Contents title='오류가 많아요' onClick={() => handleReasonClick('오류가 많아요', '/app/withdrawlast')} />
      <Contents title='보안이 걱정돼요' onClick={() => handleReasonClick('보안이 걱정돼요', '/app/withdrawlast')} />
      <Contents title='개인정보가 불안해요' onClick={() => handleReasonClick('개인정보가 불안해요', '/app/withdrawlast')} />
      <Contents title='특별한 이유 없음' onClick={() => handleReasonClick('특별한 이유 없음', '/app/withdrawlast')} />
      <Contents title='기타' onClick={() => handleReasonClick(null, '/app/withdraw-other-reason')} />
    </div>
  );
};

export default SelectReason;