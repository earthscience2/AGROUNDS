import React from 'react';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import MainSummary from '../../../components/Main_Summary';
import '../css/Main.scss';
import Footer from '../../../components/Footer';

const Main = () => {
  return (
    <div className='main'>
      <LogoBellNav />
      <MainSummary/>
      <Footer />
    </div>
  );
};

export default Main;