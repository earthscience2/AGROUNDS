import React, { useState } from "react";
import "./HorizontalSwiper.scss";
import rightBtn from '../assets/right.png';

const HorizontalSwiper = ({ items }) => {
  const [isFullView, setIsFullView] = useState(false);
  const [activeItem, setActiveItem] = useState(null); // 선택된 항목의 인덱스를 관리

  const handleFullView = () => {
    setIsFullView(true);
  };

  const handleItemClick = (index) => {
    setActiveItem(index); // 클릭된 항목의 인덱스를 상태로 설정
  };

  const visibleItems = isFullView ? items : items.slice(0, 5);

  return (
    <div className="horizontal-swiper">
      <div className="swiper-container">
        {visibleItems.map((item, index) => (
          <div
            key={index}
            className={`swiper-item ${activeItem === index ? "active" : ""}`} // 클릭된 항목에 "active" 클래스 추가
            onClick={() => handleItemClick(index)} // 클릭 이벤트
          >
            <div
              className={`datebox ${activeItem === index ? "active" : ""}`}
            >
              <p className={`date ${activeItem === index ? "active" : ""}`}>
                {item.date}
              </p>
            </div>
            <div
              className={`locteambox ${activeItem === index ? "active" : ""}`}
            >
              <p className="team">{item.team}</p>
              <p className="location">{item.location}</p>
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
    </div>
  );
};

export default HorizontalSwiper;
