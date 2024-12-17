import React, {useEffect, useState} from 'react';
import '../css/VideoByQuarter.scss';
import left from '../../../assets/left.png';
import download from '../../../assets/download.png';
import share from '../../../assets/share.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import notice from '../../../assets/exclamation-circle.png';
import Video_Thumnail from '../../../components/Video_Thumnail';
import { getMatchVideoInfoApi } from '../../../function/MatchApi';
import VideoPlayer from '../../../components/VideoPlayer';

const VideoByQuarter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState([]);
  const [activeTab, setActiveTab] = useState('1쿼터');

  const matchCode = location.state?.matchCode || "";
  const userCode = sessionStorage.getItem('userCode');
  const type = location.state.type || "";
  
  const handleShare = async (linkD) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '영상 공유',
          text: `${activeTab} 영상을 공유합니다.`,
          url: linkD,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };
  
  const data = {
    'match_code' : matchCode,
    'user_code' : userCode,
    'type': type
  }
  useEffect(() => {
    getMatchVideoInfoApi(data)
    .then((response) => {
      setVideoData(response.data.result || [])
      if (response.data.result && response.data.result.length > 0) {
        setActiveTab('1쿼터'); 
      }
    })
    .catch((error) => console.log(error));
  }, [])
  console.log(videoData)

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className='videobyquarter'>
      <div className='header'>
        <img src={left} style={{width: '25px'}} onClick={() => navigate(-1)}/>
        <div className='centerinfo'>

          <p className='fc'>{videoData[0]?.title || '경기제목 없음'}</p>
          <p className='date'>{videoData[0]?.date || '날짜 미정'}</p>
        </div>
        <div className='rightbuttons'>
          {videoData
          .filter((_, index) => activeTab === `${index + 1}쿼터`)
          .map((video) => (
            <>
              <Link to={video.download_link} target='_blank'>
                <img className='download'src={download} />
              </Link>
              <img className='share' src={share} onClick={() => handleShare(video.download_link)}/>
            </>  
          ))}
        </div>
      </div>
      <div className="quarter-tabs">
        <div className="tabs">
            {videoData.map((quarter, index) => (
              <button
                key={index}
                className={`tab ${activeTab === `${index + 1}쿼터` ? "active" : ""}`}
                onClick={() => handleTabClick(`${index + 1}쿼터`)}
              >
                {index+1}쿼터
              </button>
            ))}
        </div>
      </div>
      {videoData
        .filter((_, index) => activeTab === `${index + 1}쿼터`)
        .map((video) => (
          <div className='video' key={video.video_code}>
            <VideoPlayer url={video.link} />
          </div>
        ))
      }
     
      <div className='notice'><img src={notice} />영상은 업로드 날짜를 기준으로 15일 뒤 자동으로 삭제됩니다.</div>
      <div className='noticetitle'>
        <p className='titleplace'>{videoData[0]?.match_location || '경기장소 없음'}</p>
        <p className='titletime'>{videoData[0]?.date || '날짜 미정'}</p>
      </div>
      <div className='greygap'></div>
      <div className='otherplay'>
        <p className='title'>같은 장소의 다른 경기</p>
        <p>-</p>
        {/* <Video_Thumnail /> */}
      </div>
    </div>
  );
};

export default VideoByQuarter;