import React from 'react';
import styled from 'styled-components';
import search from '../assets/search.png';

const Search = ({ searchTerm, onSearchChange, onSearchSubmit, placeholder='이름 또는 이메일로 검색', backgroundColor='#F2F4F8' }) => {
  return (
    <SearchStyle backgroundColor={backgroundColor}>
      <img src={search} onClick={onSearchSubmit}/>
      <input placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}/>
    </SearchStyle>
  );
};

export default Search;

const SearchStyle = styled.div`
  display: flex;
  width: 90%;
  align-items: center;
  background-color: ${(props) => props.backgroundColor};
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
    background-color: ${(props) => props.backgroundColor};
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