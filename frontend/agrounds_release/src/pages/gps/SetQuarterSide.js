// SetQuarterSide.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Circle_common_btn from '../../components/Circle_common_btn';
import Login_title from '../../components/Login_title';
import Back_btn from '../../components/Back_btn';
import { useFieldContext } from '../../function/Context';
import { useNavigate } from 'react-router-dom';
import SetQuarter from '../../components/SetQuarter';

const SetQuarterSide = () => {
  const { fieldData } = useFieldContext();
  const navigate = useNavigate();
  const [quarters, setQuarters] = useState([]);

  useEffect(() => {
    const initial = fieldData.quarter_info.map((q, idx) => {
      const isValid = q.match_start_time && q.match_end_time && q.status;
      return {
        id: idx + 1,
        data: isValid ? `${q.match_start_time} - ${q.match_end_time} / ${q.status}` : '데이터 없음',
        home: q.home,
      };
    });
    setQuarters(initial.length > 0 ? initial : [{ id: 1, data: '데이터 없음', home: '' }]);
  }, [fieldData]);

  const handleEdit = (quarter) => {
    navigate('/app/campside', { state: { quarter } });
    console.log(quarter)
  };



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
        <Circle_common_btn title='다음' onClick={() => navigate('/app/next-page')} />
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
    position: fixed;
    bottom: 10vh;
  }
`
