import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import defaultTeamLogo from '../../../assets/common/default_profile.png';
import left from '../../../assets/common/left.png';
import cog from '../../../assets/common/cog.png';
import folderIcon from '../../../assets/main_icons/folder_black.png';
import downIcon from '../../../assets/common/down.png';
import optionIcon from '../../../assets/main_icons/option_black.png';
import userIcon from '../../../assets/common/user-black.png';
import LineBlack from '../../../assets/main_icons/line_black.png';
import PlayBlack from '../../../assets/main_icons/play_black.png';
import sortIcon from '../../../assets/main_icons/sort_black.png';
import searchIcon from '../../../assets/main_icons/search_black.png';
import refreshIcon from '../../../assets/main_icons/refresh_black.png';
import leftArrowIcon from '../../../assets/common/left.png';
import rightArrowIcon from '../../../assets/common/right.png';
import { 
  GetMyTeamInfoApi, 
  GetTeamLogoApi, 
  GetTeamMembersApi, 
  GetProfileImageApi, 
  GetTeamMatchesApi,
  GetTeamVideoFoldersApi,
  CreateTeamVideoFolderApi,
  UpdateTeamVideoFolderApi,
  DeleteTeamVideoFolderApi
} from '../../../function/api/user/userApi';
import FolderActionModal from '../../../components/FolderActionModal';
import FolderCreateModal from '../../../components/FolderCreateModal';
import MatchActionModal from '../../../components/MatchActionModal';
import '../css/Team_Info.scss';

