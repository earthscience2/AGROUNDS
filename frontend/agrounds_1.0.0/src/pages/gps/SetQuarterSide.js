import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Circle_common_btn from '../../components/Circle_common_btn';
import Login_title from '../../components/Login_title';
import Back_btn from '../../components/Back_btn';
import { useFieldContext } from '../../function/Context';
import { useNavigate } from 'react-router-dom';
import SetQuarter from '../../components/SetQuarter';
import { AddMatchInfo } from '../../function/api/gps/gpsApi';

const SetQuarterSide = () => {
  const { fieldData, updateFieldData } = useFieldContext();
  const navigate = useNavigate();
  const [quarters, setQuarters] = useState([]);
  
  console.log(fieldData)
  const formatTime = (value) => {
    if (!value || typeof value !== 'string') return "??:??";
  
    const timePart = value.split(' ')[1]; 
    if (!timePart) return "??:??";
  
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}`;
  };

  useEffect(() => {
    const initial = fieldData.quarter_info.map((q, idx) => {
      const isValid = q.match_start_time && q.match_end_time && q.status;
      return {
        id: idx + 1,
        data: isValid ? `${formatTime(q.match_start_time)} - ${formatTime(q.match_end_time)} / ${q.status}` : '데이터 없음',
        home: q.home,
      };
    });
    setQuarters(initial.length > 0 ? initial : [{ id: 1, data: '데이터 없음', home: '' }]);
    
  }, [fieldData]);

  const handleEdit = (quarter) => {
    navigate('/app/campside', { state: { quarter} });
  };

  const handleEnd = () => {
    console.log(fieldData)
    AddMatchInfo(fieldData)
    .then((response) => {
      console.log('success!')
    })
    .catch((error) => {
      console.log(error)
    })
  }


  return (
    <SetQuarterSideStyle>
      <Back_btn />
      <Login_title
        title='쿼터정보 입력'
        explain={'쿼터별 홈 지역을 선택하세요.'}
      />
      <div className='quarterbox'>
        {quarters.map((q, index) => (
          <SetQuarter
            key={q.id}
            quarter={q.id}
            data={q.data}
            first={index === 0}
            edit={false}
            onClick={() => handleEdit(q.id)}
            home={q.home}
          />
        ))}
      </div>
      <div className='btn'>
        <Circle_common_btn title='다음' onClick={handleEnd} />
      </div>
    </SetQuarterSideStyle>
  );
};

export default SetQuarterSide;

const SetQuarterSideStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .quarterbox {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1vh 0;
    padding-bottom: 20vh;
  }
  .btn {
    width: 100%;
    max-width: 500px;
    position: fixed;
    bottom: 10vh;
  }
`
