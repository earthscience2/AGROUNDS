import React, { useState, useEffect } from 'react';
import '../css/JoinTeam.scss';
import Back_btn from '../../../components/Back_btn';
import Login_title from '../../../components/Login_title';
import Search from '../../../components/Search';
import reload from '../../../assets/reload.png';
import logo from '../../../assets/logo_sample.png';
import Image_Comp from '../../../components/Image_Comp';
import Modal from '../../../components/Modal';
import Small_Common_Btn from '../../../components/Small_Common_Btn';
import { useNavigate } from 'react-router-dom';
import { ApplyTeamApi, SearchPlayerByNameAPI } from '../../../function/TeamApi';

const JoinTeam = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);


  const openModal = ({team}) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  }
  const closeModal = () => {
    setSelectedTeam(null);
    setIsModalOpen(false);
  }

  const navigate = useNavigate();

  useEffect(() => {
    const SearchResult = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      
      try {
        const response = await SearchPlayerByNameAPI({ team_name: searchTerm });
        setSearchResults(response.data.result || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
      
    };
    SearchResult();
  }, [searchTerm]);

  const application = () => {
    if (selectedTeam) {
      ApplyTeamApi({'user_code': sessionStorage.getItem('userId'), 'team_code': selectedTeam.team_code})
      .then(() => {
        alert('가입신청이 완료되었습니다.');
        closeModal();
      })
      .catch(() => {
        alert('신청 중 오류가 발생했습니다.')
      })
    }
  };

  const renderRecommendedTeams = () => (
    <>
      <div className="recommend">
        <div className="team">추천 팀</div>
        <div className="reload">
          <img src={reload} alt="새로고침" /> 새로고침
        </div>
      </div>
      {searchResults.map((team) => (
        <div className="contentsbox" key={team.team_code}>
        <Image_Comp width="8vh" img={team.team_logo} />
        <div className="textbox">
          <div className="fcname">{team.team_name}</div>
          {/* <div className="minitext">
            <div className="greytext">성남시</div>
            <div className="greybar" />
            <div className="greytext">44명</div>
            <div className="greybar" />
            <div className="greytext">24.09.21</div>
          </div> */}
        </div>
        <button className="application" onClick={openModal(team)}>
          가입신청
        </button>
      </div>
      ))}
    </>
  );

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <>
          <div className="resultnum">
            <p>{searchResults.length}</p>개의 검색 결과
          </div>
          <div className="no-results">
            <p>찾으시는 팀이 없으신가요?</p>
            <p>새롭게 팀을 만들고 마음에 드는 선수들을 영입해보세요.</p>
            <button className="create-team-btn" onClick={() => navigate('/maketeam')}>
              새로운 팀 만들기
            </button>
          </div>
        </>
        
      );
    }
    return (
      <>
        <div className="resultnum">
          <p>{searchResults.length}</p>개의 검색 결과
        </div>
        {searchResults.map((team) => (
          <div key={team.team_code} className="contentsbox">
            <Image_Comp width="8vh" img={team.team_logo || logo} />
            <div className="textbox">
              <div className="fcname">{team.team_name}</div>
              {/* <div className="minitext">
                <div className="greytext">{team.location}</div>
                <div className="greybar" />
                <div className="greytext">{team.members}명</div>
                <div className="greybar" />
                <div className="greytext">{team.createdAt}</div>
              </div> */}
            </div>
            <button className="application" onClick={openModal(team)}>
              가입신청
            </button>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="jointeam">
      <Back_btn />
      <Login_title title="팀 가입하기" explain="새로운 팀을 찾아서 팀원들과 함께 해보세요." />
      <Search
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      {isSearching ? (
        <p className="t1">검색 중...</p>
      ) : searchTerm.trim() === '' && searchResults.length === 0 ? (
        renderRecommendedTeams()
      ) : (
        renderSearchResults()
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="errorment">
            <span style={{ color: '#0EAC6A' }}>Agrounds FC</span>팀에 가입신청 하시겠습니까?
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
