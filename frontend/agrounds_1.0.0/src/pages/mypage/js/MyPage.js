import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import '../css/MyPage.scss';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import BackTitle_Btn from '../../../components/BackTitle_Btn';
import Image_Comp from '../../../components/Image_Comp';
import logo from '../../../assets/common/user-grey.png';
import defaultProfile from '../../../assets/common/default_profile.png';
import BasicInfo from '../../../components/BasicInfo';
import MyChapter from '../../../components/MyChapter';
import camera from '../../../assets/common/camera.png';
import closeIcon from '../../../assets/main_icons/close_black.png';
import { GetUserInfoApi, GetProfileImageApi, UploadProfileImageApi } from '../../../function/api/user/userApi';

// 프로필 이미지 캐시 유틸리티
const CACHE_KEY_PREFIX = 'profile_image_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간

const getCachedImage = (userCode) => {
  try {
    console.log('🔍 [캐시] 캐시 확인 시작:', `${CACHE_KEY_PREFIX}${userCode}`);
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${userCode}`);
    
    if (!cached) {
      console.log('❌ [캐시] 캐시 없음');
      return null;
    }
    
    const { url, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    const ageInMinutes = Math.floor(age / 60000);
    
    console.log('📦 [캐시] 캐시 발견:', {
      url: url.substring(0, 100) + '...',
      age: `${ageInMinutes}분 전`,
      timestamp: new Date(timestamp).toLocaleString()
    });
    
    const isExpired = age > CACHE_DURATION;
    
    if (isExpired) {
      console.log('⏰ [캐시] 캐시 만료됨, 삭제');
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${userCode}`);
      return null;
    }
    
    console.log('✅ [캐시] 유효한 캐시 반환');
    return url;
  } catch (error) {
    console.error('❌ [캐시] 캐시 읽기 실패:', error);
    return null;
  }
};

const setCachedImage = (userCode, url) => {
  try {
    // 쿼리 파라미터 제거 (기본 URL만 저장)
    const baseUrl = url.split('?')[0];
    
    const cacheData = {
      url: baseUrl,  // 쿼리 파라미터 없는 기본 URL만 저장
      timestamp: Date.now()
    };
    localStorage.setItem(`${CACHE_KEY_PREFIX}${userCode}`, JSON.stringify(cacheData));
    console.log('💾 [캐시] 캐시 저장 완료:', {
      key: `${CACHE_KEY_PREFIX}${userCode}`,
      originalUrl: url.substring(0, 100) + '...',
      savedUrl: baseUrl,
      timestamp: new Date(cacheData.timestamp).toLocaleString(),
      isBlob: url.startsWith('data:'),
      isCloudFront: url.includes('cloudfront')
    });
  } catch (error) {
    console.error('❌ [캐시] 캐시 저장 실패:', error);
  }
};

const clearCachedImage = (userCode) => {
  try {
    localStorage.removeItem(`${CACHE_KEY_PREFIX}${userCode}`);
    console.log('캐시 삭제 완료');
  } catch (error) {
    console.error('캐시 삭제 실패:', error);
  }
};

