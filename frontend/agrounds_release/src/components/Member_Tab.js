import React, { useState } from 'react';
import styled from 'styled-components';

const Member_Tab = () => {
  const [activeTab, setActiveTab] = useState("팀원");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MemberTabStyle>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "팀원" ? "active" : ""}`}
          onClick={() => handleTabClick("팀원")}
        >
          팀원
        </button>
        <button
          className={`tab ${activeTab === "신규" ? "active" : ""}`}
          onClick={() => handleTabClick("신규")}
        >
          신규
        </button>
      </div>
    </MemberTabStyle>
  );
};

export default Member_Tab;


const MemberTabStyle = styled.div`
  width: 100%;
  margin: 0 auto;
  .tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #DADFE5;
    margin-bottom: 20px;
    width: 100%;

    .tab {
      color: #C6C6C6;
      font-size: 2.1vh;
      font-weight: bold;
      padding: 1vh 8vh;
      margin: 0 1vh;
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