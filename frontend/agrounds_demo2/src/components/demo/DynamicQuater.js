import React, { useState, useEffect } from 'react';
import ImgAnal from '../display/ImgAnal';
import DataAnal from '../display/DataAnal';
import styled from 'styled-components';
import client from '../../clients';

const DynamicQuarter = ({ activePosition, quarter }) => {
  const [imgAnal, setImgAnal] = useState('히트맵');
  const [attack, setAttack] = useState([]);
  const [defense, setDefense] = useState([]);
  const [total, setTotal] = useState([]);

  useEffect(() => {
    const data = {
      match_code: sessionStorage.getItem('match_code'),
      user_code: sessionStorage.getItem('user_id'),
      quarter, 
    };

    client.post('/api/test_page/analyze-data/', data)
      .then((response) => {
        setAttack(response.data.attack);
        setDefense(response.data.defense);
        setTotal(response.data.total);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [quarter]);

  const getImage = () => {
    const imgMap = {
      히트맵: 'hitmap',
      고속히트맵: 'high_speed_hitmap',
      방향전환: 'change_direction',
      속력변화: 'speed_change',
      가속도변화: 'acceleration_change',
    };

    const positionData = { 전체: total, 공격: attack, 수비: defense }[activePosition] || {};
    return positionData[imgMap[imgAnal]] || '';
  };

  return (
    <QuarterStyle>
      <div className="map">
        <div className="imgwrap">
          <img src={getImage()} alt="분석 이미지" />
        </div>
      </div>
      <ImgAnal activePosition={activePosition} imgAnal={imgAnal} setImgAnal={setImgAnal} />
      <div>
        <DataAnal quarter={quarter} position={activePosition} />
      </div>
    </QuarterStyle>
  );
};

export default DynamicQuarter;

const QuarterStyle = styled.div`
  @media screen and (max-width: 768px) {
    .map {
      width: 100%;
      height: 25vh;
      background-color: #d9d9d9;
      display: flex;
      justify-content: center;
      align-items: center;
      .imgwrap {
        width: 70%;
        height: 22vh;
        border-radius: 2vh;
        overflow: hidden;
        background-color: white;
        & > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
  @media (min-width: 769px) and (max-width: 1280px) {
    .map {
      width: 100%;
      height: 30vh;
      background-color: #d9d9d9;
      display: flex;
      justify-content: center;
      align-items: center;
      .imgwrap {
        width: 70%;
        height: 26vh;
        border-radius: 2vh;
        overflow: hidden;
        background-color: white;
        & > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
  @media screen and (min-width: 1281px) {
    .map {
      width: 100%;
      height: 40vh;
      background-color: #d9d9d9;
      display: flex;
      justify-content: center;
      align-items: center;
      .imgwrap {
        width: 30%;
        height: 30vh;
        border-radius: 2vh;
        overflow: hidden;
        background-color: white;
        & > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
`;
