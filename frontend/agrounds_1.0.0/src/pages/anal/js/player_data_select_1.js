import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/player_data_select_1.scss';

// API
import { GetS3DataFilesApi, GetUserUploadFilesApi } from '../../../function/api/upload/uploadApi';

// 필요한 아이콘들 import
import fileIcon from '../../../assets/main_icons/file_black.png';
import sortIcon from '../../../assets/main_icons/sort_black.png';
import searchIcon from '../../../assets/main_icons/search_black.png';
import refreshIcon from '../../../assets/main_icons/refresh_black.png';
import backIcon from '../../../assets/main_icons/back_black.png';

const Player_Data_Select_1 = () => {
  const navigate = useNavigate();
  const [dataFiles, setDataFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allFiles, setAllFiles] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filesPerPage = 10;

  // 뒤로가기 함수
  const handleBack = () => {
    navigate('/app/player/analysis');
  };

  // 사용자 업로드 파일 목록 불러오기 (Upload 모델 사용)
  const fetchDataFiles = async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }
      
      // 사용자 코드 가져오기
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code');
      
      if (!userCode) {
        setAllFiles([]);
        setDataFiles([]);
        setHasMoreData(false);
        return;
      }
      
      const response = await GetUserUploadFilesApi(userCode);
      
      if (!response || !response.data) {
        throw new Error('비어있는 응답 데이터');
      }
      
      const { data } = response;
      
      const files = Array.isArray(data.files) ? data.files : [];
      
      if (files.length === 0) {
        setAllFiles([]);
        setDataFiles([]);
        setHasMoreData(false);
        return;
      }
      
      // 파일 정보 정리 (Upload 모델 데이터 사용)
      const normalizedFiles = files
        .map((file, idx) => ({
          id: file.upload_code || `file_${idx}`,
          upload_code: file.upload_code,
          name: file.name || `파일_${idx + 1}`, // Upload 모델의 name 필드 사용
          hz: file.hz || 0,
          size: 0, // Upload 모델에는 size 필드가 없음
          lastModified: file.created_at || new Date().toISOString(),
          created_at: file.created_at,
          rawData: file
        }));
      
      // 현재 정렬 순서에 따라 정렬
      const sortedFiles = sortFiles(normalizedFiles, sortOrder);
      
      if (reset) {
        setAllFiles(sortedFiles);
        setDataFiles(sortedFiles.slice(0, filesPerPage));
        setHasMoreData(sortedFiles.length > filesPerPage);
      }
    } catch (error) {
      setAllFiles([]);
      setDataFiles([]);
      setHasMoreData(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 파일 목록 정렬 함수
  const sortFiles = (files, order) => {
    return [...files].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      
      if (order === 'newest') {
        return dateB - dateA; // 최신순
      } else {
        return dateA - dateB; // 오래된순
      }
    });
  };

  // 정렬 순서 변경 함수
  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
    
    // 전체 파일 목록 정렬
    const sortedAllFiles = sortFiles(allFiles, newOrder);
    setAllFiles(sortedAllFiles);
    
    // 현재 표시 중인 파일 목록도 정렬하여 업데이트
    const sortedDisplayFiles = sortedAllFiles.slice(0, dataFiles.length);
    setDataFiles(sortedDisplayFiles);
  };

  // 파일 목록 새로고침
  const handleRefresh = () => {
    fetchDataFiles();
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

  // 검색 필터링된 파일 목록
  const filteredFiles = dataFiles.filter(file => {
    if (!searchQuery.trim()) return true;
    return file.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 더 불러오기
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * filesPerPage - filesPerPage;
    const endIndex = nextPage * filesPerPage;
    
    const newFiles = allFiles.slice(startIndex, endIndex);
    setDataFiles(prev => [...prev, ...newFiles]);
    setCurrentPage(nextPage);
    
    // 더 불러올 데이터가 있는지 확인
    setHasMoreData(endIndex < allFiles.length);
  };

  // 파일 선택
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  // 데이터 업로드 버튼 클릭 (준비중인 기능)
  const handleDataUpload = () => {
    alert('아직 준비중인 기능입니다.');
  };

  // 경기장 선택 페이지로 이동
  const handleStartAnalysis = () => {
    if (!selectedFile) {
      alert('분석할 파일을 선택해주세요.');
      return;
    }

    // 경기장 선택 페이지로 이동
    navigate('/app/anal/ground-selection', {
      state: {
        selectedFile: selectedFile,
        isAutoFind: true // 자동찾기 모드로 설정
      }
    });
  };

  // Hz 정보 포맷팅
  const formatHz = (hz) => {
    return hz ? `${hz}Hz` : '정보 없음';
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 데이터 로드
  useEffect(() => {
    fetchDataFiles();
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

  if (loading) {
    return (
      <div className='player-data-select-1-page'>
        <LogoBellNav logo={true} />
        <div className="data-select-container">
          <div className="header">
            <div className="header-actions">
              <button className="back-btn" onClick={handleBack}>
                <img src={backIcon} alt="뒤로가기" />
              </button>
              <button className="upload-data-btn" onClick={handleDataUpload}>
                데이터 업로드
              </button>
            </div>
            <div className="header-content">
              <h1 className="text-h2">데이터 선택</h1>
              <p className="subtitle text-body">업로드한 데이터 파일을 선택하세요</p>
            </div>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="text-body">업로드 파일을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='player-data-select-1-page'>
      <LogoBellNav logo={true} />
      
      {/* 표준 헤더 구조 - Video_Folder/Anal_Folder 스타일 통일 */}
      <div className="data-select-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack}>
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <button className="upload-data-btn" onClick={handleDataUpload}>
              데이터 업로드
            </button>
          </div>
          <div className="header-content">
            <h1 className="text-h2">데이터 선택</h1>
            <p className="subtitle text-body">분석할 데이터 파일을 선택하여<br />개인 경기 분석을 시작해보세요</p>
          </div>
        </div>
      </div>

      {/* 파일 목록 헤더 */}
      <div className="files-header">
        <div className="files-count">
          <span className="text-h3">총 {dataFiles.length}개의 파일</span>
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
                  className={`sort-option ${sortOrder === 'newest' ? 'active' : ''}`}
                  onClick={() => {
                    handleSortChange('newest');
                    setShowSortMenu(false);
                  }}
                >
                  최신순
                </button>
                <button 
                  className={`sort-option ${sortOrder === 'oldest' ? 'active' : ''}`}
                  onClick={() => {
                    handleSortChange('oldest');
                    setShowSortMenu(false);
                  }}
                >
                  오래된순
                </button>
              </div>
            )}
          </div>
          <button 
            className={`section-search-btn ${showSearchBar ? 'active' : ''}`}
            onClick={handleSearchToggle}
            aria-label="파일 검색"
          >
            <img src={searchIcon} alt="검색" />
          </button>
          <button 
            className="section-refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="파일 목록 새로고침"
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
              placeholder="파일 이름으로 검색..."
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
                {filteredFiles.length}개의 파일 찾음
              </span>
            </div>
          )}
        </div>
      )}

      {/* 파일 목록 */}
      <div className="files-list">
        {dataFiles.length === 0 ? (
          <div className="empty-state">
            <p className="text-body">업로드된 데이터 파일이 없습니다.</p>
            <button 
              className="refresh-btn btn-secondary"
              onClick={handleRefresh}
            >
              새로고침
            </button>
          </div>
        ) : filteredFiles.length === 0 ? (
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
          filteredFiles.map((file) => (
            <div 
              key={file.id} 
              className={`file-card ${selectedFile?.id === file.id ? 'selected' : ''}`}
              onClick={() => handleFileSelect(file)}
            >
              <div className="file-icon">
                <img src={fileIcon} alt="파일" />
              </div>
              <div className="file-details">
                <h3 className="file-name text-h4">{file.name}</h3>
                <div className="file-meta">
                  <span className="text-caption">
                    {formatHz(file.hz)} • {formatDate(file.created_at)}
                  </span>
                </div>
              </div>
              <div className="file-selection">
                {selectedFile?.id === file.id && (
                  <div className="selected-indicator">✓</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 더 불러오기 버튼 - 검색 중이 아니고, 검색 결과가 10개 이상일 때만 표시 */}
      {hasMoreData && !searchQuery && filteredFiles.length >= filesPerPage && (
        <div className="load-more-section">
          <button 
            className="load-more-btn btn-secondary"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? '불러오는 중...' : `더 불러오기 (${Math.min(filesPerPage, allFiles.length - dataFiles.length)}개)`}
          </button>
        </div>
      )}

      {/* 분석 시작 버튼 */}
      {selectedFile && (
        <div className="action-section">
          <button 
            className="analyze-btn btn-primary"
            onClick={handleStartAnalysis}
          >
            경기장 선택하기
          </button>
        </div>
      )}
    </div>
  );
};

export default Player_Data_Select_1;
