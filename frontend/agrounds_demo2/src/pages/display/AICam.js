import React from 'react';
import styled from 'styled-components';
import Nav from '../../components/display/Nav';
import AiCam from '../../assets/display/aiCam/cam.png';
import LeftBtn from '../../components/display/LeftBtn';
import { useNavigate } from 'react-router-dom';

const AICam = () => {
  const navigate = useNavigate();
  return (
    <AICamStyle>
      <Nav arrow='true'/>
      <img src={AiCam} className='img'/>
      <div className='back'><LeftBtn children='뒤로' onClick={() => navigate(-1)}/></div>
    </AICamStyle>
  );
};

export default AICam;

const AICamStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 768px) {
    .img{
    width: 100vw;
    position: relative;
    top: -10vh;
  }
  .back{
    position: relative;
    top: -20vh;
  }
  }
  @media (min-width: 769px) and (max-width: 1280px) {
    .img{
    width: 100vw;
    position: relative;
    top: -10vh;
  }
  .back{
    position: relative;
    top: -20vh;
  }
  }
  @media screen and (min-width: 1281px){
    .img{
    width: 60vw;
    position: relative;
    top: -10vh;
  }
  .back{
    position: relative;
    top: -30vh;
  }
  }
  
`