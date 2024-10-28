import React, { useState } from 'react';
import styled from 'styled-components';
import Summary from '../../assets/display/playanal/Q1summary.png';
import hitmap from '../../assets/display/playanal/Q1/total/Q1hitmap.png';
import speedMap from '../../assets/display/playanal/Q1/total/Q1fasthitmap.png';
import accelMap from '../../assets/display/playanal/Q1/total/Q1changemspeed.png';
import directionMap from '../../assets/display/playanal/Q1/total/Q1changeway.png';
import changespeend from '../../assets/display/playanal/Q1/total/Q1changespeed.png';
import Ahitmap from '../../assets/display/playanal/Q1/attack/Q1_attack_hitmap.png';
import AFhitmap from '../../assets/display/playanal/Q1/attack/Q1_attack_fasthitmap.png';
import Achange from '../../assets/display/playanal/Q1/attack/Q1_attack_changeway.png';
import Dhitmap from '../../assets/display/playanal/Q1/defence/Q1_defence_hitmap.png';
import DFhitmap from '../../assets/display/playanal/Q1/defence/Q1_defence_fasthitmap.png';
import Dchange from '../../assets/display/playanal/Q1/defence/Q1_defence_changeway.png';
import ImgAnal from './ImgAnal';
import DataAnal from './DataAnal';


const Quarter1 = ({activePosition}) => {
  const [imgAnal, setImgAnal] = useState('히트맵');

  const getImage = () => {
    if (activePosition === '전체' && imgAnal === '히트맵'){
      return hitmap;
    }else if (activePosition === '전체' && imgAnal === '고속히트맵'){
      return speedMap;
    }else if (activePosition === '전체' && imgAnal === '방향전환'){
      return directionMap;
    }else if (activePosition === '전체' && imgAnal === '속력변화'){
      return changespeend;
    }else if (activePosition === '전체' && imgAnal === '가속도변화'){
      return accelMap;
    }else if (activePosition === '공격' && imgAnal === '히트맵'){
      return Ahitmap;
    }else if (activePosition === '공격' && imgAnal === '고속히트맵'){
      return AFhitmap;
    }else if (activePosition === '공격' && imgAnal === '방향전환'){
      return Achange;
    }else if (activePosition === '수비' && imgAnal === '히트맵'){
      return Dhitmap;
    }else if (activePosition === '수비' && imgAnal === '고속히트맵'){
      return DFhitmap;
    }else if (activePosition === '수비' && imgAnal === '방향전환'){
      return Dchange;
    }
  }

    

  return (
    <Quarter1Style>
      <>
        <div className='map'>
          <img src={getImage()} />
        </div>
        <ImgAnal activePosition={activePosition} imgAnal={imgAnal} setImgAnal={setImgAnal}/>
        <div>
          <DataAnal quarter='1쿼터' position={activePosition}/>
        </div>
      </>
        
    </Quarter1Style>
  );
};

export default Quarter1;

const Quarter1Style = styled.div`
@media screen and (max-width: 768px) {
  .quarter-first{
    padding: 3vh 4vh;
    background-color: #F5F5F5;
    display: flex;
    justify-content: center;
    align-items: center;
    & > img{
      width: 90%;
    }
  }

  .map{
    padding: 2vh 8vh;
    background-color: #D9D9D9;
    & > img {
      width: 100%;
    }
  }
}
@media (min-width: 769px) and (max-width: 1280px) {
  .quarter-first{
    padding: 3vh 4vh;
    background-color: #F5F5F5;
    display: flex;
    justify-content: center;
    align-items: center;
    & > img{
      width: 70%;
    }
  }

  .map{
    padding: 2vh 8vh;
    background-color: #D9D9D9;
    display: flex;
    justify-content: center;
    & > img {
      width: 60%;
    }
  }
}
@media screen and (min-width: 1281px){
  .quarter-first{
    padding: 3vh 4vh;
    background-color: #F5F5F5;
    display: flex;
    justify-content: center;
    align-items: center;
    & > img{
      width: 40%;
    }
  }

  .map{
    padding: 2vh 8vh;
    background-color: #D9D9D9;
    display: flex;
    justify-content: center;
    & > img {
      width: 30%;
    }
  }
}
`