import React, { useState } from 'react';
import styled from 'styled-components';
import Back_btn from '../../components/Back_btn';
import Login_title from '../../components/Login_title';
import plus from '../../assets/btn_plus.png';
import SetQuarter from '../../components/SetQuarter';
import Circle_common_btn from '../../components/Circle_common_btn';

const SetQuarterInfo = () => {
  const [quarters, setQuarters] = useState([{ id: 1, data: '데이터 없음' }]);

  const handleAddQuarter = () => {
    const maxId = quarters.length > 0 ? Math.max(...quarters.map((q) => q.id)) : 0;
    const newQuarter = {
      id: maxId + 1,
      data: '11:30 - 11:30 / 출전'
    };
    setQuarters([...quarters, newQuarter]);
  };

  const handleDeleteQuarter = (id) => {
    const updatedQuarters = quarters.filter((quarter) => quarter.id !== id);
    setQuarters(updatedQuarters);
  };

  return (
    <SetQuarterInfoStyle>
      <Back_btn />
      <Login_title title='쿼터정보 입력' explain={'쿼터별 데이터를 입력해 \n더 자세한 분석을 받아보세요.'} />
      <div className='quarterbox'>
        {quarters.map((quarter, index) => (
          <SetQuarter key={quarter.id} quarter={quarter.id} data={quarter.data} first={index === 0} onDelete={() => handleDeleteQuarter(quarter.id)}/>
        ))}
        <img src={plus} className='plus' onClick={handleAddQuarter}/>
      </div>

      <div className='btn'>
        {quarters ? 
          <Circle_common_btn title='다음' onClick={() => console.log(quarters)}/>
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
    padding-bottom: 20vh;
  }
  .btn{
    width: 100%;
    position: fixed;
    bottom: 5vh;
  }
`