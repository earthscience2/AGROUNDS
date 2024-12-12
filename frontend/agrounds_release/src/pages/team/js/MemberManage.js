import React, { useState, useEffect } from 'react';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import '../css/MemberManage.scss';
import Member_Tab from '../../../components/Member_Tab';
import Member from '../../../components/Member';
import logo from '../../../assets/logo_sample.png';
import { useNavigate } from 'react-router-dom';
import Search from '../../../components/Search';

const MemberManage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("팀원");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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
        const response = await fetch(`https://api.example.com/search?query=${searchTerm}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
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
            <p className="t2">6명</p>
          </div>
          <div className="list">
            <Member img={logo} player="조규성" searchTerm={searchTerm}age="만 26세" color="red" position="ST" activeTab={activeTab} onClick={() => navigate('/userinfo')} />
            <Member img={logo} player="조규성" searchTerm={searchTerm}age="만 26세" color="#FD7759" position="RWF" activeTab={activeTab} onClick={() => navigate('/userinfo')} />
            <Member img={logo} player="조규성" searchTerm={searchTerm}age="만 26세" color="#FD7759" position="LWM" activeTab={activeTab} onClick={() => navigate('/userinfo')} />
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
                <p className="t2">6명</p>
                <p className="t3">의 가입 신청자</p>
              </div>
              <div className="list">
                <Member img={logo} searchTerm={searchTerm}player="조규성" age="만 26세" color="red" position="ST" activeTab={activeTab} onClick={() => navigate('/userinfo')} />
                <Member img={logo} searchTerm={searchTerm}player="조규성" age="만 26세" color="#FD7759" position="RWF" activeTab={activeTab} onClick={() => navigate('/userinfo')} />
                <Member img={logo} searchTerm={searchTerm}player="조규성" age="만 26세" color="#FD7759" position="LWM" activeTab={activeTab} onClick={() => navigate('/userinfo')} />
              </div>
            </>
          ) : (
            
            searchResults.map((member, index) => (
              <Member
                key={index}
                img={member.img || logo}
                player={member.player}
                age={member.age}
                color={member.color}
                position={member.position}
                activeTab={activeTab}
                onClick={() => navigate('/userinfo')}
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
