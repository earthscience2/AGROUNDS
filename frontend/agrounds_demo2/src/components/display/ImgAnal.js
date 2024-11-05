import React, {useEffect} from 'react';
import styled from 'styled-components';

const ImgAnal = ({ activePosition, imgAnal, setImgAnal}) => {
  const availableTabs = activePosition === '전체' 
    ? ['히트맵', '고속히트맵', '방향전환', '속력변화', '가속도변화']
    : ['히트맵', '고속히트맵', '방향전환'];

  useEffect(() => {
    if (!availableTabs.includes(imgAnal)) {
      setImgAnal('히트맵');
    }
  }, [activePosition, imgAnal, setImgAnal, availableTabs]);

  const handleTabClick = (tab) => {
    setImgAnal(tab);
  };
  return (
    <ImgAnalStyle>
      <p>이미지 분석</p>
      {availableTabs.map((tab) => (
        <Tab 
          key={tab} 
          active={imgAnal === tab} 
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </Tab>
      ))}
    </ImgAnalStyle>
  );
};

export default ImgAnal;

const ImgAnalStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.7vh;
  font-weight: 600;
  padding: 1vh 5vh;
`

const Tab = styled.div`
  border: 1px solid #979797;
  width: 100%;
  padding: 1.2vh 2vh;
  margin: .2vh 0;
  border-radius: 1vh ;
  background-color: ${(props) => (props.active ? '#D9D9D9' : 'white')};
`