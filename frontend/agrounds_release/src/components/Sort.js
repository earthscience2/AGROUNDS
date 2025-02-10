import React, { useState } from 'react';
import styled from 'styled-components';
import down from '../assets/down.png';

const Sort = ({ sortOrder, setSortOrder, back = 'rgb(242,244,246)' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsOpen(false);
  };

  return (
    <SortStyle>
      <button onClick={toggleDropdown} style={{ backgroundColor: back }}>
        {sortOrder === 'newest' ? '최신순' : '오래된 순'}
        <img src={down} alt="dropdown" />
      </button>
      {isOpen && (
        <DropdownMenu>
          <DropdownItem onClick={() => handleSortChange('newest')}>최신순</DropdownItem>
          <DropdownItem onClick={() => handleSortChange('oldest')}>오래된 순</DropdownItem>
        </DropdownMenu>
      )}
    </SortStyle>
  );
};

export default Sort;

const SortStyle = styled.div`
  position: relative;
  display: inline-block;

  button {
    font-size: 1.7vh;
    font-weight: 500;
    color: #8d8d8d;
    border: none;
    background-color: rgb(242, 244, 246);
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding: 1vh 2vh;
    cursor: pointer;
    border-radius: 4px;

    img {
      height: 2vh;
      margin-left: 0.5vh;
      transition: transform 0.3s;
    }
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 15%;
  background-color: white;
  border: none;
  border-radius: .8vh;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-top: 0.5vh;
  z-index: 10;
  min-width: 100%;
  width: 12vh;
`;

const DropdownItem = styled.div`
  padding: 1.8vh 2vh;
  font-size: 1.7vh;
  color: #525252;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'Pretendard';
  font-weight: 500;
  border-bottom: 1px solid #F2F4F8;
  border-width: 80%;

  &:hover {
    background-color: #f0f0f0;
  }
`;
