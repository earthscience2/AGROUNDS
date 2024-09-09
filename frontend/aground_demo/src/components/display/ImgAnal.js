import React from 'react';
import styled from 'styled-components';

const ImgAnal = ({ activePosition, imgAnal, setImgAnal}) => {

  const handleTabClick = (tab) => {
    setImgAnal(tab);
  };

  return (
    <ImgAnalStyle>
      <p>이미지 분석</p>
      <Tab active={imgAnal === '히트맵'} onClick={() => handleTabClick('히트맵')}>히트맵</Tab>
      <Tab active={imgAnal === '고속히트맵'} onClick={() => handleTabClick('고속히트맵')}>고속 히트맵</Tab>
      <Tab active={imgAnal === '방향전환'} onClick={() => handleTabClick('방향전환')}>방향 전환</Tab>
      {activePosition === '공격' || activePosition === '수비' ? '' : <Tab active={imgAnal === '속력변화'} onClick={() => handleTabClick('속력변화')}>속력 변화</Tab> }
      {activePosition === '공격' || activePosition === '수비' ? '' : <Tab active={imgAnal === '가속도변화'} onClick={() => handleTabClick('가속도변화')}>가속도 변화</Tab> }
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