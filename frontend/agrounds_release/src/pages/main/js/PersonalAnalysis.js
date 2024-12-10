import React, { useState, useEffect } from 'react';
import '../css/PersonalAnalysis.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Quarter_Tab from '../../../components/Quarter_Tab';
import HorizontalSwiper from '../../../components/HorizontalSwiper';
import Anal_Position_Nav from '../../../components/Anal_Position_Nav';
import RayderChart from '../../../components/RayderChart';
import Anal_Detail from '../../../components/Anal_Detail';
import { ActivityLevel, Speed, Sprint } from '../../../function/AnalysisData';
import { GetDetailAnal } from '../../../api/analysis';
import Loading from '../../../components/Loading';
import DynamicQuarter from '../../../components/DynamicQuarter';
import Summary from '../../../components/Summary';

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

const PersonalAnalysis = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetDetailAnal();
      setApiData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />; 
  }

  console.log(apiData);
  return (
    <div className='personalanal'>
      <Back_btn />
      <Login_title title="개인 상세 분석" explain="경기 데이터를 기반으로 설정된 현재 나의 능력치를 확인하고 더 발전해보세요" />
      <HorizontalSwiper items={items}/>
      <Quarter_Tab quarters={[1,2,3]}/>
      <Summary />
      <DynamicQuarter />
    </div>
  );
};

export default PersonalAnalysis;