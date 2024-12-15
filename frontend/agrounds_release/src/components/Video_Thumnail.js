import React from 'react';
import './Video_Thumnail.scss';
import { useNavigate } from 'react-router-dom';

const Video_Thumnail = ({list}) => {
  const navigate = useNavigate();

  const matchCode = list?.matchCode || "";
  return (
    <div className='video-thumnail' onClick={() => navigate('/videobyquarter', { state : { matchCode }})}>
      <div className='imgbox'>
        <img src={list?.thumbnail}/>
      </div>
      <div className='infobox'>
        <p className='fc'>{list?.title}</p>
        <p className='date'>{list?.date}</p>
      </div>
    </div>
  );
};

export default Video_Thumnail;