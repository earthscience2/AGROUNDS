import React from 'react';
import '../css/ChangeTeamName.scss'
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Login_input from '../../../components/Login_input';
import Circle_common_btn from '../../../components/Circle_common_btn';

const ChangeTeamName = () => {
  return (
    <div className='changeteamname'>
      <Back_btn />
      <Login_title title='팀명 변경하기' explain='팀명을 원하는 이름으로 변경해보세요.'/>
      <Login_input placeholder='팀 이름 입력' type='text'/>
      <div className='gap'></div>
      <Circle_common_btn title='변경하기' /> 
    </div>
  );
};

export default ChangeTeamName;