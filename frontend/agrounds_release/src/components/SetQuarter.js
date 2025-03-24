import React from 'react';
import styled from 'styled-components';
import editicon from '../assets/ico_edit.png';
import trash from '../assets/ico_trash.png';
import left from '../assets/ico_ground-left.png';
import right from '../assets/ico_ground-right.png';
import rightbtn from '../assets/right.png';
import { useFieldContext } from '../function/Context';
import { useLocation, useNavigate } from 'react-router-dom';

const SetQuarter = ({ quarter, data, first = false, onDelete, edit, onClick, home }) => {
  const { fieldData } = useFieldContext();

  const navigate = useNavigate();
  const location = useLocation();
  const quarter1 = location.state?.quarter;
  console.log(quarter1);

  return (
    <SetQuarterStyle>
      <div className='infobox'>
        <p className='quarter'>{quarter}쿼터</p>
        {data ? <p className='data'>{data}</p> : <p className='data'>데이터 없음</p>}
      </div>
      {edit ? (
        <div className='button'>
          <img src={editicon} className='edit' onClick={edit} />
          {!first && <img src={trash} className='trash' onClick={onDelete} />}
        </div>
      )
        :
        (
        <div className='button' onClick={() => navigate('/app/campside', {state: {quarter: quarter1}})}>
          {fieldData.quarter_info.home === 'left'
            ? <img src={left} className='left'/>
            : <img src={right} className='left'/>
          }
          <img src={rightbtn} className='rightbtn'/>
        </div>
      )}
      
    </SetQuarterStyle>
  );
};

export default SetQuarter;

const SetQuarterStyle = styled.div`
  width: 90%;
  height: 10vh;
  border: 1px solid #E0E0E0;
  border-radius: 1.5vh;
  box-shadow: 0px 1px 22px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .infobox {
    padding: 0 3vh;
    font-family: 'regular';

    .quarter {
      font-size: 2.2vh;
      font-weight: 700;
      color: #262626;
      margin: 1vh 0 0 0;
    }

    .data {
      font-size: 1.6vh;
      font-weight: 500;
      margin: 1vh 0;
      color: #8D8D8D;
    }
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2vh;

    .edit, .trash {
      width: 4.5vh;
      margin: 0 0.5vh;
      cursor: pointer;
    }
    .left{
      width: 5.5vh;
      margin: 0 0.5vh;
      cursor: pointer;
    }
    .rightbtn{
      width: 2.5vh;
      margin: 0 0.5vh;
      cursor: pointer;
    }
  }
`;
