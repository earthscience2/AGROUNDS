import React from 'react';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import MainSummary from '../../../components/Main_Summary';
import '../css/Main.scss';
import Footer from '../../../components/Footer';
import Main_Subject from '../../../components/Main_Subject';
import { Device, MatchPlan, MatchVideo, MyOvr, MyTeam, NoTeam } from '../../../function/SubjectContents';
import RecentMatch from '../../../components/RecentMatch';
import { useNavigate } from 'react-router-dom';
import ovrImage from '../../../assets/ovr.png';
import { PositionDotColor } from '../../../function/PositionColor';

const Main = () => {
  const navigate = useNavigate();
  const userType = sessionStorage.getItem('userType');
  
  // 임시 사용자 데이터 (실제로는 API에서 가져올 데이터)
  const userData = {
    name: "손흥민",
    age: 32,
    position: "CB",
    ovr: 0,
    maxSpeed: 0,
    sprint: 0,
    attackIndex: 0,
    defenseIndex: 0
  };

  return (
    <div className='main'>
      <LogoBellNav logo={true}/>
      <MainSummary/>
      
      {/* 사용자 정보 섹션 */}
      <div className="user-info-section">
        <div className="user-details">
          <span className="user-age">만 {userData.age}세</span>
          <h2 className="user-name">{userData.name}</h2>
        </div>
        <div className="position-badge" style={{ background: PositionDotColor(userData.position) }}>
          {userData.position}
        </div>
      </div>

      {/* 나의 팀 카드 */}
      <div className="team-card">
        <div className="card-header">
          <h3>나의 팀</h3>
          <span className="arrow">→</span>
        </div>
        <p className="team-description">함께할 팀을 찾고 합류해보세요</p>
        <button className="find-team-btn">팀 찾기</button>
      </div>

      {/* 개인분석 카드 */}
      <div className="analysis-card">
        <div className="card-header">
          <h3>개인분석</h3>
          <span className="arrow">→</span>
        </div>
        <div className="radar-chart-placeholder">
          {/* 레이더 차트가 들어갈 자리 */}
        </div>
      </div>

      {/* 나의 OVR 섹션 */}
      <div className="ovr-section">
        <h3>나의 OVR</h3>
        <div className="ovr-chart">
          <img src={ovrImage} alt="OVR Chart" className="ovr-image" />
          <div className="ovr-score">{userData.ovr}</div>
        </div>
        <div className="ovr-stats">
          <div className="stat-item">
            <span className="stat-label">평점</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">스프린트</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">가속도</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">스피드</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">순발력</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">체력</span>
          </div>
        </div>
      </div>

      {/* 추가 능력치 카드들 */}
      <div className="stats-cards">
        <div className="stat-card">
          <h4>최고속력</h4>
          <div className="stat-bar">
            <span className="stat-title">스프린트</span>
            <div className="bar-container">
              <div className="bar-fill" style={{ width: `${userData.sprint}%` }}></div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <h4>공격지수</h4>
          <div className="stat-bar">
            <span className="stat-title">수비지수</span>
            <div className="bar-container">
              <div className="bar-fill" style={{ width: `${userData.defenseIndex}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className='subjectbox'>
        {userType === 'individual' ?
          (<Main_Subject title='나의 팀' BG='#FFFFFF' color='#262626' arrowC='black' arrow={true} children={NoTeam()} onClick={() => navigate('/app/jointeam')}/>):
          (<Main_Subject title='나의 팀' BG='#FFFFFF' color='#262626' arrowC='black' arrow={true} children={MyTeam()} onClick={() => navigate('/app/myteam')}/>)
        }
        <Main_Subject title='나의 OVR' BG='#343A3F' color='#FFFFFF' arrowC='white' arrow={true}children={MyOvr()} onClick={() => navigate('/app/myovr')}/>
        <Main_Subject title='경기 영상' BG='#DADFE5' color='#000000' arrowC='black' arrow={true}children={MatchVideo()} onClick={() => navigate('/app/video')}/>
        <Main_Subject title='GPS 기기' BG='#10CC7E' color='#FFFFFF'arrow={true} arrowC='white'children={Device()}/>
      </div>
      <div className='recentmatchbox'>
        <RecentMatch/>
      </div>
      <Footer />
    </div>
  );
};

export default Main;