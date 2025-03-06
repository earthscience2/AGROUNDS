import React, { useState } from 'react';
import styled from 'styled-components';
import Back_btn from '../../components/Back_btn';
import Login_title from '../../components/Login_title';
import plus from '../../assets/btn_plus.png';
import SetQuarter from '../../components/SetQuarter';
import Circle_common_btn from '../../components/Circle_common_btn';

const SetQuarterInfo = () => {
  const [quarter, setQuarter] = useState('');

  return (
    <SetQuarterInfoStyle>
      <Back_btn />
      <Login_title title='쿼터정보 입력' explain={'쿼터별 데이터를 입력해 \n더 자세한 분석을 받아보세요.'} />
      <div className='quarterbox'>
        <SetQuarter quarter='1' data={'11:30 - 11:30 / 출전'} first='true'/>
        <SetQuarter quarter='1' data={'11:30 - 11:30 / 출전'}/>
      </div>
      
      <img src={plus} className='plus' />
      <div className='btn'>
        {quarter ? 
          <Circle_common_btn title='다음' onClick={() => console.log(quarter)}/>
          :
          <Circle_common_btn title='다음' backgroundColor='#F4F4F4' color='#A8A8A8'/>
        }
      </div>

    </SetQuarterInfoStyle>
  );
};

export default SetQuarterInfo;

const SetQuarterInfoStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .plus{
    height: 6vh;
    margin-top: 5vh;
  }
  .quarterbox{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1vh 0;
  }
  .btn{
    width: 100%;
    position: fixed;
    bottom: 5vh;
  }
`