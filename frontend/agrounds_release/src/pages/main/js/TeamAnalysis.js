import React, { useEffect, useState } from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import HorizontalSwiper from '../../../components/HorizontalSwiper';
import Quarter_Tab from '../../../components/Quarter_Tab';
import DynamicQuarter from '../../../components/DynamicQuarter';
import Loading from '../../../components/Loading';
import { useLocation } from 'react-router-dom';
import { getTeamAnalResultApi } from '../../../function/MatchApi';

const TeamAnalysis = () => {

  const location = useLocation();
  const initialMatchCode = location.state?.matchCode;
  const [activeTab, setActiveTab] = useState("1쿼터");
  const [currentIndex, setCurrentIndex] = useState(0);
  const teamCode = sessionStorage.getItem('teamCode');
  const user_code = sessionStorage.getItem('userCode');
  const [selectedMatch, setSelectedMatch] = useState(initialMatchCode);
  const [loading, setLoading] = useState(true);
  const [quarterData, setQuarterData]= useState([]);
  const [quarter, setQuarter] = useState();  
  
  useEffect(() => {
    if (!selectedMatch && initialMatchCode) {
      setLoading(true);

      getTeamAnalResultApi({'match_code': initialMatchCode, 'team_code': teamCode, 'user_code' : user_code})
      .then((response) => {
        setQuarterData(response.data.result || [])
        // setSelectedMatch(initialMatchCode);
        setQuarter(response.data.result.length)
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    } else if(selectedMatch) {
      setLoading(true);

      getTeamAnalResultApi({'match_code': selectedMatch, 'team_code': teamCode, 'user_code' : user_code})
      .then((response) => {
        setQuarterData(response.data.result || [])
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    }
    }, [selectedMatch]);

    if (loading) {
      return <Loading />; 
    }
    const quarterPositionData = () => {
      for (let i = 0; i < quarterData?.length; i++) {
        if (activeTab === `${i + 1}쿼터`) {
          return quarterData[i];
        }
      }
      return null; 
    };

  return (
    <div className='personalanal'>
      <div className='greybackground'>
        <Back_btn />
        <Login_title title="팀 상세 분석" explain={"경기 데이터를 기반으로 설정된 \n현재 팀의 수준을 파악하고 더 발전해보세요"} />
        <HorizontalSwiper matchCode={initialMatchCode} onSelectMatch={setSelectedMatch}/>
      </div>
      
      <Quarter_Tab quarterData={quarterData} activeTab={activeTab} setActiveTab={setActiveTab}/>
      
      <DynamicQuarter data={quarterPositionData()} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} type='team'/>
      
    </div>
  );
};

export default TeamAnalysis;