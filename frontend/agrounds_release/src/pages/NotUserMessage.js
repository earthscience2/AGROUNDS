import React from 'react';
import BackBtn from '../components/Back_btn';
import LoginTitle from '../components/Login_title';
import CircleBtn from '../components/Circle_common_btn';
import illNote from '../assets/ill_note.png';
import './NotUserMessage.scss';

const NotUserMessage = () => {
  return (
    <div className='NotUserBG'>
      <BackBtn />
      <LoginTitle title="등록된 정보가 없습니다" explain="입력하신 이메일로 가입한 내역이 없습니다."/>
      <img src={illNote} className='NoUserImg'/>
      <CircleBtn title="가입하기"/>
      <p className='GoBack'>돌아가기</p>
    </div>
  );
};

export default NotUserMessage;