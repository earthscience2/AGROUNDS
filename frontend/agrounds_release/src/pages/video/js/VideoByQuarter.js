import React, {useEffect, useState} from 'react';
import '../css/VideoByQuarter.scss';
import left from '../../../assets/left.png';
import download from '../../../assets/download.png';
import share from '../../../assets/share.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getMatchVideoInfoApi } from '../../../function/MatchApi';
import VideoPlayer from '../../../components/VideoPlayer';
import Modal from '../../../components/Modal';
import styled from 'styled-components';
import Circle_common_btn from '../../../components/Circle_common_btn';


const VideoByQuarter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState([]);
  const [activeTab, setActiveTab] = useState('1쿼터');
  const [downloadTab, setDownloadTab] = useState('1쿼터');
  const [modal, setModal] = useState(false);

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
  
  const onClose = () => {
    setModal(false);
  }

  const onOpen = () => {
    setModal(true);
  }

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


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleRadioChange = (event) => {
    setDownloadTab(event.target.value);
  }

  const handleDownload = () => {
    const selectedVideo = videoData.find((_, index) => downloadTab === `${index + 1}쿼터`);
  
    if (selectedVideo && selectedVideo.download_link) {
      const link = document.createElement("a");
      link.href = selectedVideo.download_link;
      
      const fileName = `${videoData[0]?.title || "경기영상"}_${downloadTab}.mp4`;
  
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("선택한 쿼터의 영상 다운로드 링크가 없습니다.");
    }
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
              <img className='download'src={download} onClick={onOpen}/>
              <img className='share' src={share} onClick={() => handleShare(video.download_link)}/>
            </>  
          ))}
        </div>
      </div>
      {modal && (
        <Modal common='true' isOpen={modal} onClose={onClose}>
          <ModalStyle>
            <p className='title'>영상을 다운로드 하시겠습니까?</p>
            <p className='fcname'>{videoData[0]?.title}</p>
            <p className='matchdate'>{videoData[0]?.date}</p>
            <div className='select-video'>
              {videoData.map((quarter, index) => (
                <div className='video-box'>
                  <label key={index} className="radio-label">
                  <input
                      type="radio"
                      name="quarter"
                      value={`${index + 1}쿼터`}
                      checked={downloadTab === `${index + 1}쿼터`}
                      onChange={handleRadioChange}
                    />
                    {index + 1}쿼터
                  </label>
                </div>
              ))}
            </div>
            <div className='buttonbox'>
              <Circle_common_btn title='다운로드' onClick={handleDownload}/>
            </div>
          </ModalStyle>
        </Modal>
      )}
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
          <div className='video' style={{display:'flex', alignItems:'center'}} key={video.video_code}>
            <VideoPlayer url={video.link} height='190' width='340'/>
          </div>
        ))
      }
     
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

const ModalStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 10vh 0 3vh 0 ;
  font-family: 'Pretendard';
  .title{
    font-size: 2.3vh;
    font-weight: 700;
  }
  .fcname{
    font-size: 1.8vh;
    font-weight: 600;
    margin-bottom: 0;
  }
  .matchdate{
    font-size: 1.5vh;
    font-weight: 600;
    color: #A8A8A8;
    margin: 1vh 0 0 0;
  }
  .select-video{
    display: flex;
    flex-direction: row;
    justify-content: space-around !important;
    width: 90%;
    justify-content: center;
    margin-top: 10vh;
    .video-box{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .radio-label{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2vh;
        font-size: 2vh;
        font-weight: 700;
      }
      input[type="radio"] {
        appearance: none;
        width: 3vh;
        height: 3vh;
        border: 1px solid #A8A8A8;
        border-radius: 50%;
        position: relative;
        cursor: pointer;
      }

      input[type="radio"]:checked {
        border-color: #4caf50;
        background-color: #4caf50;
      }

      input[type="radio"]:checked::after {
        content: "";
        position: absolute;
        width: 1.5vh;
        height: 1.5vh;
        background: white;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .buttonbox{
    width: 100%;
    margin-top: 10vh;
  }
`