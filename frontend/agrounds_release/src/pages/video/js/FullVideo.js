import React from 'react';
import '../css/FullVideo.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Video_Thumnail from '../../../components/Video_Thumnail';

const FullVideo = () => {
  return (
    <div className='fullvideo'>
      <Back_btn />
      <Login_title title="풀 경기영상" explain="경기장 전체를 한 눈에 확인해보세요"/>
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

export default FullVideo;