const Main = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(logo);
  const fileInputRef = useRef(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    birth: '',
    gender: '',
    height: '',
    weight: '',
    preferred_position: '',
    activity_area: '',
    ai_type: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageJustUploaded, setImageJustUploaded] = useState(false); // 이미지 업로드 직후 플래그
  const [imageKey, setImageKey] = useState(Date.now()); // 이미지 강제 리렌더링용 키
  
  // 이미지 크롭 관련 상태
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // 사용자 정보 및 프로필 이미지 가져오기
  useEffect(() => {
    console.log('🚀 [useEffect] 시작 - imageJustUploaded:', imageJustUploaded);
    const fetchUserInfo = async () => {
      try {
        const userCode = sessionStorage.getItem('userCode');
        console.log('👤 [useEffect] userCode:', userCode);
        if (userCode) {
          // 사용자 정보 가져오기
          const response = await GetUserInfoApi(userCode);
          console.log('📋 [API] 사용자 정보 응답:', response.data);
          setUserInfo({
            name: response.data.name || '',
            birth: response.data.birth || '',
            gender: response.data.gender || '',
            height: response.data.height || '',
            weight: response.data.weight || '',
            preferred_position: response.data.preferred_position || '',
            activity_area: response.data.activity_area || '',
            ai_type: response.data.ai_type || ''
          });

          // 프로필 이미지 가져오기 (업로드 직후가 아닌 경우만)
          if (!imageJustUploaded) {
            // 서버에서 최신 이미지 가져오기 (캐시 사용 안 함 - 타임스탬프 파일명 사용)
            try {
              console.log('🌐 [API] GetProfileImageApi 호출 중...');
              const imageResponse = await GetProfileImageApi(userCode);
              console.log('📡 [API] 프로필 이미지 응답:', imageResponse.data);
              
              if (imageResponse.data.exists && imageResponse.data.image_url) {
                console.log('✅ [API] S3 최신 이미지 존재:', imageResponse.data.image_url);
                
                // 타임스탬프가 포함된 URL이므로 그대로 사용 (캐시 버스터 불필요)
                setProfileImage(imageResponse.data.image_url);
                setImageKey(Date.now());
                console.log('🖼️ [상태] profileImage 상태 업데이트 완료 (타임스탬프 URL)');
                
                // 캐시 저장 (타임스탬프 포함된 전체 URL)
                setCachedImage(userCode, imageResponse.data.image_url);
              } else {
                console.log('⚠️ [API] 서버에 이미지 없음, 기본 이미지 사용');
                setProfileImage(defaultProfile);
              }
            } catch (imageError) {
              console.error('❌ [API] 프로필 이미지 가져오기 실패:', imageError);
              setProfileImage(defaultProfile);
            }
          } else {
            console.log('이미지 업로드 직후이므로 서버에서 다시 가져오지 않음');
          }
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        // API 실패 시 sessionStorage에서 기본 정보 가져오기
        setUserInfo({
          name: sessionStorage.getItem('userName') || '',
          birth: sessionStorage.getItem('userBirth') || '',
          gender: sessionStorage.getItem('userGender') || '',
          height: sessionStorage.getItem('userHeight') || '',
          weight: sessionStorage.getItem('userWeight') || '',
          preferred_position: sessionStorage.getItem('userPosition') || '',
          activity_area: '',
          ai_type: ''
        });
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
      console.log('파일 선택됨:', file.name, '타입:', file.type, '크기:', file.size);
      
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setError('파일 크기는 5MB 이하여야 합니다.');
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      // 파일 형식 검증 - 더 관대하게 (확장자도 체크)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/PNG', 'image/JPEG', 'image/JPG'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png'];
      
      const isTypeValid = allowedTypes.includes(file.type);
      const isExtensionValid = validExtensions.includes(fileExtension);
      
      console.log('파일 타입 검증:', { type: file.type, extension: fileExtension, isTypeValid, isExtensionValid });
      
      if (!isTypeValid && !isExtensionValid) {
        console.log('파일 타입 검증 실패');
        setError('JPG, JPEG, PNG 파일만 업로드 가능합니다.');
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      setError(null);
      
      console.log('파일 검증 통과, 이미지 로드 시작');
      
      // 크롭을 위한 이미지 소스 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('이미지 로드 완료, 모달 열기');
        setImageSrc(reader.result);
        setShowCropModal(true);
        console.log('showCropModal:', true, 'imageSrc 존재:', !!reader.result);
      };
      reader.onerror = (error) => {
        console.error('파일 읽기 오류:', error);
        setError('이미지 파일을 읽는 중 오류가 발생했습니다.');
      };
      reader.readAsDataURL(file);
    }
  };

  // 크롭 완료 핸들러
  const handleCropSave = async () => {
    try {
      if (!croppedAreaPixels || !imageSrc) {
        console.error('크롭 정보가 없습니다:', { croppedAreaPixels: !!croppedAreaPixels, imageSrc: !!imageSrc });
        setError('이미지를 다시 선택해주세요.');
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      console.log('크롭 저장 시작');
      setUploadLoading(true);
      setError(null);
      
      // 크롭된 이미지 생성
      const croppedBlob = await createCroppedImage(imageSrc, croppedAreaPixels);
      console.log('크롭된 이미지 생성 완료');
      
      // Blob을 File로 변환
      const croppedFile = new File([croppedBlob], 'profile-image.jpg', { type: 'image/jpeg' });
      
      // 먼저 미리보기 이미지를 즉시 적용 (사용자 경험 개선)
      const previewReader = new FileReader();
      previewReader.onloadend = () => {
        console.log('🎨 [업로드] 미리보기 이미지 즉시 적용');
        const previewUrl = previewReader.result;
        setProfileImage(previewUrl);
        setImageKey(Date.now()); // 이미지 강제 리렌더링
        console.log('🖼️ [상태] profileImage 상태 업데이트 완료 (미리보기 blob)');
        
        // 미리보기 이미지를 임시 캐시에 저장
        const userCode = sessionStorage.getItem('userCode');
        if (userCode) {
          console.log('💾 [업로드] 미리보기 이미지 캐시에 임시 저장 시작');
          setCachedImage(userCode, previewUrl);
        }
      };
      previewReader.readAsDataURL(croppedBlob);
      
      // 서버에 업로드
      const userCode = sessionStorage.getItem('userCode');
      if (!userCode) {
        console.error('userCode가 없습니다');
        setError('로그인이 필요합니다.');
        setUploadLoading(false);
        return;
      }
      
      try {
        console.log('서버에 이미지 업로드 시작');
        const response = await UploadProfileImageApi(userCode, croppedFile);
        console.log('프로필 이미지 업로드 성공:', response.data);
        
        // 업로드 성공 후 서버 URL로 즉시 교체 (타임스탬프 파일명으로 캐시 문제 해결됨)
        if (response.data && response.data.image_url) {
          console.log('✅ [업로드] 서버 이미지 URL 수신:', response.data.image_url);
          console.log('📦 [업로드] 타임스탬프:', response.data.timestamp);
          
          // 타임스탬프가 포함된 새 파일명이므로 즉시 표시 가능 (캐시 문제 없음)
          setProfileImage(response.data.image_url);
          setImageKey(Date.now());
          
          // 캐시에 저장
          setCachedImage(userCode, response.data.image_url);
          console.log('🖼️ [상태] profileImage 상태 업데이트 완료 (타임스탬프 파일명)');
          console.log('✅ [완료] 이미지 업로드 및 표시 완료!');
        }
        
        // 이미지 업로드 완료 플래그 설정 (useEffect에서 다시 가져오지 않도록)
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
        
        // 서버에서 반환된 에러 메시지가 있으면 사용, 없으면 기본 메시지
        let errorMessage = '프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.';
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        
        setError(errorMessage);
        // 업로드 실패 시에도 미리보기는 유지 (사용자가 다시 시도할 수 있도록)
        
        // 3초 후 에러 메시지 자동 제거
        setTimeout(() => setError(null), 3000);
      } finally {
        setUploadLoading(false);
      }
    } catch (error) {
      console.error('이미지 크롭 실패:', error);
      setError('이미지 편집에 실패했습니다. 다시 시도해주세요.');
      setTimeout(() => setError(null), 3000);
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

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div className='mypage'>
        <LogoBellNav />
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p className='text-body loading-text'>사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mypage'>
      <LogoBellNav logo={true} />
      
      {/* 에러 메시지 */}
      {error && (
        <div className='error-banner' role='alert' aria-live='polite'>
          <p className='text-body error-text'>{error}</p>
        </div>
      )}
      
      {/* 프로필 헤더 섹션 - 통합된 프로필 영역 */}
      <section className='profile-header' aria-label='프로필 정보'>
        <div className='profile-card'>
          <div className='profile-title-box'>
            <h2 className='profile-title'>프로필</h2>
          </div>
          
          <div className='profile-image-container'>
            <div className='image-compbox'>
              <img 
                src={profileImage} 
                alt={`${userInfo.name || '사용자'}의 프로필 이미지`}
                className='profile-image'
                loading='lazy'
                key={`profile-${imageKey}`} // 이미지 강제 리렌더링
                style={{
                  // 캐시 무효화를 위한 CSS 속성
                  imageRendering: 'auto',
                  objectFit: 'cover'
                }}
                onLoad={(e) => {
                  console.log('이미지 로드 완료:', profileImage);
                  // 이미지 로드 완료 후 추가 캐시 무효화
                  e.target.style.transform = `scale(1.0001) rotate(0.001deg)`;
                  setTimeout(() => {
                    e.target.style.transform = 'none';
                  }, 100);
                }}
                onError={(e) => {
                  console.error('이미지 로드 실패:', e.target.src);
                  
                  // 더 관대한 재시도 로직
                  if (!e.target.src.includes('retry=1')) {
                    // 첫 번째 재시도: 간단한 캐시 버스터
                    const retryUrl = `${profileImage.split('?')[0]}?retry=1&t=${Date.now()}`;
                    console.log('첫 번째 재시도:', retryUrl);
                    setTimeout(() => {
                      e.target.src = retryUrl;
                    }, 1000);
                  } else if (!e.target.src.includes('retry=2')) {
                    // 두 번째 재시도: 더 강력한 캐시 버스터
                    const retryUrl = `${profileImage.split('?')[0]}?retry=2&v=${Date.now()}&r=${Math.random().toString(36).substr(2, 9)}`;
                    console.log('두 번째 재시도:', retryUrl);
                    setTimeout(() => {
                      e.target.src = retryUrl;
                    }, 2000);
                  } else {
                    // 최종 실패 시 기본 이미지
                    console.log('모든 재시도 실패, 기본 이미지 사용');
                    e.target.src = defaultProfile;
                  }
                }}
              />
              {uploadLoading && (
                <div className='upload-overlay'>
                  <div className='upload-spinner'></div>
                </div>
              )}
              <button 
                className='camera-bg' 
                onClick={handleCameraClick}
                aria-label='프로필 이미지 변경'
                disabled={uploadLoading}
              >
                <img 
                  src={camera} 
                  className='camera'
                  alt=''
                  aria-hidden='true'
                />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/jpg,image/png"
              style={{ display: 'none' }}
              aria-label='프로필 이미지 파일 선택'
            />
          </div>
          
          <div className='profile-info'>
            <h1 className='text-h1 user-name'>
              {userInfo.name || sessionStorage.getItem('userName') || '사용자'}
            </h1>
            <div className='user-meta'>
              <span className='meta-item text-body'>
                {userInfo.preferred_position || '포지션 미등록'}
              </span>
              <span className='meta-divider'>·</span>
              <span className='meta-item text-body'>
                {userInfo.activity_area || '활동지역 미등록'}
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* 기본 정보 카드 */}
      <div className="content-section">
        <BasicInfo userInfo={userInfo} />
      </div>
      
      {/* 설정 메뉴들 - 카드 형태로 그룹화 */}
      <div className="menu-sections">
        <nav aria-label='설정 메뉴'>
          {/* <MyChapter chapter="알림"/> */}
          <MyChapter chapter="일반"/>
          <MyChapter chapter="약관"/>
          <MyChapter chapter="계정"/>
        </nav>
      </div>
      
      {/* 이미지 크롭 모달 */}
      {showCropModal && imageSrc && (
        <div className="modal-overlay" onClick={handleCropCancel}>
          <div className="modal-content crop-modal" onClick={(e) => e.stopPropagation()}>
            {/* 헤더 */}
            <div className="modal-header">
              <h3 className="text-h3">프로필 이미지 편집</h3>
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
                disabled={uploadLoading}
              >
                {uploadLoading ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Main;
