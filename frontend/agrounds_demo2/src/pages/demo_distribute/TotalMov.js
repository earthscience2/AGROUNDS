import React , {useState, useEffect} from 'react';
import DownBtn from '../../components/display/DownBtn';
import styled from 'styled-components';
import Nav from '../../components/display/Nav';
import VideoPlayer from '../../components/demo/VideoPlayer';
import Quarter from '../../components/display/Quarter';
import CommonBtn from '../../components/display/CommonBtn';
import share from '../../assets/demo/share.png';
import client from '../../clients';

const TotalMov = () => {
  const [activeTab, setActiveTab] = useState('1쿼터');
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [link3, setLink3] = useState('');
  const [link, setLink] = useState('');

  const data = {
    match_code: sessionStorage.getItem('match_code'),
  }

  useEffect(() => {
    client.post('/api/test_page/full-replay-video/', data)
    .then((response) => {
      setLink1(response.data.quarter_1);
      setLink2(response.data.quarter_2);
      setLink3(response.data.quarter_3);
  })
    .catch((error) => {});
  }, [data])


  useEffect(() => {
    if (activeTab === '1쿼터') {
      setLink(link1);
    } else if (activeTab === '2쿼터') {
      setLink(link2);
    } else if (activeTab === '3쿼터') {
      setLink(link3);
    }
  }, [activeTab, link1, link2, link3]);
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '풀 영상',
          text: `${activeTab} 풀 영상을 공유합니다.`,
          url: link,
        });
      } catch (error) {

      }
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };
  
  return (
    <TotalMovStyle>
      <Nav arrow={true}/>
      <div style={{width:"100vw"}}><Quarter activeTab={activeTab} setActiveTab={setActiveTab}/></div>
      <div className='greybox'>
        <div className='theme'>FULL CAM</div>
        <div className='titlebox'>
          <p className='title'>풀 영상</p>
          <div className='buttondiv'>
            <CommonBtn bgColor="#616161" onClick={() => handleShare()} icon={share}>공유</CommonBtn>
            <DownBtn bgColor="#616161" onClick={() => alert('아직 지원하지 않는 기능입니다.')} >다운로드</DownBtn>
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
    </TotalMovStyle>
  );
};

export default TotalMov;

const TotalMovStyle = styled.div`

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
