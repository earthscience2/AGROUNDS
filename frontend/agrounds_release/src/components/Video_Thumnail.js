import React from 'react';
import './Video_Thumnail.scss';
import { useNavigate } from 'react-router-dom';

const Video_Thumnail = () => {
  const navigate = useNavigate();
  return (
    <div className='video-thumnail' onClick={() => navigate('/videobyquarter')}>
      <div className='imgbox'></div>
      <div className='infobox'>
        <p className='fc'>인하대학교 FC</p>
        <p className='date'>2024.11.10(수)</p>
      </div>
    </div>
  );
};

export default Video_Thumnail;