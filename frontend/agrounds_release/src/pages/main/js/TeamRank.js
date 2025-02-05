import React from 'react';
import Back_btn from '../../../components/Back_btn';
import styled from 'styled-components';
import TeamAnalScore from '../../../components/TeamAnalScore';

const TeamRank = () => {
  return (
    <TeamRankStyle>
      <Back_btn />
      <TeamAnalScore />
    </TeamRankStyle>
  );
};

export default TeamRank;

const TeamRankStyle = styled.div`

`