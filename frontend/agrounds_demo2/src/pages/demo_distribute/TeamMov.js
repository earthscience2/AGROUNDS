import React, { useEffect, useState } from 'react';
import Nav from '../../components/display/Nav';
import VideoPlayer from '../../components/demo/VideoPlayer';
import client from '../../clients';
import CommonBtn from '../../components/display/CommonBtn';
import share from '../../assets/demo/share.png';
import Quarter from '../../components/display/Quarter';
import styled from 'styled-components';
import DownBtn from '../../components/display/DownBtn';
import { Link } from 'react-router-dom';

const TeamMov = () => {
  const [activeTab, setActiveTab] = useState('1쿼터' );
  const [videoLinks, setVideoLinks] = useState({});
  const [downloadLinks, setDownloadLinks] = useState({});
  const [link, setLink] = useState('');
  const [linkD, setLinkD] = useState('');
  const [quarterCount, setQuarterCount] = useState(3); 

  const data = {
    match_code: sessionStorage.getItem('match_code'),
  };

  useEffect(() => {
    client.post('/api/test_page/get-quarter-number/', data)
      .then((response) => {
        setQuarterCount(response.data.quarter);
      })
      .catch((error) => {
        console.log(error)
      })
    
    client.post('/api/test_page/team-replay-video/', data)
      .then((response) => {
        const videoLinks = {};
        const downloadLinks = {};

        for (let i = 1; i <= quarterCount; i++) {
          videoLinks[`${i}쿼터`] = response.data[`quarter_${i}`];
          downloadLinks[`${i}쿼터`] = response.data[`quarter_${i}_download_url`];
        }

        if (quarterCount === 2) {
          videoLinks['1쿼터'] = response.data.quarter_1;
          videoLinks['2쿼터'] = response.data.quarter_2;
          downloadLinks['1쿼터'] = response.data.quarter_1_download_url;
          downloadLinks['2쿼터'] = response.data.quarter_2_download_url;
        }

        setVideoLinks(videoLinks);
        setDownloadLinks(downloadLinks);
        setLink(videoLinks[activeTab]);
        setLinkD(downloadLinks[activeTab]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [data]);

  useEffect(() => {
    setLink(videoLinks[activeTab]);
    setLinkD(downloadLinks[activeTab]);
  }, [activeTab, videoLinks, downloadLinks]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '팀 영상',
          text: `${activeTab} 팀 영상을 공유합니다.`,
          url: linkD,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };

  const handleDownload = async () => {
    if (!linkD) {
      alert('다운로드 링크가 없습니다.');
      return;
    }
  };

  return (
    <TeamMovStyle>
      <Nav arrow={true} />
      <div style={{ width: "100vw" }}>
        <Quarter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          quarterCount={quarterCount}
        />
      </div>
      <div className='greybox'>
        <div className='theme'>TEAM CAM</div>
        <div className='titlebox'>
          <p className='title'>팀 영상</p>
          <div className='buttondiv'>
            <CommonBtn bgColor="#616161" onClick={handleShare} icon={share}>공유</CommonBtn>
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

export default TeamMov;


const TeamMovStyle = styled.div`
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
