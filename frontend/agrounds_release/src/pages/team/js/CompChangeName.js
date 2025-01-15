import React from 'react';
import '../css/CompMakeTeam.scss';
import Login_title from '../../../components/Login_title';
import Image_Comp from '../../../components/Image_Comp';
import check from '../../../assets/ill_check.png';
import Circle_common_btn from '../../../components/Circle_common_btn';
import { useNavigate } from 'react-router-dom';
import Back_btn from '../../../components/Back_btn';

const CompChangeName = () => {

  const navigate = useNavigate();
  return (
    <div className='compmaketeam'>
      <Back_btn />
      <Login_title title='팀명 변경 완료' explain='팀명 변경이 완료되었어요'/>
      <div className='tab1'/>
      <Image_Comp img={check} width= '22vh'/>
      <div className='tab2'/>
      <Circle_common_btn title='완료' onClick={() => navigate('/app/teamsetting')}/>
    </div>
  );
};

export default CompChangeName;