import React from 'react';
import styled from 'styled-components';

const CommonBtn = ({bgColor, children, onClick, icon}) => {
  return (
    <CommonBtnStyle bgColor={bgColor} onClick={onClick}>
      <span>{children}</span>
      <img src={icon} className='icon'/>
    </CommonBtnStyle>
  );
};

export default CommonBtn;

const CommonBtnStyle = styled.div`
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
    margin: 0 5px;


    cursor: pointer;
    .icon{
      height: 12px;
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
    font-size: 1.3vh;
    width: 8.3vh;
    height: 3vh;
    cursor: pointer;
    .icon{
      height: 1.6vh;
      position: relative;
      left: .5vh;
    } 
  }

`