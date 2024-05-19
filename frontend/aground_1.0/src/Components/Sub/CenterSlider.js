import React, { Component } from "react";
import styles from "./CenterSlider.module.css";
import { useState,useEffect } from "react";
import polygonl from "../../assets/Polygonl.png";
import polygonr from "../../assets/Polygonr.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';


function CenterSlider() {
    const[index, setIndex] = useState(0);
    
    // const slides = [
    //     {
    //         title: "참여 가능 리그",
    //         leagues: [
    //             {name: "A 리그", date:"2024.02.27(화) 17:00 마감"},
    //             {name: "A 리그", date:"2024.02.27(화) 17:00 마감"}
    //         ]
    //     },
    //     {
    //         title: "Now 진행중인 리그",
    //         leagues: [
    //           { name: "인천 A리그", date: "2024.02.27(화) 17:00 ~ 2024.02.27(화) 17:00" },
    //           { name: "서울 A리그", date: "2024.02.27(화) 17:00 ~ 2024.02.27(화) 17:00" }
    //         ]
    //       },
    //       {
    //         title: "마감된 리그",
    //         leagues: [
    //           { name: "A 리그", date: "2024.02.27(화) 17:00 마감" },
    //           { name: "A 리그", date: "2024.02.27(화) 17:00 마감" }
    //         ]
    //       },
    //       {
    //         title: "마감된 리그",
    //         leagues: [
    //           { name: "A 리그", date: "2024.02.27(화) 17:00 마감" },
    //           { name: "A 리그", date: "2024.02.27(화) 17:00 마감" }
    //         ]
    //       }
    // ];
    // const handleNext = () => {
    //     setIndex((index) => (index === slides.length - 1 ? 0 :index +1))
    //     console.log(index)
    // }
    // const handlePrev = () => {
    //     setIndex((index) => (index === 0 ? slides.length - 1 : index - 1));
    //     console.log(index)
    //   };
    const [swiper, setSwiper] = useState(null); // -> 슬라이드용
    const [swiperIndex,setSwiperIndex] = useState(0);
// 2. 슬라이드 이벤트핸들러
        const handlePrev = () => {
            swiper.slidePrev()
        }
        const handleNext = () => {
          swiper.slideNext()
        }
  return (
    <>
      <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={100}
      slidesPerView={3}
      centeredSlides={true}
      speed={400}
      loop={true}
      onSwiper={(swiper) => setSwiper(swiper)}
      onSlideChange={() => console.log('slide change')}
      onActiveIndexChange={(e)=>setSwiperIndex(e.realIndex)}
      className={styles.swiper}
    
    >
      <div className={styles.slidebox}>
        <SwiperSlide className={styles.slide}>
        <p className={styles.text}>전국</p>
          <div className={styles.divbox}><div className={styles.textbox}><p className={styles.text1}>진행중인 리그</p><p className={styles.text2}style={{color:"#055540"}}>6개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참여가능한 리그</p><p className={styles.text2} style={{color:"#EAAA00"}}>4개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참가 팀</p><p className={styles.text2} style={{color:"#000000"}}>24개</p></div></div>
          </SwiperSlide>
        <SwiperSlide className={styles.slide}><p className={styles.text}>서울특별시</p>
        <div className={styles.divbox}><div className={styles.textbox}><p className={styles.text1}>진행중인 리그</p><p className={styles.text2} style={{color:"#055540"}}>6개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참여가능한 리그</p><p className={styles.text2} style={{color:"#EAAA00"}}>4개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참가 팀</p><p className={styles.text2} style={{color:"#000000"}}>24개</p></div></div></SwiperSlide>
        <SwiperSlide className={styles.slide}><p className={styles.text}>경기도</p>
        <div className={styles.divbox}><div className={styles.textbox}><p className={styles.text1}>진행중인 리그</p><p className={styles.text2} style={{color:"#055540"}}>6개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참여가능한 리그</p><p className={styles.text2} style={{color:"#EAAA00"}}>4개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참가 팀</p><p className={styles.text2} style={{color:"#000000"}}>24개</p></div></div></SwiperSlide>
        <SwiperSlide className={styles.slide}><p className={styles.text}>인천광역시</p>
        <div className={styles.divbox}><div className={styles.textbox}><p className={styles.text1}>진행중인 리그</p><p className={styles.text2}style={{color:"#055540"}}>6개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참여가능한 리그</p><p className={styles.text2} style={{color:"#EAAA00"}}>4개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참가 팀</p><p className={styles.text2}style={{color:"#000000"}}>24개</p></div></div></SwiperSlide>
        <SwiperSlide className={styles.slide}><p className={styles.text}>대전광역시</p>
        <div className={styles.divbox}><div className={styles.textbox}><p className={styles.text1}>진행중인 리그</p><p className={styles.text2}style={{color:"#055540"}}>6개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참여가능한 리그</p><p className={styles.text2} style={{color:"#EAAA00"}}>4개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참가 팀</p><p className={styles.text2}style={{color:"#000000"}}>24개</p></div></div></SwiperSlide>
        <SwiperSlide className={styles.slide}><p className={styles.text}>부산광역시</p>
        <div className={styles.divbox}><div className={styles.textbox}><p className={styles.text1}>진행중인 리그</p><p className={styles.text2}style={{color:"#055540"}}>6개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참여가능한 리그</p><p className={styles.text2} style={{color:"#EAAA00"}}>4개</p></div>
          <div className={styles.textbox}><p className={styles.text1}>참가 팀</p><p className={styles.text2}style={{color:"#000000"}}>24개</p></div></div></SwiperSlide>
        ...
        </div>
      </Swiper>
      <div onClick={handlePrev}className={styles.swiperButtonNext}><img onClick={handlePrev}className={styles.polyL}src={polygonl}/></div>
        <div onClick={handleNext} className={styles.swiperButtonPrev}><img className={styles.polyR}src={polygonr}/></div>
    
    </>
  );
}

export default CenterSlider;

{/* <div className={styles.slickslider}>
      
        <img className={styles.polyL}src={polygonl} onClick={handlePrev}/>
        {slides.map((slide,i) => (
            <div key={i} className={`${styles.slide} ${i === index ? styles.active : ""}`}>
            <h2 className={styles.leaguename}>{slide.title}</h2>
            {slide.leagues.map((league, j) => (
              <div key={j}>
                <h3 className={styles.name}>{league.name}</h3>
                <p className={styles.date}>{league.date}</p>
              </div>
              
            ))}
            <p className={styles.goto}>자세히 보러가기 ></p>
          </div>
        ))}
        
        <img className={styles.polyR}src={polygonr} onClick={handleNext}/>
    </div> */}