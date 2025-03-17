import React, { useState } from 'react';
import styled from 'styled-components';
import down from '../assets/down.png';
import Modal from './Modal';
import WheelDateTimePicker from './WheelDateTimePicker';
import Circle_common_btn from './Circle_common_btn';

const TimePicker = ({title, startT, endT}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const ModalOpen = () => {
    setIsOpen(!isOpen);
  }

  const closeModal = () => {
    setIsOpen(false);
  }
  console.log(startTime, endTime);
  return (
    <TimePickerStyle>
      <p className='title'>{title}</p>
      <div className='timerbox'>
        {startTime ? 
          <div className='timer' onClick={ModalOpen}>
            <p className='times'>{startTime}</p>
            <img src={down} className='downicon'/>
          </div> 
          : 
          <div className='timer' onClick={ModalOpen}>
            <p className='time'>시작시간</p>
            <img src={down} className='downicon'/>
          </div> 

          }
        {endTime ? 
          <div className='timer' onClick={ModalOpen}>
            <p className='times'>{endTime}</p>
            <img src={down} className='downicon'/>
          </div> 
          : 
          <div className='timer' onClick={ModalOpen}>
            <p className='time'>종료시간</p>
            <img src={down} className='downicon'/>
          </div> 

          }
      </div>
      {
        isOpen && 
        <Modal isOpen={isOpen} onClose={closeModal} setStartTime={setStartTime} setEndTime={setEndTime}>
          <WheelDateTimePicker setStartTime={setStartTime} setEndTime={setEndTime} onClose={closeModal} />
        </Modal>
      }
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
      .times{
        font-size: 1.8vh;
        color: black;
        font-weight: 500;
      }
      .downicon{
          height: 2vh
      }
    }
  }
`
