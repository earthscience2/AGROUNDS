import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import MatchActionModal from '../../../components/MatchActionModal';
import '../css/Anal_Folder.scss';

// API
import { GetUserPlayerMatchesApi, UpdateMatchNameApi, DeleteMatchApi } from '../../../function/api/user/userApi';

// 필요한 아이콘들 import
import folderIcon from '../../../assets/common/folder.png';
import downIcon from '../../../assets/common/down.png';
import dot3Icon from '../../../assets/common/dot3.png';

const Anal_Folder = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' 또는 'oldest'
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 뒤로가기 함수
  const handleBack = () => {
    navigate('/app/main');
  };

  // 경기 목록 불러오기 함수 (재사용 가능)
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      
      if (!userCode) {
        console.warn('사용자 코드가 없습니다.');
        setMatches([]);
        setLoading(false);
        return;
      }

      console.log(`경기 목록 로드 시작: ${userCode}`);
      const response = await GetUserPlayerMatchesApi(userCode, 20);
      
      if (!response || !response.data) {
        throw new Error('비어있는 응답 데이터');
      }
      
      const { data } = response;
      console.log('API 응답:', data);
      
      const apiMatches = Array.isArray(data.matches) ? data.matches : [];
      
      if (apiMatches.length === 0) {
        console.log('경기 데이터가 없습니다.');
      }
      
      const normalized = apiMatches.map((m, idx) => ({
        id: m.match_code || `match_${idx}`,
        match_code: m.match_code || `match_${idx}`,
        name: m.name || m.title || '경기',
        title: m.title || m.name || '경기',
        quarter: m.quarter_count > 0 ? `${m.quarter_count}쿼터` : '쿼터 없음',
        date: m.date || '날짜 미정',
        time: m.time || '',
        rawData: m  // 디버깅용
      }));
      
      setMatches(normalized);
    } catch (error) {
      console.error('경기 데이터 로드 실패:', error);
      
      // 상세 오류 정보 로깅
      if (error.response) {
        console.error('서버 오류:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('네트워크 오류:', error.request);
      } else {
        console.error('요청 오류:', error.message);
      }
      
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // 실제 데이터 로드
  useEffect(() => {
    fetchMatches();
  }, []);

  // 정렬된 경기 데이터
  const sortedMatches = [...matches].sort((a, b) => {
    const dateA = new Date(a.date.replace(/\./g, '/') + ' ' + a.time);
    const dateB = new Date(b.date.replace(/\./g, '/') + ' ' + b.time);
    
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  // 정렬 순서 변경
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'latest' ? 'oldest' : 'latest');
  };

  // 경기 분석하기 버튼 클릭
  const handleAnalyzeMatch = (matchId) => {
    // 실제로는 해당 경기 분석 페이지로 이동
    console.log(`경기 ${matchId} 분석하기`);
  };

  // 경기 카드 클릭 시 상세 분석 페이지로 이동
  const handleMatchClick = (match) => {
    navigate('/app/player/analysis', { 
      state: { 
        matchData: match,
        matchId: match.match_code 
      } 
    });
  };

  // 더보기 버튼 클릭
  const handleMoreClick = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  // 경기 이름 변경
  const handleRename = async (newName) => {
    if (!selectedMatch || !newName.trim()) return;
    
    try {
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      const response = await UpdateMatchNameApi(userCode, selectedMatch.match_code, newName);
      
      if (response.data.success) {
        // 성공 시 목록 새로고침
        await fetchMatches();
        console.log('경기 이름이 변경되었습니다.');
      }
    } catch (error) {
      console.error('이름 변경 실패:', error);
      alert('이름 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 경기 삭제
  const handleDelete = async () => {
    if (!selectedMatch) return;
    
    try {
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      const response = await DeleteMatchApi(userCode, selectedMatch.match_code);
      
      if (response.data.success) {
        // 성공 시 목록 새로고침
        await fetchMatches();
        console.log('경기가 삭제되었습니다.');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };



  if (loading) {
    return (
      <div className='anal-folder-page'>
        <LogoBellNav showBack={true} onBack={handleBack} />
        <div className="loading-container">
          <p>경기 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='anal-folder-page'>
      <LogoBellNav showBack={true} onBack={handleBack} />
      
      {/* 헤더 섹션 */}
      <div className="page-header">
        <h1 className="page-title text-h1">개인 경기분석</h1>
        <div className="page-subtitle">
          <p className="text-body">경기 데이터를 기반으로 설정된</p>
          <p className="text-body">현재 팀의 수준을 확인하고 더 발전해보세요</p>
        </div>
      </div>

      {/* 경기 목록 헤더 */}
      <div className="matches-header">
        <div className="matches-count">
          <span className="text-h3">총 {matches.length}개의 경기</span>
        </div>
        <div className="sort-selector" onClick={toggleSortOrder}>
          <span className="sort-text text-body">
            {sortOrder === 'latest' ? '최신 순' : '오래된 순'}
          </span>
          <img 
            src={downIcon} 
            alt="정렬" 
            className={`sort-icon ${sortOrder === 'oldest' ? 'rotated' : ''}`}
          />
        </div>
      </div>

      {/* 경기 목록 */}
      <div className="matches-list">
        {sortedMatches.map((match) => (
          <div key={match.id} className="match-card">
            <div 
              className="match-info"
              onClick={() => handleMatchClick(match)}
            >
              <div className="match-icon">
                <img src={folderIcon} alt="경기" />
              </div>
              <div className="match-details">
                <h3 className="match-title text-h4">{match.title}</h3>
                <p className="match-meta text-caption">
                  {match.quarter} • {match.date}
                </p>
              </div>
            </div>
            <div className="match-actions">
              <button 
                className="more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoreClick(match);
                }}
              >
                <img src={dot3Icon} alt="더보기" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 경기 설정 모달 */}
      <MatchActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRename={handleRename}
        onDelete={handleDelete}
        matchTitle={selectedMatch?.title}
        matchData={selectedMatch}
      />

      {/* 경기 분석하기 버튼 */}
      <div className="action-section">
        <button 
          className="analyze-btn btn-primary"
          onClick={() => handleAnalyzeMatch('new')}
        >
          경기 분석하기
        </button>
      </div>
    </div>
  );
};

export default Anal_Folder;
