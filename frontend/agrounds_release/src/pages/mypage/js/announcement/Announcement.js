import React from 'react';
import { useLocation } from 'react-router-dom';
import Back_btn from '../../../../components/Back_btn';
import styled from 'styled-components';

const Announcement = () => {
  const location = useLocation();

  // const { title, text, date } = location.state.contents;
  return (
    <AnnouncementStyle>
      <Back_btn />
      <div className='title'>공지사항 1</div>
      <div className='date'>2024.99.22</div>
      <div className='line'/>
      <div className='text'>안녕하세요 여러분 제 이름은 문소영입니다. 안녕하세요 여러분 제 이름은 문소영입니다. 안녕하세요 여러분 제 이름은 문소영입니다. 안녕하세요 여러분 제 이름은 문소영입니다. 안녕하세요 여러분 제 이름은 문소영입니다. 안녕하세요 여러분 제 이름은 문소영입니다. 안녕하세요 여러분 제 이름은 문소영입니다. 안녕하세요 여러분 제 이름은 문소영입니다.</div>
    </AnnouncementStyle>
  );
};

export default Announcement;

const AnnouncementStyle = styled.div`
  width: 100%;
  max-width: 499px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  .title{
    font-size: 2.2vh;
    font-weight: 600;
    color: black;
    width: 90%;

  }
  .date{
    font-size: 1.4vh;
    font-weight: 500;
    color: #6F6F6F;
    width: 90%;
    margin-top: .5vh;
  }
  .line{
    width: 90%;
    height: 1px;
    background-color: #DADFE5;
    margin-top: 3vh;
    margin-bottom: 2vh;
  }
  .text{
    font-size: 1.6vh;
    font-weight: 400;
    color: black;
    width: 90%;
  }
`