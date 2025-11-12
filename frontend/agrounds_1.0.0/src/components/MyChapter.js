import React from 'react';
import rightarrow from '../assets/common/left.png';
import { useNavigate } from 'react-router-dom';

const MyChapter = ({chapter}) => {
  const navigate = useNavigate();

  // 테스트 유저 체크 함수
  const isTestUser = () => {
    const userCode = sessionStorage.getItem('userCode');
    return userCode === 'test_player' || userCode === 'test_team';
  };

  // 로그아웃 함수
  const handleLogout = () => {
    // 테스트 유저 체크
    if (isTestUser()) {
      alert('테스트 유저는 사용할 수 없는 기능입니다');
      return;
    }

    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      // 세션 스토리지와 로컬 스토리지 클리어
      sessionStorage.clear();
      localStorage.clear();
      
      // 로그인 페이지로 리다이렉트
      window.location.href = '/app';
    }
  };

  // 서비스 탈퇴 접근 핸들러
  const handleWithdraw = () => {
    // 테스트 유저 체크
    if (isTestUser()) {
      alert('테스트 유저는 사용할 수 없는 기능입니다');
      return;
    }

    navigate('/app/reason');
  };

  const EachContents = () => {
    switch (chapter) {
      case '계정':
        return (
          <>
            {/* <div className='titlebox' onClick={navigate('/reason')}>
              <p className='title'>이메일 변경</p>
              <p className='email'>agrounds@aground.com</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
            <div className='titlebox' onClick={navigate('/reason')}>
              <p className='title'>비밀번호 변경</p>
              <img className='arrow' src={rightarrow}></img>
            </div> */}
            <div className='titlebox logout-item' onClick={handleLogout}>
              <p className='title'>로그아웃</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
            <div className='titlebox' onClick={handleWithdraw}>
              <p className='title'>서비스 탈퇴</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
          </>
        )
      case '알림':
        return (
          <>
            <div className='titlebox' onClick={() => navigate('')}>
              <p className='title'>푸시 설정</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
            <div className='titlebox' onClick={() => navigate('')}>
              <p className='title'>기기 푸시 설정 안내</p>
              <img className='arrow' src={rightarrow}></img>
            </div>

          </>
        )
      case '일반':
        return (
          <>
            <div className='titlebox' onClick={() => navigate('/app/announcement-list')}>
              <p className='title'>공지사항</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
            <div className='titlebox' onClick={() => navigate('/app/event')}>
              <p className='title'>이벤트</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
            <div className='titlebox' onClick={() => navigate('/app/inquiry')}>
              <p className='title'>문의사항</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
          </>
        )
       case '약관':
        return (
          <>
            <div className='titlebox' onClick={() => navigate('/app/serviceterm')}>
              <p className='title'>서비스 이용약관</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
            <div className='titlebox' onClick={() => navigate('/app/privacyterm')}>
              <p className='title'>개인정보 처리방침</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
            <div className='titlebox' onClick={() => navigate('/app/gpsterm')}>
              <p className='title'>위치기반서비스 약관</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
          </>
        )
      default:
        return '데이터가 없습니다.'
    }
  }
  // chapter별 클래스명 생성
  const getChapterClassName = () => {
    const baseClass = 'my-chapter';
    const chapterClass = chapter === '일반' ? 'chapter-general' :
                        chapter === '약관' ? 'chapter-terms' :
                        chapter === '계정' ? 'chapter-account' : '';
    return `${baseClass} ${chapterClass}`;
  };

  return (
    <div className={getChapterClassName()}>
      <p className='chapter-title'>{chapter}</p>
      <div className='menu-grid'>
        {EachContents()}
      </div>
    </div>
  );
};

export default MyChapter;