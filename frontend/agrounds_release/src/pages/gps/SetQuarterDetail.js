import React, { useState } from 'react';
import BackTitle_Btn from '../../components/BackTitle_Btn';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TimePicker from '../../components/TimePicker';
import check from '../../assets/check.png';
import Circle_common_btn from '../../components/Circle_common_btn';
import { useFieldContext } from '../../function/Context';
import { createDateTimeFromLocalStorage } from '../../function/ Conversion';
const SetQuarterDetail = () => {
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  const [playingSTime, setPlayingSTime] = useState('');
  const [playingETime, setPlayingETime] = useState('');
  const [attendanceSTime, setAttendanceSTime] = useState('');
  const [attendanceETime, setAttendanceETime] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  const handleAttendanceToggle = (status) => {
    setAttendanceStatus(status);
  };
  
  const {fieldData, updateFieldData} = useFieldContext();

  const handleNextBtn = () => {
    const quarterIndex = state.quarter - 1;
    const updatedQuarterInfo = [...fieldData.quarter_info];
  
    updatedQuarterInfo[quarterIndex] = {
      ...updatedQuarterInfo[quarterIndex],
      quarter_name: `${state?.quarter}쿼터`,
      match_start_time: createDateTimeFromLocalStorage(playingSTime),
      match_end_time: createDateTimeFromLocalStorage(playingETime),
      start_time: createDateTimeFromLocalStorage(attendanceSTime),
      end_time: createDateTimeFromLocalStorage(attendanceETime),
      status: attendanceStatus,
    };
  
    updateFieldData({
      quarter_info: updatedQuarterInfo,
    });
  
    navigate('/app/set-quarter-info');
  };
  console.log(playingETime)
  return (
    <SetQuarterDetailStyle>
      <BackTitle_Btn navTitle={`${state?.quarter}쿼터`} />

      <TimePicker
        title='경기시간'
        startT={playingSTime}
        endT={playingETime}
        setStartT={setPlayingSTime}
        setEndT={setPlayingETime}
      />

      <div style={{ marginTop: '4vh' }} />

      <TimePicker
        title='참여시간'
        startT={attendanceSTime}
        endT={attendanceETime}
        setStartT={setAttendanceSTime}
        setEndT={setAttendanceETime}
      />

      <div style={{ marginTop: '4vh' }} />

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
        {playingSTime && playingETime && attendanceSTime && attendanceETime && attendanceStatus? (
          <Circle_common_btn title='다음' onClick={handleNextBtn} />
        ) : (
          <Circle_common_btn title='다음' backgroundColor='#F4F4F4' color='#A8A8A8' />
        )}
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
  .btn {
    width: 100%;
    max-width: 500px;
    position: fixed;
    bottom: 5vh;
  }
`;

const Attend = styled.div`
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
      justify-content: space-between;
      align-items: center;
      width: 50%;
      height: 7.5vh;
      background-color: #f2f4f8;
      border-radius: 1.5vh;
      cursor: pointer;

      .time {
        font-size: 1.9vh;
        font-weight: 600;
        padding: 0 3vh;
      }

      .checkbtn {
        height: 3vh;
        width: 3vh;
        border-radius: 50%;
        background-color: #e5e9ed;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 3vh;

        &.selected {
          background-color: #0eac6a;
        }

        .check {
          height: 1.5vh;
        }
      }
    }
  }
`;
