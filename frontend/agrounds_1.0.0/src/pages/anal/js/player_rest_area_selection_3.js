import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/player_rest_area_selection_3.scss';
import { GetGroundSearchApi, GetKakaoMapKeyApi } from '../../../function/api/ground/groundApi';
import { GetS3RawFileContentApi } from '../../../function/api/upload/uploadApi';
import client from '../../../client';

// 좌표 유틸리티 함수들
const CoordinateUtils = {
  // GPS 좌표 유효성 검증 (한국 범위)
  isValidKoreaGPS: (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) && 
           lat >= 33 && lat <= 43 && 
           lng >= 124 && lng <= 132;
  },

  // 좌표 배열/객체를 통일된 형태로 변환
  normalizeCoordinate: (coord) => {
    if (!coord) return null;
    
    let lat, lng;
    
    if (Array.isArray(coord)) {
      lat = parseFloat(coord[0]);
      lng = parseFloat(coord[1]);
    } else if (typeof coord === 'object') {
      lat = parseFloat(coord.lat);
      lng = parseFloat(coord.lng);
    } else {
      return null;
    }
    
    return CoordinateUtils.isValidKoreaGPS(lat, lng) ? { lat, lng } : null;
  },

  // 좌표 배열의 중심점 계산
  calculateCenter: (coords) => {
    const validCoords = coords
      .map(coord => CoordinateUtils.normalizeCoordinate(coord))
      .filter(coord => coord !== null);
    
    if (validCoords.length === 0) return null;
    
    const sumLat = validCoords.reduce((sum, coord) => sum + coord.lat, 0);
    const sumLng = validCoords.reduce((sum, coord) => sum + coord.lng, 0);
    
    return {
      lat: sumLat / validCoords.length,
      lng: sumLng / validCoords.length
    };
  },

  // 좌표를 중심점 기준으로 회전
  rotateCoordinate: (coord, center, angleDegrees) => {
    const radians = (angleDegrees * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    const dx = coord.lng - center.lng;
    const dy = coord.lat - center.lat;
    
    const rotatedDx = dx * cos - dy * sin;
    const rotatedDy = dx * sin + dy * cos;
    
    return {
      lat: center.lat + rotatedDy,
      lng: center.lng + rotatedDx
    };
  },

  // 경기장 크기에 따른 적절한 줌 레벨 계산
  calculateZoomLevel: (coords, isMobileDevice = false) => {
    if (!coords || coords.length < 2) return 3;
    
    const validCoords = coords
      .map(coord => CoordinateUtils.normalizeCoordinate(coord))
      .filter(coord => coord !== null);
    
    if (validCoords.length < 2) return 3;
    
    const lats = validCoords.map(c => c.lat);
    const lngs = validCoords.map(c => c.lng);
    
    const latRange = Math.max(...lats) - Math.min(...lats);
    const lngRange = Math.max(...lngs) - Math.min(...lngs);
    const maxRange = Math.max(latRange, lngRange);
    
    // 일관된 화면 비율을 위한 고정 줌 레벨 사용
    // 모든 경기장이 동일한 화면 비율로 표시되도록 함
    const fixedZoomLevel = isMobileDevice ? 2 : 3;
    
    return fixedZoomLevel;
  },

  // 점과 선분 사이의 최소 거리 계산
  distancePointToSegment: (px, py, x1, y1, x2, y2) => {
    const segVecX = x2 - x1;
    const segVecY = y2 - y1;
    const ptVecX = px - x1;
    const ptVecY = py - y1;
    
    const segLen2 = segVecX ** 2 + segVecY ** 2;
    if (segLen2 === 0) {
      return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    }
    
    const t = (ptVecX * segVecX + ptVecY * segVecY) / segLen2;
    
    if (t < 0) {
      return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    } else if (t > 1) {
      return Math.sqrt((px - x2) ** 2 + (py - y2) ** 2);
    } else {
      const projX = x1 + t * segVecX;
      const projY = y1 + t * segVecY;
      return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
    }
  },

  // GPS 좌표를 UTM 좌표로 변환하는 함수 (한국 UTM Zone 52N)
  gpsToUtm: (lat, lng, zone = 52) => {
    const a = 6378137; // WGS84 장축
    const f = 1 / 298.257223563; // WGS84 편평율
    const k0 = 0.9996; // UTM 척도 계수
    const e = Math.sqrt(2 * f - f * f);
    const e1sq = e * e / (1 - e * e);
    
    const latRad = lat * Math.PI / 180;
    const lngRad = lng * Math.PI / 180;
    
    const centralMeridian = (zone - 1) * 6 - 180 + 3;
    const centralMeridianRad = centralMeridian * Math.PI / 180;
    
    const deltaLng = lngRad - centralMeridianRad;
    
    const N = a / Math.sqrt(1 - e * e * Math.sin(latRad) * Math.sin(latRad));
    const T = Math.tan(latRad) * Math.tan(latRad);
    const C = e1sq * Math.cos(latRad) * Math.cos(latRad);
    const A = Math.cos(latRad) * deltaLng;
    
    const M = a * ((1 - e * e / 4 - 3 * e * e * e * e / 64 - 5 * Math.pow(e, 6) / 256) * latRad
                - (3 * e * e / 8 + 3 * e * e * e * e / 32 + 45 * Math.pow(e, 6) / 1024) * Math.sin(2 * latRad)
                + (15 * e * e * e * e / 256 + 45 * Math.pow(e, 6) / 1024) * Math.sin(4 * latRad)
                - (35 * Math.pow(e, 6) / 3072) * Math.sin(6 * latRad));
    
    const easting = 500000 + k0 * N * (A + (1 - T + C) * Math.pow(A, 3) / 6
                    + (5 - 18 * T + T * T + 72 * C - 58 * e1sq) * Math.pow(A, 5) / 120);
    
    const northing = k0 * (M + N * Math.tan(latRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 24
                     + (61 - 58 * T + T * T + 600 * C - 330 * e1sq) * Math.pow(A, 6) / 720));
    
    return { easting, northing };
  }
};

