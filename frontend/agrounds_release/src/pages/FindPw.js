import React from 'react';
import './Password.scss';
import BackBtn from '../components/Back_btn';
import LoginInput from '../components/Login_input';
import LoginTitle from '../components/Login_title';
import CircleBtn from '../components/Circle_common_btn';

const FindPw = () => {
  return (
    <div className='passwordBG'>
      <BackBtn />
      <LoginTitle title="비밀번호 찾기" explain="회원가입 시 입력한 이메일을 입력하세요."/>
      <LoginInput placeholder='이메일주소 입력' type='email'/>
      <div className='blank'></div>
      <CircleBtn title="다음"/>
    </div>
  );
};

export default FindPw;