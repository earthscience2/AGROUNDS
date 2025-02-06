import React, { useEffect, useState } from 'react';
import './Main_Summary.scss';
import { useNavigate } from 'react-router-dom';
import AgeConversion from '../function/AgeConversion';
import { PositionColor } from '../function/PositionColor';
import { getPlayerInfoApi } from '../function/TeamApi';
import blue from '../assets/Ellipse-blue.png';
import green from '../assets/Ellipse-green.png';
import red from '../assets/Ellipse-red.png';
import yellow from '../assets/Ellipse-yellow.png';


const MainSummary = () => {
  const navigate = useNavigate();
  const position = sessionStorage.getItem('userPosition') || 'LWF';
  const userCode = sessionStorage.getItem('userCode');
  
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getPlayerInfoApi({'user_code' : userCode})
    .then((response) => {
      setUserData(response.data)
    })
  }, [userCode])

  const ellipse = () => {
    if (position === 'LWF' || position === 'ST' || position === 'RWF') {
      return red;
    } else if (position === 'LWM' || position === 'CAM' || position === 'RWM' || position === 'LM' || position === 'CM' || position === 'RM'|| position === 'CDM') {
      return green;
    } else if (position === 'LWB' || position === 'RWB' || position === 'LB' || position === 'CB' || position === 'RB' ){
      return blue;
    } else {
      return yellow;
    }
  }

  return (
    <div className='mainsummary'>
      <div className='infobox' onClick={() => navigate('/app/userinfo', {state: {userCode: userCode}})}>
        <div className='info'>
          <p className='age'>만 {AgeConversion(sessionStorage.getItem('userBirth'))}세</p>
          <p className='name'>{sessionStorage.getItem('userName')}</p>
        </div>
        <div className='position'>
          <img className='ellipse' src={ellipse()} />
          <p className='position-tag'>{position}</p>
        </div>
      </div>
      <div className='playbox'>
        <p className='datetitle'>최근 경기일</p>
        <div className='bottombox'>
          <p className='date'>{userData.recent_match_date || '-'}</p>
          <p className='detail'>자세히보기</p>
        </div>
      </div>
    </div>
  );
};

export default MainSummary;