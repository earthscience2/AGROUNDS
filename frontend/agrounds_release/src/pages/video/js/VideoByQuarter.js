import React, {useState} from 'react';
import '../css/VideoByQuarter.scss';
import left from '../../../assets/left.png';
import upload from '../../../assets/upload.png';
import save from '../../../assets/save.png';
import { useNavigate } from 'react-router-dom';

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
          <div className='btn'>
            <img src={save} />
          </div>
          <div className='btn'>
            <img src={upload} />
          </div>
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
      <p>영상은 업로드 날짜를 기준으로 15일 뒤 자동으로 삭제됩니다.</p>
    </div>
  );
};

export default VideoByQuarter;