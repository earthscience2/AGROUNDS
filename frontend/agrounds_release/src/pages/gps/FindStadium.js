import React, { useState } from 'react';
import styled from 'styled-components';
import Back_btn from '../../components/Back_btn';
import Login_title from '../../components/Login_title';
import Search from '../../components/Search';
import { findStadium } from '../../function/GpsApi';
import location from '../../assets/location_noback.png';
import { useNavigate } from 'react-router-dom';

const FindStadium = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stadiumResult, setStadiumResult] = useState([]);

  const data = {
    'keyword': searchTerm
  }
  const onSearchSubmit = () => {
    findStadium(data)
    .then((response) => {
      setStadiumResult(response.data.result)
    })
    .catch((error) => {
      console.log(error)
    })
  }
  const navigate = useNavigate();

  const DirectInputStadium = () => {
    navigate('/app/direct-input-stadium')
  }
  return (
    <FindStadiumStyle>
      <Back_btn />
      <Login_title title={'경기장 선택'}/>
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} onSearchSubmit={onSearchSubmit}/>
      {stadiumResult.length === 0 ?
        (
          <div className='noresult'>검색결과가 없습니다.</div>
        )
        :
        (
          stadiumResult.map((stadium) => (
            <div key={stadium.ground_code} className='resultbox' onClick={() => navigate('/app/search-stadium-by-map', {state: {groundCode: stadium.ground_code}})}>
              <img src={location} />
              <div className='contentbox'>
                <p className='ground_name'>{stadium.ground_name}</p>
                <p className='ground_location'>{stadium.ground_location}</p>
              </div>
            </div>
            
          ))
        )
      }
        {/* <Direct onClick={DirectInputStadium}>
          <img src={plus} />
          <p>직접입력</p>
        </Direct> */}
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
  .noresult{
    margin-top: 10vh;
    font-size: 2vh;
    font-family: 'regular';
    font-weight: 700;
  }
`
const Direct = styled.div`
  width: 15vh;
  border-radius: 5vh;
  height: 6vh;
  background-color: #21272A;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 10vh;
  img{
    height: 2.5vh;
    margin: 0 0 0 2vh;
  }
  p{
    font-family: 'regular';
    font-size: 2vh;
    font-weight: 600;
    color: white;
    margin: 0 3vh 0 0;
  }

  `