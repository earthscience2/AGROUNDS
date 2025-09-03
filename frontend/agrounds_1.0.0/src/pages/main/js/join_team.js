import React, { useState, useEffect } from 'react';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/join_team.scss';
// 팀 관련 API 비활성화됨

const JoinTeam = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 팀 목록 로드
  const loadTeams = async (searchKeyword = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (searchKeyword.trim()) {
        // 검색어가 있으면 검색 API 호출
        response = { data: { success: false } }; // API 비활성화
      } else {
        // 검색어가 없으면 전체 목록 조회
        response = { data: { success: false } }; // API 비활성화
      }

      if (response.data && response.data.success) {
        setTeams(response.data.teams || []);
      } else {
        setError('팀 목록을 불러오는데 실패했습니다.');
        setTeams([]);
      }
    } catch (err) {
      console.error('팀 목록 로드 오류:', err);
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트시 팀 목록 로드
  useEffect(() => {
    loadTeams();
  }, []);

  // 검색어 변경시 디바운스 적용하여 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTeams(searchTerm);
    }, 500); // 0.5초 지연

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleJoinTeam = async (team) => {
    try {
      const userCode = sessionStorage.getItem('userCode');
      if (!userCode) {
        alert('로그인이 필요합니다.');
        return;
      }

      // API 비활성화로 인한 임시 처리
      const response = { data: { success: false, error: '팀 기능이 현재 비활성화되어 있습니다.' } };

      if (response.data && response.data.success) {
        alert(response.data.message);
      } else {
        alert(response.data?.error || '가입 신청에 실패했습니다.');
      }
    } catch (err) {
      console.error('팀 가입 오류:', err);
      alert('가입 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleCreateTeam = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateSubmit = () => {
    alert('팀이 생성되었습니다!');
    setShowCreateModal(false);
  };

  return (
    <div className='join-team'>
      <LogoBellNav logo={true} />
      
      <div className="join-team-container">
        {/* 헤더 */}
        <div className="header">
          <div className="header-content">
            <div className="back-btn" onClick={() => window.history.back()}>
              ←
            </div>
            <h1>팀 가입하기</h1>
            <div className="refresh-btn">
              ↻
            </div>
          </div>
          <p className="subtitle">새로운 팀을 찾아서 팀원들과 함께해보세요.</p>
        </div>

        {/* 팀 만들기 버튼 */}
        <div className="create-team-section">
          <button className="create-team-btn" onClick={handleCreateTeam}>
            팀 만들기
          </button>
        </div>

        {/* 검색 바 */}
        <div className="search-section">
          <div className="search-bar">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="팀명으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 추천 팀 섹션 */}
        <div className="teams-section">
          <div className="section-header">
            <h3>추천 팀</h3>
          </div>
          
          {loading && (
            <div className="loading-message">
              <p>팀 목록을 불러오는 중...</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => loadTeams(searchTerm)}>다시 시도</button>
            </div>
          )}
          
          {!loading && !error && (
            <div className="teams-list">
              {teams.length === 0 ? (
                <div className="no-teams-message">
                  <p>검색 결과가 없습니다.</p>
                </div>
              ) : (
                teams.map((team) => (
                  <div key={team.team_code} className="team-card">
                    <div className="team-info">
                      <div className="team-logo">
                        <img 
                          src={team.logo_url} 
                          alt={team.name}
                          onError={(e) => {
                            e.target.src = 'http://localhost:8000/media/team_logo/default_profile.png';
                          }}
                        />
                      </div>
                      <div className="team-details">
                        <h4 className="team-name">{team.name}</h4>
                        <div className="team-info-line">
                          <span className="members">{team.members_count}명</span>
                          <span className="date">{team.formatted_date}</span>
                        </div>
                        <div className="team-location">
                          <span className="location">{team.local}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="join-btn"
                      onClick={() => handleJoinTeam(team)}
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

      {/* 팀 만들기 모달 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>팀 만들기</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>팀 이름</label>
                <input type="text" placeholder="팀 이름을 입력하세요" />
              </div>
              <div className="form-group">
                <label>지역</label>
                <input type="text" placeholder="활동 지역을 입력하세요" />
              </div>
              <div className="form-group">
                <label>팀 소개</label>
                <textarea placeholder="팀을 소개해주세요"></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>취소</button>
              <button className="submit-btn" onClick={handleCreateSubmit}>만들기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinTeam;
