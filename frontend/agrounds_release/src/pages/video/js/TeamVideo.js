import React from 'react';
import '../css/TeamVideo.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Video_Thumnail from '../../../components/Video_Thumnail';

const TeamVideo = () => {
  return (
    <div className='teamvideo'>
      <Back_btn />
      <Login_title title="팀 경기영상" explain="팀의 움직임을 중심으로 경기 흐름을 파악해보세요"/>
      <div className='line'/>
      <div className='totalnum'>총 <p>142개</p>의 동영상</div>
      <Video_Thumnail />
      <Video_Thumnail />
      <Video_Thumnail />
      <Video_Thumnail />
      <Video_Thumnail />
      <Video_Thumnail />
      <Video_Thumnail />
      <Video_Thumnail />
    </div>
  );
};

export default TeamVideo;