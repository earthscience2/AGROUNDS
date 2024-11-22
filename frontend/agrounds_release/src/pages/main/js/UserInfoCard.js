import React from "react";
import LeftWhite from "../../../assets/left-white.png";
import "../css/UserInfoCard.scss";
import { useNavigate } from "react-router-dom";
import InfoCard from "../../../components/InfoCard"; 
import { PositionBackColor } from "../../../function/PositionColor";

const UserInfoCard = () => {
  const navigate = useNavigate();

  const backgroundColor = PositionBackColor["CM"] || "linear-gradient(117.23deg, rgba(92, 139, 245, 0.8), rgba(76, 103, 244) , rgba(114, 192, 250) 80%)";

  return (
    <div className="userinfo" style={{background: backgroundColor}}>
      <div className="backdiv">
        <div className="backBtn" onClick={() => navigate(-1)}>
          <img className="back" src={LeftWhite} />
        </div>
      </div>
      <InfoCard position="CM" />
    </div>
  );
};

export default UserInfoCard;
