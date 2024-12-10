import React from 'react';
import Anal_Detail from './Anal_Detail';
import Anal_Position_Nav from './Anal_Position_Nav';
import RayderChart from './RayderChart';
import { Sprint, ActivityLevel,Speed } from '../function/AnalysisData';

const data = {
  stamina: 65,
  sprint: 50,
  acceleration: 78,
  speed: 88,
  agility: 12,
  rating: 44,
};

const chartData = [
  data.stamina,
  data.sprint,
  data.acceleration,
  data.speed,
  data.agility,
  data.rating,
];

const sprint = {
  "average_distance": 12.26,
    "average_speed": 21.71,
    "average_acceleration": 2.98,
    "total_distance": 36.79,
    "max_distance": 19.74,
    "min_distance": 6.91,
    "distance_ratio": 1.95
}

const speed = {
  "average_speed": 5.49,
    "max_speed": 26.17,
    "average_acceleration": 2.04,
    "max_acceleration": 19.01
}

const stats = {
  "play_time_minutes": 20,
    "total_distance_km": 1.89,
    "distance_per_minute": 91.49,
    "direction_changes": 16,
    "major_direction_changes": 4,
    "activity_range_percentage": 19.69
}
const DynamicQuarter = () => {
  return (
    <div style={{width: '100%', display:'flex',flexDirection: 'column',justifyContent:'center', alignItems:'center'}}>
      <Anal_Position_Nav />
      <RayderChart data={chartData} rate="88"/>
      <Anal_Detail title="히트맵" />
      <Anal_Detail title="활동량" detail={<ActivityLevel data={stats}/>}/>
      <Anal_Detail title="속도 및 가속도" detail={<Speed data={speed}/>}/>
      <Anal_Detail title="스프린트" detail={<Sprint data={sprint}/>}/>
    </div>
  );
};

export default DynamicQuarter;