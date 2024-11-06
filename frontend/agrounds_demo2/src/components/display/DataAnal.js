import React, { useState } from 'react';
import styled from 'styled-components';
import client from '../../clients';

const DataAnal = ({ quarter, position }) => {

  const [attack, setAttack] = useState([]);
  const [defense, setDefense] = useState([]);
  const [total, setTotal] = useState([]);

  const SelectQuarter = () => {
    switch (position) {
      case '전체':
        return total;
      case '공격':
        return attack;
      case '수비':
        return defense;
      default:
        return null; 
    }
  };
  
  const data = {
    match_code: sessionStorage.getItem('match_code') || 'm_001',
    user_code: sessionStorage.getItem('user_id') || 'u_001',
    quarter: quarter
  }
    useState(() => {
      client.post('/api/test_page/analyze-data/', data)
      .then((response) => 
        {
          setAttack(response.data.attack);
          setDefense(response.data.defense);
          setTotal(response.data.total);
        }
      )
      .catch((error) => alert(error));
  
    }, [data])
    
  const selectedData = SelectQuarter();


  const TitleMapping = {
    AA: "평균 가속도(m/s²)",
    AS: "평균 속력(km/h)",
    ASA: "평균 스프린트 가속도(m/s²)",
    ASD: "평균 스프린트 거리(m)",
    ASS: "평균 스프린트 속력(km/h)",
    D: "이동거리(km)",
    DPM: "분당 이동거리(m)",
    HA: "최고 가속도(m/s²)",
    HDT: "135~180도 방향전환 횟수(번)",
    HS: "최고 속력(km/h)",
    HSD: "최고 스프린트 거리(m)",
    LDT: "90~135도 방향전환 횟수(번)",
    LSD: "최저 스프린트 거리(m)",
    MR: "활동 범위(%)",
    S: "스프린트 횟수(번)",
    SDPD: "총 이동거리 당 스프린트 거리(%)",
    T: "경기시간(분)",
    TSD: "전체 스프린트 거리(m)",
};

  return (
    <DataAnalStyle>
      <p>수치 분석</p>
      <DataStyle>
        {selectedData ? (
          Object.entries(selectedData).map(([key, value], index) => (
            TitleMapping[key] ? 
            <DataRow key={index}>
              <strong>{TitleMapping[key]} </strong>
              <strong>{value}</strong>
            </DataRow>
            : null
          ))
        ) : (
          <p>해당 데이터가 없습니다.</p>
        )}
      </DataStyle>
    </DataAnalStyle>
  );
};

export default DataAnal;

const DataAnalStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4vh 2vh;
  & > p {
    font-size: 1.8vh;
    font-weight: 800;
  }
`;

const DataStyle = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 1vh;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1vh 2vh;
  font-size: 1.8vh;
`;
