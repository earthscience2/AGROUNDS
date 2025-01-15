import React, { useState } from 'react';
import styled from 'styled-components';
import down from '../assets/down.png';

const Sort = ({sortOrder, setSortOrder, back='rgb(242,244,246)'}) => {
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'newest' ? 'oldest' : 'newest'));
  };

  return (
    <SortStyle>
      <button onClick={toggleSortOrder} style={{backgroundColor: back}}>
        {sortOrder === 'newest' ? '오래된 순' : '최신순'}
        <img src={down} />
      </button>
    </SortStyle>
  );
};

export default Sort;

const SortStyle = styled.div`
  
  button{
    font-size: 1.7vh;
    font-weight: 500;
    color: #8D8D8D;
    border: none;
    background-color: rgb(242,244,246);
    white-space: nowrap;    
    display: flex;
    justify-content: center;
    img{
      height: 2vh;
      margin-left: .5vh;
    }  
  }
`
