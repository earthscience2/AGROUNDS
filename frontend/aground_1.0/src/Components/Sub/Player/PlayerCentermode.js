import React, { Component } from "react";
import styles from "./PlayerCentermode.module.css";
import { useState,useEffect } from "react";
import polygonl from "../../../assets/Polygonl.png";
import polygonr from "../../../assets/Polygonr.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from "react-router-dom";

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';


function PlayerCentermode() {
    const[index, setIndex] = useState(0);
    
    const [swiper, setSwiper] = useState(null); // -> 슬라이드용
    const [swiperIndex,setSwiperIndex] = useState(0);
    const navigate = useNavigate();

    const [currentindex,setCurrentindex]=useState(0);
// 2. 슬라이드 이벤트핸들러
        const handlePrev = () => {
            swiper.slidePrev()
            setCurrentindex(swiperIndex-1)
        }
        const handleNext = () => {
          swiper.slideNext()
          setCurrentindex(swiperIndex+1)
        }
        const goRegion=()=>{
            navigate('/RegionTeamPage');
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
      onSlideChange={(e) => console.log(e.realIndex)}
      onActiveIndexChange={(e)=>setSwiperIndex(e.realIndex)}
      className={styles.swiper}
    
    >
      <div className={styles.slidebox}>
        <SwiperSlide onClick={goRegion} className={swiperIndex === 0?styles.slideC:styles.slide}>
        <p className={styles.region} onClick={goRegion}>전국</p>
          <div className={styles.divbox}>
            <div className={styles.textbox}><p className={styles.text}>전체선수</p><p className={styles.text4}>568명</p></div>
            <div className={styles.boxgroup}>
              <div className={styles.textbox}><p className={styles.text1}>평균연령</p><p className={styles.text2}>22세</p></div>
              <div className={styles.textbox}><p className={styles.text1}>평균 포인트</p><p className={styles.text2} >150점</p></div>
              <div className={styles.textbox}><p className={styles.text1}>최다포지션</p><p className={styles.text2} >LM</p></div>
            </div>
          </div>
          </SwiperSlide>
        </div>
        <div className={styles.slidebox}>
        <SwiperSlide onClick={goRegion} className={swiperIndex === currentindex?styles.slideC:styles.slide}>
        <p className={styles.region} onClick={goRegion}>서울특별시</p>
          <div className={styles.divbox}>
            <div className={styles.textbox}><p className={styles.text}>전체선수</p><p className={styles.text4}>568명</p></div>
            <div className={styles.boxgroup}>
              <div className={styles.textbox}><p className={styles.text1}>평균연령</p><p className={styles.text2}>22세</p></div>
              <div className={styles.textbox}><p className={styles.text1}>평균 포인트</p><p className={styles.text2} >150점</p></div>
              <div className={styles.textbox}><p className={styles.text1}>최다포지션</p><p className={styles.text2} >LM</p></div>
            </div>
          </div>
          </SwiperSlide>
        </div>
        <div className={styles.slidebox}>
        <SwiperSlide onClick={goRegion} className={swiperIndex === currentindex?styles.slideC:styles.slide}>
        <p className={styles.region} onClick={goRegion}>인천광역시</p>
          <div className={styles.divbox}>
            <div className={styles.textbox}><p className={styles.text}>전체선수</p><p className={styles.text4}>568명</p></div>
            <div className={styles.boxgroup}>
              <div className={styles.textbox}><p className={styles.text1}>평균연령</p><p className={styles.text2}>22세</p></div>
              <div className={styles.textbox}><p className={styles.text1}>평균 포인트</p><p className={styles.text2} >150점</p></div>
              <div className={styles.textbox}><p className={styles.text1}>최다포지션</p><p className={styles.text2} >LM</p></div>
            </div>
          </div>
          </SwiperSlide>
        </div>
        <div className={styles.slidebox}>
        <SwiperSlide onClick={goRegion} className={swiperIndex === currentindex?styles.slideC:styles.slide}>
        <p className={styles.region} onClick={goRegion}>경기도</p>
          <div className={styles.divbox}>
            <div className={styles.textbox}><p className={styles.text}>전체선수</p><p className={styles.text4}>568명</p></div>
            <div className={styles.boxgroup}>
              <div className={styles.textbox}><p className={styles.text1}>평균연령</p><p className={styles.text2}>22세</p></div>
              <div className={styles.textbox}><p className={styles.text1}>평균 포인트</p><p className={styles.text2} >150점</p></div>
              <div className={styles.textbox}><p className={styles.text1}>최다포지션</p><p className={styles.text2} >LM</p></div>
            </div>
          </div>
          </SwiperSlide>
        </div>
        <div className={styles.slidebox}>
        <SwiperSlide onClick={goRegion} className={swiperIndex === currentindex?styles.slideC:styles.slide}>
        <p className={styles.region} onClick={goRegion}>부산광역시</p>
          <div className={styles.divbox}>
            <div className={styles.textbox}><p className={styles.text}>전체선수</p><p className={styles.text4}>568명</p></div>
            <div className={styles.boxgroup}>
              <div className={styles.textbox}><p className={styles.text1}>평균연령</p><p className={styles.text2}>22세</p></div>
              <div className={styles.textbox}><p className={styles.text1}>평균 포인트</p><p className={styles.text2} >150점</p></div>
              <div className={styles.textbox}><p className={styles.text1}>최다포지션</p><p className={styles.text2} >LM</p></div>
            </div>
          </div>
          </SwiperSlide>
        </div>
        
          
        
      </Swiper>
      <div onClick={handlePrev}className={styles.swiperButtonNext}><img onClick={handlePrev}className={styles.polyL}src={polygonl}/></div>
        <div onClick={handleNext} className={styles.swiperButtonPrev}><img className={styles.polyR}src={polygonr}/></div>
    
    </>
  );
}

export default PlayerCentermode;