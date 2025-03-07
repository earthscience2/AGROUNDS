import React from 'react';
import styled from 'styled-components';
import down from '../assets/down.png';

const TimePicker = ({title, startT, endT}) => {
  return (
    <TimePickerStyle>
      <p className='title'>{title}</p>
      <div className='timerbox'>
        {startT ? 
          <div className='timer'>
            <p className='time'>{startT}</p>
            <img src={down} className='downicon'/>
          </div> 
          : 
          <div className='timer'>
            <p className='time'>시작시간</p>
            <img src={down} className='downicon'/>
          </div> 

          }
        {endT ? 
          <div className='timer'>
            <p className='time'>{endT}</p>
            <img src={down} className='downicon'/>
          </div> 
          : 
          <div className='timer'>
            <p className='time'>종료시간</p>
            <img src={down} className='downicon'/>
          </div> 

          }
      </div>
    </TimePickerStyle>
  );
};

export default TimePicker;

const TimePickerStyle = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  font-family: 'regular';
  .title{
    font-size: 2vh;
    font-weight: 700;
  }
  .timerbox{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 1.5vh;
    .timer{
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 50%;
      height: 6vh;
      background-color: #F2F4F8;
      border-radius: 1.5vh;
      cursor: pointer;
      .time{
        font-size: 1.8vh;
        color: #A2A9B0;
        font-weight: 500;
      }
      .downicon{
          height: 2vh
      }
    }
  }
`