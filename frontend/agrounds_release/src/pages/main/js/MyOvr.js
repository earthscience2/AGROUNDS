import React, { useEffect, useState } from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import '../css/MyOvr.scss';
import RayderChart from '../../../components/RayderChart';
import Main_Subject from '../../../components/Main_Subject';
import { AverageScore, AttackAve, OvrBarChart } from '../../../function/SubjectContents';
import { getOverallApi } from '../../../function/MatchApi';
const MyOvr = () => {
  const userCode = sessionStorage.getItem('userCode');
  const [ovrData, setOvrData] = useState([]);
  const [RaderData, setRaderData] = useState([]);

  useEffect(() => {
    getOverallApi({'user_code' : userCode})
    .then((response) => {
      if (response.data && response.data.point) {
        setOvrData(response.data);
        setRaderData(Object.values(response.data.point));
        console.log(response.data);
      } else {
        console.log("response.data.point가 존재하지 않습니다.");
        setRaderData([]);
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }, [])



  return (
    <div className="myovr">
      <Back_btn />
      <Login_title
        title="나의 OVR"
        explain="경기 데이터를 기반으로 설정된 현재 나의 능력치를 확인하고 더 발전해보세요"
      />
      
      <RayderChart data={RaderData} rate="88" />
    
      <div className="avescorebox">
        <Main_Subject BG="white" color="black" arrow={false}>
          {ovrData.point_trend && <AverageScore data={ovrData.point_trend}/>}
        </Main_Subject>
        <Main_Subject BG="white" color="black" arrow={false}>
          {ovrData && <AttackAve data={ovrData}/>}
        </Main_Subject>
      </div>
   
      <div className="myovrchartbox">
        <Main_Subject title="OVR지수 추세" BG="white" color="black" arrow={true}>
          <OvrBarChart />
        </Main_Subject>
      </div>
    </div>
  );
};

export default MyOvr;
