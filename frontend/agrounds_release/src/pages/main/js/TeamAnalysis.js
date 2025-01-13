import React, { useEffect, useState } from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import HorizontalSwiper from '../../../components/HorizontalSwiper';
import Quarter_Tab from '../../../components/Quarter_Tab';
import Summary from '../../../components/Summary';
import DynamicQuarter from '../../../components/DynamicQuarter';
import Loading from '../../../components/Loading';
import { useLocation } from 'react-router-dom';
import { getAnalyzeResultApi } from '../../../function/MatchApi';

const TeamAnalysis = () => {

  const location = useLocation();
  const initialMatchCode = location.state?.matchCode;
  const teamCode = sessionStorage.getItem('teamCode');
  const userCode = sessionStorage.getItem('userCode');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quarterData, setQuarterData]= useState([]);


  useEffect(() => {
    if (!selectedMatch && initialMatchCode) {
      setLoading(true);

      getAnalyzeResultApi({'match_code': initialMatchCode, 'user_code': userCode})
      .then((response) => {
        setSelectedMatch(initialMatchCode);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    } else if(selectedMatch) {
      setLoading(true);

      getAnalyzeResultApi({'match_code': selectedMatch, 'user_code': userCode})
      .then((response) => {
        setQuarterData(response.data.analyze || [])
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

  return (
    <div className='personalanal'>
      <div className='greybackground'>
        <Back_btn />
        <Login_title title="팀 상세 분석" explain="경기 데이터를 기반으로 설정된 현재 팀의 수준을 파악하고 더 발전해보세요" />
        <HorizontalSwiper matchCode={initialMatchCode} onSelectMatch={setSelectedMatch}/>
      </div>
      
      <Quarter_Tab quarters={[1,2,3]}/>
      <Summary />
      <DynamicQuarter />
    </div>
  );
};

export default TeamAnalysis;