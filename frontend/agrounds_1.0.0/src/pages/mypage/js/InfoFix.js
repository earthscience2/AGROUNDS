import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import Input_error_tooltip from '../../../components/Input_error_tooltip';
import LoginInput from '../../../components/Login_input';
import { TextModal, OptionModal, RegionModal, CropModal } from '../../../components/Modal/variants';
import CircleBtn from '../../../components/Circle_common_btn';
import right from '../../../assets/common/right.png';
import checkGreenIcon from '../../../assets/common/check_green.png';
import backIcon from '../../../assets/common/left.png';
import camera from '../../../assets/common/camera.png';
import defaultProfile from '../../../assets/common/default_profile.png';
import '../css/InfoFix.scss';
import { GetUserInfoApi, EditUserInfoApi, GetProfileImageApi, UploadProfileImageApi } from '../../../function/api/user/userApi';

const InfoFix = () => {
  const navigate = useNavigate();
  
  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate(-1);
  };

  // 사용자 정보 상태
  const [userInfo, setUserInfo] = useState({
    name: '',
    gender: '',
    userType: '',
    userLevel: '',
    height: '',
    weight: '',
    preferredPosition: '',
    activityArea: '',
    aiType: ''
  });

  const [originalData, setOriginalData] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  // 프로필 이미지 관련 상태
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const fileInputRef = useRef(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [imageJustUploaded, setImageJustUploaded] = useState(false); // 이미지 업로드 직후 플래그
  const [imageKey, setImageKey] = useState(Date.now()); // 이미지 강제 리렌더링용 키
  
  // 이미지 크롭 관련 상태
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalOptions, setModalOptions] = useState([]);
  const [textValue, setTextValue] = useState('');
  const [textError, setTextError] = useState('');

  // 지역 선택 모달 상태
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigungu, setSelectedSigungu] = useState('');

  // (DSModal이 스크롤 락/포커스 트랩을 처리)

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

  // 옵션 데이터
  const fieldOptions = {
    gender: [
      { value: 'male', label: '남성' },
      { value: 'female', label: '여성' }
    ],
    userType: [
      { value: 'player', label: '선수' },
      { value: 'coach', label: '감독, 코치' },
      { value: 'parent', label: '학부모' },
      { value: 'other', label: '기타' }
    ],
    userLevel: [
      { value: 'youth', label: '유소년' },
      { value: 'adult', label: '일반 성인' },
      { value: 'pro', label: '프로 성인' }
    ],
    preferredPosition: [
      { value: 'LWF', label: 'LWF', color: '#FF6B6B' },
      { value: 'ST', label: 'ST', color: '#FF6B6B' },
      { value: 'RWF', label: 'RWF', color: '#FF6B6B' },
      { value: 'LWM', label: 'LWM', color: '#079669' },
      { value: 'CAM', label: 'CAM', color: '#079669' },
      { value: 'RWM', label: 'RWM', color: '#079669' },
      { value: 'LM', label: 'LM', color: '#079669' },
      { value: 'CM', label: 'CM', color: '#079669' },
      { value: 'RM', label: 'RM', color: '#079669' },
      { value: 'CDM', label: 'CDM', color: '#079669' },
      { value: 'LWB', label: 'LWB', color: '#3B82F6' },
      { value: 'RWB', label: 'RWB', color: '#3B82F6' },
      { value: 'LB', label: 'LB', color: '#3B82F6' },
      { value: 'CB', label: 'CB', color: '#3B82F6' },
      { value: 'RB', label: 'RB', color: '#3B82F6' },
      { value: 'GK', label: 'GK', color: '#F59E0B' }
    ],
    aiType: [
      { value: 'strict_leader', label: '엄격한 리더' },
      { value: 'emotional_support_girl', label: '여자친구' },
      { value: 'emotional_support_boy', label: '남자친구' },
      { value: 'mentor', label: '멘토' },
      { value: 'data_analyst', label: '데이터 분석가' },
      { value: 'cheerleader', label: '응원단장' },
      { value: 'casual_friend', label: '친근한 친구' }
    ]
  };

  // 사용자 정보 및 프로필 이미지 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userCode = sessionStorage.getItem('userCode');
        if (userCode) {
          const response = await GetUserInfoApi(userCode);
          const userData = {
            name: response.data.name || '',
            gender: response.data.gender || '',
            userType: response.data.user_type || '',
            userLevel: response.data.level || '',
            height: response.data.height || '',
            weight: response.data.weight || '',
            preferredPosition: response.data.preferred_position || '',
            activityArea: response.data.activity_area || '',
            aiType: response.data.ai_type || ''
          };
          setUserInfo(userData);
          setOriginalData(userData);
          
          // 프로필 이미지 가져오기 (업로드 직후가 아닌 경우만)
          if (!imageJustUploaded) {
            try {
              const imageResponse = await GetProfileImageApi(userCode);
              if (imageResponse.data.exists && imageResponse.data.image_url) {
                setProfileImage(imageResponse.data.image_url);
              } else {
                setProfileImage(defaultProfile);
              }
            } catch (imageError) {
              console.error('프로필 이미지 가져오기 실패:', imageError);
              setProfileImage(defaultProfile);
            }
          }
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        setErrorText('사용자 정보를 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [imageJustUploaded]);

  // 크롭 완료 콜백
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  // 이미지 로드 헬퍼 함수
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });
  
  // 크롭된 이미지 생성 함수
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

  // 프로필 이미지 변경 핸들러 - 크롭 모달 열기
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('파일 크기는 5MB 이하여야 합니다.');
        setTimeout(() => setImageError(null), 3000);
        return;
      }
      
      // 파일 형식 검증 - 더 관대하게 (확장자도 체크)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/PNG', 'image/JPEG', 'image/JPG'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png'];
      
      const isTypeValid = allowedTypes.includes(file.type);
      const isExtensionValid = validExtensions.includes(fileExtension);
      
      if (!isTypeValid && !isExtensionValid) {
        setImageError('JPG, JPEG, PNG 파일만 업로드 가능합니다.');
        setTimeout(() => setImageError(null), 3000);
        return;
      }
      
      setImageError(null);
      
      // 크롭을 위한 이미지 소스 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
      };
      reader.onerror = (error) => {
        console.error('파일 읽기 오류:', error);
        setImageError('이미지 파일을 읽는 중 오류가 발생했습니다.');
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 크롭 완료 핸들러
  const handleCropSave = async () => {
    try {
      if (!croppedAreaPixels || !imageSrc) {
        setImageError('이미지를 다시 선택해주세요.');
        setTimeout(() => setImageError(null), 3000);
        return;
      }
      
      setUploadLoading(true);
      setImageError(null);
      
      // 크롭된 이미지 생성
      const croppedBlob = await createCroppedImage(imageSrc, croppedAreaPixels);
      
      // Blob을 File로 변환
      const croppedFile = new File([croppedBlob], 'profile-image.jpg', { type: 'image/jpeg' });
      
      // 먼저 미리보기 이미지를 즉시 적용 (사용자 경험 개선)
      const previewReader = new FileReader();
      previewReader.onloadend = () => {
        setProfileImage(previewReader.result);
        setImageKey(Date.now()); // 이미지 강제 리렌더링
      };
      previewReader.readAsDataURL(croppedBlob);
      
      // 서버에 업로드
      const userCode = sessionStorage.getItem('userCode');
      if (userCode) {
        try {
          const response = await UploadProfileImageApi(userCode, croppedFile);
          
          // 업로드 성공 후 서버 URL로 교체 (CloudFront 캐시 무효화)
          if (response.data && response.data.image_url) {
            // 기본적으로 CloudFront URL 사용
            const directUrl = response.data.image_url;
            
            // 초강력 캐시 버스팅: 다중 파라미터 + 버전 + 강제 새로고침
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substr(2, 9);
            const versionId = Math.floor(Math.random() * 10000);
            const cacheBuster = `v=${versionId}&t=${timestamp}&r=${randomId}&nocache=1&_=${timestamp}`;
            const imageUrlWithCacheBuster = `${directUrl}?${cacheBuster}`;
            
            // 약간의 지연 후 서버 이미지로 교체 (CloudFront 전파 시간 고려)
            setTimeout(() => {
              // 이미지 프리로딩으로 캐시 우회 (CORS 설정 제거)
              const preloadImg = new Image();
              // crossOrigin 설정 제거 - CORS 문제 방지
              
              preloadImg.onload = () => {
                setProfileImage(imageUrlWithCacheBuster);
                setImageKey(Date.now()); // 이미지 강제 리렌더링
              };
              
              preloadImg.onerror = () => {
                // 프리로딩 실패해도 URL은 설정 (S3 직접 URL 사용)
                setProfileImage(imageUrlWithCacheBuster);
                setImageKey(Date.now());
              };
              
              // 이미지 로드 시작
              preloadImg.src = imageUrlWithCacheBuster;
            }, 3000); // 지연 시간을 3초로 증가 (CloudFront 전파 대기)
          }
          
          // 이미지 업로드 완료 플래그 설정
          setImageJustUploaded(true);
          
          // 모달 닫기 및 상태 초기화
          setShowCropModal(false);
          setImageSrc(null);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setCroppedAreaPixels(null);
          
          // 파일 input 초기화
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('프로필 이미지 업로드 실패:', error);
          
          let errorMessage = '프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.';
          if (error.response && error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          }
          
          setImageError(errorMessage);
          setTimeout(() => setImageError(null), 3000);
        } finally {
          setUploadLoading(false);
        }
      }
    } catch (error) {
      console.error('이미지 크롭 실패:', error);
      setImageError('이미지 편집에 실패했습니다. 다시 시도해주세요.');
      setTimeout(() => setImageError(null), 3000);
      setUploadLoading(false);
    }
  };
  
  // 크롭 취소 핸들러
  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    // 파일 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 카메라 버튼 클릭 핸들러
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  // 변경사항 감지
  useEffect(() => {
    const hasChanges = Object.keys(userInfo).some(key => 
      userInfo[key] !== originalData[key]
    );
    setIsModified(hasChanges);
  }, [userInfo, originalData]);

  // 모달 열기 함수들
  const openTextModal = (fieldName, title, currentValue) => {
    setCurrentField(fieldName);
    setModalTitle(title);
    setTextValue(currentValue);
    setTextError('');
    setShowTextModal(true);
  };

  const openOptionModal = (fieldName, title, options) => {
    setCurrentField(fieldName);
    setModalTitle(title);
    setModalOptions(options);
    setShowModal(true);
  };

  // 텍스트 입력 핸들러
  const handleTextChange = (e) => {
    const value = e.target.value;
    
    // 키와 몸무게는 숫자만 입력 가능
    if (currentField === 'height' || currentField === 'weight') {
      if (/^\d*$/.test(value)) {
        setTextValue(value);
        setTextError('');
        
        // 키 범위 검사 (50~250)
        if (currentField === 'height' && value && (parseInt(value) < 50 || parseInt(value) > 250)) {
          setTextError('키는 50~250cm 범위에서 입력해주세요.');
        }
        // 몸무게 범위 검사 (30~300)
        else if (currentField === 'weight' && value && (parseInt(value) < 30 || parseInt(value) > 300)) {
          setTextError('몸무게는 30~300kg 범위에서 입력해주세요.');
        }
      }
    } else {
      // 이름은 일반 텍스트 입력
      setTextValue(value);
      setTextError('');
    }
  };

  // 텍스트 수정 완료
  const handleTextSave = () => {
    // 에러가 있으면 저장하지 않음
    if (textError) {
      return;
    }
    
    setUserInfo(prev => ({
      ...prev,
      [currentField]: textValue
    }));
    setShowTextModal(false);
  };

  // 옵션 선택 완료
  const handleOptionSelect = (value) => {
    setUserInfo(prev => ({
      ...prev,
      [currentField]: value
    }));
    setShowModal(false);
  };

  // 지역 선택 완료
  const handleRegionSelect = () => {
    let areaText;
    if (selectedSido === '전국' || selectedSido === '세종특별자치시') {
      areaText = selectedSido;
    } else if (selectedSigungu === '전체') {
      areaText = selectedSido;
    } else {
      areaText = `${selectedSido} ${selectedSigungu}`;
    }
    
    setUserInfo(prev => ({
      ...prev,
      activityArea: areaText
    }));
    setShowRegionModal(false);
  };

  // 정보 저장
  const handleSave = async () => {
    try {
      setLoading(true);
      setErrorText('');
      
      // 빈 값들을 제거하고 데이터 구성
    const data = {
        user_code: sessionStorage.getItem('userCode')
      };
      
      // 빈 값이 아닌 필드들만 추가
      if (userInfo.name) data.name = userInfo.name;
      if (userInfo.gender) data.gender = userInfo.gender;
      if (userInfo.userType) data.user_type = userInfo.userType;
      if (userInfo.userLevel) data.level = userInfo.userLevel;
      if (userInfo.height) data.height = userInfo.height;
      if (userInfo.weight) data.weight = userInfo.weight;
      if (userInfo.preferredPosition) data.preferred_position = userInfo.preferredPosition;
      if (userInfo.activityArea) data.activity_area = userInfo.activityArea;
      if (userInfo.aiType) data.ai_type = userInfo.aiType;

      const response = await EditUserInfoApi(data);
      
      alert('성공적으로 변경했습니다.');
        navigate(-1);
    } catch (error) {
      console.error('정보 저장 실패:', error);
      setErrorText('정보 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 필드별 표시 텍스트 가져오기
  const getDisplayText = (field, value) => {
    if (!value) return '선택해주세요';
    
    switch (field) {
      case 'gender':
        return fieldOptions.gender.find(opt => opt.value === value)?.label || value;
      case 'userType':
        return fieldOptions.userType.find(opt => opt.value === value)?.label || value;
      case 'userLevel':
        return fieldOptions.userLevel.find(opt => opt.value === value)?.label || value;
      case 'preferredPosition':
        return fieldOptions.preferredPosition.find(opt => opt.value === value)?.label || value;
      case 'aiType':
        return fieldOptions.aiType.find(opt => opt.value === value)?.label || value;
      default:
        return value;
    }
  };

  if (loading) {
    return (
      <div className='info-fix'>
        <LogoBellNav logo={true} />
        
        <div className="info-fix-container">
          <div className="header">
            <div className="header-actions">
              <button className="back-btn" onClick={handleBack} aria-label="뒤로가기">
                <img src={backIcon} alt="뒤로가기" />
              </button>
              <div className="empty-space"></div>
            </div>
            <div className="header-content">
              <h1 className="text-h2">기본 정보 수정</h1>
              <p className="subtitle text-body">개인정보를 수정하고 업데이트하세요</p>
            </div>
          </div>
        </div>
        
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p className='loading-text'>정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='info-fix'>
      <LogoBellNav logo={true} />
      
      <div className="info-fix-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack} aria-label="뒤로가기">
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <div className="empty-space"></div>
          </div>
          <div className="header-content">
            <h1 className="text-h2">기본 정보 수정</h1>
            <p className="subtitle text-body">개인정보를 수정하고 업데이트하세요</p>
          </div>
        </div>
      </div>
      
      
      <div className='content-container'>
        {/* 기본 정보 */}
        <div className='info-card expanded-card'>
          <div className='card-header'>
            <h3 className='card-title'>기본 정보</h3>
          </div>
          
          <div className='form-group'>
            <div 
              className='info-item'
              onClick={() => openTextModal('name', '이름', userInfo.name)}
            >
              <div className='info-content'>
                <span className='info-label'>이름</span>
                <span className='info-value'>{userInfo.name || '이름을 입력해주세요'}</span>
              </div>
              <img src={right} alt="수정" className='edit-arrow' />
            </div>
            
            <div 
              className='info-item'
              onClick={() => openOptionModal('gender', '성별', fieldOptions.gender)}
            >
              <div className='info-content'>
                <span className='info-label'>성별</span>
                <span className='info-value'>{getDisplayText('gender', userInfo.gender)}</span>
              </div>
              <img src={right} alt="선택" className='edit-arrow' />
            </div>
            
            <div 
              className='info-item'
              onClick={() => openOptionModal('userType', '사용자 유형', fieldOptions.userType)}
            >
              <div className='info-content'>
                <span className='info-label'>사용자 유형</span>
                <span className='info-value'>{getDisplayText('userType', userInfo.userType)}</span>
              </div>
              <img src={right} alt="선택" className='edit-arrow' />
            </div>
            
            <div 
              className='info-item'
              onClick={() => openOptionModal('userLevel', '사용자 수준', fieldOptions.userLevel)}
            >
              <div className='info-content'>
                <span className='info-label'>사용자 수준</span>
                <span className='info-value'>{getDisplayText('userLevel', userInfo.userLevel)}</span>
              </div>
              <img src={right} alt="선택" className='edit-arrow' />
            </div>
            
            <div 
              className='info-item'
              onClick={() => openOptionModal('preferredPosition', '선호 포지션', fieldOptions.preferredPosition)}
            >
              <div className='info-content'>
                <span className='info-label'>선호 포지션</span>
                <span className='info-value'>{getDisplayText('preferredPosition', userInfo.preferredPosition)}</span>
              </div>
              <img src={right} alt="선택" className='edit-arrow' />
            </div>
            
            <div 
              className='info-item'
              onClick={() => setShowRegionModal(true)}
            >
              <div className='info-content'>
                <span className='info-label'>활동 지역</span>
                <span className='info-value'>{userInfo.activityArea || '활동 지역을 선택해주세요'}</span>
              </div>
              <img src={right} alt="선택" className='edit-arrow' />
            </div>

            <div 
              className='info-item'
              onClick={() => openOptionModal('aiType', 'AI 성격', fieldOptions.aiType)}
            >
              <div className='info-content'>
                <span className='info-label'>AI 성격</span>
                <span className='info-value'>{getDisplayText('aiType', userInfo.aiType)}</span>
              </div>
              <img src={right} alt="선택" className='edit-arrow' />
            </div>
          </div>
        </div>

        {/* 체격 정보 */}
        <div className='info-card expanded-card'>
          <div className='card-header'>
            <h3 className='card-title'>체격 정보</h3>
          </div>
          
          <div className='form-group'>
            <div className='input-row'>
              <div 
                className='info-item'
                onClick={() => openTextModal('height', '키 (cm)', userInfo.height)}
              >
                <div className='info-content'>
                  <span className='info-label'>키</span>
                  <span className='info-value'>{userInfo.height ? `${userInfo.height}cm` : '키를 입력해주세요'}</span>
                </div>
                <img src={right} alt="수정" className='edit-arrow' />
              </div>
              
              <div 
                className='info-item'
                onClick={() => openTextModal('weight', '몸무게 (kg)', userInfo.weight)}
              >
                <div className='info-content'>
                  <span className='info-label'>몸무게</span>
                  <span className='info-value'>{userInfo.weight ? `${userInfo.weight}kg` : '몸무게를 입력해주세요'}</span>
                </div>
                <img src={right} alt="수정" className='edit-arrow' />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='submit-section'>
        {isModified ? (
          <CircleBtn 
            title='변경사항 저장' 
            onClick={handleSave}
            className='submit-button'
          />
        ) : (
          <CircleBtn 
            title='변경사항 없음' 
            backgroundColor='var(--text-disabled)' 
            color='white' 
            className='submit-button disabled'
          />
        )}
      </div>
      
      {/* 텍스트 입력 모달 */}
      <TextModal
        isOpen={showTextModal}
        title={modalTitle}
        value={textValue}
        placeholder={`${modalTitle}을 입력해주세요`}
        error={textError}
        onChange={handleTextChange}
        onSave={handleTextSave}
        onClose={() => setShowTextModal(false)}
      />

      {/* 옵션 선택 모달 */}
      <OptionModal
        isOpen={showModal}
        title={modalTitle}
        options={modalOptions}
        selectedValue={userInfo[currentField]}
        onSelect={handleOptionSelect}
        onClose={() => setShowModal(false)}
        checkIconSrc={checkGreenIcon}
      />

      {/* 지역 선택 모달 */}
      <RegionModal
        isOpen={showRegionModal}
        title="활동지역 선택"
        sidoList={sidoList}
        sigunguMap={sigunguMap}
        selectedSido={selectedSido}
        selectedSigungu={selectedSigungu}
        onSelectSido={(sido) => {
          setSelectedSido(sido);
          setSelectedSigungu('');
          if (sido === '전국' || sido === '세종특별자치시') {
            setUserInfo(prev => ({ ...prev, activityArea: sido }));
            setShowRegionModal(false);
          }
        }}
        onSelectSigungu={(sigungu) => {
          setSelectedSigungu(sigungu);
          if (sigungu === '전체') {
            const areaText = selectedSido === '전국' ? '전국' : selectedSido;
            setUserInfo(prev => ({ ...prev, activityArea: areaText }));
            setShowRegionModal(false);
          }
        }}
        onReset={() => { setSelectedSido(''); setSelectedSigungu(''); }}
        onConfirm={handleRegionSelect}
        disabledConfirm={!(selectedSido && (selectedSigungu || selectedSido === '전국' || selectedSido === '세종특별자치시'))}
        onClose={() => setShowRegionModal(false)}
      />
      
      {/* 이미지 크롭 모달 */}
      <CropModal
        isOpen={showCropModal && !!imageSrc}
        title="프로필 이미지 편집"
        imageSrc={imageSrc}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onClose={handleCropCancel}
        onConfirm={handleCropSave}
        loading={uploadLoading}
      />
      
      <Input_error_tooltip text={errorText} className='error-tooltip'/>
    </div>
  );
};

export default InfoFix;
