import React, { useEffect, useState } from 'react';
import InfoCard from '../../../components/InfoCard'; 
import "../css/TeamList.scss";
import LeftWhite from "../../../assets/left-white.png";
import { useNavigate } from "react-router-dom";
import { getTeamPlayerListApi } from '../../../function/TeamApi';
import { PositionBackColor } from '../../../function/PositionColor';

const TeamList = () => {
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    getTeamPlayerListApi({ "team_code": sessionStorage.getItem('teamCode')})
    .then((response) => {
      setTeamData(response.data.result || []);
    })
    .catch((error) => console.error(error));

  }, [sessionStorage.getItem('teamCode')])

  return (
    <div className="userinfo" >
      <div className="backdiv">
        <div className="backBtn" onClick={() => navigate(-1)}>
          <img className="back" src={LeftWhite} alt="Back" />
        </div>
      </div>
      <div className="cards-container">
        {teamData.map((data) => {
          const backgroundColor = PositionBackColor[data.user_position] || "transparent";
          console.log('backgrount: ', backgroundColor)
          return (
            <div className='infoBack' style={{background: backgroundColor}}>
              <InfoCard userData={data} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamList;
