import React from 'react';
import styled from 'styled-components';

const Quarter = ({ summary, activeTab, setActiveTab, quarterCount }) => {
  const handleTabClick = (tabIndex) => {
    setActiveTab(`${tabIndex + 1}쿼터`);
  };

  const generateDisplayTabs = (count) => {
    if (count === 2) {
      return ['전반전', '후반전'];
    }
    return Array.from({ length: count }, (_, index) => `${index + 1}쿼터`);
  };

  const displayTabs = generateDisplayTabs(quarterCount);
  const tabs = Array.from({ length: quarterCount }, (_, index) => `${index + 1}쿼터`);

  return (
    <QuarterStyle>
      {summary ? (
        <Tab active={activeTab === '요약'} onClick={() => setActiveTab('요약')}>
          요약
        </Tab>
      ) : null}
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          active={activeTab === tab}
          onClick={() => handleTabClick(index)}
        >
          {displayTabs[index]}
        </Tab>
      ))}
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
