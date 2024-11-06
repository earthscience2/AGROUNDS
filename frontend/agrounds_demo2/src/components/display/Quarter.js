import React from 'react';
import styled from 'styled-components';

const Quarter = ({ summary, activeTab, setActiveTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <QuarterStyle>
      { summary ? <Tab active={activeTab === '요약'} onClick={() => handleTabClick('요약')}>
        요약
      </Tab>
      : null }
      <Tab active={activeTab === '1쿼터'} onClick={() => handleTabClick('1쿼터')}>
        1쿼터
      </Tab>
      <Tab active={activeTab === '2쿼터'} onClick={() => handleTabClick('2쿼터')}>
        2쿼터
      </Tab>
      <Tab active={activeTab === '3쿼터'} onClick={() => handleTabClick('3쿼터')}>
        3쿼터
      </Tab>
    </QuarterStyle>
  );
};

export default Quarter;

const QuarterStyle = styled.div`
  display: flex;
  width: 48vw;
  margin-left: 10%;
`;

const Tab = styled.div`
  width: 12vw;
  height: 4vh;
  border-radius: 1.5vh 1.5vh 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.active ? '#F5F5F5' : '#979797')};
  cursor: pointer;
  font-weight: 600;
  font-size: 1.5vh;

  &:hover {
    background-color: #f5f5f5;
  }
`;
