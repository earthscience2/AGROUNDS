import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Image_Comp from './Image_Comp';

const MemberPrev = ({ img, player, age, position, color, onClick, name = '조규성'}) => {
  const navigate = useNavigate();

  return (
    <MemberStyle>
      <Image_Comp width="8vh" img={img} onClick={onClick} />
      <div className="playerdetail" onClick={onClick}>
        <p className="t3">{player}</p>
        <p className="t4">{age}</p>
        <div className="posi">
          <div className="dot" style={{ backgroundColor: color }} />
          <p className="position">{position}</p>
        </div>
      </div>
    </MemberStyle>
  );
};

export default MemberPrev;


const MemberStyle = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E5E9ED;
  padding: 1.5vh 0;
  .playerdetail{
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    min-width: 35%;
    .t3{
      font-size: 1.9vh;
      font-weight: 500;
      margin: 0;
    }
    .t4{
      font-size: 1.4vh;
      font-weight: 500;
      color: #6F6F6F;
      margin: .5vh 0;
    }
    .t3f{
      font-size: 2.1vh;
      font-weight: 500;
      margin: 1vh 0 0 0;
    }
    .t4f{
      font-size: 1.6vh;
      font-weight: 500;
      color: #6F6F6F;
      margin: 1vh 0;
    }
    .posi{
    display: flex;
    justify-content: center;
    align-items: center;
    .dot{
      width: .6vh;
      height: .6vh;
      border-radius: 50%;
    }
    .position{
      font-size: 1.5vh;
      font-weight: 600;
      margin: .2vh 0 0 .5vh;
    }
  }
  }
  .posif{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 7vh;
    .dotf{
      width: 1vh;
      height: 1vh;
      border-radius: 50%;
    }
    .positionf{
      font-size: 1.8vh;
      font-weight: 600;
      margin-left: 1vh;
    }
  }
  .getoutBtn{
    border: none;
    height: 4vh;
    width: 8vh;
    border-radius: 3vh;
    font-size: 1.5vh;
    font-weight: 600;
    margin-left: 13%;
  }
  .inviteBtn{
    border: none;
    height: 4vh;
    width: 8vh;
    border-radius: 3vh;
    font-size: 1.5vh;
    font-weight: 600;
    margin-left: 13%;
    background-color: #343A3F;
    color: white;
  }
  .newteam{
    display: flex;
    flex-direction: column;
    justify-content: last baseline;
    align-items: end;
    .time{
      font-size: 1.4vh;
      font-weight: 500;
      color: #6F6F6F;
      margin: 1vh .5vh 1vh 0;
    }
    .refuse-accept{
      display: flex;
      flex-direction: row;
    .refuse{
      border: none;
      width: 6vh;
      height: 4vh;
      border-radius: 1vh;
      font-size: 1.6vh;
      font-weight: 700;
      color: #343A3F;
      background-color: #F2F4F8;
      margin: 0 .3vh;
    }
    .accept{
      border: none;
      width: 6vh;
      height: 4vh;
      border-radius: 1vh;
      font-size: 1.6vh;
      font-weight: 700;
      color: white;
      background-color: #343A3F;
      margin: 0 .3vh;
    }
  }
  }
  
  .errorment{
    font-size: 2vh;
    font-weight: 700;
    color: black;
    height: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: -3vh;
  }
  .buttonbox{
    display: flex;
    flex-direction: row;
    width: 90%;
  }
`