import React, { useState } from 'react';
import BackTitle_Btn from '../../components/BackTitle_Btn';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import TimePicker from '../../components/TimePicker';
import check from '../../assets/check.png';
import Circle_common_btn from '../../components/Circle_common_btn';

const SetQuarterDetail = () => {
  const location = useLocation();
  const state = location.state;

  const [playingSTime, setPlayingSTime] = useState('');
  const [playingETime, setPlayingETime] = useState('');
  const [attendanceSTime, setAttendanceSTime] = useState('');
  const [attendanceETime, setAttendanceETime] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState(null);


  const handleAttendanceToggle = (status) => {
    setAttendanceStatus(status)
  }

  return (
    <SetQuarterDetailStyle>
      <BackTitle_Btn navTitle={`${state?.quarter}쿼터`} />
      <TimePicker title='경기시간' startT={playingSTime} endT={playingETime}/>
      <div style={{marginTop: '4vh'}}/>
      <TimePicker title='참여시간' startT={attendanceSTime} endT={attendanceETime}/>
      <div style={{marginTop: '4vh'}}/>
      <Attend>
        <p className='title'>출전여부</p>
        <div className='timerbox'>
          <div className='timer' onClick={() => handleAttendanceToggle('출전')}>
            <p className='time'>출전</p>
            <div className={`checkbtn ${attendanceStatus === '출전' ? 'selected' : ''}`}>
              <img src={check} className='check' />
            </div>
          </div> 
          <div className='timer' onClick={() => handleAttendanceToggle('미출전')}>
            <p className='time'>미출전</p>
            <div className={`checkbtn ${attendanceStatus === '미출전' ? 'selected' : ''}`}>
              <img src={check} className='check' />
            </div>
          </div> 
        </div>
      </Attend>

      <div className='btn'>
        {playingSTime ? 
          <Circle_common_btn title='다음' onClick={() => console.log(playingSTime)}/>
          :
          <Circle_common_btn title='다음' backgroundColor='#F4F4F4' color='#A8A8A8'/>
        }
      </div>

    </SetQuarterDetailStyle>
  );
};

export default SetQuarterDetail;

const SetQuarterDetailStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .btn{
    width: 100%;
    position: fixed;
    bottom: 5vh;
  }
`

const Attend = styled.div`
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
      justify-content: space-between;
      align-items: center;
      width: 50%;
      height: 7.5vh;
      background-color: #F2F4F8;
      border-radius: 1.5vh;
      cursor: pointer;
      .time{
        font-size: 1.9vh;
        font-weight: 600;
        padding: 0 3vh;
      }
      .checkbtn{
        height: 3vh;
        width: 3vh;
        border-radius: 50%;
        background-color: #E5E9ED;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 3vh;
        &.selected {
          background-color: #0EAC6A; 
        }
        .check{
          height: 1.5vh;
        }
      }
    }
  }
`