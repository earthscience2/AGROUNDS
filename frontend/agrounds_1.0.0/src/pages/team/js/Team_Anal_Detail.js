import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/Team_Anal_Detail.scss';
import { GetTeamQuarterDetailApi } from '../../../function/api/anal/analApi';
import { GetMatchDetailApi } from '../../../function/api/match/matchApi';
import { GetVideosByQuarterApi } from '../../../function/api/video/videoApi';

// 아이콘 import (디자인 시스템 승인 아이콘)
import starIcon from '../../../assets/identify_icon/star.png';
import speedIcon from '../../../assets/identify_icon/star.png';
import distanceIcon from '../../../assets/main_icons/line_black.png';
import timeIcon from '../../../assets/main_icons/clock_black.png';
import chartIcon from '../../../assets/main_icons/graph_black.png';
import backIcon from '../../../assets/main_icons/back_black.png';
import FolderBlack from '../../../assets/main_icons/folder_black.png';

// 팀 로고 import
import defaultTeamLogo from '../../../assets/common/default-team-logo.png';

// 접기/펼치기 버튼 이미지 import
import upIcon from '../../../assets/main_icons/up_gray.png';
import downIcon from '../../../assets/main_icons/down_gray.png';

// 경기장 이미지 import
import groundLeft from '../../../assets/ground/ground_left.jpg';
import groundRight from '../../../assets/ground/ground_right.jpg';

