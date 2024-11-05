import React, { useState } from 'react';
import ImgAnal from '../display/ImgAnal';
import DataAnal from '../display/DataAnal';
import styled from 'styled-components';
import client from '../../clients';

const Quarter2 = ({ activePosition }) => {
  const [imgAnal, setImgAnal] = useState('히트맵');

  const [attack, setAttack] = useState([]);
  const [defense, setDefense] = useState([]);
  const [total, setTotal] = useState([]);

  const data = {
    match_code: "m_001",
    user_code: "u_001",
    quarter: 2
  }
  useState(() => {
    client.post('/api/test_page/analyze-data/', data)
    .then((response) => 
      {
        setAttack(response.data.attack);
        setDefense(response.data.defense);
        setTotal(response.data.total);
        console.log(response)
      }
    )
    .catch((error) => alert(error));
  }, [data])


  const getImage = () => {
    if (activePosition === '전체' && imgAnal === '히트맵'){
      return total.hitmap;
    }else if (activePosition === '전체' && imgAnal === '고속히트맵'){
      return total.high_speed_hitmap;
    }else if (activePosition === '전체' && imgAnal === '방향전환'){
      return total.speed_change;
    }else if (activePosition === '전체' && imgAnal === '속력변화'){
      return total.speed_change;
    }else if (activePosition === '전체' && imgAnal === '가속도변화'){
      return total.acceleration_change;
    }else if (activePosition === '공격' && imgAnal === '히트맵'){
      return attack.hitmap;
    }else if (activePosition === '공격' && imgAnal === '고속히트맵'){
      return attack.high_speed_hitmap;
    }else if (activePosition === '공격' && imgAnal === '방향전환'){
      return attack.speed_change;
    }else if (activePosition === '공격' && imgAnal === '속력변화'){
      return attack.speed_change;
    }else if (activePosition === '공격' && imgAnal === '가속도변화'){
      return attack.acceleration_change;;
    }else if (activePosition === '수비' && imgAnal === '히트맵'){
      return defense.hitmap;
    }else if (activePosition === '수비' && imgAnal === '고속히트맵'){
      return defense.high_speed_hitmap;
    }else if (activePosition === '수비' && imgAnal === '방향전환'){
      return defense.speed_change;
    }else if (activePosition === '수비' && imgAnal === '속력변화'){
      return defense.speed_change;
    }else if (activePosition === '수비' && imgAnal === '가속도변화'){
      return defense.acceleration_change;;
    }
  }

  return (
    <Quarter2Style>
      <>
        <div className='map'>
          <img src={getImage()} />
        </div>
        <ImgAnal activePosition={activePosition} imgAnal={imgAnal} setImgAnal={setImgAnal}/>
        <div>
          <DataAnal quarter='2' position={activePosition}/>
        </div>
      </>
    </Quarter2Style>
  );
};

export default Quarter2;

const Quarter2Style = styled.div`
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
    width: 100%;
    height: 25vh;
    padding: 0;
    background-color: #D9D9D9;
    display: flex;
    justify-content: center;
    align-items:center;
    & > img {
      width: 70%;
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