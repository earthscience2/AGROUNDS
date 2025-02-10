import React, { useState } from 'react';
import styled from 'styled-components';

const Quarter_Tab = ({quarterData, activeTab, setActiveTab, type}) => {

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const typeReturn = () => {
    if(type === 'personal'){
      return <button
        className={`tab ${activeTab === "summary" ? "active" : ""}`}
        onClick={() => handleTabClick("summary")}
      >
        요약
      </button>
    } else {
      return ''
    }
  }

  return (
    <QuarterTabStyle>
      <div className="tabs">
        {typeReturn()}
        {quarterData.map((value, index)=>(
           <button
           key={index}
           className={`tab ${activeTab === value.quarter ? "active" : ""}`}
           onClick={() => handleTabClick(value.quarter)}
         >
           {value.quarter}
         </button>
        ))}
        {/* {Array.from({ length: quarterData?.length }, (_, index) => (
          <button
            key={index}
            className={`tab ${activeTab === `${index + 1}쿼터` ? "active" : ""}`}
            onClick={() => handleTabClick(`${index + 1}쿼터`)}
          >
            {quarterData[index].quarter}
          </button>
        ))} */}
      </div>
    </QuarterTabStyle>
  )
};

export default Quarter_Tab;

const QuarterTabStyle = styled.div`
  width: 100%;
  /* margin: 4vh auto 0 auto; */

  .tabs {
    display: flex;
    border-bottom: 1px solid #DADFE5;
    margin-bottom: 20px;

    .tab {
      color: #C6C6C6;
      font-size: 1.8vh;
      font-weight: bold;
      font-family: 'Pretendard';
      padding: .7vh 0;
      margin: 0 2% 0 6%;
      border: none;
      border-radius: 5px 5px 0 0;
      cursor: pointer;
      outline: none;
      background-color: white;
      transition: background-color 0.3s, color 0.3s;

      &:hover {
        border-bottom: .4vh solid #262626;
        color: #262626;
      }

      &.active {
        border-bottom: .4vh solid #262626;
        color: #262626;
      }
    }
  }

`