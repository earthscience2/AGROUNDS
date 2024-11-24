import React from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import '../css/MyOvr.scss';
import RayderChart from '../../../components/RayderChart';
import Main_Subject from '../../../components/Main_Subject';
import { AverageScore, AttackAve, OvrBarChart } from '../../../function/SubjectContents';
const MyOvr = () => {
  const data = {
    stamina: 65,
    sprint: 50,
    acceleration: 78,
    speed: 88,
    agility: 12,
    rating: 44,
  };

  // 데이터 배열로 변환
  const chartData = [
    data.stamina,
    data.sprint,
    data.acceleration,
    data.speed,
    data.agility,
    data.rating,
  ];

  return (
    <div className="myovr">
      <Back_btn />
      <Login_title
        title="나의 OVR"
        explain="경기 데이터를 기반으로 설정된 현재 나의 능력치를 확인하고 더 발전해보세요"
      />
      {/* Radar Chart */}
      <RayderChart data={chartData} rate="88" />
      {/* Main Subjects */}
      <div className="avescorebox">
        <Main_Subject BG="white" color="black" arrow={false}>
          <AverageScore />
        </Main_Subject>
        <Main_Subject BG="white" color="black" arrow={false}>
          <AttackAve />
        </Main_Subject>
      </div>
      {/* Bar Chart */}
      <div className="myovrchartbox">
        <Main_Subject title="OVR지수 추세" BG="white" color="black" arrow={true}>
          <OvrBarChart />
        </Main_Subject>
      </div>
    </div>
  );
};

export default MyOvr;
