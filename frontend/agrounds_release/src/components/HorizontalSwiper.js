import React, { useEffect, useState } from "react";
import "./HorizontalSwiper.scss";
import rightBtn from '../assets/right.png';
import { getMatchListApi } from "../function/MatchApi";

const HorizontalSwiper = ({ matchCode, onSelectMatch }) => {
  const [isFullView, setIsFullView] = useState(false);
  const [activeItem, setActiveItem] = useState(0); 
  const [items, setItems] = useState([]);

 
  useEffect(() => {
    getMatchListApi({'user_code' : sessionStorage.getItem('userCode')})
    .then((response) => {
      const matches = response.data.result || [];
        setItems(matches);
      
      const initialIndex = matches.findIndex(
        (match) => match.match_code === matchCode
      );

      if (initialIndex !== -1) {
        setActiveItem(initialIndex);
          onSelectMatch(matches[initialIndex]);
      } else if (matches.length > 0) {
        setActiveItem(0); 
        onSelectMatch(matches[0]);
      }
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
    <div className="horizontal-swiper">
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
    </div>
  );
};

export default HorizontalSwiper;
