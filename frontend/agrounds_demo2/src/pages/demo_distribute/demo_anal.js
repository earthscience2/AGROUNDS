import React from 'react';
import Nav from '../../components/display/Nav';
import Quarter from '../../components/display/Quarter';

import {useState} from 'react'
import Summary from '../../components/demo/Summary';
import Quarter1 from '../../components/demo/Quarter1';
import Quarter2 from '../../components/demo/Quarter2';
import Quarter3 from '../../components/demo/Quarter3';
import styled from 'styled-components';
import Position from '../../components/display/Position';


const Demo_anal = () => {
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
    <DemoStyle>
      <Nav arrow='true' />
      <Quarter activeTab={activeTab} setActiveTab={setActiveTab}/>
      <Position 
        activePosition={activePosition} 
        setActivePosition={setActivePosition} 
        replay={activeTab !== '요약'} 
      />
      {contents()}
    </DemoStyle>

  );
};

export default Demo_anal;

const DemoStyle = styled.div`

`