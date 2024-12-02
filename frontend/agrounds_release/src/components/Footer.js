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
import './Footer.scss';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className='footer'>
      <div className='box' onClick={() => navigate('/main')}>
        <img
          className='icon'
          src={isActive('/main') ? homeBlack : homeGrey}
          alt='홈'
        />
        <p className={`title ${isActive('/main') ? 'active' : ''}`}>홈</p>
      </div>
      <div className='box' onClick={() => navigate('/analysis')}>
        <img
          className='icon'
          src={isActive('/analysis') ? graphBlack : graphGrey}
          alt='경기분석'
        />
        <p className={`title ${isActive('/analysis') ? 'active' : ''}`}>경기분석</p>
      </div>
      <div className='box' onClick={() => navigate('/connect')}>
        <img
          className='icon'
          src={isActive('/connect') ? connectBlack : connectGrey}
          alt='기기연결'
        />
        <p className={`title ${isActive('/connect') ? 'active' : ''}`}>업로드</p>
      </div>
      <div className='box' onClick={() => navigate('/video')}>
        <img
          className='icon'
          src={isActive('/video') ? videoBlack : videoGrey}
          alt='경기영상'
        />
        <p className={`title ${isActive('/info') ? 'active' : ''}`}>경기영상</p>
      </div>
      <div className='box' onClick={() => navigate('/my')}>
        <img
          className='icon'
          src={isActive('/my') ? userBlack : userGrey}
          alt='마이'
        />
        <p className={`title ${isActive('/my') ? 'active' : ''}`}>마이</p>
      </div>
    </div>
  );
};

export default Footer;
