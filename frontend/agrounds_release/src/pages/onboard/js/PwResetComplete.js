import React from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import CirclBtn from '../../../components/Circle_common_btn';
import Lock from '../../../assets/lock.png';
import '../css/PwResetComplete.scss';

const PwResetComplete = () => {
  return (
    <div className='NotUserBG'>
      <Back_btn />
      <Login_title title="비밀번호 재설정 완료" explain="비밀번호 재설정을 완료했습니다. 다시 로그인해주세요."/>
      <img src={Lock} className='NoUserImg'/>
      <CirclBtn title="로그인"/>
    </div>
  );
};

export default PwResetComplete;