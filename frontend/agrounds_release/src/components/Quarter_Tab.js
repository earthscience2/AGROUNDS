import React, { useState } from 'react';
import './Quarter_Tab.scss';

const Quarter_Tab = ({quarters, activeTab, setActiveTab}) => {

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="quarter-tabs">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => handleTabClick("summary")}
        >
          요약
        </button>
        {Array.from({ length: quarters }, (_, index) => (
          <button
            key={index}
            className={`tab ${activeTab === `${index + 1}쿼터` ? "active" : ""}`}
            onClick={() => handleTabClick(`${index + 1}쿼터`)}
          >
            {index+1}쿼터
          </button>
        ))}
      </div>
    </div>
  )
};

export default Quarter_Tab;