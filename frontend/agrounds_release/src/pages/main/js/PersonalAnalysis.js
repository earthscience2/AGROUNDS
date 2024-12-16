import React, { useState, useEffect } from 'react';
import '../css/PersonalAnalysis.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Quarter_Tab from '../../../components/Quarter_Tab';
import HorizontalSwiper from '../../../components/HorizontalSwiper';
import Loading from '../../../components/Loading';
import DynamicQuarter from '../../../components/DynamicQuarter';
import Summary from '../../../components/Summary';
import { useLocation } from 'react-router-dom';
import { getAnalyzeResultApi } from '../../../function/MatchApi';

const PersonalAnalysis = () => {
  const [quarterData, setQuarterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = []

  const location = useLocation();

  const matchCode = location.state?.matchCode;
  const userCode = sessionStorage.getItem('userCode');
  const [activeTab, setActiveTab] = useState("summary");
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    getAnalyzeResultApi({'match_code': matchCode, 'user_code': userCode})
    .then((response) => {
      setQuarterData(response.data.analyze || [])
      setSummary(response.data.ai_summation || [])
      console.log(response.data.analyze)
    })
  }, []);

  // if (loading) {
  //   return <Loading />; 
  // }

  console.log(currentIndex)

  const positionData = () => {
    if (currentIndex === 0) {
      return summary.total;
    } else if (currentIndex === 1) {
      return summary.attack;
    } else if (currentIndex === 2) {
      return summary.defense;
    }
  }

  const quarterPositionData = () => {
    for (let i = 0; i < quarterData?.length; i++) {
      if (activeTab === `${i + 1}쿼터`) {
        return quarterData[i];
      }
    }
    return null; 
  };

  console.log(quarterPositionData())
  return (
    <div className='personalanal'>
      <div className='greybackground'>
        <Back_btn />
        <Login_title title="개인 상세 분석" explain="경기 데이터를 기반으로 설정된 현재 나의 능력치를 확인하고 더 발전해보세요" />
        <HorizontalSwiper items={items}/>
      </div>

      <Quarter_Tab quarters={quarterData?.length} activeTab={activeTab} setActiveTab={setActiveTab}/>
      {activeTab === "summary" ? (
        <Summary data={positionData()} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
      ) : (
        <DynamicQuarter data={quarterPositionData()} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
      )}
    </div>
  );
};

export default PersonalAnalysis;