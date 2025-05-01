import React, { useEffect, useState } from 'react';
import '../css/Anal.scss';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import TotalAnal from '../../../components/TotalAnal';
import Personal_Team_Tab from '../../../components/Personal_Team_Tab';
import Footer from '../../../components/Footer';
import { getMatchListApi, getTeamMatchList } from '../../../function/MatchApi';
import paper from '../../../assets/ico_paper.png';
import { useNavigate } from 'react-router-dom';
import Sort from '../../../components/Sort';

const Anal = () => {
  const [personalMatchData, setPersonalMatchData] = useState([]);
  const [teamMatchData, setTeamMatchData] = useState([]);
  const [activeTab, setActiveTab] = useState('personal'); 
  const [sortOrder, setSortOrder] = useState('newest'); 

  const navigate = useNavigate();

  useEffect(() => {
    getMatchListApi({ user_code: sessionStorage.getItem('userCode') })
      .then((response) => {
        setPersonalMatchData(response.data.result || []);
      })
      .catch((error) => console.log(error));

    getTeamMatchList({ team_code: sessionStorage.getItem('teamCode'), user_code: sessionStorage.getItem('userCode') })
      .then((response) => {
        setTeamMatchData(response.data.result || []);
      })
      .catch((error) => console.log(error));
  }, []);

  const getSortedData = (data) => {
    return [...data].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.match_schedule) - new Date(a.match_schedule); 
      } else {
        return new Date(a.match_schedule) - new Date(b.match_schedule); 
      }
    });
  };

  const currentData = activeTab === 'personal' ? getSortedData(personalMatchData) : getSortedData(teamMatchData);

  return (
    <div className="anal">
      <LogoBellNav />
      <div className="anal-box">
        <p className="anal-title">경기 분석</p>
        <Personal_Team_Tab activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="line"></div>

      {currentData.length === 0 ? (
        <>
          <div className="total-play">
            총 <p style={{ marginLeft: '.5vh' }}>{currentData.length}개</p>의 경기
          </div>
          <div className="anal-nocontents">
            <img src={paper} alt="No Matches" />
            <p className="anal-contenttitle">경기 내역이 없습니다</p>
            <div className="anal-content">
              새로운 팀을 찾아서 팀원들과 경기를 하고<br /> 에이그라운즈에서 제공하는 분석 데이터를 받아보세요!
            </div>
            <div className="anal-btn" onClick={() => navigate('/app/jointeam')}>
              새로운 팀 찾아보기
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="sort-box">
            <div className="total-play">
              총 <p style={{ marginLeft: '.5vh' }}>{currentData.length}개</p>의 경기
            </div>
            <Sort sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>

          <div className="list">
            {currentData.map((data, index) => (
              <TotalAnal key={index} data={data} type={activeTab} />
            ))}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Anal;