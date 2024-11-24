import React, { useState } from 'react';
import './Quarter_Tab.scss';

const Quarter_Tab = ({quarters}) => {
  const [activeTab, setActiveTab] = useState("요약");

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
        {quarters.map((quarter, index) => (
          <button
            key={index}
            className={`tab ${activeTab === `quarter${index + 1}` ? "active" : ""}`}
            onClick={() => handleTabClick(`quarter${index + 1}`)}
          >
            {quarter}쿼터
          </button>
        ))}
      </div>
    </div>
  )
};

export default Quarter_Tab;