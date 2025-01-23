import React from 'react';
import homeBlack from '../assets/home-black.png';
import graphBlack from '../assets/graph-black.png';
import videoBlack from '../assets/video-black.png';
import userBlack from '../assets/user-black.png';
import connectBlack from '../assets/connect-black.png';
import homeGrey from '../assets/home-grey.png';
import graphGrey from '../assets/graph-grey.png';
import videoGrey from '../assets/video-grey.png';
import userGrey from '../assets/user-grey.png';
import connectGrey from '../assets/connect-grey.png';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
      <div className='box' onClick={() => navigate('/app/analysis')}>
        <img
          className='icon'
          src={isActive('/app/analysis') ? graphBlack : graphGrey}
          alt='경기분석'
        />
        <p className={`title ${isActive('/app/analysis') ? 'active' : ''}`}>경기분석</p>
      </div>
      <div className='box' onClick={() => navigate('/app/errorpage')}>
        <img
          className='icon'
          src={isActive('/app/errorpage') ? connectBlack : connectGrey}
          alt='업로드'
        />
        <p className={`title ${isActive('/app/errorpage') ? 'active' : ''}`}>업로드</p>
      </div>
      <div className='box' onClick={() => navigate('/app/video')}>
        <img
          className='icon'
          src={isActive('/app/video') ? videoBlack : videoGrey}
          alt='경기영상'
        />
        <p className={`title ${isActive('/app/info') ? 'active' : ''}`}>경기영상</p>
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
  width: 100%;
  max-width: 499px;
  height: 10vh;
  background-color: rgb(255,255,255);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  position: fixed;
  bottom: 0;
  margin: 0;
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
      font-family: 'Pretendard-Regular';
      margin: 8px 0;
      color: #A2A9B0;
      &.active {
        color: #000; 
        font-weight: bold;
      }
    }
    
  }
`