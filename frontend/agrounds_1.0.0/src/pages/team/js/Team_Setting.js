import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import RegionModal from '../../../components/Modal/variants/RegionModal';
import CropModal from '../../../components/Modal/variants/CropModal';
import Pagination from '../../../components/Pagination';
import '../css/Team_Setting.scss';
// 팀 관련 API 함수들 import
import { 
  GetMyTeamInfoApi, 
  UpdateTeamInfoApi, 
  UploadTeamLogoApi, 
  GetTeamLogoApi,
  GetTeamMembersApi, 
  UpdateTeamMemberNumberApi,
  UpdateTeamMemberRoleApi,
  GetProfileImageApi
} from '../../../function/api/user/userApi';
// 승인된 아이콘 디렉토리 사용
import defaultTeamLogo from '../../../assets/common/default_profile.png';
import cameraIcon from '../../../assets/main_icons/camera_white.png';
import backIcon from '../../../assets/main_icons/back_black.png';
import downIcon from '../../../assets/main_icons/down_gray.png';
import searchIcon from '../../../assets/main_icons/search_black.png';
import sortIcon from '../../../assets/main_icons/sort_black.png';

const Team_Setting = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // 팀 정보 상태
  const [teamInfo, setTeamInfo] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [userRole, setUserRole] = useState('member');
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    teamName: '',
    location: '',
    description: ''
  });
  
  // 초기 데이터 상태 (변경사항 감지용)
  const [initialData, setInitialData] = useState({
    teamName: '',
    location: '',
    description: '',
    logoUrl: null,
    memberNumbers: {}
  });
  
  // 지역 선택 모달 상태
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigungu, setSelectedSigungu] = useState('');
  
  // 로고 관련 상태
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState(null);
  
  // 이미지 크롭 관련 상태
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  // 등번호 관련 상태
  const [memberNumbers, setMemberNumbers] = useState({});
  const [numberErrors, setNumberErrors] = useState({});
  
  // 역할 관련 상태
  const [memberRoles, setMemberRoles] = useState({});
  
  // 역할 드롭다운 열림 상태 (각 멤버별로 관리)
  const [openRoleDropdowns, setOpenRoleDropdowns] = useState({});
  
  // 검색 및 페이지네이션 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const membersPerPage = 5;
  
  // 정렬 상태
  const [sortOption, setSortOption] = useState('role'); // 'role', 'name', 'joinDate'
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 세션 정보
  const userCode = sessionStorage.getItem('userCode');
  const token = sessionStorage.getItem('token');
  
  // 지역 데이터
  const sidoList = ['전국','서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시','세종특별자치시','경기도','강원특별자치도','충청북도','충청남도','전북특별자치도','전라남도','경상북도','경상남도','제주특별자치도'];
  const sigunguMap = {
    '전국': ['전체'],
    '서울특별시': ['전체','강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'],
    '부산광역시': ['전체','중구','서구','동구','영도구','부산진구','동래구','남구','북구','해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'],
    '대구광역시': ['전체','중구','동구','서구','남구','북구','수성구','달서구','달성군'],
    '인천광역시': ['전체','중구','동구','미추홀구','연수구','남동구','부평구','계양구','서구','강화군','옹진군'],
    '광주광역시': ['전체','동구','서구','남구','북구','광산구'],
    '대전광역시': ['전체','동구','중구','서구','유성구','대덕구'],
    '울산광역시': ['전체','중구','남구','동구','북구','울주군'],
    '세종특별자치시': ['전체','세종특별자치시'],
    '경기도': ['전체','수원시','고양시','용인시','성남시','부천시','화성시','안산시','남양주시','안양시','평택시','의정부시','파주시','시흥시','김포시','광주시','광명시','군포시','오산시','이천시','안성시','의왕시','하남시','양주시','구리시','포천시','여주시','동두천시','과천시'],
    '강원특별자치도': ['전체','춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군','영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'],
    '충청북도': ['전체','청주시','충주시','제천시','보은군','옥천군','영동군','증평군','진천군','괴산군','음성군','단양군'],
    '충청남도': ['전체','천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시','금산군','부여군','서천군','청양군','홍성군','예산군','태안군'],
    '전북특별자치도': ['전체','전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군','장수군','임실군','순창군','고창군','부안군'],
    '전라남도': ['전체','목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군','보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군','장성군','완도군','진도군','신안군'],
    '경상북도': ['전체','포항시','경주시','김천시','안동시','구미시','영주시','영천시','상주시','문경시','경산시','군위군','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군','예천군','봉화군','울진군','울릉군'],
    '경상남도': ['전체','창원시','진주시','통영시','사천시','김해시','밀양시','거제시','양산시','의령군','함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'],
    '제주특별자치도': ['전체','제주시','서귀포시']
  };

  // 팀 정보 가져오기
  const fetchTeamInfo = async () => {
    const isTestAccount = userCode === 'test_team' || userCode === 'test_player';
    const isTestMode = sessionStorage.getItem('testMode') === 'true';
    
    if (!userCode || (!token && !isTestAccount && !isTestMode)) {
      navigate('/app/login');
      return;
    }

    try {
      setLoading(true);
      const response = await GetMyTeamInfoApi(userCode);
      
      if (response.data && response.data.has_team && response.data.team_info) {
        const teamData = response.data.team_info;
        
        // 팀 로고 URL 가져오기
        const logoUrl = await getTeamLogoUrl(teamData.team_code);
        
        setTeamInfo({
          ...teamData,
          logo_url: logoUrl
        });
        setCurrentLogoUrl(logoUrl);
        setUserRole(teamData.user_role || 'member');
        
        const initialFormData = {
          teamName: teamData.name || '',
          location: teamData.local || '',
          description: teamData.introduce || ''
        };
        setFormData(initialFormData);
        
        setInitialData({
          ...initialFormData,
          logoUrl: logoUrl,
          memberNumbers: {}
        });
        await fetchTeamMembers(teamData.team_code);
      } else {
        navigate('/app/main');
      }
    } catch (error) {
      navigate('/app/main');
    } finally {
      setLoading(false);
    }
  };

  // 팀 로고 URL 가져오기
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

  // 팀원 목록 가져오기
  const fetchTeamMembers = async (teamCode) => {
    try {
      const response = await GetTeamMembersApi(teamCode, userCode);
      
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
        const initialNumbers = {};
        const initialRoles = {};
        membersWithImages.forEach(member => {
          initialNumbers[member.user_code] = member.number || '';
          initialRoles[member.user_code] = member.role || 'member';
        });
        setMemberNumbers(initialNumbers);
        setMemberRoles(initialRoles);
        
        setInitialData(prev => ({
          ...prev,
          memberNumbers: initialNumbers
        }));
      }
    } catch (error) {
      setTeamMembers([]);
    }
  };

  useEffect(() => {
    fetchTeamInfo();
  }, []);

  // 권한 체크 - owner나 manager만 접근 가능
  useEffect(() => {
    if (!loading && userRole !== 'owner' && userRole !== 'manager') {
      alert('팀 설정 권한이 없습니다.');
      navigate('/app/team/info');
    }
  }, [loading, userRole, navigate]);

  // 입력 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // 등번호 입력 핸들러
  const handleNumberChange = (userCode, value) => {
    if (value === '') {
      setMemberNumbers(prev => ({
        ...prev,
        [userCode]: ''
      }));
      
      if (numberErrors[userCode]) {
        setNumberErrors(prev => ({
          ...prev,
          [userCode]: null
        }));
      }
      return;
    }
    
    const cleanValue = value.replace(/[^0-9]/g, '');
    const numValue = parseInt(cleanValue, 10);
    
    if (numValue < 0 || numValue > 99) {
      setNumberErrors(prev => ({
        ...prev,
        [userCode]: '0-99 사이의 숫자를 입력해주세요.'
      }));
      return;
    }
    
    setMemberNumbers(prev => ({
      ...prev,
      [userCode]: cleanValue
    }));
    
    if (numberErrors[userCode]) {
      setNumberErrors(prev => ({
        ...prev,
        [userCode]: null
      }));
    }
  };
  
  // 역할 드롭다운 토글
  const toggleRoleDropdown = (userCode) => {
    setOpenRoleDropdowns(prev => ({
      ...prev,
      [userCode]: !prev[userCode]
    }));
  };
  
  // 역할 변경 핸들러 (팀장은 항상 1명만 유지)
  const handleRoleChange = (userCode, newRole) => {
    setMemberRoles(prev => {
      const updated = { ...prev };
      
      // 팀장으로 변경하는 경우
      if (newRole === 'owner') {
        // 기존 팀장 찾기
        const currentOwner = teamMembers.find(m => {
          const currentRole = prev[m.user_code] || m.role || 'member';
          return currentRole === 'owner';
        });
        
        // 기존 팀장이 있고, 변경하려는 사람이 기존 팀장이 아닌 경우
        if (currentOwner && currentOwner.user_code !== userCode) {
          // 기존 팀장을 매니저로 변경
          updated[currentOwner.user_code] = 'manager';
        }
      }
      // 팀장을 다른 역할로 변경하려는 경우
      else if (prev[userCode] === 'owner' || teamMembers.find(m => m.user_code === userCode)?.role === 'owner') {
        // 다른 팀원 중 하나를 팀장으로 자동 변경
        const otherMembers = teamMembers.filter(m => m.user_code !== userCode);
        if (otherMembers.length > 0) {
          // 첫 번째 멤버를 팀장으로 변경
          const newOwner = otherMembers[0];
          updated[newOwner.user_code] = 'owner';
        }
      }
      
      // 선택한 사용자의 역할 변경
      updated[userCode] = newRole;
      
      return updated;
    });
    
    // 드롭다운 닫기
    setOpenRoleDropdowns(prev => ({
      ...prev,
      [userCode]: false
    }));
  };
  
  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.ds-select')) {
        setOpenRoleDropdowns({});
      }
      if (!event.target.closest('.ds-dropdown')) {
        setShowSortMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // 정렬 옵션 변경 핸들러
  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortMenu(false);
    setCurrentPage(0); // 정렬 변경 시 첫 페이지로 이동
  };

  // 이미지 크롭 헬퍼 함수
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });
  
  const createCroppedImage = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };
  
  // 크롭 완료 시 호출되는 콜백
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  // 로고 이미지 선택 핸들러
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          logo: 'JPG, JPEG, PNG 파일만 업로드 가능합니다.'
        }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          logo: '파일 크기는 5MB 이하여야 합니다.'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
      
      if (errors.logo) {
        setErrors(prev => ({
          ...prev,
          logo: null
        }));
      }
    }
  };
  
  // 크롭 완료 핸들러
  const handleCropSave = async () => {
    try {
      if (!croppedAreaPixels) return;
      
      const croppedBlob = await createCroppedImage(imageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], 'team-logo.jpg', { type: 'image/jpeg' });
      setLogoFile(croppedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(croppedBlob);
      setShowCropModal(false);
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (error) {
      alert('이미지 편집에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  // 크롭 취소 핸들러
  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  // 로고 클릭 핸들러
  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  // 폼 검증
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.teamName.trim()) {
      newErrors.teamName = '팀 이름을 입력해주세요.';
    } else if (formData.teamName.length > 20) {
      newErrors.teamName = '팀 이름은 20자 이내로 입력해주세요.';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = '활동 지역을 입력해주세요.';
    } else if (formData.location.length > 30) {
      newErrors.location = '활동 지역은 30자 이내로 입력해주세요.';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '팀 소개를 입력해주세요.';
    } else if (formData.description.length > 200) {
      newErrors.description = '팀 소개는 200자 이내로 입력해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 등번호 검증
  const validateNumbers = () => {
    const newNumberErrors = {};
    
    Object.entries(memberNumbers).forEach(([userCode, number]) => {
      if (number !== '') {
        const numValue = parseInt(number, 10);
        
        if (isNaN(numValue) || numValue < 0 || numValue > 99) {
          newNumberErrors[userCode] = '0-99 사이의 숫자를 입력해주세요.';
        }
      }
    });
    
    setNumberErrors(newNumberErrors);
    return Object.keys(newNumberErrors).length === 0;
  };

  // 팀 정보 수정 제출 핸들러
  const handleSubmit = async () => {
    if (!validateForm() || !validateNumbers()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const teamUpdateResponse = await UpdateTeamInfoApi({
        teamCode: teamInfo.team_code,
        teamName: formData.teamName,
        location: formData.location,
        description: formData.description
      });
      if (logoFile && teamInfo.team_code) {
        try {
          const logoResponse = await UploadTeamLogoApi(teamInfo.team_code, logoFile);
        } catch (logoError) {
          // 로고 업로드 실패해도 계속 진행
        }
      }
      const numberUpdatePromises = [];
      Object.entries(memberNumbers).forEach(([targetUserCode, number]) => {
        const member = teamMembers.find(m => m.user_code === targetUserCode);
        const currentNumber = member?.number;
        const newNumber = number === '' ? null : parseInt(number, 10);
        
        // 등번호가 변경된 경우만 업데이트
        if (currentNumber !== newNumber) {
          numberUpdatePromises.push(
            UpdateTeamMemberNumberApi(teamInfo.team_code, userCode, targetUserCode, newNumber)
          );
        }
      });
      
      if (numberUpdatePromises.length > 0) {
        await Promise.all(numberUpdatePromises);
      }
      
      // 역할 변경 처리
      const roleUpdatePromises = [];
      Object.entries(memberRoles).forEach(([targetUserCode, newRole]) => {
        const member = teamMembers.find(m => m.user_code === targetUserCode);
        const currentRole = member?.role || 'member';
        
        // 역할이 변경된 경우만 업데이트
        if (currentRole !== newRole) {
          roleUpdatePromises.push(
            UpdateTeamMemberRoleApi(teamInfo.team_code, userCode, targetUserCode, newRole)
          );
        }
      });
      
      if (roleUpdatePromises.length > 0) {
        await Promise.all(roleUpdatePromises);
      }
      
      alert('팀 설정이 성공적으로 수정되었습니다!');
      navigate('/app/team/info');
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert('팀 설정 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setSaving(false);
    }
  };

  // 변경사항 감지 함수
  const hasChanges = () => {
    const formChanged = 
      formData.teamName !== initialData.teamName ||
      formData.location !== initialData.location ||
      formData.description !== initialData.description;
    
    const logoChanged = logoFile !== null || logoPreview !== null;
    
    const memberNumbersChanged = Object.keys(memberNumbers).some(userCode => {
      const currentNumber = memberNumbers[userCode] || '';
      const initialNumber = initialData.memberNumbers[userCode] || '';
      return currentNumber !== initialNumber;
    });
    
    const memberRolesChanged = Object.keys(memberRoles).some(userCode => {
      const member = teamMembers.find(m => m.user_code === userCode);
      const currentRole = memberRoles[userCode] || 'member';
      const initialRole = member?.role || 'member';
      return currentRole !== initialRole;
    });
    
    return formChanged || logoChanged || memberNumbersChanged || memberRolesChanged;
  };
  
  // 정렬 함수
  const sortMembers = (members, option) => {
    const sorted = [...members];
    switch (option) {
      case 'role': {
        // 역할 순: owner > manager > member
        const roleOrder = { owner: 0, manager: 1, member: 2 };
        return sorted.sort((a, b) => {
          const roleA = memberRoles[a.user_code] || a.role || 'member';
          const roleB = memberRoles[b.user_code] || b.role || 'member';
          return roleOrder[roleA] - roleOrder[roleB];
        });
      }
      case 'name': {
        // 이름 순
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      }
      case 'joinDate': {
        // 가입 시간 순 (created_at 기준, 최신순)
        return sorted.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateB - dateA; // 최신순
        });
      }
      default:
        return sorted;
    }
  };
  
  // 검색 필터링 및 정렬된 팀원 목록
  const filteredMembers = useMemo(() => {
    let members = teamMembers;
    
    // 검색 필터링
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      members = members.filter(member => 
        member.name?.toLowerCase().includes(searchLower)
      );
    }
    
    // 정렬 적용
    return sortMembers(members, sortOption);
  }, [teamMembers, searchTerm, sortOption, memberRoles]);
  
  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const paginatedMembers = useMemo(() => {
    const startIndex = currentPage * membersPerPage;
    return filteredMembers.slice(startIndex, startIndex + membersPerPage);
  }, [filteredMembers, currentPage, membersPerPage]);
  
  // 검색어 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate('/app/team/info');
  };

  if (loading) {
    return (
      <div className="team-setting">
        <LogoBellNav logo={true} />
        <div className="team-setting-container">
          <div className="loading-state">
            <p>팀 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!teamInfo) {
    return null;
  }

  return (
    <div className="team-setting">
      <LogoBellNav logo={true} />
      
      <div className="team-setting-container">
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
            <h1 className="text-h2">팀 설정</h1>
            <p className="subtitle text-body">팀 정보와 팀원 등번호를 수정할 수 있습니다.</p>
          </div>
        </div>
        
        {/* 팀 로고 업로드 섹션 */}
        <div className="form-section">
          <h3 className="section-title text-h3">팀 로고</h3>
          <div className="logo-upload-container">
            <div className="logo-preview" onClick={handleLogoClick}>
              {logoPreview ? (
                <img src={logoPreview} alt="팀 로고 미리보기" />
              ) : (
                <img src={currentLogoUrl || defaultTeamLogo} alt="현재 팀 로고" className="current-logo" />
              )}
              <div className="camera-overlay">
                <img src={cameraIcon} alt="카메라" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleLogoChange}
              style={{ display: 'none' }}
            />
            {errors.logo && (
              <p className="error-message text-caption">{errors.logo}</p>
            )}
            <p className="help-text text-caption">JPG, PNG 형식 (최대 5MB)</p>
          </div>
        </div>
        
        {/* 팀 이름 입력 */}
        <div className="form-section">
          <h3 className="section-title text-h3">팀 이름</h3>
          <div className="input-wrapper">
            <input
              type="text"
              className={`text-input ${errors.teamName ? 'error' : ''}`}
              placeholder="팀 이름을 입력하세요"
              value={formData.teamName}
              onChange={(e) => handleInputChange('teamName', e.target.value)}
              maxLength={20}
            />
            <span className="char-count text-caption">
              {formData.teamName.length}/20
            </span>
          </div>
          {errors.teamName && (
            <p className="error-message text-caption">{errors.teamName}</p>
          )}
        </div>
        
        {/* 활동 지역 선택 */}
        <div className="form-section">
          <h3 className="section-title text-h3">활동 지역</h3>
          <div 
            className={`region-selector ${errors.location ? 'error' : ''} ${formData.location ? 'selected' : ''}`}
            onClick={() => setShowRegionModal(true)}
          >
            <span className="region-text text-body">
              {formData.location || '활동 지역을 선택하세요'}
            </span>
            <img src={downIcon} alt="" className="arrow-icon" />
          </div>
          {errors.location && (
            <p className="error-message text-caption">{errors.location}</p>
          )}
        </div>
        
        {/* 팀 소개 입력 */}
        <div className="form-section">
          <h3 className="section-title text-h3">팀 소개</h3>
          <div className="input-wrapper">
            <textarea
              className={`text-area ${errors.description ? 'error' : ''}`}
              placeholder="팀을 소개해주세요"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              maxLength={200}
              rows={5}
            />
            <span className="char-count text-caption">
              {formData.description.length}/200
            </span>
          </div>
          {errors.description && (
            <p className="error-message text-caption">{errors.description}</p>
          )}
        </div>

        {/* 팀원 역할 및 등번호 설정 섹션 */}
        <div className="form-section">
          <h3 className="section-title text-h3">팀원 역할 및 등번호</h3>
          <p className="section-description text-body">각 팀원의 역할과 등번호를 설정할 수 있습니다. (등번호: 0-99)</p>
          
          {/* 검색창 및 정렬 */}
          <div className="member-search-wrapper">
            <div className="search-input-container">
              <img src={searchIcon} alt="검색" className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="팀원 이름으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ds-dropdown">
              <button
                type="button"
                className="icon-square-btn"
                onClick={() => setShowSortMenu(!showSortMenu)}
                aria-label="정렬"
              >
                <img src={sortIcon} alt="정렬" />
              </button>
              {showSortMenu && (
                <div className="ds-dropdown__menu">
                  <button
                    type="button"
                    className={`ds-dropdown__option ${sortOption === 'role' ? 'active' : ''}`}
                    onClick={() => handleSortChange('role')}
                  >
                    역할순
                  </button>
                  <button
                    type="button"
                    className={`ds-dropdown__option ${sortOption === 'name' ? 'active' : ''}`}
                    onClick={() => handleSortChange('name')}
                  >
                    이름순
                  </button>
                  <button
                    type="button"
                    className={`ds-dropdown__option ${sortOption === 'joinDate' ? 'active' : ''}`}
                    onClick={() => handleSortChange('joinDate')}
                  >
                    가입 시간순
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="members-number-list">
            {paginatedMembers.map((member) => {
              const currentRole = memberRoles[member.user_code] || member.role || 'member';
              return (
                <div key={member.user_code} className="member-number-item">
                  <div className="member-info">
                    <div className="member-avatar">
                      <img 
                        src={member.profile_image_url || defaultTeamLogo} 
                        alt={`${member.name} 프로필`}
                        onError={(e) => { e.target.src = defaultTeamLogo; }}
                      />
                    </div>
                    <div className="member-details">
                      <h4 className="member-name text-h4">{member.name}</h4>
                    </div>
                  </div>
                  <div className="member-settings">
                    <div className="role-select-wrapper">
                      <div className="ds-select">
                        <button
                          type="button"
                          className={`ds-select__button ${openRoleDropdowns[member.user_code] ? 'is-open' : ''}`}
                          onClick={() => {
                            if (!(member.role === 'owner' && userRole !== 'owner')) {
                              toggleRoleDropdown(member.user_code);
                            }
                          }}
                          disabled={member.role === 'owner' && userRole !== 'owner'}
                        >
                          <span className="ds-select__text">
                            {currentRole === 'owner' ? '팀장' : 
                             currentRole === 'manager' ? '매니저' : '멤버'}
                          </span>
                          <span className="ds-select__icon">
                            <img src={downIcon} alt="열기" />
                          </span>
                        </button>
                        {openRoleDropdowns[member.user_code] && (
                          <div className="ds-select__menu">
                            <button
                              type="button"
                              className={`ds-select__option ${currentRole === 'member' ? 'is-active' : ''}`}
                              onClick={() => handleRoleChange(member.user_code, 'member')}
                            >
                              멤버
                            </button>
                            <button
                              type="button"
                              className={`ds-select__option ${currentRole === 'manager' ? 'is-active' : ''}`}
                              onClick={() => handleRoleChange(member.user_code, 'manager')}
                            >
                              매니저
                            </button>
                            {userRole === 'owner' && (
                              <button
                                type="button"
                                className={`ds-select__option ${currentRole === 'owner' ? 'is-active' : ''}`}
                                onClick={() => handleRoleChange(member.user_code, 'owner')}
                              >
                                팀장
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="number-input-wrapper">
                      <input
                        type="number"
                        className={`number-input ${numberErrors[member.user_code] ? 'error' : ''}`}
                        placeholder="등번호"
                        value={memberNumbers[member.user_code] || ''}
                        onChange={(e) => handleNumberChange(member.user_code, e.target.value)}
                        min="0"
                        max="99"
                      />
                      {numberErrors[member.user_code] && (
                        <p className="error-message text-caption">{numberErrors[member.user_code]}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        
        {/* 버튼 섹션 */}
        <div className="button-section">
          <button 
            className="submit-btn text-body"
            onClick={handleSubmit}
            disabled={saving || !hasChanges()}
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
      
      {/* 지역 선택 모달 */}
      <RegionModal
        isOpen={showRegionModal}
        onClose={() => setShowRegionModal(false)}
        title="활동지역 선택"
        sidoList={sidoList}
        sigunguMap={sigunguMap}
        selectedSido={selectedSido}
        selectedSigungu={selectedSigungu}
        onSelectSido={(sido) => {
          setSelectedSido(sido);
          setSelectedSigungu('');
          // 전국, 세종특별자치시는 시군구가 없으므로 바로 선택 완료
          if (sido === '전국' || sido === '세종특별자치시') {
            handleInputChange('location', sido);
            setShowRegionModal(false);
          }
        }}
        onSelectSigungu={(sigungu) => {
          setSelectedSigungu(sigungu);
          // "전체" 선택 시 바로 선택 완료
          if (sigungu === '전체') {
            const areaText = selectedSido === '전국' ? '전국' : selectedSido;
            handleInputChange('location', areaText);
            setShowRegionModal(false);
          }
        }}
        onReset={() => {
          setSelectedSido('');
          setSelectedSigungu('');
        }}
        onConfirm={() => {
          let areaText;
          if (selectedSido === '전국') {
            areaText = '전국';
          } else if (selectedSigungu === '전체') {
            areaText = selectedSido;
          } else {
            areaText = `${selectedSido} ${selectedSigungu}`;
          }
          handleInputChange('location', areaText);
          setShowRegionModal(false);
        }}
        disabledConfirm={!selectedSido || !selectedSigungu || selectedSigungu === '전체'}
      />
      
      {/* 이미지 크롭 모달 */}
      <CropModal
        isOpen={showCropModal}
        onClose={handleCropCancel}
        title="로고 이미지 편집"
        imageSrc={imageSrc}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onConfirm={handleCropSave}
        loading={saving}
        size="lg"
      />
    </div>
  );
};

export default Team_Setting;
