import React from 'react';
import styled from 'styled-components';
import arrow from "../../assets/WhiteArrow.png";


const MainLayout = ({imgsrc, bgColor, onClick, children}) => {
  return (
    <MainLayoutStyle>
      <img src={imgsrc} />
      <RightBtnStyle bgColor={bgColor} onClick={onClick}>
        <span>{children}</span>
        <img src={arrow} className='arrow'/>
      </RightBtnStyle>  
    </MainLayoutStyle>
  );
};

export default MainLayout;

const MainLayoutStyle = styled.div`
  width: 100vw;
  padding: 2vh 0;
  border-bottom: 1px solid #055540;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    height: 10vh;
  }
`

const RightBtnStyle = styled.div`
  position: absolute;
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
  left: 72%;
  .arrow{
    height: .7vh;
    width: 1vh; 
    position: relative;
    left: .5vh;
  }    
`