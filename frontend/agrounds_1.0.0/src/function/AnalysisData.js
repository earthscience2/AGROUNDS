import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SpecificGravity from '../components/SpecificGravity';
import LineChart from '../components/LineChart';

const Map = ({ data, currentIndex }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef(null);

  const slides = currentIndex === 0
    ? [data.hitmap, data.sprintmap, data.change_direction]
    : [data.hitmap, data.change_direction];

  const handleScroll = () => {
    const swiper = swiperRef.current;
    if (swiper) {
      const scrollLeft = swiper.scrollLeft;
      const slideWidth = swiper.offsetWidth;
      const newSlide = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    const swiper = swiperRef.current;
    if (swiper) {
      const slideWidth = swiper.offsetWidth;
      swiper.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const swiper = swiperRef.current;
    if (swiper) {
      swiper.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (swiper) {
        swiper.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (swiper) {
      swiper.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
    setCurrentSlide(0);
  }, [currentIndex]);

  return (
    <SwiperContainer>
      <SwiperWrapper ref={swiperRef}>
        {slides.map((slideSrc, idx) => (
          <SwiperItem key={idx}>
            <img src={slideSrc} alt={`Slide ${idx}`} />
          </SwiperItem>
        ))}
      </SwiperWrapper>
      
      <DotsContainer>
        {slides.map((_, index) => (
          <Dot
            key={index}
            active={currentSlide === index}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </DotsContainer>
    </SwiperContainer>
  );
};


  

const ActivityLevel = ({ data, attack,defence }) => {
  return (
    <ActivityLevelStyle>
      <SpecificGravity attack={attack} defence={defence}/>
      <div className='datarow'>
        <p className='datatitle'>경기시간</p>
        <p className='datadetail'>{data.T}분</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>이동거리</p>
        <p className='datadetail'>{data.D}km</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>분당 이동거리</p>
        <p className='datadetail'>{data.DPM}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>90~135도 방향전환 횟수</p>
        <p className='datadetail'>{data.LDT}번</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>135~180도 방향전환 횟수</p>
        <p className='datadetail'>{data.HDT}번</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>활동 범위</p>
        <p className='datadetail'>{data.MR}%</p>
      </div>
    </ActivityLevelStyle>
  );
};

const Speed = ({ data, positionData }) => {
  const [speedData, setSpeedData] = useState([]);
  const [accData, setAccData] = useState([]);
  
  useEffect(() => {
    setSpeedData(data.speed_change);
    setAccData(data.acceleration_change);
  }, [data])

  return (
    <SpeedStyle >
      <div className='movingbox'>
        <div className='eachmovingbox'>
          <p>속력 변화</p>
          <div className='chart'>
            {speedData && <LineChart data={speedData} speed={true}/>}
          </div>
        </div>
        <div className='eachmovingbox'>
          <p>가속도 변화</p>
          <div className='chart'>
            {accData && <LineChart data={accData} speed={true}/>}
          </div>
        </div>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 속력</p>
        <p className='datadetail'>{positionData.AS}km/h</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최고 속력</p>
        <p className='datadetail'>{positionData.HS}km/h</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 가속도</p>
        <p className='datadetail'>{positionData.AA}m/s²</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최고 가속도</p>
        <p className='datadetail'>{positionData.HA}m/s²</p>
      </div>
    </SpeedStyle>
  );
};

const Sprint = ({data}) => {
  return (
    <SprintStyle >
      <div className='datarow'>
        <p className='datatitle'>스프린트 횟수</p>
        <p className='datadetail'>{data.S}번</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 스프린트 거리</p>
        <p className='datadetail'>{data.ASD}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 스프린트 속력</p>
        <p className='datadetail'>{data.ASS}km/h</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>평균 스프린트 가속도</p>
        <p className='datadetail'>{data.ASA}m/s²</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>전체 스프린트 거리</p>
        <p className='datadetail'>{data.TSD}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최고 스프린트 거리</p>
        <p className='datadetail'>{data.HSD}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>최저 스프린트 거리</p>
        <p className='datadetail'>{data.LSD}m</p>
      </div>
      <div className='datarow'>
        <p className='datatitle'>총 이동거리 당 스프린트 거리</p>
        <p className='datadetail'>{data.SDPD}%</p>
      </div>
    </SprintStyle>
  )
}

export { Map, ActivityLevel, Speed, Sprint };

const SwiperContainer = styled.div`
  position: relative;
  width: 85%;
  height: 30vh;
  overflow: hidden;
  margin-top: 2vh;
`;

const SwiperWrapper = styled.div`
  display: flex;
  transform: translateX(${({ currentSlide }) => -100 * currentSlide}%);
  transition: transform 0.3s ease-in-out;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; 
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SwiperItem = styled.div`
  flex: 0 0 100%;
  height: 23vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius:1vh;
  overflow: hidden;
  scroll-snap-align: start;

  img {
    width: 100%;
    height: 100%;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  background-color: ${({ active }) => (active ? '#333' : '#ccc')};
  border-radius: 50%;
  margin: 0 3px;
  cursor: pointer;
`;



const ActivityLevelStyle = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .datarow{
    display: flex;
    justify-content: space-between;
    &:last-child{
        margin-bottom: 3vh;
      }
    .datatitle{
      color: #6F6F6F;
      font-size: 1.6vh;
      font-weight: 500;
      font-family: 'Pretendard';
      margin: 1vh 0;
    }
    .datadetail{
      color: #393939;
      font-size: 1.6vh;
      font-weight: 600;
      font-family: 'Pretendard';
      margin: 1vh 0;
    }
  }
`
const SpeedStyle = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .movingbox{
    width: 100%;
    height: 15vh;
    border-radius: 1vh;
    background-color: white;
    margin: 1vh auto 2vh auto;
    display: flex;
    justify-content: center;
    align-items: center;
    .eachmovingbox{
      width: 50%;
      height: 13vh;
      margin-left: 2vh;
      & > p {
        font-size: 1.6vh;
        font-weight: 600;
        font-family: 'Pretendard';
        width: 80%;
        
      }
      & > img {
        width: 90%;
        object-fit: cover;
        margin-left: -1vh;
      }
      .chart{
        width: 80%;
        height: 20%;
      }
    }

  }
  .datarow{
    display: flex;
    justify-content: space-between;
    &:last-child{
        margin-bottom: 3vh;
      }
    .datatitle{
      color: #6F6F6F;
      font-size: 1.6vh;
      font-weight: 500;
      font-family: 'Pretendard';
      margin: 1vh 0;
    }
    .datadetail{
      color: #393939;
      font-size: 1.6vh;
      font-weight: 600;
      font-family: 'Pretendard';
      margin: 1vh 0;
    }
  }
`


const SprintStyle = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .datarow{
    display: flex;
    justify-content: space-between;
    &:last-child{
        margin-bottom: 3vh;
      }
    .datatitle{
      color: #6F6F6F;
      font-size: 1.6vh;
      font-weight: 500;
      font-family: 'Pretendard';
      margin: 1vh 0;
    }
    .datadetail{
      color: #393939;
      font-size: 1.6vh;
      font-weight: 600;
      font-family: 'Pretendard';
      margin: 1vh 0;
    }
  }
`