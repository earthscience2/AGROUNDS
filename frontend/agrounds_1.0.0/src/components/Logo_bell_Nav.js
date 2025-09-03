import React from 'react';
import Logo from '../assets/common/Agrounds_logo.png';
import bell from '../assets/common/bell.png';
import leftArrow from '../assets/common/left.png';
import styled from 'styled-components';

const LogoBellNav = ({logo, showBack, onBack}) => {
  return (
    <LogoBellNavStyle >
      {showBack ? (
        <>
          <img src={leftArrow} className='back-arrow' onClick={onBack} alt="뒤로가기"/>
          <img src={bell} className='bell'/>
        </>
      ) : logo ? (
        <>
          <img src={Logo} className='logo'/>
          <img src={bell} className='bell'/>
        </>
      ) : (
        <>
          <div></div>
          <img src={bell} className='bell'/>
        </>
      )}
    </LogoBellNavStyle>
  );
};

export default LogoBellNav;

const LogoBellNavStyle = styled.div`
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F2F4F6;
  position: relative;
  z-index: 20;

  .logo{
    padding: 0 2vh;
    height: 2.2vh;
  }
  .bell{
    padding: 0 2vh;
    height: 3vh;
    cursor: pointer;
  }
  .back-arrow{
    padding: 0 2vh;
    height: 2.5vh;
    cursor: pointer;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.7;
    }
  }

`