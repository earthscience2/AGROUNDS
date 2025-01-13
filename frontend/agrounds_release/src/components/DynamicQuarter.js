import React, { useState } from 'react';
import Anal_Detail from './Anal_Detail';
import Anal_Position_Nav from './Anal_Position_Nav';
import RayderChart from './RayderChart';
import { Sprint, ActivityLevel,Speed, Map } from '../function/AnalysisData';

const DynamicQuarter = ({data, currentIndex, setCurrentIndex}) => {
  const attack = data.active_ratio?.A_TPT;
  const defence = data.active_ratio?.D_TPT;

  const rate = data.point.total

  const chartPoints = [
    data.point.total, 
    data.point.sprint, 
    data.point.acceleration, 
    data.point.speed, 
    data.point.positiveness, 
    data.point.stamina,
  ];

  const positionData = () => {
    if (currentIndex === 0) {
      return data.total;
    } else if (currentIndex === 1) {
      return data.attack;
    } else if (currentIndex === 2) {
      return data.defense;
    }
  }
  return (
    <div style={{width: '100%', display:'flex',flexDirection: 'column',justifyContent:'center', alignItems:'center'}}>
      <Anal_Position_Nav currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
      <div style={{marginBottom: '5vh'}}/>
      <RayderChart data={chartPoints} rate={rate}/>
      <Anal_Detail title="히트맵 / 고속히트맵 / 방향전환" detail={<Map data={positionData()}/>}/>
      <Anal_Detail title="활동량" detail={<ActivityLevel attack={attack} defence={defence} data={positionData()}/>}/>
      <Anal_Detail title="속도 및 가속도" detail={<Speed data={positionData()}/>}/>
      <Anal_Detail title="스프린트" detail={<Sprint data={positionData()}/>}/> 
    </div>
  );
};

export default DynamicQuarter;