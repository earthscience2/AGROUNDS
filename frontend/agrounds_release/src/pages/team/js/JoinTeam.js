import React, { useState, useEffect } from "react";
import "../css/JoinTeam.scss";
import Back_btn from "../../../components/Back_btn";
import Login_title from "../../../components/Login_title";
import Search from "../../../components/Search";
import reload from "../../../assets/reload.png";
import logo from "../../../assets/logo_sample.png";
import Image_Comp from "../../../components/Image_Comp";
import Modal from "../../../components/Modal";
import Small_Common_Btn from "../../../components/Small_Common_Btn";
import { useNavigate } from "react-router-dom";
import { ApplyTeamApi, searchTeamByNameApi } from "../../../function/TeamApi";

const JoinTeam = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const navigate = useNavigate();

  const openModal = (team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTeam(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      setIsSearching(true);

      try {
        const response = await searchTeamByNameApi({
          team_name: searchTerm.trim(), 
        });
        setSearchResults(response.data.result);
      } catch (error) {
        console.log(error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchTeams();
  }, [searchTerm]);
  console.log(selectedTeam)

  const application = () => {
    if (selectedTeam) {
      ApplyTeamApi({
        "user_code": sessionStorage.getItem("userCode"),
        "team_code": selectedTeam.team_code,
      })
        .then(() => {
          alert("가입신청이 완료되었습니다.");
          closeModal();
        })
        .catch((error) => {
          console.log(error)
          alert("신청 중 오류가 발생했습니다.");
        });
    }
  };

  const renderTeams = (teams) =>
    teams.map((team) => (
      <div className="contentsbox" key={team.team_code}>
        <Image_Comp width="8vh" img={team.team_logo || logo} />
        <div className="textbox">
          <div className="fcname">{team.team_name}</div>
        </div>
        <button className="application" onClick={() => openModal(team)}>
          가입신청
        </button>
      </div>
    ));

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div className="no-results">
          <p>찾으시는 팀이 없으신가요?</p>
          <p>새롭게 팀을 만들고 마음에 드는 선수들을 영입해보세요.</p>
          <button
            className="create-team-btn"
            onClick={() => navigate("/app/maketeam")}
          >
            새로운 팀 만들기
          </button>
        </div>
      );
    }
    return renderTeams(searchResults);
  };

  return (
    <div className="jointeam">
      <Back_btn />
      <Login_title
        title="팀 가입하기"
        explain="새로운 팀을 찾아서 팀원들과 함께 해보세요."
      />
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {isSearching ? (
        <p className="t1">검색 중...</p>
      ) : searchTerm.trim() === "" ? (
        <>
          <div className="recommend">
            <div className="team">추천 팀</div>
            <div className="reload">
              <img
                src={reload}
                alt="새로고침"
                onClick={() => setSearchTerm("")} // 추천 팀 새로 불러오기
              />
              새로고침
            </div>
          </div>
          {renderTeams(searchResults)}
        </>
      ) : (
        renderSearchResults()
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="errorment">
            <span style={{ color: "#0EAC6A" }}>
              {selectedTeam?.team_name}
            </span>
            팀에 가입신청 하시겠습니까?
          </div>
          <div className="buttonbox">
            <Small_Common_Btn
              onClick={closeModal}
              title="취소"
              backgroundColor="#F2F4F8"
              color="black"
            />
            <Small_Common_Btn
              onClick={application}
              title="확인"
              backgroundColor="#262626"
              color="white"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default JoinTeam;
