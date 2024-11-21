import React, { useState, useEffect } from 'react';
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
  const [videoLinks, setVideoLinks] = useState({});
  const [downloadLinks, setDownloadLinks] = useState({});
  const [link, setLink] = useState('');
  const [linkD, setLinkD] = useState('');
  const [quarterCount, setQuarterCount] = useState(0); 
  const [direction, setDirection] = useState('가로');

  const data = {
    match_code: sessionStorage.getItem('match_code'),
    user_code: sessionStorage.getItem('user_id'),
  };

  const getData = (quarterCount_) => {
    client.post('/api/test_page/player-replay-video/', data)
      .then((response) => {
        const videoLinks = {};
        const downloadLinks = {};

        for (let i = 1; i <= quarterCount_; i++) {
          videoLinks[`${i}쿼터`] = {
            pc: response.data[`quarter_${i}`]?.pc,
            mobile: response.data[`quarter_${i}`]?.mobile,
          };
          downloadLinks[`${i}쿼터`] = {
            pc: response.data[`quarter_${i}`]?.pc_download_url,
            mobile: response.data[`quarter_${i}`]?.mobile_download_url,
          };
        }

        setVideoLinks(videoLinks);
        setDownloadLinks(downloadLinks);
        setLink(videoLinks['1쿼터']?.pc || '');
        setLinkD(downloadLinks['1쿼터']?.pc || '');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    client.post('/api/test_page/get-quarter-number/', data)
      .then((response) => {
        setQuarterCount(response.data.quarter);
        getData(response.data.quarter);
      })
      .catch((error) => {
        console.log(error);
      });
      
  }, []);

  useEffect(() => {
    const currentLinks = videoLinks[activeTab];
    const currentDownloadLinks = downloadLinks[activeTab];

    if (currentLinks && currentDownloadLinks) {
      if (direction === '가로') {
        setLink(currentLinks.pc || '');
        setLinkD(currentDownloadLinks.pc || '');
      } else {
        setLink(currentLinks.mobile || '');
        setLinkD(currentDownloadLinks.mobile || '');
      }
    }
  }, [direction, activeTab]);

  const toggleDirection = () => {
    setDirection((prevDirection) =>
      prevDirection === '가로' ? '세로' : '가로'
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '개인 영상',
          text: `${activeTab} 개인 영상을 공유합니다.`,
          url: linkD,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };

  return (
    <TeamMovStyle>
      <Nav arrow={true} />
      <div style={{ width: '100vw' }}>
        <Quarter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          quarterCount={quarterCount}
        />
      </div>
      <div className='greybox'>
        <div className='theme'>PLAYER CAM</div>
        <div className='titlebox'>
          <p className='title'>개인 영상</p>
          <div className='buttondiv'>
            <CommonBtn
              bgColor='#616161'
              onClick={toggleDirection}
              icon={change}
            >
              {direction === '가로' ? '세로' : '가로'}
            </CommonBtn>
            <CommonBtn
              bgColor='#616161'
              onClick={handleShare}
              icon={share}
            >
              공유
            </CommonBtn>
            <Link to={linkD} target='_blank'>
              <DownBtn bgColor='#616161'>다운로드</DownBtn>
            </Link>
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

  .greybox {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
    padding: 0 0 3vh 0;
    width: 100vw;

    .theme {
      color: #055540;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      width: 85%;
      margin-top: 3vh;
      img {
        height: 16px;
        margin-left: 1vh;
      }
    }
    .titlebox {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 85%;
      margin-top: 1vh;

      .title {
        font-weight: 700;
        color: black;
        font-size: 24px;
        margin: 0;
      }
      .buttondiv {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
    .ppp {
      margin: 8vh 0;
    }
    .content1 {
      color: #616161;
      font-size: 14px;
      margin: 2vh 0 0 0;
      width: 85%;
    }
    .content2 {
      color: #616161;
      font-size: 14px;
      margin: 0;
      width: 85%;
    }
  }
`;