const PlayerRestAreaSelection3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polygonRef = useRef(null);
  const mapRenderedRef = useRef(false);
  
  // 이전 페이지에서 전달받은 데이터
  const selectedFile = location.state?.selectedFile;
  const selectedGround = location.state?.selectedGround;
  
  // State
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [selectedRestArea, setSelectedRestArea] = useState(null);
  const [groundRotation, setGroundRotation] = useState(0);
  const [mapError, setMapError] = useState(null);
  const [mapType, setMapType] = useState('ROADMAP'); // 지도 타입 상태 (기본값: 일반 지도)
  const [autoFilling, setAutoFilling] = useState(false); // 자동입력 중 상태
  
  // 모바일 디바이스 감지
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

  // 뒤로가기
  const handleBack = () => {
    navigate('/app/anal/ground-selection', {
      state: { selectedFile, selectedGround }
    });
  };

  // 휴식공간 선택
  const handleRestAreaSelect = (area) => {
    setSelectedRestArea(area);
  };

  // 지도 타입 변경 핸들러
  const handleMapTypeChange = (type) => {
    setMapType(type);
    if (mapInstanceRef.current) {
      const mapTypeId = type === 'ROADMAP' ? 
        window.kakao.maps.MapTypeId.ROADMAP : 
        window.kakao.maps.MapTypeId.HYBRID;
      mapInstanceRef.current.setMapTypeId(mapTypeId);
    }
  };

  // 줌 인/아웃 핸들러
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentLevel = mapInstanceRef.current.getLevel();
      mapInstanceRef.current.setLevel(currentLevel - 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentLevel = mapInstanceRef.current.getLevel();
      mapInstanceRef.current.setLevel(currentLevel + 1);
    }
  };

  // 자동입력: GPS 데이터 분석하여 휴식 위치 자동 선택
  const handleAutoFill = async () => {
    if (!selectedFile || !selectedGround) {
      alert('파일 또는 경기장 정보가 없습니다.');
      return;
    }

    try {
      setAutoFilling(true);
      
      // 1. GPS 파일 내용 읽기
      const uploadCode = selectedFile.upload_code || selectedFile.rawData?.upload_code;
      if (!uploadCode) {
        throw new Error('업로드 코드를 찾을 수 없습니다.');
      }

      // 파일 다운로드 URL 가져오기
      const urlResponse = await client.get('/api/user/file-download/', {
        params: { upload_code: uploadCode }
      });

      if (!urlResponse.data || !urlResponse.data.s3_key) {
        throw new Error('파일 경로를 가져올 수 없습니다.');
      }

      let s3Key = urlResponse.data.s3_key;

      // player/edit 경로 확보 (CSV 파일용)
      if (!s3Key.includes('player/edit')) {
        // player/raw 경로를 player/edit으로 변경
        if (s3Key.includes('player/raw')) {
          s3Key = s3Key.replace('player/raw', 'player/edit');
        } else {
          // 경로에 player가 없으면 추가
          s3Key = s3Key.replace(/\/([^\/]+)$/, '/player/edit/$1');
        }
      }
      
      // 파일 내용 가져오기
      const response = await GetS3RawFileContentApi(s3Key);
      const fileContentString = response.data.content;

      if (!fileContentString) {
        throw new Error('파일 내용을 읽을 수 없습니다.');
      }

      // 2. 파일 파싱 (CSV와 TXT 형식 모두 지원)
      const lines = fileContentString.split('\n').filter(line => line.trim());
      const records = [];

      // 파일 형식 자동 감지
      const firstLine = lines[0]?.trim() || '';
      const isCSV = firstLine.includes(',');
      const isTXT = firstLine.includes('/');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
          let xUtm, yUtm, dt;

          if (isCSV) {
            // CSV 형식 파싱: device_id,timestamp,lat,lon
            const parts = line.trim().split(',');
            
            // 헤더 줄 건너뛰기
            if (i === 0 && parts[0] === 'device_id') {
              continue;
            }
            
            if (parts.length < 4) continue;

            const lat = parseFloat(parts[2]);
            const lon = parseFloat(parts[3]);
            const timestamp = parts[1];

            if (isNaN(lat) || isNaN(lon)) continue;

            // GPS를 UTM으로 변환
            const utm = CoordinateUtils.gpsToUtm(lat, lon);
            xUtm = utm.easting;
            yUtm = utm.northing;

            // 타임스탬프 파싱
            dt = new Date(timestamp);
            if (isNaN(dt.getTime())) {
              // 잘못된 날짜면 현재 시간 사용
              dt = new Date();
            }

          } else if (isTXT) {
            // TXT 형식 파싱: device_id/timestamp/x_utm/y_utm
            const parts = line.trim().split('/');
            if (parts.length < 4) continue;

            const timestr = parts[1];
            xUtm = parseFloat(parts[2]);
            yUtm = parseFloat(parts[3]);

            if (isNaN(xUtm) || isNaN(yUtm)) continue;

            // 날짜 파싱: YYYY.MM.DD.HH.MM.SS.microsec
            const datePart = timestr.split('.');
            if (datePart.length < 6) continue;

            const year = parseInt(datePart[0]);
            const month = parseInt(datePart[1]) - 1;
            const day = parseInt(datePart[2]);
            const hour = parseInt(datePart[3]);
            const minute = parseInt(datePart[4]);
            const second = parseInt(datePart[5]);
            const microsec = datePart.length > 6 ? parseInt(datePart[6]) : 0;

            dt = new Date(year, month, day, hour, minute, second, microsec);

          } else {
            continue; // 알 수 없는 형식
          }

          if (dt && !isNaN(xUtm) && !isNaN(yUtm)) {
            records.push({ dt, xUtm, yUtm });
          }

        } catch (error) {
          continue; // 파싱 실패한 라인은 무시
        }
      }

      if (records.length === 0) {
        throw new Error('유효한 GPS 데이터가 없습니다.');
      }

      // 시간순 정렬
      records.sort((a, b) => a.dt - b.dt);

      // 3. 처음 1분 + 마지막 1분 데이터 필터링
      const startTime = records[0].dt;
      const endTime = records[records.length - 1].dt;
      const firstMinuteEnd = new Date(startTime.getTime() + 60000); // 1분 = 60000ms
      const lastMinuteStart = new Date(endTime.getTime() - 60000);

      const firstMinData = records.filter(r => r.dt >= startTime && r.dt < firstMinuteEnd);
      const lastMinData = records.filter(r => r.dt >= lastMinuteStart && r.dt <= endTime);
      const combinedData = [...firstMinData, ...lastMinData];

      // 4. 경기장의 north_side_utm과 south_side_utm 가져오기
      const northSideUtm = selectedGround.north_side_utm;
      const southSideUtm = selectedGround.south_side_utm;

      if (!northSideUtm || !southSideUtm) {
        throw new Error('경기장의 북쪽/남쪽 좌표 정보가 없습니다.');
      }

      // 5. 각 점이 북쪽과 남쪽 중 어디에 더 가까운지 계산
      const closerCounts = { north: 0, south: 0 };

      for (const record of combinedData) {
        const distNorth = CoordinateUtils.distancePointToSegment(
          record.xUtm, record.yUtm,
          northSideUtm[0][0], northSideUtm[0][1],
          northSideUtm[1][0], northSideUtm[1][1]
        );

        const distSouth = CoordinateUtils.distancePointToSegment(
          record.xUtm, record.yUtm,
          southSideUtm[0][0], southSideUtm[0][1],
          southSideUtm[1][0], southSideUtm[1][1]
        );

        if (distNorth < distSouth) {
          closerCounts.north++;
        } else {
          closerCounts.south++;
        }
      }

      // 6. 결과에 따라 북쪽(A) 또는 남쪽(B) 선택
      const result = closerCounts.north >= closerCounts.south ? 'A' : 'B';
      setSelectedRestArea(result);

    } catch (error) {
      alert(`자동입력 실패: ${error.message}`);
    } finally {
      setAutoFilling(false);
    }
  };

  // 다음 단계로
  const handleNext = () => {
    if (!selectedRestArea) {
      alert('휴식공간을 선택해주세요.');
      return;
    }
    
    navigate('/app/anal/quarter-info', {
      state: {
        selectedFile,
        selectedGround,
        selectedRestArea,
        isNewAnalysis: true
      }
    });
  };

  // 카카오맵 초기화
  const initializeKakaoMap = async () => {
    try {
      setMapLoading(true);
      setMapError(null);
      
      // 이미 로드된 경우 확인
      if (window.kakao?.maps) {
        return true;
      }
      
      // API 키 가져오기
      let apiKey = '664cc150367cf3800a5a3c0bb7f300a8';
      try {
        const response = await GetKakaoMapKeyApi();
        if (response?.data?.success && response.data?.kakao_map_key) {
          apiKey = response.data.kakao_map_key;
        }
      } catch (error) {
        // 기본 카카오맵 키 사용
      }
      
      // 기존 스크립트 제거
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) {
        existingScript.remove();
        delete window.kakao;
      }
      
      // 새 스크립트 로드
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
        script.async = true;
        
        const timeout = setTimeout(() => {
          reject(new Error('카카오맵 로드 시간초과'));
        }, 10000);
        
        script.onload = () => {
          clearTimeout(timeout);
          if (!window.kakao?.maps) {
            reject(new Error('카카오맵 객체 없음'));
            return;
          }
          
          window.kakao.maps.load(() => {
            resolve(true);
          });
        };
        
        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('스크립트 로드 실패'));
        };
        
        document.head.appendChild(script);
      });
    } catch (error) {
      setMapError(error.message);
      throw error;
    } finally {
      setMapLoading(false);
    }
  };

  // 경기장 중심 좌표 가져오기
  const getGroundCenter = () => {
    if (!selectedGround) return null;
    
    // 1. corner_gps로부터 중심점 계산
    if (selectedGround.corner_gps?.length >= 4) {
      const center = CoordinateUtils.calculateCenter(selectedGround.corner_gps);
      if (center) return center;
    }
    
    // 2. center 좌표 사용
    if (selectedGround.center) {
      const center = CoordinateUtils.normalizeCoordinate(selectedGround.center);
      if (center) return center;
    }
    
    return null;
  };


  // 지도 렌더링 함수
  const renderMap = async () => {
    if (!selectedGround || !mapRef.current || !window.kakao?.maps) {
      return;
    }
    
    // 이미 렌더링 되었으면 중복 실행 방지
    if (mapRenderedRef.current && mapInstanceRef.current) {
      return;
    }
    
    try {
      // 지도 컨테이너가 실제로 DOM에 있는지 확인
      const container = mapRef.current;
      if (!container.offsetWidth || !container.offsetHeight) {
        setTimeout(() => renderMap(), 100);
        return;
      }
      
      // 중심 좌표 가져오기
      const center = getGroundCenter();
      if (!center) {
        throw new Error('유효한 중심 좌표를 찾을 수 없습니다.');
      }
      
      // 지도 옵션 설정
      const zoomLevel = CoordinateUtils.calculateZoomLevel(selectedGround.corner_gps || [], isMobile);
      
      // mapType state에 따라 초기 지도 타입 설정
      const initialMapTypeId = mapType === 'ROADMAP' ? 
        window.kakao.maps.MapTypeId.ROADMAP : 
        window.kakao.maps.MapTypeId.HYBRID;
      
      const mapOptions = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: zoomLevel,
        mapTypeId: initialMapTypeId,
        draggable: true,        // 드래그로 이동 가능
        zoomable: true,         // 줌 가능
        scrollwheel: true,      // 마우스 휠로 줌 가능
        disableDoubleClick: false,      // 더블클릭 줌 가능
        disableDoubleClickZoom: false,  // 더블클릭 줌 활성화
        keyboardShortcuts: true, // 키보드 단축키 활성화
        // 지도 컨트롤 활성화
        mapTypeControl: true,   // 지도 타입 컨트롤 (위성/지도 전환)
        zoomControl: true,      // 줌 컨트롤 (확대/축소)
        scaleControl: false,    // 스케일 컨트롤은 숨김
        roadviewControl: false  // 로드뷰 컨트롤은 숨김
      };
      
      // 지도 생성
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(mapOptions.center);
        mapInstanceRef.current.setLevel(mapOptions.level);
        // 기존 지도의 타입도 업데이트
        mapInstanceRef.current.setMapTypeId(initialMapTypeId);
      } else {
        mapInstanceRef.current = new window.kakao.maps.Map(container, mapOptions);
        mapRenderedRef.current = true;
      }
      
      // 지도 회전 적용 (CSS transform) - 반대 방향으로 회전
      if (groundRotation !== 0) {
        // 회전 시 지도가 잘리지 않도록 스케일 조정
        const rotationAngle = -groundRotation; // 반대 방향으로 회전
        const angle = Math.abs(rotationAngle);
        const radians = (angle * Math.PI) / 180;
        const scale = Math.max(
          Math.abs(Math.cos(radians)) + Math.abs(Math.sin(radians) * (6/9)),
          Math.abs(Math.sin(radians)) + Math.abs(Math.cos(radians) * (6/9))
        );
        
        // 크롭된 영역을 보상하기 위해 추가 확대 (상하 12%, 좌우 8% 크롭 보상)
        const cropCompensation = isMobile ? 0.95 : 1.05; // 모바일은 더 축소
        const finalScale = scale * cropCompensation;
        
        container.style.transform = `rotate(${rotationAngle}deg) scale(${finalScale})`;
        container.style.transformOrigin = 'center center';
      } else {
        // 회전이 없어도 크롭 보상을 위해 확대
        const cropCompensation = isMobile ? 0.95 : 1.05; // 모바일은 더 축소
        container.style.transform = `scale(${cropCompensation})`;
        container.style.transformOrigin = 'center center';
      }
      
      // 경기장 다각형 그리기 (회전 없이)
      if (selectedGround.corner_gps?.length >= 3) {
        setTimeout(async () => {
          await drawGroundPolygon(false); // 회전 적용하지 않음
        }, 100);
      }
      
    } catch (error) {
      setMapError(error.message);
      mapRenderedRef.current = false;
    }
  };
  
  // 경기장 다각형 그리기
  const drawGroundPolygon = async (applyRotation = true) => {
    if (!selectedGround.corner_gps || !mapInstanceRef.current) return;
    
    // 기존 다각형 제거
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }
    
    // 좌표 정규화 및 검증
    const cornerCoords = selectedGround.corner_gps
      .map(coord => CoordinateUtils.normalizeCoordinate(coord))
      .filter(coord => coord !== null);
    
    if (cornerCoords.length < 3) {
      return;
    }
    
    // 중심점 계산
    const center = CoordinateUtils.calculateCenter(cornerCoords);
    
    // 회전 적용 (applyRotation이 true이고 groundRotation이 0이 아닐 때만)
    let finalCoords = cornerCoords;
    if (applyRotation && groundRotation !== 0) {
      finalCoords = cornerCoords.map(coord => 
        CoordinateUtils.rotateCoordinate(coord, center, groundRotation)
      );
    }
    
    // 카카오맵 LatLng 객체로 변환
    const polygonPath = finalCoords.map(coord => 
      new window.kakao.maps.LatLng(coord.lat, coord.lng)
    );
    
    // 다각형 생성
    polygonRef.current = new window.kakao.maps.Polygon({
      path: polygonPath,
      strokeWeight: 4,
      strokeColor: '#079669', // 초록색 테두리
      strokeOpacity: 1,
      fillColor: '#079669', // 초록색 내부
      fillOpacity: 0.3 // 투명한 초록색
    });
    
    polygonRef.current.setMap(mapInstanceRef.current);
    
    // 경기 구역이 화면에 맞도록 조정
    setTimeout(() => {
      const bounds = new window.kakao.maps.LatLngBounds();
      polygonPath.forEach(latLng => bounds.extend(latLng));
      
      if (isMobile) {
        // 모바일에서는 중심점을 약간 아래로 이동
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        
        // 중심점 계산
        const centerLat = (sw.getLat() + ne.getLat()) / 2;
        const centerLng = (sw.getLng() + ne.getLng()) / 2;
        
        // 높이의 5%만큼 아래로 이동
        const latOffset = (ne.getLat() - sw.getLat()) * 0.05;
        const adjustedCenter = new window.kakao.maps.LatLng(centerLat - latOffset, centerLng);
        
        // 지도 중심 설정 및 경기장이 화면에 맞도록 설정
        mapInstanceRef.current.setCenter(adjustedCenter);
        
        // 모바일에서는 패딩을 더 줄여서 경기장이 더 크게 보이도록
        mapInstanceRef.current.setBounds(bounds, 10); // 패딩을 최소화해서 확대 효과 극대화
      } else {
        // PC에서는 기존대로
        mapInstanceRef.current.setBounds(bounds, 50);
      }
    }, 100);
  };

  // 회전 각도 가져오기
  const fetchGroundRotation = async () => {
    if (!selectedGround) return;
    
    // 이미 있으면 사용
    if (selectedGround.rotate_deg !== undefined) {
      setGroundRotation(parseFloat(selectedGround.rotate_deg) || 0);
      return;
    }
    
    // API에서 가져오기
    try {
      const response = await GetGroundSearchApi(selectedGround.ground_code);
      if (response?.data?.rotate_deg !== undefined) {
        setGroundRotation(parseFloat(response.data.rotate_deg) || 0);
      }
    } catch (error) {
      setGroundRotation(0);
    }
  };

  // 필수 데이터 검증
  useEffect(() => {
    if (!selectedFile || !selectedGround) {
      navigate('/app/anal/ground-selection');
      return;
    }
    setLoading(false);
  }, [selectedFile, selectedGround, navigate]);
  
  // 카카오맵 초기화
  useEffect(() => {
    if (!loading) {
      initializeKakaoMap().catch(error => {
        setMapError('지도를 불러오는데 실패했습니다.');
      });
    }
  }, [loading]);
  
  // 회전 각도 가져오기
  useEffect(() => {
    if (!loading && selectedGround) {
      fetchGroundRotation();
    }
  }, [loading, selectedGround]);
  
  // 지도 렌더링 - mapRef가 설정된 후 실행
  useEffect(() => {
    if (!loading && !mapLoading && mapRef.current && selectedGround && groundRotation !== undefined) {
      // ResizeObserver로 컨테이너 크기 감지
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            renderMap();
            resizeObserver.disconnect();
          }
        }
      });
      
      resizeObserver.observe(mapRef.current);
      
      // 백업 타이머
      const timer = setTimeout(() => {
        renderMap();
      }, 500);
      
      return () => {
        resizeObserver.disconnect();
        clearTimeout(timer);
      };
    }
  }, [loading, mapLoading, selectedGround, groundRotation]);
  
  // 회전 각도 변경 시 지도 회전 업데이트
  useEffect(() => {
    if (groundRotation !== undefined && mapRef.current) {
      if (groundRotation !== 0) {
        // 회전 시 지도가 잘리지 않도록 스케일 조정
        const rotationAngle = -groundRotation; // 반대 방향으로 회전
        const angle = Math.abs(rotationAngle);
        const radians = (angle * Math.PI) / 180;
        const scale = Math.max(
          Math.abs(Math.cos(radians)) + Math.abs(Math.sin(radians) * (6/9)),
          Math.abs(Math.sin(radians)) + Math.abs(Math.cos(radians) * (6/9))
        );
        
        // 크롭된 영역을 보상하기 위해 추가 확대 (상하 12%, 좌우 8% 크롭 보상)
        const cropCompensation = isMobile ? 1.05 : 1.15; // 모바일은 더 축소
        const finalScale = scale * cropCompensation;
        
        mapRef.current.style.transform = `rotate(${rotationAngle}deg) scale(${finalScale})`;
        mapRef.current.style.transformOrigin = 'center center';
      } else {
        // 회전이 없어도 크롭 보상을 위해 확대
        const cropCompensation = isMobile ? 1.05 : 1.15; // 모바일은 더 축소
        mapRef.current.style.transform = `scale(${cropCompensation})`;
        mapRef.current.style.transformOrigin = 'center center';
      }
      
      // 다각형도 다시 그리기 (회전 없이)
      if (mapInstanceRef.current && selectedGround?.corner_gps?.length >= 3) {
        drawGroundPolygon(false);
      }
    }
  }, [groundRotation]);
  
  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
      mapRenderedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className='player-rest-area-selection-3-page'>
        <LogoBellNav showBack={true} onBack={handleBack} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>휴식공간 선택 페이지를 준비하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='player-rest-area-selection-3-page'>
      <LogoBellNav logo={true} />
      
      {/* 표준 헤더 구조 - player_data_select_1과 동일한 스타일 */}
      <div className="rest-area-selection-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack}>
              <img src={require('../../../assets/main_icons/back_black.png')} alt="뒤로가기" />
            </button>
            <button className="auto-fill-btn" onClick={handleAutoFill} disabled={autoFilling || mapLoading}>
              {autoFilling ? '분석중...' : '자동입력'}
            </button>
          </div>
          <div className="header-content">
            <h1 className="text-h2">휴식 위치 선택</h1>
            <p className="subtitle text-body">기준점 설정을 위해 휴식을 취한 위치를 선택하세요</p>
          </div>
        </div>
      </div>

      {/* 지도 컨테이너 */}
      <div className="map-section">
        {/* 북쪽 버튼 - 지도 위쪽 */}
        <button 
          className={`rest-area-btn rest-area-a ${selectedRestArea === 'A' ? 'selected' : ''}`}
          onClick={() => handleRestAreaSelect('A')}
          disabled={mapLoading}
        >
          북쪽
        </button>
        
        <div className="map-container">
          {mapError ? (
            <div className="map-error">
              <div className="map-error-content">
                <div className="map-error-icon">⚠️</div>
                <p className="text-body">{mapError}</p>
                <button 
                  className="btn-secondary retry-btn"
                  onClick={() => window.location.reload()}
                >
                  다시 시도
                </button>
              </div>
            </div>
          ) : mapLoading ? (
            <div className="map-placeholder">
              <div className="map-placeholder-content">
                <div className="map-placeholder-icon">🗺️</div>
                <p className="text-body">지도를 불러오는 중...</p>
              </div>
            </div>
          ) : (
            <>
              <div ref={mapRef} className="kakao-map"></div>
              {/* 좌우 크롭 요소 */}
              <div className="map-crop-left"></div>
              <div className="map-crop-right"></div>
              
              {/* 지도 내부 컨트롤 버튼들 */}
              <div className="map-controls">
                {/* 줌 컨트롤 */}
                <div className="zoom-controls">
                  <button 
                    className="map-control-btn zoom-in-btn"
                    onClick={handleZoomIn}
                    title="확대"
                  >
                    +
                  </button>
                  <button 
                    className="map-control-btn zoom-out-btn"
                    onClick={handleZoomOut}
                    title="축소"
                  >
                    −
                  </button>
                </div>
                
                {/* 지도 타입 컨트롤 */}
                <div className="map-type-controls">
                  <button 
                    className={`map-control-btn map-type-btn ${mapType === 'ROADMAP' ? 'active' : ''}`}
                    onClick={() => handleMapTypeChange('ROADMAP')}
                    title="지도"
                  >
                    지도
                  </button>
                  <button 
                    className={`map-control-btn map-type-btn ${mapType === 'HYBRID' ? 'active' : ''}`}
                    onClick={() => handleMapTypeChange('HYBRID')}
                    title="위성"
                  >
                    위성
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* 남쪽 버튼 - 지도 아래쪽 */}
        <button 
          className={`rest-area-btn rest-area-b ${selectedRestArea === 'B' ? 'selected' : ''}`}
          onClick={() => handleRestAreaSelect('B')}
          disabled={mapLoading}
        >
          남쪽
        </button>
      </div>

      {/* 다음 버튼 */}
      <div className="action-section">
        <button 
          className={`btn-primary continue-btn ${!selectedRestArea ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!selectedRestArea || mapLoading}
        >
          {mapLoading ? '로딩 중...' : '다음'}
        </button>
      </div>
    </div>
  );
};

export default PlayerRestAreaSelection3;
