import React from 'react';
import illCheck from '../../../assets/ill_check.png';
import CircleBtn from '../../../components/Circle_common_btn';
import BackBtn from '../../../components/Back_btn';
import LoginTitle from '../../../components/Login_title';
import '../css/CompleteSignup.scss';
import { useNavigate } from 'react-router-dom';

const CompleteSignup = () => {
  const navigate = useNavigate();
  return (
    <div className='completeBG'>
      <BackBtn />
      <LoginTitle title="가입 완료" explain="전술분석 플랫폼 AGROUNDS와 함께 축구를 즐기세요!"/>
      <img src={illCheck} className='IllCheck'/>
      <CircleBtn backgroundColor="#F2F4F8" color="#4D5358" title="개인으로 시작하기" 
        onClick={()=>window.location.replace(process.env.REACT_APP_BASE_URL + "/api/login/kakao/")}/>
      <div className='blank'></div>
      <CircleBtn backgroundColor="#F2F4F8" color="#4D5358" title="팀 생성하기"/>
      <div className='divider'>기존에 있는 팀에 선수 등록을 하고 싶다면</div>
      <CircleBtn backgroundColor="#262626" title="팀 가입하기"/>
    </div>
  );
};

export default CompleteSignup;