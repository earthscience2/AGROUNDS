import React from "react";
import "./InfoCard.scss";
import sample from '../assets/logo_sample.png';
import {PositionColor} from "../function/PositionColor";

const InfoCard = ({ position }) => {

  const backgroundColor = PositionColor[position] || "linear-gradient(117.23deg, rgba(92, 139, 245, 0.8), rgba(76, 103, 244) , rgba(114, 192, 250) 80%)";
  console.log(position)
  return (
    <div className="cardBack" style={{ background: backgroundColor }}>
      <div className="info-item">빛현우<p className="age">만 33세, 남성</p></div>
      <div className="info-item">조현우</div>
      <div className="info-item">189cm</div>
      <div className="info-item">75kg</div>
      <div className="info-item">{position}</div>
      <div className="info-item">최근 경기<p className="date">2024<br/>08.20</p></div>
      <div className="info-item">울산 HD FC<div className="img"><img src={sample} /></div></div>
    </div>
  );
};

export default InfoCard;
