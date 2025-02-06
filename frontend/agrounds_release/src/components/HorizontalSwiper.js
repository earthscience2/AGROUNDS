import React, { useEffect, useState } from "react";
import rightBtn from '../assets/right.png';
import { getMatchListApi } from "../function/MatchApi";
import styled from "styled-components";
import Modal from "./Modal";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FullModal from "./FullModal";
import Circle_common_btn from "./Circle_common_btn";
import left from "../assets/left.png";
import ko from "date-fns/locale/ko"; 
import { registerLocale } from 'react-datepicker';


registerLocale("ko", ko);

const HorizontalSwiper = ({ matchCode, onSelectMatch }) => {
  const [activeItem, setActiveItem] = useState(0); 
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen ] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    getMatchListApi({'user_code' : sessionStorage.getItem('userCode')})
    .then((response) => {
      const matches = response.data.result || [];
      console.log(response.data.result)
      setItems(matches);
    })
  
    .catch((error) => console.error(error));
  }, [matchCode, onSelectMatch]);

  const handleItemClick = (item, index) => {
    setActiveItem(index); 
    onSelectMatch(item);
  };

  const visibleItems = items.slice(0, 5);

  const isOpen = () => {
    setModalOpen(true)
  }

  const onClose = () => {
    setModalOpen(false);
  }

  const isSameOrBefore = (date1, date2) => {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    console.log('날짜비교',d1,d2)
    return d1 <= d2;
  };

  const availableDates = items.map((item) => new Date(item.match_schedule).toDateString());
  console.log('실제 가능날짜',availableDates)
  const handleDateChange = (date) => {
    const today = new Date();

    if (isSameOrBefore(today, date)) return; 
    setSelectedDate(date);
    const pastData = items
      .filter((item) => isSameOrBefore(new Date(item.match_schedule), date))
      .slice(-5)
      .reverse();
    setFilteredData(pastData);
  };

  const isDateAvailable = (date) => {
    console.log(date.toDateString())
    return availableDates.includes(date.toDateString());
  };

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
        
          <button className="view-more" onClick={isOpen}>
            <img className="img" src={rightBtn} alt="view more" />
            날짜 선택
          </button>

          {modalOpen && (
          <FullModal onClose={onClose} type="date" isOpen={modalOpen} common="false">
            <CustomDatePicker>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
                locale="ko"
                dayClassName={(date) =>
                  isDateAvailable(date) ? "available-date" : "disabled-date"
                }
                filterDate={isDateAvailable}
                calendarStartDay={0}
                maxDate={new Date()}
                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
                  const today = new Date();
                  const isCurrentMonth = 
                    date.getFullYear() === today.getFullYear() &&
                    date.getMonth() === today.getMonth();
                
                  return (
                    <CustomHeader>
                      <div>{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</div>
                      <div className="buttonbox">
                        <button onClick={decreaseMonth}>
                          <img src={left} alt="Previous" />
                        </button>
                        <button 
                          onClick={increaseMonth} 
                          disabled={isCurrentMonth} 
                          style={{ opacity: isCurrentMonth ? 0.5 : 1, cursor: isCurrentMonth ? 'not-allowed' : 'pointer' }}
                        >
                          <img src={left} style={{ transform: 'rotate(180deg)' }} alt="Next" />
                        </button>
                      </div>
                    </CustomHeader>
                  );
                }}
              />
            </CustomDatePicker>
            <Circlebox>
              <Circle_common_btn title="확인"/>
            </Circlebox>
            
          </FullModal>
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
  background-color: white;

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

const CustomDatePicker = styled.div`
  background: white;
  margin-top: 3vh;

  .react-datepicker{
    border: none !important;
  }
  .react-datepicker__header {
    background-color: white;
    border-bottom: none;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }
  .react-datepicker__day-names{
    font-weight: 700;
    font-size: 1.6vh;
    margin: auto;
    width: 92%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F2F4F8;
    margin-top: 2vh;
    & > div {
      color: #A2A9B0;
      
    }
  }
  .react-datepicker__day {
    padding: 0.5vh;
    border-radius: 50%;
    position: relative;
    margin: 1.5vh 1vh;
    color: #697077;
    font-weight: 600;
    font-size: 2vh;
  }
  .available-date::after {
    content: "•";
    color: #0EAC6A;
    position: absolute;
    font-size: 3vh;
    border-radius: 50%;
    top: 3.5vh;
    right: 40%;
  }

  .disabled-date {
    color: #697077;
    font-weight: 600;
    pointer-events: none;
    font-size: 2vh;
  }

  .react-datepicker__day--selected {
    background-color: #0EAC6A !important;
    color: white !important;
    border-radius: 50% !important;
  }
`;



const Circlebox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 5vh;
`

const CustomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  font-size: 2.3vh;
  font-weight: 500;
  width: 90%;

  button {
    background-color: #F2F4F8;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 2.5vh;
    color: #333;
    margin: 0 1vh;
    & > img {
      height: 1.8vh;
      margin: auto;
      padding: 0;
    }

    &:hover {
      color: #000;
    }
  }
  .buttonbox{
    width: 20%;
  }
`;