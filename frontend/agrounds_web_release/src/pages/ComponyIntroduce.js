import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Main from '../components/Main';
import Service from '../components/Service';
import CompanyIntroduction from '../components/CompanyIntroduction';


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
    <div>
      <Header tab={tab} setTab={setTab}/>
      {contents()}
      <Footer />
    </div>
  );
};

export default ComponyIntroduce;