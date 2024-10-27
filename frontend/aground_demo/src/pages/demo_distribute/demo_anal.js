import React from 'react';
import Nav from '../../components/display/Nav';
import Quarter from '../../components/display/Quarter';

import {useState} from 'react'
import Summary from '../../components/demo/Summary';
import Quarter1 from '../../components/demo/Quarter1';
import Quarter2 from '../../components/demo/Quarter2';
import Quarter3 from '../../components/demo/Quarter3';


const Demo_anal = () => {
  const [activeTab, setActiveTab] = useState('요약');

  const contents = () => {
    switch (activeTab) {
      case '요약':
        return <Summary />
      case '1쿼터':
        return <Quarter1 />
      case '2쿼터':
      return <Quarter2 />
      case '3쿼터':
      return <Quarter3 />
    }
  }
  return (
    <div>
      <Nav arrow={true} />
      <Quarter activeTab={activeTab} setActiveTab={setActiveTab}/>
      {contents()}
    </div>

  );
};

export default Demo_anal;