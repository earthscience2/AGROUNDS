import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/Anal_Detail.scss';
import { GetQuarterDataApi } from '../../../function/api/anal/analApi';
import { GetMatchDetailApi } from '../../../function/api/match/matchApi';
import { GetVideosByQuarterApi } from '../../../function/api/video/videoApi';

// 아이콘 import
import starIcon from '../../../assets/common/star.png';
import speedIcon from '../../../assets/common/star.png';
import distanceIcon from '../../../assets/common/location.png';
import timeIcon from '../../../assets/common/clock.png';
import chartIcon from '../../../assets/common/graph-black.png';

// 더미 프로필 이미지 import
import defaultProfile from '../../../assets/common/default_profile.png';

// 접기/펼치기 버튼 이미지 import
import upIcon from '../../../assets/common/up.png';
import downIcon from '../../../assets/common/down.png';

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
  
  // 각 섹션별 접기/펼치기 상태
  const [sectionCollapsed, setSectionCollapsed] = useState({
    ovr: false,
    imageAnalysis: false,
    activity: false,
    sprint: false,
    video: false,
    speed: false
  });
  
  // state에서 전달받은 데이터
  const { quarter, matchData } = location.state || {};

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
    console.log('🔍 processHeatmapData 호출:', tHmapData);
    console.log('🔍 tHmapData 타입:', typeof tHmapData);
    console.log('🔍 tHmapData 구조:', tHmapData ? Object.keys(tHmapData) : 'null');
    
    if (!tHmapData) {
      console.log('❌ tHmapData가 null 또는 undefined');
      return null;
    }
    
    if (!tHmapData.layers) {
      console.log('❌ tHmapData.layers가 없음');
      return null;
    }
    
    if (tHmapData.layers.length === 0) {
      console.log('❌ tHmapData.layers가 빈 배열');
      return null;
    }
    
    console.log('✅ tHmapData.layers 확인:', tHmapData.layers);
    console.log('✅ tHmapData.layers 길이:', tHmapData.layers.length);

    try {
      const layer = tHmapData.layers[0];
      console.log('🔍 레이어 상세 정보:', layer);
      
      const { shape, b64, dtype } = layer;
      console.log('🔍 shape:', shape, 'dtype:', dtype, 'b64 길이:', b64 ? b64.length : 'null');
      
      if (!shape || !b64) {
        console.log('❌ 필수 필드 누락 - shape:', shape, 'b64:', !!b64);
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
      console.error('T_HMAP 데이터 처리 오류:', error);
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

  // 라벨 위치 계산
  const getLabelPositions = (centerX, centerY, radius, data) => {
    const radarChartData = [
      { label: '체력', value: data.체력 || 0 },
      { label: '순발력', value: data.순발력 || 0 },
      { label: '스피드', value: data.스피드 || 0 },
      { label: '가속도', value: data.가속도 || 0 },
      { label: '스프린트', value: data.스프린트 || 0 },
      { label: '평점', value: data.평점 || 0 }
    ];
    
    return radarChartData.map((item, i) => {
      const angle = (Math.PI / 180) * (i * 60 - 90);
      const labelRadius = radius + 25;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      return { x, y, label: item.label, value: item.value };
    });
  };

  // 6가지 지표의 평균 계산 함수
  const calculateAverageOVR = (data) => {
    const values = [
      data.체력 || 0,
      data.순발력 || 0,
      data.스피드 || 0,
      data.가속도 || 0,
      data.스프린트 || 0,
      data.평점 || 0
    ];
    const validValues = values.filter(value => value > 0); // 0보다 큰 값들만 계산
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, value) => acc + value, 0);
    return Math.round(sum / validValues.length);
  };

  // 레이더 차트 SVG 생성 (메인 페이지와 동일한 디자인)
  const generateRadarChart = (data) => {
    console.log('🔍 레이더 차트 데이터:', data);
    const radarChartData = [
      { label: '체력', value: data.체력 || 0 },
      { label: '순발력', value: data.순발력 || 0 },
      { label: '스피드', value: data.스피드 || 0 },
      { label: '가속도', value: data.가속도 || 0 },
      { label: '스프린트', value: data.스프린트 || 0 },
      { label: '평점', value: data.평점 || 0 }
    ];
    console.log('🔍 레이더 차트 배열 데이터:', radarChartData);
    console.log('🔍 계산된 평균 OVR:', calculateAverageOVR(data));

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
          
          {/* 중앙 OVR 점수 (6가지 지표의 평균, 정수로 표시, 검은색) */}
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="48"
            fontWeight="800"
            fill="#000000"
          >
            {calculateAverageOVR(data)}
          </text>
        </svg>
      </div>
    );
  };


  // T_SMAP 데이터 처리 함수 (스프린트)
  const processSprintData = (smapData) => {
    console.log('🔍 processSprintData 호출:', smapData);
    console.log('🔍 smapData 타입:', typeof smapData);
    console.log('🔍 smapData 구조:', smapData ? Object.keys(smapData) : 'null');
    
    if (!smapData || !smapData.layers || smapData.layers.length < 3) {
      console.log('❌ smapData가 없거나 layers가 부족함');
      return null;
    }

    try {
      console.log('🔍 smapData.layers 상세:', smapData.layers);
      console.log('🔍 layers 길이:', smapData.layers.length);
      
      const countLayer = smapData.layers[0];
      const angleLayer = smapData.layers[1];
      const vmaxLayer = smapData.layers[2];
      
      console.log('🔍 countLayer:', countLayer);
      console.log('🔍 angleLayer:', angleLayer);
      console.log('🔍 vmaxLayer:', vmaxLayer);

      const count = processHeatmapData({ layers: [countLayer] });
      const angle = processHeatmapData({ layers: [angleLayer] });
      const vmax = processHeatmapData({ layers: [vmaxLayer] });
      
      console.log('🔍 처리 결과 - count:', count);
      console.log('🔍 처리 결과 - angle:', angle);
      console.log('🔍 처리 결과 - vmax:', vmax);

      if (!count || !angle || !vmax) {
        console.log('❌ 레이어 처리 실패');
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
      console.error('T_SMAP 데이터 처리 오류:', error);
      return null;
    }
  };

  // T_DMAP 데이터 처리 함수 (방향전환)
  const processDirectionData = (dmapData) => {
    console.log('🔍 processDirectionData 호출:', dmapData);
    console.log('🔍 dmapData 타입:', typeof dmapData);
    console.log('🔍 dmapData 구조:', dmapData ? Object.keys(dmapData) : 'null');
    
    if (!dmapData || !dmapData.layers || dmapData.layers.length < 2) {
      console.log('❌ dmapData가 없거나 layers가 부족함');
      return null;
    }

    try {
      console.log('🔍 dmapData.layers 상세:', dmapData.layers);
      console.log('🔍 layers 길이:', dmapData.layers.length);
      
      const ldtLayer = dmapData.layers[0]; // 저각 방향전환
      const hdtLayer = dmapData.layers[1]; // 고각 방향전환
      
      console.log('🔍 ldtLayer:', ldtLayer);
      console.log('🔍 hdtLayer:', hdtLayer);

      const ldt = processHeatmapData({ layers: [ldtLayer] });
      const hdt = processHeatmapData({ layers: [hdtLayer] });
      
      console.log('🔍 처리 결과 - ldt:', ldt);
      console.log('🔍 처리 결과 - hdt:', hdt);

      if (!ldt || !hdt) {
        console.log('❌ 방향전환 레이어 처리 실패');
        return null;
      }

      return {
        ldt: ldt.data,
        hdt: hdt.data,
        width: ldt.width,
        height: ldt.height
      };
    } catch (error) {
      console.error('T_DMAP 데이터 처리 오류:', error);
      return null;
    }
  };

  // 실제 T_HMAP 데이터로 히트맵 생성
  const generateHeatmap = (tHmapData, standard = "north", home = "west", status = "normal") => {
    console.log('🔍 generateHeatmap 호출 - tHmapData:', tHmapData);
    console.log('🔍 generateHeatmap 파라미터:', { standard, home, status });
    
    const processedData = processHeatmapData(tHmapData);
    console.log('🔍 generateHeatmap - processedData:', processedData);
    
    if (!processedData) {
      // T_HMAP 데이터가 없는 경우 기본 히트맵 표시
      console.log('❌ generateHeatmap - processedData가 null, 플레이스홀더 표시');
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
    
    console.log('🔍 히트맵 정규화 정보:', { vmax, dataSize: smoothedData.length });
    console.log('🔍 경기장 설정:', { standard, home, status });
    
    // 히트맵 데이터 경계 분석
    const dataHeight = smoothedData.length;
    const dataWidth = smoothedData[0] ? smoothedData[0].length : 0;
    console.log('🔍 히트맵 데이터 크기:', { width: dataWidth, height: dataHeight });
    
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
    
    console.log('🔍 히트맵 데이터 경계:', { 
      hasData, 
      minX, maxX, minY, maxY,
      dataRangeX: maxX - minX,
      dataRangeY: maxY - minY
    });
    
    // 경기장 이미지 크기 (9:6 비율로 고정)
    const fieldWidth = 360;  // SVG viewBox width
    const fieldHeight = 240; // SVG viewBox height (9:6 비율)
    
    // 경기장 이미지 선택 (status와 home에 따라)
    let fieldImage;
    console.log('🔍 경기장 이미지 선택 로직:', { status, home, standard });
    
    // status에 따른 경기장 방향 결정
    const isAttackPhase = status === "attack" || status === "offensive" || status === "attacking";
    const isDefensePhase = status === "defense" || status === "defensive" || status === "defending";
    
    if (isAttackPhase) {
      // 공격 상황일 때 - 상대편 골대 방향
      if (standard === "south") {
        fieldImage = home === "east" ? groundRight : groundLeft;
      } else { // north
        fieldImage = home === "west" ? groundRight : groundLeft;
      }
    } else if (isDefensePhase) {
      // 수비 상황일 때 - 우리편 골대 방향
      if (standard === "south") {
        fieldImage = home === "west" ? groundRight : groundLeft;
      } else { // north
        fieldImage = home === "east" ? groundRight : groundLeft;
      }
    } else {
      // 일반 상황일 때 (기존 로직)
      fieldImage = (standard === "south" && home === "east") || 
                   (standard === "north" && home === "west") ? groundRight : groundLeft;
    }
    
    console.log('🔍 선택된 경기장 이미지:', fieldImage === groundLeft ? 'groundLeft' : 'groundRight');
    console.log('🔍 경기장 이미지 경로:', fieldImage);
    console.log('🔍 SVG 크기:', { fieldWidth, fieldHeight });
    
    // extent 설정 (경기장 좌표) - Python 코드와 동일
    const extent = standard === "south" ? [90, 0, 60, 0] : [0, 90, 0, 60];
    console.log('🔍 extent 설정:', extent);
    
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
                        if (standard === "south") {
                          // south: extent = [90, 0, 60, 0]
                          x = 90 - (normalizedX * 90); // 90에서 0으로
                          y = 60 - (normalizedY * 60); // 60에서 0으로
                        } else {
                          // north: extent = [0, 90, 0, 60]
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
        <p className="heatmap-legend text-caption">※ 히트맵은 플레이어의 활동 위치와 시간을 색상으로 표시합니다 (파랑색: 낮은 활동량, 빨간색: 높은 활동량)</p>
      </div>
    );
  };

  // 스프린트 화살표 생성
  const generateSprintArrows = (sprintData, standard = "north", home = "west") => {
    console.log('🔍 generateSprintArrows 호출 - sprintData:', sprintData);
    
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
    
    // 경기장 이미지 선택
    let fieldImage;
    const isAttackPhase = false; // 기본값
    const isDefensePhase = false; // 기본값
    
    if (isAttackPhase) {
      fieldImage = standard === "south" ? 
        (home === "east" ? groundRight : groundLeft) :
        (home === "west" ? groundRight : groundLeft);
    } else if (isDefensePhase) {
      fieldImage = standard === "south" ? 
        (home === "west" ? groundRight : groundLeft) :
        (home === "east" ? groundRight : groundLeft);
    } else {
      fieldImage = (standard === "south" && home === "east") || 
                   (standard === "north" && home === "west") ? groundRight : groundLeft;
    }

    const extent = standard === "south" ? [90, 0, 60, 0] : [0, 90, 0, 60];
    const level_3 = 24.0;
    const level_2 = 21.0;
    const maxLen = 16.0;

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
                  if (standard === "south") {
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
                  
                  return (
                    <g key={`sprint-${i}-${j}`}>
                      <line
                        x1={svgX}
                        y1={svgY}
                        x2={svgX + dx}
                        y2={svgY + dy}
                        stroke={color}
                        strokeWidth="2"
                        opacity="0.85"
                      />
                      <polygon
                        points={`${svgX + dx},${svgY + dy} ${svgX + dx - 3},${svgY + dy - 3} ${svgX + dx - 3},${svgY + dy + 3}`}
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
        <p className="heatmap-legend text-caption">※ 스프린트 화살표는 방향과 속도를 표시합니다 (빨강: 고속, 노랑: 저속)</p>
      </div>
    );
  };

  // 방향전환 점 생성
  const generateDirectionPoints = (directionData, standard = "north", home = "west") => {
    console.log('🔍 generateDirectionPoints 호출 - directionData:', directionData);
    
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
    
    // 경기장 이미지 선택
    let fieldImage;
    const isAttackPhase = false;
    const isDefensePhase = false;
    
    if (isAttackPhase) {
      fieldImage = standard === "south" ? 
        (home === "east" ? groundRight : groundLeft) :
        (home === "west" ? groundRight : groundLeft);
    } else if (isDefensePhase) {
      fieldImage = standard === "south" ? 
        (home === "west" ? groundRight : groundLeft) :
        (home === "east" ? groundRight : groundLeft);
    } else {
      fieldImage = (standard === "south" && home === "east") || 
                   (standard === "north" && home === "west") ? groundRight : groundLeft;
    }

    const extent = standard === "south" ? [90, 0, 60, 0] : [0, 90, 0, 60];

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
                  if (standard === "south") {
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
                  if (standard === "south") {
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
        <p className="heatmap-legend text-caption">※ 방향전환 점은 플레이어의 방향 변화를 표시합니다 (주황: 저각, 빨강: 고각)</p>
      </div>
    );
  };

  // 경기 상세 정보 로드 함수
  const loadMatchInfo = async (matchCode) => {
    try {
      console.log('🔍 경기 상세 정보 로드 시작:', matchCode);
      const response = await GetMatchDetailApi('', matchCode); // user_code는 선택적 파라미터
      console.log('🔍 경기 상세 정보 API 응답:', response.data);
      
      if (response.data) {
        setMatchInfo(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('❌ 경기 상세 정보 로드 실패:', error);
      return null;
    }
  };

  // 쿼터 분석 데이터 로드 함수 (히트맵, 스프린트, 방향전환 포함)
  const loadQuarterData = async (userCode, quarterCode) => {
    try {
      console.log('🔍 쿼터 분석 데이터 로드 시작:', { userCode, quarterCode });
      const response = await GetQuarterDataApi(userCode, quarterCode);
      console.log('🔍 쿼터 분석 API 응답:', response.data);
      
      // 히트맵 데이터 확인
      console.log('🔍 히트맵 데이터 존재:', !!response.data?.total_data?.heatmap_data);
      if (response.data?.total_data?.heatmap_data) {
        console.log('✅ 히트맵 데이터 구조:', Object.keys(response.data.total_data.heatmap_data));
      }
      
      // 스프린트 데이터 확인
      console.log('🔍 스프린트 데이터 존재:', !!response.data?.total_data?.sprint_map_data);
      if (response.data?.total_data?.sprint_map_data) {
        console.log('✅ 스프린트 데이터 구조:', Object.keys(response.data.total_data.sprint_map_data));
      }
      
      // 방향전환 데이터 확인
      console.log('🔍 방향전환 데이터 존재:', !!response.data?.total_data?.direction_map_data);
      if (response.data?.total_data?.direction_map_data) {
        console.log('✅ 방향전환 데이터 구조:', Object.keys(response.data.total_data.direction_map_data));
      }
      
      setApiData(response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 쿼터 분석 API 실패:', error);
      console.error('❌ 에러 상세:', { error: error.message });
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
      console.log('🔍 관련 영상 데이터 로드 시작:', quarterCode);
      setVideosLoading(true);
      
      const response = await GetVideosByQuarterApi(quarterCode);
      console.log('🔍 영상 API 응답:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        // 각 영상에 썸네일 URL 추가
        const videosWithThumbnails = response.data.data.map(video => ({
          ...video,
          thumbnail_url: getYouTubeThumbnail(video.url)
        }));
        
        setVideos(videosWithThumbnails);
        console.log('✅ 영상 데이터 설정 완료:', videosWithThumbnails.length, '개');
      } else {
        console.log('ℹ️ 해당 쿼터에 영상이 없습니다');
        setVideos([]);
      }
    } catch (error) {
      console.error('❌ 영상 데이터 로드 실패:', error);
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
    
    console.log('🔍 전달받은 quarter 데이터:', quarter);
    console.log('🔍 quarter의 모든 키:', Object.keys(quarter));
    console.log('🔍 quarter_code 존재 여부:', 'quarter_code' in quarter);
    console.log('🔍 quarter.quarter_code 값:', quarter.quarter_code);
    
    // 경기 상세 정보 및 쿼터 분석 데이터 로드
    const loadData = async () => {
      const userCode = sessionStorage.getItem('userCode');
      
      // 경기 상세 정보 로드 (matchData에서 match_code 사용)
      if (matchData?.match_code) {
        await loadMatchInfo(matchData.match_code);
      }
      
      // 쿼터 분석 데이터 로드
      if (quarter?.quarter_code && userCode) {
        const apiData = await loadQuarterData(userCode, quarter.quarter_code);
        
        // 관련 영상 데이터 로드
        await loadRelatedVideos(quarter.quarter_code);
        
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
            스프린트: 0,
            평점: 0
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
          console.log('🔍 API에서 받은 point_data:', apiData.point_data);
          initialData.radarData = {
            체력: apiData.point_data?.stamina || 0,
            순발력: apiData.point_data?.positiveness || 0,
            스피드: apiData.point_data?.speed || 0,
            가속도: apiData.point_data?.acceleration || 0,
            스프린트: apiData.point_data?.sprint || 0,
            평점: Math.round((apiData.point_data?.stamina + apiData.point_data?.positiveness + 
                             apiData.point_data?.speed + apiData.point_data?.acceleration + 
                             apiData.point_data?.sprint + apiData.point_data?.total) / 6) || 0
          };
          console.log('🔍 업데이트된 레이더 데이터:', initialData.radarData);
          
          // 시간 정보 업데이트
          initialData.timeInfo = {
            startTime: formatTime(apiData.quarter_info?.start_time),
            endTime: formatTime(apiData.quarter_info?.end_time)
          };
          
          // T_HMAP 데이터 설정
          initialData.tHmapData = apiData.total_data?.heatmap_data || null;
          console.log('🔍 API 성공 - initialData.tHmapData 설정:', initialData.tHmapData);
        }
        
        console.log('🔍 최종 initialData 설정:', initialData);
        setQuarterData(initialData);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [quarter, matchData, navigate]);

  // 스크롤 이벤트 처리 - sticky header 효과
  useEffect(() => {
    let stickyOffset = null;

    const handleScroll = () => {
      const stickyContainer = document.querySelector('.sticky-quarter-container');
      const pageHeader = document.querySelector('.page-header');
      
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
          stickyContainer.style.maxWidth = '499px';
        } else {
          // sticky 효과 비활성화
          stickyContainer.classList.remove('scrolled');
          stickyContainer.style.position = 'sticky';
          stickyContainer.style.left = 'auto';
          stickyContainer.style.transform = 'none';
          stickyContainer.style.maxWidth = 'none';
        }
      }
    };

    // 초기 실행
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => { stickyOffset = null; handleScroll(); });
    
    return () => {
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
    <div className='anal-detail-page'>
      <LogoBellNav showBack={true} onBack={handleBack} />
      
      {/* 페이지 헤더 */}
      <div className="page-header">
        <h1 className="quarter-title text-h1">{quarterData.quarterName}</h1>
        <p className="quarter-description text-body">분석 결과를 자세히 보여줘요</p>
      </div>

      {/* Sticky 쿼터 탭 컨테이너 */}
      <div className="sticky-quarter-container">
        <div className="quarter-tabs">
        {matchData?.quarters?.map((quarter) => (
          <button
            key={quarter.quarter}
            className={`quarter-tab ${quarter.quarter === quarterData.quarterNumber ? 'active' : ''}`}
            onClick={async () => {
              // 쿼터 분석 데이터 로드
              const userCode = sessionStorage.getItem('userCode');
              const apiData = await loadQuarterData(userCode, quarter.quarter_code);
              
              // 관련 영상 데이터도 로드
              await loadRelatedVideos(quarter.quarter_code);
              
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
                  스프린트: 0,
                  평점: 0
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
                // API 데이터로 상세 통계 업데이트
                newQuarterData.detailStats = {
                  경기시간: `${apiData.total_data?.time || 0}분`,
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
                console.log('🔍 쿼터 탭 전환 - API에서 받은 point_data:', apiData.point_data);
                newQuarterData.radarData = {
                  체력: apiData.point_data?.stamina || 0,
                  순발력: apiData.point_data?.positiveness || 0,
                  스피드: apiData.point_data?.speed || 0,
                  가속도: apiData.point_data?.acceleration || 0,
                  스프린트: apiData.point_data?.sprint || 0,
                  평점: Math.round((apiData.point_data?.stamina + apiData.point_data?.positiveness + 
                                   apiData.point_data?.speed + apiData.point_data?.acceleration + 
                                   apiData.point_data?.sprint + apiData.point_data?.total) / 6) || 0
                };
                console.log('🔍 쿼터 탭 전환 - 업데이트된 레이더 데이터:', newQuarterData.radarData);
                
                // 시간 정보 업데이트
                newQuarterData.timeInfo = {
                  startTime: formatTime(apiData.quarter_info?.start_time),
                  endTime: formatTime(apiData.quarter_info?.end_time)
                };
                
                // T_HMAP 데이터 설정
                newQuarterData.tHmapData = apiData.total_data?.heatmap_data || null;
              }
              
              setQuarterData(newQuarterData);
            }}
          >
            {quarter.name}
          </button>
        ))}
        </div>
      </div>

      {/* 쿼터 정보 카드 */}
      <div className="quarter-info-card">
        <div className="quarter-info-section">
          <div className="quarter-info-left">
            <div className="quarter-details">
              <div className="quarter-score">
                <span className="score-type text-caption">평점</span>
                <span className="score-number">{quarterData.radarData.평점 || 0}</span>
                <span className="score-label text-caption">점</span>
              </div>
              <div className="quarter-time-info">
                <p className="time-text text-body">
                  <span className="time-label">경기시간</span> 
                  <span className="time-value">{quarterData.timeInfo.startTime} ~ {quarterData.timeInfo.endTime}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="quarter-info-divider"></div>
          <div className="quarter-info-right">
            <div className="quarter-stat">
              <span className="stat-label text-caption">경기 시간</span>
              <span className="stat-value text-body">{quarterData.detailStats.경기시간}</span>
            </div>
            <div className="quarter-stat">
              <span className="stat-label text-caption">최고속력</span>
              <span className="stat-value text-body">{quarterData.detailStats.최고속도}</span>
            </div>
            <div className="quarter-stat">
              <span className="stat-label text-caption">이동거리</span>
              <span className="stat-value text-body">{quarterData.detailStats.이동거리}</span>
            </div>
            <div className="quarter-stat">
              <span className="stat-label text-caption">스프린트</span>
              <span className="stat-value text-body">{quarterData.detailStats.스프린트}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 레이더 차트 섹션 */}
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

      {/* 히트맵 섹션 */}
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
          
          console.log('🔍 히트맵 렌더링 - quarterData 존재:', !!quarterData);
          console.log('🔍 히트맵 렌더링 - apiData 존재:', !!apiData);
          console.log('🔍 히트맵 렌더링 - quarterData.tHmapData:', quarterData?.tHmapData);
          console.log('🔍 히트맵 렌더링 - 최종 heatmapData:', heatmapData);
          console.log('🔍 히트맵 렌더링 - standard:', standard);
          console.log('🔍 히트맵 렌더링 - home:', home);
          console.log('🔍 히트맵 렌더링 - status:', status);
          
          return generateHeatmap(heatmapData, standard, home, status);
        })()}
        
        {activeMapTab === 'sprint' && (() => {
          const sprintData = apiData?.total_data?.sprint_map_data || quarterData?.tSmapData;
          console.log('🔍 스프린트 탭 렌더링 - sprintData:', sprintData);
          console.log('🔍 apiData 전체:', apiData);
          return generateSprintArrows(
            processSprintData(sprintData),
            apiData?.match_info?.standard || matchData?.standard || "north", 
            apiData?.quarter_info?.home || matchData?.home || "west"
          );
        })()}
        
        {activeMapTab === 'direction' && (() => {
          const directionData = apiData?.total_data?.direction_map_data || quarterData?.tDmapData;
          console.log('🔍 방향전환 탭 렌더링 - directionData:', directionData);
          return generateDirectionPoints(
            processDirectionData(directionData),
            apiData?.match_info?.standard || matchData?.standard || "north", 
            apiData?.quarter_info?.home || matchData?.home || "west"
          );
        })()}
          </>
        )}
      </div>

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

      {/* 활동량 섹션 */}
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
                <span className="stat-label text-caption">경기시간</span>
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
                <span className="stat-label text-caption">공격 시간</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.time, '분')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">공격 이동거리</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.distance, 'km')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">공격 분당 이동거리</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.distance_per_minute, 'm')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">공격 방향전환</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.direction_change_90_150, '회')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">공격 큰 방향전환</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.direction_change_150_180, '회')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">공격 활동 범위</span>
                <span className="stat-value text-body">{formatValue(apiData?.attack_data?.movement_ratio ? parseFloat(apiData.attack_data.movement_ratio).toFixed(1) : 0, '%')}</span>
              </div>
            </div>
          )}
          
          {activeActivityTab === 'defense' && (
            <div className="activity-stats-grid">
              <div className="activity-stat">
                <span className="stat-label text-caption">수비 시간</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.time, '분')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">수비 이동거리</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.distance ? parseFloat(apiData.defense_data.distance).toFixed(2) : 0, 'km')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">수비 분당 이동거리</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.distance_per_minute ? parseFloat(apiData.defense_data.distance_per_minute).toFixed(1) : 0, 'm')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">수비 방향전환</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.direction_change_90_150, '회')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">수비 큰 방향전환</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.direction_change_150_180, '회')}</span>
              </div>
              <div className="activity-stat">
                <span className="stat-label text-caption">수비 활동 범위</span>
                <span className="stat-value text-body">{formatValue(apiData?.defense_data?.movement_ratio ? parseFloat(apiData.defense_data.movement_ratio).toFixed(1) : 0, '%')}</span>
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* 속력 및 가속도 섹션 */}
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
                          // average_speed_list는 텍스트 형태로 저장되어 있으므로 JSON 파싱 필요
                          let speedData = null;
                          try {
                            const rawData = apiData?.total_data?.average_speed_list;
                            console.log('🔍 속력 리스트 원본 데이터:', rawData);
                            console.log('🔍 속력 리스트 데이터 타입:', typeof rawData);
                            if (rawData) {
                              speedData = JSON.parse(rawData);
                              console.log('🔍 파싱된 속력 리스트 데이터:', speedData);
                            }
                          } catch (error) {
                            console.error('속력 리스트 데이터 파싱 오류:', error);
                          }
                          
                          if (!speedData || !Array.isArray(speedData) || speedData.length === 0) {
                            return (
                              <g>
                                <text x="200" y="90" textAnchor="middle" fill="#8A8F98" fontSize="14" fontWeight="500">
                                  속력 데이터가 없습니다
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
                          // average_acceleration_list는 텍스트 형태로 저장되어 있으므로 JSON 파싱 필요
                          let accelerationData = null;
                          try {
                            const rawData = apiData?.total_data?.average_acceleration_list;
                            console.log('🔍 가속도 리스트 원본 데이터:', rawData);
                            console.log('🔍 가속도 리스트 데이터 타입:', typeof rawData);
                            if (rawData) {
                              accelerationData = JSON.parse(rawData);
                              console.log('🔍 파싱된 가속도 리스트 데이터:', accelerationData);
                            }
                          } catch (error) {
                            console.error('가속도 리스트 데이터 파싱 오류:', error);
                          }
                          
                          if (!accelerationData || !Array.isArray(accelerationData) || accelerationData.length === 0) {
                            return (
                              <g>
                                <text x="200" y="90" textAnchor="middle" fill="#8A8F98" fontSize="14" fontWeight="500">
                                  가속도 데이터가 없습니다
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

      {/* 스프린트 섹션 */}
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
    </div>
  );
};

export default Anal_Detail;
