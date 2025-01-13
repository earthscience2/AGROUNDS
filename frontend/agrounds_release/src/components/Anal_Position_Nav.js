import React, { useEffect, useState } from 'react';
import right from '../assets/right.png';
import styled from 'styled-components';

const Anal_Position_Nav = ({currentIndex, setCurrentIndex, type}) => {
  const [title, setTitle] = useState([]);
  useEffect(() => {
    if(type === 'personal') {
      setTitle(["전체", "공격", "수비"]);
    } else if(type === 'team') {
      setTitle(["종합", "평점"]);
    }
  })
  

  const LeftSide = () => {
    setCurrentIndex((prevI) => (prevI - 1 + title.length) % title.length);
  }

  const RightSide = () => {
    setCurrentIndex((prevI) => (prevI + 1 ) % title.length);
  }
  return (
    <AnalPostionNavStyle>
      <img className='leftside' src={right} onClick={LeftSide}/>
      <p className='analtitle'>{title[currentIndex]}</p>
      <img className='rightside' src={right} onClick={RightSide}/>
    </AnalPostionNavStyle>
  );
};

export default Anal_Position_Nav;


const AnalPostionNavStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  border-radius: 1vh;
  border: 1px solid #E0E0E0;
  
  .leftside{
    transform: rotate(180deg);
    height: 2.5vh;
    margin-left: 2vh;
    cursor: pointer;
  }
  .analtitle{
    font-size: 1.8vh;
    font-weight: 700;
    font-family: 'Pretendard-Regular';
  }
  .rightside{
    height: 2.5vh;
    margin-right: 2vh;
    cursor: pointer;
  }

`