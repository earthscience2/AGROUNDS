import React, { useEffect, useState } from 'react';
import './Main_Summary.scss';
import { useNavigate } from 'react-router-dom';
import AgeConversion from '../function/AgeConversion';
import { PositionColor } from '../function/PositionColor';
import { getPlayerInfoApi } from '../function/TeamApi';

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
  })

  return (
    <div className='mainsummary'>
      <div className='infobox' onClick={() => navigate('/app/userinfo', {state: {userCode: userCode}})}>
        <div className='info'>
          <p className='age'>만 {AgeConversion(sessionStorage.getItem('userBirth'))}세</p>
          <p className='name'>{sessionStorage.getItem('userName')}</p>
        </div>
        <div className='position' style={{background: PositionColor[userData.user_position]}}>{sessionStorage.getItem('userPosition')}</div>
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