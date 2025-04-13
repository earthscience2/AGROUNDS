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
  const [error, setError] = useState(false);

  useEffect(() => {
    getOverallApi({'user_code' : userCode})
    .then((response) => {
      if (response.data && response.data.point) {
        setOvrData(response.data);
        setRaderData(Object.values(response.data.point));
      } else {
        setRaderData([]);
      }
    })
    .catch((error) => {
      setError(true);
    })
  }, [])

  return (
    <div className="myovr">
      <Back_btn />
      {error 
      ? 
        <Login_title title="나의 OVR" />
      :
        <Login_title title="나의 OVR" explain={"경기 데이터를 기반으로 설정된 \n현재 나의 능력치를 확인하고 더 발전해보세요"}
        />
      }
      
      <div style={{marginTop: '-5vh'}}></div>
      {error 
      ? <p className='rader-rate-e' style={{color: '#878D96'}}>{RaderData[0]}</p>
      : <p className='rader-rate' >{RaderData[0]}</p>
      }
      {RaderData && <RayderChart data={RaderData} error={error}/> }
    
      <div className="avescorebox">
        <Main_Subject BG="white" color="black" arrow={false}>
          <AverageScore data={ovrData.point_trend} error={error}/>
        </Main_Subject>
        <Main_Subject BG="white" color="black" arrow={false}>
          <AttackAve data={ovrData} error={error}/>
        </Main_Subject>
      </div>
   
      <div className="myovrchartbox">
        <Main_Subject title="OVR지수 추세" BG="white" color="black" arrow={true}>
          <OvrBarChart data={RaderData} error={error}/>
        </Main_Subject>
      </div>
    </div>
  );
};

export default MyOvr;
