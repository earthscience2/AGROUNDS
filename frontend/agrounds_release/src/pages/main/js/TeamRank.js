import React from 'react';
import Back_btn from '../../../components/Back_btn';
import styled from 'styled-components';
import TeamAnalScore from '../../../components/TeamAnalScore';
import {useLocation} from 'react-router-dom';

const TeamRank = () => {
  const location = useLocation();
  const { title, data } = location.state || {}

  return (
    <TeamRankStyle>
      <Back_btn />
      <div className='title'>
        {title} 순위
      </div>
      <TeamAnalScore data={data}/>
    </TeamRankStyle>
  );
};

export default TeamRank;

const TeamRankStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title{
    width: 90%;
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 2.5vh;
  }
`