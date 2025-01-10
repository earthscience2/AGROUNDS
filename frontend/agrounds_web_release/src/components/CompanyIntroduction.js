import React from 'react';
import styled from 'styled-components';
import introsec1 from '../assets/introsec1.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/navigation'; 
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import heegu from '../assets/heegu.png';


const CompanyIntroduction = () => {

  const teamMembers = [
    { name: "김소원", position: "Designer", image: heegu },
    { name: "이희구", position: "CEO", image: heegu },
    { name: "구자유", position: "BE Developer", image: heegu },
    { name: "안의찬", position: "BE Developer", image: heegu },
    { name: "문소영", position: "FE Developer", image: heegu },
  ];

  return (
    <CompanyIntroductionStyle>
      <div className='title'>모든 아마추어 축구인들의 <br/>성장을 위해</div>
      <div className='intro-box'>
        <img src={introsec1} />
      </div>
      <div className='introduce-ment'>
        <div className='introduce-title'>AGROUNDS 팀을 소개합니다</div>
        <div className='introduce-contents'>축구를 진심으로 사랑하는 저희 팀의 목표는 한국의 월드컵 우승입니다.<br/>
            그리고 그 시작은 아마추어 축구에서부터 시작된다고 믿고 있기 때문에 <br/>
            우리는 30만 아마추어 축구인을 위한 전술 분석 플랫폼 AGROUNDS를 서비스하고 있습니다.</div>
      </div>
      <TeamSwiper
      modules={[Autoplay]}
      autoplay={{
        delay: 0, 
        disableOnInteraction: false,
      }}
      speed={3000} 
      loop 
      spaceBetween={10}
      slidesPerView={4}
    >
      {teamMembers.map((member, index) => (
        <SwiperSlide key={index}>
          <TeamCard>
            <img src={member.image} alt={member.name} />
          </TeamCard>
        </SwiperSlide>
      ))}
    </TeamSwiper>
    </CompanyIntroductionStyle>
  );
};

export default CompanyIntroduction;

const CompanyIntroductionStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 25vh;
  width: 100vw;
  .title {
    font-size: 4vh;
    font-weight: 700;
    text-align: center;
    color: #161616;
  }
  .intro-box{
    width: 100%;
    margin-top: 10vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img{
      width: 50%;
    }
  }
  .introduce-ment{
    width: 100%;
    display: flex;
    flex-direction:column;
    margin-top: 10vh;
    align-items: center;
    .introduce-title{
      font-size: 3vh;
      font-weight: 700;
      color: #161616;
      width: 45%;
    }
    .introduce-contents{
      font-size: 1.6vh;
      font-weight: 400;
      color:#525252;
      width: 45%;
      margin-top: 2vh;
      line-height: 1.6;
    }
  }
`

const TeamSwiper = styled(Swiper)`
  width: 100%;
  height: 40vh;
  margin: 10vh auto 10vh auto;
  
`;

const TeamCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  text-align: center;
  background-color: #F7F8FA;
  border-radius: 2.5vh;
  
  width: 90%;

  img {
    width: 80%;
    margin: 5vh;
  }

`;