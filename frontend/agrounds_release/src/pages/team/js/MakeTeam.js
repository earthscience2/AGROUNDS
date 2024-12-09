import React from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Login_input from '../../../components/Login_input';
import Circle_common_btn from '../../../components/Circle_common_btn';
import '../css/MakeTeam.scss';
import UserProfile from '../../../components/UserProfile';
import { useNavigate } from 'react-router-dom';

const MakeTeam = () => {
  const navigate = useNavigate();
  return (
    <div className='maketeam'>
      <Back_btn />
      <Login_title title='팀 생성하기' explain='나만의 팀을 만들어보세요'/>
      <UserProfile />
      <Login_input placeholder='팀 이름 입력' type='text' borderRadius='15px'/>
      <div className='tab'/>
      <Circle_common_btn title='팀 생성하기' onClick={() => navigate('/completemaketeam')}/>
    </div>
  );
};

export default MakeTeam;