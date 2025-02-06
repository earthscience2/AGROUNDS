import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { extractDateInfo } from '../function/ Conversion';

const Video_Thumnail = ({list, type}) => {
  const navigate = useNavigate();

  const matchCode = list?.match_code || "";

  const dayOfWeek = list?.date
  ? extractDateInfo(list?.date).dayOfWeek.slice(0, 1)
  : '';
  return (
    <VideoThumnailStyle onClick={() => navigate('/app/videobyquarter', { state : { matchCode, type }})}>
      <div className='imgbox'>
        <img src={list?.thumbnail}/>
      </div>
      <div className='infobox'>
        <p className='fc'>{list?.title}</p>
        <p className='date'>{`${list?.date} (${dayOfWeek})` }</p>
      </div>
    </VideoThumnailStyle>
  );
};

export default Video_Thumnail;

const VideoThumnailStyle = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  gap: 2vh;
  margin: 2vh 0;
  .imgbox{
    width: 45%;
    height: 12vh;
    border-radius: 1vh;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .infobox{
    display: flex;
    width: 55%;
    flex-direction: column;
    .fc{
      font-size: 1.8vh;
      font-weight: 600;
      font-family: 'Pretendard-Regular';
      margin: 0;
    }
    .date{
      font-size: 1.6vh;
      font-weight: 600;
      font-family: 'Pretendard-Regular';
      color:#AFAFAF;
      margin: 1vh 0 0 0;
    }
  }
`