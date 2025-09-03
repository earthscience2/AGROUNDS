import React from 'react';
import styled from 'styled-components';

const JoinTeam = ({logo, teamname, place, membernum, madedate}) => {
  return (
    <JoinTeamStyle>
      <img src={logo} />
      <div>
        <div>{teamname}</div>
        <div>
          <div>{place}</div>
          <div>{membernum}</div>
          <div>{madedate}</div>
        </div>
        <button>가입신청</button>
      </div>
    </JoinTeamStyle>
  );
};

export default JoinTeam;

const JoinTeamStyle = styled.div`
  img{
    width: 6vh;
  }
`