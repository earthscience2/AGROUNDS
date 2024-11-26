import React from 'react';
import styled from 'styled-components';

const SpecificGravity = ({ attack, defence }) => {
  return (
    <BarContainer>
      <Labels>
        <span className="attack-label">공격</span>
        <span className="defense-label">수비</span>
      </Labels>
      <Bar>
        <Attack style={{ width: `${attack}%` }}>
          <p>{attack}%</p>
        </Attack>
        <Separator />
        <Defense style={{ width: `${defence}%` }}>
          <p>{defence}%</p>
        </Defense>
      </Bar>
    </BarContainer>
  );
};

export default SpecificGravity;
const BarContainer = styled.div`
  width: 100%;
  margin: 20px auto;
  text-align: center;
`;

const Bar = styled.div`
  display: flex;
  width: 100%;
  height: 4.5vh;
  border-radius: 1vh;
  overflow: hidden;
  background-color: #e6e6e6;
`;

const Separator = styled.div`
  width: 2px;
  background-color: #e6e6e6;
  height: 100%;
`;

const Attack = styled.div`
  background-color: #F54444;
  color: white;
  text-align: start;
  display: flex;
  & > p {
    font-size: 12px;
    font-weight: 600;
    margin: auto 0 auto 2vh;
  }
`;

const Defense = styled.div`
  background-color: #7099FF;
  color: white;
  display: flex;
  justify-content: end;
  & > p {
    font-size: 12px;
    font-weight: 600;
    margin: auto 2vh auto 0;
  }
`;

const Labels = styled.div`
  display: flex;
  justify-content: space-between; 

  .attack-label {
    color: #F54444;
    font-weight: bold;
    font-size: 1.4vh;
    margin-bottom: 1vh;
  }

  .defense-label {
    color: #3068F4;
    font-weight: bold;
    font-size: 1.4vh;
    margin-bottom: 1vh;
  }
`;
