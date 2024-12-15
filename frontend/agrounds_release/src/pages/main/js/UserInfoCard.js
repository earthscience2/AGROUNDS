import React, { useEffect, useState } from "react";
import LeftWhite from "../../../assets/left-white.png";
import "../css/UserInfoCard.scss";
import { useLocation, useNavigate } from "react-router-dom";
import InfoCard from "../../../components/InfoCard"; 
import { PositionBackColor } from "../../../function/PositionColor";
import { getPlayerInfoApi } from "../../../function/TeamApi";

const UserInfoCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState([]);

  const userCode = location.state.userCode;

  useEffect(() => {
    getPlayerInfoApi({"user_code" : userCode})
    .then((response) => {
      setUserData(response.data);
    })
    .catch((error) => console.log(error));
  }, [userCode])
  
  const backgroundColor = PositionBackColor[userData.user_position] || "linear-gradient(117.23deg, rgba(92, 139, 245, 0.2), rgba(76, 103, 244, 0.2) , rgba(114, 192, 250, 0.2) 80%)";

  return (
    <div className="userinfo" style={{background: backgroundColor}}>
      <div className="backdiv">
        <div className="backBtn" onClick={() => navigate(-1)}>
          <img className="back" src={LeftWhite} />
        </div>
      </div>
      <InfoCard userData={userData} />
    </div>
  );
};

export default UserInfoCard;
