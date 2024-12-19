import React, { useEffect, useState } from 'react';
import InfoCard from '../../../components/InfoCard'; 
import { PositionBackColor } from "../../../function/PositionColor";
import "../css/TeamList.scss";
import LeftWhite from "../../../assets/left-white.png";
import { useNavigate } from "react-router-dom";
import { getTeamPlayerListApi } from '../../../function/TeamApi';

const TeamList = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);
  const [teamCode, setTeamCode] = useState(sessionStorage.getItem('teamCode'));

  useEffect(() => {
    if (teamCode) {
      getTeamPlayerListApi({ "team_code": teamCode })
        .then((response) => {
          setUserData(response.data.result || []);
          console.log(response.data)
        })
        .catch((error) => console.error(error));
    }
  }, [teamCode]);
  // const backgroundColor = PositionBackColor[userData[0].user_position || 'GK'];

  return (
    <div className="userinfo" >
      <div className="backdiv">
        <div className="backBtn" onClick={() => navigate(-1)}>
          <img className="back" src={LeftWhite} alt="Back" />
        </div>
      </div>
      <div className="cards-container">
        {userData.map((data, index) => {
          const backgroundColor = PositionBackColor[data.user_position || 'GK'];
          return (
            <InfoCard key={index} userData={data} style={{ background: backgroundColor }} />
          );
        })}
      </div>
    </div>
  );
};

export default TeamList;
