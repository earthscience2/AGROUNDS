import React, { useState, useEffect } from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import '../css/MemberManage.scss';
import Member_Tab from '../../../components/Member_Tab';
import Member from '../../../components/Member';
import logo from '../../../assets/logo_sample.png';
import { useNavigate } from 'react-router-dom';
import Search from '../../../components/Search';
import { getJoinRequestListApi, SearchPlayerByNicknameAPI, getTeamPlayerListApi } from '../../../function/TeamApi';
import { PositionDotColor } from '../../../function/PositionColor';

const MemberManage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("팀원");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [member, setMember] = useState([]);
  const [requestMember, setRequestMember] = useState([]);


  const teamCode = sessionStorage.getItem('teamCode');
  const userNickname = sessionStorage.getItem('userNickname');
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (activeTab === "팀원") {
      getTeamPlayerListApi({ team_code: teamCode })
        .then((response) => setMember(response.data.result))
        .catch((error) => console.log(error));
    } else if (activeTab === "신규") {
      getJoinRequestListApi({ team_code: teamCode })
        .then((response) => setRequestMember(response.data.result))
        .catch((error) => console.log(error));
    }
  }, [activeTab, teamCode]);

    
 useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    SearchPlayerByNicknameAPI({ user_nickname: searchTerm })
      .then((response) => {
        setSearchResults(response.data.result);
        setIsSearching(false);
      })
      .catch((error) => {
        console.log(error);
        setSearchResults([]);
        setIsSearching(false);
      });
  }, [searchTerm]);
  console.log(searchTerm)

  return (
    <div className="membermanage">
      <Back_btn />
      <Login_title
        title="팀원 관리하기"
        explain="기존의 팀원을 관리하고 새로운 팀원을 받아보세요"
      />
      <Member_Tab activeTab={activeTab} onTabChange={handleTabChange} />
      {activeTab === "팀원" ? (
        <div className="managecontents">
          <div className="detail">
            <p className="t1">총</p>
            <p className="t2">{member.length}명</p>
          </div>
          <div className="list">
            {member.map((player) => (
              <Member
                key={player.user_code}
                img={player.user_logo || logo}
                player={player.user_nickname}
                age={`만 ${player.user_age}세`}
                color={PositionDotColor(player.user_position)}
                position={player.user_position}
                activeTab={activeTab}
                onClick={() =>
                  navigate("/userinfo", { state: { userCode: player.user_code } })
                }
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="managecontents">
          <Search
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={() => searchTerm}
          />
          {searchResults.length > 0 ? (
            searchResults.map((player) => (
              <Member
                key={player.user_code}
                img={player.user_logo || logo}
                player={player.user_nickname}
                age={player.user_id}
                color={PositionDotColor(player.user_position)}
                position={player.user_position}
                activeTab={activeTab}
                searchTerm={searchTerm}
                onClick={() =>
                  navigate("/userinfo", { state: { userCode: player.user_code } })
                }
              />
            ))
          ) : (
            <>
              <div className="detail">
                <p className="t1">총</p>
                <p className="t2">{requestMember.length}명</p>
                <p className="t3">의 가입 신청자</p>
              </div>
              <div className="list">
                {requestMember.map((player) => (
                  <Member
                    key={player.user_code}
                    img={player.user_logo || logo}
                    player={player.user_nickname}
                    age={player.user_id}
                    color={PositionDotColor(player.user_position)}
                    position={player.user_position}
                    activeTab={activeTab}
                    searchTerm={searchTerm}
                    onClick={() =>
                      navigate("/userinfo", {
                        state: { userCode: player.user_code },
                      })
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}  

export default MemberManage;
