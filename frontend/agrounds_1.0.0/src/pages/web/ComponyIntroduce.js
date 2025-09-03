import React, { useState } from 'react';
import Header from '../../components/web/Header';
import Footer from '../../components/web/Footer';
import Main from '../../components/web/Main';
import Service from '../../components/web/Service';
import CompanyIntroduction from '../../components/web/CompanyIntroduction';
import styled from 'styled-components';

const ComponyIntroduce = () => {
  const [tab, setTab] = useState('home');

  const contents = () => {
    if (tab === 'companyI'){
      return <CompanyIntroduction />
    } else if(tab === 'service'){
      return <Service />
    } else if(tab === 'home'){
      return <Main />
    }
  }
  return (
    <CISTyle>
      <Header tab={tab} setTab={setTab}/>
      {contents()}
      <Footer />
    </CISTyle>
  );
};

export default ComponyIntroduce;

const CISTyle = styled.div`
  width: 100vw;
  overflow: hidden;
  margin: 0;
  
`