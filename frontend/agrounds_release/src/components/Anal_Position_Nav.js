import React, { useState } from 'react';
import right from '../assets/right.png';
import './Anal_Position_Nav.scss';

const Anal_Position_Nav = () => {
  const titles = ["전체", "공격", "수비"];
  const [currentIndex, setCurrentIndex] = useState(0);

  const LeftSide = () => {
    setCurrentIndex((prevI) => (prevI - 1 + titles.length) % titles.length);
  }

  const RightSide = () => {
    setCurrentIndex((prevI) => (prevI + 1 ) % titles.length);
  }
  return (
    <div className='analnav'>
      <img className='leftside' src={right} onClick={LeftSide}/>
      <p className='analtitle'>{titles[currentIndex]}</p>
      <img className='rightside' src={right} onClick={RightSide}/>
    </div>
  );
};

export default Anal_Position_Nav;