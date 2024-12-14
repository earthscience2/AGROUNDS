import React, { act, useState } from 'react';
import styled from 'styled-components';
import Image_Comp from './Image_Comp';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Small_Common_Btn from './Small_Common_Btn';
import { AcceptPlayerApi, InvitePlayerApi, RemovePlayerApi } from '../function/TeamApi';


const Member = ({ userCode, img, player, age, position, color, onClick, activeTab, searchTerm="" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate();

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };
  console.log(activeTab)

  const closeModal = () => setIsModalOpen(false);

  const teamCode = sessionStorage.getItem("teamCode");
  const payload = { team_code: teamCode, user_code: userCode };

  const handleConfirm = () => {
    switch (modalType) {
      case 'kickout':
        RemovePlayerApi(payload);
        alert(`${player}님을 팀에서 추방했습니다.`);
        window.location.reload();
        break;
      case 'invite':
        InvitePlayerApi(payload);
        alert(`${player}님을 팀에 초대했습니다.`);
        window.location.reload();
        break;
      case 'accept':
        AcceptPlayerApi({...payload, accept: true});
        alert(`${player}님의 요청을 수락했습니다.`);
        window.location.reload();
        break;
      case 'refuse':
        AcceptPlayerApi({...payload, accept: false});
        alert(`${player}님의 요청을 거절했습니다.`);
        window.location.reload();
        break;
      default:
        break;
    }
    closeModal();
    navigate('/teamsetting');
  };

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
      {renderActionButton(activeTab, searchTerm, openModal)}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="errorment">
          {renderModalMessage(modalType, player)}
        </div>
        <div className="buttonbox">
          <Small_Common_Btn
            onClick={closeModal}
            title="취소"
            backgroundColor="#F2F4F8"
            color="black"
          />
          <Small_Common_Btn
            onClick={handleConfirm}
            title="확인"
            backgroundColor="#262626"
            color="white"
          />
        </div>
      </Modal>
    </MemberStyle>
  );
};

const renderActionButton = (activeTab, searchTerm, openModal) => {
  console.log(activeTab)
  if (activeTab === "팀원") {
    return (
      <button className="getoutBtn" onClick={() => openModal("kickout")}>
        추방하기
      </button>
    );
  }

  if (activeTab === "신규" && searchTerm.trim() !== "") {
    return (
      <button className="inviteBtn" onClick={() => openModal("invite")}>
        초대하기
      </button>
    );
  } else {
    return (
      <div className="newteam">
        {/* <p className="time">1분 전</p> */}
        <div className="refuse-accept">
          <button className="refuse" onClick={() => openModal("refuse")}>
            거절
          </button>
          <button className="accept" onClick={() => openModal("accept")}>
            수락
          </button>
        </div>
      </div>
    );
  }
};

const renderModalMessage = (modalType, player) => {
  const messages = {
    kickout: `${player}님을 팀에서 내보내시겠습니까?`,
    invite: `${player}님을 팀에 초대하시겠습니까?`,
    accept: `${player}님을 팀원으로 받으시겠습니까?`,
    refuse: `${player}님의 가입신청을 거절하시겠습니까?`,
  };
  return <span style={{ color: "black" }}>{messages[modalType]}</span>;
};

export default Member;

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