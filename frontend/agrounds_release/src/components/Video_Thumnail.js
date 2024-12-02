import React from 'react';
import './Video_Thumnail.scss';

const Video_Thumnail = () => {
  return (
    <div className='video-thumnail'>
      <div className='imgbox'></div>
      <div className='infobox'>
        <p className='fc'>인하대학교 FC</p>
        <p className='date'>2024.11.10(수)</p>
      </div>
    </div>
  );
};

export default Video_Thumnail;