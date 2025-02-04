import React from 'react';
import styled from 'styled-components';
import user from '../assets/user-grey.png';
import red from '../assets/team-red-bg.png';
import yellow from '../assets/team-yellow-bg.png';
import green from '../assets/team-green-bg.png';
import blue from '../assets/team-blue-bg.png';

const HighBox = ({img, name, title, titleData, km, position, onClick}) => {
  
  const backgroundImg = () => {
    if (position === "LWF" || position === "ST" || position === "RWF") {
      return red;
    } else if (position === "LWM" || position === "CAM" || position === "RWM" || position === "LM" || position === "CM" || position === "RM" || position === "CDM") {
      return green;
    } else if (position === "LWB" || position === "RWB" || position === "LB" || position === "CB" || position === "RB" ) {
      return blue;
    } else {
      return yellow;
    }
  }
  return (
    <HighBoxStyle >
      <div className='first-box' onClick={onClick}>
        <img className='background' src={backgroundImg()}/>
        {img ? <div className='img-box'><img src={img}/></div> : <div className='img-box' style={{backgroundColor: 'white'}}><img src={user} style={{width:' 50%'}}/></div>}
        <div className='name'>{name}</div>
      </div>
      <div className='second-box'>
        <div className='title3'>{title}</div>
        <div className='titleData'>{titleData}{km}</div>
      </div>
    </HighBoxStyle>
  );
};

export default HighBox;

const HighBoxStyle = styled.div`
  width: 20vh;
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .first-box{
    width: 100%;
    height: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 2vh 2vh 0 0;
    overflow: hidden;
    .background{
      object-fit: cover;
      z-index: 1;
    }
    .img-box{
      width: 7vh;
      height: 7vh;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border-radius: 50%;
      position: absolute;
      background-color: white;
      z-index: 1999;
      margin-top: -3vh;
      img{
        width: 100%;
        object-fit: cover;
      }
    }
    .name{
      color: white;
      font-size: 1.8vh;
      font-weight: 600;
      margin-top: 8vh;
      position: absolute;
      z-index: 1999;
    }
  }
  .second-box{
    width: 100%;
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #E5E9ED;
    border-right: 1px solid #E5E9ED;
    border-bottom: 1px solid #E5E9ED;
    border-radius: 0 0 2vh 2vh ;
    z-index: 1;
    .title3{
      font-size: 1.4vh;
      font-weight: 700;
      margin: .5vh 0;
      color: #525252;
    }
    .titleData{
      font-size: 2.3vh;
      font-weight: 700;
    }
  }
`