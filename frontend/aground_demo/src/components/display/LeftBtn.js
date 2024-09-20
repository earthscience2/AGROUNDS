import React from 'react';
import styled from 'styled-components';
import arrow from "../../assets/WhiteArrow.png";

const LeftBtn = ({bgColor, children, onClick}) => {
  return (
    <LeftBtnStyle bgColor={bgColor} onClick={onClick}>
      <img src={arrow} className='arrow'/>
      <span>{children}</span>
    </LeftBtnStyle>
  );
};

export default LeftBtn;

const LeftBtnStyle = styled.div`
  @media screen and (max-width: 820px){
    background-color: ${(props) => props.bgColor || 'black'};
    border-radius: 2.5vh;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.3vh;
    width: 8.3vh;
    height: 3vh;
    .arrow{
      height: .7vh;
      position: relative;
      right: .5vh;
      transform: rotate(180deg);
    }
  }
  @media screen and (min-width: 821px){
    background-color: ${(props) => props.bgColor || 'black'};
    border-radius: 2.5vh;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.6vh;
    width: 11vh;
    height: 4vh;
    .arrow{
      height: .7vh;
      position: relative;
      right: .5vh;
      transform: rotate(180deg);
    }
  }
`