import React, { useState, useEffect, useRef } from 'react';
import LogoBellNav from '../../../components/Logo_bell_Nav';
// import MainSummary from '../../../components/Main_Summary';
import '../css/Main.scss';
// import Main_Subject from '../../../components/Main_Subject';
// import { Device, MatchPlan, MatchVideo, MyOvr, MyTeam, NoTeam } from '../../../function/SubjectContents';
// import RecentMatch from '../../../components/RecentMatch';
import { useNavigate } from 'react-router-dom';
import ovrBgImage from '../../../assets/ovr/ovr_bgr.png';
import ovrNoneImage from '../../../assets/ovr/ovr_none.png';
import ovrSmallImage from '../../../assets/ovr/ovr_small.png';
import positionBlue from '../../../assets/position/blue.png';
import positionGreen from '../../../assets/position/green.png';
import positionOrange from '../../../assets/position/orange.png';
import positionYellow from '../../../assets/position/yellow.png';

import { AnalPositionColor } from '../../../function/PositionColor';
import { GetUserAnalysisDataApi, GetUserOvrDataApi, GetUserStatsDataApi, GetUserPointDataApi } from '../../../function/api/user/userApi';

const Main = () => {
  const navigate = useNavigate();

  // 카드 페이지로 이동하는 함수
  const handleCardNavigation = () => {
    navigate('/app/card');
  };

  // 개인분석 페이지로 이동하는 함수
  const handleAnalysisNavigation = () => {
    navigate('/app/player/folder');
  };

  // 팀 찾기 페이지로 이동하는 함수
  const handleFindTeamNavigation = () => {
    navigate('/app/jointeam');
  };
  const userType = sessionStorage.getItem('userType');
  const userCode = sessionStorage.getItem('userCode');
  
  // 사용자 데이터 상태
  const [userData, setUserData] = useState({
    name: "",
    age: 0,
    position: "",
    ovr: 0,
    maxSpeed: 0,
    sprint: 0,
    attackIndex: 0,
    defenseIndex: 0
  });
  const [loading, setLoading] = useState(true);
  const [ovrData, setOvrData] = useState({
    ovr: 0,
    matches_count: 0,
    quarter_count: 0,
    message: ""
  });

  const [radarData, setRadarData] = useState({
    point_total: 0,
    point_stamina: 0,
    point_positiveness: 0,
    point_speed: 0,
    point_acceleration: 0,
    point_sprint: 0
  });

  const [miniChartData, setMiniChartData] = useState({
    point_total: [0, 0, 0, 0, 0],
    distance: [0, 0, 0, 0, 0],
    max_speed: [0, 0, 0, 0, 0],
    sprint: [0, 0, 0, 0, 0]
  });


  
  // API에서 사용자 데이터 가져오기 (새로운 DB 구조 반영)
  useEffect(() => {
    if (userCode) {
      // API 비활성화로 인한 세션 스토리지 사용
      Promise.resolve({ data: {
        name: sessionStorage.getItem('userName') || '사용자',
        birth: sessionStorage.getItem('userBirth') || '1999-01-01',
        preferred_position: sessionStorage.getItem('userPosition') || 'CB'
      }})
        .then((response) => {
          const data = response.data;
          
          // 나이 계산 (birth가 'YYYY-MM-DD' 형식이라고 가정)
          const calculateAge = (birthDate) => {
            if (!birthDate) return 25;
            const birth = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
              age--;
            }
            return age;
          };
          
          setUserData({
            name: data.name || "사용자",
            age: calculateAge(data.birth),
            position: data.preferred_position || "CB",
            ovr: 0, // OVR은 별도 API에서 가져올 예정
            maxSpeed: 0, // TODO: 실제 스탯 데이터 연결
            sprint: 0,
            attackIndex: 0,
            defenseIndex: 0
          });
          setLoading(false);
          
          // OVR 데이터 - 실제 데이터 파싱된 API 사용
          const loadOvrData = async () => {
            // 1차: 새로 구현된 OVR API 시도 (실제 데이터 파싱)
            try {
              console.log('🔍 실제 OVR 데이터 API 호출 중...');
              const response = await GetUserOvrDataApi(userCode);
              const data = response.data;
              
              console.log('✅ OVR API 성공 (실제 데이터):', data);
              console.log('🔍 레이더 차트 데이터 확인:', data.radar_data);
              console.log('🔍 포인트 데이터 확인:', data.point);
              
              return {
                ovr: data.ovr || 0,
                matches_count: data.matches_count || 0,
                quarter_count: data.quarter_count || 0,
                message: data.message || "분석 후 지표 확인가능해요",
                debug_info: data.debug_info || null,
                // 백엔드에서 계산된 6가지 지표 그대로 사용
                point: data.point || {
                  total: data.ovr || 0,
                  sprint: 0,
                  acceleration: 0,
                  speed: 0,
                  positiveness: 0,
                  stamina: 0
                },
                radar_data: data.radar_data || {
                  point_total: data.ovr || 0,
                  point_sprint: 0,
                  point_acceleration: 0,
                  point_speed: 0,
                  point_positiveness: 0,
                  point_stamina: 0
                },
                // OVR 단독 API에는 미니차트가 없을 수 있어 기본값 유지
                mini_chart_data: data.mini_chart_data || {
                  point_total: [0, 0, 0, 0, 0],
                  distance: [0, 0, 0, 0, 0],
                  max_speed: [0, 0, 0, 0, 0],
                  sprint: [0, 0, 0, 0, 0]
                }
              };
            } catch (ovrError) {
              console.log('❌ OVR API 실패:', ovrError.response?.status, ovrError.response?.data);
              
              // 2차: 통합 분석 데이터 API 시도 (수정된 API 경로 우선)
              const fallbackEndpoints = [
                { name: 'OVR 데이터', api: () => GetUserOvrDataApi(userCode) },
                { name: '통계 데이터', api: () => GetUserStatsDataApi(userCode) },
                { name: '포인트 데이터', api: () => GetUserPointDataApi(userCode) },
                { name: '통합 분석 데이터', api: () => GetUserAnalysisDataApi(userCode) }
              ];

              for (const endpoint of fallbackEndpoints) {
                try {
                  console.log(`${endpoint.name} API 시도 중...`);
                  const response = await endpoint.api();
                  const data = response.data;
                  
                  console.log(`${endpoint.name} API 성공:`, data);
                  
                  return {
                    ovr: data.ovr || data.total || 0,
                    matches_count: data.matches_count || data.match_count || 0,
                    message: data.message || "분석 후 지표 확인가능해요",
                    point: data.point || {
                      total: data.total || 0,
                      sprint: data.sprint || 0,
                      acceleration: data.acceleration || 0,
                      speed: data.speed || 0,
                      positiveness: data.positiveness || 0,
                      stamina: data.stamina || 0
                    },
                    radar_data: data.radar_data || {
                      point_total: data.total || 25,
                      point_sprint: data.sprint || 25,
                      point_acceleration: data.acceleration || 25,
                      point_speed: data.speed || 25,
                      point_positiveness: data.positiveness || 25,
                      point_stamina: data.stamina || 25
                    },
                    mini_chart_data: data.mini_chart_data || {
                      point_total: [0, 0, 0, 0, 0],
                      distance: [0, 0, 0, 0, 0],
                      max_speed: [0, 0, 0, 0, 0],
                      sprint: [0, 0, 0, 0, 0]
                    }
                  };
                } catch (error) {
                  console.log(`${endpoint.name} API 실패:`, error.response?.status);
                  continue; // 다음 API 시도
                }
              }
              
              // 모든 API 실패 시 기본값 반환
              console.log('⚠️ 모든 OVR API 엔드포인트가 실패했습니다. 기본값을 사용합니다.');
              return {
                ovr: 0,
                matches_count: 0,
                message: "데이터를 불러올 수 없습니다",
                point: {
                  total: 0,
                  sprint: 0,
                  acceleration: 0,
                  speed: 0,
                  positiveness: 0,
                  stamina: 0
                },
                radar_data: {
                  point_total: 0,
                  point_sprint: 0,
                  point_acceleration: 0,
                  point_speed: 0,
                  point_positiveness: 0,
                  point_stamina: 0
                },
                mini_chart_data: {
                  point_total: [0, 0, 0, 0, 0],
                  distance: [0, 0, 0, 0, 0],
                  max_speed: [0, 0, 0, 0, 0],
                  sprint: [0, 0, 0, 0, 0]
                }
              };
            }
          };
          
          loadOvrData().then((data) => {
            return Promise.resolve({ data });
          })
                .then((ovrResponse) => {
                  const data = ovrResponse.data;
                  
                  // 디버깅 정보가 있으면 콘솔에 출력 (개발 환경에서만)
                  if (data.debug_info && process.env.NODE_ENV === 'development') {
                    console.log('🔍 OVR API 디버깅 정보:', data.debug_info);
                  }
                  
                  // 데이터 유효성 검사 함수
                  const validateData = (data) => {
                    if (!data) return false;
                    const requiredFields = ['ovr', 'matches_count', 'quarter_count'];
                    return requiredFields.every(field => typeof data[field] !== 'undefined');
                  };

                  // 데이터 정규화 함수
                  const normalizeValue = (value, min = 0, max = 100) => {
                    const num = Number(value);
                    if (!Number.isFinite(num)) return 0;
                    return Math.max(min, Math.min(max, num));
                  };

                  if (validateData(data)) {
                    setOvrData({
                      ovr: normalizeValue(data.ovr),
                      matches_count: Math.max(0, Number(data.matches_count) || 0),
                      quarter_count: Math.max(0, Number(data.quarter_count) || 0),
                      message: data.message || "분석 후 지표 확인가능해요"
                    });

                    // userData의 ovr도 업데이트
                    setUserData(prev => ({
                      ...prev,
                      ovr: normalizeValue(data.ovr)
                    }));
                    
                    // 레이더 차트 데이터 설정
                    if (data.radar_data) {
                      console.log('🔍 원본 레이더 데이터:', data.radar_data);
                      const normalizedRadarData = {
                        point_total: normalizeValue(data.radar_data.point_total),
                        point_sprint: normalizeValue(data.radar_data.point_sprint),
                        point_acceleration: normalizeValue(data.radar_data.point_acceleration),
                        point_speed: normalizeValue(data.radar_data.point_speed),
                        point_positiveness: normalizeValue(data.radar_data.point_positiveness),
                        point_stamina: normalizeValue(data.radar_data.point_stamina)
                      };
                      console.log('🔍 정규화된 레이더 데이터:', normalizedRadarData);
                      setRadarData(normalizedRadarData);
                    }
                    
                    // 미니 차트 데이터 설정 (숫자 안전 변환)
                    if (data.mini_chart_data) {
                      const mc = data.mini_chart_data;
                      const toNumArr = (arr, toFloat = false) =>
                        Array.isArray(arr)
                          ? arr.map(v => {
                              const n = Number(v);
                              return Number.isFinite(n) 
                                ? (toFloat ? normalizeValue(n, 0, 50) : normalizeValue(n))
                                : 0;
                            })
                          : [0, 0, 0, 0, 0];
                      setMiniChartData({
                        point_total: toNumArr(mc.point_total, false),
                        distance: toNumArr(mc.distance, true),
                        max_speed: toNumArr(mc.max_speed, true),
                        sprint: toNumArr(mc.sprint, false),
                      });
                    }
                  } else {
                    console.warn('유효하지 않은 OVR 데이터:', data);
                    // 기본값 설정
                    setOvrData({
                      ovr: 0,
                      matches_count: 0,
                      quarter_count: 0,
                      message: "데이터를 불러올 수 없습니다"
                    });
                  }
                })
                .catch((ovrError) => {
                  console.error('OVR 데이터 로드 실패:', ovrError);
                  
                  // 에러 상세 정보 분석
                  let errorMessage = "알 수 없는 오류가 발생했습니다.";
                  let detailMessage = "";
                  
                  if (ovrError.response) {
                    // 서버에서 응답이 온 경우
                    const status = ovrError.response.status;
                    const data = ovrError.response.data;
                    
                    if (status === 500) {
                      errorMessage = "서버 내부 오류가 발생했습니다.";
                      if (data && data.error) {
                        detailMessage = `상세: ${data.error}`;
                      } else {
                        detailMessage = "데이터베이스 연결 또는 쿼리 오류일 가능성이 있습니다.";
                      }
                    } else if (status === 404) {
                      errorMessage = "해당 사용자의 경기 데이터를 찾을 수 없습니다.";
                      detailMessage = "참여한 경기가 없거나 데이터가 아직 처리되지 않았을 수 있습니다.";
                    } else if (status === 400) {
                      if (data && data.error && data.error.includes("시간 파싱 실패")) {
                        errorMessage = "경기 시간 데이터 파싱 실패";
                        detailMessage = data.error;
                      } else {
                        errorMessage = "잘못된 요청입니다.";
                        detailMessage = data && data.error ? data.error : "사용자 코드가 올바르지 않습니다.";
                      }
                    } else {
                      errorMessage = `서버 오류 (${status})`;
                      detailMessage = data && data.error ? data.error : "서버에서 예상치 못한 오류가 발생했습니다.";
                    }
                  } else if (ovrError.request) {
                    // 요청은 보냈지만 응답이 없는 경우
                    errorMessage = "서버 연결 실패";
                    detailMessage = "서버가 응답하지 않습니다. 네트워크 연결을 확인해주세요.";
                  } else {
                    // 요청 설정 중 오류
                    errorMessage = "요청 설정 오류";
                    detailMessage = ovrError.message || "요청을 보내는 중 오류가 발생했습니다.";
                  }
                  
                  // 사용자에게 알림 표시
                  alert(`❌ OVR 데이터 로드 실패\n\n${errorMessage}\n${detailMessage}\n\n개발자 도구의 콘솔을 확인하거나 관리자에게 문의해주세요.`);
                  
                  setOvrData({
                    ovr: 0,
                    matches_count: 0,
                    quarter_count: 0,
                    message: "데이터를 불러올 수 없습니다"
                  });
                });
        })
        .catch((error) => {
          console.error('사용자 정보 로드 실패:', error);
          
          // 사용자 정보 로드 실패 알림
          let errorMessage = "사용자 정보를 불러올 수 없습니다.";
          let detailMessage = "";
          
          if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            
            if (status === 404) {
              errorMessage = "사용자를 찾을 수 없습니다.";
              detailMessage = "등록되지 않은 사용자이거나 사용자 코드가 올바르지 않습니다.";
            } else if (status === 500) {
              errorMessage = "서버 오류가 발생했습니다.";
              detailMessage = data && data.error ? data.error : "데이터베이스 연결 오류일 가능성이 있습니다.";
            } else {
              errorMessage = `서버 오류 (${status})`;
              detailMessage = data && data.error ? data.error : "예상치 못한 오류가 발생했습니다.";
            }
          } else if (error.request) {
            errorMessage = "서버 연결 실패";
            detailMessage = "네트워크 연결을 확인해주세요.";
          } else {
            errorMessage = "요청 오류";
            detailMessage = error.message || "요청 처리 중 오류가 발생했습니다.";
          }
          
          alert(`⚠️ 사용자 정보 로드 실패\n\n${errorMessage}\n${detailMessage}\n\n다시 로그인하시거나 관리자에게 문의해주세요.`);
          
          // 에러 시 기본값 유지
          setUserData({
            name: "사용자",
            age: 0,
            position: "CB",
            ovr: 0,
            maxSpeed: 0,
            sprint: 0,
            attackIndex: 0,
            defenseIndex: 0
          });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userCode]);

  // 부드러운 곡선을 만들기 위한 Cubic Bezier 계산
  const createSmoothPath = (data, width, height) => {
    if (data.length < 2) return '';
    
    const max = Math.max(...data, 1); // 최소값 1로 설정하여 0으로만 이루어진 경우 처리
    const min = Math.min(...data);
    const range = max - min || 1;
    
    // 그래프가 가장자리에서 잘리지 않도록 내부 패딩 추가 (우측 여백 확대)
    const paddingLeft = 10;
    const paddingRight = 20; // 끝점 원이 확실히 보이도록 여유 공간 추가
    const paddingTop = 6;
    const paddingBottom = 6;
    const innerWidth = Math.max(1, width - paddingLeft - paddingRight);
    const innerHeight = Math.max(1, height - paddingTop - paddingBottom);

    // 좌표 계산
    const points = data.map((value, index) => ({
      x: paddingLeft + (index / (data.length - 1)) * innerWidth,
      y: paddingTop + innerHeight - ((value - min) / range) * innerHeight
    }));
    
    // 첫 번째 점으로 시작
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // 부드러운 곡선을 위한 cubic bezier curve 생성
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      if (i === 1) {
        // 첫 번째 곡선
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // 중간 점들은 smooth curve로 연결
        const prevPrev = points[i - 2];
        const cp1x = prev.x + (curr.x - prevPrev.x) * 0.15;
        const cp1y = prev.y + (curr.y - prevPrev.y) * 0.15;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` S ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return { path, points };
  };

  // 작은 차트 SVG 생성 함수 (부드러운 곡선)
  const createMiniChart = (data, color = '#22c55e', width = 160, height = 36) => {
    const { path, points } = createSmoothPath(data, width, height);
    const lastPoint = points[points.length - 1];
    const currentValue = data[data.length - 1];
    const firstPoint = points[0];
    const firstValue = data[0];

    return (
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="mini-chart"
      >
        {/* 부드러운 곡선 */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* 시작/마지막 점 원 표시 (시작: 속 빈 원, 끝: 채운 원) */}
        <circle
          cx={firstPoint.x}
          cy={firstPoint.y}
          r="2.5"
          fill="#ffffff"
          stroke={color}
          strokeWidth="1.5"
        />
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="2.5"
          fill={color}
        />
      </svg>
    );
  };

  // 레이더 차트용 데이터 구성
  // 6가지 지표: 평점, 스프린트, 가속도, 스피드, 적극성, 체력
  // 적극성(point_positiveness)과 체력(point_stamina) 순서가 잘못 매핑되어 있어 수정합니다.
  const radarChartData = [
    { label: '평점', value: radarData.point_total || 0 },
    { label: '스프린트', value: radarData.point_sprint || 0 },
    { label: '가속도', value: radarData.point_acceleration || 0 },
    { label: '스피드', value: radarData.point_speed || 0 },
    { label: '적극성', value: radarData.point_positiveness || 0 },
    { label: '체력', value: radarData.point_stamina || 0 }
  ];

  // 디버깅: 레이더 차트 데이터 로깅
  console.log('🔍 레이더 차트 렌더링 데이터:', radarChartData);
  console.log('🔍 현재 radarData 상태:', radarData);

  // 6가지 지표의 평균 계산
  const calculateAverageOVR = () => {
    const values = radarChartData.map(item => item.value);
    const validValues = values.filter(value => value > 0); // 0보다 큰 값들만 계산
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, value) => acc + value, 0);
    return Math.round(sum / validValues.length);
  };

  // 육각형 좌표 계산 함수 (범위: -25 ~ 100)
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
  const getLabelPositions = (centerX, centerY, radius) => {
    return radarChartData.map((item, i) => {
      const angle = (Math.PI / 180) * (i * 60 - 90);
      const labelRadius = radius + 25;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      return { x, y, label: item.label };
    });
  };

  // 포지션별 이미지 반환 함수
  const getPositionImage = (position) => {
    const pos = position || 'CB';
    
    // 공격수 (빨간색/주황색)
    if (['LWF', 'ST', 'RWF', 'CF'].includes(pos)) {
      return positionOrange;
    }
    // 미드필더 (녹색)
    else if (['LWM', 'CAM', 'RWM', 'LM', 'CM', 'RM', 'CDM', 'AMF', 'CMF', 'DMF'].includes(pos)) {
      return positionGreen;
    }
    // 수비수 (파란색)
    else if (['LWB', 'RWB', 'LB', 'CB', 'RB', 'SW'].includes(pos)) {
      return positionBlue;
    }
    // 골키퍼 (노란색)
    else if (['GK'].includes(pos)) {
      return positionYellow;
    }
    // 기본값
    else {
      return positionBlue;
    }
  };

  if (loading) {
    return (
      <div className='main'>
        <LogoBellNav logo={true}/>
        <div style={{ padding: '50px 20px', textAlign: 'center' }}>
          <p>사용자 정보를 불러오는 중...</p>
        </div>
        
      </div>
    );
  }

  return (
    <div className='main'>
      <LogoBellNav logo={true}/>
      
      {/* 사용자 정보 섹션 - 디자인 시스템 적용 */}
      <div className="user-info-section">
        <div className="user-details" onClick={handleCardNavigation}>
          <span className="user-age">만 {userData.age}세</span>
          <h1 className="user-name text-display">{userData.name}</h1>
        </div>
        <div 
          className="position-badge" 
          style={{ 
            backgroundImage: `url(${getPositionImage(userData.position)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={handleCardNavigation}
          title={`포지션: ${userData.position}`}
        >
          {userData.position}
        </div>
      </div>

      {/* 메인 카드 2개 - 디자인 시스템 적용 */}
      <div className="main-cards">
        <div className="team-card">
          <div className="card-header">
            <h3 className="text-h4">나의 팀</h3>
            <span className="arrow" aria-hidden="true">→</span>
          </div>
          <p className="team-description text-body-sm">함께할 팀을 찾고 합류해보세요</p>
          <button 
            className="find-team-btn btn-primary" 
            onClick={handleFindTeamNavigation}
            aria-label="팀 찾기 페이지로 이동"
          >
            팀 찾기
          </button>
        </div>

        <div className="analysis-card" onClick={handleAnalysisNavigation} role="button" tabIndex={0}>
          <div className="card-header">
            <h3 className="text-h4">개인분석</h3>
            <span className="arrow" aria-hidden="true">→</span>
          </div>
          <div className="radar-chart">
            <img 
              src={ovrSmallImage} 
              alt="개인분석 차트" 
              className="analysis-chart-image"
            />
          </div>
        </div>
      </div>

      {/* 나의 OVR 섹션 - 디자인 시스템 적용 */}
      <div className="ovr-title">
        <h3 className="text-h2">나의 OVR</h3>
        <span className="ovr-subtitle text-caption">
          {ovrData.matches_count > 0 ? 
            `최근 ${ovrData.matches_count}경기 평균 점수` : 
            "분석 후 지표 확인가능해요"
          }
        </span>
      </div>
      
      <div className="ovr-section">
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
              {getLabelPositions(200, 200, 140).map((pos, index) => (
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
                    {radarChartData[index].value || 0}
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
{calculateAverageOVR()}
              </text>
            </svg>
          </div>
        </div>
        


      {/* 최근 추세 섹션 */}
      <div className="trend-section">
        <h3 className="trend-title text-h3">지표 추이 <span className="text-caption"> 최근 {miniChartData.point_total.filter(val => val > 0).length}경기 수치 그래프</span></h3>
      </div>

      {/* 하단 4개 카드 - 디자인 시스템 적용 */}
      <div className="stats-cards">
        <div className="stat-card">
          <h4 className="text-body">평점</h4>
          <div className="stat-content">
            <div className="stat-chart">
              {createMiniChart(miniChartData.point_total, 'var(--success)')}
            </div>
            <div className="stat-number">
              {Math.round(miniChartData.point_total[4]) || 0}<span className="unit text-body-sm">점</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <h4 className="text-body">이동거리</h4>
          <div className="stat-content">
            <div className="stat-chart">
              {createMiniChart(miniChartData.distance, 'var(--error)')}
            </div>
            <div className="stat-number">
              {(miniChartData.distance[4] || 0).toFixed(2)}<span className="unit text-body-sm">km</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <h4 className="text-body">최고속력</h4>
          <div className="stat-content">
            <div className="stat-chart">
              {createMiniChart(miniChartData.max_speed, 'var(--chart-blue)')}
            </div>
            <div className="stat-number">
              {Math.round(miniChartData.max_speed[4]) || 0}<span className="unit unit-speed text-caption">km/h</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <h4 className="text-body">스프린트</h4>
          <div className="stat-content">
            <div className="stat-chart">
              {createMiniChart(miniChartData.sprint, 'var(--chart-purple)')}
            </div>
            <div className="stat-number">
              {Math.round(miniChartData.sprint[4]) || 0}<span className="unit text-body-sm">번</span>
            </div>
          </div>
        </div>
      </div>


      
    </div>
  );
};

export default Main;