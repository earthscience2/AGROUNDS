import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/player_ground_selection_2.scss';
import DSModal from '../../../components/Modal/DSModal';

// API
import { GetGroundListApi, GetKakaoMapKeyApi } from '../../../function/api/ground/groundApi';
import { GetS3RawFileContentApi } from '../../../function/api/upload/uploadApi';
import client from '../../../client';

const filterGroundsByOwner = (grounds, currentUserCode) => {
  if (!Array.isArray(grounds)) {
    return [];
  }

  return grounds.filter((ground) => {
    const maker =
      (ground && ground.who_make) ||
      (ground && ground.ground_info && ground.ground_info.who_make) ||
      null;

    if (!maker) {
      return false;
    }

    if (maker === 'Official') {
      return true;
    }

    if (currentUserCode && maker === currentUserCode) {
      return true;
    }

    return false;
  });
};

const PlayerGroundSelection2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 이전 페이지에서 전달받은 선택된 파일 정보
  const selectedFile = location.state?.selectedFile;
  
  const [loading, setLoading] = useState(true);
  const [foundGround, setFoundGround] = useState(null);
  const [nearbyGrounds, setNearbyGrounds] = useState([]); // 가까운 10개 경기장 목록
  const [searchError, setSearchError] = useState(null);
  const [kakaoMapLoaded, setKakaoMapLoaded] = useState(false);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' 또는 'satellite'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [userCode, setUserCode] = useState(undefined);
  // 검색 페이지네이션
  const [searchPage, setSearchPage] = useState(0);
  const pageSize = 5;

  // 뒤로가기 함수
  const handleBack = () => {
    navigate('/app/anal/data-select');
  };

  // GPS 좌표를 UTM 좌표로 변환하는 함수 (한국 UTM Zone 52N)
  const gpsToUtm = (lat, lng, zone = 52) => {
    
    // WGS84 타원체 상수
    const a = 6378137; // 장축
    const f = 1 / 298.257223563; // 편평율
    const k0 = 0.9996; // UTM 척도 계수
    const e = Math.sqrt(2 * f - f * f);
    const e1sq = e * e / (1 - e * e);
    
    // 도를 라디안으로 변환
    const latRad = lat * Math.PI / 180;
    const lngRad = lng * Math.PI / 180;
    
    // UTM Zone 52N의 중앙 경선 (129도)
    const centralMeridian = (zone - 1) * 6 - 180 + 3;
    const centralMeridianRad = centralMeridian * Math.PI / 180;
    
    // 경도 차이
    const deltaLng = lngRad - centralMeridianRad;
    
    // 보조 계산
    const N = a / Math.sqrt(1 - e * e * Math.sin(latRad) * Math.sin(latRad));
    const T = Math.tan(latRad) * Math.tan(latRad);
    const C = e1sq * Math.cos(latRad) * Math.cos(latRad);
    const A = Math.cos(latRad) * deltaLng;
    
    // 자오선 호장
    const M = a * ((1 - e * e / 4 - 3 * e * e * e * e / 64 - 5 * Math.pow(e, 6) / 256) * latRad
                - (3 * e * e / 8 + 3 * e * e * e * e / 32 + 45 * Math.pow(e, 6) / 1024) * Math.sin(2 * latRad)
                + (15 * e * e * e * e / 256 + 45 * Math.pow(e, 6) / 1024) * Math.sin(4 * latRad)
                - (35 * Math.pow(e, 6) / 3072) * Math.sin(6 * latRad));
    
    // UTM 좌표 계산
    const easting = 500000 + k0 * N * (A + (1 - T + C) * Math.pow(A, 3) / 6
                    + (5 - 18 * T + T * T + 72 * C - 58 * e1sq) * Math.pow(A, 5) / 120);
    
    const northing = k0 * (M + N * Math.tan(latRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 24
                     + (61 - 58 * T + T * T + 600 * C - 330 * e1sq) * Math.pow(A, 6) / 720));
    
    return { easting, northing };
  };

  // 지도 타입 변경 함수
  const handleMapTypeChange = (type) => {
    setMapType(type);
    
    // 지도가 로드된 상태에서만 타입 변경
    if (window.kakao && window.kakao.maps && window.kakao.maps.MapTypeId) {
      const mapContainer = document.getElementById('kakao-map');
      if (mapContainer && mapContainer._kakaoMap) {
        const map = mapContainer._kakaoMap;
        const mapTypeId = type === 'satellite' ? 
          window.kakao.maps.MapTypeId.HYBRID : 
          window.kakao.maps.MapTypeId.ROADMAP;
        map.setMapTypeId(mapTypeId);
      }
    }
  };

  // 카카오맵 동적 로드 함수
  const loadKakaoMap = async () => {
    try {
      // 이미 로드된 경우 재사용
      if (window.kakao && window.kakao.maps) {
        setKakaoMapLoaded(true);
        return;
      }
      
      let apiKey = '664cc150367cf3800a5a3c0bb7f300a8'; // 기본 키
      
      try {
        // API에서 카카오맵 키 가져오기 시도
        const response = await GetKakaoMapKeyApi();
        
        if (response?.data?.success && response.data?.kakao_map_key) {
          apiKey = response.data.kakao_map_key;
        }
      } catch (error) {
        // 기본 키 사용
      }
      
      // 기존 카카오맵 스크립트가 있는지 확인하고 제거
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) {
        existingScript.remove();
        if (window.kakao) {
          delete window.kakao;
        }
      }

      // 카카오맵 스크립트 동적 로드
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        // HTTPS를 명시적으로 사용
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
        script.async = true;
        script.defer = true;
        
        // 타임아웃 설정 (10초)
        const timeout = setTimeout(() => {
          script.remove();
          reject(new Error('카카오맵 스크립트 로드 타임아웃'));
        }, 10000);
        
        script.onload = () => {
          clearTimeout(timeout);
          
          // 카카오맵 객체가 제대로 로드되었는지 확인
          if (!window.kakao || !window.kakao.maps) {
            reject(new Error('카카오맵 객체 로드 실패'));
            return;
          }
          
          // 카카오맵 서비스 초기화
          window.kakao.maps.load(() => {
            setKakaoMapLoaded(true);
            resolve();
          });
        };
        
        script.onerror = (error) => {
          clearTimeout(timeout);
          script.remove();
          reject(new Error('카카오맵 스크립트 로드 실패'));
        };
        
        document.head.appendChild(script);
      });
    } catch (error) {
      throw error;
    }
  };

  // 평균 좌표 계산 (전처리된 CSV 데이터)
  const calculateAverageCoordinates = (fileData) => {
    const coordinates = [];
    const lines = fileData.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const parts = line.trim().split(',');
      
      // 헤더 줄 건너뛰기
      if (i === 0 && parts[0] === 'device_id') {
        continue;
      }
      
      if (parts.length >= 4) {
        const lat = parseFloat(parts[2]);
        const lon = parseFloat(parts[3]);
        
        if (!isNaN(lat) && !isNaN(lon)) {
          coordinates.push({ lat, lon });
        }
      }
    }
    
    if (coordinates.length === 0) {
      throw new Error('유효한 좌표가 없습니다.');
    }
    
    const avgLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
    const avgLon = coordinates.reduce((sum, coord) => sum + coord.lon, 0) / coordinates.length;
    
    return { lat: avgLat, lon: avgLon };
  };

  // 가장 가까운 경기장 찾기 (10개 목록 포함)
  const findNearestGround = async (fileData, currentUserCode) => {
    try {
      // 평균 좌표 계산
      const averageLocation = calculateAverageCoordinates(fileData);
      
      // GPS 좌표를 UTM 좌표로 변환
      const averageLocationUTM = gpsToUtm(averageLocation.lat, averageLocation.lon);
      
      // 모든 경기장 목록 가져오기
      const response = await GetGroundListApi({ page: 1, page_size: 1000 });
      
      if (!response?.data?.success) {
        throw new Error('경기장 데이터를 가져올 수 없습니다.');
      }
      
      const allGrounds = response.data.data.grounds;
      const availableGrounds = filterGroundsByOwner(allGrounds, currentUserCode);

      const groundsWithDistance = []; // 모든 경기장과 거리 저장
      
      // 각 경기장과의 거리 계산
      for (const ground of availableGrounds) {
        if (ground.center && ground.center.length >= 2) {
          // 경기장 center는 이미 UTM 좌표 [easting, northing]
          const groundLocationUTM = {
            easting: ground.center[0],
            northing: ground.center[1]
          };
          
          // UTM 좌표로 유클리드 거리 계산
          const distance = Math.sqrt(
            Math.pow(averageLocationUTM.easting - groundLocationUTM.easting, 2) +
            Math.pow(averageLocationUTM.northing - groundLocationUTM.northing, 2)
          );
          
          groundsWithDistance.push({
            ...ground,
            distance: distance,
            distanceText: distance < 1000 ? `${Math.round(distance)}m` : `${(distance/1000).toFixed(1)}km`
          });
        }
      }
      
      // 거리순으로 정렬
      groundsWithDistance.sort((a, b) => a.distance - b.distance);
      
      // 가장 가까운 5개 경기장 선택
      const top10Grounds = groundsWithDistance.slice(0, 5);
      
      // 가장 가까운 경기장 (첫 번째)
      const closestGround = groundsWithDistance[0] || null;
      
      // 결과 반환
      return {
        closestGround,
        nearbyGrounds: top10Grounds,
        userCenter: averageLocation,
        userCenterUTM: averageLocationUTM
      };
    } catch (error) {
      throw error;
    }
  };

  // 자동으로 경기장 찾기
  const handleAutoFind = async (currentUserCode) => {
    if (!selectedFile) {
      setSearchError('선택된 파일이 없습니다.');
      return;
    }

    try {
      setLoading(true);
      setSearchError(null);
      
      // Upload 모델 사용: upload_code로 파일 다운로드
      const uploadCode = selectedFile.upload_code || selectedFile.rawData?.upload_code;
      if (!uploadCode) {
        throw new Error('업로드 코드를 찾을 수 없습니다.');
      }
      
      // CORS 문제 해결을 위해 백엔드 프록시 API 사용
      // 1단계: 다운로드 URL 가져오기
      const urlResponse = await client.get('/api/user/file-download/', {
        params: { upload_code: uploadCode }
      });
      
      if (!urlResponse.data || !urlResponse.data.s3_key) {
        throw new Error('파일 경로를 가져올 수 없습니다.');
      }
      
      // 2단계: 백엔드 프록시를 통해 파일 내용 가져오기 (CORS 문제 해결)
      let s3Key = urlResponse.data.s3_key;
      
      // player/edit 경로를 player/raw로 변경
      if (s3Key.includes('player/edit')) {
        s3Key = s3Key.replace('player/edit', 'player/raw');
      } else if (!s3Key.includes('player/raw')) {
        // edit이 없으면 player/raw 경로 추가
        s3Key = s3Key.replace(/\/([^\/]+)$/, '/player/raw/$1');
      }
      
      const fileContentResponse = await GetS3RawFileContentApi(s3Key);
      
      if (!fileContentResponse.data || !fileContentResponse.data.content) {
        throw new Error('파일 내용을 가져올 수 없습니다.');
      }
      
      const fileData = fileContentResponse.data.content;
      
      if (!fileData || fileData.trim() === '') {
        throw new Error('파일이 비어있습니다.');
      }
      
      const result = await findNearestGround(fileData, currentUserCode);
      
      if (result) {
        setFoundGround(result.closestGround || null);
        setNearbyGrounds(result.nearbyGrounds || []); // 가까운 경기장 저장 (최대 5개)
      }

      if (result && result.closestGround) {
        setSearchError(null);
      } else {
        setSearchError('근처에 경기장을 찾을 수 없습니다.');
      }
    } catch (error) {
      setSearchError(error.message || '자동찾기에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 다음 버튼 클릭 - 휴식공간 선택 페이지로 이동
  const handleGameInfoInput = () => {
    if (!foundGround) {
      alert('경기장을 선택해주세요.');
      return;
    }

    // 휴식공간 선택 페이지로 이동
    navigate('/app/anal/rest-area-selection', {
      state: {
        selectedFile,
        selectedGround: foundGround
      }
    });
  };

  // 경기장 검색 모달 열기
  const handleOpenSearchModal = () => {
    setShowSearchModal(true);
  };

  // 경기장 검색 모달 닫기
  const handleCloseSearchModal = useCallback(() => {
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchPage(0);
  }, []);

  // 경기장 직접 설정하기
  const handleManualGroundSelect = () => {
    navigate('/app/anal/ground-zone-setup', {
      state: {
        selectedGround: foundGround,
        selectedFile: selectedFile
      }
    });
  };

  // 경기장 검색 함수
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchPage(0);
      return;
    }

    try {
      setIsSearching(true);
      const response = await GetGroundListApi({ 
        search: query.trim(), 
        page: 1, 
        page_size: 10 
      });
      
      if (response?.data?.success) {
        const filteredResults = filterGroundsByOwner(response.data.data.grounds, userCode);
        setSearchResults(filteredResults);
        setShowSearchResults(true);
        setSearchPage(0);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
        setSearchPage(0);
      }
    } catch (error) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchPage(0);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색어 변경 핸들러 (디바운스 적용)
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // 디바운스: 500ms 후에 검색 실행
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  // 검색 결과에서 경기장 선택
  const handleSelectSearchResult = (ground) => {
    setFoundGround(ground);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setShowSearchModal(false);
    setSearchPage(0);
  };

  // corner_gps 좌표들의 평균 계산 함수
  const calculateCornerGpsAverage = (cornerGps) => {
    if (!cornerGps || !Array.isArray(cornerGps) || cornerGps.length === 0) {
      return null;
    }

    let validCoords = [];
    
    for (const coord of cornerGps) {
      if (Array.isArray(coord) && coord.length >= 2) {
        const lat = parseFloat(coord[0]);
        const lng = parseFloat(coord[1]);
        
        // GPS 좌표 범위 확인 (한국)
        if (!isNaN(lat) && !isNaN(lng) && 
            lat >= 33 && lat <= 43 && lng >= 124 && lng <= 132) {
          validCoords.push({ lat, lng });
        }
      }
    }
    
    if (validCoords.length === 0) {
      return null;
    }
    
    const avgLat = validCoords.reduce((sum, coord) => sum + coord.lat, 0) / validCoords.length;
    const avgLng = validCoords.reduce((sum, coord) => sum + coord.lng, 0) / validCoords.length;
    
    return { lat: avgLat, lng: avgLng };
  };

  // 지도 렌더링 함수
  const renderMap = () => {
    if (!foundGround || !kakaoMapLoaded) {
      return;
    }

    const container = document.getElementById('kakao-map');
    
    if (!container) {
      setTimeout(renderMap, 500);
      return;
    }
    
    // 기존 지도가 있다면 제거
    container.innerHTML = '';
    
    try {
      // corner_gps 평균 좌표 계산 (센터 좌표 대신 사용)
      let averageCoords = calculateCornerGpsAverage(foundGround.corner_gps);
      
      if (!averageCoords) {
        // fallback: center 좌표 사용
        if (Array.isArray(foundGround.center) && foundGround.center.length >= 2) {
          const centerLat = parseFloat(foundGround.center[0]);
          const centerLng = parseFloat(foundGround.center[1]);
          
          // 한국 GPS 좌표 범위인지 확인
          if (!isNaN(centerLat) && !isNaN(centerLng) &&
              centerLat >= 33 && centerLat <= 43 && centerLng >= 124 && centerLng <= 132) {
            averageCoords = { lat: centerLat, lng: centerLng };
          } else {
            return;
          }
        } else {
          return;
        }
      }
      
      const lat = averageCoords.lat;
      const lng = averageCoords.lng;
      
      // 안전한 LatLng 객체 생성
      let centerLatLng, markerPosition;
      try {
        centerLatLng = new window.kakao.maps.LatLng(lat, lng);
        markerPosition = new window.kakao.maps.LatLng(lat, lng);
      } catch (latLngError) {
        return;
      }
      
      const mapTypeId = mapType === 'satellite' ? 
        window.kakao.maps.MapTypeId.HYBRID : 
        window.kakao.maps.MapTypeId.ROADMAP;

      const options = {
        center: centerLatLng,
        level: 3,
        mapTypeId: mapTypeId
      };
      
      // 지도 생성
      let map;
      try {
        map = new window.kakao.maps.Map(container, options);
        // 지도 객체를 컨테이너에 저장 (타입 변경을 위해)
        container._kakaoMap = map;
      } catch (mapError) {
        return;
      }

      // 마커 추가
      let marker;
      try {
        marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);
      } catch (markerError) {
        // 마커 실패해도 지도는 표시되도록 계속 진행
      }

      // corner_gps가 있으면 다각형으로 경기장 구역 표시
      if (foundGround.corner_gps && Array.isArray(foundGround.corner_gps) && foundGround.corner_gps.length >= 3) {
        // 좌표 유효성 검증 및 변환
        const validCoords = [];
        for (const coord of foundGround.corner_gps) {
          if (Array.isArray(coord) && coord.length >= 2) {
            const lat = parseFloat(coord[0]);
            const lng = parseFloat(coord[1]);
            
            // 좌표가 유효한지 확인
            if (!isNaN(lat) && !isNaN(lng)) {
              // GPS 좌표 범위 확인 (한국)
              if (lat >= 33 && lat <= 43 && lng >= 124 && lng <= 132) {
                validCoords.push([lat, lng]);
              }
            }
          }
        }
        
        if (validCoords.length >= 3) {
          // corner_gps 좌표를 카카오맵 LatLng 객체로 변환
          const polygonPath = validCoords.map(coord => 
            new window.kakao.maps.LatLng(coord[0], coord[1])
          );
          
          try {
            // 다각형 생성
            const polygon = new window.kakao.maps.Polygon({
              path: polygonPath,
              strokeWeight: 3,
              strokeColor: '#00FF00',
              strokeOpacity: 0.8,
              fillColor: '#00FF00',
              fillOpacity: 0.2
            });
            
            polygon.setMap(map);
          } catch (polygonError) {
            createCircleArea();
          }
        } else {
          createCircleArea();
        }
      } else {
        createCircleArea();
      }
      
      // 원형 영역 생성 함수
      function createCircleArea() {
        try {
          const circle = new window.kakao.maps.Circle({
            center: markerPosition,
            radius: 50, // 50미터 반경
            strokeWeight: 2,
            strokeColor: '#00FF00',
            strokeOpacity: 0.8,
            fillColor: '#00FF00',
            fillOpacity: 0.2
          });
          circle.setMap(map);
        } catch (circleError) {
          // 원형 영역 생성 실패
        }
      }

      // 인포윈도우 추가 (corner_gps 기반 좌표 사용으로 안전화됨)
      try {
        const safeGroundName = (foundGround.name || '알 수 없는 경기장').toString().replace(/[<>]/g, '');
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:10px; text-align:center; font-size:14px;">${safeGroundName}</div>`
        });
        
        // 마커 위치가 유효한지 확인
        if (marker && marker.getPosition()) {
          infowindow.open(map, marker);
        }
      } catch (infoWindowError) {
        // 인포윈도우 생성 실패
      }
    } catch (error) {
      setSearchError('지도를 표시하는 중 오류가 발생했습니다.');
    }
  };

  // 카카오맵 로드 및 지도 렌더링
  useEffect(() => {
    if (foundGround && foundGround.center) {
      if (kakaoMapLoaded) {
        // 이미 로드된 경우 바로 렌더링
        renderMap();
      } else {
        // 아직 로드되지 않은 경우 로드 후 렌더링
        loadKakaoMap().then(() => {
          setTimeout(renderMap, 100); // 약간의 지연 후 렌더링
        }).catch(error => {
          setSearchError('지도 로드에 실패했습니다. 네트워크 연결을 확인해주세요.');
        });
      }
    }
  }, [foundGround, kakaoMapLoaded]);

  // 컴포넌트 마운트 시 카카오맵 로드
  useEffect(() => {
    loadKakaoMap().catch(error => {
      // 초기 로드 실패
    });
  }, []);

  useEffect(() => {
    try {
      const storedUserCode =
        (typeof window !== 'undefined' && (sessionStorage.getItem('userCode') || localStorage.getItem('user_code'))) ||
        null;
      setUserCode(storedUserCode);
    } catch (error) {
      setUserCode(null);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    // 선택된 파일이 없으면 이전 페이지로 돌아가기
    if (!selectedFile) {
      navigate('/app/anal/data-select');
      return;
    }
    
    if (userCode === undefined) {
      return;
    }

    // 자동으로 경기장 찾기 시도
    handleAutoFind(userCode);
  }, [selectedFile, navigate, userCode]);


  // 자동으로 찾은 경기장이 있거나 로딩이 완료될 때까지 로딩 화면 표시
  if (loading || (!foundGround && !searchError)) {
    return (
      <div className='player-ground-selection-2-page'>
        <LogoBellNav showBack={true} onBack={handleBack} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>해당 경기장을 찾는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='player-ground-selection-2-page'>
      <LogoBellNav logo={true} />
      
      {/* 표준 헤더 구조 - player_data_select_1과 동일한 스타일 */}
      <div className="ground-selection-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack}>
              <img src={require('../../../assets/main_icons/back_black.png')} alt="뒤로가기" />
            </button>
          </div>
          <div className="header-content">
            <h1 className="text-h2">경기장 선택</h1>
            <p className="subtitle text-body">뛰었던 경기장을 선택해주세요</p>
          </div>
        </div>
      </div>


      {/* 결과 섹션 */}
      {searchError && (
        <div className="error-section">
          <div className="error-message">
            <p className="text-body">{searchError}</p>
          </div>
        </div>
      )}

      {foundGround && (
        <div className="found-ground-section">
          
          <div className="found-ground-header">
            <h3 className="text-h3">예상 경기장 위치</h3>
          </div>
          
          <div className="found-ground-card">
            <div className="ground-icon"></div>
            <div className="ground-details">
              <h3 className="ground-name text-h4">{foundGround.name}</h3>
              <div className="ground-address">
                <span className="text-caption">{foundGround.address}</span>
              </div>
            </div>
            <div className="player-ground-selection-2">
              <div className="selected-indicator">✓</div>
            </div>
          </div>
          
          {/* 카카오맵 */}
          <div className="map-container">
            <div className="map-header">
              <h3 className="map-title text-h4">지도</h3>
              <div className="map-type-toggle">
                <button 
                  className={`map-type-btn ${mapType === 'roadmap' ? 'active' : ''}`}
                  onClick={() => handleMapTypeChange('roadmap')}
                >
                  지도
                </button>
                <button 
                  className={`map-type-btn ${mapType === 'satellite' ? 'active' : ''}`}
                  onClick={() => handleMapTypeChange('satellite')}
                >
                  위성
                </button>
              </div>
            </div>
            {kakaoMapLoaded ? (
              <>
                <div id="kakao-map" className="kakao-map"></div>
                {searchError && searchError.includes('지도') && (
                  <div className="map-error-overlay">
                    <div className="map-error-content">
                      <div className="map-error-icon">⚠️</div>
                      <p className="text-body">지도 표시 중 문제가 발생했습니다</p>
                      <p className="text-caption">경기장 정보는 아래에서 확인하실 수 있습니다.</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="map-placeholder">
                <div className="map-placeholder-content">
                  <div className="map-placeholder-icon">🗺️</div>
                  <p className="text-body">지도를 로드하는 중...</p>
                  <p className="text-caption">잠시 후 지도가 표시됩니다.</p>
                </div>
              </div>
            )}
          </div>
          
          {/* 액션 버튼들 */}
          <div className="ground-actions">
            <button 
              className="action-btn btn-secondary"
              onClick={handleGameInfoInput}
            >
              다음
            </button>
            <button 
              className="action-btn btn-outline"
              onClick={handleOpenSearchModal}
            >
              경기장 검색
            </button>
          </div>
          
        </div>
      )}

      {/* 경기장 검색 모달 - DSModal로 통일 */}
      <DSModal
        isOpen={showSearchModal}
        onClose={handleCloseSearchModal}
        title="경기장 검색"
        size="lg"
      >
        <DSModal.Body>
          <div className="ground-search-modal">
            {/* 검색 영역 */}
            <div className="ground-search__bar" style={{ position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 1, paddingBottom: '8px' }}>
              <div className="search-input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="경기장 이름 또는 주소로 검색"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
                {isSearching && (
                  <div className="search-loading">
                    <div className="loading-spinner-small"></div>
                  </div>
                )}
              </div>
              <div className="ground-search__hint text-caption" style={{ color: 'var(--text-secondary)', marginTop: '6px', marginLeft: '8px' }}>
                입력 시 자동으로 검색됩니다. 가까운 경기장은 기본으로 표시됩니다.
              </div>
            </div>

            {/* 결과 리스트 */}
            <div className="ground-search__results" style={{ maxHeight: '60vh', overflowY: 'auto', paddingTop: '8px' }}>
              {searchQuery.trim() ? (
                showSearchResults ? (
                  searchResults.length > 0 ? (
                    <div className="ground-search__section">
                      <div className="ground-search__section-header" style={{ marginBottom: '8px' }}>
                        <h4 className="text-h4">검색 결과</h4>
                      </div>
                      <div className="ground-search__list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {searchResults.slice(searchPage * pageSize, (searchPage + 1) * pageSize).map((ground) => (
                          <button
                            type="button"
                            key={ground.ground_code}
                            className="ground-search__item"
                            onClick={() => handleSelectSearchResult(ground)}
                            style={{
                              textAlign: 'left',
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border)',
                              borderRadius: '12px',
                              padding: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            <div className="ground-icon-small" aria-hidden="true">🏟️</div>
                            <div className="ground-info" style={{ flex: 1 }}>
                              <div className="ground-name text-body" style={{ fontWeight: 600 }}>{ground.name}</div>
                              <div className="ground-address text-caption" style={{ color: 'var(--text-secondary)' }}>{ground.address}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                      {searchResults.length > pageSize && (
                        <div className="ds-detail__section ds-row ds-nowrap" style={{ justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
                          <button
                            className="icon-square-btn"
                            onClick={() => setSearchPage((p) => Math.max(0, p - 1))}
                            aria-label="이전"
                            disabled={searchPage === 0}
                          >
                            ‹
                          </button>
                          <div className="text-body" style={{ color: 'var(--text-secondary)', minWidth: '60px', textAlign: 'center' }}>
                            {Math.min(searchPage + 1, Math.ceil(searchResults.length / pageSize))} / {Math.ceil(searchResults.length / pageSize)}
                          </div>
                          <button
                            className="icon-square-btn"
                            onClick={() => setSearchPage((p) => (p + 1 < Math.ceil(searchResults.length / pageSize) ? p + 1 : p))}
                            aria-label="다음"
                            disabled={searchPage + 1 >= Math.ceil(searchResults.length / pageSize)}
                          >
                            ›
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="ground-search__empty" style={{ padding: '24px 8px', textAlign: 'center' }}>
                      <p className="text-body">검색 결과가 없습니다.</p>
                      <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>철자 및 띄어쓰기를 확인하거나 다른 키워드로 시도하세요.</p>
                    </div>
                  )
                ) : (
                  <div className="ground-search__empty" style={{ padding: '24px 8px', textAlign: 'center' }}>
                    <div className="loading-spinner"></div>
                    <p className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>검색 중...</p>
                  </div>
                )
              ) : (
                <div className="ground-search__section">
                  <div className="ground-search__section-header" style={{ marginBottom: '8px' }}>
                  </div>
                  {nearbyGrounds && nearbyGrounds.length > 0 ? (
                    <>
                      <div className="ground-search__list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {nearbyGrounds.slice(0, pageSize).map((ground) => (
                          <button
                            type="button"
                            key={ground.ground_code}
                            className="ground-search__item"
                            onClick={() => handleSelectSearchResult(ground)}
                            style={{
                              textAlign: 'left',
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border)',
                              borderRadius: '12px',
                              padding: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            <div className="ground-icon-small" aria-hidden="true">🏟️</div>
                            <div className="ground-info" style={{ flex: 1 }}>
                              <div className="ground-name text-body" style={{ fontWeight: 600 }}>{ground.name}</div>
                              <div className="ground-address text-caption" style={{ color: 'var(--text-secondary)' }}>{ground.address}</div>
                            </div>
                            <div className="ground-distance">
                              <span className="text-caption" style={{ color: 'var(--text-secondary)' }}>{ground.distanceText}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                    </>
                  ) : (
                    <div className="ground-search__empty" style={{ padding: '24px 8px', textAlign: 'center' }}>
                      <p className="text-body">표시할 가까운 경기장이 없습니다.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DSModal.Body>
        <DSModal.Footer>
          <button 
            className="btn-primary"
            onClick={() => {
              handleCloseSearchModal();
              handleManualGroundSelect();
            }}
          >
            경기구역 직접 설정하기
          </button>
        </DSModal.Footer>
      </DSModal>

    </div>
  );
};

export default PlayerGroundSelection2;
