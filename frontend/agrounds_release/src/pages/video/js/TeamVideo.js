import React, { useEffect, useState } from 'react';
import '../css/TeamVideo.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Video_Thumnail from '../../../components/Video_Thumnail';
import { getTeamVideoListApi } from '../../../function/MatchApi';

const TeamVideo = () => {

  const [videoList, setVideoList] = useState([]);

  useEffect(() => {

    getTeamVideoListApi({"user_code" : sessionStorage.getItem('userCode')})
    .then((response) => {
      setVideoList(response.data.result || []);
      console.log(response.data.result)
    })
    .catch(error => console.log(error));

  }, [])

  return (
    <div className='teamvideo'>
      <Back_btn />
      <Login_title title="팀 경기영상" explain="팀의 움직임을 중심으로 경기 흐름을 파악해보세요"/>
      <div className='line'/>
      <div className='totalnum'>총 <p>{videoList.length}개</p>의 동영상</div>
      {videoList.map((list) => (
        <Video_Thumnail list={list}/>
      ))}

    </div>
  );
};

export default TeamVideo;