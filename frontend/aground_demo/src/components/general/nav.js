import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import GoBack from '../../assets/go-back-icon.png';
const Nav = () => {
    const navigate = useNavigate();
    return (
        <NavStyle>
            <img className='nav_icon' src={GoBack} onClick={() => navigate(-1)} />
            <div className='nav_logo'>AGROUNDS</div>
        </NavStyle>
    );
};

export default Nav;

const NavStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .nav_icon{
        height: 2vh;
        position: relative;
        right: 18.7vh;
        top: 4.6vh;
    }
    .nav_logo{
        font-size: 2.1vh;
        font-weight: 700;
        margin-top: 2.5vh;
    }
`