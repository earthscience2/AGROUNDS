import React, { useEffect, useState } from "react";
import sample from '../assets/user-grey.png';
import {PositionColor} from "../function/PositionColor";
import { getTeamInfoApi } from "../function/TeamApi";
import Field from "./Field";
import styled from "styled-components";
import red from '../assets/card-red.png';
import blue from '../assets/card-blue.png';
import green from '../assets/card-green.png';
import yellow from '../assets/card-yellow.png';

const InfoCard = ({ userData }) => {
  const [teamData, setTeamData] = useState([]);
  const position = userData.user_position;

  useEffect(() => {
    getTeamInfoApi({"team_code" : userData.user_team})
    .then((response) => {
      setTeamData(response.data)
    })
    .catch(error => console.log(error));

  }, [userData]);

  const genderConversion = (gender) => {
    if (gender==="male") {
      return '남성'
    } return '여성'
  }


  const dateConversion = (date) => {
    if (date === undefined) return '-';
    const [year, month, day] = date.split('-');
    return (
      <>
        {year}<br />{`${month}.${day}`}
      </>
    );
  }

  const ellipse = () => {
    if (position === 'LWF' || position === 'ST' || position === 'RWF') {
      return red;
    } else if (position === 'LWM' || position === 'CAM' || position === 'RWM' || position === 'LM' || position === 'CM' || position === 'RM'|| position === 'CDM') {
      return green;
    } else if (position === 'LWB' || position === 'RWB' || position === 'LB' || position === 'CB' || position === 'RB' ){
      return blue;
    } else {
      return yellow;
    }
  }

  const dynamicFontSize = (nickname) => {
    if (nickname.length <= 6) return "4vh";
    if (nickname.length <= 10) return "2.8vh";
    return "2.5vh";
  };

  return (
    <InfoCardStyle>
      <img className='card-back' src={ellipse()} />
      <div className="row1">
        <div className="info-nick">
          <p className="usernickname" style={{ fontSize: dynamicFontSize(userData.user_nickname || '') }}>{userData.user_nickname}</p>
          <p className="age">만 {userData.user_age}세, {genderConversion(userData.user_gender) }</p></div>
        <div className="nhwbox">
          <div className="info-name">
            <p className="username">{userData.user_name || '-'}</p>
            </div>
          <div className="info-height">
            <p className="userheight">{`${userData.user_height}cm` || '-'}</p>
          </div>
          <div className="info-weight">
            <p className="userweight">{`${userData.user_weight}kg` || '-'} </p>
            </div>
        </div>
      </div>
      <div className="row2">
        <p className="info-position">{userData.user_position || '-'}</p>
        <div className="field">
          <Field selectedPosition={userData.user_position}/>
        </div>
      </div>
      <div className="row3">
        <div className="info-recent">
          <div className="recenttitle">최근 경기</div>
          <div className="date">{dateConversion(userData.recent_match_date) || '-'}</div>
        </div>
        <div className="info-team">
          <p className="teamname">{teamData.team_name || '-' }</p>
          <div className="img"><img src={teamData.team_logo || sample} /></div>
        </div>
      </div>
    </InfoCardStyle>
  );
};

export default InfoCard;


const InfoCardStyle = styled.div`
  position: relative; 
  width: 80%;
  height: 53vh;
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
  .card-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%; 
    height: 100%; 
    z-index: 0;
  }
  .row1, .row2, .row3 {
    z-index: 1;
    position: relative;
  }
  .row1{
    display: flex;
    flex-direction: row;
    align-items: center;
    .info-nick{
      width: 65%;
      height: 17vh;
      font-size: 4vh;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-family: 'Pretendard-Regular';

      .usernickname{
        margin: 0;
        width: 70%;
        margin-left: 2vh;
        font-family: 'Pretendard-Regular';
      }
      .age{
        font-size: 1.7vh;
        font-weight: 500;
        margin: 1vh 0 0 2vh;
        font-family: 'Pretendard-Regular';
      }
    }
    .nhwbox{
      width: 35%;
      height: 17vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 1.8vh;
      font-weight: 700;
      font-family: 'Pretendard-Regular';
      .info-name{
        width: 100%;
        height: 5.5vh;
        display: flex;
        align-items: center;
        .username{
          margin: 0;
          width: 70%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 1vh;
        }
      }
      .info-height{
        width: 100%;
        height: 5.5vh;
        display: flex;
        align-items: center;
        .userheight{
          margin: 0;
          width: 70%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 1vh;
        }
      }
      .info-weight{
        width: 100%;
        height: 5.5vh;
        display: flex;
        align-items: center;
        .userweight{
          margin: 0;
          width: 70%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 1vh;
        }
      }
    }
  }
  .row2{
    width: 100%;
    height: 21vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .info-position{
      font-size: 9vh;
      font-weight: 700;
      width: 50%;
      font-family: "Anton", serif;
      font-weight: 400;
      font-style: normal;
      margin-left: 10%;
    }
    .field{
      width: 30%;
      height: 17vh;
      display: flex;
      justify-content: center;
    }
  }
  .row3{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    .info-recent{
      height: 15vh;
      width: 40%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .recenttitle{
        font-size: 1.6vh;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.743);
        margin-left: 2vh;
        margin-top: 1vh;
        font-family: 'Pretendard-Regular';
      }
      .date{
        font-size: 1.8vh;
        font-weight: 700;
        color: white;
        margin: 4vh 0 2vh 2vh;
        width: 70%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: 'Pretendard-Regular';
        
      }
    }
    .info-team{
      height: 15vh;
      width: 60%;
      
      .teamname{
        font-size: 1.8vh;
        font-weight: 700;
        font-family: 'Pretendard-Regular';
        margin: 1.8vh 0 0 2vh;
        display: -webkit-box;
        -webkit-line-clamp: 2; 
        -webkit-box-orient: vertical;
        overflow: hidden;
        width: 70%;
        text-overflow: ellipsis;
      }
      .img{
        
        margin-top: 3vh;
        margin-left: 14vh;  
        width: 6vh;
        height: 6vh;
        border-radius: 50%;
        overflow: hidden; 
        display: flex; 
        justify-content: center;
        align-items: center;
        background-color: white;
        img{
          object-fit: contain;
          width: 6.5vh;
          height: 6.5vh;
        }
      }
    }
  }

`