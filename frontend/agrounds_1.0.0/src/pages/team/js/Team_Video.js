import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import defaultTeamLogo from '../../../assets/common/default_profile.png';
import backIcon from '../../../assets/main_icons/back_black.png';
import sortIcon from '../../../assets/main_icons/sort_black.png';
import refreshIcon from '../../../assets/main_icons/refresh_black.png';
import optionIcon from '../../../assets/main_icons/option_black.png';
import VideoAddDSModal from '../../../components/Modal/variants/VideoAddDSModal';
import VideoDeleteDSModal from '../../../components/Modal/variants/VideoDeleteDSModal';
import VideoActionDSModal from '../../../components/Modal/variants/VideoActionDSModal';
import VideoOptionDSModal from '../../../components/Modal/variants/VideoOptionDSModal';
import VideoChangeQuarterDSModal from '../../../components/Modal/variants/VideoChangeQuarterDSModal';
import '../css/Team_Video.scss';

// API
import { GetTeamFolderVideosApi, CreateTeamVideoApi, DeleteTeamVideoApi, UpdateVideoQuarterApi } from '../../../function/api/video/videoApi';
import { GetQuarterDataApi } from '../../../function/api/anal/analApi';
import { GetMatchDetailApi } from '../../../function/api/match/matchApi';

