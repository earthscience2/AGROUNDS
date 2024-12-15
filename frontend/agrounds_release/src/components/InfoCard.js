import React, { useEffect, useState } from "react";
import "./InfoCard.scss";
import sample from '../assets/logo_sample.png';
import {PositionColor} from "../function/PositionColor";
import { getTeamInfoApi } from "../function/TeamApi";
import Field from "./Field";

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
    <div className="cardBack" style={{ background: backgroundColor }}>
      <div className="row1">
        <div className="info-nick">
          <p className="usernickname">adfaslkdfjas;djfdfk</p>
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
          <div className="date">{dateConversion(userData.recent_match) || '-'}</div>
        </div>
        <div className="info-team">
          <p className="teamname">{teamData.team_name || 'FC Bayern Munchen' }</p>
          <div className="img"><img src={teamData.team_logo || sample} /></div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
