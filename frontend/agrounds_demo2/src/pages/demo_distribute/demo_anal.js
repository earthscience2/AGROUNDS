import React from 'react';
import Nav from '../../components/display/Nav';
import Quarter from '../../components/display/Quarter';
import client from '../../clients';
import {useState, useEffect} from 'react'
import Summary from '../../components/demo/Summary';
import DynamicQuarter from '../../components/demo/DynamicQuater';
import styled from 'styled-components';
import Position from '../../components/display/Position';


const Demo_anal = () => {
  const [activeTab, setActiveTab] = useState('요약');
  const [activePosition, setActivePosition] = useState('전체');
  const [quarterCount, setQuarterCount] = useState(3); 

  const data = {
    match_code: sessionStorage.getItem('match_code'),
  };

  useEffect(() => {
    client.post('/api/test_page/get-quarter-number/', data)
    .then((response) => {
      setQuarterCount(response.data.quarter);
    })
    .catch((error) => {
      console.log(error)
    })
    },[])
    const contents = () => {
      if (activeTab === '요약') {
        return <Summary activePosition={activePosition} />;
      }
  
      const quarterNumber = parseInt(activeTab.replace('쿼터', ''), 10);
      if (!isNaN(quarterNumber)) {
        return <DynamicQuarter activePosition={activePosition} quarter={quarterNumber} />;
      }
  
      return null;
    };
  return (
    <DemoStyle>
      <Nav arrow='true' />
      <Quarter summary='true' activeTab={activeTab} setActiveTab={setActiveTab} quarterCount={quarterCount}/>
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