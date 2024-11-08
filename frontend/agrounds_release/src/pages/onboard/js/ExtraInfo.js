import React from 'react';
import '../css/ExtraInfo.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Login_input from '../../../components/Login_input';
import Circle_common_btn from '../../../components/Circle_common_btn';
import right from '../../../assets/right.png';
import { useNavigate } from 'react-router-dom';

const ExtraInfo = () => {
  const navigate = useNavigate();
  
  return (
    <div className='extraBG'>
      <Back_btn />
      <Login_title title='추가정보 입력' explain='분석을 위해 필요한 정보로 외부에 공개되지 않아요.' />
      <Login_input borderRadius='15px 15px 0 0' placeholder='몸무게' type='number'/>
      <div style={{height: '0.5vh'}}/>
      <Login_input borderRadius='0' placeholder='키' type='number'/>
      <div style={{height: '0.5vh'}}/>
      <div className='prefpo' onClick={() => navigate('/')}>
        <div>선호 포지션</div>
        <img src={right}/>
      </div>
      <Circle_common_btn title='다음'/>
    </div>
  );
};

export default ExtraInfo;