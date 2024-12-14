import React from 'react';
import './Main_Summary.scss';
import { useNavigate } from 'react-router-dom';
import AgeConversion from '../function/AgeConversion';
import { PositionColor } from '../function/PositionColor';

const MainSummary = () => {
  const navigate = useNavigate();
  const position = sessionStorage.getItem('userPosition') || 'LWF';
  // const InfoCardData = {
  //   nickname : sessionStorage.getItem('userNickname'),
  //   name : sessionStorage.getItem('userName'),
  //   height : sessionStorage.getItem('userHeight'),
  //   weight : sessionStorage.getItem('userWeight'),
  //   position : sessionStorage.getItem('userPosition'),
  //   play: '',
  //   fc : sessionStorage.getItem('teamName'),
  // }

  return (
    <div className='mainsummary'>
      <div className='infobox' onClick={() => navigate('/userinfo', {state: {position: position}})}>
        <div className='info'>
          <p className='age'>만 {AgeConversion(sessionStorage.getItem('userBirth'))}세</p>
          <p className='name'>{sessionStorage.getItem('userName')}</p>
        </div>
        <div className='position' style={{background: PositionColor[position]}}>{sessionStorage.getItem('userPosition')}</div>
      </div>
      <div className='playbox'>
        <p className='datetitle'>최근 경기일</p>
        <div className='bottombox'>
          <p className='date'>2024.08.20</p>
          <p className='detail'>자세히 보기</p>
        </div>
      </div>
    </div>
  );
};

export default MainSummary;