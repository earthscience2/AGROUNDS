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
      <div className='backimg'>
        <img src={Gpsimg} className='img'/>
        <div className='back'><LeftBtn children='뒤로' onClick={() => navigate(-1)}/></div>
      </div>
    </GPSStyle>
  );
};

export default GpsDisplay;

const GPSStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 768px) {
    .backimg{
      width: 100vw;
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
    }
  }
  @media (min-width: 769px) and (max-width: 1280px) {
    .backimg{
      width: 100vw;
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
    }
  }
  @media screen and (min-width: 1281px){
    .backimg{
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      .img{
        width: 50%;
        position: relative;
        top: -20vh;
      }
      .back{
        position: relative;
        top: -30vh;
      }
    }
  }
`