import React from 'react';
import BackBtn from '../components/Back_btn';
import LoginTitle from '../components/Login_title';
import CircleBtn from '../components/Circle_common_btn';
import './Email.scss';
import LoginInput from '../components/Login_input';

const Email = () => {
  return (
    <div className='EmailBG'>
      <BackBtn />
      <LoginTitle title="이메일로 계속하기" explain="이메일로 로그인 또는 회원가입을 해보세요."/>
      <LoginInput placeholder='이메일 주소 입력' type='email'/>
      <div className='gap2'></div>
      <CircleBtn title="다음"/>
    </div>
  );
};

export default Email;