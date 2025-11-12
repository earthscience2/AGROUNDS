import React, { useState, useEffect, useRef } from 'react';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/Main.scss';
import { useNavigate } from 'react-router-dom';
import ovrBgImage from '../../../assets/ovr/ovr_bgr.png';
import ovrNoneImage from '../../../assets/ovr/ovr_none.png';
import radarChartIcon from '../../../assets/big_icons/rader.png';
import positionBlue from '../../../assets/position/blue.png';
import positionGreen from '../../../assets/position/green.png';
import positionOrange from '../../../assets/position/orange.png';
import positionYellow from '../../../assets/position/yellow.png';

import { AnalPositionColor } from '../../../function/PositionColor';
import { GetUserOvrLast5MatchesApi, GetUserPointLast5MatchesApi } from '../../../function/api/anal/analApi';
import { GetUserInfoApi, GetMyTeamInfoApi, GetTeamLogoApi } from '../../../function/api/user/userApi';
import defaultTeamLogo from '../../../assets/main_icons/team_gray.png';
import teamBlackIcon from '../../../assets/main_icons/team_black.png';
import arrowIcon from '../../../assets/main_icons/front_gray.png';

const Main = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // 레벨 한글 변환 함수
  const getLevelText = (level) => {
    const levelMap = {
      'youth': '유소년',
      'adult': '아마추어',
      'pro': '프로'
    };
    return levelMap[level] || '아마추어';
  };

  // 이름 길이에 따른 폰트 크기 클래스 반환
  const getNameSizeClass = (name) => {
    if (!name) return '';
    const length = name.length;
    
    if (length <= 6) return 'name-size-xl';      // 48px
    if (length <= 10) return 'name-size-lg';     // 42px
    if (length <= 15) return 'name-size-md';     // 36px
    return 'name-size-sm';                       // 30px (16-20글자)
  };

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

  // 팀 정보 페이지로 이동하는 함수
  const handleTeamNavigation = () => {
    if (myTeamInfo.hasTeam && myTeamInfo.teamData) {
      // 팀 상세 페이지로 이동 (팀 코드는 URL에 노출하지 않음)
      navigate('/app/team/info');
    }
  };

  // 팀 로고 이미지 가져오기 함수
  const getTeamLogoUrl = async (teamCode) => {
    if (!teamCode) return defaultTeamLogo;
    
    try {
      const response = await GetTeamLogoApi(teamCode);
      
      if (response.data.exists && response.data.image_url) {
        return response.data.image_url;
      } else {
        return defaultTeamLogo;
      }
    } catch (error) {
      return defaultTeamLogo;
    }
  };

  // 내 팀 정보 가져오기 함수
  const fetchMyTeamInfo = async () => {
    if (!userCode) return;

    try {
      setMyTeamInfo(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await GetMyTeamInfoApi(userCode);
      
      if (response.data && response.data.has_team && response.data.team_info) {
        const teamData = response.data.team_info;
        
        // 팀 로고 URL을 API로 가져오기
        const logoUrl = await getTeamLogoUrl(teamData.team_code);
        
        setMyTeamInfo({
          hasTeam: true,
          teamData: {
            ...teamData,
            logo_url: logoUrl // API에서 가져온 로고 URL로 교체
          },
          loading: false,
          error: null
        });
      } else {
        setMyTeamInfo({
          hasTeam: false,
          teamData: null,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      setMyTeamInfo(prev => ({
        ...prev,
        loading: false,
        error: '팀 정보를 불러오는데 실패했습니다.'
      }));
    }
  };
  const [userType, setUserType] = useState(sessionStorage.getItem('userType'));
  const [userCode, setUserCode] = useState(sessionStorage.getItem('userCode'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastLoginTimestamp, setLastLoginTimestamp] = useState(sessionStorage.getItem('loginTimestamp'));
  
  // 사용자 데이터 상태
  const [userData, setUserData] = useState({
    name: "",
    age: 0,
    level: "",
    position: "",
    ovr: 0,
    maxSpeed: 0,
    sprint: 0,
    attackIndex: 0,
    defenseIndex: 0
  });
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [ovrData, setOvrData] = useState({
    ovr: 0,
    matches_count: 0,
    quarter_count: 0,
    message: ""
  });

  // 모든 데이터 로딩이 완료되면 페이지 표시
  useEffect(() => {
    if (dataReady) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [dataReady]);

  const [radarData, setRadarData] = useState({
    point_total: 0,
    point_attack: 0,
    point_defense: 0,
    point_stamina: 0,
    point_positiveness: 0,
    point_speed: 0,
    point_acceleration: 0,
    point_sprint: 0
  });

  const [miniChartData, setMiniChartData] = useState({
    point_total: [0, 0, 0, 0, 0],
    point_attack: [0, 0, 0, 0, 0],
    point_defense: [0, 0, 0, 0, 0],
    distance: [0, 0, 0, 0, 0],
    max_speed: [0, 0, 0, 0, 0],
    sprint: [0, 0, 0, 0, 0]
  });

  // 팀 정보 상태
  const [myTeamInfo, setMyTeamInfo] = useState({
    hasTeam: false,
    teamData: null,
    loading: false,
    error: null
  });

  // 로그인 상태 감지 및 상태 초기화
  useEffect(() => {
    const currentUserCode = sessionStorage.getItem('userCode');
    const currentToken = sessionStorage.getItem('token');
    const currentLoginTimestamp = sessionStorage.getItem('loginTimestamp');
    const loginCompleted = sessionStorage.getItem('loginCompleted');
    
    // URL 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const forceRefresh = urlParams.get('refresh');
    
    // 강제 초기화 조건들
    const shouldForceReset = 
      forceRefresh === 'true' ||
      loginCompleted === 'true' ||
      (currentUserCode && currentUserCode !== userCode) ||
      (currentLoginTimestamp && currentLoginTimestamp !== lastLoginTimestamp);
    
    if (shouldForceReset) {
      // URL 정리
      if (forceRefresh === 'true') {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
      
      // 로그인 완료 플래그 제거
      if (loginCompleted === 'true') {
        sessionStorage.removeItem('loginCompleted');
      }
      
      // 모든 상태 강제 초기화
      setUserData({
        name: "",
        age: 0,
        position: "",
        ovr: 0,
        maxSpeed: 0,
        sprint: 0,
        attackIndex: 0,
        defenseIndex: 0
      });
      
      setOvrData({
        ovr: 0,
        matches_count: 0,
        quarter_count: 0,
        message: "데이터를 불러오는 중..."
      });
      
      setRadarData({
        point_total: 0,
        point_sprint: 0,
        point_acceleration: 0,
        point_speed: 0,
        point_positiveness: 0,
        point_stamina: 0
      });
      
      setMiniChartData({
        point_total: [0, 0, 0, 0, 0],
        point_attack: [0, 0, 0, 0, 0],
        point_defense: [0, 0, 0, 0, 0],
        distance: [0, 0, 0, 0, 0],
        max_speed: [0, 0, 0, 0, 0],
        sprint: [0, 0, 0, 0, 0]
      });
      
      // 상태 업데이트
      setUserCode(currentUserCode);
      setUserType(sessionStorage.getItem('userType'));
      setLastLoginTimestamp(currentLoginTimestamp);
      setIsLoggedIn(true);
      setLoading(true);
      
      return;
    }
    
    // 일반적인 로그인 상태 확인
    const isTestMode = sessionStorage.getItem('testMode') === 'true';
    
    if (currentUserCode && (currentToken || isTestMode)) {
      if (!isLoggedIn) {
        setUserCode(currentUserCode);
        setUserType(sessionStorage.getItem('userType'));
        setLastLoginTimestamp(currentLoginTimestamp);
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // API에서 사용자 데이터 가져오기
  useEffect(() => {
    if (userCode && isLoggedIn) {
      const loginType = sessionStorage.getItem('loginType');
      const isTestMode = sessionStorage.getItem('testMode') === 'true';
      
      if (loginType === 'test') {
        const testUserInfo = JSON.parse(sessionStorage.getItem('testUserInfo') || '{}');
        
        if (testUserInfo.name) {
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
          
          const userDataToSet = {
            name: testUserInfo.name,
            age: calculateAge(testUserInfo.birth),
            level: testUserInfo.level || "adult",
            position: testUserInfo.preferred_position || "FW",
            ovr: 75, // 테스트용 OVR 값
            maxSpeed: 85,
            sprint: 80,
            attackIndex: 70,
            defenseIndex: 75
          };
          
          setUserData(userDataToSet);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
      
      // 실제 API 사용하여 최신 사용자 정보 조회
      GetUserInfoApi(userCode)
        .then((response) => {
          const data = response.data;
          
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
            level: data.level || "adult",
            position: data.preferred_position || "CB",
            ovr: 0,
            maxSpeed: 0,
            sprint: 0,
            attackIndex: 0,
            defenseIndex: 0
          });
          setLoading(false);
          
          fetchMyTeamInfo();
          
          const loadOvrData = async () => {
            try {
              const response = await GetUserOvrLast5MatchesApi(userCode);
              const data = response.data;
              
              return {
                ovr: data.ovr || 0,
                matches_count: data.matches_count || 0,
                quarter_count: data.quarter_count || 0,
                message: data.message || "분석 후 지표 확인가능해요",
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
                  point_attack: data.point_attack || 0,
                  point_defense: data.point_defense || 0,
                  point_sprint: 0,
                  point_acceleration: 0,
                  point_speed: 0,
                  point_positiveness: 0,
                  point_stamina: 0
                },
                mini_chart_data: data.mini_chart_data || {
                  point_total: [0, 0, 0, 0, 0],
                  distance: [0, 0, 0, 0, 0],
                  max_speed: [0, 0, 0, 0, 0],
                  sprint: [0, 0, 0, 0, 0]
                }
              };
            } catch (ovrError) {
              const fallbackEndpoints = [
                { name: 'OVR 데이터', api: () => GetUserOvrLast5MatchesApi(userCode) },
                { name: '포인트 데이터', api: () => GetUserPointLast5MatchesApi(userCode) }
              ];

              for (const endpoint of fallbackEndpoints) {
                try {
                  const response = await endpoint.api();
                  const data = response.data;
                  
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
                      point_attack: data.attack || 25,
                      point_defense: data.defense || 25,
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
                  continue;
                }
              }
              
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
                  point_attack: 0,
                  point_defense: 0,
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
                  
                  const validateData = (data) => {
                    if (!data) return false;
                    const requiredFields = ['ovr', 'matches_count', 'quarter_count'];
                    return requiredFields.every(field => typeof data[field] !== 'undefined');
                  };

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
                      const normalizedRadarData = {
                        point_total: normalizeValue(data.radar_data.point_total),
                        point_attack: normalizeValue(data.radar_data.point_attack),
                        point_defense: normalizeValue(data.radar_data.point_defense),
                        point_sprint: normalizeValue(data.radar_data.point_sprint),
                        point_acceleration: normalizeValue(data.radar_data.point_acceleration),
                        point_speed: normalizeValue(data.radar_data.point_speed),
                        point_positiveness: normalizeValue(data.radar_data.point_positiveness),
                        point_stamina: normalizeValue(data.radar_data.point_stamina)
                      };
                      setRadarData(normalizedRadarData);
                    }
                    
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
                        point_attack: toNumArr(mc.point_attack, false),
                        point_defense: toNumArr(mc.point_defense, false),
                        distance: toNumArr(mc.distance, true),
                        max_speed: toNumArr(mc.max_speed, true),
                        sprint: toNumArr(mc.sprint, false),
                      });
                    }
                  } else {
                    setOvrData({
                      ovr: 0,
                      matches_count: 0,
                      quarter_count: 0,
                      message: "데이터를 불러올 수 없습니다"
                    });
                  }
                  
                  setDataReady(true);
                })
                .catch((ovrError) => {
                  setOvrData({
                    ovr: 0,
                    matches_count: 0,
                    quarter_count: 0,
                    message: "데이터를 불러올 수 없습니다"
                  });
                  
                  setDataReady(true);
                });
        })
        .catch((error) => {
          const fallbackData = {
            name: sessionStorage.getItem('userName') || '사용자',
            birth: sessionStorage.getItem('userBirth') || '1999-01-01',
            preferred_position: sessionStorage.getItem('userPosition') || 'CB'
          };
          
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
            name: fallbackData.name,
            age: calculateAge(fallbackData.birth),
            level: "adult",
            position: fallbackData.preferred_position,
            ovr: 0,
            maxSpeed: 0,
            sprint: 0,
            attackIndex: 0,
            defenseIndex: 0
          });
          
          setUserData({
            name: "사용자",
            age: 0,
            level: "adult",
            position: "CB",
            ovr: 0,
            maxSpeed: 0,
            sprint: 0,
            attackIndex: 0,
            defenseIndex: 0
          });
          setLoading(false);
          setDataReady(true);
        });
    } else {
      setLoading(false);
      setDataReady(true);
    }
  }, [userCode, isLoggedIn]);

  // 페이지 포커스 시 로그인 상태 재확인
  useEffect(() => {
    const handleFocus = () => {
      const currentUserCode = sessionStorage.getItem('userCode');
      const currentLoginTimestamp = sessionStorage.getItem('loginTimestamp');
      const loginCompleted = sessionStorage.getItem('loginCompleted');
      
      if (
        loginCompleted === 'true' ||
        (currentUserCode && currentUserCode !== userCode) ||
        (currentLoginTimestamp && currentLoginTimestamp !== lastLoginTimestamp)
      ) {
        window.location.reload();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [userCode, lastLoginTimestamp]);

  const createSmoothPath = (data, width, height) => {
    if (data.length < 2) return '';
    
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const paddingLeft = 10;
    const paddingRight = 20;
    const paddingTop = 6;
    const paddingBottom = 6;
    const innerWidth = Math.max(1, width - paddingLeft - paddingRight);
    const innerHeight = Math.max(1, height - paddingTop - paddingBottom);

    const points = data.map((value, index) => ({
      x: paddingLeft + (index / (data.length - 1)) * innerWidth,
      y: paddingTop + innerHeight - ((value - min) / range) * innerHeight
    }));
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      if (i === 1) {
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
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
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
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

  const calculateParticipation = () => {
    const attack = radarData.point_attack || 0;
    const defense = radarData.point_defense || 0;
    return Math.round((attack + defense) / 2);
  };

  const radarChartData = [
    { label: '참여도', value: calculateParticipation() },
    { label: '속력', value: radarData.point_speed || 0 },
    { label: '가속도', value: radarData.point_acceleration || 0 },
    { label: '스프린트', value: radarData.point_sprint || 0 },
    { label: '적극성', value: radarData.point_positiveness || 0 },
    { label: '체력', value: radarData.point_stamina || 0 }
  ];

  const calculateTotalOVR = () => {
    const pointTotalArray = miniChartData.point_total || [0, 0, 0, 0, 0];
    const validValues = pointTotalArray.filter(value => value > 0);
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, value) => acc + value, 0);
    const average = sum / validValues.length;
    return Math.round(average);
  };

  const calculateAttackDefenseAvg = () => {
    const attackArray = miniChartData.point_attack || [0, 0, 0, 0, 0];
    const defenseArray = miniChartData.point_defense || [0, 0, 0, 0, 0];
    
    const attackValidValues = attackArray.filter(value => value > 0);
    const defenseValidValues = defenseArray.filter(value => value > 0);
    
    const attackAvg = attackValidValues.length > 0 
      ? Math.round(attackValidValues.reduce((acc, value) => acc + value, 0) / attackValidValues.length)
      : 0;
      
    const defenseAvg = defenseValidValues.length > 0
      ? Math.round(defenseValidValues.reduce((acc, value) => acc + value, 0) / defenseValidValues.length)
      : 0;
    
    return { attack: attackAvg, defense: defenseAvg };
  };

  const calculateHexagonPoints = (centerX, centerY, radius, values, minValue = -25, maxValue = 100) => {
    const points = [];
    const angleStep = 360 / values.length;
    for (let i = 0; i < values.length; i++) {
      const angle = (Math.PI / 180) * (i * angleStep - 90);
      const value = values[i] || 0;
      const normalizedValue = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
      const scaledRadius = normalizedValue * radius;
      const x = centerX + scaledRadius * Math.cos(angle);
      const y = centerY + scaledRadius * Math.sin(angle);
      points.push({ x, y, value });
    }
    return points;
  };

  const getGridHexagonPoints = (centerX, centerY, radius) => {
    const points = [];
    const angleStep = 360 / radarChartData.length;
    for (let i = 0; i < radarChartData.length; i++) {
      const angle = (Math.PI / 180) * (i * angleStep - 90);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y });
    }
    return points;
  };

  const getLabelPositions = (centerX, centerY, radius) => {
    return radarChartData.map((item, i) => {
      const angleStep = 360 / radarChartData.length;
      const angle = (Math.PI / 180) * (i * angleStep - 90);
      const labelRadius = radius + 25;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      return { x, y, label: item.label };
    });
  };

  const getPositionImage = (position) => {
    const pos = position || 'CB';
    
    if (['LWF', 'ST', 'RWF', 'CF'].includes(pos)) {
      return positionOrange;
    }
    else if (['LWM', 'CAM', 'RWM', 'LM', 'CM', 'RM', 'CDM', 'AMF', 'CMF', 'DMF'].includes(pos)) {
      return positionGreen;
    }
    else if (['LWB', 'RWB', 'LB', 'CB', 'RB', 'SW'].includes(pos)) {
      return positionBlue;
    }
    else if (['GK'].includes(pos)) {
      return positionYellow;
    }
    else {
      return positionBlue;
    }
  };

  if (loading) {
    return (
      <div className='main visible'>
        <LogoBellNav logo={true}/>
        <div style={{ padding: '50px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-text)' }}>사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }


  return (
    <div className={`main ${isVisible ? 'visible' : ''}`}>
      <LogoBellNav logo={true}/>
      
      <div className="user-info-section">
        <div className="user-details" onClick={handleCardNavigation}>
          <div className="user-info-row">
            <span className="user-level">{getLevelText(userData.level)}</span>
            <span className="user-age">만 {userData.age}세</span>
          </div>
          <h1 className={`user-name text-display ${getNameSizeClass(userData.name)}`}>{userData.name}</h1>
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

      <div className="main-cards">
        <div className="team-card" onClick={myTeamInfo.hasTeam ? handleTeamNavigation : handleFindTeamNavigation} role="button" tabIndex={0}>
          <div className="card-header">
            <h3 className="text-h4">나의 팀</h3>
            <img src={arrowIcon} alt="" className="arrow-icon" aria-hidden="true" />
          </div>
          
          {myTeamInfo.loading ? (
            <div className="team-loading">
              <p className="text-body-sm">팀 정보를 불러오는 중...</p>
            </div>
          ) : myTeamInfo.hasTeam && myTeamInfo.teamData ? (
            <div className="team-info">
              <div className="team-logo-section">
                <img 
                  src={myTeamInfo.teamData.logo_url || defaultTeamLogo} 
                  alt={`${myTeamInfo.teamData.name} 로고`}
                  className="team-logo"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = defaultTeamLogo;
                  }}
                />
              </div>
              <div className="team-details">
                <h4 className="team-name text-h4">{myTeamInfo.teamData.name}</h4>
              </div>
            </div>
          ) : (
            <div className="no-team">
              <div className="no-team-content">
                <img 
                  src={teamBlackIcon} 
                  alt="팀 아이콘" 
                  className="no-team-icon"
                />
                <p className="no-team-message">아직 소속된 팀이 없어요</p>
              </div>
              <button 
                className="find-team-btn btn-primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFindTeamNavigation();
                }}
                aria-label="팀 찾기 페이지로 이동"
              >
                팀 찾기
              </button>
            </div>
          )}
          
          {myTeamInfo.error && (
            <p className="error-message text-body-sm">{myTeamInfo.error}</p>
          )}
        </div>

        <div className="analysis-card" onClick={handleAnalysisNavigation} role="button" tabIndex={0}>
          <div className="card-header">
            <h3 className="text-h4">경기 분석</h3>
            <img src={arrowIcon} alt="" className="arrow-icon" aria-hidden="true" />
          </div>
          <div className="radar-chart">
            <img 
              src={radarChartIcon} 
              alt="경기 분석 차트" 
              className="analysis-chart-image"
            />
          </div>
        </div>
      </div>

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
              <defs>
                <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(34, 197, 94, 0.6)" />
                  <stop offset="70%" stopColor="rgba(34, 197, 94, 0.3)" />
                  <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
                </radialGradient>
              </defs>
              
              {[0, 25, 50, 75, 100].map((value, index) => {
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
              
              {getLabelPositions(200, 200, 140).map((pos, index) => {
                return (
                  <g key={`label-group-${index}`}>
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
                );
              })}
              
              <text
                x="200"
                y="200"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="48"
                fontWeight="800"
                fill="#000000"
              >
{calculateTotalOVR()}
              </text>
            </svg>
          </div>
        </div>

      <div className="trend-section">
        <h3 className="trend-title text-h3">지표 추이 <span className="text-caption"> 최근 {miniChartData.point_total.filter(val => val > 0).length}경기 수치 그래프</span></h3>
      </div>

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
              {(miniChartData.max_speed[4] || 0).toFixed(1)}<span className="unit unit-speed text-caption">km/h</span>
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
              {Math.round(miniChartData.sprint[4]) || 0}<span className="unit text-body-sm">회</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;