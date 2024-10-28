import React from 'react';
import styled from 'styled-components';

const Position = ({ replay, activePosition, setActivePosition }) => {
  const handleTabClick = (tab) => {
    setActivePosition(tab);
  };

  return (
    <PositionStyle>
      <Tab active={activePosition === '전체'} onClick={() => handleTabClick('전체')}>
        전체
      </Tab>
      <Tab active={activePosition === '공격'} onClick={() => handleTabClick('공격')}>
        공격
      </Tab>
      <Tab active={activePosition === '수비'} onClick={() => handleTabClick('수비')}>
        수비
      </Tab>
    </PositionStyle>
  );
};

export default Position;

const PositionStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  width: 100vw;
  padding: 2vh 0;
`;

const Tab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1vh 2vh;
  margin: 0 0.5vh;
  border-radius: 1vh;
  font-weight: 600;
  font-size: 1.6vh;
  background-color: ${(props) => (props.active ? '#245441' : '#D6E09C')};
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
`;
