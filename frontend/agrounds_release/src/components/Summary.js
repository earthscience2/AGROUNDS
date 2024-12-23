import React from 'react';
import Anal_Position_Nav from './Anal_Position_Nav';
import './Summary.scss';
import star from '../assets/Star.png';
const Summary = ({data, currentIndex, setCurrentIndex}) => {
  
  return (
    <div className='summary'>
      <Anal_Position_Nav currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
      <div className='contents'>
        <div className='startitle'>
        <img src={star} /><p>AI 요약</p>
        </div>
        <span>{data}</span>
      </div>
    </div>
  );
};

export default Summary;