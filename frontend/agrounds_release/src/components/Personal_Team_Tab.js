import React from 'react';
import './Personal_Team_Tab.scss';
import { useState } from 'react';

const Personal_Team_Tab = ({activeTab, setActiveTab}) => {

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="my-tabs">
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
          onClick={() => handleTabClick("personal")}
        >
          개인
        </button>
        <button
          className={`tab-button ${activeTab === "team" ? "active" : ""}`}
          onClick={() => handleTabClick("team")}
        >
          팀
        </button>
      </div>
    </div>
  )
};

export default Personal_Team_Tab;