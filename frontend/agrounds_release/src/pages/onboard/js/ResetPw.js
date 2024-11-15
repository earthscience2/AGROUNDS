import React from 'react';
import '../css/ResetPw.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Login_input from '../../../components/Login_input';
import CircleBtn from '../../../components/Circle_common_btn';

const ResetPw = () => {
  return (
    <div className='resetpwBG'>
      <Back_btn />
      <Login_title title='비밀번호 재설정' explain='등록하신 이메일의 비밀번호 재설정을 도와드릴게요.'/>
      <Login_input borderRadius='15px 15px 0 0' placeholder='새로운 비밀번호' type='password'/>
      <div style={{height: '.5vh'}}></div>
      <Login_input borderRadius='0 0 15px 15px' placeholder='새로운 비밀번호 재입력' type='password'/>
      <p className='errormessage'>영문, 숫자, 특수문자 중 2종류 이상을 조합하여 <br />최소 8자리 이상의 길이로 구성</p>
      <CircleBtn title="비밀번호 재설정"/>
    </div>
  );
};

export default ResetPw;