const Team_Info = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [teamInfo, setTeamInfo] = useState(null);
  const [userRole, setUserRole] = useState('member'); // member, manager, owner
  
  // location.state에서 activeTab을 받아서 초기값 설정
  const initialTab = location.state?.activeTab || 'members';
  const [activeTab, setActiveTab] = useState(initialTab); // members, analysis, video
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [teamMatches, setTeamMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' 또는 'oldest'
  const [memberSortOrder, setMemberSortOrder] = useState('role'); // 'role', 'age', 'name'
  
  // 팀 비디오 폴더 관련 state
  const [teamVideoFolders, setTeamVideoFolders] = useState([]);
  const [videoFoldersLoading, setVideoFoldersLoading] = useState(false);
  const [videoSortOrder, setVideoSortOrder] = useState('latest'); // 'latest' 또는 'oldest'
  const [selectedVideoFolder, setSelectedVideoFolder] = useState(null);
  const [isVideoActionModalOpen, setIsVideoActionModalOpen] = useState(false);
  const [isVideoCreateModalOpen, setIsVideoCreateModalOpen] = useState(false);
  
  // 경기 관리 관련 state
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isMatchActionModalOpen, setIsMatchActionModalOpen] = useState(false);
  
  // 팀원 탭 - 정렬/검색 state
  const [showMemberSortMenu, setShowMemberSortMenu] = useState(false);
  const [showMemberSearchBar, setShowMemberSearchBar] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  
  // 팀원 페이지네이션 state
  const [memberCurrentPage, setMemberCurrentPage] = useState(0);
  const MEMBERS_PER_PAGE = 5;
  
  // 경기 분석 탭 - 정렬/검색 state
  const [showMatchSortMenu, setShowMatchSortMenu] = useState(false);
  const [showMatchSearchBar, setShowMatchSearchBar] = useState(false);
  const [matchSearchQuery, setMatchSearchQuery] = useState('');
  
  // 경기 영상 탭 - 정렬/검색 state
  const [showVideoSortMenu, setShowVideoSortMenu] = useState(false);
  const [showVideoSearchBar, setShowVideoSearchBar] = useState(false);
  const [videoSearchQuery, setVideoSearchQuery] = useState('');

  // 세션 스토리지에서 사용자 정보 가져오기 (URL 파라미터 대신 사용자 세션으로 팀 정보 조회)
  const userCode = sessionStorage.getItem('userCode');
  const token = sessionStorage.getItem('token');
  
  // 캐시 관련 상수
  const CACHE_KEY_TEAM_INFO = `team_info_cache_${userCode}`;
  const CACHE_KEY_MEMBERS = `team_members_cache_${userCode}`;
  const CACHE_KEY_MATCHES = `team_matches_cache_${userCode}`;
  const CACHE_KEY_VIDEOS = `team_videos_cache_${userCode}`;
  const CACHE_DURATION = 5 * 60 * 1000; // 5분 (밀리초)

  // 정렬 메뉴 외부 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMemberSortMenu && !event.target.closest('.member-sort-dropdown')) {
        setShowMemberSortMenu(false);
      }
      if (showMatchSortMenu && !event.target.closest('.match-sort-dropdown')) {
        setShowMatchSortMenu(false);
      }
      if (showVideoSortMenu && !event.target.closest('.video-sort-dropdown')) {
        setShowVideoSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMemberSortMenu, showMatchSortMenu, showVideoSortMenu]);

  // 포지션별 색상 클래스 반환 함수
  const getPositionClass = (position) => {
    if (!position) return 'position-default';
    
    const positionUpper = position.toUpperCase();
    
    // 공격수 포지션 (빨간색 계열)
    if (['LWF', 'ST', 'RWF'].includes(positionUpper)) {
      return 'position-striker';
    }
    // 미드필더 포지션 (초록색 계열)
    else if (['LWM', 'CAM', 'RWM', 'LM', 'CM', 'RM', 'CDM'].includes(positionUpper)) {
      return 'position-midfielder';
    }
    // 수비수 포지션 (파란색 계열)
    else if (['LWB', 'RWB', 'LB', 'CB', 'RB'].includes(positionUpper)) {
      return 'position-defender';
    }
    // 골키퍼 포지션 (노란색 계열)
    else if (['GK'].includes(positionUpper)) {
      return 'position-goalkeeper';
    }
    // 한글 포지션명 처리
    else if (position.includes('공격') || position.includes('스트라이커') || position.includes('윙어')) {
      return 'position-striker';
    } else if (position.includes('미드필더') || position.includes('미드') || position.includes('중앙')) {
      return 'position-midfielder';
    } else if (position.includes('수비') || position.includes('백')) {
      return 'position-defender';
    } else if (position.includes('골키퍼') || position.includes('키퍼')) {
      return 'position-goalkeeper';
    } else {
      return 'position-default';
    }
  };

  // 팀 로고 URL 가져오기
  const getTeamLogoUrl = useCallback(async (teamCode) => {
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
  }, []);

  // 범용 캐시 함수
  const getCachedData = useCallback((cacheKey, label) => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp > CACHE_DURATION) {
        sessionStorage.removeItem(cacheKey);
        return null;
      }
      
      return data;
    } catch (error) {
      return null;
    }
  }, [CACHE_DURATION]);
  
  // 범용 캐시 저장 함수
  const saveCachedData = useCallback((cacheKey, data, label) => {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now()
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      // 캐시 저장 실패 무시
    }
  }, []);

  // 팀 정보 가져오기 (캐시 우선)
  const fetchTeamInfo = useCallback(async (forceRefresh = false) => {
    const isTestAccount = userCode === 'test_team' || userCode === 'test_player';
    const isTestMode = sessionStorage.getItem('testMode') === 'true';
    
    if (!userCode || (!token && !isTestAccount && !isTestMode)) {
      navigate('/app/login');
      return;
    }

    try {
      setLoading(true);
      
      if (!forceRefresh) {
        const cachedTeamInfo = getCachedData(CACHE_KEY_TEAM_INFO, '팀 정보');
        if (cachedTeamInfo) {
          setTeamInfo(cachedTeamInfo);
          setUserRole(cachedTeamInfo.user_role || 'member');
          setLoading(false);
          return;
        }
      }
      
      const response = await GetMyTeamInfoApi(userCode);
      
      if (response.data && response.data.has_team && response.data.team_info) {
        const teamData = response.data.team_info;
        const logoUrl = await getTeamLogoUrl(teamData.team_code);
        
        const teamInfoWithLogo = {
          ...teamData,
          logo_url: logoUrl
        };
        
        setTeamInfo(teamInfoWithLogo);
        setUserRole(teamData.user_role || 'member');
        saveCachedData(CACHE_KEY_TEAM_INFO, teamInfoWithLogo, '팀 정보');
      } else {
        navigate('/app/main');
      }
    } catch (error) {
      navigate('/app/main');
    } finally {
      setLoading(false);
    }
  }, [userCode, token, navigate, getTeamLogoUrl, getCachedData, saveCachedData, CACHE_KEY_TEAM_INFO]);

  // 팀원 목록 가져오기 (캐시 우선)
  const fetchTeamMembers = useCallback(async (forceRefresh = false) => {
    if (!teamInfo || !userCode) return;

    try {
      setMembersLoading(true);
      
      // 강제 새로고침이 아니면 캐시 확인
      if (!forceRefresh) {
        const cachedMembers = getCachedData(CACHE_KEY_MEMBERS, '팀원 목록');
        if (cachedMembers) {
          setTeamMembers(cachedMembers);
          setMembersLoading(false);
          return;
        }
      }
      
      const response = await GetTeamMembersApi(teamInfo.team_code, userCode);
      
      if (response.data && response.data.members) {
        const membersWithImages = await Promise.all(
          response.data.members.map(async (member) => {
            try {
              const imageResponse = await GetProfileImageApi(member.user_code);
              return {
                ...member,
                profile_image_url: imageResponse.data.exists ? imageResponse.data.image_url : defaultTeamLogo
              };
            } catch (error) {
              return {
                ...member,
                profile_image_url: defaultTeamLogo
              };
            }
          })
        );
        
        setTeamMembers(membersWithImages);
        saveCachedData(CACHE_KEY_MEMBERS, membersWithImages, '팀원 목록');
      }
    } catch (error) {
      setTeamMembers([]);
    } finally {
      setMembersLoading(false);
    }
  }, [teamInfo, userCode, getCachedData, saveCachedData, CACHE_KEY_MEMBERS]);

  // 팀 경기 목록 가져오기 (캐시 우선)
  const fetchTeamMatches = useCallback(async (forceRefresh = false) => {
    if (!teamInfo || !userCode) {
      return;
    }

    try {
      setMatchesLoading(true);
      
      if (!forceRefresh) {
        const cachedMatches = getCachedData(CACHE_KEY_MATCHES, '경기 목록');
        if (cachedMatches) {
          setTeamMatches(cachedMatches);
          setMatchesLoading(false);
          return;
        }
      }
      
      const response = await GetTeamMatchesApi(teamInfo.team_code, userCode);
      
      if (response.data && response.data.matches) {
        console.log('경기 목록 조회 성공:', response.data.matches.length, '개');
        setTeamMatches(response.data.matches);
        saveCachedData(CACHE_KEY_MATCHES, response.data.matches, '경기 목록');
      } else {
        console.log('경기 목록이 없습니다:', response.data);
        setTeamMatches([]);
      }
    } catch (error) {
      console.error('경기 목록 조회 오류:', error);
      setTeamMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  }, [teamInfo, userCode, getCachedData, saveCachedData, CACHE_KEY_MATCHES]);

  // 팀 비디오 폴더 목록 가져오기 (캐시 우선)
  const fetchTeamVideoFolders = useCallback(async (forceRefresh = false) => {
    if (!teamInfo || !userCode) {
      return;
    }

    try {
      setVideoFoldersLoading(true);
      
      if (!forceRefresh) {
        const cachedVideoFolders = getCachedData(CACHE_KEY_VIDEOS, '비디오 폴더 목록');
        if (cachedVideoFolders) {
          setTeamVideoFolders(cachedVideoFolders);
          setVideoFoldersLoading(false);
          return;
        }
      }
      
      const response = await GetTeamVideoFoldersApi(teamInfo.team_code, userCode);
      
      if (response.data && response.data.folders) {
        setTeamVideoFolders(response.data.folders);
        saveCachedData(CACHE_KEY_VIDEOS, response.data.folders, '비디오 폴더 목록');
      } else {
        setTeamVideoFolders([]);
      }
    } catch (error) {
      setTeamVideoFolders([]);
    } finally {
      setVideoFoldersLoading(false);
    }
  }, [teamInfo, userCode, getCachedData, saveCachedData, CACHE_KEY_VIDEOS]);

  useEffect(() => {
    fetchTeamInfo();
  }, [fetchTeamInfo]);

  // location.state가 변경될 때 activeTab 업데이트
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (teamInfo) {
      fetchTeamMembers();
      // 모든 팀 멤버가 경기 목록을 볼 수 있음
      fetchTeamMatches();
      // 비디오 폴더 목록도 가져오기
      fetchTeamVideoFolders();
    }
  }, [teamInfo, fetchTeamMembers, fetchTeamMatches, fetchTeamVideoFolders]);
  
  // 정렬 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMemberSortMenu && !event.target.closest('.sort-dropdown')) {
        setShowMemberSortMenu(false);
      }
      if (showMatchSortMenu && !event.target.closest('.sort-dropdown')) {
        setShowMatchSortMenu(false);
      }
      if (showVideoSortMenu && !event.target.closest('.sort-dropdown')) {
        setShowVideoSortMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMemberSortMenu, showMatchSortMenu, showVideoSortMenu]);

  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate('/app/main');
  };

  // 설정 메뉴 토글
  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu);
  };

  // 팀 데이터 선택 페이지로 이동
  const handleTeamAnalysis = () => {
    if (teamInfo?.team_code) {
      sessionStorage.setItem('selectedTeamCode', teamInfo.team_code);
    }
    navigate('/app/team/data-select');
  };

  // 팀 영상 페이지로 이동
  const handleTeamVideo = () => {
    navigate('/app/team/video');
  };

  // 팀원 관리 페이지로 이동
  const handleTeamMembers = () => {
    navigate('/app/team/members');
  };

  // 팀 설정 페이지로 이동
  const handleTeamSettings = () => {
    navigate('/app/team/setting');
  };

  // 팀 나가기
  const handleLeaveTeam = () => {
    if (window.confirm('정말로 팀을 나가시겠습니까?')) {
    }
  };

  // 팀 삭제 (owner만 가능)
  const handleDeleteTeam = () => {
    if (window.confirm('팀을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    }
  };
  
  // 팀원 정렬 메뉴 핸들러
  const handleMemberSortChange = (option) => {
    setMemberSortOrder(option);
    setShowMemberSortMenu(false);
  };
  
  // 팀원 검색 토글
  const handleMemberSearchToggle = () => {
    setShowMemberSearchBar(!showMemberSearchBar);
    if (showMemberSearchBar) {
      setMemberSearchQuery('');
    }
  };
  
  // 경기 분석 정렬 메뉴 핸들러
  const handleMatchSortChange = (option) => {
    setSortOrder(option);
    setShowMatchSortMenu(false);
  };
  
  // 경기 분석 검색 토글
  const handleMatchSearchToggle = () => {
    setShowMatchSearchBar(!showMatchSearchBar);
    if (showMatchSearchBar) {
      setMatchSearchQuery('');
    }
  };
  
  // 경기 영상 정렬 메뉴 핸들러
  const handleVideoSortChange = (option) => {
    setVideoSortOrder(option);
    setShowVideoSortMenu(false);
  };
  
  // 경기 영상 검색 토글
  const handleVideoSearchToggle = () => {
    setShowVideoSearchBar(!showVideoSearchBar);
    if (showVideoSearchBar) {
      setVideoSearchQuery('');
    }
  };

  // 경기 카드 클릭 시 팀 분석 페이지로 이동
  const handleMatchClick = (match) => {
    navigate('/app/team/anal', { 
      state: { 
        passedMatchData: match,
        teamCode: teamInfo.team_code,
        matchId: match.match_code,
        userRole: userRole
      } 
    });
  };

  // 정렬된 경기 데이터
  const sortedMatches = [...teamMatches].sort((a, b) => {
    if (sortOrder === 'name') {
      return a.match_name.localeCompare(b.match_name);
    }
    
    const dateA = new Date(a.match_date + ' ' + a.start_time);
    const dateB = new Date(b.match_date + ' ' + b.start_time);
    
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });
  
  // 검색 필터링된 경기 데이터
  const filteredMatches = sortedMatches.filter(match => {
    if (!matchSearchQuery.trim()) return true;
    return match.match_name.toLowerCase().includes(matchSearchQuery.toLowerCase());
  });

  // 정렬된 멤버 데이터 (본인을 맨 위에 배치)
  const sortedMembers = [...teamMembers].sort((a, b) => {
    // 본인을 맨 위에 배치
    const isCurrentUserA = a.user_code === userCode;
    const isCurrentUserB = b.user_code === userCode;
    
    if (isCurrentUserA && !isCurrentUserB) return -1;
    if (!isCurrentUserA && isCurrentUserB) return 1;
    
    // 본인이 아닌 경우 기존 정렬 로직 적용
    switch (memberSortOrder) {
      case 'role':
        const roleOrder = { 'owner': 1, 'manager': 2, 'member': 3 };
        const roleCompare = (roleOrder[a.role] || 3) - (roleOrder[b.role] || 3);
        return roleCompare !== 0 ? roleCompare : a.name.localeCompare(b.name);
      
      case 'age':
        const ageA = a.age || 0;
        const ageB = b.age || 0;
        return ageA - ageB;
      
      case 'name':
        return a.name.localeCompare(b.name);
      
      default:
        return 0;
    }
  });
  
  // 검색 필터링된 멤버 데이터
  const filteredMembers = sortedMembers.filter(member => {
    if (!memberSearchQuery.trim()) return true;
    return member.name.toLowerCase().includes(memberSearchQuery.toLowerCase());
  });
  
  // 팀원 페이지네이션 계산
  const memberTotalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE);
  const memberStartIndex = memberCurrentPage * MEMBERS_PER_PAGE;
  const memberEndIndex = memberStartIndex + MEMBERS_PER_PAGE;
  const currentMembers = filteredMembers.slice(memberStartIndex, memberEndIndex);
  
  // 팀원 페이지네이션 핸들러
  const handleMemberPrevPage = () => {
    if (memberCurrentPage > 0) {
      setMemberCurrentPage(memberCurrentPage - 1);
    }
  };
  
  const handleMemberNextPage = () => {
    if (memberCurrentPage < memberTotalPages - 1) {
      setMemberCurrentPage(memberCurrentPage + 1);
    }
  };
  
  // 검색어 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setMemberCurrentPage(0);
  }, [memberSearchQuery, memberSortOrder]);

  // 정렬된 비디오 폴더 데이터
  const sortedVideoFolders = [...teamVideoFolders].sort((a, b) => {
    if (videoSortOrder === 'name') {
      return a.name.localeCompare(b.name);
    }
    
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    
    return videoSortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });
  
  // 검색 필터링된 비디오 폴더 데이터
  const filteredVideoFolders = sortedVideoFolders.filter(folder => {
    if (!videoSearchQuery.trim()) return true;
    return folder.name.toLowerCase().includes(videoSearchQuery.toLowerCase());
  });

  // 비디오 폴더 카드 클릭 시 해당 폴더의 비디오 목록 페이지로 이동
  const handleVideoFolderClick = (folder) => {
    navigate('/app/team/video', { 
      state: { 
        folderData: {
          folder_code: folder.folder_code,
          name: folder.name,
          team_code: folder.team_code,
          created_at: folder.created_at,
          updated_at: folder.updated_at,
          video_count: folder.video_count
        },
        folderId: folder.folder_code,
        teamCode: teamInfo.team_code,
        userRole: userRole
      } 
    });
  };

  // 비디오 폴더 더보기 버튼 클릭
  const handleVideoMoreClick = (folder) => {
    setSelectedVideoFolder(folder);
    setIsVideoActionModalOpen(true);
  };

  // 비디오 폴더 이름 변경
  const handleVideoFolderRename = async (newName) => {
    if (!selectedVideoFolder || !newName.trim()) return;
    
    try {
      const response = await UpdateTeamVideoFolderApi(
        teamInfo.team_code, 
        userCode,
        selectedVideoFolder.folder_code, 
        newName
      );
      
      if (response.data && response.data.success) {
        await fetchTeamVideoFolders(true);
        setIsVideoActionModalOpen(false);
      } else {
        throw new Error('폴더 이름 변경 실패');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || '이름 변경에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    }
  };

  // 비디오 폴더 삭제
  const handleVideoFolderDelete = async () => {
    if (!selectedVideoFolder) return;
    
    try {
      const response = await DeleteTeamVideoFolderApi(
        teamInfo.team_code, 
        userCode,
        selectedVideoFolder.folder_code
      );
      
      if (response.data && response.data.success) {
        await fetchTeamVideoFolders(true);
        setIsVideoActionModalOpen(false);
      } else {
        throw new Error('폴더 삭제 실패');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || '삭제에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    }
  };

  // 비디오 폴더 생성 (owner/manager만 가능)
  const handleVideoFolderCreate = async (folderName) => {
    if (!folderName.trim()) return;
    
    if (userRole !== 'owner' && userRole !== 'manager') {
      alert('폴더 생성 권한이 없습니다.');
      return;
    }
    
    try {
      const response = await CreateTeamVideoFolderApi(
        teamInfo.team_code, 
        userCode,
        folderName
      );
      
      if (response.data && response.data.success) {
        await fetchTeamVideoFolders(true);
        setIsVideoCreateModalOpen(false);
      } else {
        throw new Error('폴더 생성 실패');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || '폴더 생성에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    }
  };

  // 경기 옵션 버튼 클릭
  const handleMatchMoreClick = (match) => {
    setSelectedMatch(match);
    setIsMatchActionModalOpen(true);
  };

  // 경기 이름 변경 (팀장/매니저만 가능)
  const handleMatchRename = async (newName) => {
    if (!selectedMatch || !newName.trim()) return;
    
    try {
      alert('경기 이름 변경 기능은 준비 중입니다.');
      setIsMatchActionModalOpen(false);
    } catch (error) {
      alert('이름 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 경기 삭제 (팀장/매니저만 가능)
  const handleMatchDelete = async () => {
    if (!selectedMatch) return;
    
    try {
      alert('경기 삭제 기능은 준비 중입니다.');
      setIsMatchActionModalOpen(false);
    } catch (error) {
      alert('경기 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };


  if (loading) {
    return (
      <div className="team-info-container">
        <div className="loading-state">
          <p>팀 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!teamInfo) {
    return null;
  }

  return (
    <div className={`team-info-container ${activeTab === 'analysis' ? 'analysis-active' : ''}`}>
      {/* 로고와 벨 네비게이션 */}
      <LogoBellNav logo={true} />
      
      {/* 표준 헤더 구조 */}
      <div className="team-info-header-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack} aria-label="뒤로가기">
              <img src={left} alt="뒤로가기" />
            </button>
            <div className="header-right-actions">
              <div className="settings-wrapper">
                <button 
                  className="settings-btn" 
                  onClick={toggleSettingsMenu}
                  aria-label="설정"
                >
                  <img src={cog} alt="설정" />
                </button>
              {showSettingsMenu && (
                <div className="settings-dropdown">
                  {/* 팀장: 팀 정보 수정, 팀원 초대, 팀 삭제 */}
                  {userRole === 'owner' && (
                    <>
                      <button onClick={handleTeamSettings} className="dropdown-item">
                        팀 정보 수정
                      </button>
                      <button onClick={handleTeamMembers} className="dropdown-item">
                        팀원 초대
                      </button>
                      <button onClick={handleDeleteTeam} className="dropdown-item danger">
                        팀 삭제
                      </button>
                    </>
                  )}
                  
                  {/* 매니저: 팀 정보 수정, 팀원 초대, 팀 나가기 */}
                  {userRole === 'manager' && (
                    <>
                      <button onClick={handleTeamSettings} className="dropdown-item">
                        팀 정보 수정
                      </button>
                      <button onClick={handleTeamMembers} className="dropdown-item">
                        팀원 초대
                      </button>
                      <button onClick={handleLeaveTeam} className="dropdown-item">
                        팀 나가기
                      </button>
                    </>
                  )}
                  
                  {/* 멤버: 팀 나가기만 */}
                  {userRole === 'member' && (
                    <button onClick={handleLeaveTeam} className="dropdown-item">
                      팀 나가기
                    </button>
                  )}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 팀 정보 섹션 */}
      <section className="team-info-section">
        <div className="team-header-content">
          <div className="team-logo-wrapper">
            <img 
              src={teamInfo.logo_url || defaultTeamLogo} 
              alt={`${teamInfo.name} 로고`}
              className="team-logo"
              onError={(e) => { e.target.src = defaultTeamLogo; }}
            />
          </div>
          <div className="team-info-details">
            <div className="team-stats">
              <span className="stat-item">
                <span className="stat-label">멤버</span>
                <span className="stat-value">{teamInfo.members_count}명</span>
              </span>
            </div>
            <h2 className="team-name text-h2">{teamInfo.name}</h2>
          </div>
        </div>
        {teamInfo.introduce && (
          <p className="team-introduce text-body">{teamInfo.introduce}</p>
        )}
      </section>

      {/* 탭 메뉴 */}
      <div className={`tab-menu ${
        activeTab === 'members' ? 'tab-1' : 
        activeTab === 'analysis' ? 'tab-2' : 
        activeTab === 'video' ? 'tab-3' : 'tab-1'
      }`}>
        <button 
          className={`tab-item ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
          aria-label="팀원 목록 보기"
        >
          <img src={userIcon} alt="" className="tab-icon" />
          팀원
        </button>
        <button 
          className={`tab-item ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
          aria-label="경기 분석 보기"
        >
          <img src={LineBlack} alt="" className="tab-icon" />
          경기 분석
        </button>
        <button 
          className={`tab-item ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
          aria-label="경기 영상 보기"
        >
          <img src={PlayBlack} alt="" className="tab-icon" />
          경기 영상
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="tab-content">
        {activeTab === 'members' && (
          <div className="members-section">
            {/* 팀원 목록 헤더 */}
            <div className="members-header">
              <div className="members-count">
                <span className="text-h3">총 {teamMembers.length}명</span>
              </div>
              <div className="header-actions">
                <div className="member-sort-dropdown">
                  <button 
                    className="sort-btn"
                    onClick={() => setShowMemberSortMenu(!showMemberSortMenu)}
                    aria-label="정렬 옵션"
                  >
                    <img src={sortIcon} alt="정렬" />
                  </button>
                  {showMemberSortMenu && (
                    <div className="sort-menu">
                      <button 
                        className={`sort-option ${memberSortOrder === 'role' ? 'active' : ''}`}
                        onClick={() => handleMemberSortChange('role')}
                      >
                        권한순
                      </button>
                      <button 
                        className={`sort-option ${memberSortOrder === 'age' ? 'active' : ''}`}
                        onClick={() => handleMemberSortChange('age')}
                      >
                        나이순
                      </button>
                      <button 
                        className={`sort-option ${memberSortOrder === 'name' ? 'active' : ''}`}
                        onClick={() => handleMemberSortChange('name')}
                      >
                        이름순
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  className={`section-search-btn ${showMemberSearchBar ? 'active' : ''}`}
                  onClick={handleMemberSearchToggle}
                  aria-label="팀원 검색"
                >
                  <img src={searchIcon} alt="검색" />
                </button>
                <button 
                  className="section-refresh-btn"
                  onClick={() => fetchTeamMembers(true)}
                  aria-label="팀원 목록 새로고침"
                >
                  <img src={refreshIcon} alt="새로고침" />
                </button>
              </div>
            </div>
            
            {/* 검색창 */}
            {showMemberSearchBar && (
              <div className="search-bar-container">
                <div className="search-input-wrapper">
                  <img src={searchIcon} alt="검색" className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="팀원 이름으로 검색..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {memberSearchQuery && (
                    <button 
                      className="clear-search-btn"
                      onClick={() => setMemberSearchQuery('')}
                      aria-label="검색어 지우기"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {memberSearchQuery && (
                  <div className="search-result-count">
                    <span className="text-caption">
                      {filteredMembers.length}명의 팀원 찾음
                    </span>
                  </div>
                )}
              </div>
            )}

            {membersLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="text-body">팀원 목록을 불러오는 중...</p>
              </div>
            ) : filteredMembers.length === 0 && memberSearchQuery ? (
              <div className="empty-state">
                <p className="text-body">검색 결과가 없습니다.</p>
                <button 
                  className="clear-search-btn btn-secondary"
                  onClick={() => setMemberSearchQuery('')}
                >
                  검색어 지우기
                </button>
              </div>
            ) : teamMembers.length > 0 ? (
              <>
                <div className="members-list">
                  {currentMembers.map((member) => {
                    const isCurrentUser = member.user_code === userCode;
                    return (
                      <div key={member.user_code} className={`member-card ${isCurrentUser ? 'current-user' : ''}`}>
                        <div className="member-avatar">
                          <img 
                            src={member.profile_image_url || defaultTeamLogo} 
                            alt={`${member.name} 프로필`}
                            onError={(e) => { e.target.src = defaultTeamLogo; }}
                          />
                          {isCurrentUser && <div className="current-user-badge">나</div>}
                        </div>
                        <div className="member-info">
                          <div className="member-header">
                            <h4 className="member-name text-h4">
                              {member.name}
                            </h4>
                            <span className={`member-role ${member.role}`}>
                              {member.role === 'owner' ? '팀장' : 
                               member.role === 'manager' ? '매니저' : '멤버'}
                            </span>
                          </div>
                          <div className="member-details">
                            <span className="member-age text-body-sm">
                              {member.age ? `${member.age}세` : '나이 미상'}
                            </span>
                            <span className="member-divider">•</span>
                            <span className="member-number text-body-sm">
                              {member.number !== null && member.number !== undefined ? `${member.number}번` : '등번호 미설정'}
                            </span>
                            <span className="member-divider">•</span>
                            <span className="member-position text-body-sm">
                              {member.preferred_position || '포지션 미상'}
                            </span>
                          </div>
                          <div className="member-meta">
                            <span className="member-location text-caption">
                              {member.activity_area || '지역 미상'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* 페이지네이션 컨트롤 */}
                {memberTotalPages > 1 && (
                  <div className='member-pagination'>
                    <button 
                      className='pagination-btn prev-btn'
                      onClick={handleMemberPrevPage}
                      disabled={memberCurrentPage === 0}
                      aria-label="이전 페이지"
                    >
                      <img src={leftArrowIcon} alt="이전" />
                    </button>
                    
                    <div className='pagination-indicator'>
                      <span className='current-page'>{memberCurrentPage + 1}</span>
                      <span className='separator'>/</span>
                      <span className='total-pages'>{memberTotalPages}</span>
                    </div>
                    
                    <button 
                      className='pagination-btn next-btn'
                      onClick={handleMemberNextPage}
                      disabled={memberCurrentPage >= memberTotalPages - 1}
                      aria-label="다음 페이지"
                    >
                      <img src={rightArrowIcon} alt="다음" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <p className="empty-title text-h3">팀원이 없습니다</p>
                <p className="empty-description text-body">설정 메뉴에서 팀원을 초대할 수 있습니다</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="analysis-section">
            {/* 경기 목록 헤더 */}
            <div className="matches-header">
              <div className="matches-count">
                <span className="text-h3">총 {teamMatches.length}개의 경기</span>
              </div>
              <div className="header-actions">
                {/* 경기분석 버튼 - owner/manager만 표시 */}
                {(userRole === 'owner' || userRole === 'manager') && (
                  <button 
                    className="analysis-btn"
                    onClick={handleTeamAnalysis}
                  >
                    경기분석
                  </button>
                )}
                <div className="sort-dropdown">
                  <button 
                    className="sort-btn"
                    onClick={() => setShowMatchSortMenu(!showMatchSortMenu)}
                    aria-label="정렬 옵션"
                  >
                    <img src={sortIcon} alt="정렬" />
                  </button>
                  {showMatchSortMenu && (
                    <div className="sort-menu">
                      <button 
                        className={`sort-option ${sortOrder === 'latest' ? 'active' : ''}`}
                        onClick={() => handleMatchSortChange('latest')}
                      >
                        최신순
                      </button>
                      <button 
                        className={`sort-option ${sortOrder === 'oldest' ? 'active' : ''}`}
                        onClick={() => handleMatchSortChange('oldest')}
                      >
                        오래된순
                      </button>
                      <button 
                        className={`sort-option ${sortOrder === 'name' ? 'active' : ''}`}
                        onClick={() => handleMatchSortChange('name')}
                      >
                        이름순
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  className={`section-search-btn ${showMatchSearchBar ? 'active' : ''}`}
                  onClick={handleMatchSearchToggle}
                  aria-label="경기 검색"
                >
                  <img src={searchIcon} alt="검색" />
                </button>
                <button 
                  className="section-refresh-btn"
                  onClick={() => fetchTeamMatches(true)}
                  aria-label="경기 목록 새로고침"
                >
                  <img src={refreshIcon} alt="새로고침" />
                </button>
              </div>
            </div>
            
            {/* 검색창 */}
            {showMatchSearchBar && (
              <div className="search-bar-container">
                <div className="search-input-wrapper">
                  <img src={searchIcon} alt="검색" className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="경기 이름으로 검색..."
                    value={matchSearchQuery}
                    onChange={(e) => setMatchSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {matchSearchQuery && (
                    <button 
                      className="clear-search-btn"
                      onClick={() => setMatchSearchQuery('')}
                      aria-label="검색어 지우기"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {matchSearchQuery && (
                  <div className="search-result-count">
                    <span className="text-caption">
                      {filteredMatches.length}개의 경기 찾음
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 경기 목록 */}
            {matchesLoading ? (
              <div className="loading-container">
                <p>경기 데이터를 불러오는 중...</p>
              </div>
            ) : filteredMatches.length === 0 && matchSearchQuery ? (
              <div className="empty-state">
                <p className="text-body">검색 결과가 없습니다.</p>
                <button 
                  className="clear-search-btn btn-secondary"
                  onClick={() => setMatchSearchQuery('')}
                >
                  검색어 지우기
                </button>
              </div>
            ) : teamMatches.length > 0 ? (
              <div className="matches-list">
                {filteredMatches.map((match) => (
                  <div key={match.match_code} className="match-card">
                    <div 
                      className="match-info"
                      onClick={() => handleMatchClick(match)}
                    >
                      <div className="match-icon">
                        <img src={folderIcon} alt="경기" />
                      </div>
                      <div className="match-details">
                        <h3 className="match-title text-h4">{match.match_name}</h3>
                        <p className="match-meta text-caption">
                          {match.quarter_count}쿼터 • {match.match_date}
                        </p>
                      </div>
                    </div>
                    {/* 팀장/매니저만 옵션 버튼 표시 */}
                    {(userRole === 'owner' || userRole === 'manager') && (
                      <div className="match-actions">
                        <button 
                          className="more-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMatchMoreClick(match);
                          }}
                        >
                          <img src={optionIcon} alt="더보기" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="empty-title text-h3">분석할 경기가 없습니다</p>
                <p className="empty-description text-body">
                  {userRole === 'owner' || userRole === 'manager' 
                    ? '새로운 경기를 업로드하여 분석을 시작해보세요' 
                    : '팀장 또는 매니저가 경기를 업로드하면 여기서 확인할 수 있습니다'}
                </p>
              </div>
            )}

          </div>
        )}

        {activeTab === 'video' && (
          <div className="video-section">
            {/* 비디오 폴더 목록 헤더 */}
            <div className="folders-header">
              <div className="folders-count">
                <span className="text-h3">총 {teamVideoFolders.length}개의 폴더</span>
              </div>
              <div className="header-actions">
                {/* 폴더 추가 버튼 - owner/manager만 표시 */}
                {(userRole === 'owner' || userRole === 'manager') && (
                  <button 
                    className="create-folder-btn"
                    onClick={() => setIsVideoCreateModalOpen(true)}
                  >
                    폴더 추가
                  </button>
                )}
                <div className="sort-dropdown">
                  <button 
                    className="sort-btn"
                    onClick={() => setShowVideoSortMenu(!showVideoSortMenu)}
                    aria-label="정렬 옵션"
                  >
                    <img src={sortIcon} alt="정렬" />
                  </button>
                  {showVideoSortMenu && (
                    <div className="sort-menu">
                      <button 
                        className={`sort-option ${videoSortOrder === 'latest' ? 'active' : ''}`}
                        onClick={() => handleVideoSortChange('latest')}
                      >
                        최신순
                      </button>
                      <button 
                        className={`sort-option ${videoSortOrder === 'oldest' ? 'active' : ''}`}
                        onClick={() => handleVideoSortChange('oldest')}
                      >
                        오래된순
                      </button>
                      <button 
                        className={`sort-option ${videoSortOrder === 'name' ? 'active' : ''}`}
                        onClick={() => handleVideoSortChange('name')}
                      >
                        이름순
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  className={`section-search-btn ${showVideoSearchBar ? 'active' : ''}`}
                  onClick={handleVideoSearchToggle}
                  aria-label="영상 폴더 검색"
                >
                  <img src={searchIcon} alt="검색" />
                </button>
                <button 
                  className="section-refresh-btn"
                  onClick={() => fetchTeamVideoFolders(true)}
                  aria-label="영상 폴더 목록 새로고침"
                >
                  <img src={refreshIcon} alt="새로고침" />
                </button>
              </div>
            </div>
            
            {/* 검색창 */}
            {showVideoSearchBar && (
              <div className="search-bar-container">
                <div className="search-input-wrapper">
                  <img src={searchIcon} alt="검색" className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="영상 폴더 이름으로 검색..."
                    value={videoSearchQuery}
                    onChange={(e) => setVideoSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {videoSearchQuery && (
                    <button 
                      className="clear-search-btn"
                      onClick={() => setVideoSearchQuery('')}
                      aria-label="검색어 지우기"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {videoSearchQuery && (
                  <div className="search-result-count">
                    <span className="text-caption">
                      {filteredVideoFolders.length}개의 폴더 찾음
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 비디오 폴더 목록 */}
            {videoFoldersLoading ? (
              <div className="loading-container">
                <p>비디오 폴더를 불러오는 중...</p>
              </div>
            ) : filteredVideoFolders.length === 0 && videoSearchQuery ? (
              <div className="empty-state">
                <p className="text-body">검색 결과가 없습니다.</p>
                <button 
                  className="clear-search-btn btn-secondary"
                  onClick={() => setVideoSearchQuery('')}
                >
                  검색어 지우기
                </button>
              </div>
            ) : teamVideoFolders.length > 0 ? (
              <div className="folders-list">
                {filteredVideoFolders.map((folder) => (
                  <div key={folder.folder_code} className="folder-card">
                    <div 
                      className="folder-info"
                      onClick={() => handleVideoFolderClick(folder)}
                    >
                      <div className="folder-icon">
                        <img src={folderIcon} alt="폴더" />
                      </div>
                      <div className="folder-details">
                        <h3 className="folder-title text-h4">{folder.name}</h3>
                        <p className="folder-meta text-caption">
                          {folder.video_count}개 영상 • {new Date(folder.created_at).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    {/* 팀장/매니저만 옵션 버튼 표시 */}
                    {(userRole === 'owner' || userRole === 'manager') && (
                      <div className="folder-actions">
                        <button 
                          className="more-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVideoMoreClick(folder);
                          }}
                        >
                          <img src={optionIcon} alt="더보기" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="empty-title text-h3">경기 영상이 없습니다</p>
                <p className="empty-description text-body">
                  {userRole === 'owner' || userRole === 'manager' 
                    ? '새로운 경기 영상을 업로드하여 관리를 시작해보세요' 
                    : '팀장 또는 매니저가 경기 영상을 업로드하면 여기서 확인할 수 있습니다'}
                </p>
              </div>
            )}

          </div>
        )}
      </div>

      {/* 비디오 폴더 설정 모달 */}
      <FolderActionModal
        isOpen={isVideoActionModalOpen}
        onClose={() => setIsVideoActionModalOpen(false)}
        onRename={handleVideoFolderRename}
        onDelete={handleVideoFolderDelete}
        folderTitle={selectedVideoFolder?.name}
        folderData={selectedVideoFolder}
      />

      {/* 비디오 폴더 생성 모달 */}
      <FolderCreateModal
        isOpen={isVideoCreateModalOpen}
        onClose={() => setIsVideoCreateModalOpen(false)}
        onCreate={handleVideoFolderCreate}
      />

      {/* 경기 관리 모달 */}
      <MatchActionModal
        isOpen={isMatchActionModalOpen}
        onClose={() => setIsMatchActionModalOpen(false)}
        onRename={handleMatchRename}
        onDelete={handleMatchDelete}
        matchTitle={selectedMatch?.match_name}
        matchData={selectedMatch}
      />

    </div>
  );
};

export default Team_Info;