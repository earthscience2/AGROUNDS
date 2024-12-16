import React, { useState } from 'react';
import Anal_Detail from './Anal_Detail';
import Anal_Position_Nav from './Anal_Position_Nav';
import RayderChart from './RayderChart';
import { Sprint, ActivityLevel,Speed } from '../function/AnalysisData';

const DynamicQuarter = ({data, currentIndex, setCurrentIndex}) => {
  
  const rate = data.point.total
  
  const chartPoints = [
    data.point.total, // 평점
    data.point.sprint, // 스프린트
    data.point.acceleration, // 가속도
    data.point.speed, // 스피드
    data.point.positiveness, // 적극성
    data.point.stamina, // 체력
  ];

  // console.log(point)
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
      <RayderChart data={chartPoints} rate={rate}/>
      {/* <Anal_Detail title="히트맵" />
      <Anal_Detail title="활동량" detail={<ActivityLevel data={stats}/>}/>
      <Anal_Detail title="속도 및 가속도" detail={<Speed data={speed}/>}/>
      <Anal_Detail title="스프린트" detail={<Sprint data={sprint}/>}/> */}
    </div>
  );
};

export default DynamicQuarter;