const Team_Video = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [folderInfo, setFolderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('latest'); // 'latest', 'oldest', 'name'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [videoTitles, setVideoTitles] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVideoActionModalOpen, setIsVideoActionModalOpen] = useState(false);
  const [isVideoOptionModalOpen, setIsVideoOptionModalOpen] = useState(false);
  const [isChangeQuarterModalOpen, setIsChangeQuarterModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Team_Info에서 전달받은 사용자 역할 정보 (기본값: member)
  const initialUserRole = location.state?.userRole || 'member';
  const [userRole, setUserRole] = useState(initialUserRole); // member, manager, owner

  // 폴더 정보 가져오기 (location.state에서)
  const folderData = location.state?.folderData || {
    folder_code: 'tf_001', // 팀 폴더 테스트용 기본값
    name: '5월 16일 팀 경기',
    team_code: 't_001',
    video_count: 0
  };

  const teamCode = location.state?.teamCode || folderData.team_code;
  const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code');

  // 뒤로가기 함수
  const handleBack = () => {
    navigate('/app/team/info', {
      state: {
        activeTab: 'video' // 경기 영상 탭 활성화
      }
    });
  };

  // 영상 목록 불러오기 함수
  const fetchVideos = async () => {
    if (!folderData?.folder_code || !teamCode || !userCode) {
      setVideos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const response = await GetTeamFolderVideosApi(teamCode, userCode, folderData.folder_code);
      
      if (!response || !response.data) {
        throw new Error('비어있는 응답 데이터');
      }
      
      const { data } = response;
      
      setFolderInfo(data.folder_info);
      const apiVideos = Array.isArray(data.videos) ? data.videos : [];
      
      if (apiVideos.length === 0) {
        setVideos([]);
        return;
      }
      
      const normalized = apiVideos.map((video, idx) => ({
        id: video.video_code || `video_${idx}`,
        video_code: video.video_code || `video_${idx}`,
        folder_code: video.folder_code,
        quarter_code: video.quarter_code,
        url: video.url,
        created_at: video.created_at || new Date().toISOString(),
        updated_at: video.updated_at || new Date().toISOString()
      }));
      
      setVideos(normalized);
      
      const titlePromises = normalized.map(async (video) => {
        const title = await getYouTubeTitle(video.url);
        return { videoCode: video.video_code, title };
      });
      
      const titles = await Promise.all(titlePromises);
      const titleMap = {};
      titles.forEach(({ videoCode, title }) => {
        titleMap[videoCode] = title;
      });
      
      setVideoTitles(titleMap);
    } catch (error) {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // 실제 데이터 로드
  useEffect(() => {
    fetchVideos();
  }, [folderData, teamCode, userCode]);

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

  // 정렬된 영상 데이터
  const sortedVideos = [...videos].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    
    switch (sortOption) {
      case 'latest':
        return dateB - dateA;
      case 'oldest':
        return dateA - dateB;
      case 'name':
        const titleA = videoTitles[a.video_code] || a.quarter_code || '영상';
        const titleB = videoTitles[b.video_code] || b.quarter_code || '영상';
        return titleA.localeCompare(titleB);
      default:
        return dateB - dateA;
    }
  });

  // 정렬 옵션 변경 처리
  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortMenu(false);
  };

  // 영상 추가
  const handleAddVideo = async (videoData) => {
    try {
      const response = await CreateTeamVideoApi(
        teamCode,
        userCode,
        videoData.folderCode,
        videoData.quarterCode || '',
        videoData.url
      );
      
      if (response.data.video_code || response.data.success) {
        setIsAddModalOpen(false);
        await fetchVideos();
      } else {
        alert(`영상 추가에 실패했습니다: ${response.data.message || response.data.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      if (error.response) {
        alert(`서버 오류: ${error.response.data.message || error.response.data.error || '영상 추가에 실패했습니다.'}`);
      } else if (error.request) {
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      } else {
        alert('영상 추가 중 오류가 발생했습니다.');
      }
    }
  };

  // YouTube URL에서 썸네일 추출
  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`;
    }
    return null;
  };

  // YouTube 제목 가져오기
  const getYouTubeTitle = async (url) => {
    if (!url) return '영상';
    
    try {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (!videoId) return '영상';
      
      // YouTube oEmbed API 사용
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (response.ok) {
        const data = await response.json();
        return data.title || '영상';
      }
    } catch (error) {
      // YouTube API 호출 실패 시 기본값 사용
    }
    
    return '영상';
  };

  // 영상 삭제 모달 열기 - VideoOptionModal에서 호출됨
  const handleDeleteVideo = (video) => {
    setSelectedVideo(video);
    setIsDeleteModalOpen(true);
  };

  // 관련 쿼터 변경 모달 열기 - VideoOptionModal에서 호출됨
  const handleOpenChangeQuarter = () => {
    if (!selectedVideo) return;
    setIsChangeQuarterModalOpen(true);
  };

  // 관련 쿼터 변경 핸들러 - VideoChangeQuarterModal에서 호출됨
  const handleChangeQuarter = async (newQuarterCode) => {
    if (!selectedVideo) return;
    
    try {
      const response = await UpdateVideoQuarterApi(
        userCode,
        selectedVideo.video_code,
        newQuarterCode
      );
      
      if (response.data.video_code || response.data.success || response.status === 200) {
        setIsChangeQuarterModalOpen(false);
        setIsVideoOptionModalOpen(false);
        setSelectedVideo(null);
        await fetchVideos();
      } else {
        alert(`쿼터 변경에 실패했습니다: ${response.data.message || response.data.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      if (error.response) {
        alert(`서버 오류: ${error.response.data.message || error.response.data.error || '쿼터 변경에 실패했습니다.'}`);
      } else if (error.request) {
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      } else {
        alert('쿼터 변경 중 오류가 발생했습니다.');
      }
    }
  };

  // 영상 클릭 핸들러 - 영상보기, 분석결과확인 모달
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsVideoActionModalOpen(true);
  };

  // 옵션 버튼 클릭 핸들러 - 삭제, 관련 쿼터 변경 모달
  const handleOptionClick = (video) => {
    setSelectedVideo(video);
    setIsVideoOptionModalOpen(true);
  };

  // 영상보기
  const handleWatchVideo = () => {
    if (!selectedVideo) return;
    
    const url = selectedVideo.url;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 모바일에서는 YouTube 앱으로 열기 시도
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (videoId) {
        const youtubeAppUrl = `vnd.youtube:${videoId[1]}`;
        window.location.href = youtubeAppUrl;
        
        // 앱이 없으면 웹으로 폴백
        setTimeout(() => {
          window.open(url, '_blank');
        }, 1000);
      } else {
        window.open(url, '_blank');
      }
    } else {
      // 데스크톱에서는 새 탭으로 열기
      window.open(url, '_blank');
    }
    
    setIsVideoActionModalOpen(false);
  };

  // 분석 결과 보러가기
  const handleViewAnalysis = async () => {
    if (!selectedVideo || !selectedVideo.quarter_code) return;
    
    try {
      const quarterCode = selectedVideo.quarter_code;
      
      const quarterResponse = await GetQuarterDataApi(userCode, quarterCode);
      
      if (!quarterResponse || !quarterResponse.data) {
        throw new Error('쿼터 분석 데이터를 가져올 수 없습니다.');
      }
      let matchData = quarterResponse.data.match_info;
      
      if (matchData && matchData.match_code) {
        try {
          const matchDetailResponse = await GetMatchDetailApi(userCode, matchData.match_code);
          if (matchDetailResponse && matchDetailResponse.data) {
            matchData = {
              ...matchData,
              ...matchDetailResponse.data,
              quarters: matchDetailResponse.data.quarters || []
            };
          }
        } catch (matchError) {
          // 경기 상세 정보 로드 실패 시 기본 데이터 사용
        }
      }
      const quarterNumber = quarterResponse.data.quarter_info?.quarter || 1;
      const quarterData = {
        quarter: quarterNumber,
        quarter_code: quarterCode,
        name: quarterResponse.data.quarter_info?.name || `쿼터 ${quarterNumber}`,
        ...quarterResponse.data.quarter_info
      };
      if (!matchData.quarters || matchData.quarters.length === 0) {
        matchData.quarters = [{
          quarter: quarterResponse.data.quarter_info?.quarter || 1,
          quarter_code: quarterCode,
          name: quarterResponse.data.quarter_info?.name || `쿼터 ${quarterResponse.data.quarter_info?.quarter || 1}`
        }];
      }
      navigate('/app/team/analysis', {
        state: {
          quarter: quarterData,
          matchData: matchData,
          teamCode: teamCode
        }
      });
      
      setIsVideoActionModalOpen(false);
    } catch (error) {
      alert('분석 결과를 불러올 수 없습니다. 다시 시도해주세요.');
    }
  };

  // 영상 삭제 확인
  const handleConfirmDelete = async () => {
    if (!selectedVideo) return;
    
    try {
      const response = await DeleteTeamVideoApi(teamCode, userCode, selectedVideo.video_code);
      
      if (response.data.success || response.data.deleted_at || response.status === 200) {
        setIsDeleteModalOpen(false);
        setIsVideoOptionModalOpen(false);
        setSelectedVideo(null);
        await fetchVideos();
      } else {
        alert(`영상 삭제에 실패했습니다: ${response.data.message || response.data.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      if (error.response) {
        alert(`서버 오류: ${error.response.data.message || error.response.data.error || '영상 삭제에 실패했습니다.'}`);
      } else if (error.request) {
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      } else {
        alert('영상 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <>
        <div className='team-video-page'>
          <LogoBellNav logo={true} />
          
          {/* 표준 헤더 구조 */}
          <div className="team-video-container">
            <div className="header">
              <div className="header-actions">
                <button className="back-btn" onClick={handleBack}>
                  <img src={backIcon} alt="뒤로가기" />
                </button>
                <div className="header-spacer"></div>
              </div>
              <div className="header-content">
                <h1 className="text-h2">{folderData?.name || '팀 경기영상'}</h1>
                <p className="subtitle text-body">팀 경기 영상을 확인하고 관리하세요</p>
              </div>
            </div>
          </div>

          {/* 로딩 상태 */}
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text text-body">영상을 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

  // 폴더 데이터가 없을 때 처리
  if (!folderData?.folder_code) {
    return (
      <>
        <div className='team-video-page'>
          <LogoBellNav logo={true} />
          
          {/* 표준 헤더 구조 */}
          <div className="team-video-container">
            <div className="header">
              <div className="header-actions">
                <button className="back-btn" onClick={handleBack}>
                  <img src={backIcon} alt="뒤로가기" />
                </button>
                <div className="header-spacer"></div>
              </div>
              <div className="header-content">
                <h1 className="text-h2">팀 경기영상</h1>
                <p className="subtitle text-body">팀 경기 영상을 확인하고 관리하세요</p>
              </div>
            </div>
          </div>

          {/* 오류 상태 */}
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p className="error-title text-h3">폴더 정보를 찾을 수 없습니다</p>
            <p className="error-description text-body">요청하신 폴더 정보가 존재하지 않습니다.</p>
            <button onClick={handleBack} className="btn-primary">
              팀 정보로 돌아가기
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className='team-video-page'>
        <LogoBellNav logo={true} />
        
        {/* 표준 헤더 구조 */}
        <div className="team-video-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack}>
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <button className="add-video-btn" onClick={() => setIsAddModalOpen(true)}>
              영상 추가
            </button>
          </div>
          <div className="header-content">
            <h1 className="text-h2">{folderData?.name || '팀 경기영상'}</h1>
            <p className="subtitle text-body">팀 경기 영상을 확인하고 관리하세요</p>
          </div>
        </div>
      </div>

      {/* 영상 목록 헤더 */}
      <div className="videos-header">
        <div className="videos-count">
          <span className="text-h3">총 {videos.length}개의 동영상</span>
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
            className="section-refresh-btn"
            onClick={fetchVideos}
            aria-label="영상 목록 새로고침"
          >
            <img src={refreshIcon} alt="새로고침" />
          </button>
        </div>
      </div>

      {/* 영상 목록 */}
      <div className="videos-list">
        {sortedVideos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <p className="empty-title">영상이 없습니다</p>
            <p className="empty-description">하단의 '영상 추가하기' 버튼을 눌러 팀 경기 영상을 추가해보세요.</p>
            <button 
              className="btn-primary" 
              onClick={() => setIsAddModalOpen(true)}
            >
              영상 추가하기
            </button>
          </div>
        ) : (
          sortedVideos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-info" onClick={() => handleVideoClick(video)}>
                <div className="video-thumbnail">
                  <img 
                    src={getYouTubeThumbnail(video.url) || defaultTeamLogo} 
                    alt="영상 썸네일"
                    onError={(e) => {
                      e.target.src = defaultTeamLogo;
                    }}
                  />
                </div>
                <div className="video-details">
                  <h3 className="video-title text-h4">
                    {videoTitles[video.video_code] || video.quarter_code || '영상'}
                  </h3>
                  <p className="video-meta text-caption">
                    {new Date(video.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      weekday: 'short'
                    }).replace(/\./g, '.').replace(/\s/g, ' ')}
                    {video.quarter_code && (
                      <span className="analysis-badge">경기분석 있음</span>
                    )}
                  </p>
                </div>
              </div>
              {/* 팀장/매니저만 옵션 버튼 표시 */}
              {(userRole === 'owner' || userRole === 'manager') && (
                <div className="video-actions">
                  <button 
                    className="more-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionClick(video);
                    }}
                  >
                    <img src={optionIcon} alt="더보기" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      </div>

      {/* 영상 추가 모달 */}
      <VideoAddDSModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddVideo}
        folderCode={folderData?.folder_code}
      />

      {/* 영상 액션 모달 - 영상보기, 분석결과확인 */}
      <VideoActionDSModal
        isOpen={isVideoActionModalOpen}
        onClose={() => setIsVideoActionModalOpen(false)}
        onWatchVideo={handleWatchVideo}
        onViewAnalysis={handleViewAnalysis}
        videoTitle={selectedVideo ? (videoTitles[selectedVideo.video_code] || selectedVideo.quarter_code || '영상') : ''}
        hasAnalysis={selectedVideo ? !!selectedVideo.quarter_code : false}
      />

      {/* 영상 옵션 모달 - 삭제, 관련 쿼터 변경 */}
      <VideoOptionDSModal
        isOpen={isVideoOptionModalOpen}
        onClose={() => setIsVideoOptionModalOpen(false)}
        onChangeQuarter={handleOpenChangeQuarter}
        onDelete={() => handleDeleteVideo(selectedVideo)}
        videoTitle={selectedVideo ? (videoTitles[selectedVideo.video_code] || selectedVideo.quarter_code || '영상') : ''}
      />

      {/* 영상 쿼터 변경 모달 */}
      <VideoChangeQuarterDSModal
        isOpen={isChangeQuarterModalOpen}
        onClose={() => setIsChangeQuarterModalOpen(false)}
        onChangeQuarter={handleChangeQuarter}
        currentQuarterCode={selectedVideo?.quarter_code}
        videoTitle={selectedVideo ? (videoTitles[selectedVideo.video_code] || selectedVideo.quarter_code || '영상') : ''}
      />

      {/* 영상 삭제 모달 */}
      <VideoDeleteDSModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        videoTitle={selectedVideo ? (videoTitles[selectedVideo.video_code] || selectedVideo.quarter_code || '영상') : ''}
      />
    </>
  );
};

export default Team_Video;
