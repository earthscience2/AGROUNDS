import React from 'react';
import '../css/PersonalVideo.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Video_Thumnail from '../../../components/Video_Thumnail';

const PersonalVideo = () => {
  return (
    <div className='personalvideo'>
      <Back_btn />
      <Login_title title="개인 경기영상" explain="나의 움직임을 파악해 정확한 분석을 해보세요"/>
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

export default PersonalVideo;