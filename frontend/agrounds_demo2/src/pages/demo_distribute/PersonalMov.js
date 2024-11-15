import React, {useState, useEffect} from 'react';
import DownBtn from '../../components/display/DownBtn';
import styled from 'styled-components';
import Nav from '../../components/display/Nav';
import VideoPlayer from '../../components/demo/VideoPlayer';
import share from '../../assets/demo/share.png';
import change from '../../assets/demo/change.png';
import client from '../../clients';
import Quarter from '../../components/display/Quarter';
import CommonBtn from '../../components/display/CommonBtn';
import { Link } from 'react-router-dom';

const PersonalMov = () => {
  const [activeTab, setActiveTab] = useState('1쿼터');
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [link3, setLink3] = useState('');
  const [link, setLink] = useState('');
  const [linkD, setLinkD] = useState('');
  const [direction, setDirection] = useState('가로');

  const data = {
    match_code: sessionStorage.getItem('match_code'),
    user_code: sessionStorage.getItem('user_id'),
  }

  useEffect(() => {
    client.post('/api/test_page/player-replay-video/', data)
    .then((response) => {
      setLink1(response.data.quarter_1 );
      setLink2(response.data.quarter_2 );
      setLink3(response.data.quarter_3 );
  })
    .catch((error) => {});
  }, [])


  useEffect(() => {
    if(direction === '가로'){
      if (activeTab === '1쿼터') {
        setLink(link1.pc);
        setLinkD(link1.pc_download_url);
      } else if (activeTab === '2쿼터') {
        setLink(link2.pc);
        setLinkD(link2.pc_download_url);
      } else if (activeTab === '3쿼터') {
        setLink(link3.pc);
        setLinkD(link3.pc_download_url);
      }
    } else if (direction === '세로'){
      if (activeTab === '1쿼터') {
        setLink(link1.mobile);
        setLinkD(link1.mobile_download_url);
      } else if (activeTab === '2쿼터') {
        setLink(link2.mobile);
        setLinkD(link2.mobile_download_url);
      } else if (activeTab === '3쿼터') {
        setLink(link3.mobile);
        setLinkD(link3.mobile_download_url);
      }
    }
    
  }, [direction, activeTab, link1, link2, link3]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '개인 영상',
          text: `${activeTab} 개인 영상을 공유합니다.`,
          url: linkD,
        });
      } catch (error) {

      }
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };

  const toggleDirection = () => {
    setDirection((prevDirection) => (prevDirection === '가로' ? '세로' : '가로'));
  };

  const handleDownload = async () => {
    if (!linkD) {
      alert('다운로드 링크가 없습니다.');
      return;
    }
  };

  return (
    <TeamMovStyle>
      <Nav arrow={true}/>
      <div style={{width:"100vw"}}><Quarter activeTab={activeTab} setActiveTab={setActiveTab}/></div>
      <div className='greybox'>
        <div className='theme'>PLAYER CAM</div>
        <div className='titlebox'>
          <p className='title'>개인 영상</p>
          <div className='buttondiv'>
            <CommonBtn bgColor="#616161" onClick={toggleDirection} icon={change}>{direction === '가로' ? '세로' : '가로'}</CommonBtn>            
            <CommonBtn bgColor="#616161" onClick={() => handleShare()} icon={share}>공유</CommonBtn>
            <Link to={linkD} target='_blank'><DownBtn bgColor="#616161" onClick={handleDownload} >다운로드</DownBtn></Link>
          </div>
        </div>
        {link ? (
          <VideoPlayer url={link} />
        ) : (
          <p className='ppp'>Loading video...</p>
        )}
        <p className='content1'>영상은 15일 뒤 자동 삭제됩니다.</p>
        <p className='content2'>삭제일자: 업데이트 일 + 15일</p>
      </div>
    </TeamMovStyle>
  );
};

export default PersonalMov;

const TeamMovStyle = styled.div`
  max-width: 420px;

  .greybox{
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #F5F5F5;
    padding: 0 0 3vh 0;
    width: 100vw;
    
    .theme{
    color: #055540;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    width: 85%;
    margin-top: 3vh;
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
    width: 85%; 
    margin-top: 1vh;
    .title{
      font-weight: 700;
      color: black;
      font-size: 24px;
      margin: 0;
    }
    .buttondiv{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

    }
  }
  .ppp{
    margin: 8vh 0;
  }
  .content1{
    color: #616161;
    font-size: 14px;
    margin: 2vh 0 0 0;
    width: 85%;
  }
  .content2{
    color: #616161;
    font-size: 14px;
    margin: 0;
    width: 85%;
  }
  }
  
`