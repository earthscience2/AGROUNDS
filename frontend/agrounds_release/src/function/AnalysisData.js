import React from 'react';
import styled from 'styled-components';
import SpecificGravity from '../components/SpecificGravity';

const Map = ({data}) => {
  const img = data.hitmap;
  return (
    <MapStyle>
      <img src={img} />
    </MapStyle>
  );
};

const ActivityLevel = ({ data, attack,defence }) => {
  return (
    <ActivityLevelStyle>
      <SpecificGravity attack={attack} defence={defence}/>
      <div className='datarow'>
        <p className='datatitle'>경기시간</p>
        <p className='datadetail'>{data.T}분</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>이동거리</p>
        <p className='datadetail'>{data.D}km</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>분당 이동거리</p>
        <p className='datadetail'>{data.DPM}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>90~135도 방향전환 횟수</p>
        <p className='datadetail'>{data.LDT}번</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>135~180도 방향전환 횟수</p>
        <p className='datadetail'>{data.HDT}번</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>활동 범위</p>
        <p className='datadetail'>{data.MR}%</p>
      </div>
    </ActivityLevelStyle>
  );
};

const Speed = ({ data }) => {
  return (
    <SpeedStyle >
      <div className='movingbox'>
        <div className='eachmovingbox'>
          <p>속력 변화</p>
          <img src={data.speed_change} />
        </div>
        <div className='eachmovingbox'>
          <p>가속도 변화</p>
          <img src={data.acceleration_change} />
        </div>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 속력</p>
        <p className='datadetail'>{data.AS}km/h</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최고 속력</p>
        <p className='datadetail'>{data.HS}km/h</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 가속도</p>
        <p className='datadetail'>{data.AA}m/s²</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최고 가속도</p>
        <p className='datadetail'>{data.HA}m/s²</p>
      </div>
    </SpeedStyle>
  );
};
console.log()
const Sprint = ({data}) => {
  return (
    <SprintStyle >
      <div className='datarow'>
        <p className='datatitle'>스프린트 횟수</p>
        <p className='datadetail'>{data.S}번</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 스프린트 거리</p>
        <p className='datadetail'>{data.ASD}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 스프린트 속력</p>
        <p className='datadetail'>{data.ASS}km/h</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 스프린트 가속도</p>
        <p className='datadetail'>{data.ASA}m/s²</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>전체 스프린트 거리</p>
        <p className='datadetail'>{data.TSD}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최고 스프린트 거리</p>
        <p className='datadetail'>{data.HSD}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최저 스프린트 거리</p>
        <p className='datadetail'>{data.LSD}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>총 이동거리 당 스프린트 거리</p>
        <p className='datadetail'>{data.SDPD}%</p>
      </div>
    </SprintStyle>
  )
}

export { Map, ActivityLevel, Speed, Sprint };


const MapStyle = styled.div`
width: 85%;
height: 20vh;
display: flex;
justify-content: center;
align-items: center;
border-radius: 1vh;
overflow: hidden;
margin-bottom: 5vh;
margin-top: 1vh;
& > img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
`
const ActivityLevelStyle = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .datarow{
    display: flex;
    justify-content: space-between;
    &:last-child{
        margin-bottom: 3vh;
      }
    .datatitle{
      color: #6F6F6F;
      font-size: 1.6vh;
      font-weight: 500;
      margin: 1vh 0;
    }
    .datadetail{
      color: #393939;
      font-size: 1.6vh;
      font-weight: 500;
      margin: 1vh 0;
    }
  }
`
const SpeedStyle = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .movingbox{
    width: 100%;
    height: 15vh;
    border-radius: 1vh;
    background-color: white;
    margin: 1vh auto 2vh auto;
    display: flex;
    justify-content: center;
    align-items: center;
    .eachmovingbox{
      width: 50%;
      height: 15vh;
      margin-left: 2vh;
      & > p {
        font-size: 1.6vh;
        font-weight: 600;
        width: 80%;
        
      }
      & > img {
        width: 90%;
        object-fit: cover;
        margin-left: -1vh;
      }
    }
  }
  .datarow{
    display: flex;
    justify-content: space-between;
    &:last-child{
        margin-bottom: 3vh;
      }
    .datatitle{
      color: #6F6F6F;
      font-size: 1.6vh;
      font-weight: 500;
      margin: 1vh 0;
    }
    .datadetail{
      color: #393939;
      font-size: 1.6vh;
      font-weight: 500;
      margin: 1vh 0;
    }
  }
`


const SprintStyle = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .datarow{
    display: flex;
    justify-content: space-between;
    &:last-child{
        margin-bottom: 3vh;
      }
    .datatitle{
      color: #6F6F6F;
      font-size: 1.6vh;
      font-weight: 500;
      margin: 1vh 0;
    }
    .datadetail{
      color: #393939;
      font-size: 1.6vh;
      font-weight: 500;
      margin: 1vh 0;
    }
  }
`