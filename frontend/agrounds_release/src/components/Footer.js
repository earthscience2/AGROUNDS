import React from 'react';
import homeblack from '../assets/home-black.png';
import graphBlack from '../assets/graph-black.png';
import soccerBlack from '../assets/soccer-black.png';
import userBlack from '../assets/user-black.png';
import connectBlack from '../assets/connect-black.png';
import homeGrey from '../assets/home-grey.png';
import graphGrey from '../assets/graph-grey.png';
import soccerGrey from '../assets/soccer-grey.png';
import userGrey from '../assets/user-grey.png';
import connectGrey from '../assets/connect-grey.png';
import './Footer.scss';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='box'>
        <img className='icon' src={homeGrey} />
        <p className='title'>홈</p>
      </div>
      <div className='box'>
        <img className='icon' src={graphGrey} />
        <p className='title'>경기분석</p>
      </div>
      <div className='box'>
        <img className='icon' src={connectGrey} />
        <p className='title'>기기연결</p>
      </div>
      <div className='box'>
        <img className='icon' src={soccerGrey} />
        <p className='title'>축구정보</p>
      </div>
      <div className='box'>
        <img className='icon' src={userGrey} />
        <p className='title'>마이</p>
      </div>
    </div>
  );
};

export default Footer;