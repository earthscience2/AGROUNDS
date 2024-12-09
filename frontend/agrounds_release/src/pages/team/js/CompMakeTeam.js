import React from 'react';
import '../css/CompMakeTeam.scss';
import Login_title from '../../../components/Login_title';
import Image_Comp from '../../../components/Image_Comp';
import img from '../../../assets/logo_sample.png';
import Circle_common_btn from '../../../components/Circle_common_btn';

const CompMakeTeam = () => {
  return (
    <div className='compmaketeam'>
      <div className='tab1' />
      <Login_title title='팀 생성 완료' explain='새로운 팀원들을 모집하고 팀원들과 함께 축구를 즐겨보세요!'/>
      <Image_Comp img={img} width= '22vh'/>
      <div className='tab2'/>
      <Circle_common_btn title='팀 보러가기'/>
    </div>
  );
};

export default CompMakeTeam;