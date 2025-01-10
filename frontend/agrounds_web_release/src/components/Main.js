import React, {useEffect, useRef, useState} from 'react';
import section1 from '../assets/section1.png';
import styled from 'styled-components';
import section2 from '../assets/section2.png';
import section7 from '../assets/section7.png';
import dashjs from 'dashjs';

const videoUrls = {
  '풀 영상': {
    '1쿼터': 'https://d3lgojruk6udwb.cloudfront.net/video/m_015/1쿼터/full/full.mpd',
    '2쿼터': 'https://d3lgojruk6udwb.cloudfront.net/video/m_015/2쿼터/full/full.mpd',
    '3쿼터': 'https://d3lgojruk6udwb.cloudfront.net/video/m_015/3쿼터/full/full.mpd',
  },
  '팀 영상': {
    '1쿼터': 'https://d3lgojruk6udwb.cloudfront.net/video/m_015/1쿼터/team/team.mpd',
    '2쿼터': 'https://d3lgojruk6udwb.cloudfront.net/video/m_015/2쿼터/team/team.mpd',
    '3쿼터': 'https://d3lgojruk6udwb.cloudfront.net/video/m_015/3쿼터/team/team.mpd',
  },
  '개인 영상': {
    '1쿼터': 'https://d3lgojruk6udwb.cloudfront.net/video/m_015/1쿼터/player_pc/u_50/u_50.mpd',
    '2쿼터': 'https://d3lgojruk6udwb.cloudfront.net/video/m_015/2쿼터/player_pc/u_50/u_50.mpd',
    '3쿼터': 'https://d3lgojruk6udwb.cloudfront.net/video/m_015/3쿼터/player_pc/u_50/u_50.mpd',
  },
};


