import React from 'react';
import styled from 'styled-components';
import user from '../assets/user-grey.png';

const HighBox = ({img, name, title, titleData, km}) => {
  return (
    <HighBoxStyle>
      <div className='first-box'>
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
    background-color: #DEC42F;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 2vh 2vh 0 0;
    .img-box{
      width: 7vh;
      height: 7vh;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border-radius: 50%;
      img{
        width: 100%;
        object-fit: cover;
      }
    }
    .name{
      color: white;
      font-size: 2vh;
      font-weight: 500;
      margin-top: 1vh;
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
    .title3{
      font-size: 1.4vh;
      font-weight: 700;
      margin: .5vh 0;
    }
    .titleData{
      font-size: 2.5vh;
      font-weight: 700;
    }
  }
`