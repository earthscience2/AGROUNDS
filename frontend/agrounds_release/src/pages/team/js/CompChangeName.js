import React from 'react';
import '../css/CompMakeTeam.scss';
import Login_title from '../../../components/Login_title';
import Image_Comp from '../../../components/Image_Comp';
import img from '../../../assets/logo_sample.png';
import Circle_common_btn from '../../../components/Circle_common_btn';

const CompChangeName = () => {
  return (
    <div className='compmaketeam'>
      <div className='tab1' />
      <Login_title title='팀명 변경 완료' explain='팀명 변경이 완료되었어요'/>
      <Image_Comp img={img} width= '22vh'/>
      <div className='tab2'/>
      <Circle_common_btn title='완료'/>
    </div>
  );
};

export default CompChangeName;