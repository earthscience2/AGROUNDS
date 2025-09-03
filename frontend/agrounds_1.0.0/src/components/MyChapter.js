import React from 'react';
import rightarrow from '../assets/common/left.png';
import './MyChapter.scss';
import { useNavigate } from 'react-router-dom';

const MyChapter = ({chapter}) => {
  const navigate = useNavigate();

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
            <div className='titlebox' onClick={() => navigate('/app/reason')} style={{marginBottom: '15vh'}}>
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
            <div className='titlebox' onClick={() => navigate('/app/eventlist')}>
              <p className='title'>이벤트</p>
              <img className='arrow' src={rightarrow}></img>
            </div>
            <div className='titlebox' onClick={() => navigate('')}>
              <p className='title'>문의 사항</p>
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
  return (
    <div className='my-chapter'>
      <p className='chapter-title'>{chapter}</p>
      {EachContents()}
    </div>
  );
};

export default MyChapter;