import React from 'react';
import Anal_Detail from './Anal_Detail';
import Anal_Position_Nav from './Anal_Position_Nav';
import RayderChart from './RayderChart';
import { Sprint, ActivityLevel, Speed, Map } from '../function/AnalysisData';
import TeamAnalTotal from './TeamAnalTotal';
import TeamAnalScore from './TeamAnalScore';
import styled from 'styled-components';

const DynamicQuarter = ({ data, currentIndex, setCurrentIndex, type }) => {
  if (!data) return null; 

  const renderPersonalContent = () => {
    const attack = data.active_ratio?.A_TPT || 0;
    const defence = data.active_ratio?.D_TPT || 0;

    const rate = data.point?.total || 0;

    const chartPoints = [
      data.point?.total || 0,
      data.point?.sprint || 0,
      data.point?.acceleration || 0,
      data.point?.speed || 0,
      data.point?.positiveness || 0,
      data.point?.stamina || 0,
    ];

    const positionData = () => {
      if (currentIndex === 0) {
        return data.total;
      } else if (currentIndex === 1) {
        return data.attack;
      } else if (currentIndex === 2) {
        return data.defense;
      }
      return null;
    };

    return (
      <PersonalAnalStyle>
        <div />
        <RaderDate>{chartPoints[0]}</RaderDate>
        <RayderChart data={chartPoints} rate={rate} />
        <Anal_Detail title="히트맵 / 스프린트 / 방향전환" detail={<Map data={positionData()} />} />
        <Anal_Detail title="활동량" detail={<ActivityLevel attack={attack} defence={defence} data={positionData()} />} />
        <Anal_Detail title="속도 및 가속도" detail={<Speed data={data} positionData={positionData()}/>} />
        <Anal_Detail title="스프린트" detail={<Sprint data={positionData()} />} />
      </PersonalAnalStyle>
    );
  };

  const renderTeamContent = () => {
    return <TeamAnalTotal data={data} />
  };
  console.log(data)
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {type === 'personal' ?  <Anal_Position_Nav currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} type={type} /> :  ''}
      
      {type === 'personal' ? renderPersonalContent() : renderTeamContent()}
      
    </div>
  );
};

export default DynamicQuarter;


const RaderDate = styled.div`
  font-size: 3vh;
  font-weight: 700;
  position: relative;
  top: 22.5vh;
  right: 1vh;
`

const PersonalAnalStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:last-child{
    margin-bottom: 5vh;
  }
`