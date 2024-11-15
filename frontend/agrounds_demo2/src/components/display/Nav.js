import React from 'react';
import GoBack from "../../assets/go-back-icon.png";
import Logo from "../../assets/nav.png";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Nav = ({ arrow }) => {
  const navigate = useNavigate();
  return (
    <NavStyle>
      {arrow ? <img src={GoBack} className='goback' onClick={() => navigate(-1)}/> : ''}
      <img src={Logo} className='logo' onClick={() => navigate('/demo/main')}/>
    </NavStyle>
  );
};

export default Nav;

const NavStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
  width: 100vw;
  z-index: 1999;
  .goback{
    height: 2.5vh;
    position: absolute;
    left: 5vw;
    cursor: pointer;
    z-index: 1999;
  }
  .logo{
    height: 7vh;
    z-index: 1999;
  }
`