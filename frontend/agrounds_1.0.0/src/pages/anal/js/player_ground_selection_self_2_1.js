import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/player_ground_selection_self_2_1.scss';

// API
import { GetGroundListApi, GetKakaoMapKeyApi, CreateGroundApi } from '../../../function/api/ground/groundApi';
import { GetS3FileContentApi, GetS3RawFileContentApi } from '../../../function/api/upload/uploadApi';
import client from '../../../client';

const PlayerGroundSelectionSelf21 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 이전 페이지에서 전달받은 정보
  const selectedGround = location.state?.selectedGround;
  const selectedFile = location.state?.selectedFile;
  
  const [loading, setLoading] = useState(true);
  const [kakaoMapLoaded, setKakaoMapLoaded] = useState(false);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' 또는 'satellite'
  const [gameZone, setGameZone] = useState(null); // 경기 구역 (초록색 사각형)
  const [activityCenter, setActivityCenter] = useState(null); // 주요 활동 지점
  const [zoomLevel, setZoomLevel] = useState(17);
  const [groundName, setGroundName] = useState(selectedGround?.ground_name || ''); // 경기장 이름
  
  // 경기 구역 사각형 상태 (드래그/회전/크기 조절용)
  const [zoneRect, setZoneRect] = useState({
    center: null,      // 중심점 {lat, lng}
    width: 0.001,      // 경도 단위 너비 (약 100m)
    height: 0.001,     // 위도 단위 높이 (약 100m) 
    rotation: 0,       // 회전 각도 (도)
    isEditing: false   // 편집 모드 여부
  });
  const [isMapLocked, setIsMapLocked] = useState(true); // 지도 고정 상태 (기본: 고정)
  
  // 뒤로가기 함수
  const handleBack = useCallback(() => {
    navigate('/app/anal/ground-selection', {
      state: { selectedFile }
    });
  }, [navigate, selectedFile]);

  // 지도 고정/해제 토글
  const toggleMapLock = useCallback(() => {
    const newLockState = !isMapLocked;
    setIsMapLocked(newLockState);
    
    // 지도 객체 가져오기
    const mapContainer = document.getElementById('kakao-map');
    if (mapContainer && mapContainer._kakaoMap) {
      const map = mapContainer._kakaoMap;
      
      if (newLockState) {
        // 고정 모드로 전환: 지도 조작 비활성화, 구역 설정 활성화
        map.setDraggable(false);
        map.setZoomable(false);
      } else {
        // 해제 모드로 전환: 지도 조작 활성화, 구역 설정 비활성화
        map.setDraggable(true);
        map.setZoomable(true);
      }
    }
    
    // 구역 오버레이 표시/숨김 (CSS 클래스 사용)
    const overlay = document.querySelector('.zone-direct-overlay');
    if (overlay) {
      // CSS 클래스로 토글
      if (newLockState) {
        overlay.classList.remove('hide');
        overlay.classList.add('show');
      } else {
        overlay.classList.remove('show');
        overlay.classList.add('hide');
      }
    } else {
      // 오버레이가 없으면 새로 생성 시도
      if (newLockState && zoneRect && zoneRect.center) {
        const mapContainer = document.getElementById('kakao-map');
        if (mapContainer && mapContainer._kakaoMap) {
          createDirectDomOverlay(mapContainer._kakaoMap, zoneRect);
        }
      }
    }
  }, [isMapLocked, zoneRect]);

  // UTM 좌표를 GPS 좌표로 변환하는 함수 (한국 UTM Zone 52N)
  const utmToGps = (easting, northing, zone = 52) => {
    // UTM Zone 52N (한국) 기준 변환
    const a = 6378137; // WGS84 장축
    const f = 1 / 298.257223563; // WGS84 편평율
    const k0 = 0.9996; // UTM 척도 계수
    const e = Math.sqrt(2 * f - f * f);
    const e1sq = e * e / (1 - e * e);
    const n = f / (2 - f);
    const A = a / (1 + n) * (1 + n * n / 4 + n * n * n * n / 64);
    
    const x = easting - 500000; // False Easting 제거
    const y = northing;
    
    const M = y / k0;
    const mu = M / (A * (1 - n / 4 - 3 * n * n / 32 - 175 * n * n * n / 16384));
    
    const phi1 = mu + (3 * n / 2 - 27 * n * n * n / 32) * Math.sin(2 * mu)
                   + (21 * n * n / 16 - 55 * n * n * n * n / 32) * Math.sin(4 * mu)
                   + (151 * n * n * n / 96) * Math.sin(6 * mu)
                   + (1097 * n * n * n * n / 512) * Math.sin(8 * mu);
    
    const p1 = 1 - e * e * Math.sin(phi1) * Math.sin(phi1);
    const v1 = a / Math.sqrt(p1);
    const rho1 = a * (1 - e * e) / Math.pow(p1, 1.5);
    const T1 = Math.tan(phi1) * Math.tan(phi1);
    const D = x / (v1 * k0);
    
    // 위도 계산
    let lat = phi1 - (v1 * Math.tan(phi1) / rho1) * (D * D / 2
              - (5 + 3 * T1 + 10 * e1sq - 4 * e1sq * e1sq - 9 * e1sq * T1) * Math.pow(D, 4) / 24
              + (61 + 90 * T1 + 298 * e1sq + 45 * T1 * T1 - 252 * e1sq * T1 - 3 * e1sq * e1sq) * Math.pow(D, 6) / 720);
    
    // 경도 계산  
    let lng = (D - (1 + 2 * T1 + e1sq) * Math.pow(D, 3) / 6
              + (5 - 2 * e1sq + 28 * T1 - 3 * e1sq * e1sq + 8 * e1sq * T1 + 24 * T1 * T1) * Math.pow(D, 5) / 120) / Math.cos(phi1);
    
    // UTM Zone 52N의 중앙 경선
    const centralMeridian = (zone - 1) * 6 - 180 + 3; // Zone 52의 중앙 경선: 129도
    lng = centralMeridian + lng * 180 / Math.PI;
    lat = lat * 180 / Math.PI;
    
    const result = { lat, lng };
    
    // 결과 검증
    if (isNaN(lat) || isNaN(lng) || lat < 33 || lat > 43 || lng < 124 || lng > 132) {
      return null;
    }
    
    return result;
  };

  // 지도 타입 변경 함수
  const handleMapTypeChange = useCallback((type) => {
    setMapType(type);
    
    if (window.kakao && window.kakao.maps && window.kakao.maps.MapTypeId) {
      const mapContainer = document.getElementById('kakao-map');
      if (mapContainer && mapContainer._kakaoMap) {
        const map = mapContainer._kakaoMap;
        
        // 위성 지도인 경우 HYBRID 사용 (위성 + 라벨)
        let mapTypeId;
        if (type === 'satellite') {
          // HYBRID는 위성 이미지와 도로명/지명을 함께 표시
          mapTypeId = window.kakao.maps.MapTypeId.HYBRID;
        } else {
          mapTypeId = window.kakao.maps.MapTypeId.ROADMAP;
        }
        
        map.setMapTypeId(mapTypeId);        
        
        // 지도 타입을 강제로 유지
        map._currentMapTypeId = mapTypeId;
        
        // 지도 상호작용 재활성화
        map.setDraggable(true);
        map.setZoomable(true);
      }
    }
  }, []);

  // 줌 컨트롤 함수
  const handleZoomIn = useCallback(() => {
    const mapContainer = document.getElementById('kakao-map');
    if (mapContainer && mapContainer._kakaoMap) {
      const map = mapContainer._kakaoMap;
      const currentLevel = map.getLevel();
      const newLevel = Math.max(1, currentLevel - 1); // 최소 레벨 1
      
      map.setLevel(newLevel);
      setZoomLevel(newLevel);
      
      // 지도 상호작용 재활성화
      map.setDraggable(true);
      map.setZoomable(true);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    const mapContainer = document.getElementById('kakao-map');
    if (mapContainer && mapContainer._kakaoMap) {
      const map = mapContainer._kakaoMap;
      const currentLevel = map.getLevel();
      const newLevel = Math.min(14, currentLevel + 1); // 최대 레벨 14
      
      map.setLevel(newLevel);
      setZoomLevel(newLevel);
      
      // 지도 상호작용 재활성화
      map.setDraggable(true);
      map.setZoomable(true);
    }
  }, []);

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
        if (!isNaN(lat) && !isNaN(lng) && lat >= 33 && lat <= 43 && lng >= 124 && lng <= 132) {
          validCoords.push({ lat, lng });
        }
      }
    }
    if (validCoords.length === 0) {
      return null;
    }
    const avgLat = validCoords.reduce((sum, c) => sum + c.lat, 0) / validCoords.length;
    const avgLng = validCoords.reduce((sum, c) => sum + c.lng, 0) / validCoords.length;
    return { lat: avgLat, lng: avgLng };
  };

  // 사각형의 4개 모서리 좌표 계산 함수
  const calculateRectangleCorners = (center, width, height, rotation) => {
    if (!center) return null;
    
    // 회전 각도를 라디안으로 변환
    const rotRad = (rotation * Math.PI) / 180;
    
    // 회전하지 않은 상태의 모서리 좌표 (중심점 기준 상대 좌표)
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    const corners = [
      { x: -halfWidth, y: halfHeight },     // 왼쪽 위 (0)
      { x: halfWidth, y: halfHeight },      // 오른쪽 위 (1)
      { x: halfWidth, y: -halfHeight },     // 오른쪽 아래 (2)
      { x: -halfWidth, y: -halfHeight }     // 왼쪽 아래 (3)
    ];
    
    // 회전 변환 적용하여 실제 좌표 계산
    const rotatedCorners = corners.map(corner => {
      const rotatedX = corner.x * Math.cos(rotRad) - corner.y * Math.sin(rotRad);
      const rotatedY = corner.x * Math.sin(rotRad) + corner.y * Math.cos(rotRad);
      
      return {
        lat: center.lat + rotatedY,
        lng: center.lng + rotatedX
      };
    });
    
    return rotatedCorners;
  };

  // 모서리를 드래그했을 때 직사각형을 유지하면서 업데이트하는 함수
  const updateRectangleFromCornerDrag = (cornerIndex, newPosition, currentRect) => {
    const corners = calculateRectangleCorners(currentRect.center, currentRect.width, currentRect.height, currentRect.rotation);
    if (!corners) return currentRect;

    // 대각선 반대편 모서리 인덱스
    const oppositeIndex = (cornerIndex + 2) % 4;
    const oppositeCorner = corners[oppositeIndex];
    
    // 인접한 두 모서리 인덱스
    const adjacentIndex1 = (cornerIndex + 1) % 4;
    const adjacentIndex2 = (cornerIndex + 3) % 4;
    
    // 새로운 중심점 (드래그한 점과 대각선 반대편의 중점)
    const newCenter = {
      lat: (newPosition.lat + oppositeCorner.lat) / 2,
      lng: (newPosition.lng + oppositeCorner.lng) / 2
    };
    
    // 기존 회전 각도를 라디안으로
    const rotRad = currentRect.rotation * Math.PI / 180;
    
    // 드래그한 점과 대각선 반대편 점 사이의 벡터
    const dx = newPosition.lng - oppositeCorner.lng;
    const dy = newPosition.lat - oppositeCorner.lat;
    
    // 회전 역변환하여 로컬 좌표계에서의 거리 계산
    const localX = dx * Math.cos(-rotRad) - dy * Math.sin(-rotRad);
    const localY = dx * Math.sin(-rotRad) + dy * Math.cos(-rotRad);
    
    // 새로운 너비와 높이 (절댓값 사용)
    const newWidth = Math.abs(localX);
    const newHeight = Math.abs(localY);
    
    return {
      center: newCenter,
      width: newWidth,
      height: newHeight,
      rotation: currentRect.rotation, // 회전 각도는 유지
      isEditing: true
    };
  };

  // 크기 조절 이벤트 추가 함수
  function addResizeEvent(handle, position, box, map) {
    let isDragging = false;
    let startX, startY;
    let startBoxRect;
    let currentRotation = 0;
    
    const onMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      
      // 현재 회전 각도 가져오기
      const transform = box.style.transform || '';
      const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
      currentRotation = rotateMatch ? parseFloat(rotateMatch[1]) : 0;
      
      // 박스의 현재 위치와 크기 저장
      const boxRect = box.getBoundingClientRect();
      startBoxRect = {
        left: parseInt(box.style.left),
        top: parseInt(box.style.top),
        width: parseInt(box.style.width),
        height: parseInt(box.style.height),
        centerX: parseInt(box.style.left) + parseInt(box.style.width) / 2,
        centerY: parseInt(box.style.top) + parseInt(box.style.height) / 2
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      
      // 커서 스타일 적용
      document.body.style.cursor = handle.style.cursor;
    };
    
    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // 회전 각도를 라디안으로 변환
      const rotationRad = (currentRotation * Math.PI) / 180;
      
      // 회전된 좌표계에서의 델타 계산
      const rotatedDeltaX = deltaX * Math.cos(-rotationRad) - deltaY * Math.sin(-rotationRad);
      const rotatedDeltaY = deltaX * Math.sin(-rotationRad) + deltaY * Math.cos(-rotationRad);
      
      let newWidth = startBoxRect.width;
      let newHeight = startBoxRect.height;
      let newCenterX = startBoxRect.centerX;
      let newCenterY = startBoxRect.centerY;
      
      // 회전을 고려한 크기 조절 로직
      switch(position) {
        case 'tl': // 왼쪽 위
          newWidth = startBoxRect.width - rotatedDeltaX;
          newHeight = startBoxRect.height - rotatedDeltaY;
          newCenterX = startBoxRect.centerX + rotatedDeltaX / 2;
          newCenterY = startBoxRect.centerY + rotatedDeltaY / 2;
          break;
        case 'tr': // 오른쪽 위
          newWidth = startBoxRect.width + rotatedDeltaX;
          newHeight = startBoxRect.height - rotatedDeltaY;
          newCenterX = startBoxRect.centerX + rotatedDeltaX / 2;
          newCenterY = startBoxRect.centerY + rotatedDeltaY / 2;
          break;
        case 'bl': // 왼쪽 아래
          newWidth = startBoxRect.width - rotatedDeltaX;
          newHeight = startBoxRect.height + rotatedDeltaY;
          newCenterX = startBoxRect.centerX + rotatedDeltaX / 2;
          newCenterY = startBoxRect.centerY + rotatedDeltaY / 2;
          break;
        case 'br': // 오른쪽 아래
          newWidth = startBoxRect.width + rotatedDeltaX;
          newHeight = startBoxRect.height + rotatedDeltaY;
          newCenterX = startBoxRect.centerX + rotatedDeltaX / 2;
          newCenterY = startBoxRect.centerY + rotatedDeltaY / 2;
          break;
      }
      
      // 최소 크기 제한
      const minSize = 30;
      const clampedWidth = Math.max(minSize, newWidth);
      const clampedHeight = Math.max(minSize, newHeight);
      
      // 최소 크기 이하로 가려는 경우, 중심 이동 보정 없이 크기만 클램프 (박스 이동 방지)
      if (clampedWidth !== newWidth || clampedHeight !== newHeight) {
        newWidth = clampedWidth;
        newHeight = clampedHeight;
        // 중심점 유지: newCenterX/Y는 변경하지 않음
      }
      
      // 새로운 위치 계산 (중심점 기준)
      const newLeft = newCenterX - newWidth / 2;
      const newTop = newCenterY - newHeight / 2;
      
      // 박스 스타일 업데이트 (회전 유지)
      box.style.left = `${newLeft}px`;
      box.style.top = `${newTop}px`;
      box.style.width = `${newWidth}px`;
      box.style.height = `${newHeight}px`;
      box.style.transform = `rotate(${currentRotation}deg)`;

    };
    
    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';

      // 회전 핸들 위치 업데이트
      updateRotateHandlePosition(box);
      
      // GPS 좌표 업데이트
      updateZoneCoordinates(box, map);
    };
    
    handle.addEventListener('mousedown', onMouseDown);
    
    // 터치 이벤트도 추가
    handle.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      onMouseDown({
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation(),
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    });
  }

  // 박스 이동 이벤트 추가 함수
  function addMoveEvent(box, map) {
    let isDragging = false;
    let startX, startY;
    let startLeft, startTop;
    
    const onMouseDown = (e) => {
      // 핸들이나 회전 핸들을 클릭한 경우 이동하지 않음
      if (e.target.classList.contains('zone-handle-direct') || 
          e.target.classList.contains('rotate-handle-direct')) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(box.style.left);
      startTop = parseInt(box.style.top);

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      
      // 커서 스타일 적용
      document.body.style.cursor = 'move';
    };
    
    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newLeft = startLeft + deltaX;
      const newTop = startTop + deltaY;
      
      // 박스 위치 업데이트
      box.style.left = `${newLeft}px`;
      box.style.top = `${newTop}px`;
    };
    
    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';

      // 회전 핸들 위치 업데이트
      updateRotateHandlePosition(box);
      
      // GPS 좌표 업데이트
      updateZoneCoordinates(box, map);
    };
    
    box.addEventListener('mousedown', onMouseDown);
    
    // 터치 이벤트도 추가
    box.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      onMouseDown({
        target: e.target,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation(),
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    });
  }

  // 회전 이벤트 추가 함수
  function addRotateEvent(rotateHandle, box, map) {
    let isDragging = false;
    let startAngle = 0;
    let currentRotation = 0;
    
    const getAngle = (centerX, centerY, pointX, pointY) => {
      const deltaX = pointX - centerX;
      const deltaY = pointY - centerY;
      return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    };
    
    const onMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      isDragging = true;
      
      // 박스 중심점 계산
      const boxRect = box.getBoundingClientRect();
      const centerX = boxRect.left + boxRect.width / 2;
      const centerY = boxRect.top + boxRect.height / 2;
      
      // 시작 각도 계산
      startAngle = getAngle(centerX, centerY, e.clientX, e.clientY);

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      
      // 커서 스타일 적용
      document.body.style.cursor = 'grabbing';
      rotateHandle.style.cursor = 'grabbing';
    };
    
    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      // 박스 중심점 계산
      const boxRect = box.getBoundingClientRect();
      const centerX = boxRect.left + boxRect.width / 2;
      const centerY = boxRect.top + boxRect.height / 2;
      
      // 현재 각도 계산
      const currentAngle = getAngle(centerX, centerY, e.clientX, e.clientY);
      const deltaAngle = currentAngle - startAngle;
      
      // 새로운 회전 각도
      const newRotation = currentRotation + deltaAngle;
      
      // 박스에 회전 적용
      box.style.transform = `rotate(${newRotation}deg)`;

    };
    
    const onMouseUp = () => {
      isDragging = false;
      
      // 최종 회전 각도 저장
      const transform = box.style.transform;
      const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
      if (rotateMatch) {
        currentRotation = parseFloat(rotateMatch[1]);
      }
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      // 커서 스타일 복원
      document.body.style.cursor = '';
      rotateHandle.style.cursor = 'grab';

      // 회전 핸들 위치 업데이트
      updateRotateHandlePosition(box);
      
      // GPS 좌표 업데이트
      updateZoneCoordinates(box, map);
    };
    
    rotateHandle.addEventListener('mousedown', onMouseDown);
    
    // 터치 이벤트도 추가
    rotateHandle.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      onMouseDown({
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation(),
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    });
  }

  // 회전 핸들 위치 업데이트 함수
  function updateRotateHandlePosition(box) {
    const rotateHandle = box.querySelector('.rotate-handle-direct');
    if (rotateHandle) {
      // 박스 높이에 따라 회전 핸들 위치 조정
      const boxHeight = parseInt(box.style.height);
      const handleOffset = Math.max(50, boxHeight * 0.3); // 최소 50px, 박스 높이의 30%
      rotateHandle.style.top = `-${handleOffset}px`;
    }
  }

  // GPS 좌표 업데이트 함수
  function updateZoneCoordinates(box, map) {
    try {
      const projection = map.getProjection();
      
      // 박스의 픽셀 위치와 크기
      const left = parseInt(box.style.left);
      const top = parseInt(box.style.top);
      const width = parseInt(box.style.width);
      const height = parseInt(box.style.height);
      
      // 박스 중심점 픽셀 좌표
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      // 픽셀을 GPS 좌표로 변환
      const centerGPS = projection.coordsFromContainerPoint(new window.kakao.maps.Point(centerX, centerY));
      
      // 회전 각도 추출
      const transform = box.style.transform || '';
      const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
      const rotation = rotateMatch ? parseFloat(rotateMatch[1]) : 0;
      
      // GPS 단위로 크기 계산 (대략적)
      const leftGPS = projection.coordsFromContainerPoint(new window.kakao.maps.Point(left, centerY));
      const rightGPS = projection.coordsFromContainerPoint(new window.kakao.maps.Point(left + width, centerY));
      const topGPS = projection.coordsFromContainerPoint(new window.kakao.maps.Point(centerX, top));
      const bottomGPS = projection.coordsFromContainerPoint(new window.kakao.maps.Point(centerX, top + height));
      
      const gpsWidth = Math.abs(rightGPS.getLng() - leftGPS.getLng());
      const gpsHeight = Math.abs(bottomGPS.getLat() - topGPS.getLat());
      
      // zoneRect 업데이트
      const newZoneRect = {
        center: {
          lat: centerGPS.getLat(),
          lng: centerGPS.getLng()
        },
        width: gpsWidth,
        height: gpsHeight,
        rotation: rotation,
        isEditing: true
      };
      
      setZoneRect(newZoneRect);

    } catch (error) {
      // GPS 좌표 업데이트 실패
    }
  }

  // 간단한 오버레이 방식
  function createDirectDomOverlay(map, rect) {
    // 기존 오버레이 제거
    const mapContainer = document.getElementById('kakao-map');
    if (!mapContainer) {
      return;
    }
    
    const existingOverlay = mapContainer.querySelector('.zone-direct-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // 새 오버레이 생성 (지도 전체를 덮는 방식)
    const overlay = document.createElement('div');
    overlay.className = isMapLocked ? 'zone-direct-overlay show' : 'zone-direct-overlay hide';
    overlay.style.position = 'absolute';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none'; // 오버레이 자체는 이벤트 무시, 박스만 이벤트 처리
    overlay.style.zIndex = '99999';
    overlay.style.backgroundColor = 'transparent'; // 투명 배경

    // 지도 컨테이너에 추가
    mapContainer.appendChild(overlay);

    // 고정 크기 사용 (간단하게)
    const widthPx = 200;
    const heightPx = 150;
    
    // 지도 중심에서 박스 위치 계산
    const projection = map.getProjection();
    const centerLL = new window.kakao.maps.LatLng(rect.center.lat, rect.center.lng);
    const centerPt = projection.containerPointFromCoords(centerLL);
    
    const boxLeft = centerPt.x - widthPx / 2;
    const boxTop = centerPt.y - heightPx / 2;

    // 실제 조작 가능한 박스 생성
    const box = document.createElement('div');
    box.className = 'zone-box-direct';
    box.style.position = 'absolute';
    box.style.width = `${widthPx}px`;
    box.style.height = `${heightPx}px`;
    box.style.border = '4px solid #FF0000'; // 빨간색으로 눈에 잘 띄게
    box.style.background = 'rgba(255,0,0,0.3)'; // 빨간 반투명 (더 진하게)
    box.style.borderRadius = '6px';
    box.style.cursor = 'move';
    box.style.pointerEvents = 'auto';
    box.style.zIndex = '100000';
    box.style.transformOrigin = 'center center';
    box.style.touchAction = 'none';
    box.style.boxShadow = '0 4px 12px rgba(255,0,0,0.8)';
    box.style.left = `${boxLeft}px`;
    box.style.top = `${boxTop}px`;

    overlay.appendChild(box);
    
    // 전역 변수로 저장하여 외부에서 접근 가능하도록
    window.currentZoneBox = box;
    window.currentZoneOverlay = overlay;
    
    // 박스 위치 설정
    box.style.left = `${boxLeft}px`;
    box.style.top = `${boxTop}px`;
    
    // 모서리 핸들 생성
    const createHandle = (position, cursor) => {
      const handle = document.createElement('div');
      handle.className = `zone-handle-direct ${position}`;
      handle.style.position = 'absolute';
      handle.style.width = '24px';
      handle.style.height = '24px';
      handle.style.background = '#FFFFFF'; // 흰색 배경
      handle.style.border = '3px solid #079669'; // 초록 테두리
      handle.style.borderRadius = '50%';
      handle.style.cursor = cursor;
      handle.style.pointerEvents = 'auto';
      handle.style.zIndex = '100000';
      handle.style.boxShadow = '0 4px 12px rgba(7, 150, 105, 0.35)';
      handle.style.touchAction = 'none';
      handle.style.display = 'block';
      handle.style.visibility = 'visible';
      handle.style.opacity = '1';

      // 위치 설정
      switch(position) {
        case 'tl':
          handle.style.left = '-12px';
          handle.style.top = '-12px';
          break;
        case 'tr':
          handle.style.right = '-12px';
          handle.style.top = '-12px';
          break;
        case 'bl':
          handle.style.left = '-12px';
          handle.style.bottom = '-12px';
          break;
        case 'br':
          handle.style.right = '-12px';
          handle.style.bottom = '-12px';
          break;
      }

      // 드래그 이벤트 추가
      addResizeEvent(handle, position, box, map);

      box.appendChild(handle);
      
      return handle;
    };
    
    const handleTL = createHandle('tl', 'nwse-resize');
    const handleTR = createHandle('tr', 'nesw-resize');
    const handleBL = createHandle('bl', 'nesw-resize');
    const handleBR = createHandle('br', 'nwse-resize');
    
    // 박스 이동 이벤트 추가
    addMoveEvent(box, map);
    
    // 회전 핸들 생성 (녹색 원)
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'rotate-handle-direct';
    rotateHandle.style.position = 'absolute';
    rotateHandle.style.width = '36px';
    rotateHandle.style.height = '36px';
    rotateHandle.style.background = '#FFFFFF'; // 흰색 배경
    rotateHandle.style.border = '2px solid #079669'; // 초록 테두리
    rotateHandle.style.borderRadius = '50%';
    rotateHandle.style.cursor = 'grab';
    rotateHandle.style.pointerEvents = 'auto';
    rotateHandle.style.zIndex = '100001';
    rotateHandle.style.left = '50%';
    rotateHandle.style.top = '-50px';
    rotateHandle.style.transform = 'translateX(-50%)';
    rotateHandle.style.boxShadow = '0 4px 12px rgba(7, 150, 105, 0.35)';
    rotateHandle.style.backgroundImage = 'url("../../../assets/main_icons/refresh_black.png")';
    rotateHandle.style.backgroundRepeat = 'no-repeat';
    rotateHandle.style.backgroundPosition = 'center';
    rotateHandle.style.backgroundSize = '18px 18px';
    rotateHandle.style.touchAction = 'none';
    rotateHandle.style.display = 'block';
    rotateHandle.style.visibility = 'visible';
    rotateHandle.style.opacity = '1';
    
    // 회전 이벤트 추가
    addRotateEvent(rotateHandle, box, map);
    
    box.appendChild(rotateHandle);
    
    // 상태 저장
    let currentRect = { ...rect };
    
    // 위치 및 크기 업데이트 함수
    const updateBoxTransform = () => {
      const projection = map.getProjection();
      const centerLL = new window.kakao.maps.LatLng(currentRect.center.lat, currentRect.center.lng);
      const centerPt = projection.containerPointFromCoords(centerLL);
      
      let widthPx = 150;
      let heightPx = 200;
      
      try {
        const halfWLL = new window.kakao.maps.LatLng(currentRect.center.lat, currentRect.center.lng + currentRect.width / 2);
        const halfHLL = new window.kakao.maps.LatLng(currentRect.center.lat + currentRect.height / 2, currentRect.center.lng);
        const halfWPt = projection.containerPointFromCoords(halfWLL);
        const halfHPt = projection.containerPointFromCoords(halfHLL);
        
        const calculatedWidth = Math.abs(halfWPt.x - centerPt.x) * 2;
        const calculatedHeight = Math.abs(halfHPt.y - centerPt.y) * 2;
        
        if (calculatedWidth > 10 && calculatedWidth < 5000) {
          widthPx = calculatedWidth;
        }
        if (calculatedHeight > 10 && calculatedHeight < 5000) {
          heightPx = calculatedHeight;
        }
      } catch (error) {
        // 크기 계산 실패
      }
      
      widthPx = Math.max(100, Math.min(500, widthPx));
      heightPx = Math.max(120, Math.min(600, heightPx));
      
      box.style.width = `${widthPx}px`;
      box.style.height = `${heightPx}px`;
      box.style.left = `${centerPt.x - widthPx/2}px`;
      box.style.top = `${centerPt.y - heightPx/2}px`;
      box.style.transform = `rotate(${currentRect.rotation || 0}deg)`;
    };
    
    updateBoxTransform();
    
    // 지도 이동/줌 시 위치 업데이트
    window.kakao.maps.event.addListener(map, 'center_changed', updateBoxTransform);
    window.kakao.maps.event.addListener(map, 'zoom_changed', updateBoxTransform);
    
    // 통합 드래그 이벤트 (마우스 + 터치) - 회전 고려
    const handleBoxDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isTouch = e.type === 'touchstart';
      const startMouseX = isTouch ? e.touches[0].clientX : e.clientX;
      const startMouseY = isTouch ? e.touches[0].clientY : e.clientY;
      const mapRect = mapContainer.getBoundingClientRect();
      
      // 박스의 현재 중심점 (CSS left, top은 회전 중심이므로 정확함)
      const boxWidth = parseFloat(box.style.width);
      const boxHeight = parseFloat(box.style.height);
      const boxLeft = parseFloat(box.style.left);
      const boxTop = parseFloat(box.style.top);
      const boxCenterX = boxLeft + boxWidth / 2;
      const boxCenterY = boxTop + boxHeight / 2;
      
      // 마우스 클릭 위치 (맵 컨테이너 기준)
      const mouseX = startMouseX - mapRect.left;
      const mouseY = startMouseY - mapRect.top;
      
      // 박스 중심점과 클릭 위치 사이의 오프셋 (회전과 무관)
      const offsetX = mouseX - boxCenterX;
      const offsetY = mouseY - boxCenterY;
      
      // 드래그 중 플래그
      let isDragging = true;
      
      // 편집 중에는 지도 드래그 잠시 비활성화
      try { map.setDraggable(false); } catch (_) {}
      
      const onMove = (moveEvent) => {
        if (!isDragging) return; // 드래그 중이 아니면 무시
        
        moveEvent.preventDefault();
        moveEvent.stopPropagation();
        
        const clientX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const clientY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;
        
        // 현재 마우스 위치 (맵 컨테이너 기준)
        const currentMouseX = clientX - mapRect.left;
        const currentMouseY = clientY - mapRect.top;
        
        // 새로운 박스 중심점 = 마우스 위치 - 오프셋
        const newCenterX = currentMouseX - offsetX;
        const newCenterY = currentMouseY - offsetY;
        
        // 박스 왼쪽 위 위치 계산
        const newLeft = newCenterX - boxWidth / 2;
        const newTop = newCenterY - boxHeight / 2;
        
        box.style.left = `${newLeft}px`;
        box.style.top = `${newTop}px`;
        
        // 지도 좌표로 변환 (박스 중심점)
        const point = new window.kakao.maps.Point(newCenterX, newCenterY);
        const latlng = map.getProjection().coordsFromContainerPoint(point);
        
        currentRect = {
          ...currentRect,
          center: { lat: latlng.getLat(), lng: latlng.getLng() }
        };
        setZoneRect(currentRect);
      };
      
      const onUp = (upEvent) => {
        isDragging = false; // 드래그 종료 플래그
        
        // 이벤트 리스너 즉시 제거
        if (isTouch) {
          document.removeEventListener('touchmove', onMove, { passive: false });
          document.removeEventListener('touchend', onUp);
          document.removeEventListener('touchcancel', onUp);
        } else {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        
        // 드래그 종료 후 지도 드래그 재활성화
        try { map.setDraggable(true); } catch (_) {}
      };
      
      // 이벤트 리스너 등록
      if (isTouch) {
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onUp);
        document.addEventListener('touchcancel', onUp); // 터치 취소 시에도 종료
      } else {
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }
    };
    
    box.addEventListener('mousedown', handleBoxDrag);
    box.addEventListener('touchstart', handleBoxDrag, { passive: false });
    
    // 드래그 핸들러를 전역 변수로 저장 (함수 정의 후)
    window.currentBoxDragHandler = handleBoxDrag;
    
    // 모서리 핸들 드래그 이벤트 - 업계 표준 Transform 방식
    const addCornerDragEvent = (handle, cornerType) => {
      // 드래그 중인지 확인하는 플래그
      let isDragging = false;
      
      const handleCornerDrag = (e) => {
        // 이미 드래그 중이면 무시
        if (isDragging) return;
        
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        
        const isTouch = e.type === 'touchstart';
        const startMouseX = isTouch ? e.touches[0].clientX : e.clientX;
        const startMouseY = isTouch ? e.touches[0].clientY : e.clientY;
        
        // 현재 박스 상태를 직접 스타일에서 가져오기
        const startWidth = parseFloat(box.style.width);
        const startHeight = parseFloat(box.style.height);
        const startLeft = parseFloat(box.style.left);
        const startTop = parseFloat(box.style.top);
        
        const rotation = (currentRect.rotation || 0) * Math.PI / 180;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        
        // 박스 중심점 (맵 컨테이너 기준)
        const boxCenterX = startLeft + startWidth / 2;
        const boxCenterY = startTop + startHeight / 2;
        
        // 회전 행렬로 모든 코너 위치 계산
        const halfW = startWidth / 2;
        const halfH = startHeight / 2;
        
        const corners = {
          tl: {
            x: boxCenterX - halfW * cos + halfH * sin,
            y: boxCenterY - halfW * sin - halfH * cos
          },
          tr: {
            x: boxCenterX + halfW * cos + halfH * sin,
            y: boxCenterY + halfW * sin - halfH * cos
          },
          bl: {
            x: boxCenterX - halfW * cos - halfH * sin,
            y: boxCenterY - halfW * sin + halfH * cos
          },
          br: {
            x: boxCenterX + halfW * cos - halfH * sin,
            y: boxCenterY + halfW * sin + halfH * cos
          }
        };
        
        // 대각선 반대편 고정점
        const oppositeMap = { tl: 'br', tr: 'bl', bl: 'tr', br: 'tl' };
        const anchorPoint = corners[oppositeMap[cornerType]];
        const anchorX = anchorPoint.x;
        const anchorY = anchorPoint.y;
        
        // 드래그 시작점과 초기 핸들 위치의 오프셋 계산
        const mapContainer = map.getNode();
        const mapRect = mapContainer.getBoundingClientRect();
        const startHandleX = corners[cornerType].x;
        const startHandleY = corners[cornerType].y;
        const offsetX = (startMouseX - mapRect.left) - startHandleX;
        const offsetY = (startMouseY - mapRect.top) - startHandleY;
        
        // 편집 중에는 지도 드래그 잠시 비활성화
        try { map.setDraggable(false); } catch (_) {}
        const onMove = (moveEvent) => {
          if (!isDragging) return; // 드래그 중이 아니면 무시
          
          moveEvent.preventDefault();
          moveEvent.stopPropagation();
          
          const clientX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
          const clientY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;
          
          // 마우스 위치를 맵 컨테이너 기준 좌표로 변환 (오프셋 적용)
          const mouseX = clientX - mapRect.left - offsetX;
          const mouseY = clientY - mapRect.top - offsetY;
          
          // 새 중심점은 고정점과 현재 마우스 위치의 중점
          const newCenterX = (anchorX + mouseX) / 2;
          const newCenterY = (anchorY + mouseY) / 2;
          
          // 고정점에서 마우스까지의 벡터
          const deltaX = mouseX - anchorX;
          const deltaY = mouseY - anchorY;
          
          // 회전의 역변환을 적용하여 박스의 로컬 좌표계에서의 크기 계산
          const localDeltaX = deltaX * cos + deltaY * sin;
          const localDeltaY = -deltaX * sin + deltaY * cos;
          
          // 새로운 크기 (절댓값)
          let newWidth = Math.abs(localDeltaX);
          let newHeight = Math.abs(localDeltaY);
          
          // 최소 크기 보장
          newWidth = Math.max(30, newWidth);
          newHeight = Math.max(20, newHeight);
          
          // 크기가 음수일 때를 고려한 실제 중심점 조정
          let actualCenterX = newCenterX;
          let actualCenterY = newCenterY;
          
          if (localDeltaX < 0 || localDeltaY < 0) {
            // 음수일 때 중심점 재계산
            const signX = localDeltaX >= 0 ? 1 : -1;
            const signY = localDeltaY >= 0 ? 1 : -1;
            
            const adjustedLocalX = signX * newWidth / 2;
            const adjustedLocalY = signY * newHeight / 2;
            
            // 로컬 좌표를 다시 글로벌 좌표로 변환
            const adjustedGlobalX = adjustedLocalX * cos - adjustedLocalY * sin;
            const adjustedGlobalY = adjustedLocalX * sin + adjustedLocalY * cos;
            
            actualCenterX = anchorX + adjustedGlobalX;
            actualCenterY = anchorY + adjustedGlobalY;
          }
          
          // 박스 위치 및 크기 업데이트
          const newLeft = actualCenterX - newWidth / 2;
          const newTop = actualCenterY - newHeight / 2;
          
          box.style.width = `${newWidth}px`;
          box.style.height = `${newHeight}px`;
          box.style.left = `${newLeft}px`;
          box.style.top = `${newTop}px`;
          
          // 핸들 위치 업데이트
          const updateHandlePositions = () => {
            handleTL.style.left = '-8px';
            handleTL.style.top = '-8px';
            
            handleTR.style.right = '-8px';
            handleTR.style.top = '-8px';
            
            handleBL.style.left = '-8px';
            handleBL.style.bottom = '-8px';
            
            handleBR.style.right = '-8px';
            handleBR.style.bottom = '-8px';
            
            // 회전 핸들도 업데이트
            rotateHandle.style.left = '50%';
            rotateHandle.style.top = '-30px';
            rotateHandle.style.transform = 'translateX(-50%)';
          };
          
          updateHandlePositions();
          
          // GPS 좌표 업데이트
          const centerPoint = new window.kakao.maps.Point(actualCenterX, actualCenterY);
          const proj = map.getProjection();
          const centerLatLng = proj.coordsFromContainerPoint(centerPoint);
          // 픽셀 -> 경위도 변환으로 width/height 계산
          const leftPt = new window.kakao.maps.Point(actualCenterX - newWidth / 2, actualCenterY);
          const rightPt = new window.kakao.maps.Point(actualCenterX + newWidth / 2, actualCenterY);
          const topPt = new window.kakao.maps.Point(actualCenterX, actualCenterY - newHeight / 2);
          const bottomPt = new window.kakao.maps.Point(actualCenterX, actualCenterY + newHeight / 2);
          const leftLL = proj.coordsFromContainerPoint(leftPt);
          const rightLL = proj.coordsFromContainerPoint(rightPt);
          const topLL = proj.coordsFromContainerPoint(topPt);
          const bottomLL = proj.coordsFromContainerPoint(bottomPt);
          const widthDeg = Math.abs(rightLL.getLng() - leftLL.getLng());
          const heightDeg = Math.abs(bottomLL.getLat() - topLL.getLat());
          
          currentRect = {
            ...currentRect,
            center: { lat: centerLatLng.getLat(), lng: centerLatLng.getLng() },
            width: widthDeg,
            height: heightDeg
          };
          
          setZoneRect(currentRect);
        };
        
        const onUp = () => {
          isDragging = false; // 드래그 종료 플래그
          
          // 이벤트 리스너 즉시 제거
          if (isTouch) {
            document.removeEventListener('touchmove', onMove, { passive: false });
            document.removeEventListener('touchend', onUp);
            document.removeEventListener('touchcancel', onUp);
          } else {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
          }
          
          // 드래그 종료 후 지도 드래그 재활성화
          try { map.setDraggable(true); } catch (_) {}
        };
        
        // 이벤트 리스너 등록
        if (isTouch) {
          document.addEventListener('touchmove', onMove, { passive: false });
          document.addEventListener('touchend', onUp);
          document.addEventListener('touchcancel', onUp); // 터치 취소 시에도 종료
        } else {
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        }
      };
      
      handle.addEventListener('mousedown', handleCornerDrag);
      handle.addEventListener('touchstart', handleCornerDrag, { passive: false });
    };
    
    addCornerDragEvent(handleTL, 'tl');
    addCornerDragEvent(handleTR, 'tr');
    addCornerDragEvent(handleBL, 'bl');
    addCornerDragEvent(handleBR, 'br');
    
    // 회전 핸들 드래그 이벤트
    const handleRotateDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isTouch = e.type === 'touchstart';
      
      // 박스 중심점 계산 (맵 컨테이너 기준)
      const currentWidth = parseFloat(box.style.width);
      const currentHeight = parseFloat(box.style.height);
      const currentLeft = parseFloat(box.style.left);
      const currentTop = parseFloat(box.style.top);
      
      const mapContainer = map.getNode();
      const mapRect = mapContainer.getBoundingClientRect();
      
      const centerX = mapRect.left + currentLeft + currentWidth / 2;
      const centerY = mapRect.top + currentTop + currentHeight / 2;
      
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;
      const startAngle = Math.atan2(clientY - centerY, clientX - centerX);
      const startRotation = currentRect.rotation || 0;
      
      // 드래그 중 플래그
      let isRotating = true;
      
      // 편집 중에는 지도 드래그 잠시 비활성화
      try { map.setDraggable(false); } catch (_) {}
      
      const onMove = (moveEvent) => {
        if (!isRotating) return; // 회전 중이 아니면 무시
        
        moveEvent.preventDefault();
        moveEvent.stopPropagation();
        
        const moveClientX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const moveClientY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;
        const currentAngle = Math.atan2(moveClientY - centerY, moveClientX - centerX);
        const deltaAngle = (currentAngle - startAngle) * 180 / Math.PI;
        const newRotation = (startRotation + deltaAngle + 360) % 360;
        
        box.style.transform = `rotate(${newRotation}deg)`;
        currentRect.rotation = newRotation;
        setZoneRect({ ...currentRect });
      };
      
      const onUp = () => {
        isRotating = false; // 회전 종료 플래그
        
        // 이벤트 리스너 즉시 제거
        if (isTouch) {
          document.removeEventListener('touchmove', onMove, { passive: false });
          document.removeEventListener('touchend', onUp);
          document.removeEventListener('touchcancel', onUp);
        } else {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        
        // 드래그 종료 후 지도 드래그 재활성화
        try { map.setDraggable(true); } catch (_) {}
      };
      
      // 이벤트 리스너 등록
      if (isTouch) {
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onUp);
        document.addEventListener('touchcancel', onUp); // 터치 취소 시에도 종료
      } else {
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }
    };
    
    rotateHandle.addEventListener('mousedown', handleRotateDrag);
    rotateHandle.addEventListener('touchstart', handleRotateDrag, { passive: false });

    return { overlay, box, handles: { handleTL, handleTR, handleBL, handleBR, rotateHandle } };
  }

  // 파일 분석하여 주요 활동 지점 찾기 (upload_code 사용)
  const analyzeFileDataRaw = async () => {
    if (!selectedFile) {
      return null;
    }

    try {
      // Upload 모델 사용: upload_code로 파일 다운로드
      const uploadCode = selectedFile.upload_code || selectedFile.rawData?.upload_code;
      if (!uploadCode) {
        return null;
      }

      // 1단계: 다운로드 URL 가져오기
      const urlResponse = await client.get('/api/user/file-download/', {
        params: { upload_code: uploadCode }
      });

      if (!urlResponse.data || !urlResponse.data.s3_key) {
        return null;
      }
      
      // 2단계: 백엔드 프록시를 통해 파일 내용 가져오기
      let s3Key = urlResponse.data.s3_key;
      
      // player/edit 경로를 player/raw로 변경
      if (s3Key.includes('player/edit')) {
        s3Key = s3Key.replace('player/edit', 'player/raw');
      } else if (!s3Key.includes('player/raw')) {
        // edit이 없으면 player/raw 경로 추가
        s3Key = s3Key.replace(/\/([^\/]+)$/, '/player/raw/$1');
      }

      const response = await GetS3RawFileContentApi(s3Key);

      // API 응답에서 content 필드 추출
      const fileContentString = response.data.content;
      
      if (!fileContentString) {
        return null;
      }
      
      // 파일 내용을 줄 단위로 분할하고 파싱
      const lines = fileContentString.split('\n').filter(line => line.trim());
      
      const fileContent = [];
      
      // 파일 형식 자동 감지
      const firstLine = lines[0]?.trim() || '';
      const isCSV = firstLine.includes(',');
      const isTXT = firstLine.includes('/');

      // 성능 개선: 10개씩 건너뛰어서 처리
      const skipInterval = 10;
      
      for (let index = 0; index < lines.length; index += skipInterval) {
        const line = lines[index];
        if (!line.trim()) continue;
        
        try {
          let parts;
          let lat, lng;
          
          if (isCSV) {
            // CSV 형식: device_id,time,latitude,longitude
            parts = line.trim().split(',');
            
            // 헤더 줄 건너뛰기
            if (index === 0 && (parts[0] === 'device_id' || parts[2] === 'latitude')) {
              continue;
            }
            
            if (parts.length >= 4) {
              // CSV: parts[2] = latitude, parts[3] = longitude
              lat = parseFloat(parts[2]);
              lng = parseFloat(parts[3]);
            }
          } else {
            // TXT 슬래시 형식: 007/timestamp/lat/lng
            parts = line.trim().split('/');
            
            if (parts.length >= 4) {
              // parts[2]와 parts[3] 값 확인
              const val2 = parseFloat(parts[2]);
              const val3 = parseFloat(parts[3]);
              
              // 위도는 일반적으로 37.x (서울 기준), 경도는 127.x
              // 값의 범위로 위도/경도 구분
              if (val2 >= 33 && val2 <= 43 && val3 >= 124 && val3 <= 132) {
                // parts[2] = 위도, parts[3] = 경도
                lat = val2;
                lng = val3;
              } else if (val3 >= 33 && val3 <= 43 && val2 >= 124 && val2 <= 132) {
                // parts[2] = 경도, parts[3] = 위도 (순서가 바뀐 경우)
                lat = val3;
                lng = val2;
              } else {
                // 범위를 벗어나는 경우 스킵
                continue;
              }
            }
          }
          
          // 최종 검증 (한국 좌표 범위)
          if (!isNaN(lat) && !isNaN(lng) && 
              lat >= 33 && lat <= 43 && 
              lng >= 124 && lng <= 132) {
            fileContent.push({ lat, lng });
          }
        } catch (error) {
          // 파싱 오류 무시
        }
      }

      if (fileContent && fileContent.length > 0) {
        // 파일의 평균 좌표 계산 (이미 위도, 경도 형태)
        let totalLat = 0;
        let totalLng = 0;
        let validPoints = 0;
        
        fileContent.forEach((point, index) => {
          if (point.lat && point.lng && !isNaN(point.lat) && !isNaN(point.lng)) {
            totalLat += parseFloat(point.lat);
            totalLng += parseFloat(point.lng);
            validPoints++;
          }
        });
        
        if (validPoints > 0) {
          const avgLat = totalLat / validPoints;  // 평균 위도
          const avgLng = totalLng / validPoints;  // 평균 경도
          
          const gpsCoords = { lat: avgLat, lng: avgLng };

          // 한국 좌표 범위 재검증
          if (gpsCoords.lat >= 33 && gpsCoords.lat <= 43 && 
              gpsCoords.lng >= 124 && gpsCoords.lng <= 132) {
            return gpsCoords;
          } else {
            return null;
          }
        }
      }
    } catch (error) {
      return null;
    }
    
    return null;
  };

  // 카카오맵 API 키 가져오기 및 스크립트 로드
  const loadKakaoMap = async () => {
    try {
      let apiKey;
      try {
        const response = await GetKakaoMapKeyApi();
        apiKey = response.data.kakao_map_key;
      } catch (error) {
        apiKey = '664cc150367cf3800a5a3c0bb7f300a8';
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
        
        script.onload = () => {
          window.kakao.maps.load(() => {
            setKakaoMapLoaded(true);
            resolve();
          });
        };
        
        script.onerror = () => {
          document.head.removeChild(script);
          reject(new Error('카카오맵 스크립트 로드 실패'));
        };

        // 타임아웃 설정 (10초)
        setTimeout(() => {
          if (!window.kakao || !window.kakao.maps) {
            if (document.head.contains(script)) {
              document.head.removeChild(script);
            }
            reject(new Error('카카오맵 로드 타임아웃'));
          }
        }, 10000);

        document.head.appendChild(script);
      });
    } catch (error) {
      throw error;
    }
  };

  // 업로드 파일에서 평균 좌표 계산하여 activityCenter 설정
  useEffect(() => {
    const computeActivityCenter = async () => {
      try {
        const avg = await analyzeFileDataRaw();
        if (avg && !isNaN(avg.lat) && !isNaN(avg.lng)) {
          setActivityCenter(avg);
        }
      } catch (e) {
        // 평균 좌표 계산 실패
      }
    };
    if (selectedFile) {
      computeActivityCenter();
    }
  }, [selectedFile]);

  // 지도 렌더링 (player_ground_selection_2.js와 완전히 동일한 구조)
  const renderMap = () => {
    if (!kakaoMapLoaded) {
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
      // 파일 데이터 평균 좌표 우선 사용
      let lat = 37.5665;
      let lng = 126.9780;

      if (activityCenter && !isNaN(activityCenter.lat) && !isNaN(activityCenter.lng)) {
        lat = activityCenter.lat;
        lng = activityCenter.lng;
      } else if (selectedGround) {
        // 파일 평균이 없을 경우에만 경기장 정보 사용
        const averageCoords = calculateCornerGpsAverage(selectedGround?.corner_gps);
        if (averageCoords) {
          lat = averageCoords.lat;
          lng = averageCoords.lng;
        } else if (Array.isArray(selectedGround?.center) && selectedGround.center.length >= 2) {
          const c0 = parseFloat(selectedGround.center[0]);
          const c1 = parseFloat(selectedGround.center[1]);
          if (!isNaN(c0) && !isNaN(c1)) {
            if (c0 >= 33 && c0 <= 43 && c1 >= 124 && c1 <= 132) {
              lat = c0;
              lng = c1;
            } else {
              const gps = utmToGps(c0, c1);
              if (gps) {
                lat = gps.lat;
                lng = gps.lng;
              }
            }
          }
        }
      }
      
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
        
        // 지도 고정 상태에 따라 초기 설정
        map.setDraggable(!isMapLocked);
        map.setZoomable(!isMapLocked);
      } catch (mapError) {
        return;
      }

      // 사용자 데이터 평균 위치에만 마커 생성 (경기장 중심 마커는 생성하지 않음)
      let marker;
      if (activityCenter && !isNaN(activityCenter.lat) && !isNaN(activityCenter.lng)) {
        // 데이터 평균 위치가 있을 때만 마커 생성
        try {
          marker = new window.kakao.maps.Marker({
            position: markerPosition
          });
          marker.setMap(map);
        } catch (markerError) {
          // 마커 생성 실패
        }
      }

      // 경기 구역 박스 생성 (데이터 평균 위치 중심)
      const boxCenter = { lat: markerPosition.getLat(), lng: markerPosition.getLng() };

      const initialZoneRect = {
        center: boxCenter,
        width: 0.0008,   // 약 80m (더 크게)
        height: 0.0012,  // 약 120m (더 크게)
        rotation: 0,
        isEditing: true
      };

      setZoneRect(initialZoneRect);
      setGameZone(true);
      
      // 경기 구역 생성
      const result = createDirectDomOverlay(map, initialZoneRect);

      // 오버레이 강제 표시 및 DOM 구조 확인
      setTimeout(() => {
        const mapContainer = document.getElementById('kakao-map');
        const overlay = document.querySelector('.zone-direct-overlay');
        const box = document.querySelector('.zone-box-direct');
        
        if (overlay) {
          // 오버레이 상태 확인 및 조정
          if (isMapLocked) {
            overlay.classList.remove('hide');
            overlay.classList.add('show');
            overlay.style.pointerEvents = 'auto';
          } else {
            overlay.classList.remove('show');
            overlay.classList.add('hide');
            overlay.style.pointerEvents = 'none';
          }
          
          // 디버그 배경 제거 (투명)
          overlay.style.backgroundColor = 'transparent';

          if (box) {
            // 박스 표시 및 크기 설정 (CSS 클래스 기반)
            box.style.visibility = 'visible';
            box.style.opacity = '1';
            box.style.border = '3px solid #079669';
            box.style.background = 'rgba(7, 150, 105, 0.12)';
            box.style.minWidth = '30px';
            box.style.minHeight = '30px';
            box.style.boxSizing = 'border-box';
          } else {
            // 박스가 없으면 테스트용 박스 생성
            const testBox = document.createElement('div');
            testBox.style.position = 'absolute';
            testBox.style.left = '50px';
            testBox.style.top = '50px';
            testBox.style.width = '100px';
            testBox.style.height = '100px';
            testBox.style.border = '5px solid #00FF00';
            testBox.style.background = 'rgba(0,255,0,0.3)';
            testBox.style.zIndex = '999999';
            testBox.innerHTML = '테스트박스';
            testBox.style.display = 'flex';
            testBox.style.alignItems = 'center';
            testBox.style.justifyContent = 'center';
            testBox.style.color = '#000';
            testBox.style.fontWeight = 'bold';
            overlay.appendChild(testBox);
          }
        }
      }, 100);

      setLoading(false);

    } catch (error) {
      setLoading(false);
    }
  };

  // 구역 설정 완료
  const handleCompleteSetup = useCallback(async () => {
    if (!gameZone || !zoneRect.center) {
      alert('경기 구역을 먼저 설정해주세요.');
      return;
    }

    if (!groundName.trim()) {
      alert('경기장 이름을 입력해주세요.');
      return;
    }

    // 실제 지도상의 4개 모서리 좌표 가져오기 (회전 반영)
    const mapContainer = document.getElementById('kakao-map');
    const map = mapContainer?._kakaoMap;
    
    if (!map) {
      alert('지도를 찾을 수 없습니다.');
      return;
    }
    
    const box = document.querySelector('.zone-box-direct');
    if (!box) {
      alert('경기 구역 박스를 찾을 수 없습니다.');
      return;
    }
    
    // 박스의 중심점, 크기, 회전 각도 가져오기
    const boxStyle = box.style;
    const boxLeft = parseFloat(boxStyle.left) || 0;
    const boxTop = parseFloat(boxStyle.top) || 0;
    const boxWidth = parseFloat(boxStyle.width) || 0;
    const boxHeight = parseFloat(boxStyle.height) || 0;
    
    // 회전 각도 추출
    const transform = boxStyle.transform || '';
    const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
    const rotation = rotateMatch ? parseFloat(rotateMatch[1]) : 0;
    const rotRad = (rotation * Math.PI) / 180;
    
    // 박스 중심점 (픽셀)
    const centerX = boxLeft + boxWidth / 2;
    const centerY = boxTop + boxHeight / 2;
    
    // 회전되지 않은 상태의 모서리 (중심점 기준 상대 좌표)
    const halfWidth = boxWidth / 2;
    const halfHeight = boxHeight / 2;
    
    const relativeCorners = [
      { x: -halfWidth, y: -halfHeight },  // 왼쪽 위
      { x: halfWidth, y: -halfHeight },   // 오른쪽 위
      { x: halfWidth, y: halfHeight },    // 오른쪽 아래
      { x: -halfWidth, y: halfHeight }    // 왼쪽 아래
    ];
    
    // 회전 변환 적용하여 실제 픽셀 좌표 계산
    const mapRect = mapContainer.getBoundingClientRect();
    const projection = map.getProjection();
    
    const corners = relativeCorners.map(corner => {
      // 회전 변환
      const rotatedX = corner.x * Math.cos(rotRad) - corner.y * Math.sin(rotRad);
      const rotatedY = corner.x * Math.sin(rotRad) + corner.y * Math.cos(rotRad);
      
      // 절대 픽셀 좌표
      const absX = centerX + rotatedX;
      const absY = centerY + rotatedY;
      
      // 픽셀을 GPS 좌표로 변환
      const point = new window.kakao.maps.Point(absX, absY);
      const coords = projection.coordsFromContainerPoint(point);
      
      return {
        lat: coords.getLat(),
        lng: coords.getLng()
      };
    });
    
    if (!corners || corners.length !== 4) {
      alert('경기 구역 좌표 계산에 실패했습니다.');
      return;
    }

    // 로딩 시작
    setLoading(true);

    try {
      // 사용자 정보 가져오기 (sessionStorage 또는 localStorage에서)
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code');

      if (!userCode) {
        alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        setLoading(false);
        return;
      }

      // API 요청 데이터 구성
      const groundData = {
        corner_gps: corners.map(corner => [corner.lat, corner.lng]), // [[위도, 경도], ...]
        name: groundName.trim(),
        address: '', // 주소는 선택사항
        user_code: userCode
      };

      // 경기장 생성 API 호출
      const response = await CreateGroundApi(groundData);

      if (response.data?.success && response.data?.ground) {
        const createdGround = response.data.ground;
        
        alert(`'${createdGround.name}' 경기장이 성공적으로 등록되었습니다.`);

        // 다음 페이지로 이동 (휴식 구역 선택)
        navigate('/app/anal/rest-area-selection', {
          state: {
            selectedGround: createdGround, // 생성된 경기장 정보 전달
            selectedFile: selectedFile
          }
        });
      } else {
        throw new Error(response.data?.message || '경기장 생성에 실패했습니다.');
      }
    } catch (error) {
      // 에러 메시지 표시
      const errorMessage = error.response?.data?.error || error.message || '경기장 생성 중 오류가 발생했습니다.';
      alert(errorMessage);
      
      setLoading(false);
    }
  }, [gameZone, zoneRect, groundName, navigate, selectedFile]);

  // 컴포넌트 마운트 시 카카오맵 로드
  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadKakaoMap();
      } catch (error) {
        setLoading(false);
      }
    };

    initializeMap();
  }, []);

  // 카카오맵 로드 및 지도 렌더링 (player_ground_selection_2.js와 동일)
  useEffect(() => {
    if (kakaoMapLoaded) {
      // 이미 로드된 경우 바로 렌더링
      renderMap();
    } else {
      // 아직 로드되지 않은 경우 로드 후 렌더링
      loadKakaoMap().then(() => {
        setTimeout(renderMap, 100); // 약간의 지연 후 렌더링
      }).catch(error => {
        setLoading(false);
      });
    }
  }, [kakaoMapLoaded, activityCenter]);

  // 윈도우 리사이즈 이벤트 리스너
  useEffect(() => {
    const handleWindowResize = () => {
      const mapContainer = document.getElementById('kakao-map');
      if (mapContainer && mapContainer._kakaoMap && window.kakao && window.kakao.maps) {
        setTimeout(() => {
          window.kakao.maps.event.trigger(mapContainer._kakaoMap, 'resize');
        }, 100);
      }
    };

    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className="player-ground-selection-self-2-1">
      <LogoBellNav logo={true} />
      
      {/* 표준 헤더 구조 - player_data_select_1과 동일한 스타일 */}
      <div className="ground-zone-setup-container">
        <div 
          className="header"
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack}>
              <img src={require('../../../assets/main_icons/back_black.png')} alt="뒤로가기" />
            </button>
          </div>
          <div className="header-content">
            <h1 className="text-h2">경기 구역 설정</h1>
            <p className="subtitle text-body">경기 구역을 직접 설정해주세요</p>
          </div>
        </div>
      </div>

      {/* 지도 섹션 - player_ground_selection_2.js와 동일한 구조 */}
      <div className="map-section">
        <div className="map-container">
          <div 
            className="map-header"
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="map-title text-h4">지도</h3>
            <div className="map-controls">
              {/* 구역 설정 / 지도 조작 모드 토글 탭 */}
              <div className="map-mode-toggle">
                <button 
                  className={`map-mode-btn ${isMapLocked ? 'active' : ''}`}
                  onClick={() => {
                    if (!isMapLocked) {
                      toggleMapLock();
                    }
                  }}
                >
                  구역 설정
                </button>
                <button 
                  className={`map-mode-btn ${!isMapLocked ? 'active' : ''}`}
                  onClick={() => {
                    if (isMapLocked) {
                      toggleMapLock();
                    }
                  }}
                >
                  지도 조작
                </button>
              </div>
              
              {/* 지도 타입 토글 */}
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
          </div>
          {kakaoMapLoaded ? (
            <div id="kakao-map" className="kakao-map"></div>
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
      </div>

      {/* 경기장 이름 입력 섹션 */}
      <div 
        className="ground-name-section"
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <h3 className="section-title text-h3">경기장 이름</h3>
        <div className="ground-name-input-container">
          <input
            id="ground-name"
            type="text"
            className="text-input"
            placeholder="경기장 이름을 입력하세요"
            value={groundName}
            onChange={(e) => setGroundName(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* 완료 버튼 */}
      <div 
        className="complete-section"
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="btn-complete" 
          onClick={handleCompleteSetup}
          disabled={loading || !gameZone || !isMapLocked || !groundName.trim()}
        >
          {loading ? '경기장 등록 중...' : '구역 설정 완료'}
        </button>
      </div>
    </div>
  );
};

export default PlayerGroundSelectionSelf21;
