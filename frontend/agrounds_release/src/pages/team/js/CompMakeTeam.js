import React from 'react';
import '../css/CompMakeTeam.scss';
import Login_title from '../../../components/Login_title';
import Image_Comp from '../../../components/Image_Comp';
import check from '../../../assets/ill_check.png';
import Circle_common_btn from '../../../components/Circle_common_btn';
import Back_btn from '../../../components/Back_btn';
import { useNavigate } from 'react-router-dom';

const CompMakeTeam = () => {
  const navigate = useNavigate();

  return (
    <div className='compmaketeam'>
      <Back_btn />
      <Login_title title='팀 생성 완료' explain='새로운 팀원들을 모집하고 팀원들과 함께 축구를 즐겨보세요!'/>
      <div className='tab1'/>
      <Image_Comp img={check} width= '22vh'/>
      <div className='circletab'>
        <Circle_common_btn title='팀 보러가기' onClick={() => navigate('/myteam')}/>
      </div>
    </div>
  );
};

export default CompMakeTeam;