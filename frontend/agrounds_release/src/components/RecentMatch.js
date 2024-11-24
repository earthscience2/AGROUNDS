import React from 'react';
import './RecentMatch.scss';
import location from '../assets/location.png';
import logo from '../assets/logo_sample.png';

const RecentMatch = () => {
  return (
    <div className='recentmatch'>
      <div className='detail'>
        <p className='title'>최근 경기</p>
        <div className='place'><img src={location} />인하대학교 운동장</div>
        <p className='fc'>인하대학교 FC</p>
        <p className='date'>09.10(토)</p>
      </div>
      <div className='logo'>
        <div className='imgbox'><img className='img' src={logo} /></div>
        <div className='imgbox2'><img className='img' src={logo} /></div>
      </div>
    </div>
  );
};

export default RecentMatch;