import React from 'react';
import styled from 'styled-components';

const RankBox = ({titleData, title, rank , km}) => {
  return (
    <RankBoxStyle>
      <div className='first-box'>
        <div>{titleData} {km}</div>
        <div>{title}</div>
      </div>
      <div className='second-box'>
        <div>#</div>
        <div>{rank}</div>
      </div>
    </RankBoxStyle>
  );
};

export default RankBox;

const RankBoxStyle = styled.div`
  background-color: #F2F4F8;
  width: 20vh;
  height: 20vh;
  border-radius: 2vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .first-box{
    width: 75%;
    height: 40%;
    & :first-child{
      font-size: 2vh;
      font-weight: 800;
      color: #4D5358;
    }
    & :nth-child(2) {
      font-size: 1.8vh;
      margin: .5vh 0;
      font-weight: 500;
      color: #878D96;
    }
  }
  .second-box{
    width: 75%;
    height: 40%;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: end;
    & :first-child{
      font-size: 2.8vh;
      font-weight: 700;
      color: #343A3F;
    }
    & :nth-child(2) {
      font-size: 3.8vh;
      font-weight: 700;
      color: #343A3F;
    }
  }
`