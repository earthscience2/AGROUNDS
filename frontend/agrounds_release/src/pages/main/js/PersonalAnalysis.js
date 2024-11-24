import React from 'react';
import '../css/PersonalAnalysis.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Quarter_Tab from '../../../components/Quarter_Tab';
import HorizontalSwiper from '../../../components/HorizontalSwiper';
import Anal_Position_Nav from '../../../components/Anal_Position_Nav';
import RayderChart from '../../../components/RayderChart';
import Anal_Detail from '../../../components/Anal_Detail';
import { ActivityLevel, Speed, Sprint } from '../../../function/AnalysisData';

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
const items = [
  { date: "2024.10.10 (토)", team: "인하대학교 FC", location: "인하대학교 대운동장" },
  { date: "2024.10.02 (일)", team: "동백 FC", location: "용인미르스타디움" },
  { date: "2024.09.28 (수)", team: "FC 제주", location: "제주월드컵경기장" },
  { date: "2024.09.21 (토)", team: "성남축구단", location: "수원월드컵경기장" },
  { date: "2024.09.14 (토)", team: "FC 서울", location: "서울월드컵경기장" },
  { date: "2024.09.07 (토)", team: "광주FC", location: "광주월드컵경기장" },
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
const PersonalAnalysis = () => {

  return (
    <div className='personalanal'>
      <Back_btn />
      <Login_title title="개인 상세 분석" explain="경기 데이터를 기반으로 설정된 현재 나의 능력치를 확인하고 더 발전해보세요" />
      <HorizontalSwiper items={items}/>
      <Quarter_Tab quarters={[1,2,3]}/>
      <Anal_Position_Nav />
      <RayderChart data={chartData} rate="88"/>
      <Anal_Detail title="히트맵" />
      <Anal_Detail title="활동량" detail={<ActivityLevel data={stats}/>}/>
      <Anal_Detail title="속도 및 가속도" detail={<Speed data={speed}/>}/>
      <Anal_Detail title="스프린트" detail={<Sprint data={sprint}/>}/>
    </div>
  );
};

export default PersonalAnalysis;