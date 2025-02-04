import React, { useEffect, useState } from 'react';
import '../css/Video.scss';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import Footer from '../../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { getVideoSummationApi } from '../../../function/MatchApi';
import list from '../../../assets/playlist.png';

const Video = () => {
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState({});

  useEffect(() => {
    getVideoSummationApi({ "user_code": sessionStorage.getItem('userCode') })
      .then((response) => {
        setVideoData(response.data);
        console.log(response.data)
      })
      .catch((error) => console.log(error));
  }, []);

  // ThumbnailStack 컴포넌트
  const ThumbnailStack = ({ thumbnails = [] }) => {
    const placeholders = Array.from({ length: 3 - thumbnails.length }, () => null);
    const displayThumbnails = [...thumbnails.slice(0, 3), ...placeholders];

    return (
      <div className="thumbnail-stack">
        {displayThumbnails.map((thumbnail, index) => (
          <div
            key={index}
            className={`thumbnail-layer ${thumbnail ? "image" : "placeholder"}`}
            style={{
              backgroundImage: thumbnail ? `url(${thumbnail})` : "none",
            }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className='videoback'>
      <LogoBellNav />
      <p className='videotitle'>경기 영상</p>
      <div className='contents'>
        <div className='contentbox' onClick={() => navigate('/app/personalvideo')}>
          <ThumbnailStack thumbnails={videoData.player_cam?.thumbnail || []} />
          <p className='contenttitle'>개인 영상</p>
          <p className='contentnumber'>{videoData.player_cam?.number_of_videos || 0}개의 영상</p>
        </div>

        <div className='contentbox' onClick={() => navigate('/app/teamvideo')}>
          <ThumbnailStack thumbnails={videoData.team_cam?.thumbnail || []} />
          <p className='contenttitle'>팀 영상</p>
          <p className='contentnumber'>{videoData.team_cam?.number_of_videos || 0}개의 영상</p>
        </div>

        <div className='contentbox' onClick={() => navigate('/app/fullvideo')}>
          <ThumbnailStack thumbnails={videoData.full_cam?.thumbnail || []} />
          <p className='contenttitle'>원본 영상</p>
          <p className='contentnumber'>{videoData.full_cam?.number_of_videos || 0}개의 영상</p>
        </div>

        <div className='contentbox' onClick={() => navigate('/app/hightlightvideo')}>
          <div className='content4'>
            <img src={list} alt="Highlight" />
          </div>
          <p className='contenttitle'>하이라이트</p>
          <p className='contentnumber'>{videoData.highlight_cam?.number_of_videos || 0}개의 영상</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Video;
