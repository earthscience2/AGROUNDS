import React, { Children } from 'react';
import styled from 'styled-components';
import arrow from "../../assets/WhiteArrow.png";

const RightBtn = ({bgColor, children, onClick}) => {
  return (
    <RightBtnStyle bgColor={bgColor} onClick={onClick}>
      <span>{children}</span>
      <img src={arrow} className='arrow'/>
    </RightBtnStyle>
  );
};

export default RightBtn;

const RightBtnStyle = styled.div`
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
    cursor: pointer;
    .arrow{
      height: .7vh;
      position: relative;
      left: .5vh;
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
    cursor: pointer;
    .arrow{
      height: .7vh;
      position: relative;
      left: .5vh;
    }
  }

`