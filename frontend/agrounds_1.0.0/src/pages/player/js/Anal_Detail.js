import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/Anal_Detail.scss';
import { GetQuarterDataApi, GetTeamPlayerQuarterDataApi } from '../../../function/api/anal/analApi';
// DEV NOTE: 모든 모달은 디자인 시스템 공용 DSModal(variants 포함)만 사용합니다. 개별 오버레이/컨테이너 구현 금지.
import { GetMatchDetailApi } from '../../../function/api/match/matchApi';
import { GetVideosByQuarterApi } from '../../../function/api/video/videoApi';

// 아이콘 import (승인된 아이콘 디렉토리 사용)
import starIcon from '../../../assets/identify_icon/star.png';
import speedIcon from '../../../assets/identify_icon/star.png';
import distanceIcon from '../../../assets/main_icons/line_black.png';
import timeIcon from '../../../assets/main_icons/clock_black.png';
import chartIcon from '../../../assets/main_icons/graph_black.png';
import backIcon from '../../../assets/main_icons/back_black.png';

// 더미 프로필 이미지 import
import defaultProfile from '../../../assets/common/default_profile.png';

// 접기/펼치기 버튼 이미지 import
import upIcon from '../../../assets/main_icons/up_gray.png';
import downIcon from '../../../assets/main_icons/down_gray.png';

// 경기장 이미지 import
import groundLeft from '../../../assets/ground/ground_left.jpg';
import groundRight from '../../../assets/ground/ground_right.jpg';

