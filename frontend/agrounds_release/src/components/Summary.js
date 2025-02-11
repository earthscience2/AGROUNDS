import React from 'react';
import Anal_Position_Nav from './Anal_Position_Nav';
import star from '../assets/Star.png';
import styled from 'styled-components';
const Summary = ({data, currentIndex, setCurrentIndex, type}) => {
  
  return (
    <SummaryStyle>
      <Anal_Position_Nav currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} type={type}/>
      <div className='contents'>
        <div className='startitle'>
        <img src={star} /><p>AI 요약</p>
        </div>
        <span>{data}</span>
      </div>
    </SummaryStyle>
  );
};

export default Summary;

const SummaryStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  .contents{
    .startitle{
      display: flex;
      flex-direction: row;
      margin-top: 2vh;
      & > img{
        width: 3vh;
        height: 3vh;
        margin: auto 0;
      }
      & > p{
        font-size: 2.5vh;
        font-weight: 700;
        margin-left: 1vh;
        font-family: 'Pretendard';
      }
    }
    width: 88%;
    
    & > span{
      font-size: 2vh;
      font-weight: 400;
      font-family: 'Pretendard';
      color: #393939;
      line-height: 1.5;
    }
  }

`