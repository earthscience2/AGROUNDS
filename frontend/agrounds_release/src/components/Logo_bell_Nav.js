import React from 'react';
import Logo from '../assets/Agrounds_logo.png';
import bell from '../assets/bell.png';
import styled from 'styled-components';

const LogoBellNav = ({logo}) => {
  return (
    <LogoBellNavStyle >
      {logo ? <><img src={Logo} className='logo'/><img src={bell} className='bell'/></>
      :
      <>
      <div></div>
      <img src={bell} className='bell'/>
      </>
      }
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

  .logo{
    padding: 0 2vh;
    height: 2.2vh;
  }
  .bell{
    padding: 0 2vh;
    height: 3vh;
    cursor: pointer;
  }

`