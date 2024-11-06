import React from 'react';
import styled from 'styled-components';
import arrow from "../../assets/WhiteArrow.png";

const DownBtn = ({bgColor, children, onClick}) => {
  return (
    <DownBtnStyle bgColor={bgColor} onClick={onClick}>
      <span>{children}</span>
      <img src={arrow} className='arrow'/>
    </DownBtnStyle>
  );
};

export default DownBtn;

const DownBtnStyle = styled.div`
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
      left: .5vh;
      transform: rotate(90deg);
    }
  }
  @media screen and (min-width: 821px){
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
      height: .8vh;
      position: relative;
      right: -.5vh;
      transform: rotate(90deg);
    }
  }
`