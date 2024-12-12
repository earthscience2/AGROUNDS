import React, {useState} from 'react';
import '../css/VideoByQuarter.scss';
import left from '../../../assets/left.png';
import download from '../../../assets/download.png';
import share from '../../../assets/share.png';
import { useNavigate } from 'react-router-dom';
import notice from '../../../assets/exclamation-circle.png';
import Video_Thumnail from '../../../components/Video_Thumnail';

const VideoByQuarter = ({quarters=[1,2,3]}) => {
  
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('quarter1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className='videobyquarter'>
      <div className='header'>
        <img src={left} style={{width: '25px'}} onClick={() => navigate(-1)}/>
        <div className='centerinfo'>
          <p className='fc'>인하대학교 FC</p>
          <p className='date'>2024.09.22(화)</p>
        </div>
        <div className='rightbuttons'>
            <img className='download'src={download} />
            <img className='share' src={share} />
        </div>
      </div>
      <div className="quarter-tabs">
        <div className="tabs">
          {quarters.map((quarter, index) => (
            <button
              key={index}
              className={`tab ${activeTab === `quarter${index + 1}` ? "active" : ""}`}
              onClick={() => handleTabClick(`quarter${index + 1}`)}
            >
              {quarter}쿼터
            </button>
          ))}
        </div>
      </div>
      <div className='video'>

      </div>
      <div className='notice'><img src={notice} />영상은 업로드 날짜를 기준으로 15일 뒤 자동으로 삭제됩니다.</div>
      <div className='noticetitle'>
        <p className='titleplace'>인하대학교 대운동장</p>
        <p className='titletime'>2024.11.30(수) 13:00시</p>
      </div>
      <div className='greygap'></div>
      <div className='otherplay'>
        <p className='title'>같은 장소의 다른 경기</p>
        <Video_Thumnail />
        <Video_Thumnail />
        <Video_Thumnail />
        <Video_Thumnail />
      </div>
    </div>
  );
};

export default VideoByQuarter;