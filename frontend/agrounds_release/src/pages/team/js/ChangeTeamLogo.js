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
      <Login_title title='팀 로고 변경하기' explain='팀 로고를 자유롭게 변경해보세요'/>
      <UserProfile />
      <div className='tab'/>
      <Circle_common_btn title='변경하기' onClick={() => navigate('/app/completechangelogo')}/>
    </div>
  );
};

export default MakeTeam;