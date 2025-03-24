import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Back_btn from '../../components/Back_btn';
import Login_title from '../../components/Login_title';
import plus from '../../assets/btn_plus.png';
import SetQuarter from '../../components/SetQuarter';
import Circle_common_btn from '../../components/Circle_common_btn';
import { useNavigate } from 'react-router-dom';
import { useFieldContext } from '../../function/Context';

const SetQuarterInfo = () => {
  const { fieldData, updateFieldData } = useFieldContext();
  const navigate = useNavigate();
  const [quarters, setQuarters] = useState([]);

  useEffect(() => {
    const initial = fieldData.quarter_info.map((q, idx) => {
      const isValid = q.match_start_time && q.match_end_time && q.status;
      return {
        id: idx + 1,
        data: isValid
          ? `${q.match_start_time} - ${q.match_end_time} / ${q.status}`
          : '데이터 없음',
      };
    });

    setQuarters(initial.length > 0 ? initial : [{ id: 1, data: '데이터 없음' }]);
  }, [fieldData]);

  const handleAddQuarter = () => {
    const newId = quarters.length > 0 ? Math.max(...quarters.map((q) => q.id)) + 1 : 1;

    setQuarters([...quarters, { id: newId, data: '데이터 없음' }]);

    const updatedQuarterInfo = [
      ...fieldData.quarter_info,
      {
        quarter_name: `${newId}쿼터`,
        match_start_time: '',
        match_end_time: '',
        start_time: '',
        end_time: '',
        status: '',
        home: '',
      },
    ];
    updateFieldData({ quarter_info: updatedQuarterInfo });
  };

  const handleDeleteQuarter = (id) => {
    const updatedQuarters = quarters.filter((q) => q.id !== id);
    setQuarters(updatedQuarters);

    const updatedQuarterInfo = fieldData.quarter_info.filter((_, idx) => idx !== id - 1);
    updateFieldData({ quarter_info: updatedQuarterInfo });
  };

  const handleEdit = (quarter) => {
    const quarterData = fieldData.quarter_info[quarter - 1];
    navigate('/app/set-quarter-detail', {
      state: {
        quarter,
        data: quarterData,
      },
    });
  };
  console.log(fieldData)
  return (
    <SetQuarterInfoStyle>
      <Back_btn />
      <Login_title
        title='쿼터정보 입력'
        explain={'쿼터별 데이터를 입력해 \n더 자세한 분석을 받아보세요.'}
      />
      <div className='quarterbox'>
        {quarters.map((q, index) => (
          <SetQuarter
            key={q.id}
            quarter={q.id}
            data={q.data}
            first={index === 0}
            onDelete={() => handleDeleteQuarter(q.id)}
            edit={() => handleEdit(q.id)}
          />
        ))}
        <img src={plus} className='plus' onClick={handleAddQuarter} />
      </div>

      <div className='btn'>
        <Circle_common_btn
          title='다음'
          onClick={() => navigate('/app/set-quarter-side')}
        />
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

  .plus {
    height: 6vh;
    margin-top: 5vh;
  }

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
    bottom: 5vh;
  }
`;
