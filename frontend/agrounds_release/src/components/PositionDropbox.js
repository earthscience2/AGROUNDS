import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const positions = ["ALL", "ST", "CM", "CB", "GK"];

const PositionDropbox = ({ teamData, setFilteredData }) => {
  const [selectedPosition, setSelectedPosition] = useState("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePositionChange = (position) => {
    setSelectedPosition(position);
    setIsDropdownOpen(false);
    if (position === "ALL") {
      setFilteredData(teamData);
    } else {
      const filtered = teamData.filter((player) => player.user_position === position);
      setFilteredData(filtered);
    }
  };

  return (
    <PositionDropBoxStyle>
      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {selectedPosition} ▼
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
    padding: 8px 16px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 40px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;

  div {
    padding: 10px;
    cursor: pointer;
    &:hover {
      background: #f0f0f0;
    }
  }
`;