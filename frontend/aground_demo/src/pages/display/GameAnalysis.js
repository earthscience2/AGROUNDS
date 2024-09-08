import React, { useState } from 'react';
import Nav from '../../components/display/Nav';
import styled from 'styled-components';
import Quarter from '../../components/display/Quarter';

const GameAnalysis = () => {
  const [activeTab, setActiveTab] = useState('요약');
  return (
    <GameAnalysisStyle>
      <Nav arrow='true'/>
      <Quarter activeTab={activeTab} setActiveTab={setActiveTab}/>
      <div>
        <div>
          <div>전체</div>
          <div>공격</div>
          <div>수비</div>
        </div>
      </div>

    </GameAnalysisStyle>
  );
};

export default GameAnalysis;

const GameAnalysisStyle = styled.div`

`