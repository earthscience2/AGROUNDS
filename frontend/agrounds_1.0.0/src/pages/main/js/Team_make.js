import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/Team_make.scss';
// 팀 관련 API 함수들 import
import { UploadTeamLogoApi, CreateTeamApi } from '../../../function/api/user/userApi';
// 승인된 아이콘 디렉토리 사용
import defaultTeamLogo from '../../../assets/main_icons/team_gray.png';
import cameraIcon from '../../../assets/main_icons/camera_white.png';
import backIcon from '../../../assets/main_icons/back_black.png';
import downIcon from '../../../assets/main_icons/down_gray.png';
import closeIcon from '../../../assets/main_icons/close_black.png';

const Team_make = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    teamName: '',
    location: '',
    description: ''
  });
  
  // 지역 선택 모달 상태
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigungu, setSelectedSigungu] = useState('');
  
  // 로고 관련 상태
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  
  // 이미지 크롭 관련 상태
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 테스트 계정 제한 모달 상태
  const [showTestAccountModal, setShowTestAccountModal] = useState(false);

  // 모달 열림/닫힘 시 배경 스크롤 제어
  useEffect(() => {
    if (showTestAccountModal) {
      // 모달 열릴 때 배경 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      // 모달 닫힐 때 배경 스크롤 복구
      document.body.style.overflow = 'auto';
    }
    
    // 컴포넌트 언마운트 시 스크롤 복구
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showTestAccountModal]);
  
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
  
  // 입력 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 입력 시 해당 필드 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  // 크롭 완료 콜백
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
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
  
  // 이미지 로드 헬퍼 함수
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });
  
  // 로고 이미지 선택 핸들러
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 형식 체크
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          logo: 'JPG, JPEG, PNG 파일만 업로드 가능합니다.'
        }));
        return;
      }
      
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          logo: '파일 크기는 5MB 이하여야 합니다.'
        }));
        return;
      }
      
      // 크롭을 위한 이미지 소스 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
      
      // 로고 에러 메시지 제거
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
      
      // Blob을 File로 변환
      const croppedFile = new File([croppedBlob], 'team-logo.jpg', { type: 'image/jpeg' });
      setLogoFile(croppedFile);
      
      // 프리뷰 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(croppedBlob);
      
      // 모달 닫기 및 상태 초기화
      setShowCropModal(false);
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error('이미지 크롭 실패:', error);
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
    } else if (formData.teamName.length > 50) {
      newErrors.teamName = '팀 이름은 50자 이내로 입력해주세요.';
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
  
  // 팀 생성 제출 핸들러
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const userCode = sessionStorage.getItem('userCode');
      if (!userCode) {
        alert('로그인이 필요합니다.');
        navigate('/app/login');
        return;
      }
      
      // test_player 계정 제한
      if (userCode === 'test_player') {
        setLoading(false);
        setShowTestAccountModal(true);
        return;
      }
      
      const teamResponse = await CreateTeamApi({
        teamName: formData.teamName,
        location: formData.location,
        description: formData.description
      });
      
      const { team_code } = teamResponse.data;
      
      if (logoFile && team_code) {
        try {
          await UploadTeamLogoApi(team_code, logoFile);
        } catch (logoError) {
          // 로고 업로드 실패해도 팀 생성은 성공으로 처리
          alert('팀은 생성되었으나, 로고 업로드에 실패했습니다. 나중에 다시 시도해주세요.');
        }
      }
      
      alert(`${formData.teamName} 팀이 성공적으로 생성되었습니다!`);
      navigate('/app/main');
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert('팀 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="team-make">
      <LogoBellNav logo={true} />
      
      <div className="team-make-container">
        {/* 헤더 */}
        <div className="header">
          <div className="header-actions">
            <button 
              className="back-btn" 
              onClick={() => navigate('/app/jointeam')}
              aria-label="팀 가입하기로 돌아가기"
            >
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <div className="empty-space"></div>
          </div>
          <div className="header-content">
            <h1 className="text-h2">팀 만들기</h1>
            <p className="subtitle text-body">새로운 팀을 만들고 팀원들과 함께하세요.</p>
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
                <img src={defaultTeamLogo} alt="기본 팀 로고" className="default-logo" />
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
              maxLength={50}
            />
            <span className="char-count text-caption">
              {formData.teamName.length}/50
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
        
        {/* 버튼 섹션 */}
        <div className="button-section">
          <button 
            className="cancel-btn text-body"
            onClick={() => navigate('/app/jointeam')}
            disabled={loading}
          >
            취소
          </button>
          <button 
            className="submit-btn text-body"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '생성 중...' : '팀 만들기'}
          </button>
        </div>
      </div>
      
      {/* 지역 선택 모달 */}
      {showRegionModal && (
        <div className="modal-overlay" onClick={() => setShowRegionModal(false)}>
          <div className="modal-content region-modal" onClick={(e) => e.stopPropagation()}>
            {/* 헤더 */}
            <div className="modal-header">
              <h3 className="text-h3">활동지역 선택</h3>
              <button 
                className="close-btn"
                onClick={() => setShowRegionModal(false)}
                aria-label="모달 닫기"
              >
                <img src={closeIcon} alt="닫기" />
              </button>
            </div>
            
            {/* 지역 선택 영역 */}
            <div className="modal-body">
              <div className="region-selection">
                {/* 시/도 선택 */}
                <div className="sido-section">
                  <h4 className="text-h4">시/도</h4>
                  <div className="option-list">
                    {sidoList.map(sido => (
                      <div
                        key={sido}
                        className={`option-item ${selectedSido === sido ? 'selected' : ''}`}
                        onClick={() => { 
                          setSelectedSido(sido); 
                          setSelectedSigungu(''); 
                          // 전국, 세종특별자치시는 시군구가 없으므로 바로 선택 완료
                          if(sido === '전국' || sido === '세종특별자치시') {
                            handleInputChange('location', sido);
                            setShowRegionModal(false);
                          }
                        }}
                      >
                        {sido}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 시/군/구 선택 */}
                {selectedSido && selectedSido !== '전국' && selectedSido !== '세종특별자치시' && (
                  <div className="sigungu-section">
                    <h4 className="text-h4">시/군/구</h4>
                    <div className="option-list">
                      {(sigunguMap[selectedSido] || []).map(sigungu => (
                        <div
                          key={sigungu}
                          className={`option-item ${selectedSigungu === sigungu ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedSigungu(sigungu);
                            // "전체" 선택 시 바로 선택 완료
                            if(sigungu === '전체') {
                              const areaText = selectedSido === '전국' ? '전국' : selectedSido;
                              handleInputChange('location', areaText);
                              setShowRegionModal(false);
                            }
                          }}
                        >
                          {sigungu}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 확인 버튼 */}
            {selectedSido && selectedSigungu && selectedSigungu !== '전체' && (
              <div className="modal-footer">
                <button
                  className="confirm-btn text-body"
                  onClick={() => {
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
                >
                  선택 완료
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 이미지 크롭 모달 */}
      {showCropModal && (
        <div className="modal-overlay" onClick={handleCropCancel}>
          <div className="modal-content crop-modal" onClick={(e) => e.stopPropagation()}>
            {/* 헤더 */}
            <div className="modal-header">
              <h3 className="text-h3">로고 이미지 편집</h3>
              <button 
                className="close-btn"
                onClick={handleCropCancel}
                aria-label="모달 닫기"
              >
                <img src={closeIcon} alt="닫기" />
              </button>
            </div>
            
            {/* 크롭 영역 */}
            <div className="crop-container">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            
            {/* 줌 컨트롤 */}
            <div className="crop-controls">
              <label className="text-body-sm">확대/축소</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="zoom-slider"
              />
            </div>
            
            {/* 버튼 */}
            <div className="modal-footer">
              <button
                className="cancel-btn text-body"
                onClick={handleCropCancel}
              >
                취소
              </button>
              <button
                className="confirm-btn text-body"
                onClick={handleCropSave}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 테스트 계정 제한 모달 */}
      {showTestAccountModal && (
        <div className="modal-overlay">
          <div className="modal-content test-account-modal">
            <div className="modal-header">
              <h3 className="modal-title">기능 제한</h3>
              <button className="modal-close" onClick={() => setShowTestAccountModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <p>개인 테스트 계정은 사용할 수 없는 기능입니다.</p>
            </div>
            
            <div className="modal-footer">
              <button className="confirm-btn" onClick={() => setShowTestAccountModal(false)}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team_make;
