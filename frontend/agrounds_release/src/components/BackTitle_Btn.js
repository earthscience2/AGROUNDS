import React from 'react';
import left from '../assets/left.png';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const BackTitle_Btn = ({navTitle}) => {
  const navigate = useNavigate();
  return (
    <BackTitleNav>
      <img src={left} onClick={() => navigate(-1)}/>
      <div>{navTitle}</div>
    </BackTitleNav>
  );
};

export default BackTitle_Btn;

const BackTitleNav = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  padding: 5vh 0;
  width: 90%;
  & > img{
    width: 3vh;
  }
  & > div {
    font-size: 2vh;
    font-weight: 600;
    margin: auto;
    position: relative;
    left: -1vh;
  }
`