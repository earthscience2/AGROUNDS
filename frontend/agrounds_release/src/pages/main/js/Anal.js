import React from 'react';
import '../css/Anal.scss';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import TotalAnal from '../../../components/TotalAnal';
import Personal_Team_Tab from '../../../components/Personal_Team_Tab';
import Footer from '../../../components/Footer';
import logo1 from '../../../assets/logo_sample.png';

const data = {
  date: '2024.10.10 (토)',
  logo1: {logo1},
  logo2: {logo1},
  place: '인하대학교 대운동장',
  fc: '인하대학교 FC',
  playtime: '20',
  move: '1.89',
  speed: '1.89',
  score: '77'
}
const Anal = () => {
  return (
    <div className='anal'>
      <LogoBellNav />
      <div className='anal-box'>
        <p className='anal-title'>경기 분석</p>
        <Personal_Team_Tab />
      </div>
      <div className='line'></div>
      <div className='total-play'>총 <p> 3개</p>의 경기</div>
      <TotalAnal data={data}/>
      <TotalAnal data={data}/>
      <TotalAnal data={data}/>
      <div className='gap'></div>
      <Footer />
    </div>
  );
};

export default Anal;