import React from 'react';
import homeBlack from '../assets/common/home-black.png';
import graphBlack from '../assets/common/graph-black.png';
import videoBlack from '../assets/common/video-black.png';
import userBlack from '../assets/common/user-black.png';
import connectBlack from '../assets/common/connect-black.png';
import homeGrey from '../assets/common/home-grey.png';
import graphGrey from '../assets/common/graph-grey.png';
import videoGrey from '../assets/common/video-grey.png';
import userGrey from '../assets/common/user-grey.png';
import connectGrey from '../assets/common/connect-grey.png';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  
  // 경기분석 관련 페이지들 체크
  const isAnalysisActive = () => {
    const analysisPages = [
      '/app/player/folder',
      '/app/player/analysis', 
      '/app/player/anal-detail'
    ];
    // /app/anal/ 로 시작하는 모든 페이지도 경기분석으로 간주
    // (데이터 선택, 경기장 선택, 휴식 구역, 쿼터 정보, 분석 진행 등)
    return analysisPages.includes(location.pathname) || location.pathname.startsWith('/app/anal/');
  };
  
  // 경기영상 관련 페이지들 체크
  const isVideoActive = () => {
    const videoPages = [
      '/app/player/video-folder',
      '/app/player/video-list'
    ];
    return videoPages.includes(location.pathname);
  };

  return (
    <FooterStyle>
      <div className='box' onClick={() => navigate('/app/main')}>
        <img
          className='icon'
          src={isActive('/app/main') ? homeBlack : homeGrey}
          alt='홈'
        />
        <p className={`title ${isActive('/app/main') ? 'active' : ''}`}>홈</p>
      </div>
      <div className='box' onClick={() => navigate('/app/player/folder')}>
        <img
          className='icon'
          src={isAnalysisActive() ? graphBlack : graphGrey}
          alt='경기분석'
        />
        <p className={`title ${isAnalysisActive() ? 'active' : ''}`}>경기분석</p>
      </div>
      <div className='box' onClick={() => alert('현재 지원하지 않는 기능입니다.')}>
        <img
          className='icon'
          src={isActive('/app/findstadium') ? connectBlack : connectGrey}
          alt='업로드'
        />
        <p className={`title ${isActive('/app/findstadium') ? 'active' : ''}`}>업로드</p>
      </div>
      <div className='box' onClick={() => navigate('/app/player/video-folder')}>
        <img
          className='icon'
          src={isVideoActive() ? videoBlack : videoGrey}
          alt='경기영상'
        />
        <p className={`title ${isVideoActive() ? 'active' : ''}`}>경기영상</p>
      </div>
      <div className='box' onClick={() => navigate('/app/mypage')}>
        <img
          className='icon'
          src={isActive('/app/mypage') ? userBlack : userGrey}
          alt='마이'
        />
        <p className={`title ${isActive('/app/mypage') ? 'active' : ''}`}>마이</p>
      </div>
    </FooterStyle>
  );
};

export default Footer;


const FooterStyle = styled.div`
  width: 100% !important;
  max-width: 499px !important;
  height: 10vh !important;
  min-height: 80px !important;
  max-height: 90px !important;
  background-color: rgb(255,255,255) !important;
  display: grid !important;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr !important;
  position: fixed !important;
  bottom: 0 !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  margin: 0 !important;
  padding: 0 !important;
  border-top: 1px solid #e5e7eb !important;
  z-index: 99999 !important;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1) !important;
  /* 모바일 환경에서의 안전 영역 고려 */
  padding-bottom: env(safe-area-inset-bottom) !important;
  .box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img{
      display: block;
    }
    .icon{
      height: 2.2vh;
      width: 2.2vh;
    }
    .title{
      font-size: 13px;
      font-weight: 500;
      font-family: var(--font-text);
      margin: 8px 0;
      color: #A2A9B0;
      &.active {
        color: #000; 
        font-weight: bold;
      }
    }
    
  }
`