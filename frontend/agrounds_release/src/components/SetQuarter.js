import React from 'react';
import styled from 'styled-components';
import edit from '../assets/ico_edit.png';
import trash from '../assets/ico_trash.png';

const SetQuarter = ({quarter, data, first=false}) => {
  return (
    <SetQuarterStyle>
      <div className='infobox'>
        <p className='quarter'>{quarter}쿼터</p>
        {data ? <p className='data'>{data}</p>: <p className='data'>데이터 없음</p>}
      </div>
      {first ? (
        <div className='button'>
          <img src={edit} className='edit'/>
        </div>
      ): 
      <div className='button'>
        <img src={edit} className='edit'/>
        <img src={trash} className='trash'/>
      </div>
      }
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
  .infobox{
    padding: 0 3vh;
    font-family: 'regular';
    .quarter{
      font-size: 2.2vh;
      font-weight: 700;
      color: #262626;
      margin: 1vh 0 0 0;
    }
    .data{
      font-size: 1.6vh;
      font-weight: 500;
      margin: 1vh 0;
      color: #8D8D8D;
    }
  }
  .edit{
      width: 4.5vh;
    }
  .button{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2vh;
    .edit{
      width: 4.5vh;
      margin: 0 .5vh;
    }
    .trash{
      width: 4.5vh;
      margin: 0 .5vh;
    }
  }
`