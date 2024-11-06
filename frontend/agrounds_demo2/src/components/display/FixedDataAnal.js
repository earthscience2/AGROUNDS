import React from 'react';
import styled from 'styled-components';
import Data from '../../data_player.json';

const DataAnal = ({ quarter, position }) => {
  const Quarter1 = Data['1쿼터'];
  const Quarter2 = Data['2쿼터'];
  const Quarter3 = Data['3쿼터'];

  const SelectQuarter = () => {
    switch (`${quarter}-${position}`) {
      case '1쿼터-전체':
        return Quarter1.total;
      case '1쿼터-공격':
        return Quarter1.attack;
      case '1쿼터-수비':
        return Quarter1.defense;
      case '2쿼터-전체':
        return Quarter2.total;
      case '2쿼터-공격':
        return Quarter2.attack;
      case '2쿼터-수비':
        return Quarter2.defense;
      case '3쿼터-전체':
        return Quarter3.total;
      case '3쿼터-공격':
        return Quarter3.attack;
      case '3쿼터-수비':
        return Quarter3.defense;
      default:
        return null; 
    }
  };

  const selectedData = SelectQuarter();

  return (
    <DataAnalStyle>
      <p>수치 분석</p>
      <DataStyle>
        {selectedData ? (
          Object.entries(selectedData).map(([key, value], index) => (
            <DataRow key={index}>
              <strong>{key} </strong>
              <strong>{value}</strong>
            </DataRow>
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
