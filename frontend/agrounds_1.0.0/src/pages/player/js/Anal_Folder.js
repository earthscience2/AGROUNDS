import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
// DSModal variants (디자인 시스템 공용 모달 사용)
import { MatchActionDSModal } from '../../../components/Modal/variants';
// DEV NOTE: 모든 모달은 디자인 시스템 공용 DSModal(variants 포함)만 사용합니다. 개별 오버레이/컨테이너 구현 금지.
import '../css/Anal_Folder.scss';

// API
import { UpdateMatchNameApi, DeleteMatchApi, GetUserMatchesApi } from '../../../function/api/match/matchApi';

// 필요한 아이콘들 import (승인된 아이콘 디렉토리 사용)
import folderIcon from '../../../assets/main_icons/folder_black.png';
import downIcon from '../../../assets/main_icons/down_gray.png';
import optionIcon from '../../../assets/main_icons/option_black.png';
import sortIcon from '../../../assets/main_icons/sort_black.png';
import searchIcon from '../../../assets/main_icons/search_black.png';
import refreshIcon from '../../../assets/main_icons/refresh_black.png';

const Anal_Folder = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('latest'); // 'latest', 'oldest', 'name'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // 경기 목록 불러오기 함수 (재사용 가능)
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      
      if (!userCode) {
        setMatches([]);
        setLoading(false);
        return;
      }
      
      // 실제 API 호출
      const response = await GetUserMatchesApi(userCode);
      
      if (!response || !response.data) {
        throw new Error('비어있는 응답 데이터');
      }
      
      const { data } = response;
      
      const apiMatches = Array.isArray(data.matches) ? data.matches : [];
      
      if (apiMatches.length === 0) {
        setMatches([]);
        return;
      }
      
      // API 응답 데이터를 컴포넌트에서 사용할 형식으로 변환
      const normalized = apiMatches.map((m, idx) => ({
        id: m.match_code || `match_${idx}`,
        match_code: m.match_code || `match_${idx}`,
        name: m.match_name || '경기',
        title: m.match_name || '경기',
        quarter: m.quarter_count > 0 ? `${m.quarter_count}쿼터` : '쿼터 없음',
        date: m.match_date || '날짜 미정',
        time: m.match_time || '',
        ground_name: m.ground_name || '알 수 없는 경기장',
        total_duration: m.total_duration_minutes || 0,
        max_speed: m.max_speed || 0,
        total_distance: m.total_distance || 0,
        status: m.status || 'ai_done', // 경기 상태 추가
        createdAt: m.created_at ? new Date(m.created_at).getTime() : null,
        rawData: m  // 디버깅용
      }));
      
      setMatches(normalized);
    } catch (error) {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // 실제 데이터 로드
  useEffect(() => {
    fetchMatches();
  }, []);

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

  const getMatchTimestamp = (match) => {
    if (typeof match.createdAt === 'number' && !Number.isNaN(match.createdAt)) {
      return match.createdAt;
    }

    if (match.createdAt) {
      const parsedCreated = new Date(match.createdAt).getTime();
      if (!Number.isNaN(parsedCreated)) {
        return parsedCreated;
      }
    }

    const parsedDate = new Date((match.date || '').replace(/\./g, '/') + ' ' + (match.time || ''));
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.getTime();
    }

    return 0;
  };

  // 정렬된 경기 데이터
  const sortedMatches = [...matches].sort((a, b) => {
    const createdA = getMatchTimestamp(a);
    const createdB = getMatchTimestamp(b);

    switch (sortOption) {
      case 'latest':
        return createdB - createdA; // 최신순
      case 'oldest':
        return createdA - createdB; // 오래된순
      case 'name':
        return a.name.localeCompare(b.name); // 이름순
      default:
        return createdB - createdA;
    }
  });

  // 정렬 옵션 변경 처리
  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortMenu(false);
  };

  // 검색 버튼 클릭
  const handleSearchToggle = () => {
    setShowSearchBar(!showSearchBar);
    if (showSearchBar) {
      // 검색창 닫을 때 검색어 초기화
      setSearchQuery('');
    }
  };

  // 검색어 변경
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 검색 필터링된 경기 목록
  const filteredMatches = sortedMatches.filter(match => {
    if (!searchQuery.trim()) return true;
    return match.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Pagination (5 per page)
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredMatches.length / pageSize));
  const startIndex = currentPage * pageSize;
  const pageMatches = filteredMatches.slice(startIndex, startIndex + pageSize);
  const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  useEffect(() => { setCurrentPage(0); }, [searchQuery, sortOption]);

  // 경기 분석하기 버튼 클릭
  const handleAnalyzeMatch = () => {
    // 데이터 선택 페이지로 이동
    navigate('/app/anal/data-select');
  };

  // 상태에 따른 메시지 반환
  const getStatusMessage = (status) => {
    switch (status) {
      case 'anal':
        return '분석중';
      case 'anal_done':
        return '분석중';
      case 'ai':
        return 'AI 요약중';
      case 'ai_done':
        return null; // 상태 메시지 없음
      case 'anal_fail':
        return '분석실패';
      case 'ai_fail':
        return '분석실패';
      default:
        return null;
    }
  };

  // 경기가 활성화되어 있는지 확인
  const isMatchEnabled = (status) => {
    return status === 'ai_done';
  };

  // 경기 카드 클릭 시 상세 분석 페이지로 이동
  const handleMatchClick = (match) => {
    // ai_done 상태가 아니면 진입 불가
    if (!isMatchEnabled(match.status)) {
      return;
    }
    
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
      }
    } catch (error) {
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
      }
    } catch (error) {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };



  if (loading) {
    return (
      <div className='anal-folder-page'>
        <LogoBellNav logo={true} />
        <div className="loading-container">
          <p>경기 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='anal-folder-page'>
      <LogoBellNav logo={true} />
      
      <div className="anal-folder-container">
        {/* 헤더 섹션 */}
        <div className="header">
          <div className="header-actions">
            <button className="analyze-btn" onClick={handleAnalyzeMatch}>
              경기 분석하기
            </button>
          </div>
          <div className="header-content">
            <h1 className="text-h2">개인 경기분석</h1>
            <p className="subtitle text-body">경기 데이터를 기반으로 분석된<br />개인 기록을 확인하고 더 발전해보세요</p>
          </div>
        </div>

        {/* 경기 목록 헤더 */}
        <div className="matches-header">
          <div className="matches-count">
            <span className="text-h3">총 {matches.length}개의 경기</span>
          </div>
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
                    className={`sort-option ${sortOption === 'oldest' ? 'active' : ''}`}
                    onClick={() => handleSortChange('oldest')}
                  >
                    오래된순
                  </button>
                  <button 
                    className={`sort-option ${sortOption === 'name' ? 'active' : ''}`}
                    onClick={() => handleSortChange('name')}
                  >
                    이름순
                  </button>
                </div>
              )}
            </div>
            <button 
              className={`section-search-btn ${showSearchBar ? 'active' : ''}`}
              onClick={handleSearchToggle}
              aria-label="경기 검색"
            >
              <img src={searchIcon} alt="검색" />
            </button>
            <button 
              className="section-refresh-btn"
              onClick={fetchMatches}
              aria-label="경기 목록 새로고침"
            >
              <img src={refreshIcon} alt="새로고침" />
            </button>
          </div>
        </div>

        {/* 검색창 */}
        {showSearchBar && (
          <div className="search-bar-container">
            <div className="search-input-wrapper">
              <img src={searchIcon} alt="검색" className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="경기 이름으로 검색..."
                value={searchQuery}
                onChange={handleSearchChange}
                autoFocus
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="검색어 지우기"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="search-result-count">
                <span className="text-caption">
                  {filteredMatches.length}개의 경기 찾음
                </span>
              </div>
            )}
          </div>
        )}

        {/* 경기 목록 */}
        <div className="matches-list">
        {filteredMatches.length === 0 && searchQuery ? (
          <div className="empty-state">
            <p className="text-body">검색 결과가 없습니다.</p>
            <button 
              className="clear-search-btn btn-secondary"
              onClick={() => setSearchQuery('')}
            >
              검색어 지우기
            </button>
          </div>
        ) : (
          pageMatches.map((match) => {
          const statusMessage = getStatusMessage(match.status);
          const isEnabled = isMatchEnabled(match.status);
          
          return (
            <div key={match.id} className={`match-card ${!isEnabled ? 'disabled' : ''}`}>
              <div 
                className="match-info"
                onClick={() => handleMatchClick(match)}
                style={{ cursor: isEnabled ? 'pointer' : 'not-allowed' }}
              >
                <div className="match-icon">
                  <img src={folderIcon} alt="경기" />
                </div>
                <div className="match-details">
                  <div className="match-title-row">
                    <h3 className="match-title text-h4">{match.title}</h3>
                    {statusMessage && (
                      <span className={`status-badge ${match.status.includes('fail') ? 'error' : 'processing'}`}>
                        {statusMessage}
                      </span>
                    )}
                  </div>
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
                  <img src={optionIcon} alt="더보기" />
                </button>
              </div>
            </div>
          );
        })
        )}
        </div>

        {/* Pagination */}
        {filteredMatches.length > pageSize && (
          <div className="ds-detail__section" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
            <button className="icon-square-btn" onClick={goPrev} aria-label="이전" disabled={currentPage === 0}>
              ‹
            </button>
            <div className="text-body" style={{ color: 'var(--text-secondary)', minWidth: '60px', textAlign: 'center' }}>
              {Math.min(currentPage + 1, totalPages)} / {totalPages}
            </div>
            <button className="icon-square-btn" onClick={goNext} aria-label="다음" disabled={currentPage >= totalPages - 1}>
              ›
            </button>
          </div>
        )}

        {/* 경기 설정 모달 - DSModal */}
        <MatchActionDSModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRename={handleRename}
          onDelete={handleDelete}
          matchTitle={selectedMatch?.title}
          matchData={selectedMatch}
        />
      </div>
    </div>
  );
};

export default Anal_Folder;
