import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import down from '../assets/down.png';

const positions = ["전체", "LWF", "ST", "RWF", "LWM" , "CAM", "RWM", "LM", "CM", "RM", "CDM", "LWB", "RWB" , "LB", "CB", "RB", "GK"];

const PositionDropbox = ({ teamData, setFilteredData }) => {
  const [selectedPosition, setSelectedPosition] = useState("포지션 별");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePositionChange = (position) => {
    setSelectedPosition(position);
    setIsDropdownOpen(false);
    if (position === "포지션 별" || position === '전체') {
      setFilteredData(teamData);
    } else {
      const filtered = teamData.filter((player) => player.user_position === position);
      setFilteredData(filtered);
    }
  };

  return (
    <PositionDropBoxStyle>
      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {selectedPosition} <img className='downbtn' src={down} />
      </button>
      {isDropdownOpen && (
        <Dropdown>
          {positions.map((pos) => (
            <div key={pos} onClick={() => handlePositionChange(pos)}>
              {pos}
            </div>
          ))}
        </Dropdown>
      )}
    </PositionDropBoxStyle>
  );
};

export default PositionDropbox;

const PositionDropBoxStyle = styled.div`
  position: relative;
  margin: 10px 0;

  button {
    cursor: pointer;
    border: none;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.6vh;
    font-weight: 600;
    color: #8D8D8D;
    gap: .5vh;
    padding: 0;
    .downbtn{
      height: 1.6vh;
      
    }
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 4vh;
  right: 0;
  background: white;
  border: 1px solid white;
  border-radius: 1vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 15vh;
  height: 30vh;
  overflow-y: scroll;
  font-size: 1.5vh;
  font-weight: 400;
  color: #525252;
  &:last-child{
    border: none;
  }

  div {
    cursor: pointer;
    padding: 2vh 2vh;
    border-bottom: 1px solid #F2F4F8;
    
    &:hover {
      background: #f0f0f0;
    }
  }
`;