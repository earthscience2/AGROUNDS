import React from 'react';
import DownBtn from '../../components/display/DownBtn';
import Mov from '../../assets/display/playanal/Q3/replay.mp4';
import styled from 'styled-components';
import AIcam from '../../assets/aicam.png';
import Nav from '../../components/display/Nav';


const PersonalMov = () => {
  return (
    <TeamMovStyle>
      <Nav arrow={true}/>
      <div className='theme'>AI CAM<img src={AIcam}/></div>
      <div className='titlebox'>
        <p className='title'>개인 영상(가로)</p>
        <DownBtn bgColor="#616161" onClick="" >다운로드</DownBtn>
      </div>
      <VideoStyle className='video'>
        <video width="340" controls>
          <source src={Mov} type="video/mp4" />
          비디오를 재생할 수 없습니다.
        </video>
      </VideoStyle>
      <p className='content1'>영상은 15일 뒤 자동 삭제됩니다.</p>
      <p className='content2'>삭제일자: 업데이트 일 + 15일</p>

      <div className='titlebox2'>
        <p className='title2'>개인 영상(세로)</p>
        <DownBtn bgColor="#616161" onClick="" >다운로드</DownBtn>
      </div>
      <VideoStyle className='video2'>
        <video width="340" controls>
          <source src={Mov} type="video/mp4" />
          비디오를 재생할 수 없습니다.
        </video>
      </VideoStyle>
      <p className='content1'>영상은 15일 뒤 자동 삭제됩니다.</p>
      <p className='content2'>삭제일자: 업데이트 일 + 15일</p>
    </TeamMovStyle>
  );
};

export default PersonalMov;

const TeamMovStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100% + 30vh);

  .theme{
    color: #055540;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    width: 340px;
    margin-top: 5vh;
    img{
      height: 16px;
      margin-left: 1vh;
    }
  }
  .titlebox{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 340px;
    margin-top: 1vh;
    .title{
      font-weight: 700;
      color: black;
      font-size: 24px;
      margin: 0;
    }
  }

  .content1{
    color: #616161;
    font-size: 14px;
    margin: 2vh 0 0 0;
    width: 340px;
  }
  .content2{
    color: #616161;
    font-size: 14px;
    margin: 0;
    width: 340px;
  }

  .titlebox2{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 340px;
    margin-top: 10vh;
    .title2{
      font-weight: 700;
      color: black;
      font-size: 24px;
      margin: 0;
    }
  }

`

const VideoStyle = styled.div`
  video{
    margin: auto;
    width: 100%;
    max-width: 340px;
  }
`