const Main = () => {

  const [activeVideoType, setActiveVideoType] = useState('풀 영상'); 
  const [activeQuarter, setActiveQuarter] = useState('1쿼터'); 

  const handleVideoTypeClick = (type) => {
    setActiveVideoType(type);
  };

  const handleQuarterClick = (quarter) => {
    setActiveQuarter(quarter);
  };

  const currentVideoUrl = videoUrls[activeVideoType][activeQuarter];

  const videoRef = useRef(null);

  useEffect(() => {
    const player = dashjs.MediaPlayer().create();
    player.initialize(videoRef.current, currentVideoUrl, false);

    return () => {
      player.destroy();
    };
  }, [currentVideoUrl]);

  return (
    <MainStyle>
      <Section1>
        <div>누구나 이용할 수 있는 제품 <br />아마추어를 위한 쉽고 합리적인 제품을 통해 <br/>모든 아마추어 선수들의 성장을 응원하고 돕습니다.</div>
        <img src={section1} />
      </Section1>
      <Section2>
        <img src={section2} />
        <div className='info-box'>
          <div className='title'>아마추어 축구 전술 <br/>분석 플랫폼</div>
          <div className='contents'>히트맵과 리플레이 등 총 123가지의 다양한 분석 결과를 제공하고,<br/> 분석 결과를 바탕으로 도출한 6가지의 주요 지표를 제공합니다.</div>
          <p className='contents2'>또한 개인 뿐 아니라 팀 단위로도 더 자세한 정보를 제공하고자 합니다.</p>
        </div>
      </Section2>
      <Section3>
        <div className='info-box'>
          <div className='title'>GPS 분석</div>
          <div className='contents'>GPS 기기를 통해 수집된 데이터는 저희만의 독자적인 알고리즘을<br/> 통해 선수들의 경기력을 체계적으로 분석합니다.</div>
          <p className='contents2'>이후, AI 기술을 활용하여 이 정보를 한층 더 정교하게 요약하고 시각화하여,<br/> 누구나 쉽게 이해하고 활용할 수 있도록 제공합니다. <br/>데이터의 전문성과 소비자의 접근성을 동시에 만족시키는 <br/>혁신적인 분석 솔루션입니다.
          </p>
        </div>
        <img src={section2} />
      </Section3>
      <Section4>
        <img src={section2} />
        <div className='info-box'>
          <div className='title'>GPS 기기</div>
          <div className='contents'>무선 충전 기술을 적용해 비와 땀으로부터 안전한 설계를 구현했습니다. <br/>또한 블루투스 연결을 통해 경기 종료 후 데이터를 손쉽게 <br/>전송할 수 있도록 하여 편리함과 실용성을 동시에 제공하고 있습니다.
          </div>
        </div>
      </Section4>
      <Section5>
        <div className='info-box'>
          <div className='title'>GPS 조끼</div>
          <div className='contents'>GPS 기기를 통해 수집된 데이터는 저희만의 독자적인 알고리즘을<br/> 통해 선수들의 경기력을 체계적으로 분석합니다.</div>
          <p className='contents2'>이후, AI 기술을 활용하여 이 정보를 한층 더 정교하게 요약하고 시각화하여,<br/> 누구나 쉽게 이해하고 활용할 수 있도록 제공합니다. <br/>데이터의 전문성과 소비자의 접근성을 동시에 만족시키는 <br/>혁신적인 분석 솔루션입니다.
          </p>
        </div>
        <img src={section2} />
      </Section5>
      <Section6>
        <div className='video-type'>
        {['풀 영상', '팀 영상', '개인 영상'].map((type) => (
          <VideoTypeButton
            key={type}
            isActive={activeVideoType === type}
            onClick={() => handleVideoTypeClick(type)}
          >
            {type}
          </VideoTypeButton>
        ))}
        </div>
        <div className='contents-box'>
          <div className='title'>세 개의 영상을 하나의 영상처럼</div>
          <div className='title2'>경기장 전체를 한 눈에 확인할 수 있게 영상 합성 기술(Stitching)을 통해 영상을 제공합니다.</div>
          
          <video ref={videoRef} controls style={{width: '100%'}}/>
          
          <div className='quarter-box'>
          {['1쿼터', '2쿼터', '3쿼터'].map((quarter) => (
            <QuarterButton
              key={quarter}
              isActive={activeQuarter === quarter}
              onClick={() => handleQuarterClick(quarter)}
            >
              {quarter}
            </QuarterButton>
          ))}
          </div>
        </div>
      </Section6>
      <Section7>
        <div className='title'>축구를 위한 영상</div>
        <div className='contents'>3대의 4K 카메라를 활용하여 약 4m 높이의 최적의 촬영 각도로 <br/>촬영합니다. 촬영된 데이터를 합성 알고리즘을 통해 자연스럽게 합성하여<br/> 경기장 전체를 한 눈에 볼 수 있게 제공합니다.</div>
        <img src={section7} />
        <div className='explain'>영상 합성 알고리즘(Stitching) 기술을 통해 <br/>전 경기장을 한 눈에 볼 수 있도록</div>
      </Section7>
      <div style={{marginBottom: '25vh'}}></div>
    </MainStyle>

  );
};

export default Main;

const MainStyle = styled.div`
width: 100vw;
display: flex;
flex-direction: column;
align-items: center;
`
const Section1 = styled.div`
  margin-top: 20vh;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  div{
    font-size: 4vh;
    font-weight: 700;
  }
  img{
    width: 100%;
    margin-top: 10vh;
  }
`

const Section2 = styled.div`
width: 100vw;
display: flex;
justify-content: center;
gap: 10vh;
margin-top: 20vh;
img{
  width: 20%;
}
.info-box{
  display: flex;
  flex-direction: column;
  justify-content: start;
  .title{
    font-size: 3vh;
    font-weight: 700;
    color: #161616;
  }
  .contents{
    font-size: 1.7vh;
    font-weight: 400;
    margin-top: 3vh;
    color:#525252;
    line-height: 1.5;
  }
  .contents2{
    font-size: 1.7vh;
    font-weight: 400;
    color:#525252;
    line-height: 1.5;
    margin: 2vh 0;
  }
}
`

