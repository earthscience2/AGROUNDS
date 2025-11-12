import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/Join_Team.scss';
// 팀 관련 API 함수들 import
import { SearchTeamsApi, GetRecommendedTeamsApi, GetTeamLogoApi } from '../../../function/api/user/userApi';
// 승인된 아이콘 디렉토리 사용
import defaultTeamLogo from '../../../assets/main_icons/team_gray.png';
import searchIcon from '../../../assets/main_icons/search_gray.png';
import backIcon from '../../../assets/main_icons/back_black.png';
import refreshIcon from '../../../assets/main_icons/refresh_black.png';
import sortIcon from '../../../assets/main_icons/sort_black.png';

const JoinTeam = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamLogos, setTeamLogos] = useState({});
  const [sortOption, setSortOption] = useState('latest'); // 'latest', 'members', 'name'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showTestAccountModal, setShowTestAccountModal] = useState(false);

  // 모달 열림/닫힘 시 배경 스크롤 제어
  useEffect(() => {
    if (showTestAccountModal) {
      // 모달 열릴 때 배경 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      // 모달 닫힐 때 배경 스크롤 복구
      document.body.style.overflow = 'auto';
    }
    
    // 컴포넌트 언마운트 시 스크롤 복구
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showTestAccountModal]);

  // 팀 로고 이미지 가져오기 함수 (API 기반)
  const getTeamLogoUrl = async (teamCode) => {
    if (!teamCode) return defaultTeamLogo;
    
    try {
      const response = await GetTeamLogoApi(teamCode);
      
      if (response.data.exists && response.data.image_url) {
        return response.data.image_url;
      } else {
        return defaultTeamLogo;
      }
    } catch (error) {
      return defaultTeamLogo;
    }
  };

  // 팀 목록 로드
  const loadTeams = useCallback(async (searchKeyword = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (searchKeyword.trim()) {
        // 검색어가 있으면 검색 API 호출
        response = await SearchTeamsApi(searchKeyword.trim(), 1, 10);
      } else {
        // 검색어가 없으면 추천 팀 목록 조회 (상위 10개만)
        response = await GetRecommendedTeamsApi(10);
      }

      if (response.data) {
        let teamsData = [];
        // 검색 API 응답 구조와 추천 API 응답 구조가 다르므로 처리
        if (searchKeyword.trim()) {
          // 검색 API 응답: { teams: [...], total_count: N, ... }
          teamsData = response.data.teams || [];
        } else {
          // 추천 API 응답: { success: true, teams: [...], count: N }
          teamsData = response.data.teams || [];
        }
        
        // 최대 10개로 제한하고 생성 날짜 기준 최신순 정렬
        teamsData = teamsData
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10);
        
        setTeams(teamsData);
        
        // 각 팀의 로고를 비동기로 로드
        teamsData.forEach(async (team) => {
          const logoUrl = await getTeamLogoUrl(team.team_code);
          setTeamLogos(prev => ({
            ...prev,
            [team.team_code]: logoUrl
          }));
        });
      } else {
        setError('팀 목록을 불러오는데 실패했습니다.');
        setTeams([]);
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 팀 정렬 함수
  const sortTeams = (teamsToSort, option) => {
    const sorted = [...teamsToSort];
    switch (option) {
      case 'latest':
        // 최신순 (created_at 기준)
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'members':
        // 멤버 많은 순
        return sorted.sort((a, b) => (b.members_count || 0) - (a.members_count || 0));
      case 'name':
        // 이름 순
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  // 정렬 옵션 변경 처리
  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortMenu(false);
    setTeams(prevTeams => sortTeams(prevTeams, option));
  };

  // 컴포넌트 마운트시 팀 목록 로드
  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // 검색어 변경시 디바운스 적용하여 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTeams(searchTerm);
    }, 300); // 0.3초 지연 (빠른 반응)

    return () => clearTimeout(timer);
  }, [searchTerm, loadTeams]);

  // 정렬 메뉴 외부 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortMenu && !event.target.closest('.sort-dropdown')) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortMenu]);

  const handleJoinTeam = async (team) => {
    try {
      const userCode = sessionStorage.getItem('userCode');
      if (!userCode) {
        alert('로그인이 필요합니다.');
        return;
      }

      // test_player 계정 제한
      if (userCode === 'test_player') {
        setShowTestAccountModal(true);
        return;
      }

      // TODO: 팀 가입 신청 API 구현 필요
      // 현재는 알림만 표시
      alert(`${team.name} 팀에 가입 신청 기능은 준비 중입니다.`);
      
    } catch (err) {
      alert('가입 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleCreateTeam = () => {
    // 팀 만들기 페이지로 이동 (접근 허용)
    navigate('/app/team-make');
  };


  return (
    <div className='join-team'>
      <LogoBellNav logo={true} />
      
      <div className="join-team-container">
        {/* 헤더 */}
        <div className="header">
          <div className="header-actions">
            <button 
              className="back-btn" 
              onClick={() => navigate('/app/main')}
              aria-label="메인 페이지로 돌아가기"
            >
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <button 
              className="create-team-btn" 
              onClick={handleCreateTeam}
              aria-label="새로운 팀 만들기"
            >
              팀 만들기
            </button>
          </div>
          <div className="header-content">
            <h1 className="text-h2">팀 가입하기</h1>
            <p className="subtitle text-body">새로운 팀을 찾아서 팀원들과 함께해보세요.</p>
          </div>
        </div>

        {/* 검색 바 */}
        <div className="search-section">
          <div className="search-bar">
            <img src={searchIcon} alt="검색" className="search-icon" />
          <input
            type="text"
            placeholder="팀명으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="팀 이름으로 검색"
            className="text-body"
          />
          </div>
        </div>

        {/* 추천 팀 섹션 */}
        <div className="teams-section">
        <div className="section-header">
          <h3 className="text-h4">추천 팀</h3>
          <div className="header-actions">
            <div className="sort-dropdown">
              <button 
                className="sort-btn"
                onClick={() => setShowSortMenu(!showSortMenu)}
                aria-label="정렬 옵션"
              >
                <img src={sortIcon} alt="정렬" />
              </button>
              {showSortMenu && (
                <div className="sort-menu">
                  <button 
                    className={`sort-option ${sortOption === 'latest' ? 'active' : ''}`}
                    onClick={() => handleSortChange('latest')}
                  >
                    최신순
                  </button>
                  <button 
                    className={`sort-option ${sortOption === 'members' ? 'active' : ''}`}
                    onClick={() => handleSortChange('members')}
                  >
                    멤버 많은 순
                  </button>
                  <button 
                    className={`sort-option ${sortOption === 'name' ? 'active' : ''}`}
                    onClick={() => handleSortChange('name')}
                  >
                    이름 순
                  </button>
                </div>
              )}
            </div>
            <button 
              className="section-refresh-btn"
              onClick={() => loadTeams(searchTerm)}
              aria-label="팀 목록 새로고침"
            >
              <img src={refreshIcon} alt="새로고침" />
            </button>
          </div>
        </div>
          
        {loading && (
          <div className="teams-list">
            {/* 스켈레톤 로더 - 3개 표시 */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="team-card skeleton">
                <div className="team-info">
                  <div className="team-logo skeleton-loader">
                    <div className="skeleton-circle"></div>
                  </div>
                  <div className="team-details">
                    <div className="skeleton-loader skeleton-title"></div>
                    <div className="skeleton-loader skeleton-text"></div>
                    <div className="skeleton-loader skeleton-text-sm"></div>
                  </div>
                </div>
                <div className="skeleton-loader skeleton-button"></div>
              </div>
            ))}
          </div>
        )}
          
        {error && (
          <div className="error-message">
            <p className="text-body">{error}</p>
            <button 
              className="text-body"
              onClick={() => loadTeams(searchTerm)}
              aria-label="팀 목록 다시 불러오기"
            >
              다시 시도
            </button>
          </div>
        )}
          
          {!loading && !error && (
            <div className="teams-list">
              {teams.length === 0 ? (
            <div className="no-teams-message">
              <p className="text-body">검색 결과가 없습니다.</p>
            </div>
              ) : (
                teams.map((team) => (
                  <div key={team.team_code} className="team-card">
                    <div className="team-info">
                      <div className="team-logo">
                        <img 
                          src={teamLogos[team.team_code] || defaultTeamLogo} 
                          alt={team.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = defaultTeamLogo;
                          }}
                        />
                      </div>
                    <div className="team-details">
                      <h4 className="team-name text-h4">{team.name}</h4>
                      <div className="team-info-line text-body-sm">
                        <span className="members">{team.members_count}명</span>
                        <span className="date">{team.formatted_date}</span>
                      </div>
                      <div className="team-location text-caption">
                        <span className="location">{team.local}</span>
                      </div>
                    </div>
                    </div>
                  <button 
                    className="join-btn text-body"
                    onClick={() => handleJoinTeam(team)}
                    aria-label={`${team.name} 팀에 가입신청하기`}
                  >
                    가입신청
                  </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 테스트 계정 제한 모달 */}
      {showTestAccountModal && (
        <div className="modal-overlay">
          <div className="modal-content test-account-modal">
            <div className="modal-header">
              <h3 className="modal-title">기능 제한</h3>
              <button className="modal-close" onClick={() => setShowTestAccountModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <p>개인 테스트 계정은 사용할 수 없는 기능입니다.</p>
            </div>
            
            <div className="modal-footer">
              <button className="confirm-btn" onClick={() => setShowTestAccountModal(false)}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinTeam;
