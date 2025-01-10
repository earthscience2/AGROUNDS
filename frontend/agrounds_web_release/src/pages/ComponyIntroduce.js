import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Main from '../components/Main';
import Service from '../components/Service';
import CompanyIntroduction from '../components/CompanyIntroduction';


const ComponyIntroduce = () => {
  const [tab, setTab] = useState(null);

  const contents = () => {
    if (tab === 'companyI'){
      return <CompanyIntroduction />
    } else if(tab === 'service'){
      return <Service />
    } else {
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