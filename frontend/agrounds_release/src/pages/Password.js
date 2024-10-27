import React from 'react';
import './Password.scss';
import BackBtn from '../components/Back_btn';
import LoginInput from '../components/Login_input';
import LoginTitle from '../components/Login_title';
import CircleBtn from '../components/Circle_common_btn';
import { useNavigate } from 'react-router-dom';

const Password = () => {
  const navigate = useNavigate();
  return (
    <div className='passwordBG'>
      <BackBtn />
      <LoginTitle title="비밀번호 입력" explain="비밀번호를 입력하고 로그인을 계속하세요."/>
      <LoginInput placeholder='비밀번호 입력' type='password'/>
      <div className='lostpw' onClick={() => navigate('/findpassword')}>비밀번호를 잊어버리셨나요?</div>
      <CircleBtn title="다음"/>
    </div>
  );
};

export default Password;