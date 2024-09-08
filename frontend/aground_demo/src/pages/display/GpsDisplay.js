import React from 'react';
import styled from 'styled-components';
import Nav from '../../components/display/Nav';
import Gpsimg from '../../assets/display/gps/gps.png';
import LeftBtn from '../../components/display/LeftBtn';
import { useNavigate } from 'react-router-dom';

const GpsDisplay = () => {
  const navigate = useNavigate();
  return (
    <GPSStyle>
      <Nav arrow='true' />
      <img src={Gpsimg} className='img'/>
      <div className='back'><LeftBtn children='뒤로' onClick={() => navigate(-1)}/></div>
    </GPSStyle>
  );
};

export default GpsDisplay;

const GPSStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .img{
    width: 100vw;
    position: relative;
    top: -10vh;
  }
  .back{
    position: relative;
    top: -15vh;
  }
`