import React, { useState } from 'react';
import styled from 'styled-components';
import Back_btn from '../../components/Back_btn';
import Login_title from '../../components/Login_title';
import Search from '../../components/Search';
import { findStadium } from '../../function/GpsApi';
import location from '../../assets/location_noback.png';

const FindStadium = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stadiumResult, setStadiumResult] = useState([]);

  const data = {
    'keyword': searchTerm
  }
  const onSearchSubmit = () => {
    findStadium(data)
    .then((response) => {
      console.log(response.data.result)
      setStadiumResult(response.data.result)
    })
    .catch((error) => {
      console.log(error)
    })
  }
  return (
    <FindStadiumStyle>
      <Back_btn />
      <Login_title title={'경기장 선택'}/>
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} onSearchSubmit={onSearchSubmit}/>
      {stadiumResult.map((stadium) => (
        <div className='resultbox'>
          <img src={location} />
          <div className='contentbox'>
            <p className='ground_name'>{stadium.ground_name}</p>
            <p className='ground_location'>{stadium.ground_location}</p>
          </div>
        </div>
      ))}
      
    </FindStadiumStyle>
  );
};

export default FindStadium;

const FindStadiumStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .resultbox{
    display: flex;
    justify-content: start;
    align-items: start;
    width: 90%;
    margin-top: 3vh;
    img{
      height: 2.8vh;
    }
    .contentbox{
      display: flex;
      flex-direction: column;
      margin-left: 2vh;
      .ground_name{
        font-size: 2.1vh;
        margin: 0;
        font-family: 'regular';
        font-weight: 700;
      }
      .ground_location{
        font-size: 1.8vh;
        font-family: 'regular';
        color: #8D8D8D;
        margin: 1vh 0;
      }
    }
  }
`