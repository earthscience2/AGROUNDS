import React from 'react';
import InfoCard from '../../../components/InfoCard'; 
import { PositionBackColor } from "../../../function/PositionColor";
import "../css/TeamList.scss";
import LeftWhite from "../../../assets/left-white.png";
import { useNavigate } from "react-router-dom";

const TeamList = () => {
  const navigate = useNavigate();

  return (
    <div className="userinfo" style={{background: 'white'}}>
      <div className="backdiv">
        <div className="backBtn" onClick={() => navigate(-1)}>
          <img className="back" src={LeftWhite} />
        </div>
      </div>
      <div className="cards-container">
        <InfoCard position="GK" />
        <InfoCard position="RWF" />
        <InfoCard position="LWM" />
        <InfoCard position="LWB" />
      </div>
    </div>
  );
};

export default TeamList;