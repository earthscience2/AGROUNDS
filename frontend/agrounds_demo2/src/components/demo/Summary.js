import React, {useState} from 'react';
import styled from 'styled-components';
import client from '../../clients';

const Summary = ({activePosition}) => {
  const [AttackData, setAttackData] = useState('');
  const [DefenseData, setDefenseData] = useState('');
  const [TotalData, setTotalData] = useState('');

  const data = {
    match_code: "m_001",
    user_code: "u_001",
  }
  client.post('/api/test_page/ai-summation/', data)
  .then((response) => {
      setAttackData(response.data.attack);
      setDefenseData(response.data.defense);
      setTotalData(response.data.total);
    }
  )
  .catch((error) => alert(error))


  const summaryContents = () => {
    switch (activePosition) {
      case '공격':
        return AttackData
      case '수비':
        return DefenseData
      case '전체':
        return TotalData
      default:
        return TotalData
    }
  }

  return (
    <SummaryStyle1>
      <p>AI 요약</p>
      <span>{summaryContents()}</span>
    </SummaryStyle1>
  );
};

export default Summary;

const SummaryStyle1 = styled.div`
  background-color: #F5F5F5;
  min-height: 25vh;
  @media screen and (max-width: 768px) {
    padding: 2vh 4vh;
  }
  @media (min-width: 769px) and (max-width: 1280px) {
    padding: 2vh 10vh;
  }
  @media screen and (min-width: 1281px){
    padding: 2vh 40vh;
  }
  p {
    margin: 2vh 0;
    font-size: 2.5vh;
    font-weight: 600;
  }
  span {
    font-size: 1.6vh;
    line-height: 1.5;
  }
`