const Section3 = styled.div`
width: 100vw;
display: flex;
justify-content: center;
gap: 10vh;
margin-top: 10vh;
img{
  width: 20%;
}
.info-box{
  display: flex;
  flex-direction: column;
  justify-content: start;
  .title{
    font-size: 3vh;
    font-weight: 700;
    color: #161616;
  }
  .contents{
    font-size: 1.7vh;
    font-weight: 400;
    margin-top: 3vh;
    color:#525252;
    line-height: 1.6;
  }
  .contents2{
    font-size: 1.7vh;
    font-weight: 400;
    color:#525252;
    line-height: 1.6;
    margin: 2vh 0;
  }
}
`

const Section4 = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  gap: 10vh;
  margin-top: 10vh;
  img{
    width: 20%;
  }
  .info-box{
    display: flex;
    flex-direction: column;
    justify-content: start;
    .title{
      font-size: 3vh;
      font-weight: 700;
      color: #161616;
    }
    .contents{
      font-size: 1.7vh;
      font-weight: 400;
      margin-top: 3vh;
      color:#525252;
      line-height: 1.6;
    }
    .contents2{
      font-size: 1.7vh;
      font-weight: 400;
      color:#525252;
      line-height: 1.6;
      margin: 2vh 0;
    }
  }
`

const Section5 = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  gap: 10vh;
  margin-top: 10vh;
  img{
    width: 20%;
  }
  .info-box{
    display: flex;
    flex-direction: column;
    justify-content: start;
    .title{
      font-size: 3vh;
      font-weight: 700;
      color: #161616;
    }
    .contents{
      font-size: 1.7vh;
      font-weight: 400;
      margin-top: 3vh;
      color:#525252;
      line-height: 1.6;
    }
    .contents2{
      font-size: 1.7vh;
      font-weight: 400;
      color:#525252;
      line-height: 1.6;
      margin: 2vh 0;
    }
  }
`

const Section6 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  padding: 10vh 0;
  width: 100vw;
  height: max-content;
  background-color: #21272A;
  margin-top: 20vh;
  gap: 5vh;
  .video-type{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    margin: -1.2vh;
  }
  .contents-box{
    width: 35%;
    .title{
      color: white;
      font-size: 2vh;
      font-weight: 700;
    }
    .title2{
      color: #A2A9B0;
      font-size: 1.5vh;
      font-weight: 400;
      margin-top: 1vh;
    }
    video{
      width: 100%;
      margin-top: 3vh;
      border-radius: 1vh;
      z-index: 1;
    }
    /* .video-box{
      width: 100%;
      height: 37vh;
      margin-top: 5vh;
      border-radius: 1vh;
      overflow: hidden;
    } */
    .quarter-box{
      width: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      color: white;
      margin-top: 3vh;
    }
  }
`

const VideoTypeButton = styled.div`
  padding: .2vh 1vh;
  margin: 1vh 0;
  cursor: pointer;
  color: ${(props) => (props.isActive ? '#10CC7E' : '#697077')};
  border-left: 2px solid ${(props) => (props.isActive ? '#10CC7E' : '#21272A')};
  font-size: 2vh;
  font-weight: 700;

  &:hover {
    opacity: 0.8;
  }
`;

const QuarterButton = styled.div`
  padding: .8vh 1.5vh;
  margin: 1vh;
  cursor: pointer;
  color: ${(props) => (props.isActive ? 'white' : '#878D96')};
  background-color: ${(props) => (props.isActive ? '#343A3F' : '')};
  border-radius: 1vh;
  font-size: 1.8vh;
  font-weight: 700;

  &:hover {
    opacity: 0.8;
  }
`;

const Section7 = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20vh;
  background-color: white;
  text-align: center;
  img{
    width: 60%;
    margin-top: 10vh;
  }
  .title{
    font-size: 3vh;
    font-weight: 700;
    color: #161616;
  }
  .contents{
    font-size: 1.7vh;
    font-weight: 400;
    margin-top: 3vh;
    color:#525252;
    line-height: 1.6;
  }
  .explain{
    font-size: 1.9vh;
    font-weight: 700;
    margin-top: 5vh;
    color:#878D96;
    line-height: 1.6;

  }
`