import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
// DSModal variants (디자인 시스템 공용 모달 사용)
import { 
  FolderOptionDSModal, 
  FolderRenameDSModal, 
  FolderDeleteDSModal, 
  FolderCreateDSModal 
} from '../../../components/Modal/variants';
// DEV NOTE: 모든 모달은 디자인 시스템 공용 DSModal(variants 포함)만 사용합니다. 개별 오버레이/컨테이너 구현 금지.
import '../css/Video_Folder.scss';

// API
import { 
  GetUserVideoFoldersApi, 
  CreateVideoFolderApi, 
  UpdateVideoFolderApi, 
  DeleteVideoFolderApi,
  GetFolderVideoCountApi
} from '../../../function/api/video/videoApi';

// 필요한 아이콘들 import (승인된 아이콘 디렉토리 사용)
import folderIcon from '../../../assets/main_icons/folder_black.png';
import optionIcon from '../../../assets/main_icons/option_black.png';
import sortIcon from '../../../assets/main_icons/sort_black.png';
import searchIcon from '../../../assets/main_icons/search_black.png';
import refreshIcon from '../../../assets/main_icons/refresh_black.png';

const Video_Folder = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('latest'); // 'latest', 'oldest', 'name'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false); // 옵션 모달
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isFolderDeleteModalOpen, setIsFolderDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // 폴더 목록 불러오기 함수 (재사용 가능)
  const fetchFolders = async () => {
    try {
      setLoading(true);
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      
      if (!userCode) {
        setFolders([]);
        setLoading(false);
        return;
      }
      
      const response = await GetUserVideoFoldersApi(userCode);
      
      if (!response || !response.data) {
        throw new Error('비어있는 응답 데이터');
      }
      
      const { data } = response;
      const apiFolders = Array.isArray(data.folders) ? data.folders : [];
      
      if (apiFolders.length === 0) {
        setFolders([]);
        return;
      }
      
      const normalized = await Promise.all(apiFolders.map(async (folder, idx) => {
        let videoCount = 0;
        try {
          const countResponse = await GetFolderVideoCountApi(userCode, folder.folder_code);
          // 백엔드 응답 형식: { folder_code: "...", video_count: 4 }
          if (countResponse.data && typeof countResponse.data.video_count === 'number') {
            videoCount = countResponse.data.video_count;
          }
        } catch (error) {
          // 영상 개수 조회 실패 시 0으로 표시
          console.error(`폴더 ${folder.folder_code} 영상 개수 조회 실패:`, error);
        }

        return {
          id: folder.folder_code || `folder_${idx}`,
          folder_code: folder.folder_code || `folder_${idx}`,
          name: folder.name || '폴더',
          title: folder.name || '폴더',
          created_at: folder.created_at || new Date().toISOString(),
          updated_at: folder.updated_at || new Date().toISOString(),
          user_code: folder.user_code,
          video_count: videoCount
        };
      }));
      
      setFolders(normalized);
    } catch (error) {
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };

  // 실제 데이터 로드
  useEffect(() => {
    fetchFolders();
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

  // 정렬된 폴더 데이터
  const sortedFolders = [...folders].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    
    switch (sortOption) {
      case 'latest':
        return dateB - dateA; // 최신순
      case 'oldest':
        return dateA - dateB; // 오래된순
      case 'name':
        return a.name.localeCompare(b.name); // 이름순
      default:
        return dateB - dateA;
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

  // 검색 필터링된 폴더 목록
  const filteredFolders = sortedFolders.filter(folder => {
    if (!searchQuery.trim()) return true;
    return folder.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Pagination (5 per page)
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredFolders.length / pageSize));
  const startIndex = currentPage * pageSize;
  const pageFolders = filteredFolders.slice(startIndex, startIndex + pageSize);
  const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  useEffect(() => { setCurrentPage(0); }, [searchQuery, sortOption]);

  // 폴더 카드 클릭 시 해당 폴더의 비디오 목록 페이지로 이동
  const handleFolderClick = (folder) => {
    navigate('/app/player/video-list', { 
      state: { 
        folderData: {
          folder_code: folder.folder_code,
          name: folder.name,
          title: folder.title,
          user_code: folder.user_code,
          created_at: folder.created_at,
          updated_at: folder.updated_at,
          video_count: folder.video_count
        },
        folderId: folder.folder_code 
      } 
    });
  };

  // 더보기 버튼 클릭
  const handleMoreClick = (folder) => {
    setSelectedFolder(folder);
    setIsActionModalOpen(true);
  };

  // 폴더 이름 변경
  const handleRename = async (newName) => {
    if (!selectedFolder || !newName.trim()) return;
    
    try {
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      const response = await UpdateVideoFolderApi(userCode, selectedFolder.folder_code, newName);
      
      if (response.data.folder_code || response.data.success) {
        // 로컬 상태 즉시 업데이트
        setFolders(prevFolders => 
          prevFolders.map(folder => 
            folder.folder_code === selectedFolder.folder_code 
              ? { ...folder, name: newName, title: newName }
              : folder
          )
        );
        
        // 선택된 폴더 정보도 업데이트
        setSelectedFolder(prev => prev ? { ...prev, name: newName, title: newName } : null);
      } else {
        alert('이름 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('이름 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 폴더 삭제
  const handleDelete = async () => {
    if (!selectedFolder) return;
    
    try {
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      const response = await DeleteVideoFolderApi(userCode, selectedFolder.folder_code);
      
      if (response.data.success || response.data.message) {
        // 로컬 상태에서 즉시 제거
        setFolders(prevFolders => 
          prevFolders.filter(folder => folder.folder_code !== selectedFolder.folder_code)
        );
        
        setSelectedFolder(null);
        setIsFolderDeleteModalOpen(false);
      } else {
        alert('삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 폴더 생성
  const handleCreateFolder = async (folderName) => {
    if (!folderName.trim()) return;
    
    try {
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      const response = await CreateVideoFolderApi(userCode, folderName);
      
      if (response.data.folder_code || response.data.success) {
        // 새 폴더를 로컬 상태에 즉시 추가
        const newFolder = {
          id: response.data.folder_code,
          folder_code: response.data.folder_code,
          name: response.data.name || folderName,
          title: response.data.name || folderName,
          created_at: response.data.created_at || new Date().toISOString(),
          updated_at: response.data.updated_at || new Date().toISOString(),
          user_code: response.data.user_code || userCode,
          video_count: 0
        };
        
        setFolders(prevFolders => [newFolder, ...prevFolders]);
        setIsCreateModalOpen(false);
      } else {
        alert('폴더 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('폴더 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <div className='video-folder-page'>
        <LogoBellNav logo={true} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="text-body">비디오 폴더를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='video-folder-page'>
      <LogoBellNav logo={true} />
      
      <div className="video-folder-container">
        {/* 헤더 섹션 */}
        <div className="header">
          <div className="header-actions">
            <button className="add-folder-btn" onClick={() => setIsCreateModalOpen(true)}>
              폴더 추가
            </button>
          </div>
          <div className="header-content">
            <h1 className="text-h2">개인 경기영상</h1>
            <p className="subtitle text-body">경기 영상을 폴더별로 정리하고<br />효율적으로 관리해보세요</p>
          </div>
        </div>

        {/* 폴더 목록 헤더 */}
        <div className="folders-header">
          <div className="folders-count">
            <span className="text-h3">총 {folders.length}개의 폴더</span>
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
              aria-label="폴더 검색"
            >
              <img src={searchIcon} alt="검색" />
            </button>
            <button 
              className="section-refresh-btn"
              onClick={fetchFolders}
              aria-label="폴더 목록 새로고침"
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
                placeholder="폴더 이름으로 검색..."
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
                  {filteredFolders.length}개의 폴더 찾음
                </span>
              </div>
            )}
          </div>
        )}

        {/* 폴더 목록 */}
        <div className="folders-list">
        {filteredFolders.length === 0 && searchQuery ? (
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
          pageFolders.map((folder) => (
          <div key={folder.id} className="folder-card">
            <div 
              className="folder-info"
              onClick={() => handleFolderClick(folder)}
            >
              <div className="folder-icon">
                <img src={folderIcon} alt="폴더" />
              </div>
              <div className="folder-details">
                <div className="folder-title-row">
                  <h3 className="folder-title text-h4">{folder.title}</h3>
                </div>
                <p className="folder-meta text-caption">
                  {folder.video_count}개 영상 • {new Date(folder.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
            <div className="folder-actions">
              <button 
                className="more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoreClick(folder);
                }}
              >
                <img src={optionIcon} alt="더보기" />
              </button>
            </div>
          </div>
        ))
        )}
        </div>

        {/* Pagination */}
        {filteredFolders.length > pageSize && (
          <div className="ds-detail__section" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
            <button className="icon-square-btn" onClick={goPrev} aria-label="이전" disabled={currentPage === 0}>
              ‹
            </button>
            <div className="text-caption" style={{ color: 'var(--text-secondary)', minWidth: '60px', textAlign: 'center' }}>
              {Math.min(currentPage + 1, totalPages)} / {totalPages}
            </div>
            <button className="icon-square-btn" onClick={goNext} aria-label="다음" disabled={currentPage >= totalPages - 1}>
              ›
            </button>
          </div>
        )}

        {/* 폴더 옵션 모달 - 1단계 */}
        <FolderOptionDSModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          onRenameClick={() => {
            setIsActionModalOpen(false);
            setIsRenameModalOpen(true);
          }}
          onDeleteClick={() => {
            setIsActionModalOpen(false);
            setIsFolderDeleteModalOpen(true);
          }}
          folderTitle={selectedFolder?.title}
        />

        {/* 폴더 이름 변경 모달 - 2단계 */}
        <FolderRenameDSModal
          isOpen={isRenameModalOpen}
          onClose={() => setIsRenameModalOpen(false)}
          onRename={handleRename}
          folderTitle={selectedFolder?.title}
        />

        {/* 폴더 삭제 확인 모달 - 2단계 */}
        <FolderDeleteDSModal
          isOpen={isFolderDeleteModalOpen}
          onClose={() => setIsFolderDeleteModalOpen(false)}
          onConfirm={handleDelete}
          folderTitle={selectedFolder?.title}
        />
        {/* 폴더 생성 모달 - DSModal */}
        <FolderCreateDSModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateFolder}
        />
      </div>
    </div>
  );
};

export default Video_Folder;
