import React, { useEffect, useState } from "react";
import sample from '../assets/logo_sample.png';
import {PositionColor} from "../function/PositionColor";
import { getTeamInfoApi } from "../function/TeamApi";
import Field from "./Field";
import styled from "styled-components";

const InfoCard = ({ userData }) => {
  const backgroundColor = PositionColor[userData.user_position] || "linear-gradient(117.23deg, rgba(92, 139, 245, 0.8), rgba(76, 103, 244) , rgba(114, 192, 250) 80%)";

  const [teamData, setTeamData] = useState([]);

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
  return (
    <InfoCardStyle style={{ background: backgroundColor }}>
      <div className="row1">
        <div className="info-nick">
          <p className="usernickname">{userData.user_nickname}</p>
          <p className="age">만 {userData.user_age}세, {genderConversion(userData.user_gender)}</p></div>
        <div className="nhwbox">
          <div className="info-name">
            <p className="username">{userData.user_name || '김민재'}</p>
            </div>
          <div className="info-height">
            <p className="userheight">{`${userData.user_height}cm` || '190cm'}</p>
          </div>
          <div className="info-weight">
            <p className="userweight">{`${userData.user_weight}kg` || '81kg'} </p>
            </div>
        </div>
      </div>
      <div className="row2">
        <p className="info-position">{userData.user_position || 'CB'}</p>
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
  width: 80%;
  height: 50vh;
  margin: 2vh 0;
  border-radius: 2.5vh;
  display: flex;
  flex-direction: column;
  box-shadow: 11px 16px 24px #00000014;
  color: white;
  .row1{
    display: flex;
    flex-direction: row;
    align-items: center;
    .info-nick{
      width: 65%;
      height: 15vh;
      font-size: 4vh;
      font-weight: 600;
      border-bottom: .5px solid white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-family: 'Pretendard-Regular';

      .usernickname{
        margin: 0;
        width: 70%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
      height: 15vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: .5px solid white;
      border-left: .5px solid white;
      font-size: 1.8vh;
      font-weight: 700;
      font-family: 'Pretendard-Regular';
      .info-name{
        width: 100%;
        height: 5vh;
        border-bottom: .5px solid white;
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
        height: 5vh;
        border-bottom: .5px solid white;
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
        height: 5vh;
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
    height: 20vh;
    border-bottom: .5px solid white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    .info-position{
      font-size: 9vh;
      font-weight: 700;
      width: 60%;
    }
    .field{
      width: 20%;
      height: 16vh;
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
      border-right: .5px solid white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .recenttitle{
        font-size: 1.8vh;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.743);
        margin-left: 2vh;
        font-family: 'Pretendard-Regular';
      }
      .date{
        font-size: 1.8vh;
        font-weight: 700;
        color: white;
        margin: 3vh 0 2vh 2vh;
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
        margin: 2vh 0 0 2vh;
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