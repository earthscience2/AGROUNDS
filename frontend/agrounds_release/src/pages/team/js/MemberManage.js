import React, { useState, useEffect } from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import '../css/MemberManage.scss';
import Member_Tab from '../../../components/Member_Tab';
import Member from '../../../components/Member';
import logo from '../../../assets/logo_sample.png';
import { useNavigate } from 'react-router-dom';
import Search from '../../../components/Search';
import { getJoinRequestListApi, SearchPlayerByNameAPI, TeamMemberApi } from '../../../function/TeamApi';
import { PositionDotColor } from '../../../function/PositionColor';

const MemberManage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("팀원");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [member, setMember] = useState([]);
  const [requestMember, setRequestMember] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        setMember(TeamMemberApi() || []);
        setSearchResults(SearchPlayerByNameAPI(searchTerm) || []);
        setRequestMember(getJoinRequestListApi() || []);
      } catch (error) {
        console.log(error)
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <div className="membermanage">
      <Back_btn />
      <Login_title title="팀원 관리하기" explain="기존의 팀원을 관리하고 새로운 팀원을 받아보세요" />
      <Member_Tab activeTab={activeTab} onTabChange={handleTabChange} />
      {activeTab === '팀원' ? (
        <div className="managecontents">
          <div className="detail">
            <p className="t1">총</p>
            <p className="t2">{searchResults.length}명</p>
          </div>
          <div className="list">
            {searchResults.map((player) => (
              <Member key={player.user_code} img={logo} searchTerm={searchTerm} player={player.user_nickname} age={player.user_age} color={PositionDotColor(player.user_position)} position={player.user_position} activeTab={activeTab} onClick={() => navigate('/userinfo', {state: { userCode: player.user_code}})} />
            ))}
          </div>
        </div>
      ) : (
        <div className="managecontents">
          <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} onSearchSubmit={() => console.log("Search submitted:", searchTerm)} />
          {isSearching ? (
            <p className="t1">검색 중...</p>
          ) : searchTerm.trim() === "" && searchResults.length === 0 ? (
            <>
              <div className="detail">
                <p className="t1">총</p>
                <p className="t2">{requestMember.length}명</p>
                <p className="t3">의 가입 신청자</p>
              </div>
              <div className="list">
              {requestMember.map((player) => (
                <Member key={player.user_code} img={logo} player={player.user_nickname} age={player.user_email} color={PositionDotColor(player.user_position)} position={player.user_position} activeTab={activeTab} onClick={() => navigate('/userinfo', {state: { userCode: player.user_code}})} />
              ))}
              </div>
            </>
          ) : (
            
            searchResults.map((player) => (
              <Member
                key={player.user_code}
                img={player.img || logo}
                player={player.user_nickname}
                age={player.user_age} 
                color={PositionDotColor(player.user_position)} 
                position={player.user_position} 
                activeTab={activeTab}
                onClick={() => navigate('/userinfo', {state: { userCode: player.user_code}})}
                searchTerm={searchTerm}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MemberManage;