const Team_Anal_Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [quarterData, setQuarterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const [activeMapTab, setActiveMapTab] = useState('heatmap'); // 히트맵 탭 상태
  const [activeActivityTab, setActiveActivityTab] = useState('total'); // 활동량 탭 상태
  const [activeSpeedTab, setActiveSpeedTab] = useState('speed'); // 속력/가속도 탭 상태
  const [activeShapeTab, setActiveShapeTab] = useState('cohesion'); // 형태 탭 상태
  const [videos, setVideos] = useState([]); // 관련 영상 데이터
  const [videosLoading, setVideosLoading] = useState(false); // 영상 로딩 상태
  const [isRestQuarter, setIsRestQuarter] = useState(false); // 휴식 쿼터 상태
  const [currentQuarterData, setCurrentQuarterData] = useState(null); // 현재 활성 쿼터 데이터
  const [isSticky, setIsSticky] = useState(false); // sticky 상태
  
  // 각 섹션별 접기/펼치기 상태
  const [sectionCollapsed, setSectionCollapsed] = useState({
    ovr: false,
    imageAnalysis: false,
    activity: false,
    speed: false,
    shape: false,
    video: false,
    score: false
  });
  
  // state에서 전달받은 데이터
  const { quarterCode, quarterData: passedQuarterData, matchData, teamCode } = location.state || {};
  
  // 초기 쿼터 데이터 설정
  useEffect(() => {
    if (passedQuarterData) {
      setQuarterData(passedQuarterData);
      setCurrentQuarterData(passedQuarterData);
    }
  }, [quarterCode, passedQuarterData, matchData, teamCode]);

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

  // 값 포맷팅 함수
  const formatValue = (value, unit = '') => {
    if (value === null || value === undefined) return '-';
    if (value === 0) return '0' + unit;
    return value + unit;
  };

  // 육각형 좌표 계산 함수 (레이더 차트용)
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

  // 라벨 위치 계산 (팀 분석용)
  const getLabelPositions = (centerX, centerY, radius, data) => {
    // 참여도 계산 (point_attack과 point_defense의 평균)
    const participation = data.point_attack && data.point_defense 
      ? Math.round((data.point_attack + data.point_defense) / 2)
      : (data.point_attack || data.point_defense || 0);
    
    // 시계방향으로 참여도 → 속력 → 가속도 → 조직력 → 균형 → 체력 순으로 배치
    const radarChartData = [
      { label: '참여도', value: participation },
      { label: '속력', value: data.스피드 || 0 },
      { label: '가속도', value: data.가속도 || 0 },
      { label: '조직력', value: data.조직력 || 0 },
      { label: '균형', value: data.균형성 || 0 },
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

  // 6가지 지표의 평균 계산 함수 (팀 분석용)
  const calculateAverageOVR = (data) => {
    // 참여도 계산 (point_attack과 point_defense의 평균)
    const participation = data.point_attack && data.point_defense 
      ? Math.round((data.point_attack + data.point_defense) / 2)
      : (data.point_attack || data.point_defense || 0);
    
    const values = [
      participation,
      data.스피드 || 0,
      data.가속도 || 0,
      data.조직력 || 0,
      data.균형성 || 0,
      data.체력 || 0
    ];
    const validValues = values.filter(value => value > 0); // 0보다 큰 값들만 계산
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, value) => acc + value, 0);
    return Math.round(sum / validValues.length);
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

  // 팀 히트맵 생성 함수
  const generateTeamHeatmap = (tHmapData, standard = "north", home = "west") => {
    const processedData = processHeatmapData(tHmapData);
    
    if (!processedData) {
      return (
        <div className="heatmap-container">
          <div className="heatmap-field-container">
            <img src={groundLeft} alt="축구장" className="field-background" />
            <div className="heatmap-overlay">
              <div className="no-data-overlay">
                <p className="no-data-message text-body">히트맵 데이터가 없습니다</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 가우시안 스무딩 적용
    const smoothedData = applyGaussianSmoothing(processedData.data, 1.5);
    
    // 정규화 (p95 방식)
    let vmax = 1.0;
    if (smoothedData.length > 0) {
      const flatData = smoothedData.flat().filter(val => val > 0);
      if (flatData.length > 0) {
        const sortedData = flatData.sort((a, b) => a - b);
        const p95Index = Math.floor(sortedData.length * 0.95);
        vmax = sortedData[p95Index];
      }
      if (vmax <= 0) vmax = 1.0;
    }

    const dataHeight = smoothedData.length;
    const dataWidth = smoothedData[0] ? smoothedData[0].length : 0;
    
    // 경기장 설정
    const fieldWidth = 360;
    const fieldHeight = 240;
    const fieldImage = (standard === "south" && home === "east") || 
                      (standard === "north" && home === "west") ? groundRight : groundLeft;

    return (
      <div className="heatmap-container">
        <div className="heatmap-field-container">
          <img src={fieldImage} alt="축구장" className="field-background" />
          <div className="heatmap-overlay">
            <svg width="100%" height="100%" viewBox="0 0 360 240" className="heatmap-svg">
              <defs>
                <filter id="gaussianBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5"/>
                </filter>
              </defs>
              
              <g filter="url(#gaussianBlur)" opacity="0.6">
                {smoothedData.map((row, i) => 
                  row.map((value, j) => {
                    if (value <= 0) return null;
                    
                    const normalizedValue = Math.min(Math.max(value / vmax, 0.0), 1.0);
                    const normalizedX = j / (dataWidth - 1);
                    const normalizedY = i / (dataHeight - 1);
                    
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
                    
                    // 색상 계산
                    const intensity = normalizedValue;
                    let red, green, blue;
                    
                    if (intensity <= 0.0) {
                      red = green = blue = 0;
                    } else if (intensity < 0.25) {
                      const t = intensity / 0.25;
                      red = 0;
                      green = Math.floor(100 * t);
                      blue = Math.floor(255 * t);
                    } else if (intensity < 0.5) {
                      const t = (intensity - 0.25) / 0.25;
                      red = 0;
                      green = Math.floor(100 + 155 * t);
                      blue = 255;
                    } else if (intensity < 0.75) {
                      const t = (intensity - 0.5) / 0.25;
                      red = Math.floor(255 * t);
                      green = 255;
                      blue = Math.floor(255 * (1 - t));
                    } else {
                      const t = (intensity - 0.75) / 0.25;
                      red = 255;
                      green = Math.floor(255 * (1 - t));
                      blue = 0;
                    }
                    
                    const radius = Math.max(2, Math.min(6, normalizedValue * 4 + 2));
                    
                    return (
                      <circle
                        key={`heatmap-${i}-${j}`}
                        cx={svgX}
                        cy={svgY}
                        r={radius}
                        fill={`rgb(${red},${green},${blue})`}
                        opacity={0.7}
                      />
                    );
                  })
                )}
              </g>
            </svg>
          </div>
        </div>
        <p className="heatmap-legend text-caption">※ 팀 전체의 활동 영역을 표시합니다</p>
      </div>
    );
  };

  // 포메이션맵 생성 함수 (T_PMAP - 선수별 평균 위치)
  const generateFormationMap = (pmapData, standard = "north", home = "west") => {
    if (!pmapData) {
      return (
        <div className="formation-container">
          <div className="field-background">
            <img src={groundLeft} alt="축구장" className="field-image" />
            <div className="no-data-overlay">
              <p className="no-data-message text-body">포메이션 데이터가 없습니다</p>
            </div>
          </div>
        </div>
      );
    }

    const fieldWidth = 360;
    const fieldHeight = 240;
    const fieldImage = (standard === "south" && home === "east") || 
                      (standard === "north" && home === "west") ? groundRight : groundLeft;

    // 실제 데이터 형식: Array of Arrays [[x, y, playerId], ...]
    let players = [];
    
    try {
      if (Array.isArray(pmapData)) {
        const xCoords = pmapData.map(player => parseFloat(player[0])).filter(x => !isNaN(x));
        const yCoords = pmapData.map(player => parseFloat(player[1])).filter(y => !isNaN(y));
        
        if (xCoords.length === 0 || yCoords.length === 0) {
          return (
            <div className="formation-container">
              <div className="field-background">
                <img src={fieldImage} alt="축구장" className="field-image" />
                <div className="no-data-overlay">
                  <p className="no-data-message text-body">포메이션 좌표 데이터가 유효하지 않습니다</p>
                </div>
              </div>
            </div>
          );
        }
        
        const minX = Math.min(...xCoords);
        const maxX = Math.max(...xCoords);
        const minY = Math.min(...yCoords);
        const maxY = Math.max(...yCoords);
        
        players = pmapData.map((playerData, index) => {
          if (!Array.isArray(playerData) || playerData.length < 3) return null;
          
          const [rawX, rawY, playerId] = playerData;
          const x = parseFloat(rawX);
          const y = parseFloat(rawY);
          
          if (isNaN(x) || isNaN(y)) return null;
          
          // GPS 좌표를 0-1 범위로 정규화
          const normalizedX = (x - minX) / (maxX - minX);
          const normalizedY = (y - minY) / (maxY - minY);
          
          // 축구장 좌표계로 변환 (0-90, 0-60)
          let fieldX, fieldY;
          if (standard === "south") {
            fieldX = 90 - (normalizedX * 90);
            fieldY = 60 - (normalizedY * 60);
          } else {
            fieldX = normalizedX * 90;
            fieldY = normalizedY * 60;
          }
          
          // SVG 좌표로 변환
          const scale = 0.95;
          const offsetX = fieldWidth * (1 - scale) / 2;
          const offsetY = fieldHeight * (1 - scale) / 2;
          
          const svgX = (fieldX / 90) * fieldWidth * scale + offsetX;
          const svgY = (1 - fieldY / 60) * fieldHeight * scale + offsetY;
          
          return {
            id: playerId || `P${index + 1}`,
            x: svgX,
            y: svgY,
            name: playerId || `${index + 1}`
          };
        }).filter(Boolean);
        
      } else {
        return (
          <div className="formation-container">
            <div className="field-background">
              <img src={fieldImage} alt="축구장" className="field-image" />
              <div className="no-data-overlay">
                <p className="no-data-message text-body">포메이션 데이터 형식이 올바르지 않습니다</p>
              </div>
            </div>
          </div>
        );
      }
    } catch (error) {
      return (
        <div className="formation-container">
          <div className="field-background">
            <img src={fieldImage} alt="축구장" className="field-image" />
            <div className="no-data-overlay">
              <p className="no-data-message text-body">포메이션 데이터 처리 중 오류가 발생했습니다</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="formation-container">
        <div className="field-background">
          <img src={fieldImage} alt="축구장" className="field-image" />
          <div className="formation-overlay">
            <svg width="100%" height="100%" viewBox="0 0 360 240" className="formation-svg">
              {players.map((player, index) => (
                <g key={`player-${index}`}>
                  <circle
                    cx={player.x}
                    cy={player.y}
                    r="10"
                    fill="#079669"
                    stroke="#ffffff"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <text
                    x={player.x}
                    y={player.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10"
                    fontWeight="700"
                    fill="#ffffff"
                    stroke="#079669"
                    strokeWidth="0.5"
                    paintOrder="stroke fill"
                  >
                    {player.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
        <p className="formation-legend text-caption">※ 선수별 평균 위치를 표시합니다</p>
      </div>
    );
  };

  // 방향맵 생성 함수 (T_ZMAP - 지역별 이용도)
  const generateDirectionMap = (zmapData, standard = "north", home = "west") => {
    if (!zmapData) {
      return (
        <div className="direction-container">
          <div className="field-background">
            <img src={groundLeft} alt="축구장" className="field-image" />
            <div className="no-data-overlay">
              <p className="no-data-message text-body">방향맵 데이터가 없습니다</p>
            </div>
          </div>
        </div>
      );
    }

    const fieldWidth = 360;
    const fieldHeight = 240;
    const fieldImage = (standard === "south" && home === "east") || 
                      (standard === "north" && home === "west") ? groundRight : groundLeft;

    try {
      if (typeof zmapData === 'object' && !Array.isArray(zmapData) && 
          (zmapData.left !== undefined || zmapData.right !== undefined || zmapData.center !== undefined)) {
        let arrowDirection = 90;
        
        if (home === "south") {
          arrowDirection = 90;
        } else if (home === "north") {
          arrowDirection = 270;
        } else if (home === "west") {
          arrowDirection = 180;
        } else {
          arrowDirection = 0;
        }
        const arrows = [];
        
        // 모든 데이터 값 수집하여 최대값 계산
        const allValues = [zmapData.left, zmapData.center, zmapData.right]
          .filter(v => v !== undefined && v !== null)
          .map(v => parseFloat(v));
        const maxDataValue = Math.max(...allValues, 1);
        if (zmapData.left !== undefined && zmapData.left !== null) {
          const value = parseFloat(zmapData.left);
          const arrowLength = Math.max(30, (value / maxDataValue) * 100);
          
          let centerX, centerY, startX, startY;
          
          if (home === "south" || home === "north") {
            centerX = fieldWidth * 0.17;
            centerY = fieldHeight * 0.5;
            
            const angleRad = (arrowDirection * Math.PI) / 180;
            startX = centerX - (arrowLength / 2) * Math.cos(angleRad);
            startY = centerY - (arrowLength / 2) * Math.sin(angleRad);
          } else {
            centerX = fieldWidth * 0.5;
            centerY = fieldHeight * 0.17;
            
            const angleRad = (arrowDirection * Math.PI) / 180;
            startX = centerX - (arrowLength / 2) * Math.cos(angleRad);
            startY = centerY - (arrowLength / 2) * Math.sin(angleRad);
          }
          
          arrows.push({
            id: 'left',
            name: '좌측',
            value: value,
            startX: startX,
            startY: startY,
            centerX: centerX,
            centerY: centerY,
            arrowLength: arrowLength,
            direction: arrowDirection,
            color: '#ffffff'
          });
        }
        
        if (zmapData.center !== undefined && zmapData.center !== null) {
          const value = parseFloat(zmapData.center);
          const arrowLength = Math.max(30, (value / maxDataValue) * 100);
          
          const centerX = fieldWidth * 0.5;
          const centerY = fieldHeight * 0.5;
          
          const angleRad = (arrowDirection * Math.PI) / 180;
          const startX = centerX - (arrowLength / 2) * Math.cos(angleRad);
          const startY = centerY - (arrowLength / 2) * Math.sin(angleRad);
          
          arrows.push({
            id: 'center',
            name: '중앙',
            value: value,
            startX: startX,
            startY: startY,
            centerX: centerX,
            centerY: centerY,
            arrowLength: arrowLength,
            direction: arrowDirection,
            color: '#ffffff'
          });
        }
        
        if (zmapData.right !== undefined && zmapData.right !== null) {
          const value = parseFloat(zmapData.right);
          const arrowLength = Math.max(30, (value / maxDataValue) * 100);
          
          let centerX, centerY, startX, startY;
          
          if (home === "south" || home === "north") {
            centerX = fieldWidth * 0.83;
            centerY = fieldHeight * 0.5;
            
            const angleRad = (arrowDirection * Math.PI) / 180;
            startX = centerX - (arrowLength / 2) * Math.cos(angleRad);
            startY = centerY - (arrowLength / 2) * Math.sin(angleRad);
          } else {
            centerX = fieldWidth * 0.5;
            centerY = fieldHeight * 0.83;
            
            const angleRad = (arrowDirection * Math.PI) / 180;
            startX = centerX - (arrowLength / 2) * Math.cos(angleRad);
            startY = centerY - (arrowLength / 2) * Math.sin(angleRad);
          }
          
          arrows.push({
            id: 'right',
            name: '우측',
            value: value,
            startX: startX,
            startY: startY,
            centerX: centerX,
            centerY: centerY,
            arrowLength: arrowLength,
            direction: arrowDirection,
            color: '#ffffff'
          });
        }
        
        if (arrows.length === 0) {
          return (
            <div className="direction-container">
              <div className="field-background">
                <img src={fieldImage} alt="축구장" className="field-image" />
                <div className="no-data-overlay">
                  <p className="no-data-message text-body">표시할 방향 데이터가 없습니다</p>
                </div>
              </div>
            </div>
          );
        }

        const maxValue = Math.max(...arrows.map(a => a.value), 1);

        return (
          <div className="direction-container">
            <div className="field-background">
              <img src={fieldImage} alt="축구장" className="field-image" />
              <div className="direction-overlay">
                <svg width="100%" height="100%" viewBox="0 0 360 240" className="direction-svg">
                  {/* 홈 기준 3등분 구분선 */}
                  <defs>
                    {home === "south" || home === "north" ? (
                      <pattern id="zoneGrid" patternUnits="userSpaceOnUse" width="360" height="240">
                        <path d="M 120 0 L 120 240 M 240 0 L 240 240" stroke="#e5e7eb" strokeWidth="2" opacity="0.4"/>
                      </pattern>
                    ) : (
                      <pattern id="zoneGrid" patternUnits="userSpaceOnUse" width="360" height="240">
                        <path d="M 0 80 L 360 80 M 0 160 L 360 160" stroke="#e5e7eb" strokeWidth="2" opacity="0.4"/>
                      </pattern>
                    )}
                  </defs>
                  
                  <rect width="360" height="240" fill="url(#zoneGrid)" opacity="0.7"/>
                  {arrows.map((arrow, index) => {
                    const arrowLength = arrow.arrowLength;
                    const arrowWidth = 8;
                    const angleRad = (arrow.direction * Math.PI) / 180;
                    const endX = arrow.startX + arrowLength * Math.cos(angleRad);
                    const endY = arrow.startY + arrowLength * Math.sin(angleRad);
                    
                    const headLength = 12;
                    const headWidth = 8;
                    const perpAngleRad = angleRad + Math.PI / 2;
                    const headBaseX = endX - headLength * Math.cos(angleRad);
                    const headBaseY = endY - headLength * Math.sin(angleRad);
                    
                    const headX1 = headBaseX + headWidth * Math.cos(perpAngleRad);
                    const headY1 = headBaseY + headWidth * Math.sin(perpAngleRad);
                    const headX2 = headBaseX - headWidth * Math.cos(perpAngleRad);
                    const headY2 = headBaseY - headWidth * Math.sin(perpAngleRad);
                    
                    let zoneX, zoneY, zoneWidth, zoneHeight;
                    
                    if (home === "south" || home === "north") {
                      zoneX = index * 120;
                      zoneY = 10;
                      zoneWidth = 120;
                      zoneHeight = 220;
                    } else {
                      zoneX = 10;
                      zoneY = index * 80;
                      zoneWidth = 340;
                      zoneHeight = 80;
                    }
                    
                    return (
                      <g key={`arrow-${index}`}>
                        <rect
                          x={zoneX}
                          y={zoneY}
                          width={zoneWidth}
                          height={zoneHeight}
                          fill="#000000"
                          opacity="0.15"
                          stroke="#ffffff"
                          strokeWidth="1"
                          strokeDasharray="5,5"
                          rx="8"
                        />
                        
                        <line
                          x1={arrow.startX}
                          y1={arrow.startY}
                          x2={headBaseX}
                          y2={headBaseY}
                          stroke={arrow.color}
                          strokeWidth={arrowWidth}
                          strokeLinecap="round"
                          opacity="0.95"
                        />
                        
                        <polygon
                          points={`${endX},${endY} ${headX1},${headY1} ${headX2},${headY2}`}
                          fill={arrow.color}
                          stroke={arrow.color}
                          strokeWidth="1"
                          strokeLinejoin="round"
                          opacity="0.95"
                        />
                        <text
                          x={arrow.centerX}
                          y={arrow.centerY - 25}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="16"
                          fontWeight="700"
                          fill="#ffffff"
                          stroke="#000000"
                          strokeWidth="2"
                          paintOrder="stroke fill"
                        >
                          {arrow.value.toFixed(1)}%
                        </text>
                        
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            <p className="direction-legend text-caption">※ 홈 지역 기준 각 구역별 이동 방향을 표시합니다</p>
          </div>
        );
      }
      
      return (
        <div className="direction-container">
          <div className="field-background">
            <img src={fieldImage} alt="축구장" className="field-image" />
            <div className="no-data-overlay">
              <p className="no-data-message text-body">방향맵 데이터 형식이 올바르지 않습니다</p>
            </div>
          </div>
        </div>
        );
      
    } catch (error) {
      return (
        <div className="direction-container">
          <div className="field-background">
            <img src={fieldImage} alt="축구장" className="field-image" />
            <div className="no-data-overlay">
              <p className="no-data-message text-body">방향맵 데이터 처리 중 오류가 발생했습니다</p>
            </div>
          </div>
        </div>
      );
    }
  };

  // 레이더 차트 SVG 생성 (팀 분석용)
  const generateRadarChart = (data) => {
    const participation = data.point_attack && data.point_defense 
      ? Math.round((data.point_attack + data.point_defense) / 2)
      : (data.point_attack || data.point_defense || 0);
    
    const radarChartData = [
      { label: '참여도', value: participation },
      { label: '속력', value: data.스피드 || 0 },
      { label: '가속도', value: data.가속도 || 0 },
      { label: '조직력', value: data.조직력 || 0 },
      { label: '균형', value: data.균형성 || 0 },
      { label: '체력', value: data.체력 || 0 }
    ];

    return (
      <div className="radar-chart-container">
        <svg width="400" height="400" viewBox="0 0 400 400">
          {/* 그라데이션 정의 */}
          <defs>
            <radialGradient id="teamRadarGradient" cx="50%" cy="50%" r="50%">
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
                fill="url(#teamRadarGradient)"
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
          
          {/* 중앙 총점 (point_total 값을 직접 표시, 정수로 표시, 검은색) */}
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="48"
            fontWeight="800"
            fill="#000000"
          >
            {data.평점 || 0}
          </text>
        </svg>
      </div>
    );
  };

  // 경기 상세 정보 로드 함수
  const loadMatchInfo = async (matchCode) => {
    try {
      const response = await GetMatchDetailApi('', matchCode);
      
      if (response.data) {
        setMatchInfo(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // 팀 쿼터 분석 데이터 로드 함수
  const loadQuarterData = async (quarterCode) => {
    try {
      const response = await GetTeamQuarterDetailApi(quarterCode);
      setApiData(response.data);
      return response.data;
    } catch (error) {
      return null;
    }
  };

  // 관련 영상 데이터 로드 함수
  const loadRelatedVideos = async (quarterCode) => {
    try {
      setVideosLoading(true);
      const response = await GetVideosByQuarterApi(quarterCode);
      
      if (response.data?.videos && Array.isArray(response.data.videos)) {
        setVideos(response.data.videos);
      }
    } catch (error) {
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

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

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 팀 쿼터 분석 데이터 로드
        if (quarterCode) {
          const teamApiData = await loadQuarterData(quarterCode);
          
          if (passedQuarterData) {
            const hasRadarData = teamApiData?.radar_scores || 
              (passedQuarterData.point_stamina || passedQuarterData.point_organization || 
               passedQuarterData.point_speed || passedQuarterData.points);
            
            const hasStatsData = teamApiData?.total_stats || 
              (passedQuarterData.distance || passedQuarterData.avg_speed || passedQuarterData.max_speed);

            const updatedQuarterData = {
              ...passedQuarterData,
              teamName: matchData?.teamName || '팀 정보',
              quarterName: passedQuarterData.name,
              quarterNumber: passedQuarterData.quarter,
              // 레이더 데이터가 있을 때만 설정
              radarData: hasRadarData ? {
                체력: teamApiData?.radar_scores?.stamina || passedQuarterData.point_stamina || null,
                조직력: teamApiData?.radar_scores?.organization || passedQuarterData.point_organization || null,
                스피드: teamApiData?.radar_scores?.speed || passedQuarterData.point_speed || null,
                가속도: teamApiData?.radar_scores?.acceleration || passedQuarterData.point_acceleration || null,
                균형성: teamApiData?.radar_scores?.balance || passedQuarterData.point_balance || null,
                평점: teamApiData?.radar_scores?.total || passedQuarterData.points || null,
                // 참여도 계산을 위한 공격/수비 포인트 추가
                point_attack: teamApiData?.radar_scores?.attack || passedQuarterData.point_attack || null,
                point_defense: teamApiData?.radar_scores?.defense || passedQuarterData.point_defense || null
              } : null,
              // 통계 데이터가 있을 때만 설정
              detailStats: hasStatsData ? {
                경기시간: teamApiData?.quarter_info?.duration_minutes ? `${teamApiData.quarter_info.duration_minutes}분` : 
                         passedQuarterData.duration ? `${passedQuarterData.duration}분` : null,
                이동거리: teamApiData?.total_stats?.distance ? `${teamApiData.total_stats.distance}km` :
                         passedQuarterData.distance ? `${passedQuarterData.distance}km` : null,
                평균속도: teamApiData?.total_stats?.avg_speed ? `${teamApiData.total_stats.avg_speed}km/h` :
                         passedQuarterData.avg_speed ? `${passedQuarterData.avg_speed}km/h` : null,
                최고속도: teamApiData?.total_stats?.max_speed ? `${teamApiData.total_stats.max_speed}km/h` :
                         passedQuarterData.max_speed ? `${passedQuarterData.max_speed}km/h` : null,
                가속도: teamApiData?.total_stats?.avg_acceleration ? `${teamApiData.total_stats.avg_acceleration}m/s²` : null,
                최고가속도: teamApiData?.total_stats?.max_acceleration ? `${teamApiData.total_stats.max_acceleration}m/s²` : null,
                활동량: teamApiData?.available_players_avg ? `${teamApiData.available_players_avg}명` : 
                       (matchData?.participants ? matchData.participants : null),
                점수: teamApiData?.radar_scores?.total || passedQuarterData.points || null
              } : null,
              timeInfo: {
                startTime: formatTime(teamApiData?.quarter_info?.start_time || passedQuarterData.start_time),
                endTime: formatTime(teamApiData?.quarter_info?.end_time || passedQuarterData.end_time)
              }
            };
            setQuarterData(updatedQuarterData);
          }
        }
        
        // 경기 정보 로드
        if (matchData?.match_code) {
          await loadMatchInfo(matchData.match_code);
        }
        
        // 영상 데이터 로드
        if (quarterCode && !isRestQuarter) {
          await loadRelatedVideos(quarterCode);
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [quarterCode, matchData?.match_code, isRestQuarter, passedQuarterData]);

  // 뒤로가기 함수 - Team_Anal.js 페이지로 이동
  const handleBack = () => {
    let extractedMatchId = null;
    let backMatchData = null;
    
    if (matchData?.matchInfo?.match_code) {
      // Team_Anal.js에서 설정한 matchData 구조
      extractedMatchId = matchData.matchInfo.match_code;
      backMatchData = {
        match_code: matchData.matchInfo.match_code,
        match_name: matchData.matchInfo.name || '경기',
        team_name: matchData.teamInfo?.teamName || '',
        team_type: matchData.teamInfo?.teamType || '',
        formation: matchData.teamInfo?.formation || '',
        ground_name: matchData.teamInfo?.matchLocation || '',
        match_date: matchData.teamInfo?.matchDate || '',
        start_time: matchData.teamInfo?.matchStartTime || '',
        end_time: matchData.teamInfo?.matchEndTime || ''
      };
    } else if (matchData?.match_code) {
      // 직접 전달된 matchData 구조
      extractedMatchId = matchData.match_code;
      backMatchData = matchData;
    } else if (passedQuarterData?.match_code) {
      // passedQuarterData에서 추출
      extractedMatchId = passedQuarterData.match_code;
      backMatchData = {
        match_code: passedQuarterData.match_code,
        match_name: passedQuarterData.match_name || '경기',
        team_name: passedQuarterData.team_name || '',
        team_type: passedQuarterData.team_type || '',
        formation: passedQuarterData.formation || '',
        ground_name: passedQuarterData.ground_name || '',
        match_date: passedQuarterData.match_date || '',
        start_time: passedQuarterData.start_time || '',
        end_time: passedQuarterData.end_time || ''
      };
    } else if (quarterCode) {
      // quarterCode에서 match_code 추출 (최후 수단)
      extractedMatchId = quarterCode.split('_')[0];
      backMatchData = {
        match_code: extractedMatchId,
        match_name: '경기',
        team_name: '',
        team_type: '',
        formation: '',
        ground_name: '',
        match_date: '',
        start_time: '',
        end_time: ''
      };
    }
    
    if (!extractedMatchId || !backMatchData) {
      navigate('/app/team/info', { state: { teamCode } });
      return;
    }
    
    navigate('/app/team/anal', { 
      state: { 
        passedMatchData: backMatchData,
        matchId: extractedMatchId,
        teamCode: teamCode
      } 
    });
  };

  // 그래프 렌더링 함수 (리스트 데이터를 그래프로 표시)
  const renderLineChart = (data, color = '#079669', label = '') => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="no-chart-data">
          <p className="text-caption">데이터가 없습니다</p>
        </div>
      );
    }

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    return (
      <div className="line-chart-container">
        <div className="chart-header">
          <span className="chart-label text-caption">{label}</span>
          <span className="chart-value text-caption">
            최고: {maxValue.toFixed(2)} / 최저: {minValue.toFixed(2)}
          </span>
        </div>
        <svg className="line-chart" viewBox="0 0 300 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={data.map((value, index) => {
              const x = (index / (data.length - 1)) * 300;
              const y = 100 - ((value - minValue) / range) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />
        </svg>
      </div>
    );
  };

  // 히트맵 렌더링 함수 (기존 함수는 generateTeamHeatmap으로 대체)


  if (loading) {
    return (
      <div className='team-anal-detail-page'>
        <LogoBellNav logo={true} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="text-body">상세 분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!quarterData) {
    return (
      <div className='team-anal-detail-page'>
        <LogoBellNav logo={true} />
        <div className="error-container">
          <p className="text-body">상세 분석 데이터를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='team-anal-detail-page'>
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
            <h1 className="text-h2">팀 분석 상세</h1>
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
            className={`quarter-tab ${isActive ? 'active' : ''}`}
            onClick={async () => {
              // 현재 스크롤 위치 저장
              const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
              
              // 현재 쿼터 데이터 업데이트
              setCurrentQuarterData(quarter);
              
              // 쿼터 분석 데이터 로드
              const teamApiData = await loadQuarterData(quarter.quarter_code);
              
              // 관련 영상 데이터도 로드
              await loadRelatedVideos(quarter.quarter_code);
              
              // 새로운 쿼터 데이터 구성 (실제 데이터만 사용)
              const hasRadarData = teamApiData?.radar_scores || 
                (quarter.point_stamina || quarter.point_organization || 
                 quarter.point_speed || quarter.points);
              
              const hasStatsData = teamApiData?.total_stats || 
                (quarter.distance || quarter.avg_speed || quarter.max_speed);

              const newQuarterData = {
                ...quarter,
                teamName: matchData?.teamName || '팀 정보',
                quarterName: quarter.name,
                quarterNumber: quarter.quarter,
                // 레이더 데이터가 있을 때만 설정
                radarData: hasRadarData ? {
                  체력: teamApiData?.radar_scores?.stamina || quarter.point_stamina || null,
                  조직력: teamApiData?.radar_scores?.organization || quarter.point_organization || null,
                  스피드: teamApiData?.radar_scores?.speed || quarter.point_speed || null,
                  가속도: teamApiData?.radar_scores?.acceleration || quarter.point_acceleration || null,
                  균형성: teamApiData?.radar_scores?.balance || quarter.point_balance || null,
                  평점: teamApiData?.radar_scores?.total || quarter.points || null,
                  // 참여도 계산을 위한 공격/수비 포인트 추가
                  point_attack: teamApiData?.radar_scores?.attack || quarter.point_attack || null,
                  point_defense: teamApiData?.radar_scores?.defense || quarter.point_defense || null
                } : null,
                // 통계 데이터가 있을 때만 설정
                detailStats: hasStatsData ? {
                  경기시간: teamApiData?.quarter_info?.duration_minutes ? `${teamApiData.quarter_info.duration_minutes}분` : 
                           quarter.duration ? `${quarter.duration}분` : null,
                  이동거리: teamApiData?.total_stats?.distance ? `${teamApiData.total_stats.distance}km` :
                           quarter.distance ? `${quarter.distance}km` : null,
                  평균속도: teamApiData?.total_stats?.avg_speed ? `${teamApiData.total_stats.avg_speed}km/h` :
                           quarter.avg_speed ? `${quarter.avg_speed}km/h` : null,
                  최고속도: teamApiData?.total_stats?.max_speed ? `${teamApiData.total_stats.max_speed}km/h` :
                           quarter.max_speed ? `${quarter.max_speed}km/h` : null,
                  가속도: teamApiData?.total_stats?.avg_acceleration ? `${teamApiData.total_stats.avg_acceleration}m/s²` : null,
                  최고가속도: teamApiData?.total_stats?.max_acceleration ? `${teamApiData.total_stats.max_acceleration}m/s²` : null,
                  활동량: teamApiData?.available_players_avg ? `${teamApiData.available_players_avg}명` : 
                         (matchData?.participants ? matchData.participants : null),
                  점수: teamApiData?.radar_scores?.total || quarter.points || null
                } : null,
                timeInfo: {
                  startTime: formatTime(teamApiData?.quarter_info?.start_time || quarter.start_time),
                  endTime: formatTime(teamApiData?.quarter_info?.end_time || quarter.end_time)
                }
              };
              
              setQuarterData(newQuarterData);
              
              // 스크롤 위치 복원 (DOM 업데이트 후)
              setTimeout(() => {
                window.scrollTo({
                  top: currentScrollPosition,
                  behavior: 'instant' // 즉시 이동
                });
              }, 50);
            }}
          >
            {quarter.name}
          </button>
          );
        })}
        </div>
      </div>

      {/* 쿼터 정보 카드 */}
      <div className="quarter-info-card">
        <div className="quarter-info-section">
          <div className="quarter-info-left">
            <div className="quarter-details">
              <div className="quarter-score">
                {!isRestQuarter && quarterData?.radarData?.평점 && <span className="score-type text-caption">평점</span>}
                <span className="score-number">
                  {isRestQuarter ? "휴식" : (quarterData?.radarData?.평점 || "-")}
                </span>
                <span className="score-label text-caption">{isRestQuarter ? "" : (quarterData?.radarData?.평점 ? "점" : "")}</span>
              </div>
              {!isRestQuarter && (
                <div className="quarter-time-info">
                  <p className="time-text text-body">
                    <span className="time-label">경기시간</span> 
                    <span className="time-value">{quarterData?.timeInfo?.startTime || '--:--'} ~ {quarterData?.timeInfo?.endTime || '--:--'}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="quarter-info-divider"></div>
          <div className="quarter-info-right">
            <div className="quarter-stat">
              <span className="stat-label text-caption">경기 시간</span>
              <span className="stat-value text-body">{isRestQuarter ? "-" : (quarterData?.detailStats?.경기시간 || "-")}</span>
            </div>
            <div className="quarter-stat">
              <span className="stat-label text-caption">최고속력</span>
              <span className="stat-value text-body">{isRestQuarter ? "-" : (quarterData?.detailStats?.최고속도 || "-")}</span>
            </div>
            <div className="quarter-stat">
              <span className="stat-label text-caption">이동거리</span>
              <span className="stat-value text-body">{isRestQuarter ? "-" : (quarterData?.detailStats?.이동거리 || "-")}</span>
            </div>
            <div className="quarter-stat">
              <span className="stat-label text-caption">참여인원</span>
              <span className="stat-value text-body">{isRestQuarter ? "-" : (quarterData?.detailStats?.활동량 || "-")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* OVR 점수 섹션 - 휴식 쿼터가 아니고 레이더 데이터가 있을 때만 표시 */}
      {!isRestQuarter && quarterData?.radarData && (
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

      {/* 데이터 없음 메시지 - 휴식 쿼터가 아니지만 분석 데이터가 없을 때 */}
      {!isRestQuarter && !quarterData?.radarData && !quarterData?.detailStats && !apiData && (
        <div className="analysis-section">
          <div className="no-data-message">
            <p className="text-body">이 쿼터의 분석 데이터가 아직 없습니다.</p>
            <p className="text-caption">분석이 완료되면 데이터가 표시됩니다.</p>
          </div>
        </div>
      )}

      {/* 이미지 분석 섹션 - 개인분석 페이지와 동일한 디자인 */}
      {!isRestQuarter && apiData?.map_data && (
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
            className={`map-tab ${activeMapTab === 'formation' ? 'active' : ''}`}
            onClick={() => setActiveMapTab('formation')}
          >
            포메이션맵
          </button>
          <button
            className={`map-tab ${activeMapTab === 'direction' ? 'active' : ''}`}
            onClick={() => setActiveMapTab('direction')}
          >
            방향맵
          </button>
        </div>

        {/* 탭 내용 */}
        {activeMapTab === 'heatmap' && generateTeamHeatmap(
          apiData?.map_data?.heatmap,
          matchInfo?.standard || matchData?.standard || "north",
          currentQuarterData?.home || matchData?.home || "west"
        )}
        
        {activeMapTab === 'formation' && generateFormationMap(
          apiData?.map_data?.position_map,
          matchInfo?.standard || matchData?.standard || "north",
          currentQuarterData?.home || matchData?.home || "west"
        )}
        
        {activeMapTab === 'direction' && generateDirectionMap(
          apiData?.map_data?.zone_map,
          matchInfo?.standard || matchData?.standard || "north",
          currentQuarterData?.home || matchData?.home || "west"
        )}
          </>
        )}
      </div>
      )}

      {/* 활동량 분석 섹션 - 실제 데이터가 있을 때만 표시 */}
      {!isRestQuarter && (apiData?.total_stats || apiData?.attack_stats || apiData?.defense_stats) && (
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
                      const attackTime = parseFloat(apiData?.attack_stats?.time || 0);
                      const defenseTime = parseFloat(apiData?.defense_stats?.time || 0);
                      const totalTime = attackTime + defenseTime;
                      
                      let normalizedAttack = 50;
                      let normalizedDefense = 50;
                      
                      if (totalTime > 0) {
                        normalizedAttack = (attackTime / totalTime) * 100;
                        normalizedDefense = (defenseTime / totalTime) * 100;
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

              <div className="activity-details">
                {activeActivityTab === 'total' && (
                  <div className="activity-stats-grid">
                    <div className="activity-stat">
                      <span className="stat-label text-caption">이동거리</span>
                      <span className="stat-value text-body">{formatValue(apiData?.total_stats?.distance, 'km')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">이동시간</span>
                      <span className="stat-value text-body">{formatValue(apiData?.total_stats?.time, '분')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">평균속력</span>
                      <span className="stat-value text-body">{formatValue(apiData?.total_stats?.avg_speed, 'km/h')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">최고속력</span>
                      <span className="stat-value text-body">{formatValue(apiData?.total_stats?.max_speed, 'km/h')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">평균가속도</span>
                      <span className="stat-value text-body">{formatValue(apiData?.total_stats?.avg_acceleration, 'm/s²')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">최고가속도</span>
                      <span className="stat-value text-body">{formatValue(apiData?.total_stats?.max_acceleration, 'm/s²')}</span>
                    </div>
                  </div>
                )}
                
                {activeActivityTab === 'attack' && (
                  <div className="activity-stats-grid">
                    <div className="activity-stat">
                      <span className="stat-label text-caption">공격 이동거리</span>
                      <span className="stat-value text-body">{formatValue(apiData?.attack_stats?.distance, 'km')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">공격 이동시간</span>
                      <span className="stat-value text-body">{formatValue(apiData?.attack_stats?.time, '분')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">공격 평균속력</span>
                      <span className="stat-value text-body">{formatValue(apiData?.attack_stats?.avg_speed, 'km/h')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">공격 최고속력</span>
                      <span className="stat-value text-body">{formatValue(apiData?.attack_stats?.max_speed, 'km/h')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">공격 평균가속도</span>
                      <span className="stat-value text-body">{formatValue(apiData?.attack_stats?.avg_acceleration, 'm/s²')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">공격 최고가속도</span>
                      <span className="stat-value text-body">{formatValue(apiData?.attack_stats?.max_acceleration, 'm/s²')}</span>
                    </div>
                  </div>
                )}
                
                {activeActivityTab === 'defense' && (
                  <div className="activity-stats-grid">
                    <div className="activity-stat">
                      <span className="stat-label text-caption">수비 이동거리</span>
                      <span className="stat-value text-body">{formatValue(apiData?.defense_stats?.distance, 'km')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">수비 이동시간</span>
                      <span className="stat-value text-body">{formatValue(apiData?.defense_stats?.time, '분')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">수비 평균속력</span>
                      <span className="stat-value text-body">{formatValue(apiData?.defense_stats?.avg_speed, 'km/h')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">수비 최고속력</span>
                      <span className="stat-value text-body">{formatValue(apiData?.defense_stats?.max_speed, 'km/h')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">수비 평균가속도</span>
                      <span className="stat-value text-body">{formatValue(apiData?.defense_stats?.avg_acceleration, 'm/s²')}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label text-caption">수비 최고가속도</span>
                      <span className="stat-value text-body">{formatValue(apiData?.defense_stats?.max_acceleration, 'm/s²')}</span>
                    </div>
                  </div>
                )}
              </div>

            </>
          )}
        </div>
      )}

      {/* 속력 및 가속도 섹션 - 실제 데이터가 있을 때만 표시 */}
      {!isRestQuarter && (apiData?.total_stats?.avg_speed || apiData?.total_stats?.avg_acceleration) && (
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
                                // 팀 분석 속력 데이터 처리
                                let speedData = null;
                                try {
                                  const rawData = apiData?.total_stats?.speed_list;
                                  if (rawData) {
                                    if (typeof rawData === 'string') {
                                      speedData = JSON.parse(rawData);
                                    } else if (Array.isArray(rawData)) {
                                      speedData = rawData;
                                    }
                                  }
                                } catch (error) {
                                  // 데이터 파싱 실패 무시
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
                                
                                // 10 이동평균선 계산
                                const calculateMovingAverage = (data, windowSize = 10) => {
                                  const result = [];
                                  for (let i = 0; i < data.length; i++) {
                                    const start = Math.max(0, i - Math.floor(windowSize / 2));
                                    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
                                    const window = data.slice(start, end);
                                    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
                                    result.push(average);
                                  }
                                  return result;
                                };
                                
                                const smoothedSpeedData = calculateMovingAverage(speedData, 10);
                                const maxSpeed = Math.max(...smoothedSpeedData);
                                const minSpeed = 0; // 최솟값을 0으로 설정
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
                                      const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                                      const cp1y = prev.y;
                                      const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                                      const cp2y = curr.y;
                                      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                                    } else if (i === points.length - 1) {
                                      const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                                      const cp1y = prev.y;
                                      const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                                      const cp2y = curr.y;
                                      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                                    } else {
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
                                    
                                    {/* Y축 그리드 라인 */}
                                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                                      const y = margin.top + chartHeight - ratio * chartHeight;
                                      const value = (minSpeed + ratio * range).toFixed(1);
                                      return (
                                        <g key={ratio}>
                                          <line
                                            x1={margin.left}
                                            y1={y}
                                            x2={margin.left + chartWidth}
                                            y2={y}
                                            stroke="#E2E8F0"
                                            strokeWidth="1"
                                          />
                                          <text
                                            x={margin.left - 8}
                                            y={y + 4}
                                            textAnchor="end"
                                            fill="#6B7078"
                                            fontSize="10"
                                          >
                                            {value}
                                          </text>
                                        </g>
                                      );
                                    })}
                                    
                                    {/* X축 */}
                                    <line
                                      x1={margin.left}
                                      y1={margin.top + chartHeight}
                                      x2={margin.left + chartWidth}
                                      y2={margin.top + chartHeight}
                                      stroke="#E2E8F0"
                                      strokeWidth="1"
                                    />
                                    
                                    {/* Y축 */}
                                    <line
                                      x1={margin.left}
                                      y1={margin.top}
                                      x2={margin.left}
                                      y2={margin.top + chartHeight}
                                      stroke="#E2E8F0"
                                      strokeWidth="1"
                                    />
                                    
                                    {/* X축 시간 라벨 */}
                                    {(() => {
                                      // 실제 쿼터 시간 정보 사용
                                      const totalTimeMinutes = apiData?.quarter_info?.duration_minutes || 
                                                               quarterData?.detailStats?.경기시간?.replace('분', '') || 
                                                               15; // 기본값 15분
                                      const totalTime = parseInt(totalTimeMinutes);
                                      const timeInterval = Math.max(3, Math.ceil(totalTime / 5)); // 최소 3분 간격
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
                                      d={`${createSmoothPath(smoothedSpeedData)} L ${margin.left + chartWidth} ${margin.top + chartHeight} L ${margin.left} ${margin.top + chartHeight} Z`}
                                      fill="url(#speedGradient)"
                                    />
                                    
                                    {/* 메인 라인 - 디자인 시스템 색상 사용 */}
                                    <path
                                      d={createSmoothPath(smoothedSpeedData)}
                                      fill="none"
                                      stroke="#079669"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    
                                    {/* 데이터 포인트 - 더 작게 */}
                                    {smoothedSpeedData.map((value, index) => {
                                      if (index % Math.ceil(smoothedSpeedData.length / 8) !== 0) return null;
                                      const x = margin.left + (index / (smoothedSpeedData.length - 1)) * chartWidth;
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
                        <span className="stat-value text-body">{formatValue(apiData?.total_stats?.max_speed, 'km/h')}</span>
                      </div>
                      <div className="speed-stat">
                        <span className="stat-label text-caption">평균 속력</span>
                        <span className="stat-value text-body">{formatValue(apiData?.total_stats?.avg_speed, 'km/h')}</span>
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
                                // 팀 분석 가속도 데이터 처리
                                let accelerationData = null;
                                try {
                                  const rawData = apiData?.total_stats?.acceleration_list;
                                  if (rawData) {
                                    if (typeof rawData === 'string') {
                                      accelerationData = JSON.parse(rawData);
                                    } else if (Array.isArray(rawData)) {
                                      accelerationData = rawData;
                                    }
                                  }
                                } catch (error) {
                                  // 데이터 파싱 실패 무시
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
                                
                                // 10 이동평균선 계산
                                const calculateMovingAverage = (data, windowSize = 10) => {
                                  const result = [];
                                  for (let i = 0; i < data.length; i++) {
                                    const start = Math.max(0, i - Math.floor(windowSize / 2));
                                    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
                                    const window = data.slice(start, end);
                                    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
                                    result.push(average);
                                  }
                                  return result;
                                };
                                
                                const smoothedAccelerationData = calculateMovingAverage(accelerationData, 10);
                                const maxAcceleration = Math.max(...smoothedAccelerationData);
                                const minAcceleration = 0; // 최솟값을 0으로 설정
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
                                      const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                                      const cp1y = prev.y;
                                      const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                                      const cp2y = curr.y;
                                      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                                    } else if (i === points.length - 1) {
                                      const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                                      const cp1y = prev.y;
                                      const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                                      const cp2y = curr.y;
                                      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                                    } else {
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
                                        <stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
                                        <stop offset="100%" stopColor="rgba(239, 68, 68, 0.05)" />
                                      </linearGradient>
                                    </defs>
                                    
                                    {/* Y축 그리드 라인 */}
                                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                                      const y = margin.top + chartHeight - ratio * chartHeight;
                                      const value = (minAcceleration + ratio * range).toFixed(1);
                                      return (
                                        <g key={ratio}>
                                          <line
                                            x1={margin.left}
                                            y1={y}
                                            x2={margin.left + chartWidth}
                                            y2={y}
                                            stroke="#E2E8F0"
                                            strokeWidth="1"
                                          />
                                          <text
                                            x={margin.left - 8}
                                            y={y + 4}
                                            textAnchor="end"
                                            fill="#6B7078"
                                            fontSize="10"
                                          >
                                            {value}
                                          </text>
                                        </g>
                                      );
                                    })}
                                    
                                    {/* X축 */}
                                    <line
                                      x1={margin.left}
                                      y1={margin.top + chartHeight}
                                      x2={margin.left + chartWidth}
                                      y2={margin.top + chartHeight}
                                      stroke="#E2E8F0"
                                      strokeWidth="1"
                                    />
                                    
                                    {/* Y축 */}
                                    <line
                                      x1={margin.left}
                                      y1={margin.top}
                                      x2={margin.left}
                                      y2={margin.top + chartHeight}
                                      stroke="#E2E8F0"
                                      strokeWidth="1"
                                    />
                                    
                                    {/* X축 시간 라벨 */}
                                    {(() => {
                                      // 실제 쿼터 시간 정보 사용
                                      const totalTimeMinutes = apiData?.quarter_info?.duration_minutes || 
                                                               quarterData?.detailStats?.경기시간?.replace('분', '') || 
                                                               15; // 기본값 15분
                                      const totalTime = parseInt(totalTimeMinutes);
                                      const timeInterval = Math.max(3, Math.ceil(totalTime / 5)); // 최소 3분 간격
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
                                      d={`${createSmoothPath(smoothedAccelerationData)} L ${margin.left + chartWidth} ${margin.top + chartHeight} L ${margin.left} ${margin.top + chartHeight} Z`}
                                      fill="url(#accelerationGradient)"
                                    />
                                    
                                    {/* 메인 라인 - 빨간색 계열 */}
                                    <path
                                      d={createSmoothPath(smoothedAccelerationData)}
                                      fill="none"
                                      stroke="#ef4444"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    
                                    {/* 데이터 포인트 */}
                                    {smoothedAccelerationData.map((value, index) => {
                                      if (index % Math.ceil(smoothedAccelerationData.length / 8) !== 0) return null;
                                      const x = margin.left + (index / (smoothedAccelerationData.length - 1)) * chartWidth;
                                      const y = margin.top + chartHeight - ((value - minAcceleration) / range) * chartHeight;
                                      return (
                                        <circle
                                          key={index}
                                          cx={x}
                                          cy={y}
                                          r="2"
                                          fill="#ef4444"
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
                        <span className="stat-value text-body">{formatValue(apiData?.total_stats?.max_acceleration, 'm/s²')}</span>
                      </div>
                      <div className="acceleration-stat">
                        <span className="stat-label text-caption">평균 가속도</span>
                        <span className="stat-value text-body">{formatValue(apiData?.total_stats?.avg_acceleration, 'm/s²')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* 팀 형태 분석 섹션 - 실제 데이터가 있을 때만 표시 */}
      {!isRestQuarter && apiData?.team_coordination && (
        <div className="analysis-section">
          <div className="section-header">
            <div className="section-icon">
              <img src={chartIcon} alt="팀 형태" />
            </div>
            <h3 className="section-title text-h3">팀 형태 분석</h3>
            <button 
              className="collapse-button"
              onClick={() => toggleSection('shape')}
              aria-label={sectionCollapsed.shape ? '펼치기' : '접기'}
            >
              <img 
                src={sectionCollapsed.shape ? downIcon : upIcon} 
                alt={sectionCollapsed.shape ? '펼치기' : '접기'} 
                className="collapse-icon"
              />
            </button>
          </div>
          
          {!sectionCollapsed.shape && (
            <>
              <div className="shape-tabs">
                <button
                  className={`shape-tab ${activeShapeTab === 'cohesion' ? 'active' : ''}`}
                  onClick={() => setActiveShapeTab('cohesion')}
                >
                  응집도
                </button>
                <button
                  className={`shape-tab ${activeShapeTab === 'density' ? 'active' : ''}`}
                  onClick={() => setActiveShapeTab('density')}
                >
                  밀집도
                </button>
                <button
                  className={`shape-tab ${activeShapeTab === 'occupation' ? 'active' : ''}`}
                  onClick={() => setActiveShapeTab('occupation')}
                >
                  점유율
                </button>
                <button
                  className={`shape-tab ${activeShapeTab === 'dimension' ? 'active' : ''}`}
                  onClick={() => setActiveShapeTab('dimension')}
                >
                  팀 크기
                </button>
              </div>

              <div className="shape-details">
                {activeShapeTab === 'cohesion' && (
                  <>
                    <div className="shape-stats-grid">
                      <div className="shape-stat">
                        <span className="stat-label text-caption">전체 평균 응집도</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.total?.coordination, '')}</span>
                      </div>
                      <div className="shape-stat">
                        <span className="stat-label text-caption">공격 평균 응집도</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.attack?.coordination, '')}</span>
                      </div>
                      <div className="shape-stat">
                        <span className="stat-label text-caption">수비 평균 응집도</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.defense?.coordination, '')}</span>
                      </div>
                    </div>
                  </>
                )}
                
                {activeShapeTab === 'density' && (
                  <>
                    <div className="shape-stats-grid">
                      <div className="shape-stat">
                        <span className="stat-label text-caption">전체 평균 밀집도</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.total?.density, '명/m²')}</span>
                      </div>
                      <div className="shape-stat">
                        <span className="stat-label text-caption">공격 평균 밀집도</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.attack?.density, '명/m²')}</span>
                      </div>
                      <div className="shape-stat">
                        <span className="stat-label text-caption">수비 평균 밀집도</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.defense?.density, '명/m²')}</span>
                      </div>
                    </div>
                  </>
                )}
                
                {activeShapeTab === 'occupation' && (
                  <>
                    <div className="shape-stats-grid">
                      <div className="shape-stat">
                        <span className="stat-label text-caption">전체 평균 점유율</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.total?.stretch, '%')}</span>
                      </div>
                      <div className="shape-stat">
                        <span className="stat-label text-caption">공격 평균 점유율</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.attack?.stretch, '%')}</span>
                      </div>
                      <div className="shape-stat">
                        <span className="stat-label text-caption">수비 평균 점유율</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.defense?.stretch, '%')}</span>
                      </div>
                    </div>
                  </>
                )}
                
                {activeShapeTab === 'dimension' && (
                  <>
                    <div className="shape-stats-grid">
                      <div className="shape-stat">
                        <span className="stat-label text-caption">평균 팀 길이</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.total?.length, 'm')}</span>
                      </div>
                      <div className="shape-stat">
                        <span className="stat-label text-caption">평균 팀 폭</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.total?.width, 'm')}</span>
                      </div>
                      <div className="shape-stat">
                        <span className="stat-label text-caption">평균 인덱스</span>
                        <span className="stat-value text-body">{formatValue(apiData?.team_coordination?.total?.synchronization, 'm')}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* 관련 영상 섹션 - 실제 영상 데이터가 있을 때만 표시 */}
      {!isRestQuarter && videos.length > 0 && (
        <div className="analysis-section">
          <div className="section-header">
            <div className="section-icon">
              <img src={FolderBlack} alt="관련 영상" />
            </div>
            <h3 className="section-title text-h3">관련 영상</h3>
            <button 
              className="collapse-button"
              onClick={() => toggleSection('video')}
            >
              <img 
                src={sectionCollapsed.video ? downIcon : upIcon} 
                alt={sectionCollapsed.video ? '펼치기' : '접기'} 
              />
            </button>
          </div>
          
          {!sectionCollapsed.video && (
            <div className="videos-list">
              {videosLoading ? (
                <div className="videos-loading">
                  <p className="text-body">영상을 불러오는 중...</p>
                </div>
              ) : (
                videos.map((video, index) => (
                  <div 
                    key={index} 
                    className="video-item"
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <div className="video-thumbnail">
                      <img src={video.thumbnail || defaultTeamLogo} alt={video.title} />
                    </div>
                    <div className="video-info">
                      <h4 className="video-title text-body">{video.title}</h4>
                      <p className="video-description text-caption">{video.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Team_Anal_Detail;



