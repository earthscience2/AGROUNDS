import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/Anal_Detail.scss';

// 아이콘 import
import starIcon from '../../../assets/common/star.png';
import speedIcon from '../../../assets/common/star.png';
import distanceIcon from '../../../assets/common/location.png';
import timeIcon from '../../../assets/common/clock.png';
import chartIcon from '../../../assets/common/graph-black.png';

// 더미 프로필 이미지 import
import defaultProfile from '../../../assets/common/default_profile.png';

const Anal_Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [quarterData, setQuarterData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // state에서 전달받은 데이터
  const { quarter, matchData } = location.state || {};

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

  // 더미 데이터 생성
  const generateDummyData = () => {
    return {
      playerName: matchData?.playerName || "김태영",
      playerPosition: "CM",
      quarterName: quarter?.name || "1쿼터",
      quarterNumber: quarter?.quarter || 1,
      
      // 개인 레이더 차트 데이터 (메인 페이지와 동일한 구조)
      radarData: {
        체력: 82,
        순발력: 75,
        스피드: 68,
        가속도: 88,
        스프린트: 91,
        평점: 73
      },
      
      // 히트맵 더미 데이터 (필드 위치별 활동도)
      heatmapData: [
        { x: 25, y: 30, intensity: 0.8 },
        { x: 35, y: 45, intensity: 0.9 },
        { x: 40, y: 50, intensity: 1.0 },
        { x: 30, y: 60, intensity: 0.7 },
        { x: 50, y: 40, intensity: 0.6 },
        { x: 60, y: 35, intensity: 0.5 },
        { x: 45, y: 25, intensity: 0.8 },
        { x: 55, y: 55, intensity: 0.7 },
        { x: 20, y: 50, intensity: 0.6 },
        { x: 70, y: 45, intensity: 0.4 }
      ],
      
      // 상세 통계
      detailStats: {
        경기시간: "20분",
        이동거리: "1.89km",
        평균속도: "5.49km/h",
        최고속도: "26.17km/h",
        가속도: "2.04m/s²",
        최고가속도: "19.01m/s²",
        활동량: "19.69%",
        점수: 82
      },
      
      // 속력 및 가속도 그래프 데이터
      speedData: {
        최고속도: "5.49km/h",
        평균속도: "26.17km/h",
        최고가속도: "2.04m/s²",
        평균가속도: "19.01m/s²"
      },
      
      // 스프린트 데이터
      sprintData: {
        총스프린트거리: "12.26m",
        평균스프린트속도: "21.71km/h"
      },
      
      // 경기 영상 더미
      matchVideo: "match_video_thumbnail.jpg",
      
      // AI 분석
      aiAnalysis: [
        "중앙 미드필더로서 뛰어난 패스 능력을 보여주었습니다.",
        "경기 중반부에 가장 활발한 움직임을 보였습니다.",
        "수비 시 백업 포지셔닝이 우수했습니다.",
        "공격 전환 시점에서의 판단력이 돋보였습니다."
      ]
    };
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
    const radarChartData = [
      { label: '체력', value: data.체력 || 0 },
      { label: '순발력', value: data.순발력 || 0 },
      { label: '스피드', value: data.스피드 || 0 },
      { label: '가속도', value: data.가속도 || 0 },
      { label: '스프린트', value: data.스프린트 || 0 },
      { label: '평점', value: data.평점 || 0 }
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
          {[0, 25, 50, 75, 100].map((value, index) => {
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

  // 히트맵 생성
  const generateHeatmap = (data) => {
    return (
      <div className="heatmap-container">
        <svg width="100%" height="200" viewBox="0 0 300 200" className="field-svg">
          {/* 축구장 배경 */}
          <rect width="300" height="200" fill="#4F7942" stroke="#fff" strokeWidth="2"/>
          
          {/* 중앙선 */}
          <line x1="150" y1="0" x2="150" y2="200" stroke="#fff" strokeWidth="2"/>
          <circle cx="150" cy="100" r="30" fill="none" stroke="#fff" strokeWidth="2"/>
          <circle cx="150" cy="100" r="2" fill="#fff"/>
          
          {/* 골대 */}
          <rect x="0" y="70" width="20" height="60" fill="none" stroke="#fff" strokeWidth="2"/>
          <rect x="280" y="70" width="20" height="60" fill="none" stroke="#fff" strokeWidth="2"/>
          
          {/* 페널티 박스 */}
          <rect x="0" y="50" width="60" height="100" fill="none" stroke="#fff" strokeWidth="2"/>
          <rect x="240" y="50" width="60" height="100" fill="none" stroke="#fff" strokeWidth="2"/>
          
          {/* 히트맵 포인트들 */}
          {data.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x * 3}
                cy={point.y * 2}
                r={15 * point.intensity}
                fill={`rgba(255, 107, 107, ${point.intensity * 0.6})`}
                className="heatmap-point"
              />
            </g>
          ))}
        </svg>
        <p className="heatmap-legend text-caption">※ 빨간 영역일수록 활동량이 높은 구역입니다</p>
      </div>
    );
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
    
    // 실제 데이터로 초기화
    const initialData = generateDummyData();
    initialData.quarterName = quarter.name;
    initialData.quarterNumber = quarter.quarter;
    
    // 실제 쿼터 데이터 반영
    initialData.detailStats = {
      경기시간: `${quarter.duration || 0}분`,
      이동거리: quarter.distance || '0km',
      평균속도: '-', // 더미 데이터
      최고속도: quarter.max_speed || '0km/h',
      가속도: '-', // 더미 데이터
      최고가속도: '-', // 더미 데이터
      활동량: '-', // 더미 데이터
      스프린트: `${quarter.sprint_count || 0}회`, // T_S 실제 데이터
      점수: 0 // 이제 calculateAverageOVR 함수로 계산됨
    };
    
    // 레이더 차트 실제 데이터 반영
    initialData.radarData = {
      체력: quarter.radar_scores?.stamina || 0,
      순발력: quarter.radar_scores?.positiveness || 0,
      스피드: quarter.radar_scores?.speed || 0,
      가속도: quarter.radar_scores?.acceleration || 0,
      스프린트: quarter.radar_scores?.sprint || 0,
      평점: quarter.points || 0
    };
    
    // 시간 정보 추가 (PlayerQuarter 테이블의 start_time, end_time 실제 데이터)
    initialData.timeInfo = {
      startTime: formatTime(quarter.start_time),
      endTime: formatTime(quarter.end_time)
    };
    
    setQuarterData(initialData);
    setLoading(false);
  }, [quarter, matchData, navigate]);

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

      {/* 쿼터 탭 */}
      <div className="quarter-tabs">
        {matchData?.quarters?.map((quarter) => (
          <button
            key={quarter.quarter}
            className={`quarter-tab ${quarter.quarter === quarterData.quarterNumber ? 'active' : ''}`}
            onClick={() => {
              // 실제 쿼터 데이터로 업데이트
              const newQuarterData = generateDummyData();
              newQuarterData.quarterName = quarter.name;
              newQuarterData.quarterNumber = quarter.quarter;
              
              // 실제 쿼터 데이터 반영
              newQuarterData.detailStats = {
                경기시간: `${quarter.duration || 0}분`,
                이동거리: quarter.distance || '0km',
                평균속도: '-', // 더미 데이터
                최고속도: quarter.max_speed || '0km/h',
                가속도: '-', // 더미 데이터
                최고가속도: '-', // 더미 데이터
                활동량: '-', // 더미 데이터
                스프린트: `${quarter.sprint_count || 0}회`, // T_S 실제 데이터
                점수: 0 // 이제 calculateAverageOVR 함수로 계산됨
              };
              
              // 레이더 차트 실제 데이터 반영
              newQuarterData.radarData = {
                체력: quarter.radar_scores?.stamina || 0,
                순발력: quarter.radar_scores?.positiveness || 0,
                스피드: quarter.radar_scores?.speed || 0,
                가속도: quarter.radar_scores?.acceleration || 0,
                스프린트: quarter.radar_scores?.sprint || 0,
                평점: quarter.points || 0
              };
              
              // 시간 정보 추가 (PlayerQuarter 테이블의 start_time, end_time 실제 데이터)
              newQuarterData.timeInfo = {
                startTime: formatTime(quarter.start_time),
                endTime: formatTime(quarter.end_time)
              };
              
              setQuarterData(newQuarterData);
            }}
          >
            {quarter.name}
          </button>
        ))}
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
            <span className="icon-emoji">⚽</span>
          </div>
          <h3 className="section-title text-h3">OVR 점수</h3>
        </div>
        <div className="radar-section">
          {generateRadarChart(quarterData.radarData)}
        </div>
      </div>

      {/* 히트맵 섹션 */}
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <span className="icon-emoji">📍</span>
          </div>
          <h3 className="section-title text-h3">히트맵</h3>
        </div>
        {generateHeatmap(quarterData.heatmapData)}
      </div>

      {/* 경기 영상 섹션 */}
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <img src={chartIcon} alt="경기 영상" />
          </div>
          <h3 className="section-title text-h3">경기 영상</h3>
        </div>
        <div className="video-section">
          <div className="video-thumbnail">
            <div className="video-placeholder">
              <span className="play-icon">▶</span>
              <p className="text-caption">경기 영상 재생</p>
            </div>
          </div>
        </div>
      </div>

      {/* 활동량 섹션 */}
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <img src={starIcon} alt="활동량" />
          </div>
          <h3 className="section-title text-h3">활동량</h3>
        </div>
        <div className="activity-chart">
          <div className="activity-bar">
            <div className="activity-progress" style={{width: '72%'}}></div>
            <span className="activity-percentage">72%</span>
          </div>
          <div className="activity-stats">
            <div className="activity-stat">
              <span className="stat-label text-caption">경기시간</span>
              <span className="stat-value text-body">{quarterData.detailStats.경기시간}</span>
            </div>
            <div className="activity-stat">
              <span className="stat-label text-caption">이동거리</span>
              <span className="stat-value text-body">{quarterData.detailStats.이동거리}</span>
            </div>
            <div className="activity-stat">
              <span className="stat-label text-caption">평균 이동거리</span>
              <span className="stat-value text-body">91.49m</span>
            </div>
            <div className="activity-stat">
              <span className="stat-label text-caption">발산되는 횟수</span>
              <span className="stat-value text-body">16회</span>
            </div>
            <div className="activity-stat">
              <span className="stat-label text-caption">곧 발산되는 횟수</span>
              <span className="stat-value text-body">4회</span>
            </div>
            <div className="activity-stat">
              <span className="stat-label text-caption">활동 범위</span>
              <span className="stat-value text-body">{quarterData.detailStats.활동량}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 속력 및 가속도 섹션 */}
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <img src={speedIcon} alt="속력" />
          </div>
          <h3 className="section-title text-h3">속력 및 가속도</h3>
        </div>
        <div className="speed-charts">
          <div className="speed-chart-row">
            <div className="speed-item">
              <span className="speed-label text-caption">최고 속력</span>
              <div className="speed-graph">
                <div className="speed-line" style={{height: '60%'}}></div>
              </div>
              <span className="speed-value text-body">{quarterData.speedData.최고속도}</span>
            </div>
            <div className="speed-item">
              <span className="speed-label text-caption">평균 속력</span>
              <div className="speed-graph">
                <div className="speed-line" style={{height: '80%'}}></div>
              </div>
              <span className="speed-value text-body">{quarterData.speedData.평균속도}</span>
            </div>
          </div>
          
          <div className="acceleration-stats">
            <div className="acceleration-item">
              <span className="stat-label text-caption">최고 가속도</span>
              <span className="stat-value text-body">{quarterData.speedData.최고가속도}</span>
            </div>
            <div className="acceleration-item">
              <span className="stat-label text-caption">평균 가속도</span>
              <span className="stat-value text-body">{quarterData.speedData.평균가속도}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 스프린트 섹션 */}
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <img src={distanceIcon} alt="스프린트" />
          </div>
          <h3 className="section-title text-h3">스프린트</h3>
        </div>
        <div className="sprint-stats">
          <div className="sprint-item">
            <span className="stat-label text-caption">앞으로 스프린트 거리</span>
            <span className="stat-value text-body">{quarterData.sprintData.총스프린트거리}</span>
          </div>
          <div className="sprint-item">
            <span className="stat-label text-caption">평균 스프린트 속력</span>
            <span className="stat-value text-body">{quarterData.sprintData.평균스프린트속도}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anal_Detail;
