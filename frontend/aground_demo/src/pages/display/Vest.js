import React from 'react';
import styled from 'styled-components';
import Nav from '../../components/display/Nav';
import Vest1 from '../../assets/display/vest/Vest1.png';
import Vest2 from '../../assets/display/vest/Vest2.png';
import Vest3 from '../../assets/display/vest/Vest3.png';
import Vest4 from '../../assets/display/vest/Vest4.png';
import Vest5 from '../../assets/display/vest/Vest5.png';
import LeftBtn from '../../components/display/LeftBtn';
import { useNavigate } from 'react-router-dom';

const Vest = () => {
  const navigate = useNavigate();
  return (
    <VestStyle>
      <Nav arrow='true'/>
      <img src={Vest1} className='img1' />
      <img src={Vest2} className='img2' />
      <img src={Vest3} className='img3' />
      <img src={Vest4} className='img4' />
      <img src={Vest5} className='img5' />
      <div className='btnBox'><LeftBtn children='뒤로' onClick={() => navigate(-1)}/></div>
    </VestStyle>
  );
};

export default Vest;

const VestStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 768px) {
    .img1{
      width: 90vw;
      margin: 3vh 0;
    }
    .img2{
      width: 90vw;
      margin: 2vh 0;
    }
    .img3{
      width: 90vw;
      margin: 4vh 0;
    }
    .img4{
      width: 90vw;
      margin: 4vh 0;
    }
    .img5{
      width: 90vw;
      margin: 4vh 0;
    }
    .btnBox{
      height: 8vh;
      margin: 2vh 0;
    }
  }
  @media (min-width: 769px) and (max-width: 1280px) {
    .img1{
      width: 90vw;
      margin: 3vh 0;
    }
    .img2{
      width: 90vw;
      margin: 2vh 0;
    }
    .img3{
      width: 90vw;
      margin: 4vh 0;
    }
    .img4{
      width: 90vw;
      margin: 4vh 0;
    }
    .img5{
      width: 90vw;
      margin: 4vh 0;
    }
    .btnBox{
      height: 8vh;
      margin: 2vh 0;
    }
  }
  @media screen and (min-width: 1281px){
    .img1{
      width: 50vw;
      margin: 10vh 0;
    }
    .img2{
      width: 50vw;
      margin: 5vh 0;
    }
    .img3{
      width: 50vw;
      margin: 4vh 0;
    }
    .img4{
      width: 50vw;
      margin: 4vh 0;
    }
    .img5{
      width: 35vw;
      margin: 4vh 0;
    }
    .btnBox{
      height: 8vh;
      margin: 4vh 0;
    }
  }
`