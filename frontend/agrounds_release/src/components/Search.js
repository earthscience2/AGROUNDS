import React from 'react';
import styled from 'styled-components';
import search from '../assets/search.png';

const Search = ({ searchTerm, onSearchChange, onSearchSubmit }) => {
  return (
    <SearchStyle >
      <img src={search} onClick={onSearchSubmit}/>
      <input placeholder='이름 또는 이메일로 검색' 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}/>
    </SearchStyle>
  );
};

export default Search;

const SearchStyle = styled.div`
  display: flex;
  width: 90%;
  background-color: #F2F4F8;
  align-items: center;
  border-radius: 1.5vh;
  height: 6.5vh;
  margin: 1vh 0 2vh 0;
  & > img {
    height: 2.5vh;
    margin: 0 1vh 0 2vh;
  }
  & > input {
    width: 80%;
    border: none;
    background-color: #F2F4F8;
    outline: none;
    font-size: 2vh;
    font-weight: 600;
    &:placeholder-shown{
      font-size: 2vh;
      font-weight: 600;
      color: #C1C7CD;
    }
  }
`