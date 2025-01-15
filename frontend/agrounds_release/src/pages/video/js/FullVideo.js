import React, { useEffect, useState } from 'react';
import '../css/FullVideo.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Video_Thumnail from '../../../components/Video_Thumnail';
import { getFullVideoListApi } from '../../../function/MatchApi';
import Sort from '../../../components/Sort';

const FullVideo = () => {
  const [videoList, setVideoList] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest'); 

  useEffect(() => {

    getFullVideoListApi({"user_code" : sessionStorage.getItem('userCode')})
    .then((response) => {
      setVideoList(response.data.result || []);
    })
    .catch(error => console.log(error));

  }, [])

  const getSortedVideos = () => {
    return [...videoList].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date) - new Date(a.date); // 최신순
      } else {
        return new Date(a.date) - new Date(b.date); // 오래된 순
      }
    });
  };

  const sortedVideos = getSortedVideos();

  return (
    <div className='fullvideo'>
      <Back_btn />
      <Login_title title="풀 경기영상" explain="경기장 전체를 한 눈에 확인해보세요"/>
      <div className='line'/>
      <div className='sortvideo'>
        <div className='totalnum'>총 <p>{sortedVideos.length}개</p>의 동영상</div>
        <Sort sortOrder={sortOrder} setSortOrder={setSortOrder} back='white'/>
      </div>
      {sortedVideos.length === 0 ? (
        <p className='nomatchvideo'>경기영상이 없습니다.</p>
      ) : (
        sortedVideos.map((list) => (
          <Video_Thumnail list={list} type="full"/>
        ))
      )}
    </div>
  );
};

export default FullVideo;