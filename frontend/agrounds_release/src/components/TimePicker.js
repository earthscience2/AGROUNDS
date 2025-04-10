import React, { useState } from 'react';
import styled from 'styled-components';
import down from '../assets/down.png';
import Modal from './Modal';
import WheelDateTimePicker from './WheelDateTimePicker';

const TimePicker = ({ title, startT, endT, setStartT, setEndT }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeField, setActiveField] = useState(null); // 'start' or 'end'

  const openPicker = (field) => {
    setActiveField(field);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setActiveField(null);
  };

  const handleTimeSelect = (time) => {
    if (activeField === 'start') {
      setStartT(time);
    } else if (activeField === 'end') {
      setEndT(time);
    }
    closeModal();
  };

  return (
    <TimePickerStyle>
      <p className='title'>{title}</p>
      <div className='timerbox'>
        <div className='timer' onClick={() => openPicker('start')}>
          <p className={startT ? 'times' : 'time'}>
            {startT || '시작시간'}
          </p>
          <img src={down} className='downicon' />
        </div>
        <div className='timer' onClick={() => openPicker('end')}>
          <p className={endT ? 'times' : 'time'}>
            {endT || '종료시간'}
          </p>
          <img src={down} className='downicon' />
        </div>
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <WheelDateTimePicker
            onClose={closeModal}
            onTimeSelect={handleTimeSelect}
          />
        </Modal>
      )}
    </TimePickerStyle>
  );
};

export default TimePicker;

const TimePickerStyle = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: start;
  font-family: 'regular';

  .title {
    font-size: 2vh;
    font-weight: 700;
  }

  .timerbox {
    display: flex;
    width: 100%;
    gap: 1.5vh;

    .timer {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 50%;
      height: 6vh;
      background-color: #f2f4f8;
      border-radius: 1.5vh;
      cursor: pointer;

      .time {
        font-size: 1.8vh;
        color: #a2a9b0;
        font-weight: 500;
      }

      .times {
        font-size: 1.8vh;
        color: black;
        font-weight: 500;
      }

      .downicon {
        height: 2vh;
      }
    }
  }
`;
