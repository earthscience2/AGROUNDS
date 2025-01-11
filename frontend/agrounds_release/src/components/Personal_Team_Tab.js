import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

const Personal_Team_Tab = ({activeTab, setActiveTab}) => {

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <PersonalTeamTabStyle>
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
    </PersonalTeamTabStyle>
  )
};

export default Personal_Team_Tab;

const PersonalTeamTabStyle = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: right;

  .tab-buttons {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 16vh;
    height: 4.5vh;
    background-color: rgb(219,223,228);
    margin-bottom: 20px;
    border-radius: 1vh;

    .tab-button {
      color: #A2A9B0;
      font-size: 1.6vh;
      font-weight: bold;
      height: 3.5vh;
      background-color: rgb(219,223,228);
      border: none;
      border-radius: .8vh;
      width: 45%;
      cursor: pointer;
      outline: none;
      transition: background-color 0.3s, color 0.3s;

      &:hover {
        background-color: white;
        color: #262626;
      }

      &.active {
        background-color: white;
        color: #262626;
      }
    }
  }

`