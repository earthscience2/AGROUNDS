import React from 'react';
import styled from 'styled-components';
import SpecificGravity from '../components/SpecificGravity';

const Map = () => {
  return (
    <div>
      
    </div>
  );
};

const ActivityLevel = ({ data }) => {
  return (
    <ActivityLevelStyle>
      <SpecificGravity attack='72' defence='28'/>
      <div className='datarow'>
        <p className='datatitle'>경기시간</p>
        <p className='datadetail'>{data.play_time_minutes}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>이동거리</p>
        <p className='datadetail'>{data.total_distance_km}km/h</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>분당 이동거리</p>
        <p className='datadetail'>{data.distance_per_minute}m/s2</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>방향전환 횟수</p>
        <p className='datadetail'>{data.direction_changes}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>큰 방향전환 횟수</p>
        <p className='datadetail'>{data.major_direction_changes}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>활동 범위</p>
        <p className='datadetail'>{data.activity_range_percentage}m</p>
      </div>
    </ActivityLevelStyle>
  );
};

const Speed = ({ data }) => {
  return (
    <SpeedStyle >
      <div className='movingbox'></div>
      <div className='datarow'>
        <p className='datatitle'>평균 속력</p>
        <p className='datadetail'>{data.average_speed}km/h</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최고 속력</p>
        <p className='datadetail'>{data.max_speed}km/h</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 가속도</p>
        <p className='datadetail'>{data.average_acceleration}m/s2</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최고 가속도</p>
        <p className='datadetail'>{data.max_acceleration}m/s2</p>
      </div>
    </SpeedStyle>
  );
};
console.log()
const Sprint = ({data}) => {
  return (
    <SprintStyle >
      <div className='datarow'>
        <p className='datatitle'>평균 스프린트 거리</p>
        <p className='datadetail'>{data.average_distance}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 스프린트 속력</p>
        <p className='datadetail'>{data.average_speed}km/h</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 스프린트 가속도</p>
        <p className='datadetail'>{data.average_acceleration}m/s2</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>전체 스프린트 거리</p>
        <p className='datadetail'>{data.total_distance}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최고 스프린트 거리</p>
        <p className='datadetail'>{data.max_distance}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최저 스프린트 거리</p>
        <p className='datadetail'>{data.min_distance}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>총 이동거리 당 스프린트 거리</p>
        <p className='datadetail'>{data.distance_ratio}%</p>
      </div>
    </SprintStyle>
  )
}

export { Map, ActivityLevel, Speed, Sprint };

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
    border-radius: 1.5vh;
    background-color: white;
    margin: 1vh auto 2vh auto;
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