import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/Team_member.scss';
// 유저 관련 API 함수들 import
import { GetProfileImageApi, SearchUsersApi } from '../../../function/api/user/userApi';
// 승인된 아이콘 디렉토리 사용
import defaultProfileImage from '../../../assets/common/default_profile.png';
import searchIcon from '../../../assets/main_icons/search_black.png';
import backIcon from '../../../assets/main_icons/back_black.png';
import refreshIcon from '../../../assets/main_icons/refresh_black.png';
import sortIcon from '../../../assets/main_icons/sort_black.png';

const TeamMember = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});
  const [sortOption, setSortOption] = useState('latest'); // 'latest', 'name', 'age'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  // 유저 프로필 이미지 가져오기 함수 (API 기반)
  const getUserProfileUrl = async (userCode) => {
    if (!userCode) return defaultProfileImage;
    
    try {
      const response = await GetProfileImageApi(userCode);
      
      if (response.data.exists && response.data.image_url) {
        return response.data.image_url;
      } else {
        return defaultProfileImage;
      }
    } catch (error) {
      return defaultProfileImage;
    }
  };

  // 유저 목록 로드
  const loadUsers = useCallback(async (searchKeyword = '') => {
    try {
      setLoading(true);
      setError(null);
      
      // 검색어가 없을 때는 추천 선수 5개만, 검색어가 있을 때는 20개
      const pageSize = searchKeyword ? 20 : 5;
      const response = await SearchUsersApi(searchKeyword, 1, pageSize);
      
      if (!response || !response.data) {
        throw new Error('비어있는 응답 데이터');
      }
      
      const { data } = response;
      const userList = data.users || [];
      
      const usersWithProfiles = await Promise.all(
        userList.map(async (user) => {
          const profileUrl = await getUserProfileUrl(user.user_code);
          return {
            ...user,
            profile_url: profileUrl
          };
        })
      );
      
      setUsers(usersWithProfiles);
    } catch (err) {
      setError('유저 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 팀 정렬 함수
  const sortUsers = (usersToSort, option) => {
    const sorted = [...usersToSort];
    switch (option) {
      case 'latest':
        // 최신순 (created_at 기준)
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'name':
        // 이름 순
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'age':
        // 나이 순
        return sorted.sort((a, b) => (a.age || 0) - (b.age || 0));
      default:
        return sorted;
    }
  };

  // 정렬 옵션 변경 처리
  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortMenu(false);
    setUsers(prevUsers => sortUsers(prevUsers, option));
  };

  // 컴포넌트 마운트시 팀 목록 로드
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // 검색어 변경시 디바운스 적용하여 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(searchTerm);
    }, 300); // 0.3초 지연 (빠른 반응)

    return () => clearTimeout(timer);
  }, [searchTerm, loadUsers]);

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

  const handleInviteUser = async (user) => {
    try {
      const userCode = sessionStorage.getItem('userCode');
      if (!userCode) {
        alert('로그인이 필요합니다.');
        return;
      }

      alert(`${user.name} 님을 팀에 초대하는 기능은 준비 중입니다.`);
    } catch (err) {
      alert('초대 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleBack = () => {
    navigate('/app/team/info');
  };

  // 검색 토글 핸들러
  const handleSearchToggle = () => {
    setShowSearchBar(!showSearchBar);
    if (showSearchBar) {
      setSearchTerm('');
    }
  };


  return (
    <div className='team-member'>
      <LogoBellNav logo={true} />
      
      <div className="team-member-container">
        {/* 헤더 */}
        <div className="header">
          <div className="header-actions">
            <button 
              className="back-btn" 
              onClick={handleBack}
              aria-label="팀 정보로 돌아가기"
            >
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <div className="empty-space"></div>
          </div>
          <div className="header-content">
            <h1 className="text-h2">팀원 초대하기</h1>
            <p className="subtitle text-body">새로운 팀원을 찾아서 함께해보세요.</p>
          </div>
        </div>

        {/* 추천 선수 섹션 */}
        <div className="users-section">
        <div className="section-header">
          <h3 className="text-h4">추천 선수</h3>
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
                    className={`sort-option ${sortOption === 'name' ? 'active' : ''}`}
                    onClick={() => handleSortChange('name')}
                  >
                    이름순
                  </button>
                  <button 
                    className={`sort-option ${sortOption === 'age' ? 'active' : ''}`}
                    onClick={() => handleSortChange('age')}
                  >
                    나이순
                  </button>
                </div>
              )}
            </div>
            <button 
              className={`section-search-btn ${showSearchBar ? 'active' : ''}`}
              onClick={handleSearchToggle}
              aria-label="유저 검색"
            >
              <img src={searchIcon} alt="검색" />
            </button>
            <button 
              className="section-refresh-btn"
              onClick={() => loadUsers(searchTerm)}
              aria-label="유저 목록 새로고침"
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
                placeholder="유저 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="검색어 지우기"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="search-result-count">
                <span className="text-caption">
                  {users.length}명의 유저 찾음
                </span>
              </div>
            )}
          </div>
        )}
          
        {loading && (
          <div className="users-list">
            {/* 스켈레톤 로더 - 3개 표시 */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="user-card skeleton">
                <div className="user-info">
                  <div className="user-profile skeleton-loader">
                    <div className="skeleton-circle"></div>
                  </div>
                  <div className="user-details">
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
              onClick={() => loadUsers(searchTerm)}
              aria-label="유저 목록 다시 불러오기"
            >
              다시 시도
            </button>
          </div>
        )}
          
          {!loading && !error && (
            <div className="users-list">
              {users.length === 0 && searchTerm ? (
                <div className="empty-state">
                  <p className="text-body">검색 결과가 없습니다.</p>
                  <button 
                    className="clear-search-btn btn-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    검색어 지우기
                  </button>
                </div>
              ) : users.length === 0 ? (
                <div className="no-users-message">
                  <p className="text-body">추천할 유저가 없습니다.</p>
                  <p className="text-caption">유저 검색 기능을 사용하여 팀원을 찾아보세요.</p>
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.user_code} className="user-card">
                    <div className="user-info">
                      <div className="user-profile">
                        <img 
                          src={userProfiles[user.user_code] || user.profile_url || defaultProfileImage} 
                          alt={user.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = defaultProfileImage;
                          }}
                        />
                      </div>
                    <div className="user-details">
                      <h4 className="user-name text-h4">{user.name}</h4>
                      <div className="user-info-line text-body-sm">
                        <span className="age">{user.age}세</span>
                        <span className="position">{user.preferred_position || 'CB'}</span>
                      </div>
                      <div className="user-location text-caption">
                        <span className="location">{user.activity_area || '지역 미상'}</span>
                      </div>
                    </div>
                    </div>
                  <button 
                    className="invite-btn text-body"
                    onClick={() => handleInviteUser(user)}
                    aria-label={`${user.name} 님을 팀에 초대하기`}
                  >
                    초대하기
                  </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
