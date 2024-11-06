import React, { Children, useState } from 'react';
import Nav from '../../components/display/Nav';
import styled from 'styled-components';
import Quarter from '../../components/display/Quarter';
import Position from '../../components/display/Position';
import Summary from '../../components/display/Summary';
import Quarter1 from '../../components/display/Quarter1';
import Quarter2 from '../../components/display/Quarter2';
import Quarter3 from '../../components/display/Quarter3';

const GameAnalysis = () => {
  const [activeTab, setActiveTab] = useState('요약');
  const [activePosition, setActivePosition] = useState('전체');
  
  const contents = () => {
    switch (activeTab) {
      case '요약':
        return <Summary activePosition={activePosition}/>
      case '1쿼터':
        return <Quarter1 activePosition={activePosition}/>
      case '2쿼터':
      return <Quarter2 activePosition={activePosition}/>
      case '3쿼터':
      return <Quarter3 activePosition={activePosition}/>
    }
  }
  return (
    <GameAnalysisStyle>
      <Nav arrow='true'/>
      <Quarter summary='true' activeTab={activeTab} setActiveTab={setActiveTab}/>
      <Position 
        activePosition={activePosition} 
        setActivePosition={setActivePosition} 
        replay={activeTab !== '요약'} 
      />
      {contents()}

    </GameAnalysisStyle>
  );
};

export default GameAnalysis;

const GameAnalysisStyle = styled.div`

`