import React from 'react';
import '../css/Video.scss';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import Footer from '../../../components/Footer';
import { useNavigate } from 'react-router-dom';
const Video = () => {
  const navigate = useNavigate();
  return (
    <div className='video'>
      <LogoBellNav />
      <p className='videotitle'>경기 영상</p>
      <div className='contents' >
        <div className='contentbox' onClick={() => navigate('/personalvideo')}>
          <div className='content'></div>
          <p className='contenttitle'>Player Cam</p>
          <p className='contentnumber'>142개의 영상</p>
        </div>
        <div className='contentbox' onClick={() => navigate('/teamvideo')}>
          <div className='content'></div>
          <p className='contenttitle'>Team Cam</p>
          <p className='contentnumber'>142개의 영상</p>
        </div>
        <div className='contentbox' onClick={() => navigate('/fullvideo')}>
          <div className='content'></div>
          <p className='contenttitle'>Full Cam</p>
          <p className='contentnumber'>142개의 영상</p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Video;