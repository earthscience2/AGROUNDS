import React from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import HorizontalSwiper from '../../../components/HorizontalSwiper';
import Quarter_Tab from '../../../components/Quarter_Tab';
import Summary from '../../../components/Summary';
import DynamicQuarter from '../../../components/DynamicQuarter';

const TeamAnalysis = () => {
  return (
    <div className='personalanal'>
      <div className='greybackground'>
        <Back_btn />
        <Login_title title="팀 상세 분석" explain="경기 데이터를 기반으로 설정된 현재 팀의 수준을 파악하고 더 발전해보세요" />
        <HorizontalSwiper />
      </div>
      
      <Quarter_Tab quarters={[1,2,3]}/>
      <Summary />
      <DynamicQuarter />
    </div>
  );
};

export default TeamAnalysis;