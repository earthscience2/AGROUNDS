import React, { useState } from "react";
import "./HorizontalSwiper.scss";
import rightBtn from '../assets/right.png';

const HorizontalSwiper = ({ items }) => {
  const [isFullView, setIsFullView] = useState(false);
  const [activeItem, setActiveItem] = useState(0); 

  const handleFullView = () => {
    setIsFullView(true);
  };

  const handleItemClick = (index) => {
    setActiveItem(index); 
  };

  const visibleItems = isFullView ? items : items.slice(0, 5);

  return (
    <div className="horizontal-swiper">
      <div className="swiper-container">
        {visibleItems.map((item, index) => (
          <div
            key={index}
            className={`swiper-item ${activeItem === index ? "active" : ""}`} 
            onClick={() => handleItemClick(index)} 
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
