import React from 'react';
import img from '../assets/onboard_bg.png';
import './Onboard.scss';
import Circle_common_btn from '../components/Circle_common_btn';

const Onboard = () => {
  return (
    <div className='background'>
      <img src={img} className='img'/>
      <p className='logo'>AGROUNDS</p>
      <p className='ment'>나의 축구 실력을 <br/>기록하고 공유해보세요</p>
      <Circle_common_btn title="시작하기"/>
    </div>
  );
};

export default Onboard;
