import React from 'react';
import Anal_Detail from './Anal_Detail';
import Anal_Position_Nav from './Anal_Position_Nav';
import RayderChart from './RayderChart';
import { Sprint, ActivityLevel, Speed, Map } from '../function/AnalysisData';
import TeamAnalTotal from './TeamAnalTotal';
import TeamAnalScore from './TeamAnalScore';

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
      <>
        <div style={{ marginBottom: '5vh' }} />
        <RayderChart data={chartPoints} rate={rate} />
        <Anal_Detail title="히트맵 / 고속히트맵 / 방향전환" detail={<Map data={positionData()} />} />
        <Anal_Detail title="활동량" detail={<ActivityLevel attack={attack} defence={defence} data={positionData()} />} />
        <Anal_Detail title="속도 및 가속도" detail={<Speed data={positionData()} />} />
        <Anal_Detail title="스프린트" detail={<Sprint data={positionData()} />} />
      </>
    );
  };

  const renderTeamContent = () => {
    const positionData = () => {
      if (currentIndex === 0){
        return (
         TeamAnalTotal()
        )
      } else {
        return (
          TeamAnalScore()
        )
      }
    }
    return (
      positionData()
    )
  };

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
      <Anal_Position_Nav currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} type={type} />
      {type === 'personal' ? renderPersonalContent() : renderTeamContent()}
    </div>
  );
};

export default DynamicQuarter;
