import React, { useEffect, useState } from "react";
import rightBtn from '../assets/right.png';
import { getMatchListApi } from "../function/MatchApi";
import styled from "styled-components";

const HorizontalSwiper = ({ matchCode, onSelectMatch }) => {
  const [isFullView, setIsFullView] = useState(false);
  const [activeItem, setActiveItem] = useState(0); 
  const [items, setItems] = useState([]);

 
  useEffect(() => {
    getMatchListApi({'user_code' : sessionStorage.getItem('userCode')})
    .then((response) => {
      const matches = response.data.result || [];
      setItems(matches);
    })
  
    .catch((error) => console.error(error));
  }, [matchCode, onSelectMatch]);

  
  const handleFullView = () => {
    setIsFullView(true);
  };

  const handleItemClick = (item, index) => {
    setActiveItem(index); 
    onSelectMatch(item);
  };

  const visibleItems = isFullView ? items : items.slice(0, 5);

  return (
    <HorizontalSwiperStyle>
      <div className="swiper-container">
        {visibleItems.map((item, index) => (
          <div
            key={index}
            className={`swiper-item ${activeItem === index ? "active" : ""}`} 
            onClick={() => handleItemClick(item.match_code, index)} 
          >
            <div
              className={`datebox ${activeItem === index ? "active" : ""}`}
            >
              <p className={`date ${activeItem === index ? "active" : ""}`}>
                {item.match_schedule}
              </p>
            </div>
            <div
              className={`locteambox ${activeItem === index ? "active" : ""}`}
            >
              <p className="team">{item.match_title}</p>
              <p className="location">{item.match_location}</p>
            </div>
          </div>
        ))}
        {!isFullView && (
          <button className="view-more" onClick={handleFullView}>
            <img className="img" src={rightBtn} alt="view more" />
            전체보기
          </button>
        )}
      </div>
    </HorizontalSwiperStyle>
  );
};

export default HorizontalSwiper;


const HorizontalSwiperStyle = styled.div`
  overflow-x: auto; 
  white-space: nowrap; 
  height: 14vh;
  width: 100%;

  .swiper-container {
    display: flex;

    .swiper-item {
      margin: 0 1vh;
      flex: 0; 
      height: 8vh;
      width: 14vh;
      cursor: pointer;
      transition: transform 0.3s ease;
      &:first-child{
        margin-left: 2vh;
      }
      
      .datebox{
        background-color: rgb(229,233,237);
        border-radius: 1vh 1vh 0 0;
        width: 14vh;
        height: 3vh;
        display: flex;
        align-items: center;
        &.active {
          background-color: rgb(24,172,110);
          color: white;
        }
        .date {
          font-size: 1.3vh;
          color: #697077;
          font-weight: 600;
          font-family: 'Pretendard-Regular';
          margin-left: 1vh;
          &.active {
            color: white;
          }
        }
      }
      
      .locteambox {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        background-color: rgb(242, 244, 248);
        border-radius: 0 0 1vh 1vh;
        margin-top: 0.2vh;
        width: 14vh;
        height: 7vh;
      
        &.active {
          background-color: rgb(17, 152, 95); 
          color: white; 
        }
        .team, .location {
          overflow: hidden; 
          text-overflow: ellipsis; 
          white-space: nowrap;
          width: 90%; 
          
        }
        .team {
          font-size: 1.5vh;
          font-weight: 600;
          font-family: 'Pretendard-Regular';
          margin: 0.5vh 0 0 0;
          margin-left: 1vh;
      
          &.active {
            color: white; 
          }
        }
  
        .location {
          font-size: 1.3vh;
          // color: #6F6F6F;
          margin: 0.5vh 0;
          margin-left: 1vh;
          font-family: 'Pretendard-Regular';
      
          &.active {
            color: white; 
          }
        }
      }

      &:hover {
        transform: scale(1.05);
      }
    }

    .view-more {
      background-color: rgb(242,244,248);
      border: none;
      border-radius: 1vh;
      font-size: 1.1vh;
      cursor: pointer;
      text-align: center;
      width: 7vh;
      height: 10vh;
      font-family: 'Pretendard-Regular';
      flex: 0 0 auto;
      display: flex;
      margin-left: 1vh;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .img{
        height: 2vh;
        padding: 1vh;
      }

      &:hover {
        background-color: #f4f4f4;
      }
    }
  }

  &::-webkit-scrollbar {
    height: 1px; 
  }

`