const Anal_Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [quarterData, setQuarterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null); // 경기 상세 정보
  const [activeMapTab, setActiveMapTab] = useState('heatmap'); // 히트맵 탭 상태
  const [activeActivityTab, setActiveActivityTab] = useState('total'); // 활동량 탭 상태
  const [activeSpeedTab, setActiveSpeedTab] = useState('speed'); // 속력/가속도 탭 상태
  const [videos, setVideos] = useState([]); // 관련 영상 데이터
  const [videosLoading, setVideosLoading] = useState(false); // 영상 로딩 상태
  const [isRestQuarter, setIsRestQuarter] = useState(false); // 휴식 쿼터 상태
  const [currentQuarterData, setCurrentQuarterData] = useState(null); // 현재 활성 쿼터 데이터
  
  // 쿼터 데이터 캐싱 (성능 최적화)
  const [quarterDataCache, setQuarterDataCache] = useState({});
  const [isLoadingQuarter, setIsLoadingQuarter] = useState(false);
  
  // 각 섹션별 접기/펼치기 상태
  const [sectionCollapsed, setSectionCollapsed] = useState({
    ovr: false,
    imageAnalysis: false,
    activity: false,
    sprint: false,
    video: false,
    speed: false
  });

  const resolveFieldImage = (standardDir, homeDir, phase) => {
    let image;

    if (phase === 'attack') {
      image = homeDir === 'east' ? groundRight : groundLeft;
    } else if (phase === 'defense') {
      image = homeDir === 'west' ? groundRight : groundLeft;
    } else {
      image = homeDir === 'east' ? groundRight : groundLeft;
    }

    if (standardDir === 'north') {
      image = image === groundRight ? groundLeft : groundRight;
    }

    return image;
  };
  
  // state에서 전달받은 데이터
  const { quarter, matchData, fromTeamAnalysis } = location.state || {};
  
  
  // 초기 쿼터 데이터 설정
  useEffect(() => {
    if (quarter) {
      setQuarterData(quarter);
      setCurrentQuarterData(quarter);
    }
  }, [quarter, matchData]);

  // 휴식 쿼터 상태 업데이트
  useEffect(() => {
    const restStatus = currentQuarterData?.home === "rest" || apiData?.quarter_info?.home === "rest";
    setIsRestQuarter(restStatus);
  }, [currentQuarterData?.home, apiData?.quarter_info?.home]);


  // 섹션 접기/펼치기 토글 함수
  const toggleSection = (sectionName) => {
    setSectionCollapsed(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // 시간 포맷팅 함수 (HH:MM 형식으로 변환)
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch (error) {
      return '--:--';
    }
  };

  // 빈 리스트/배열일 경우 0으로 표시하는 헬퍼 함수
  const formatValue = (value, unit = '', isArray = false) => {
    if (isArray) {
      // 배열인 경우
      if (Array.isArray(value) && value.length === 0) {
        return `0${unit}`;
      }
      if (!value || value === null || value === undefined) {
        return `0${unit}`;
      }
      return `${value}${unit}`;
    } else {
      // 일반 값인 경우
      if (value === null || value === undefined || value === '' || value === 0) {
        return `0${unit}`;
      }
      return `${value}${unit}`;
    }
  };

  // T_HMAP 데이터 처리 함수
  const processHeatmapData = (tHmapData) => {
    if (!tHmapData) {
      return null;
    }

    if (!tHmapData.layers) {
      return null;
    }

    if (tHmapData.layers.length === 0) {
      return null;
    }

    try {
      const layer = tHmapData.layers[0];
      const { shape, b64, dtype } = layer;
      
      if (!shape || !b64) {
        return null;
      }
      
      const [height, width] = shape;
      
      // Base64 디코딩
      const binaryString = atob(b64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // 데이터 타입에 따른 처리
      let dataArray;
      if (dtype === 'uint16') {
        dataArray = new Uint16Array(bytes.buffer);
        // 0.1초 단위를 초로 환산
        dataArray = Array.from(dataArray).map(val => val / 10.0);
      } else {
        dataArray = new Float32Array(bytes.buffer);
      }
      
      // 2D 배열로 변환
      const heatmapArray = [];
      for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
          row.push(dataArray[i * width + j]);
        }
        heatmapArray.push(row);
      }
      
      return {
        data: heatmapArray,
        width,
        height,
        maxValue: Math.max(...dataArray)
      };
    } catch (error) {
      return null;
    }
  };

  // 가우시안 필터 (Python 알고리즘과 동일한 방식)
  const applyGaussianSmoothing = (data, sigma = 1.5) => {
    if (!data || data.length === 0 || sigma <= 0) return data;
    
    const height = data.length;
    const width = data[0].length;
    const smoothed = Array(height).fill().map(() => Array(width).fill(0));
    
    // 가우시안 커널 생성 (sigma에 따라 크기 조정)
    const kernelSize = Math.ceil(3 * sigma) * 2 + 1;
    const center = Math.floor(kernelSize / 2);
    const kernel = [];
    
    for (let i = 0; i < kernelSize; i++) {
      kernel[i] = [];
      for (let j = 0; j < kernelSize; j++) {
        const x = i - center;
        const y = j - center;
        kernel[i][j] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      }
    }
    
    // 커널 정규화
    let kernelSum = 0;
    for (let i = 0; i < kernelSize; i++) {
      for (let j = 0; j < kernelSize; j++) {
        kernelSum += kernel[i][j];
      }
    }
    
    for (let i = 0; i < kernelSize; i++) {
      for (let j = 0; j < kernelSize; j++) {
        kernel[i][j] /= kernelSum;
      }
    }
    
    // 컨볼루션 적용
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let sum = 0;
        
        for (let ki = 0; ki < kernelSize; ki++) {
          for (let kj = 0; kj < kernelSize; kj++) {
            const ni = i + ki - center;
            const nj = j + kj - center;
            
            if (ni >= 0 && ni < height && nj >= 0 && nj < width) {
              sum += data[ni][nj] * kernel[ki][kj];
            }
          }
        }
        
        smoothed[i][j] = sum;
      }
    }
    
    return smoothed;
  };


  // 프로필 이미지 가져오기
  const getProfileImage = () => {
    return defaultProfile;
  };

  // 포지션별 색상 클래스 반환 함수
  const getPositionClass = (position) => {
    if (!position) return 'position-default';
    
    const positionUpper = position.toUpperCase();
    
    if (['LWF', 'ST', 'RWF'].includes(positionUpper)) {
      return 'position-striker';
    } else if (['LWM', 'CAM', 'RWM', 'LM', 'CM', 'RM', 'CDM'].includes(positionUpper)) {
      return 'position-midfielder';
    } else if (['LWB', 'RWB', 'LB', 'CB', 'RB'].includes(positionUpper)) {
      return 'position-defender';
    } else if (['GK'].includes(positionUpper)) {
      return 'position-goalkeeper';
    } else {
      return 'position-default';
    }
  };

  // 육각형 좌표 계산 함수 (메인 페이지와 동일)
  const calculateHexagonPoints = (centerX, centerY, radius, values, minValue = -25, maxValue = 100) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (i * 60 - 90); // -90도에서 시작 (상단부터)
      const value = values[i] || 0;
      // -25 ~ 100 범위를 0 ~ 1로 정규화
      const normalizedValue = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
      const scaledRadius = normalizedValue * radius;
      const x = centerX + scaledRadius * Math.cos(angle);
      const y = centerY + scaledRadius * Math.sin(angle);
      points.push({ x, y, value });
    }
    return points;
  };

  // 육각형 배경 그리드 좌표
  const getGridHexagonPoints = (centerX, centerY, radius) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (i * 60 - 90);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y });
    }
    return points;
  };

  // 라벨 위치 계산 (메인페이지와 동일한 순서)
  const getLabelPositions = (centerX, centerY, radius, data) => {
    const radarChartData = [
      { label: '참여도', value: calculateParticipation() || 0 },
      { label: '스피드', value: data.스피드 || 0 },
      { label: '가속도', value: data.가속도 || 0 },
      { label: '스프린트', value: data.스프린트 || 0 },
      { label: '순발력', value: data.순발력 || 0 },
      { label: '체력', value: data.체력 || 0 }
    ];
    
    return radarChartData.map((item, i) => {
      const angle = (Math.PI / 180) * (i * 60 - 90);
      const labelRadius = radius + 25;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      return { x, y, label: item.label, value: item.value };
    });
  };

  // 참여도 계산 함수 (공격점수와 수비점수의 평균)
  const calculateParticipation = () => {
    // 여러 가능한 필드명 시도
    const attackScore = apiData?.point_data?.point_attack || 
                       apiData?.attack_data?.point || 
                       apiData?.point_data?.attack || 
                       0;
    const defenseScore = apiData?.point_data?.point_defense || 
                        apiData?.defense_data?.point || 
                        apiData?.point_data?.defense || 
                        0;
    
    if (attackScore === 0 && defenseScore === 0) return 0;
    return Math.round((attackScore + defenseScore) / 2);
  };

  // 6가지 지표의 평균 계산 함수 (메인페이지와 동일한 순서)
  const calculateAverageOVR = (data) => {
    const values = [
      calculateParticipation() || 0,
      data.스피드 || 0,
      data.가속도 || 0,
      data.스프린트 || 0,
      data.순발력 || 0,
      data.체력 || 0
    ];
    const validValues = values.filter(value => value > 0); // 0보다 큰 값들만 계산
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, value) => acc + value, 0);
    return Math.round(sum / validValues.length);
  };

  // 레이더 차트 SVG 생성 (메인 페이지와 동일한 디자인)
  const generateRadarChart = (data) => {
    const radarChartData = [
      { label: '참여도', value: calculateParticipation() || 0 },
      { label: '스피드', value: data.스피드 || 0 },
      { label: '가속도', value: data.가속도 || 0 },
      { label: '스프린트', value: data.스프린트 || 0 },
      { label: '순발력', value: data.순발력 || 0 },
      { label: '체력', value: data.체력 || 0 }
    ];

    return (
      <div className="radar-chart-container">
        <svg width="400" height="400" viewBox="0 0 400 400">
          {/* 그라데이션 정의 */}
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.6)" />
              <stop offset="70%" stopColor="rgba(34, 197, 94, 0.3)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
            </radialGradient>
          </defs>
          
          {/* 배경 그리드 (-25, 0, 25, 50, 75, 100에 해당하는 그리드) */}
          {[-25, 0, 25, 50, 75, 100].map((value, index) => {
            // -25 ~ 100 범위에서 0 ~ 1로 정규화
            const normalizedValue = (value - (-25)) / (100 - (-25));
            const radius = normalizedValue * 140;
            const gridPoints = getGridHexagonPoints(200, 200, radius);
            return (
              <polygon
                key={`grid-${index}`}
                points={gridPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}
          
          {/* 축선 */}
          {getGridHexagonPoints(200, 200, 140).map((point, index) => (
            <line
              key={`axis-${index}`}
              x1="200"
              y1="200"
              x2={point.x}
              y2={point.y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* 데이터 영역 (그라데이션 적용) */}
          {(() => {
            const values = radarChartData.map(item => item.value);
            const dataPoints = calculateHexagonPoints(200, 200, 140, values);
            return (
              <polygon
                points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="url(#radarGradient)"
                stroke="#22c55e"
                strokeWidth="2"
              />
            );
          })()}
          
          {/* 라벨과 점수 */}
          {getLabelPositions(200, 200, 140, data).map((pos, index) => (
            <g key={`label-group-${index}`}>
              {/* 지표 라벨 */}
              <text
                x={pos.x}
                y={pos.y - 8}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="14"
                fontWeight="600"
                fill="#374151"
              >
                {pos.label}
              </text>
              {/* 점수 */}
              <text
                x={pos.x}
                y={pos.y + 8}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12"
                fontWeight="500"
                fill="#6B7280"
              >
                {pos.value || 0}
              </text>
            </g>
          ))}
          
          {/* 중앙 OVR 점수 (total 점수 표시, 정수로 표시, 검은색) */}
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="48"
            fontWeight="800"
            fill="#000000"
          >
            {apiData?.point_data?.total || 0}
          </text>
        </svg>
      </div>
    );
  };


  // T_SMAP 데이터 처리 함수 (스프린트)
  const processSprintData = (smapData) => {
    if (!smapData || !smapData.layers || smapData.layers.length < 3) {
      return null;
    }

    try {
      const countLayer = smapData.layers[0];
      const angleLayer = smapData.layers[1];
      const vmaxLayer = smapData.layers[2];

      const count = processHeatmapData({ layers: [countLayer] });
      const angle = processHeatmapData({ layers: [angleLayer] });
      const vmax = processHeatmapData({ layers: [vmaxLayer] });

      if (!count || !angle || !vmax) {
        return null;
      }

      return {
        count: count.data,
        angle: angle.data,
        vmax: vmax.data,
        width: count.width,
        height: count.height,
        maxVmax: Math.max(...vmax.data.flat())
      };
    } catch (error) {
      return null;
    }
  };

  // T_DMAP 데이터 처리 함수 (방향전환)
  const processDirectionData = (dmapData) => {
    if (!dmapData || !dmapData.layers || dmapData.layers.length < 2) {
      return null;
    }

    try {
      const ldtLayer = dmapData.layers[0]; // 저각 방향전환
      const hdtLayer = dmapData.layers[1]; // 고각 방향전환

      const ldt = processHeatmapData({ layers: [ldtLayer] });
      const hdt = processHeatmapData({ layers: [hdtLayer] });

      if (!ldt || !hdt) {
        return null;
      }

      return {
        ldt: ldt.data,
        hdt: hdt.data,
        width: ldt.width,
        height: ldt.height
      };
    } catch (error) {
      return null;
    }
  };

  // 실제 T_HMAP 데이터로 히트맵 생성
  const generateHeatmap = (tHmapData, standard = "north", home = "west", status = "normal") => {
    const processedData = processHeatmapData(tHmapData);
    
    if (!processedData) {
      // T_HMAP 데이터가 없는 경우 기본 히트맵 표시
      return (
        <div className="heatmap-container">
          <div className="heatmap-placeholder">
            <p className="text-body">히트맵 데이터가 없습니다</p>
          </div>
        </div>
      );
    }

    // 가우시안 스무딩 적용 (Python 알고리즘과 동일)
    const smoothedData = applyGaussianSmoothing(processedData.data, 1.5);
    
    // 정규화 (p95 방식 - Python 알고리즘과 동일)
    let vmax = 1.0;
    if (smoothedData.length > 0) {
      const flatData = smoothedData.flat().filter(val => val > 0);
      if (flatData.length > 0) {
        const sortedData = flatData.sort((a, b) => a - b);
        const p95Index = Math.floor(sortedData.length * 0.95);
        vmax = sortedData[p95Index];
      } else {
        vmax = Math.max(...smoothedData.flat());
      }
      if (vmax <= 0) vmax = 1.0;
    }
    
    // 히트맵 데이터 경계 분석
    const dataHeight = smoothedData.length;
    const dataWidth = smoothedData[0] ? smoothedData[0].length : 0;
    
    // 데이터가 있는 영역 찾기 (0이 아닌 값들의 경계)
    let minX = dataWidth, maxX = 0, minY = dataHeight, maxY = 0;
    let hasData = false;
    
    for (let i = 0; i < dataHeight; i++) {
      for (let j = 0; j < dataWidth; j++) {
        if (smoothedData[i][j] > 0) {
          hasData = true;
          minX = Math.min(minX, j);
          maxX = Math.max(maxX, j);
          minY = Math.min(minY, i);
          maxY = Math.max(maxY, i);
        }
      }
    }
    
    
    // 경기장 이미지 크기 (9:6 비율로 고정)
    const fieldWidth = 360;  // SVG viewBox width
    const fieldHeight = 240; // SVG viewBox height (9:6 비율)
    
    // 경기장 이미지 선택 (status와 home에 따라)
    const isAttackPhase = status === "attack" || status === "offensive" || status === "attacking";
    const isDefensePhase = status === "defense" || status === "defensive" || status === "defending";
    const normalizedHome = home || "west";
    const phaseType = isAttackPhase ? "attack" : isDefensePhase ? "defense" : "normal";
    const fieldImage = resolveFieldImage(standard, normalizedHome, phaseType);
    
    // extent 설정 (경기장 좌표) - Python 코드와 동일
    const extent = standard === "north" ? [90, 0, 60, 0] : [0, 90, 0, 60];
    
    return (
      <div className="heatmap-container">
        <div className="heatmap-field-container">
          <img 
            src={fieldImage} 
            alt="경기장" 
            className="field-background"
          />
          <div className="heatmap-overlay">
            <svg width="100%" height="100%" viewBox="0 0 360 240" className="heatmap-svg">
              
              {/* 히트맵 데이터 표시 - Python render_t_hmap_smoothed 방식 */}
              {hasData && (
                <>
                  {/* 가우시안 블러 필터 정의 */}
                  <defs>
                    <filter id="gaussianBlur" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1.5"/>
                    </filter>
                  </defs>
                  
                  {/* 히트맵 점들 - Python ax.imshow와 동일한 방식 */}
                  <g filter="url(#gaussianBlur)" opacity="0.6">
                    {smoothedData.map((row, i) => 
                      row.map((value, j) => {
                        if (value <= 0) return null;
                        
                        // 정규화된 값 (0-1) - Python 알고리즘과 동일
                        const normalizedValue = Math.min(Math.max(value / vmax, 0.0), 1.0);
                        
                        // extent에 따른 좌표 변환 - Python ax.imshow와 동일
                        const normalizedX = j / (dataWidth - 1);
                        const normalizedY = i / (dataHeight - 1);
                        
                        // extent = [0, 90, 0, 60] 또는 [90, 0, 60, 0]
                        let x, y;
                        if (standard === "north") {
                          // north: extent = [90, 0, 60, 0]
                          x = 90 - (normalizedX * 90); // 90에서 0으로
                          y = 60 - (normalizedY * 60); // 60에서 0으로
                        } else {
                          // south: extent = [0, 90, 0, 60]
                          x = normalizedX * 90; // 0에서 90으로
                          y = normalizedY * 60; // 0에서 60으로
                        }
                        
                        // SVG 좌표로 변환 (extent를 SVG 크기에 매핑) - 0.95배로 축소
                        const scale = 0.95; // 히트맵 영역을 0.95배로 축소
                        const offsetX = fieldWidth * (1 - scale) / 2; // 중앙 정렬을 위한 오프셋
                        const offsetY = fieldHeight * (1 - scale) / 2; // 중앙 정렬을 위한 오프셋
                        
                        const svgX = (x / 90) * fieldWidth * scale + offsetX;
                        const svgY = (1 - y / 60) * fieldHeight * scale + offsetY; // Y축 반전
                        
                        // 색상 계산 (낮은 활동량: 파랑색, 높은 활동량: 빨간색)
                        const intensity = normalizedValue;
                        let red, green, blue;
                        
                        if (intensity <= 0.0) {
                          // 활동량이 없으면 투명
                          red = green = blue = 0;
                        } else if (intensity < 0.25) {
                          // 낮은 활동량: 연한 파랑색
                          const t = intensity / 0.25;
                          red = 0;
                          green = Math.floor(100 * t);
                          blue = Math.floor(255 * t);
                        } else if (intensity < 0.5) {
                          // 중간 낮은 활동량: 파랑색
                          const t = (intensity - 0.25) / 0.25;
                          red = 0;
                          green = Math.floor(100 + 155 * t);
                          blue = 255;
                        } else if (intensity < 0.75) {
                          // 중간 활동량: 파랑색 → 노란색
                          const t = (intensity - 0.5) / 0.25;
                          red = Math.floor(255 * t);
                          green = 255;
                          blue = Math.floor(255 * (1 - t));
                        } else {
                          // 높은 활동량: 노란색 → 빨간색
                          const t = (intensity - 0.75) / 0.25;
                          red = 255;
                          green = Math.floor(255 * (1 - t));
                          blue = 0;
                        }
                        
                        // 점 크기는 데이터 밀도에 따라 조절
                        const radius = Math.max(1, Math.min(4, normalizedValue * 3 + 1));
                        
                        return (
                          <circle
                            key={`heatmap-${i}-${j}`}
                            cx={svgX}
                            cy={svgY}
                            r={radius}
                            fill={`rgb(${red}, ${green}, ${blue})`}
                            opacity={Math.max(0.1, normalizedValue * 0.8)}
                            className="heatmap-point"
                          />
                        );
                      })
                    )}
                  </g>
                  
                </>
              )}
            </svg>
          </div>
        </div>
        <p className="heatmap-legend text-caption">※ 파랑색: 낮은 체류시간, 빨간색: 높은 체류시간</p>
      </div>
    );
  };

  // 스프린트 화살표 생성
  const generateSprintArrows = (sprintData, standard = "north", home = "west") => {
    if (!sprintData) {
      return (
        <div className="heatmap-container">
          <div className="heatmap-placeholder">
            <p className="text-body">스프린트 데이터가 없습니다</p>
            <p className="text-caption" style={{marginTop: '8px', color: '#8A8F98'}}>
              이 쿼터에서는 스프린트 활동이 기록되지 않았습니다
            </p>
          </div>
        </div>
      );
    }

    const fieldWidth = 360;
    const fieldHeight = 240;
    
    const isAttackPhase = false; // 기본값
    const isDefensePhase = false; // 기본값
    const normalizedHome = home || "west";
    const phaseType = isAttackPhase ? "attack" : isDefensePhase ? "defense" : "normal";
    const fieldImage = resolveFieldImage(standard, normalizedHome, phaseType);

    const extent = standard === "north" ? [90, 0, 60, 0] : [0, 90, 0, 60];
    const level_3 = 24.0;
    const level_2 = 21.0;
    const maxLen = 32.0; // 화살표 길이 추가 증가

    return (
      <div className="heatmap-container">
        <div className="heatmap-field-container">
          <img 
            src={fieldImage} 
            alt="경기장" 
            className="field-background"
          />
          <div className="heatmap-overlay">
            <svg width="100%" height="100%" viewBox="0 0 360 240" className="heatmap-svg">
              {sprintData.count.map((row, i) => 
                row.map((count, j) => {
                  if (count <= 0) return null;
                  
                  const angle = sprintData.angle[i][j];
                  const vmax = sprintData.vmax[i][j];
                  const length = (vmax / sprintData.maxVmax) * maxLen;
                  
                  // 좌표 변환
                  const normalizedX = j / (sprintData.width - 1);
                  const normalizedY = i / (sprintData.height - 1);
                  
                  let x, y;
                        if (standard === "north") {
                    x = 90 - (normalizedX * 90);
                    y = 60 - (normalizedY * 60);
                  } else {
                    x = normalizedX * 90;
                    y = normalizedY * 60;
                  }
                  
                  const scale = 0.95;
                  const offsetX = fieldWidth * (1 - scale) / 2;
                  const offsetY = fieldHeight * (1 - scale) / 2;
                  
                  const svgX = (x / 90) * fieldWidth * scale + offsetX;
                  const svgY = (1 - y / 60) * fieldHeight * scale + offsetY;
                  
                  const dx = length * Math.cos(angle * Math.PI / 180);
                  const dy = length * Math.sin(angle * Math.PI / 180);
                  
                  let color;
                  if (vmax >= level_3) {
                    color = "#F90716"; // 빨강
                  } else if (vmax >= level_2) {
                    color = "#FF5403"; // 주황
                  } else {
                    color = "#FFCA03"; // 노랑
                  }
                  
                  // 화살표 머리 크기 및 방향 계산
                  const arrowHeadSize = 8; // 화살표 머리 크기 추가 증가
                  const arrowAngle = angle * Math.PI / 180;
                  
                  // 화살표 머리를 막대기 끝쪽으로 이동 (막대기 끝에서 4픽셀 앞으로)
                  const headOffset = -4; // 막대기 끝에서 앞으로 이동할 거리
                  const headBaseX = (svgX + dx) - headOffset * Math.cos(arrowAngle);
                  const headBaseY = (svgY + dy) - headOffset * Math.sin(arrowAngle);
                  
                  // 화살표 머리의 두 점 계산 (화살표 방향을 기준으로)
                  const headX1 = headBaseX - arrowHeadSize * Math.cos(arrowAngle - Math.PI / 6);
                  const headY1 = headBaseY - arrowHeadSize * Math.sin(arrowAngle - Math.PI / 6);
                  const headX2 = headBaseX - arrowHeadSize * Math.cos(arrowAngle + Math.PI / 6);
                  const headY2 = headBaseY - arrowHeadSize * Math.sin(arrowAngle + Math.PI / 6);
                  
                  return (
                    <g key={`sprint-${i}-${j}`}>
                      <line
                        x1={svgX}
                        y1={svgY}
                        x2={svgX + dx}
                        y2={svgY + dy}
                        stroke={color}
                        strokeWidth="4"
                        opacity="0.85"
                      />
                      <polygon
                        points={`${headBaseX},${headBaseY} ${headX1},${headY1} ${headX2},${headY2}`}
                        fill={color}
                        opacity="0.85"
                      />
                    </g>
                  );
                })
              )}
            </svg>
          </div>
        </div>
        <p className="heatmap-legend text-caption">※ 방향과 속도를 표시합니다 (빨강: 고속, 주황: 중간, 노랑: 저속)</p>
      </div>
    );
  };

  // 방향전환 점 생성
  const generateDirectionPoints = (directionData, standard = "north", home = "west") => {
    if (!directionData) {
      return (
        <div className="heatmap-container">
          <div className="heatmap-placeholder">
            <p className="text-body">방향전환 데이터가 없습니다</p>
            <p className="text-caption" style={{marginTop: '8px', color: '#8A8F98'}}>
              이 쿼터에서는 방향전환 활동이 기록되지 않았습니다
            </p>
          </div>
        </div>
      );
    }

    const fieldWidth = 360;
    const fieldHeight = 240;
    
    const isAttackPhase = false;
    const isDefensePhase = false;
    const normalizedHome = home || "west";
    const phaseType = isAttackPhase ? "attack" : isDefensePhase ? "defense" : "normal";
    const fieldImage = resolveFieldImage(standard, normalizedHome, phaseType);

    const extent = standard === "north" ? [90, 0, 60, 0] : [0, 90, 0, 60];

    return (
      <div className="heatmap-container">
        <div className="heatmap-field-container">
          <img 
            src={fieldImage} 
            alt="경기장" 
            className="field-background"
          />
          <div className="heatmap-overlay">
            <svg width="100%" height="100%" viewBox="0 0 360 240" className="heatmap-svg">
              {/* LDT (저각 방향전환) - 주황색 */}
              {directionData.ldt.map((row, i) => 
                row.map((value, j) => {
                  if (value <= 0) return null;
                  
                  const normalizedX = j / (directionData.width - 1);
                  const normalizedY = i / (directionData.height - 1);
                  
                  let x, y;
                        if (standard === "north") {
                    x = 90 - (normalizedX * 90);
                    y = 60 - (normalizedY * 60);
                  } else {
                    x = normalizedX * 90;
                    y = normalizedY * 60;
                  }
                  
                  const scale = 0.95;
                  const offsetX = fieldWidth * (1 - scale) / 2;
                  const offsetY = fieldHeight * (1 - scale) / 2;
                  
                  const svgX = (x / 90) * fieldWidth * scale + offsetX;
                  const svgY = (1 - y / 60) * fieldHeight * scale + offsetY;
                  
                  return (
                    <circle
                      key={`ldt-${i}-${j}`}
                      cx={svgX}
                      cy={svgY}
                      r="3"
                      fill="#FFA500"
                      opacity="0.85"
                    />
                  );
                })
              )}
              
              {/* HDT (고각 방향전환) - 빨간색 */}
              {directionData.hdt.map((row, i) => 
                row.map((value, j) => {
                  if (value <= 0) return null;
                  
                  const normalizedX = j / (directionData.width - 1);
                  const normalizedY = i / (directionData.height - 1);
                  
                  let x, y;
                  if (standard === "north") {
                    x = 90 - (normalizedX * 90);
                    y = 60 - (normalizedY * 60);
                  } else {
                    x = normalizedX * 90;
                    y = normalizedY * 60;
                  }
                  
                  const scale = 0.95;
                  const offsetX = fieldWidth * (1 - scale) / 2;
                  const offsetY = fieldHeight * (1 - scale) / 2;
                  
                  const svgX = (x / 90) * fieldWidth * scale + offsetX;
                  const svgY = (1 - y / 60) * fieldHeight * scale + offsetY;
                  
                  return (
                    <circle
                      key={`hdt-${i}-${j}`}
                      cx={svgX}
                      cy={svgY}
                      r="3"
                      fill="#FF3300"
                      opacity="0.85"
                    />
                  );
                })
              )}
            </svg>
          </div>
        </div>
        <p className="heatmap-legend text-caption">※ 방향 변화를 표시합니다 (주황: 완만한 방향전환, 빨강: 급격한 방향전환)</p>
      </div>
    );
  };

  // 경기 상세 정보 로드 함수
  const loadMatchInfo = async (matchCode) => {
    try {
      const response = await GetMatchDetailApi('', matchCode); // user_code는 선택적 파라미터
      
      if (response.data) {
        setMatchInfo(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // 쿼터 분석 데이터 로드 함수 (히트맵, 스프린트, 방향전환 포함)
  const loadQuarterData = async (userCode, quarterCode, teamQuarterCode = null) => {
    try {
      // 팀 분석에서 온 경우 TeamPlayerAnal API 사용
      if (fromTeamAnalysis && (teamQuarterCode || quarter?.team_quarter_code)) {
        const actualTeamQuarterCode = teamQuarterCode || quarter.team_quarter_code;
        const response = await GetTeamPlayerQuarterDataApi(actualTeamQuarterCode, userCode);
        setApiData(response.data);
        return response.data;
      } else {
        // 일반 개인 분석 데이터 로드
        const response = await GetQuarterDataApi(userCode, quarterCode);
        setApiData(response.data);
        return response.data;
      }
    } catch (error) {
      return null;
    }
  };

  // 유튜브 URL에서 비디오 ID 추출
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // 모바일에서 유튜브 앱으로 이동하는 URL 생성
  const getYouTubeAppUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return url;
    
    // 모바일에서 유튜브 앱으로 이동하는 URL
    return `vnd.youtube://${videoId}`;
  };

  // 영상 클릭 핸들러
  const handleVideoClick = (video) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isMobile) {
      const videoId = getYouTubeVideoId(video.url);
      if (!videoId) {
        window.open(video.url, '_blank');
        return;
      }
      
      let appUrl;
      let webUrl = video.url;
      
      if (isIOS) {
        // iOS용 유튜브 앱 URL
        appUrl = `youtube://watch?v=${videoId}`;
      } else if (isAndroid) {
        // Android용 유튜브 앱 URL
        appUrl = `intent://www.youtube.com/watch?v=${videoId}#Intent;scheme=https;package=com.google.android.youtube;end`;
      } else {
        // 기타 모바일 기기
        appUrl = `vnd.youtube://${videoId}`;
      }
      
      // 앱 실행 시도
      const startTime = Date.now();
      const timeout = 2500; // 2.5초 타임아웃
      
      // 페이지 가시성 변경 감지 (앱으로 이동했는지 확인)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // 앱으로 이동한 것으로 판단
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          return;
        }
        
        // 2.5초 후에도 페이지가 보이면 웹으로 이동
        if (Date.now() - startTime > timeout) {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.open(webUrl, '_blank');
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // 앱 URL로 이동 시도
      window.location.href = appUrl;
      
      // 타임아웃 후 웹으로 이동
      setTimeout(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (!document.hidden) {
          window.open(webUrl, '_blank');
        }
      }, timeout);
      
    } else {
      // 데스크톱인 경우 새 창에서 열기
      window.open(video.url, '_blank');
    }
  };

  // 유튜브 썸네일 URL 생성
  const getYouTubeThumbnail = (url, quality = 'hqdefault') => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    
    // quality 옵션: default, medium, high, standard, maxres
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  };

  // 관련 영상 데이터 로드 함수
  const loadRelatedVideos = async (quarterCode) => {
    try {
      setVideosLoading(true);
      
      const response = await GetVideosByQuarterApi(quarterCode);
      
      // 백엔드 응답 형식: { data: [...], count: number, message: "..." }
      // 또는 에러 시: { error: "..." }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // 각 영상에 썸네일 URL 추가
        const videosWithThumbnails = response.data.data.map(video => ({
          ...video,
          thumbnail_url: getYouTubeThumbnail(video.url)
        }));
        
        setVideos(videosWithThumbnails);
      } else if (response.data && response.data.error) {
        // 에러 응답인 경우
        console.error('영상 조회 오류:', response.data.error);
        setVideos([]);
      } else {
        // 빈 배열 또는 예상치 못한 응답 형식
        setVideos([]);
      }
    } catch (error) {
      console.error('영상 로드 중 오류:', error);
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };


  // 뒤로가기 함수
  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // 전달받은 데이터가 없는 경우 이전 페이지로 돌아가기
    if (!quarter || !matchData) {
      navigate(-1);
      return;
    }
    
    // 경기 상세 정보 및 쿼터 분석 데이터 로드
    const loadData = async () => {
      try {
        // 팀 분석에서 전달받은 user_code 우선 사용, 없으면 sessionStorage에서 가져오기
        const userCode = matchData?.user_code || sessionStorage.getItem('userCode');
        
        if (!userCode) {
          alert('사용자 정보를 찾을 수 없습니다.');
          navigate(-1);
          return;
        }
        
        // 경기 상세 정보 로드 (matchData에서 match_code 사용)
        if (matchData?.match_code) {
          await loadMatchInfo(matchData.match_code);
        }
        
        // 쿼터 분석 데이터 로드
        if (quarter?.quarter_code && userCode) {
          // API 병렬 호출로 초기 로딩 속도 개선
          const [apiData, videosData] = await Promise.all([
            loadQuarterData(userCode, quarter.quarter_code, quarter.team_quarter_code),
            loadRelatedVideos(quarter.quarter_code)
          ]);
        
        // API 데이터로 초기화
        const initialData = {
          playerName: matchData?.playerName || "플레이어",
          playerPosition: "포지션",
          quarterName: quarter.name,
          quarterNumber: quarter.quarter,
          radarData: {
            체력: 0,
            순발력: 0,
            스피드: 0,
            가속도: 0,
            스프린트: 0
          },
          tHmapData: null,
          detailStats: {
            경기시간: "0분",
            이동거리: "0km",
            평균속도: "0km/h",
            최고속도: "0km/h",
            가속도: "0m/s²",
            최고가속도: "0m/s²",
            활동량: "0%",
            스프린트: "0회",
            점수: 0
          },
          timeInfo: {
            startTime: "--:--",
            endTime: "--:--"
          }
        };
        
        if (apiData) {
          // API 데이터를 state에 설정 (히트맵 렌더링을 위해 필요)
          setApiData(apiData);
          
          // API 데이터로 상세 통계 업데이트
          initialData.detailStats = {
            경기시간: `${apiData.quarter_info?.duration || 0}분`,
            이동거리: `${apiData.total_data?.distance || 0}km`,
            평균속도: `${apiData.total_data?.average_speed || 0}km/h`,
            최고속도: `${apiData.total_data?.max_speed || 0}km/h`,
            가속도: `${apiData.total_data?.average_acceleration || 0}m/s²`,
            최고가속도: `${apiData.total_data?.max_acceleration || 0}m/s²`,
            활동량: `${apiData.total_data?.movement_ratio || 0}%`,
            스프린트: `${apiData.total_data?.sprint_count || 0}회`,
            점수: apiData.point_data?.total || 0
          };
          
          // 레이더 차트 데이터 업데이트
          initialData.radarData = {
            체력: apiData.point_data?.stamina || 0,
            순발력: apiData.point_data?.positiveness || 0,
            스피드: apiData.point_data?.speed || 0,
            가속도: apiData.point_data?.acceleration || 0,
            스프린트: apiData.point_data?.sprint || 0
          };
          
          // 시간 정보 업데이트
          initialData.timeInfo = {
            startTime: formatTime(apiData.quarter_info?.start_time),
            endTime: formatTime(apiData.quarter_info?.end_time)
          };
          
          // T_HMAP 데이터 설정
          initialData.tHmapData = apiData.total_data?.heatmap_data || null;
          
          // 초기 데이터도 캐시에 저장 (쿼터 전환 시 재사용)
          setQuarterDataCache({
            [quarter.quarter_code]: {
              quarterData: initialData,
              apiData: apiData,
              videos: videosData || []
            }
          });
        }
        
        setQuarterData(initialData);
      }
      } catch (error) {
        alert('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [quarter, matchData, navigate]);

  // 스크롤 이벤트 처리 - sticky header 효과
  useEffect(() => {
    let stickyOffset = null;

    const handleScroll = () => {
      const stickyContainer = document.querySelector('.sticky-quarter-container');
      const pageHeader = document.querySelector('.anal-detail-container .header');
      
      if (!stickyContainer || !pageHeader) {
        return;
      }
      
      if (stickyContainer && pageHeader) {
        // 초기 offset 계산 (페이지 헤더 바로 아래)
        if (stickyOffset === null) {
          stickyOffset = pageHeader.offsetTop + pageHeader.offsetHeight;
        }

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop >= stickyOffset) {
          // sticky 효과 활성화
          stickyContainer.classList.add('scrolled');
          stickyContainer.style.position = 'fixed';
          stickyContainer.style.top = '0';
          stickyContainer.style.left = '50%';
          stickyContainer.style.transform = 'translateX(-50%)';
          stickyContainer.style.width = '100%';
          stickyContainer.style.zIndex = '1000';
        } else {
          // sticky 효과 비활성화
          stickyContainer.classList.remove('scrolled');
          stickyContainer.style.position = 'static';
          stickyContainer.style.left = 'auto';
          stickyContainer.style.transform = 'none';
          stickyContainer.style.width = '100%';
          stickyContainer.style.zIndex = 'auto';
        }
      }
    };

    // 초기 실행 (DOM 준비 대기)
    const initTimer = setTimeout(() => {
      handleScroll();
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => { stickyOffset = null; handleScroll(); });
    
    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);


  if (loading) {
    return (
      <div className='anal-detail-page'>
        <LogoBellNav showBack={true} onBack={handleBack} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="text-body">상세 분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!quarterData) {
    return (
      <div className='anal-detail-page'>
        <LogoBellNav showBack={true} onBack={handleBack} />
        <div className="error-container">
          <p className="text-body">상세 분석 데이터를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`anal-detail-page ${isLoadingQuarter ? 'loading-overlay-active' : ''}`}>
      {/* 쿼터 전환 로딩 오버레이 */}
      {isLoadingQuarter && (
        <div className="quarter-loading-overlay">
          <div className="quarter-loading-content">
            <div className="quarter-loading-spinner"></div>
            <p className="quarter-loading-text text-body">쿼터 데이터를 불러오는 중...</p>
          </div>
        </div>
      )}
      
      <LogoBellNav logo={true} />
      
      {/* 표준 헤더 구조 */}
      <div className="anal-detail-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack}>
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <div className="empty-space"></div>
          </div>
          <div className="header-content">
            <h1 className="text-h2">{quarterData.quarterName}</h1>
            <p className="subtitle text-body">분석 결과를 자세히 보여줘요</p>
          </div>
        </div>
      </div>

      {/* Sticky 쿼터 탭 컨테이너 - 컨테이너 밖으로 이동 */}
      <div className="sticky-quarter-container">
        <div className="quarter-tabs">
        {matchData?.quarters?.filter(quarter => quarter.status !== 'rest').map((quarter) => {
          // 현재 쿼터의 이름과 각 탭의 쿼터 이름 비교
          const currentQuarterName = quarterData?.name || quarterData?.quarterName;
          const quarterName = quarter.name || quarter.quarterName || quarter.quarter_name;
          // 쿼터 이름으로 활성화 여부 결정
          const isActive = currentQuarterName && quarterName && 
                          currentQuarterName === quarterName;
          
          return (
          <button
            key={quarter.quarter_code || quarterName || quarter.quarter}
            className={`quarter-tab ${isActive ? 'active' : ''} ${isLoadingQuarter ? 'loading' : ''}`}
            onClick={async () => {
              // 이미 로딩 중이면 중복 클릭 방지
              if (isLoadingQuarter) return;
              
              const quarterCode = quarter.quarter_code;
              
              // 캐시된 데이터가 있으면 즉시 사용 (초고속 전환!)
              if (quarterDataCache[quarterCode]) {
                const cached = quarterDataCache[quarterCode];
                setQuarterData(cached.quarterData);
                setApiData(cached.apiData);
                setVideos(cached.videos || []);
                setCurrentQuarterData(quarter);
                return;
              }
              
              // 캐시가 없으면 데이터 로드 시작
              setIsLoadingQuarter(true);
              
              try {
                const userCode = matchData?.user_code || sessionStorage.getItem('userCode');
                
                // API 병렬 호출로 속도 개선
                const [apiDataResult, videosResult] = await Promise.all([
                  loadQuarterData(userCode, quarterCode, quarter.team_quarter_code),
                  loadRelatedVideos(quarterCode)
                ]);
                
                // API 데이터로 업데이트
                const newQuarterData = {
                  playerName: matchData?.playerName || "플레이어",
                  playerPosition: "포지션",
                  quarterName: quarter.name,
                  quarterNumber: quarter.quarter,
                  radarData: {
                    체력: 0,
                    순발력: 0,
                    스피드: 0,
                    가속도: 0,
                    스프린트: 0
                  },
                  tHmapData: null,
                  detailStats: {
                    경기시간: "0분",
                    이동거리: "0km",
                    평균속도: "0km/h",
                    최고속도: "0km/h",
                    가속도: "0m/s²",
                    최고가속도: "0m/s²",
                    활동량: "0%",
                    스프린트: "0회",
                    점수: 0
                  },
                  timeInfo: {
                    startTime: "--:--",
                    endTime: "--:--"
                  }
                };
                
                if (apiDataResult) {
                  // API 데이터로 상세 통계 업데이트
                  newQuarterData.detailStats = {
                    경기시간: `${apiDataResult.total_data?.time || 0}분`,
                    이동거리: `${apiDataResult.total_data?.distance || 0}km`,
                    평균속도: `${apiDataResult.total_data?.average_speed || 0}km/h`,
                    최고속도: `${apiDataResult.total_data?.max_speed || 0}km/h`,
                    가속도: `${apiDataResult.total_data?.average_acceleration || 0}m/s²`,
                    최고가속도: `${apiDataResult.total_data?.max_acceleration || 0}m/s²`,
                    활동량: `${apiDataResult.total_data?.movement_ratio || 0}%`,
                    스프린트: `${apiDataResult.total_data?.sprint_count || 0}회`,
                    점수: apiDataResult.point_data?.total || 0
                  };
                  
                  // 레이더 차트 데이터 업데이트
                  newQuarterData.radarData = {
                    체력: apiDataResult.point_data?.stamina || 0,
                    순발력: apiDataResult.point_data?.positiveness || 0,
                    스피드: apiDataResult.point_data?.speed || 0,
                    가속도: apiDataResult.point_data?.acceleration || 0,
                    스프린트: apiDataResult.point_data?.sprint || 0
                  };
                  
                  // 시간 정보 업데이트
                  newQuarterData.timeInfo = {
                    startTime: formatTime(apiDataResult.quarter_info?.start_time),
                    endTime: formatTime(apiDataResult.quarter_info?.end_time)
                  };
                  
                  // T_HMAP 데이터 설정
                  newQuarterData.tHmapData = apiDataResult.total_data?.heatmap_data || null;
                }
                
                // 캐시에 저장 (다음 전환 시 초고속!)
                setQuarterDataCache(prev => ({
                  ...prev,
                  [quarterCode]: {
                    quarterData: newQuarterData,
                    apiData: apiDataResult,
                    videos: videosResult || []
                  }
                }));
                
                // 상태 업데이트
                setQuarterData(newQuarterData);
                setApiData(apiDataResult);
                setVideos(videosResult || []);
                setCurrentQuarterData(quarter);
                
              } catch (error) {
                // 에러 처리
              } finally {
                setIsLoadingQuarter(false);
              }
            }}
          >
            {quarter.name}
            </button>
          );
        })}
        </div>
      </div>

      {/* 팀 분석에서 진입 시 선수 프로필 정보 */}
      {fromTeamAnalysis && (
        <div className="player-profile-card">
          <div className="profile-avatar">
            <img 
              src={matchData?.playerProfileImage || defaultProfile} 
              alt={matchData?.playerName || "선수"}
              onError={(e) => { e.target.src = defaultProfile; }}
            />
          </div>
          <div className="profile-info">
            <div className="profile-header">
              <h4 className="player-name text-h4">{matchData?.playerName || "선수"}</h4>
              <span className={`player-role ${matchData?.playerRole || 'member'}`}>
                {matchData?.playerRole === 'owner' ? '팀장' : 
                 matchData?.playerRole === 'manager' ? '매니저' : '멤버'}
              </span>
            </div>
            <div className="profile-details">
              <span className="player-age text-body-sm">
                {matchData?.playerAge ? `${matchData.playerAge}세` : '나이 미상'}
              </span>
              <span className="player-divider">•</span>
              <span className="player-number text-body-sm">
                {matchData?.playerNumber !== null && matchData?.playerNumber !== undefined ? `${matchData.playerNumber}번` : '등번호 미설정'}
              </span>
              <span className="player-divider">•</span>
              <span className={`player-position ${getPositionClass(matchData?.playerPosition)}`}>
                {matchData?.playerPosition || "포지션 미상"}
              </span>
            </div>
            <div className="profile-meta">
              <span className="player-location text-caption">
                {matchData?.playerActivityArea || '지역 미상'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 쿼터 정보 카드 */}
      <div className="quarter-info-card">
        <div className="quarter-info-section">
          <div className="quarter-info-left">
            <div className="quarter-details">
              <div className="quarter-score">
                {!isRestQuarter && <span className="score-type text-caption">평점</span>}
                <span className="score-number">{isRestQuarter ? "휴식" : (apiData?.point_data?.total || 0)}</span>
                <span className="score-label text-caption">{isRestQuarter ? "" : "점"}</span>
              </div>
              {!isRestQuarter && (
                <div className="quarter-time-info">
                  <p className="time-text text-body">
                    <span className="time-label">경기시간</span> 
                    <span className="time-value">{quarterData.timeInfo.startTime} ~ {quarterData.timeInfo.endTime}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="quarter-info-divider"></div>
          <div className="quarter-info-right">
            <div className="quarter-stat">
              <span className="stat-label text-caption">경기 시간</span>
              <span className="stat-value text-body">{isRestQuarter ? "-" : quarterData.detailStats.경기시간}</span>
            </div>
            <div className="quarter-stat">
              <span className="stat-label text-caption">최고속력</span>
              <span className="stat-value text-body">{isRestQuarter ? "-" : quarterData.detailStats.최고속도}</span>
            </div>
            <div className="quarter-stat">
              <span className="stat-label text-caption">이동거리</span>
              <span className="stat-value text-body">{isRestQuarter ? "-" : quarterData.detailStats.이동거리}</span>
            </div>
            <div className="quarter-stat">
              <span className="stat-label text-caption">스프린트</span>
              <span className="stat-value text-body">{isRestQuarter ? "-" : quarterData.detailStats.스프린트}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 레이더 차트 섹션 - 휴식 쿼터가 아닐 때만 표시 */}
      {!isRestQuarter && (
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <img src={starIcon} alt="OVR 점수" />
          </div>
          <h3 className="section-title text-h3">OVR 점수</h3>
          <button 
            className="collapse-button"
            onClick={() => toggleSection('ovr')}
            aria-label={sectionCollapsed.ovr ? '펼치기' : '접기'}
          >
            <img 
              src={sectionCollapsed.ovr ? downIcon : upIcon} 
              alt={sectionCollapsed.ovr ? '펼치기' : '접기'} 
              className="collapse-icon"
            />
          </button>
        </div>
        {!sectionCollapsed.ovr && (
          <div className="radar-section">
            {generateRadarChart(quarterData.radarData)}
          </div>
        )}
      </div>
      )}

      {/* 히트맵 섹션 - 휴식 쿼터가 아닐 때만 표시 */}
      {!isRestQuarter && (
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <img src={starIcon} alt="이미지 분석" />
          </div>
          <h3 className="section-title text-h3">이미지 분석</h3>
          <button 
            className="collapse-button"
            onClick={() => toggleSection('imageAnalysis')}
            aria-label={sectionCollapsed.imageAnalysis ? '펼치기' : '접기'}
          >
            <img 
              src={sectionCollapsed.imageAnalysis ? downIcon : upIcon} 
              alt={sectionCollapsed.imageAnalysis ? '펼치기' : '접기'} 
              className="collapse-icon"
            />
          </button>
        </div>
        
        {!sectionCollapsed.imageAnalysis && (
          <>
            {/* 탭 메뉴 */}
            <div className="map-tabs">
          <button
            className={`map-tab ${activeMapTab === 'heatmap' ? 'active' : ''}`}
            onClick={() => setActiveMapTab('heatmap')}
          >
            히트맵
          </button>
          <button
            className={`map-tab ${activeMapTab === 'sprint' ? 'active' : ''}`}
            onClick={() => setActiveMapTab('sprint')}
          >
            스프린트
          </button>
          <button
            className={`map-tab ${activeMapTab === 'direction' ? 'active' : ''}`}
            onClick={() => setActiveMapTab('direction')}
          >
            방향전환
          </button>
        </div>

        {/* 탭 내용 */}
        {activeMapTab === 'heatmap' && (() => {
          // apiData가 있으면 apiData 사용, 없으면 quarterData 사용
          const heatmapData = apiData?.total_data?.heatmap_data || quarterData?.tHmapData;
          const standard = apiData?.match_info?.standard || matchData?.standard || "north";
          const home = apiData?.quarter_info?.home || matchData?.home || "west";
          const status = apiData?.quarter_info?.status || quarter?.status || "normal";
          
          return generateHeatmap(heatmapData, standard, home, status);
        })()}
        
        {activeMapTab === 'sprint' && (() => {
          const sprintData = apiData?.total_data?.sprint_map_data || quarterData?.tSmapData;
          return generateSprintArrows(
            processSprintData(sprintData),
            apiData?.match_info?.standard || matchData?.standard || "north", 
            apiData?.quarter_info?.home || matchData?.home || "west"
          );
        })()}
        
        {activeMapTab === 'direction' && (() => {
          const directionData = apiData?.total_data?.direction_map_data || quarterData?.tDmapData;
          return generateDirectionPoints(
            processDirectionData(directionData),
            apiData?.match_info?.standard || matchData?.standard || "north", 
            apiData?.quarter_info?.home || matchData?.home || "west"
          );
        })()}
          </>
        )}
      </div>
      )}

      {/* 경기 영상 섹션 - 영상이 있거나 로딩 중일 때만 표시 */}
      {(videosLoading || videos.length > 0) && (
        <div className="analysis-section">
          <div className="section-header">
            <div className="section-icon">
              <img src={starIcon} alt="경기 영상" />
            </div>
            <h3 className="section-title text-h3">경기 영상</h3>
            {videos.length > 0 && (
              <div className="section-subtitle">
                {videos.length}개
              </div>
            )}
            <button 
              className="collapse-button"
              onClick={() => toggleSection('video')}
              aria-label={sectionCollapsed.video ? '펼치기' : '접기'}
            >
              <img 
                src={sectionCollapsed.video ? downIcon : upIcon} 
                alt={sectionCollapsed.video ? '펼치기' : '접기'} 
                className="collapse-icon"
              />
            </button>
          </div>
          {!sectionCollapsed.video && (
            <div className="video-section">
            {videosLoading ? (
              <div className="video-loading">
                <div className="loading-spinner"></div>
                <p className="text-caption">영상을 불러오는 중...</p>
              </div>
            ) : (
              <div className="video-list">
                {videos.map((video, index) => (
                  <div key={video.video_code} className="video-item">
                    <div className="video-thumbnail" onClick={() => handleVideoClick(video)}>
                      {video.thumbnail_url ? (
                        <div className="video-thumbnail-image">
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.folder_info?.name || `영상 ${index + 1}`}
                            className="thumbnail-img"
                            onError={(e) => {
                              // 썸네일 로드 실패 시 기본 아이콘으로 대체
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="video-fallback" style={{ display: 'none' }}>
                            <span className="play-icon">▶</span>
                          </div>
                          <div className="video-overlay">
                            <span className="play-icon">▶</span>
                          </div>
                        </div>
                      ) : (
                        <div className="video-content">
                          <span className="play-icon">▶</span>
                          <div className="video-info">
                            <p className="video-title text-body">
                              {video.folder_info?.name || `영상 ${index + 1}`}
                            </p>
                            <p className="video-date text-caption">
                              {new Date(video.created_at).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          )}
        </div>
      )}

      {/* 활동량 섹션 - 휴식 쿼터가 아닐 때만 표시 */}
      {!isRestQuarter && (
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <img src={starIcon} alt="활동량" />
          </div>
          <h3 className="section-title text-h3">활동량</h3>
          <button 
            className="collapse-button"
            onClick={() => toggleSection('activity')}
            aria-label={sectionCollapsed.activity ? '펼치기' : '접기'}
          >
            <img 
              src={sectionCollapsed.activity ? downIcon : upIcon} 
              alt={sectionCollapsed.activity ? '펼치기' : '접기'} 
              className="collapse-icon"
            />
          </button>
        </div>
        
        {!sectionCollapsed.activity && (
          <>
            {/* 공격/수비 비율 막대 그래프 */}
            <div className="activity-ratio-chart">
          <div className="ratio-bar-container">
            {/* 막대 위 텍스트 */}
            <div className="ratio-labels">
              <span className="ratio-label-left text-caption">공격</span>
              <span className="ratio-label-right text-caption">수비</span>
            </div>
            
            <div className="ratio-bar">
              {(() => {
                // 백분율 계산 (합이 100%가 되도록)
                const attackPercentage = parseFloat(apiData?.attack_data?.time_percentage || 0);
                const defensePercentage = parseFloat(apiData?.defense_data?.time_percentage || 0);
                const total = attackPercentage + defensePercentage;
                
                let normalizedAttack = 50;
                let normalizedDefense = 50;
                
                if (total > 0) {
                  normalizedAttack = (attackPercentage / total) * 100;
                  normalizedDefense = (defensePercentage / total) * 100;
                }
                
                return (
                  <>
                    <div 
                      className="ratio-attack" 
                      style={{
                        width: `${normalizedAttack}%`,
                        backgroundColor: '#FF4444'
                      }}
                    >
                      <span className="ratio-text">{normalizedAttack.toFixed(1)}%</span>
                    </div>
                    <div 
                      className="ratio-defense" 
                      style={{
                        width: `${normalizedDefense}%`,
                        backgroundColor: '#4466FF'
                      }}
                    >
                      <span className="ratio-text">{normalizedDefense.toFixed(1)}%</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
        
        {/* 활동량 탭 메뉴 */}
        <div className="activity-tabs">
          <button
            className={`activity-tab ${activeActivityTab === 'total' ? 'active' : ''}`}
            onClick={() => setActiveActivityTab('total')}
          >
            전체
          </button>
          <button
            className={`activity-tab ${activeActivityTab === 'attack' ? 'active' : ''}`}
            onClick={() => setActiveActivityTab('attack')}
          >
            공격
          </button>
          <button
            className={`activity-tab ${activeActivityTab === 'defense' ? 'active' : ''}`}
            onClick={() => setActiveActivityTab('defense')}
          >
            수비
          </button>
        </div>

        {/* 활동량 탭 내용 */}
        <div className="activity-details">
          {activeActivityTab === 'total' && (
            <div className="activity-stats-grid">
              <div className="activity-stat">
                <span className="stat-label text-caption">활동시간</span>
                <span className="stat-value text-body">{formatValue(apiData?.total_data?.time, '분')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">이동거리</span>
                <span className="stat-value text-body">{formatValue(apiData?.total_data?.distance, 'km')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">분당 이동거리</span>
                <span className="stat-value text-body">{formatValue(apiData?.total_data?.distance_per_minute ? parseFloat(apiData.total_data.distance_per_minute).toFixed(1) : 0, 'm')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">활동 범위</span>
                <span className="stat-value text-body">{formatValue(apiData?.total_data?.movement_ratio ? parseFloat(apiData.total_data.movement_ratio).toFixed(1) : 0, '%')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">완만한 방향전환 횟수</span>
                <span className="stat-value text-body">{formatValue(apiData?.total_data?.direction_change_90_150, '회')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">급격한 방향전환 횟수</span>
                <span className="stat-value text-body">{formatValue(apiData?.total_data?.direction_change_150_180, '회')}</span>
              </div>
            </div>
          )}
          
          {activeActivityTab === 'attack' && (
            <div className="activity-stats-grid">
              <div className="activity-stat">
                <span className="stat-label text-caption">공격지역 활동시간</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.time, '분')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">공격지역 이동거리</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.distance, 'km')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">공격지역 분당 이동거리</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.distance_per_minute, 'm')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">공격지역 내 활동 범위</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.movement_ratio ? parseFloat(apiData.attack_data.movement_ratio).toFixed(1) : 0, '%')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">공격지역 내 완만한 방향전환</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.direction_change_90_150, '회')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">공격지역 내 급격한 방향전환</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.direction_change_150_180, '회')}</span>
              </div>
            </div>
          )}
          
          {activeActivityTab === 'defense' && (
            <div className="activity-stats-grid">
              <div className="activity-stat">
                <span className="stat-label text-caption">수비지역 활동시간</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.time, '분')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">수비지역 이동거리</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.distance ? parseFloat(apiData.defense_data.distance).toFixed(2) : 0, 'km')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">수비지역 내 분당 이동거리</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.distance_per_minute ? parseFloat(apiData.defense_data.distance_per_minute).toFixed(1) : 0, 'm')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">수비지역 내 활동 범위</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.movement_ratio ? parseFloat(apiData.defense_data.movement_ratio).toFixed(1) : 0, '%')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">수비지역 내 완만한 방향전환</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.direction_change_90_150, '회')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">수비지역 내 급격한 방향전환</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.direction_change_150_180, '회')}</span>
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </div>
      )}

      {/* 속력 및 가속도 섹션 - 휴식 쿼터가 아닐 때만 표시 */}
      {!isRestQuarter && (
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <img src={speedIcon} alt="속력" />
          </div>
          <h3 className="section-title text-h3">속력 및 가속도</h3>
          <button 
            className="collapse-button"
            onClick={() => toggleSection('speed')}
            aria-label={sectionCollapsed.speed ? '펼치기' : '접기'}
          >
            <img 
              src={sectionCollapsed.speed ? downIcon : upIcon} 
              alt={sectionCollapsed.speed ? '펼치기' : '접기'} 
              className="collapse-icon"
            />
          </button>
        </div>
        
        {!sectionCollapsed.speed && (
          <>
            {/* 속력/가속도 탭 메뉴 */}
            <div className="speed-tabs">
          <button
            className={`speed-tab ${activeSpeedTab === 'speed' ? 'active' : ''}`}
            onClick={() => setActiveSpeedTab('speed')}
          >
            속력
          </button>
          <button
            className={`speed-tab ${activeSpeedTab === 'acceleration' ? 'active' : ''}`}
            onClick={() => setActiveSpeedTab('acceleration')}
          >
            가속도
          </button>
        </div>

        {/* 속력/가속도 탭 내용 */}
        <div className="speed-content">
          {activeSpeedTab === 'speed' && (
            <div className="speed-analysis">
              {/* 속력 그래프 */}
              <div className="speed-charts">
                <div className="speed-chart-row">
                  <div className="speed-item speed-graph-item">
                    <span className="speed-label text-caption">평균 속력 그래프</span>
                    <div className="speed-chart-container">
                      <svg className="speed-chart" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
                        {(() => {
                          // average_speed_list는 JSONField로 이미 파싱된 배열이거나 문자열일 수 있음
                          let speedData = null;
                          try {
                            const rawData = apiData?.total_data?.average_speed_list;
                            if (rawData) {
                              // 이미 배열인 경우 그대로 사용
                              if (Array.isArray(rawData)) {
                                speedData = rawData;
                              } 
                              // 문자열인 경우 JSON 파싱
                              else if (typeof rawData === 'string') {
                                speedData = JSON.parse(rawData);
                              }
                              // 그 외의 경우 그대로 사용 시도
                              else {
                                speedData = rawData;
                              }
                            }
                          } catch (error) {
                            // 파싱 오류 처리
                          }
                          
                          if (!speedData || !Array.isArray(speedData) || speedData.length === 0) {
                            return (
                              <g>
                                <text x="200" y="90" textAnchor="middle" fill="#8A8F98" fontSize="14" fontWeight="500">
                                  충분한 속력 데이터가 없습니다
                                </text>
                              </g>
                            );
                          }
                          
                          const margin = { top: 35, right: 25, bottom: 25, left: 45 };
                          const chartWidth = 400 - margin.left - margin.right;
                          const chartHeight = 180 - margin.top - margin.bottom;
                          
                          const maxSpeed = Math.max(...speedData);
                          const minSpeed = Math.min(...speedData);
                          const range = maxSpeed - minSpeed || 1;
                          
                          // 더 부드러운 곡선을 위한 스플라인 보간
                          const createSmoothPath = (data) => {
                            if (data.length < 2) return '';
                            
                            const points = data.map((value, index) => ({
                              x: margin.left + (index / (data.length - 1)) * chartWidth,
                              y: margin.top + chartHeight - ((value - minSpeed) / range) * chartHeight
                            }));
                            
                            let path = `M ${points[0].x} ${points[0].y}`;
                            
                            for (let i = 1; i < points.length; i++) {
                              const prev = points[i - 1];
                              const curr = points[i];
                              const next = points[i + 1];
                              
                              if (i === 1) {
                                // 첫 번째 세그먼트
                                const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                                const cp1y = prev.y;
                                const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                                const cp2y = curr.y;
                                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                              } else if (i === points.length - 1) {
                                // 마지막 세그먼트
                                const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                                const cp1y = prev.y;
                                const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                                const cp2y = curr.y;
                                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                              } else {
                                // 중간 세그먼트 - 더 자연스러운 곡선
                                const prevPrev = points[i - 2];
                                const tension = 0.3;
                                
                                const cp1x = prev.x + (curr.x - prevPrev.x) * tension;
                                const cp1y = prev.y + (curr.y - prevPrev.y) * tension;
                                const cp2x = curr.x - (next.x - prev.x) * tension;
                                const cp2y = curr.y - (next.y - prev.y) * tension;
                                
                                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                              }
                            }
                            
                            return path;
                          };
                          
                          return (
                            <>
                              {/* 그라데이션 정의 */}
                              <defs>
                                <linearGradient id="speedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="rgba(7, 150, 105, 0.3)" />
                                  <stop offset="100%" stopColor="rgba(7, 150, 105, 0.05)" />
                                </linearGradient>
                              </defs>
                              
                              {/* 격자선 - 미니멀한 스타일 */}
                              {[0.25, 0.5, 0.75].map((ratio, index) => (
                                <line 
                                  key={`grid-${index}`}
                                  x1={margin.left} 
                                  y1={margin.top + chartHeight * ratio} 
                                  x2={margin.left + chartWidth} 
                                  y2={margin.top + chartHeight * ratio} 
                                  stroke="#E2E8F0" 
                                  strokeWidth="0.5"
                                  opacity="0.6"
                                />
                              ))}
                              
                              {/* Y축 라벨 - 간소화 */}
                              {[0, 0.5, 1].map((ratio, index) => {
                                const value = minSpeed + (range * ratio);
                                const y = margin.top + chartHeight - (ratio * chartHeight);
                                return (
                                  <text 
                                    key={index}
                                    x={margin.left - 8} 
                                    y={y + 4} 
                                    fontSize="11" 
                                    fill="#8A8F98" 
                                    textAnchor="end"
                                  >
                                    {value.toFixed(0)}
                                  </text>
                                );
                              })}
                              
                              {/* X축 라벨 - 5분 단위 */}
                              {(() => {
                                const totalTime = apiData?.total_data?.time || 0;
                                const timeInterval = Math.max(5, Math.ceil(totalTime / 5) * 5 / 5); // 최소 5분, 5분 단위로
                                const timeLabels = [];
                                
                                for (let i = 0; i <= 5; i++) {
                                  const timeValue = i * timeInterval;
                                  if (timeValue <= totalTime) {
                                    timeLabels.push({
                                      ratio: timeValue / totalTime,
                                      label: `${timeValue}분`
                                    });
                                  }
                                }
                                
                                return timeLabels.map((item, index) => {
                                  const x = margin.left + (item.ratio * chartWidth);
                                  return (
                                    <text 
                                      key={index}
                                      x={x} 
                                      y={margin.top + chartHeight + 20} 
                                      fontSize="11" 
                                      fill="#8A8F98" 
                                      textAnchor="middle"
                                    >
                                      {item.label}
                                    </text>
                                  );
                                });
                              })()}
                              
                              {/* 영역 채우기 */}
                              <path
                                d={`${createSmoothPath(speedData)} L ${margin.left + chartWidth} ${margin.top + chartHeight} L ${margin.left} ${margin.top + chartHeight} Z`}
                                fill="url(#speedGradient)"
                              />
                              
                              {/* 메인 라인 - 디자인 시스템 색상 사용 */}
                              <path
                                d={createSmoothPath(speedData)}
                                fill="none"
                                stroke="#079669"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              
                              {/* 데이터 포인트 - 더 작게 */}
                              {speedData.map((value, index) => {
                                if (index % Math.ceil(speedData.length / 8) !== 0) return null; // 일부만 표시
                                const x = margin.left + (index / (speedData.length - 1)) * chartWidth;
                                const y = margin.top + chartHeight - ((value - minSpeed) / range) * chartHeight;
                                return (
                                  <circle
                                    key={index}
                                    cx={x}
                                    cy={y}
                                    r="2"
                                    fill="#079669"
                                  />
                                );
                              })}
                              
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 속력 상세 정보 */}
              <div className="speed-stats-grid">
                <div className="speed-stat">
                  <span className="stat-label text-caption">최고 속력</span>
                  <span className="stat-value text-body">{formatValue(apiData?.total_data?.max_speed, 'km/h')}</span>
                </div>
                <div className="speed-stat">
                  <span className="stat-label text-caption">평균 속력</span>
                  <span className="stat-value text-body">{formatValue(apiData?.total_data?.average_speed, 'km/h')}</span>
                </div>
              </div>
            </div>
          )}
          
          {activeSpeedTab === 'acceleration' && (
            <div className="acceleration-analysis">
              {/* 가속도 그래프 */}
              <div className="acceleration-charts">
                <div className="acceleration-chart-row">
                  <div className="acceleration-item acceleration-graph-item">
                    <span className="acceleration-label text-caption">평균 가속도 그래프</span>
                    <div className="acceleration-chart-container">
                      <svg className="acceleration-chart" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
                        {(() => {
                          // average_acceleration_list는 JSONField로 이미 파싱된 배열이거나 문자열일 수 있음
                          let accelerationData = null;
                          try {
                            const rawData = apiData?.total_data?.average_acceleration_list;
                            if (rawData) {
                              // 이미 배열인 경우 그대로 사용
                              if (Array.isArray(rawData)) {
                                accelerationData = rawData;
                              } 
                              // 문자열인 경우 JSON 파싱
                              else if (typeof rawData === 'string') {
                                accelerationData = JSON.parse(rawData);
                              }
                              // 그 외의 경우 그대로 사용 시도
                              else {
                                accelerationData = rawData;
                              }
                            }
                          } catch (error) {
                            // 파싱 오류 처리
                          }
                          
                          if (!accelerationData || !Array.isArray(accelerationData) || accelerationData.length === 0) {
                            return (
                              <g>
                                <text x="200" y="90" textAnchor="middle" fill="#8A8F98" fontSize="14" fontWeight="500">
                                  충분한 가속도 데이터가 없습니다
                                </text>
                              </g>
                            );
                          }
                          
                          const margin = { top: 35, right: 25, bottom: 25, left: 45 };
                          const chartWidth = 400 - margin.left - margin.right;
                          const chartHeight = 180 - margin.top - margin.bottom;
                          
                          const maxAcceleration = Math.max(...accelerationData);
                          const minAcceleration = Math.min(...accelerationData);
                          const range = maxAcceleration - minAcceleration || 1;
                          
                          // 더 부드러운 곡선을 위한 스플라인 보간
                          const createSmoothPath = (data) => {
                            if (data.length < 2) return '';
                            
                            const points = data.map((value, index) => ({
                              x: margin.left + (index / (data.length - 1)) * chartWidth,
                              y: margin.top + chartHeight - ((value - minAcceleration) / range) * chartHeight
                            }));
                            
                            let path = `M ${points[0].x} ${points[0].y}`;
                            
                            for (let i = 1; i < points.length; i++) {
                              const prev = points[i - 1];
                              const curr = points[i];
                              const next = points[i + 1];
                              
                              if (i === 1) {
                                // 첫 번째 세그먼트
                                const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                                const cp1y = prev.y;
                                const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                                const cp2y = curr.y;
                                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                              } else if (i === points.length - 1) {
                                // 마지막 세그먼트
                                const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                                const cp1y = prev.y;
                                const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                                const cp2y = curr.y;
                                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                              } else {
                                // 중간 세그먼트 - 더 자연스러운 곡선
                                const prevPrev = points[i - 2];
                                const tension = 0.3;
                                
                                const cp1x = prev.x + (curr.x - prevPrev.x) * tension;
                                const cp1y = prev.y + (curr.y - prevPrev.y) * tension;
                                const cp2x = curr.x - (next.x - prev.x) * tension;
                                const cp2y = curr.y - (next.y - prev.y) * tension;
                                
                                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                              }
                            }
                            
                            return path;
                          };
                          
                          return (
                            <>
                              {/* 그라데이션 정의 */}
                              <defs>
                                <linearGradient id="accelerationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
                                </linearGradient>
                              </defs>
                              
                              {/* 격자선 - 미니멀한 스타일 */}
                              {[0.25, 0.5, 0.75].map((ratio, index) => (
                                <line 
                                  key={`grid-acc-${index}`}
                                  x1={margin.left} 
                                  y1={margin.top + chartHeight * ratio} 
                                  x2={margin.left + chartWidth} 
                                  y2={margin.top + chartHeight * ratio} 
                                  stroke="#E2E8F0" 
                                  strokeWidth="0.5"
                                  opacity="0.6"
                                />
                              ))}
                              
                              {/* Y축 라벨 - 간소화 */}
                              {[0, 0.5, 1].map((ratio, index) => {
                                const value = minAcceleration + (range * ratio);
                                const y = margin.top + chartHeight - (ratio * chartHeight);
                                return (
                                  <text 
                                    key={index}
                                    x={margin.left - 8} 
                                    y={y + 4} 
                                    fontSize="11" 
                                    fill="#8A8F98" 
                                    textAnchor="end"
                                  >
                                    {value.toFixed(0)}
                                  </text>
                                );
                              })}
                              
                              {/* X축 라벨 - 5분 단위 */}
                              {(() => {
                                const totalTime = apiData?.total_data?.time || 0;
                                const timeInterval = Math.max(5, Math.ceil(totalTime / 5) * 5 / 5); // 최소 5분, 5분 단위로
                                const timeLabels = [];
                                
                                for (let i = 0; i <= 5; i++) {
                                  const timeValue = i * timeInterval;
                                  if (timeValue <= totalTime) {
                                    timeLabels.push({
                                      ratio: timeValue / totalTime,
                                      label: `${timeValue}분`
                                    });
                                  }
                                }
                                
                                return timeLabels.map((item, index) => {
                                  const x = margin.left + (item.ratio * chartWidth);
                                  return (
                                    <text 
                                      key={index}
                                      x={x} 
                                      y={margin.top + chartHeight + 20} 
                                      fontSize="11" 
                                      fill="#8A8F98" 
                                      textAnchor="middle"
                                    >
                                      {item.label}
                                    </text>
                                  );
                                });
                              })()}
                              
                              {/* 영역 채우기 */}
                              <path
                                d={`${createSmoothPath(accelerationData)} L ${margin.left + chartWidth} ${margin.top + chartHeight} L ${margin.left} ${margin.top + chartHeight} Z`}
                                fill="url(#accelerationGradient)"
                              />
                              
                              {/* 메인 라인 - 디자인 시스템 색상 사용 */}
                              <path
                                d={createSmoothPath(accelerationData)}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              
                              {/* 데이터 포인트 - 더 작게 */}
                              {accelerationData.map((value, index) => {
                                if (index % Math.ceil(accelerationData.length / 8) !== 0) return null; // 일부만 표시
                                const x = margin.left + (index / (accelerationData.length - 1)) * chartWidth;
                                const y = margin.top + chartHeight - ((value - minAcceleration) / range) * chartHeight;
                                return (
                                  <circle
                                    key={index}
                                    cx={x}
                                    cy={y}
                                    r="2"
                                    fill="#3b82f6"
                                  />
                                );
                              })}
                              
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 가속도 상세 정보 */}
              <div className="acceleration-stats-grid">
                <div className="acceleration-stat">
                  <span className="stat-label text-caption">최고 가속도</span>
                  <span className="stat-value text-body">{formatValue(apiData?.total_data?.max_acceleration ? parseFloat(apiData.total_data.max_acceleration).toFixed(2) : 0, 'm/s²')}</span>
                </div>
                <div className="acceleration-stat">
                  <span className="stat-label text-caption">평균 가속도</span>
                  <span className="stat-value text-body">{formatValue(apiData?.total_data?.average_acceleration ? parseFloat(apiData.total_data.average_acceleration).toFixed(2) : 0, 'm/s²')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </div>
      )}

      {/* 스프린트 섹션 - 휴식 쿼터가 아닐 때만 표시 */}
      {!isRestQuarter && (
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <img src={starIcon} alt="스프린트" />
          </div>
          <h3 className="section-title text-h3">스프린트</h3>
          <button 
            className="collapse-button"
            onClick={() => toggleSection('sprint')}
            aria-label={sectionCollapsed.sprint ? '펼치기' : '접기'}
          >
            <img 
              src={sectionCollapsed.sprint ? downIcon : upIcon} 
              alt={sectionCollapsed.sprint ? '펼치기' : '접기'} 
              className="collapse-icon"
            />
          </button>
        </div>
        
        {!sectionCollapsed.sprint && (
          <>
            {/* 스프린트 성능 지표 */}
            <div className="activity-stats-grid sprint-grid-2x5">
          {/* 첫 번째 행 */}
          <div className="activity-stat">
            <span className="stat-label text-caption">총 스프린트 횟수</span>
            <span className="stat-value text-body">{formatValue(apiData?.total_data?.sprint_count, '회')}</span>
          </div>
          <div className="activity-stat">
            <span className="stat-label text-caption">평균 스프린트 거리</span>
            <span className="stat-value text-body">{formatValue(apiData?.total_data?.sprint_average_distance ? parseFloat(apiData.total_data.sprint_average_distance).toFixed(2) : 0, 'm')}</span>
          </div>
          
          {/* 두 번째 행 */}
          <div className="activity-stat">
            <span className="stat-label text-caption">평균 스프린트 속력</span>
            <span className="stat-value text-body">{formatValue(apiData?.total_data?.sprint_average_speed ? parseFloat(apiData.total_data.sprint_average_speed).toFixed(2) : 0, 'km/h')}</span>
          </div>
          <div className="activity-stat">
            <span className="stat-label text-caption">평균 스프린트 가속도</span>
            <span className="stat-value text-body">{formatValue(apiData?.total_data?.sprint_average_acceleration ? parseFloat(apiData.total_data.sprint_average_acceleration).toFixed(2) : 0, 'm/s²')}</span>
          </div>
          
          {/* 세 번째 행 */}
          <div className="activity-stat">
            <span className="stat-label text-caption">전체 스프린트 거리 합</span>
            <span className="stat-value text-body">{formatValue(apiData?.total_data?.sprint_total_distance ? parseFloat(apiData.total_data.sprint_total_distance).toFixed(2) : 0, 'm')}</span>
          </div>
          <div className="activity-stat">
            <span className="stat-label text-caption">최고 스프린트 거리</span>
            <span className="stat-value text-body">{formatValue(apiData?.total_data?.sprint_max_distance ? parseFloat(apiData.total_data.sprint_max_distance).toFixed(2) : 0, 'm')}</span>
          </div>
          
          {/* 네 번째 행 */}
          <div className="activity-stat">
            <span className="stat-label text-caption">최저 스프린트 거리</span>
            <span className="stat-value text-body">{formatValue(apiData?.total_data?.sprint_min_distance ? parseFloat(apiData.total_data.sprint_min_distance).toFixed(2) : 0, 'm')}</span>
          </div>
          <div className="activity-stat">
            <span className="stat-label text-caption">최고 스프린트 속력</span>
            <span className="stat-value text-body">{formatValue(apiData?.total_data?.sprint_max_speed ? parseFloat(apiData.total_data.sprint_max_speed).toFixed(1) : 0, 'km/h')}</span>
          </div>
          
          {/* 다섯 번째 행 */}
          <div className="activity-stat">
            <span className="stat-label text-caption">최고 스프린트 가속도</span>
            <span className="stat-value text-body">{formatValue(apiData?.total_data?.sprint_max_acceleration ? parseFloat(apiData.total_data.sprint_max_acceleration).toFixed(1) : 0, 'm/s²')}</span>
          </div>
          <div className="activity-stat">
            <span className="stat-label text-caption">이동거리 당 스프린트 거리 비율</span>
            <span className="stat-value text-body">{formatValue(apiData?.total_data?.sprint_distance_percentage ? parseFloat(apiData.total_data.sprint_distance_percentage).toFixed(2) : 0, '%')}</span>
          </div>
        </div>
          </>
        )}
      </div>
      )}
    </div>
  );
};

export default Anal_Detail;
