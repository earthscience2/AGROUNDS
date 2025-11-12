import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import MatchActionDSModal from '../../../components/Modal/variants/MatchActionDSModal';
import DSModal from '../../../components/Modal/DSModal';
import '../css/Team_Anal.scss';

// API - 팀 분석용 API
import { GetTeamAiSummaryApi, GetTeamAnalysisDataApi, GetTeamPlayerAnalysisDataApi } from '../../../function/api/anal/analApi';
import { GetMatchDetailApi, UpdateMatchNameApi, DeleteMatchApi, UpdateQuarterNameApi, DeleteQuarterApi } from '../../../function/api/match/matchApi';
import { GetTeamLogoApi, GetMyTeamInfoApi, GetProfileImageApi } from '../../../function/api/user/userApi';

// 아이콘 import (디자인 시스템 승인 아이콘)
import folderIcon from '../../../assets/main_icons/folder_black.png';
import rightIcon from '../../../assets/common/right.png';
import chartIcon from '../../../assets/main_icons/graph_black.png';
import speedIcon from '../../../assets/identify_icon/star.png';
import distanceIcon from '../../../assets/main_icons/line_black.png';
import timeIcon from '../../../assets/main_icons/clock_black.png';
import starIcon from '../../../assets/identify_icon/star.png';
import dot3Icon from '../../../assets/main_icons/option_black.png';
import arrowDownIcon from '../../../assets/main_icons/down_gray.png';
import arrowUpIcon from '../../../assets/main_icons/up_gray.png';
import backIcon from '../../../assets/main_icons/back_black.png';
// 팀 로고 더미 이미지 (존재하는 파일로 변경)
import defaultTeamLogo from '../../../assets/common/default-team-logo.png';
import defaultProfile from '../../../assets/common/default_profile.png';
// 미니 카드 배경 이미지
import redMiniCard from '../../../assets/card_icons/red_mini_card.png';
import greenMiniCard from '../../../assets/card_icons/green_mini_card.png';
import blueMiniCard from '../../../assets/card_icons/blue_mini_card.png';
import yellowMiniCard from '../../../assets/card_icons/yellow_mini_card.png';

const Team_Anal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [matchData, setMatchData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [ovrData, setOvrData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeQuarter, setActiveQuarter] = useState(1);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedKeyPoint, setExpandedKeyPoint] = useState(null);
  const [teamLogo, setTeamLogo] = useState(defaultTeamLogo);
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [selectedRankData, setSelectedRankData] = useState(null);
  const [selectedPerformerTab, setSelectedPerformerTab] = useState('overall'); // 'overall' or quarterCode
  
  // 선수 분석 관련 state
  const [playerSearchTerm, setPlayerSearchTerm] = useState(''); // 선수 검색어
  const [currentPlayerPage, setCurrentPlayerPage] = useState(0); // 현재 페이지 (0부터 시작)
  
  // state에서 matchData와 matchId 가져오기
  const { passedMatchData, matchId, teamCode, userRole } = location.state || {};
  
  // 사용자 역할 state (기본값: member)
  const [currentUserRole, setCurrentUserRole] = useState(userRole || 'member');
  
  // Team_Info.js에서 전달하는 경우와 Team_Video.js에서 전달하는 경우 모두 처리
  const actualMatchId = matchId || passedMatchData?.match_code;

  // 이름 길이에 따른 폰트 크기 클래스 반환 함수 (더 엄격하게)
  const getNameSizeClass = (name) => {
    if (!name) return '';
    
    const nameLength = name.length;
    
    // 한글 20글자 기준으로 더 엄격한 클래스 적용
    if (nameLength >= 18) {
      return 'name-extremely-long'; // 18글자 이상시 극도로 작은 폰트 (9px)
    } else if (nameLength >= 16) {
      return 'name-very-long'; // 16글자 이상시 매우 작은 폰트 (10px)
    } else if (nameLength >= 12) {
      return 'name-long'; // 12글자 이상시 작은 폰트 (12px)
    } else if (nameLength >= 8) {
      return 'name-medium'; // 8글자 이상시 중간 폰트 (14px)
    }
    
    return ''; // 7글자 이하는 기본 폰트 (16px)
  };

  // 전체 경기 최고 성과자 계산 함수
  const calculateOverallTopPerformers = (playersData) => {
    if (!playersData || playersData.length === 0) {
      return null;
    }
    
    const overallPerformers = {
      maxSpeed: { value: 0, player: null },
      maxAcceleration: { value: 0, player: null },
      sprintCount: { value: 0, player: null },
      points: { value: 0, player: null }
    };
    
    playersData.forEach(player => {
      if (!player.quarters || player.quarters.length === 0) {
        return;
      }
      
      player.quarters.forEach(quarter => {
        if (quarter.max_speed > overallPerformers.maxSpeed.value) {
          overallPerformers.maxSpeed = {
            value: quarter.max_speed,
            player: {
              user_code: player.user_code,
              name: player.user_name || player.user_code,
              value: `${quarter.max_speed.toFixed(1)}km/h`,
              position: player.position || 'MF',
              profile_image: player.profile_image || defaultProfile
            }
          };
        }
        
        if (quarter.max_acceleration && quarter.max_acceleration > overallPerformers.maxAcceleration.value) {
          overallPerformers.maxAcceleration = {
            value: quarter.max_acceleration,
            player: {
              user_code: player.user_code,
              name: player.user_name || player.user_code,
              value: `${quarter.max_acceleration.toFixed(2)}m/s²`,
              position: player.position || 'MF',
              profile_image: player.profile_image || defaultProfile
            }
          };
        }
        
        if (quarter.sprint_count > overallPerformers.sprintCount.value) {
          overallPerformers.sprintCount = {
            value: quarter.sprint_count,
            player: {
              user_code: player.user_code,
              name: player.user_name || player.user_code,
              value: `${quarter.sprint_count}회`,
              position: player.position || 'MF',
              profile_image: player.profile_image || defaultProfile
            }
          };
        }
        
        if (quarter.points > overallPerformers.points.value) {
          overallPerformers.points = {
            value: quarter.points,
            player: {
              user_code: player.user_code,
              name: player.user_name || player.user_code,
              value: `${quarter.points}점`,
              position: player.position || 'MF',
              profile_image: player.profile_image || defaultProfile
            }
          };
        }
      });
    });
    
    return overallPerformers;
  };

  // 쿼터별 최고 성과자 계산 함수
  const calculateQuarterTopPerformers = (playersData) => {
    if (!playersData || playersData.length === 0) return {};
    
    const quarterPerformers = {};
    
    // 모든 선수의 모든 쿼터 데이터를 수집
    playersData.forEach(player => {
      player.quarters.forEach(quarter => {
        const quarterKey = quarter.team_quarter_code || quarter.quarter_code;
        
        if (!quarterPerformers[quarterKey]) {
          quarterPerformers[quarterKey] = {
            distance: { value: 0, player: null },
            maxSpeed: { value: 0, player: null },
            sprintCount: { value: 0, player: null },
            points: { value: 0, player: null } // 활동량으로 포인트 사용
          };
        }
        
        // 이동거리 비교
        if (quarter.distance > quarterPerformers[quarterKey].distance.value) {
          quarterPerformers[quarterKey].distance = {
            value: quarter.distance,
            player: {
              user_code: player.user_code,
              name: player.user_name || player.user_code,
              value: `${quarter.distance.toFixed(2)}km`,
              position: player.position || 'MF',
              profile_image: player.profile_image || defaultProfile
            }
          };
        }
        
        // 최고속력 비교
        if (quarter.max_speed > quarterPerformers[quarterKey].maxSpeed.value) {
          quarterPerformers[quarterKey].maxSpeed = {
            value: quarter.max_speed,
            player: {
              user_code: player.user_code,
              name: player.user_name || player.user_code,
              value: `${quarter.max_speed.toFixed(1)}km/h`,
              position: player.position || 'MF',
              profile_image: player.profile_image || defaultProfile
            }
          };
        }
        
        // 스프린트 횟수 비교
        if (quarter.sprint_count > quarterPerformers[quarterKey].sprintCount.value) {
          quarterPerformers[quarterKey].sprintCount = {
            value: quarter.sprint_count,
            player: {
              user_code: player.user_code,
              name: player.user_name || player.user_code,
              value: `${quarter.sprint_count}회`,
              position: player.position || 'MF',
              profile_image: player.profile_image || defaultProfile
            }
          };
        }
        
        // 활동량(포인트) 비교
        if (quarter.points > quarterPerformers[quarterKey].points.value) {
          quarterPerformers[quarterKey].points = {
            value: quarter.points,
            player: {
              user_code: player.user_code,
              name: player.user_name || player.user_code,
              value: `${quarter.points}%`,
              position: player.position || 'MF',
              profile_image: player.profile_image || defaultProfile
            }
          };
        }
      });
    });
    
    return quarterPerformers;
  };

  // 쿼터별 순위 계산 함수
  const calculateQuarterRankings = (playersData, quarterCode) => {
    if (!playersData || playersData.length === 0) return null;

    const rankings = {
      distance: [],
      maxSpeed: [],
      sprintCount: [],
      points: []
    };

    // 해당 쿼터의 모든 선수 데이터 수집
    playersData.forEach(player => {
      player.quarters.forEach(quarter => {
        // quarterTopPerformers와 동일한 방식으로 quarterKey 생성
        const quarterKey = quarter.team_quarter_code || quarter.quarter_code;
        
        // 매칭되는 쿼터만 처리
        if (quarterKey === quarterCode) {
          const playerInfo = {
            user_code: player.user_code,
            name: player.user_name || player.user_code,
            position: player.position || 'MF',
            profile_image: player.profile_image || defaultProfile
          };

          rankings.distance.push({
            ...playerInfo,
            value: quarter.distance,
            displayValue: `${quarter.distance.toFixed(2)}km`
          });

          rankings.maxSpeed.push({
            ...playerInfo,
            value: quarter.max_speed,
            displayValue: `${quarter.max_speed.toFixed(1)}km/h`
          });

          rankings.sprintCount.push({
            ...playerInfo,
            value: quarter.sprint_count,
            displayValue: `${quarter.sprint_count}회`
          });

          rankings.points.push({
            ...playerInfo,
            value: quarter.points,
            displayValue: `${quarter.points}%`
          });
        }
      });
    });

    // 각 항목별로 내림차순 정렬
    rankings.distance.sort((a, b) => b.value - a.value);
    rankings.maxSpeed.sort((a, b) => b.value - a.value);
    rankings.sprintCount.sort((a, b) => b.value - a.value);
    rankings.points.sort((a, b) => b.value - a.value);

    return rankings;
  };

  // 포지션별 색상 클래스 반환 함수
  const getPositionClass = (position) => {
    if (!position) return 'position-midfielder';
    
    const positionUpper = position.toUpperCase();
    
    if (['LWF', 'ST', 'RWF', 'CF'].includes(positionUpper)) {
      return 'position-striker';
    } else if (['LWM', 'CAM', 'RWM', 'LM', 'CM', 'RM', 'CDM', 'AM', 'DM'].includes(positionUpper)) {
      return 'position-midfielder';
    } else if (['LWB', 'RWB', 'LB', 'CB', 'RB', 'SW'].includes(positionUpper)) {
      return 'position-defender';
    } else if (['GK'].includes(positionUpper)) {
      return 'position-goalkeeper';
    } else {
      return 'position-midfielder';
    }
  };

  // 포지션별 카드 배경 이미지 반환 함수
  const getPositionCardImage = (position) => {
    if (!position) return greenMiniCard;
    
    const positionUpper = position.toUpperCase();
    
    if (['LWF', 'ST', 'RWF', 'CF'].includes(positionUpper)) {
      return redMiniCard;
    } else if (['LWM', 'CAM', 'RWM', 'LM', 'CM', 'RM', 'CDM', 'AM', 'DM'].includes(positionUpper)) {
      return greenMiniCard;
    } else if (['LWB', 'RWB', 'LB', 'CB', 'RB', 'SW'].includes(positionUpper)) {
      return blueMiniCard;
    } else if (['GK'].includes(positionUpper)) {
      return yellowMiniCard;
    } else {
      return greenMiniCard;
    }
  };

  // 뒤로가기 함수
  const handleBack = () => {
    navigate('/app/team/info', { state: { teamCode } });
  };

  // 팀 로고 URL 가져오기
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

  // 팀 분석 데이터 불러오기
  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      
      const matchIdToUse = passedMatchData?.match_code || actualMatchId;
      
      if (!matchIdToUse) {
        throw new Error('경기 ID를 찾을 수 없습니다.');
      }
      
      const userCode = sessionStorage.getItem('userCode');
      const [aiSummaryResponse, analysisResponse, playersResponse, teamInfoResponse] = await Promise.all([
        GetTeamAiSummaryApi(matchIdToUse),
        GetTeamAnalysisDataApi(matchIdToUse, userCode),
        GetTeamPlayerAnalysisDataApi(matchIdToUse),
        userCode ? GetMyTeamInfoApi(userCode) : Promise.resolve({ data: null })
      ]);
      
      if (analysisResponse.data?.user_role) {
        setCurrentUserRole(analysisResponse.data.user_role);
      }
      
      // 팀 기본 정보 (실제 API 데이터만 사용)
      const teamInfo = {
        teamName: passedMatchData?.team_name || passedMatchData?.teamName || 
                 teamInfoResponse.data?.team_info?.name || 
                 teamInfoResponse.data?.team_info?.team_name || 
                 analysisResponse.data.team_info?.team_name || '',
        teamType: passedMatchData?.team_type || analysisResponse.data.team_info?.team_type || '',
        formation: passedMatchData?.formation || analysisResponse.data.team_info?.formation || '',
        matchLocation: passedMatchData?.ground_name || passedMatchData?.location || analysisResponse.data.match_info?.ground_name || '',
        matchDate: passedMatchData?.match_date || (analysisResponse.data.match_info?.match_date ? 
          new Date(analysisResponse.data.match_info.match_date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
          }) : ''),
        matchStartTime: passedMatchData?.match_time || passedMatchData?.start_time || analysisResponse.data.match_info?.start_time || '',
        matchEndTime: passedMatchData?.end_time || analysisResponse.data.match_info?.end_time || ''
      };
      
      // API 데이터를 화면 표시용 형태로 변환
      const formattedData = {
        ...teamInfo,
        
        // 경기 통계
        matchTime: `${analysisResponse.data.match_stats?.total_duration_minutes || 0}분`,
        quarterCount: `${analysisResponse.data.match_stats?.quarter_count || 0}쿼터`,
        
        participants: (() => {
          const players = playersResponse.data.players_data || [];
          const participantCount = players.length;
          return `${participantCount}명`;
        })(),
        
        mvp: (() => {
          const players = playersResponse.data.players_data || [];
          
          if (players.length === 0) {
            return '-';
          }
          
          const totalQuarters = analysisResponse.data.quarters?.length || 1;
          
          let maxScore = -1;
          let mvpUserName = null;
          
          players.forEach(player => {
            let avgPoints = 0;
            let quarterCount = 0;
            
            if (player.total_stats && player.total_stats.avg_points != null) {
              avgPoints = player.total_stats.avg_points;
              quarterCount = player.total_stats.quarter_count || 0;
            } else if (player.quarters && player.quarters.length > 0) {
              let totalPoints = 0;
              quarterCount = 0;
              
              player.quarters.forEach(quarter => {
                if (quarter.points != null) {
                  totalPoints += quarter.points;
                  quarterCount++;
                }
              });
              
              if (quarterCount > 0) {
                avgPoints = totalPoints / quarterCount;
              }
            }
            
            if (quarterCount === 0) {
              return;
            }
            
            const mvpScore = avgPoints;
            
            if (mvpScore > maxScore) {
              maxScore = mvpScore;
              mvpUserName = player.user_name;
            }
          });
          
          return mvpUserName || '-';
        })(),
        
        // 기존 필드들 (표시되지 않지만 유지)
        avgSpeed: analysisResponse.data.match_stats?.total_distance && analysisResponse.data.match_stats?.total_duration_minutes
          ? `${((analysisResponse.data.match_stats.total_distance / (analysisResponse.data.match_stats.total_duration_minutes / 60))).toFixed(1)}km/h`
          : '0km/h',
        maxSpeed: `${analysisResponse.data.match_stats?.max_speed || 0}km/h`,
        totalDistance: `${analysisResponse.data.match_stats?.total_distance || 0}km`,
        possession: analysisResponse.data.match_stats?.possession || '-',
        passAccuracy: analysisResponse.data.match_stats?.pass_accuracy || '-',
        
        // AI 분석 데이터
        aiAnalysis: aiSummaryResponse.data.ai_summary?.key_points || [],
        
        // 쿼터별 데이터
        quarters: (analysisResponse.data.quarters || []).map((quarter, index) => ({
          quarter: quarter.quarter || index + 1,
          quarter_code: quarter.quarter_code,
          name: quarter.name,
          duration: Math.round(quarter.duration_minutes || 0),
          actual_move_time: Math.round(quarter.duration_minutes || 0),
          status: quarter.status || '',
          home: quarter.home || '',
          
          // 팀 통계 (실제 API 데이터 사용)
          points: quarter.points || 0,
          distance: `${quarter.distance || 0}km`,
          max_speed: `${quarter.max_speed || 0}km/h`,
          avg_speed: `${quarter.avg_speed || 0}km/h`,
          
          // 추가 통계 (API에서 제공되는 경우만 사용)
          possession: quarter.possession || null,
          pass_accuracy: quarter.pass_accuracy || null,
          shots: quarter.shots || null,
          shots_on_target: quarter.shots_on_target || null,
          formation_changes: quarter.formation_changes || null,
          defensive_line_height: quarter.defensive_line_height || null,
          pressing_intensity: quarter.pressing_intensity || null,
          
          start_time: quarter.start_time,
          end_time: quarter.end_time,
          sprint_count: quarter.sprint_count || 0,
          movement_ratio: quarter.movement_ratio || 0,
          
          // 팀 레이더 차트 점수 (실제 API 데이터만 사용)
          radar_scores: quarter.radar_scores || null
        })),
        
        matchInfo: {
          name: passedMatchData?.match_name || passedMatchData?.title || analysisResponse.data.match_info?.name || '',
          match_code: matchIdToUse,
          team_code: teamCode
        },
        
        // 선수 데이터
        playersData: playersResponse.data.players_data || [],
        
        // 전체 경기 최고 성과자 (속력, 가속도, 스프린트, 평점)
        overallTopPerformers: calculateOverallTopPerformers(playersResponse.data.players_data || []),
        
        // 쿼터별 주요 지표 (각 지표에서 최고 수치를 기록한 선수)
        quarterTopPerformers: calculateQuarterTopPerformers(playersResponse.data.players_data || [])
      };
      
      setMatchData(formattedData);
      
      try {
        const logoUrl = await getTeamLogoUrl(teamCode);
        setTeamLogo(logoUrl);
      } catch (error) {
        setTeamLogo(defaultTeamLogo);
      }
      
    } catch (error) {
      alert(`팀 분석 데이터를 불러올 수 없습니다.\n${error.message}`);
      navigate('/app/team/info', { state: { teamCode } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!passedMatchData) {
      navigate('/app/team/info', { state: { teamCode } });
      return;
    }
    
    fetchAnalysisData();
  }, [passedMatchData, actualMatchId, navigate, teamCode, location.state]);

  // 쿼터별 경기 분석 클릭
  const handleQuarterClick = (quarter) => {
    setActiveQuarter(quarter);
    const quarterData = matchData.quarters.find(q => q.quarter === quarter);
    
    if (quarterData) {
      // 팀 분석 상세 페이지로 네비게이션
      navigate('/app/team/anal/detail', {
        state: {
          quarterCode: quarterData.quarter_code,
          quarterData: quarterData,
          matchData: matchData,
          teamCode: teamCode
        }
      });
    }
  };

  // 더보기 버튼 클릭
  const handleMoreClick = (quarter) => {
    setSelectedQuarter(quarter);
    setIsModalOpen(true);
  };

  // 쿼터 이름 변경
  const handleRename = async (newName) => {
    if (!selectedQuarter || !newName.trim()) return;
    
    try {
      setMatchData(prevData => {
        if (!prevData || !prevData.quarters) return prevData;
        
        const updatedQuarters = prevData.quarters.map(quarter => 
          quarter.quarter === selectedQuarter.quarter 
            ? { ...quarter, name: newName }
            : quarter
        );
        
        return {
          ...prevData,
          quarters: updatedQuarters
        };
      });
    } catch (error) {
      alert('이름 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 쿼터 삭제
  const handleDelete = async () => {
    if (!selectedQuarter) return;
    
    try {
      setMatchData(prevData => {
        if (!prevData || !prevData.quarters) return prevData;
        
        const updatedQuarters = prevData.quarters.filter(quarter => 
          quarter.quarter !== selectedQuarter.quarter
        );
        
        return {
          ...prevData,
          quarters: updatedQuarters
        };
      });
    } catch (error) {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 키포인트 아코디언 토글
  const toggleKeyPoint = (index) => {
    setExpandedKeyPoint(expandedKeyPoint === index ? null : index);
  };

  // 전체 경기 순위 계산 함수
  const calculateOverallRankings = (playersData) => {
    if (!playersData || playersData.length === 0) return null;

    const rankings = {
      maxSpeed: [],
      maxAcceleration: [],
      sprintCount: [],
      points: []
    };

    // 각 선수의 모든 쿼터 데이터를 수집
    playersData.forEach(player => {
      if (!player.quarters || player.quarters.length === 0) return;

      // 각 종목별 최고 기록과 해당 쿼터 찾기
      let playerMaxSpeed = 0;
      let playerMaxSpeedQuarter = null;
      let playerMaxAcceleration = 0;
      let playerMaxAccelerationQuarter = null;
      let playerMaxSprintCount = 0;
      let playerMaxSprintCountQuarter = null;
      let playerMaxPoints = 0;
      let playerMaxPointsQuarter = null;

      player.quarters.forEach(quarter => {
        if (quarter.max_speed > playerMaxSpeed) {
          playerMaxSpeed = quarter.max_speed;
          playerMaxSpeedQuarter = quarter;
        }
        if (quarter.max_acceleration && quarter.max_acceleration > playerMaxAcceleration) {
          playerMaxAcceleration = quarter.max_acceleration;
          playerMaxAccelerationQuarter = quarter;
        }
        if (quarter.sprint_count > playerMaxSprintCount) {
          playerMaxSprintCount = quarter.sprint_count;
          playerMaxSprintCountQuarter = quarter;
        }
        if (quarter.points > playerMaxPoints) {
          playerMaxPoints = quarter.points;
          playerMaxPointsQuarter = quarter;
        }
      });

      const playerInfo = {
        user_code: player.user_code,
        name: player.user_name || player.user_code,
        position: player.position || 'MF',
        profile_image: player.profile_image || defaultProfile
      };

      rankings.maxSpeed.push({
        ...playerInfo,
        value: playerMaxSpeed,
        displayValue: `${playerMaxSpeed.toFixed(1)}km/h`,
        quarterName: playerMaxSpeedQuarter?.quarter_name || '알 수 없음',
        quarterCode: playerMaxSpeedQuarter?.quarter_code || ''
      });

      rankings.maxAcceleration.push({
        ...playerInfo,
        value: playerMaxAcceleration,
        displayValue: `${playerMaxAcceleration.toFixed(2)}m/s²`,
        quarterName: playerMaxAccelerationQuarter?.quarter_name || '알 수 없음',
        quarterCode: playerMaxAccelerationQuarter?.quarter_code || ''
      });

      rankings.sprintCount.push({
        ...playerInfo,
        value: playerMaxSprintCount,
        displayValue: `${playerMaxSprintCount}회`,
        quarterName: playerMaxSprintCountQuarter?.quarter_name || '알 수 없음',
        quarterCode: playerMaxSprintCountQuarter?.quarter_code || ''
      });

      rankings.points.push({
        ...playerInfo,
        value: playerMaxPoints,
        displayValue: `${playerMaxPoints}점`,
        quarterName: playerMaxPointsQuarter?.quarter_name || '알 수 없음',
        quarterCode: playerMaxPointsQuarter?.quarter_code || ''
      });
    });

    // 각 항목별로 내림차순 정렬
    rankings.maxSpeed.sort((a, b) => b.value - a.value);
    rankings.maxAcceleration.sort((a, b) => b.value - a.value);
    rankings.sprintCount.sort((a, b) => b.value - a.value);
    rankings.points.sort((a, b) => b.value - a.value);

    return rankings;
  };

  // 지표 카드 클릭 핸들러
  const handleMetricCardClick = (quarterCode, metricType, quarterName) => {
    const rankings = calculateQuarterRankings(matchData.playersData, quarterCode);
    
    if (!rankings) return;

    const metricTitles = {
      distance: '이동거리',
      maxSpeed: '최고속력',
      sprintCount: '스프린트',
      points: '활동량'
    };

    setSelectedRankData({
      quarterName: quarterName,
      quarterCode: quarterCode,
      metricType: metricType,
      metricTitle: metricTitles[metricType],
      rankings: rankings
    });

    setIsRankModalOpen(true);
  };

  // 전체 경기 종목별 순위 모달 핸들러
  const handleOverallMetricClick = (metricType) => {
    const rankings = calculateOverallRankings(matchData.playersData);
    
    if (!rankings) return;

    const metricTitles = {
      maxSpeed: '최고속력',
      maxAcceleration: '최고가속도',
      sprintCount: '스프린트',
      points: '평점'
    };

    setSelectedRankData({
      quarterName: '전체 경기',
      quarterCode: 'overall',
      metricType: metricType,
      metricTitle: metricTitles[metricType],
      rankings: rankings,
      isOverall: true
    });

    setIsRankModalOpen(true);
  };
  
  // 쿼터 상세 페이지로 이동
  const handleQuarterDetail = (quarterCode) => {
    navigate('/app/team/anal/detail', {
      state: {
        quarterCode: quarterCode,
        quarterData: null,
        matchData: matchData,
        teamCode: teamCode
      }
    });
  };

  // 선수 카드 클릭 - 개인 분석 페이지로 이동
  const handlePlayerCardClick = (player) => {
    if (!player.quarters || player.quarters.length === 0) {
      alert('해당 선수의 분석 데이터가 없습니다.');
      return;
    }
    
    const firstQuarter = player.quarters[0];
    const quarterInfo = matchData.quarters?.find(q => 
      q.quarter_code === firstQuarter.quarter_code ||
      q.quarter_code === firstQuarter.team_quarter_code
    );
    const playerQuartersForTabs = player.quarters.map((pq, index) => {
      const teamQuarter = matchData.quarters?.find(q => q.quarter_code === pq.team_quarter_code);
      
      return {
        quarter_code: pq.quarter_code,
        team_quarter_code: pq.team_quarter_code,
        quarter: teamQuarter?.quarter || (index + 1),
        name: pq.quarter_name || teamQuarter?.name || `${index + 1}쿼터`,
        start_time: teamQuarter?.start_time,
        end_time: teamQuarter?.end_time,
        home: teamQuarter?.home || 'home',
        status: 'play' // 팀 분석에 있는 선수 쿼터는 모두 출전
      };
    });
    
    const navigationData = {
      quarter: {
        quarter_code: firstQuarter.quarter_code || firstQuarter.team_quarter_code,
        team_quarter_code: firstQuarter.team_quarter_code || quarterInfo?.quarter_code, // 팀 쿼터 코드 추가
        name: quarterInfo?.name || '1쿼터',
        quarter: quarterInfo?.quarter || 1,
        start_time: quarterInfo?.start_time || firstQuarter.start_time,
        end_time: quarterInfo?.end_time || firstQuarter.end_time,
        home: quarterInfo?.home || 'home'
      },
      matchData: {
        match_code: matchData.matchInfo?.match_code || actualMatchId,
        playerName: player.user_name,
        playerPosition: player.position,
        playerProfileImage: player.profile_image, // 프로필 이미지 추가
        playerAge: player.age, // 나이 추가
        playerNumber: player.number, // 등번호 추가
        playerRole: player.role, // 역할 추가
        playerActivityArea: player.activity_area, // 활동지역 추가
        match_name: matchData.matchInfo?.name || passedMatchData?.match_name,
        ground_name: matchData.matchLocation || passedMatchData?.ground_name,
        match_date: matchData.matchDate || passedMatchData?.match_date,
        user_code: player.user_code, // 선수의 user_code 추가
        quarters: playerQuartersForTabs // 쿼터 탭 표시를 위한 쿼터 목록 추가
      },
      fromTeamAnalysis: true
    };
    navigate('/app/player/anal-detail', {
      state: navigationData
    });
  };

  // 선수 검색 필터링
  const getFilteredPlayers = () => {
    if (!matchData?.playersData) return [];
    
    return matchData.playersData.filter(player => {
      const searchLower = playerSearchTerm.toLowerCase();
      const nameLower = (player.user_name || '').toLowerCase();
      const positionLower = (player.position || '').toLowerCase();
      
      return nameLower.includes(searchLower) || positionLower.includes(searchLower);
    });
  };

  // 페이지네이션 - 현재 페이지 선수 목록 (5명씩)
  const PLAYERS_PER_PAGE = 5;
  const getCurrentPagePlayers = () => {
    const filtered = getFilteredPlayers();
    const startIndex = currentPlayerPage * PLAYERS_PER_PAGE;
    const endIndex = startIndex + PLAYERS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  };

  // 전체 페이지 수
  const getTotalPages = () => {
    const filtered = getFilteredPlayers();
    return Math.ceil(filtered.length / PLAYERS_PER_PAGE);
  };

  // 이전 페이지
  const handlePrevPlayerPage = () => {
    setCurrentPlayerPage(prev => Math.max(0, prev - 1));
  };

  // 다음 페이지
  const handleNextPlayerPage = () => {
    const totalPages = getTotalPages();
    setCurrentPlayerPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  // 검색어 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPlayerPage(0);
  }, [playerSearchTerm]);

  if (loading) {
    return (
      <div className='anal-page'>
        <LogoBellNav logo={true} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="text-body">팀 분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className='anal-page'>
        <LogoBellNav logo={true} />
        <div className="error-container">
          <p className="text-body">팀 분석 데이터를 찾을 수 없습니다.</p>
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/app/team/info', { state: { teamCode } })}
          >
            팀 정보로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='anal-page'>
      <LogoBellNav logo={true} />
      
      <div className="anal-container">
        {/* 헤더 섹션 */}
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack}>
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <div className="empty-space"></div>
          </div>
          <div className="header-content">
            <h1 className="text-h2">팀 경기분석</h1>
            <p className="subtitle text-body">팀 경기 데이터를 종합적으로 분석해 보여줘요</p>
          </div>
        </div>

        {/* 통합 정보 카드 */}
      <div className="player-info-card">
        <div className="match-info-section">
          <div className="match-info-left">
            <div className="player-profile">
              <div className="player-avatar">
                <img src={teamLogo} alt="팀 로고" />
              </div>
              <div className="player-details">
                <h2 className={`player-name text-h2 ${getNameSizeClass(matchData.teamName)}`}>{matchData.teamName || '팀 정보 없음'}</h2>
              </div>
            </div>
            <div className="match-location text-body">{matchData.matchLocation}</div>
            <div className="match-datetime text-body">
              {matchData.matchDate}
            </div>
          </div>
          <div className="match-info-divider"></div>
          <div className="match-info-right">
            <div className="match-stat">
              <span className="stat-label text-caption">경기 시간</span>
              <span className="stat-value text-body">{matchData.matchTime}</span>
            </div>
            <div className="match-stat">
              <span className="stat-label text-caption">경기 수</span>
              <span className="stat-value text-body">{matchData.quarterCount}</span>
            </div>
            <div className="match-stat">
              <span className="stat-label text-caption">참여인원</span>
              <span className="stat-value text-body">{matchData.participants}</span>
            </div>
            <div className="match-stat">
              <span className="stat-label text-caption">MVP</span>
              <span className="stat-value text-body">{matchData.mvp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 종목별 최고 선수 (탭 포함) */}
      {(() => {
        if (!matchData.overallTopPerformers) {
          return null;
        }
        
        const isOverallTab = selectedPerformerTab === 'overall';
        const currentPerformers = isOverallTab 
          ? matchData.overallTopPerformers 
          : matchData.quarterTopPerformers?.[selectedPerformerTab];
        
        if (!currentPerformers) {
          return null;
        }
        
        return (
        <div className="analysis-section overall-performers-section">
          <div className="section-header">
            <div className="section-icon">
              <img src={starIcon} alt="최고 성과자" />
            </div>
            <h3 className="section-title text-h3">종목별 최고 선수</h3>
          </div>
          
          {/* 탭 영역 */}
          <div className="performer-tabs">
            <button 
              className={`performer-tab ${selectedPerformerTab === 'overall' ? 'active' : ''}`}
              onClick={() => setSelectedPerformerTab('overall')}
            >
              전체
            </button>
            {matchData.quarters && matchData.quarters.map((quarter, index) => (
              <button 
                key={quarter.quarter_code}
                className={`performer-tab ${selectedPerformerTab === quarter.quarter_code ? 'active' : ''}`}
                onClick={() => setSelectedPerformerTab(quarter.quarter_code)}
              >
                {quarter.name || `${index + 1}쿼터`}
              </button>
            ))}
          </div>
          
          <div className="overall-top-performers">
            {isOverallTab ? (
              // 전체 탭: 최고속력, 최고가속도, 스프린트, 평점
              <>
                {/* 최고속력 */}
                {currentPerformers.maxSpeed?.player && (
                  <div 
                    className={`top-performer-card ${getPositionClass(currentPerformers.maxSpeed.player?.position)}`}
                    style={{
                      backgroundImage: `url(${getPositionCardImage(currentPerformers.maxSpeed.player?.position)})`
                    }}
                    onClick={() => handleOverallMetricClick('maxSpeed')}
                  >
                    <div className="top-performer-content">
                      <div className="player-info-top">
                        <div className="player-avatar">
                          <img 
                            src={currentPerformers.maxSpeed.player?.profile_image || defaultProfile} 
                            alt={currentPerformers.maxSpeed.player?.name || '선수'}
                            onError={(e) => { e.target.src = defaultProfile; }}
                          />
                        </div>
                        <span className="player-name">
                          {currentPerformers.maxSpeed.player?.name || '데이터 없음'}
                        </span>
                      </div>
                      <div className="stat-info">
                        <span className="stat-title">최고속력</span>
                        <span className="stat-value">
                          {currentPerformers.maxSpeed.player?.value || '0km/h'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 최고가속도 */}
                {currentPerformers.maxAcceleration?.player && (
                  <div 
                    className={`top-performer-card ${getPositionClass(currentPerformers.maxAcceleration.player?.position)}`}
                    style={{
                      backgroundImage: `url(${getPositionCardImage(currentPerformers.maxAcceleration.player?.position)})`
                    }}
                    onClick={() => handleOverallMetricClick('maxAcceleration')}
                  >
                    <div className="top-performer-content">
                      <div className="player-info-top">
                        <div className="player-avatar">
                          <img 
                            src={currentPerformers.maxAcceleration.player?.profile_image || defaultProfile} 
                            alt={currentPerformers.maxAcceleration.player?.name || '선수'}
                            onError={(e) => { e.target.src = defaultProfile; }}
                          />
                        </div>
                        <span className="player-name">
                          {currentPerformers.maxAcceleration.player?.name || '데이터 없음'}
                        </span>
                      </div>
                      <div className="stat-info">
                        <span className="stat-title">최고가속도</span>
                        <span className="stat-value">
                          {currentPerformers.maxAcceleration.player?.value || '0m/s²'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 스프린트 */}
                {currentPerformers.sprintCount?.player && (
                  <div 
                    className={`top-performer-card ${getPositionClass(currentPerformers.sprintCount.player?.position)}`}
                    style={{
                      backgroundImage: `url(${getPositionCardImage(currentPerformers.sprintCount.player?.position)})`
                    }}
                    onClick={() => handleOverallMetricClick('sprintCount')}
                  >
                    <div className="top-performer-content">
                      <div className="player-info-top">
                        <div className="player-avatar">
                          <img 
                            src={currentPerformers.sprintCount.player?.profile_image || defaultProfile} 
                            alt={currentPerformers.sprintCount.player?.name || '선수'}
                            onError={(e) => { e.target.src = defaultProfile; }}
                          />
                        </div>
                        <span className="player-name">
                          {currentPerformers.sprintCount.player?.name || '데이터 없음'}
                        </span>
                      </div>
                      <div className="stat-info">
                        <span className="stat-title">스프린트</span>
                        <span className="stat-value">
                          {currentPerformers.sprintCount.player?.value || '0회'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 평점 */}
                {currentPerformers.points?.player && (
                  <div 
                    className={`top-performer-card ${getPositionClass(currentPerformers.points.player?.position)}`}
                    style={{
                      backgroundImage: `url(${getPositionCardImage(currentPerformers.points.player?.position)})`
                    }}
                    onClick={() => handleOverallMetricClick('points')}
                  >
                    <div className="top-performer-content">
                      <div className="player-info-top">
                        <div className="player-avatar">
                          <img 
                            src={currentPerformers.points.player?.profile_image || defaultProfile} 
                            alt={currentPerformers.points.player?.name || '선수'}
                            onError={(e) => { e.target.src = defaultProfile; }}
                          />
                        </div>
                        <span className="player-name">
                          {currentPerformers.points.player?.name || '데이터 없음'}
                        </span>
                      </div>
                      <div className="stat-info">
                        <span className="stat-title">평점</span>
                        <span className="stat-value">
                          {currentPerformers.points.player?.value || '0점'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // 쿼터 탭: 이동거리, 최고속력, 스프린트, 활동량
              <>
                {/* 이동거리 */}
                {currentPerformers.distance?.player && (
                  <div 
                    className={`top-performer-card ${getPositionClass(currentPerformers.distance.player?.position)}`}
                    style={{
                      backgroundImage: `url(${getPositionCardImage(currentPerformers.distance.player?.position)})`
                    }}
                    onClick={() => {
                      const quarterInfo = matchData.quarters.find(q => q.quarter_code === selectedPerformerTab);
                      handleMetricCardClick(selectedPerformerTab, 'distance', quarterInfo?.name || '쿼터');
                    }}
                  >
                    <div className="top-performer-content">
                      <div className="player-info-top">
                        <div className="player-avatar">
                          <img 
                            src={currentPerformers.distance.player?.profile_image || defaultProfile} 
                            alt={currentPerformers.distance.player?.name || '선수'}
                            onError={(e) => { e.target.src = defaultProfile; }}
                          />
                        </div>
                        <span className="player-name">
                          {currentPerformers.distance.player?.name || '데이터 없음'}
                        </span>
                      </div>
                      <div className="stat-info">
                        <span className="stat-title">이동거리</span>
                        <span className="stat-value">
                          {currentPerformers.distance.player?.value || '0km'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 최고속력 */}
                {currentPerformers.maxSpeed?.player && (
                  <div 
                    className={`top-performer-card ${getPositionClass(currentPerformers.maxSpeed.player?.position)}`}
                    style={{
                      backgroundImage: `url(${getPositionCardImage(currentPerformers.maxSpeed.player?.position)})`
                    }}
                    onClick={() => {
                      const quarterInfo = matchData.quarters.find(q => q.quarter_code === selectedPerformerTab);
                      handleMetricCardClick(selectedPerformerTab, 'maxSpeed', quarterInfo?.name || '쿼터');
                    }}
                  >
                    <div className="top-performer-content">
                      <div className="player-info-top">
                        <div className="player-avatar">
                          <img 
                            src={currentPerformers.maxSpeed.player?.profile_image || defaultProfile} 
                            alt={currentPerformers.maxSpeed.player?.name || '선수'}
                            onError={(e) => { e.target.src = defaultProfile; }}
                          />
                        </div>
                        <span className="player-name">
                          {currentPerformers.maxSpeed.player?.name || '데이터 없음'}
                        </span>
                      </div>
                      <div className="stat-info">
                        <span className="stat-title">최고속력</span>
                        <span className="stat-value">
                          {currentPerformers.maxSpeed.player?.value || '0km/h'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 스프린트 */}
                {currentPerformers.sprintCount?.player && (
                  <div 
                    className={`top-performer-card ${getPositionClass(currentPerformers.sprintCount.player?.position)}`}
                    style={{
                      backgroundImage: `url(${getPositionCardImage(currentPerformers.sprintCount.player?.position)})`
                    }}
                    onClick={() => {
                      const quarterInfo = matchData.quarters.find(q => q.quarter_code === selectedPerformerTab);
                      handleMetricCardClick(selectedPerformerTab, 'sprintCount', quarterInfo?.name || '쿼터');
                    }}
                  >
                    <div className="top-performer-content">
                      <div className="player-info-top">
                        <div className="player-avatar">
                          <img 
                            src={currentPerformers.sprintCount.player?.profile_image || defaultProfile} 
                            alt={currentPerformers.sprintCount.player?.name || '선수'}
                            onError={(e) => { e.target.src = defaultProfile; }}
                          />
                        </div>
                        <span className="player-name">
                          {currentPerformers.sprintCount.player?.name || '데이터 없음'}
                        </span>
                      </div>
                      <div className="stat-info">
                        <span className="stat-title">스프린트</span>
                        <span className="stat-value">
                          {currentPerformers.sprintCount.player?.value || '0회'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 활동량 */}
                {currentPerformers.points?.player && (
                  <div 
                    className={`top-performer-card ${getPositionClass(currentPerformers.points.player?.position)}`}
                    style={{
                      backgroundImage: `url(${getPositionCardImage(currentPerformers.points.player?.position)})`
                    }}
                    onClick={() => {
                      const quarterInfo = matchData.quarters.find(q => q.quarter_code === selectedPerformerTab);
                      handleMetricCardClick(selectedPerformerTab, 'points', quarterInfo?.name || '쿼터');
                    }}
                  >
                    <div className="top-performer-content">
                      <div className="player-info-top">
                        <div className="player-avatar">
                          <img 
                            src={currentPerformers.points.player?.profile_image || defaultProfile} 
                            alt={currentPerformers.points.player?.name || '선수'}
                            onError={(e) => { e.target.src = defaultProfile; }}
                          />
                        </div>
                        <span className="player-name">
                          {currentPerformers.points.player?.name || '데이터 없음'}
                        </span>
                      </div>
                      <div className="stat-info">
                        <span className="stat-title">활동량</span>
                        <span className="stat-value">
                          {currentPerformers.points.player?.value || '0점'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        );
      })()}

      {/* AI 요약 */}
      <div className="analysis-section">
        <div className="section-header">
          <div className="section-icon">
            <img src={starIcon} alt="AI 요약" />
          </div>
          <h3 className="section-title text-h3">AI가 발견한 핵심 포인트</h3>
        </div>
        <div className="ai-analysis">
          {matchData.aiAnalysis && matchData.aiAnalysis.length > 0 ? (
            <div className="key-points-list">
              {matchData.aiAnalysis.map((keyPoint, index) => (
                <div key={index} className={`key-point-card ${expandedKeyPoint === index ? 'expanded' : ''}`}>
                  <div 
                    className="key-point-header" 
                    onClick={() => toggleKeyPoint(index)}
                  >
                    <div className="key-point-quarter text-caption">{keyPoint.quarter}</div>
                    <h4 className="key-point-label text-h4">{keyPoint.label}</h4>
                    <div className="expand-icon">
                      <img 
                        src={expandedKeyPoint === index ? arrowUpIcon : arrowDownIcon} 
                        alt={expandedKeyPoint === index ? '접기' : '펼치기'} 
                      />
                    </div>
                  </div>
                  
                  {expandedKeyPoint === index && (
                    <div className="key-point-content">
                      <div className="key-point-insight text-body">
                        {keyPoint.insight}
                      </div>
                      <div className="key-point-value text-body">
                        {keyPoint.value}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-analysis text-body">
              AI 분석 데이터를 불러오는 중입니다...
            </div>
          )}
        </div>
      </div>

      {/* 쿼터별 경기 분석 */}
      {matchData.quarters.length > 0 && (
        <div className="analysis-section">
          <div className="section-header">
            <h3 className="section-title text-h3">쿼터별 경기 분석</h3>
            <span className="section-subtitle text-caption">{matchData.quarters.length}개 쿼터</span>
          </div>
          <div className="quarters-list">
            {matchData.quarters.map((quarter) => (
              <div 
                key={quarter.quarter} 
                className="quarter-card"
                onClick={() => handleQuarterClick(quarter.quarter)}
              >
                <div className="quarter-info">
                  <div className="quarter-icon">
                    <img src={folderIcon} alt="쿼터" />
                  </div>
                  <div className="quarter-details">
                    <h4 className="quarter-title text-h4">{quarter.name}</h4>
                    <p className="quarter-meta text-caption">
                      {quarter.home === "rest" ? `${quarter.duration}분•휴식` : `${quarter.duration}분 • ${quarter.points}점 • ${quarter.distance}`}
                    </p>
                  </div>
                </div>
                {/* 팀장/매니저만 더보기 버튼 표시 */}
                {(currentUserRole === 'owner' || currentUserRole === 'manager') && (
                  <div className="quarter-actions">
                    <button 
                      className="more-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoreClick(quarter);
                      }}
                    >
                      <img src={dot3Icon} alt="더보기" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 선수별 분석 */}
      {matchData.playersData && matchData.playersData.length > 0 && (
        <div className="analysis-section players-analysis-section">
          <div className="section-header">
            <div className="section-icon">
              <img src={chartIcon} alt="선수별 분석" />
            </div>
            <h3 className="section-title text-h3">선수별 분석</h3>
            <span className="section-subtitle text-caption">{matchData.playersData.length}명</span>
          </div>

          {/* 검색 */}
          <div className="players-controls">
            <input 
              type="text"
              className="player-search-input"
              placeholder="선수 이름 또는 포지션 검색"
              value={playerSearchTerm}
              onChange={(e) => setPlayerSearchTerm(e.target.value)}
            />
          </div>

          {/* 선수 목록 (5개씩 세로 목록) */}
          <div className="players-list">
            {getCurrentPagePlayers().map((player) => {
              const avgPoints = player.total_stats?.avg_points || 0;
              const maxSpeed = player.total_stats?.max_speed || 0;
              const totalDistance = player.total_stats?.total_distance || 0;
              const quarterCount = player.quarters?.length || 0;
              
              return (
                <div 
                  key={player.user_code}
                  className="player-item"
                  onClick={() => handlePlayerCardClick(player)}
                >
                  <div className="player-avatar">
                    <img 
                      src={player.profile_image || defaultProfile} 
                      alt={player.user_name}
                      onError={(e) => { e.target.src = defaultProfile; }}
                    />
                  </div>
                  <div className="player-info">
                    <div className="player-header">
                      <h4 className="player-name text-h4">{player.user_name || '이름 없음'}</h4>
                      <span className="player-position">
                        {player.position || 'MF'}
                      </span>
                    </div>
                    <div className="player-details">
                      <span className="player-stat text-body-sm">
                        {maxSpeed.toFixed(1)} km/h
                      </span>
                      <span className="player-divider">•</span>
                      <span className="player-stat text-body-sm">
                        {totalDistance.toFixed(2)} km
                      </span>
                      <span className="player-divider">•</span>
                      <span className="player-stat text-body-sm">
                        평점 {avgPoints.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {getFilteredPlayers().length > PLAYERS_PER_PAGE && (
            <div className="players-pagination">
              <button 
                className="pagination-btn prev"
                onClick={handlePrevPlayerPage}
                disabled={currentPlayerPage === 0}
                aria-label="이전 페이지"
              >
                <img src={backIcon} alt="이전" />
              </button>
              
              <div className="pagination-info">
                <span className="page-indicator text-body">
                  {currentPlayerPage + 1} / {getTotalPages()}
                </span>
                <span className="page-dots">
                  {Array.from({ length: getTotalPages() }, (_, i) => (
                    <span 
                      key={i} 
                      className={`dot ${i === currentPlayerPage ? 'active' : ''}`}
                      onClick={() => setCurrentPlayerPage(i)}
                    />
                  ))}
                </span>
              </div>
              
              <button 
                className="pagination-btn next"
                onClick={handleNextPlayerPage}
                disabled={currentPlayerPage >= getTotalPages() - 1}
                aria-label="다음 페이지"
              >
                <img src={rightIcon} alt="다음" />
              </button>
            </div>
          )}

          {/* 검색 결과 없음 */}
          {getFilteredPlayers().length === 0 && (
            <div className="no-players text-body">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* 쿼터 액션 모달 */}
      {isModalOpen && selectedQuarter && (
        <MatchActionDSModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          matchData={selectedQuarter}
          matchTitle={selectedQuarter.name}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}

      {/* 순위 모달 */}
      {isRankModalOpen && selectedRankData && (
        <DSModal
          isOpen={isRankModalOpen}
          onClose={() => setIsRankModalOpen(false)}
          title={`${selectedRankData.quarterName} - ${selectedRankData.metricTitle} 순위`}
          size="lg"
        >
          <DSModal.Body>
            <div className="ds-detail">
              <div className="ds-detail__section">
                <div className="rank-tabs">
                  {selectedRankData.isOverall ? (
                    // 전체 경기 순위 탭
                    <>
                      <button 
                        className={`rank-tab ${selectedRankData.metricType === 'maxSpeed' ? 'active' : ''}`}
                        onClick={() => {
                          const rankings = calculateOverallRankings(matchData.playersData);
                          setSelectedRankData(prev => ({ ...prev, metricType: 'maxSpeed', metricTitle: '최고속력', rankings }));
                        }}
                      >
                        최고속력
                      </button>
                      <button 
                        className={`rank-tab ${selectedRankData.metricType === 'maxAcceleration' ? 'active' : ''}`}
                        onClick={() => {
                          const rankings = calculateOverallRankings(matchData.playersData);
                          setSelectedRankData(prev => ({ ...prev, metricType: 'maxAcceleration', metricTitle: '최고가속도', rankings }));
                        }}
                      >
                        최고가속도
                      </button>
                      <button 
                        className={`rank-tab ${selectedRankData.metricType === 'sprintCount' ? 'active' : ''}`}
                        onClick={() => {
                          const rankings = calculateOverallRankings(matchData.playersData);
                          setSelectedRankData(prev => ({ ...prev, metricType: 'sprintCount', metricTitle: '스프린트', rankings }));
                        }}
                      >
                        스프린트
                      </button>
                      <button 
                        className={`rank-tab ${selectedRankData.metricType === 'points' ? 'active' : ''}`}
                        onClick={() => {
                          const rankings = calculateOverallRankings(matchData.playersData);
                          setSelectedRankData(prev => ({ ...prev, metricType: 'points', metricTitle: '평점', rankings }));
                        }}
                      >
                        평점
                      </button>
                    </>
                  ) : (
                    // 쿼터별 순위 탭
                    <>
                      <button 
                        className={`rank-tab ${selectedRankData.metricType === 'distance' ? 'active' : ''}`}
                        onClick={() => {
                          const rankings = calculateQuarterRankings(matchData.playersData, selectedRankData.quarterCode);
                          setSelectedRankData(prev => ({ ...prev, metricType: 'distance', metricTitle: '이동거리', rankings }));
                        }}
                      >
                        이동거리
                      </button>
                      <button 
                        className={`rank-tab ${selectedRankData.metricType === 'maxSpeed' ? 'active' : ''}`}
                        onClick={() => {
                          const rankings = calculateQuarterRankings(matchData.playersData, selectedRankData.quarterCode);
                          setSelectedRankData(prev => ({ ...prev, metricType: 'maxSpeed', metricTitle: '최고속력', rankings }));
                        }}
                      >
                        최고속력
                      </button>
                      <button 
                        className={`rank-tab ${selectedRankData.metricType === 'sprintCount' ? 'active' : ''}`}
                        onClick={() => {
                          const rankings = calculateQuarterRankings(matchData.playersData, selectedRankData.quarterCode);
                          setSelectedRankData(prev => ({ ...prev, metricType: 'sprintCount', metricTitle: '스프린트', rankings }));
                        }}
                      >
                        스프린트
                      </button>
                      <button 
                        className={`rank-tab ${selectedRankData.metricType === 'points' ? 'active' : ''}`}
                        onClick={() => {
                          const rankings = calculateQuarterRankings(matchData.playersData, selectedRankData.quarterCode);
                          setSelectedRankData(prev => ({ ...prev, metricType: 'points', metricTitle: '활동량', rankings }));
                        }}
                      >
                        활동량
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="ds-detail__section">
                <div className="rank-list">
                  {selectedRankData.rankings[selectedRankData.metricType].map((player, index) => (
                    <div 
                      key={player.user_code} 
                      className={`rank-item ${index < 3 ? 'top-rank' : ''}`}
                    >
                      <div className="rank-number">
                        {index === 0 && <span className="medal gold">🥇</span>}
                        {index === 1 && <span className="medal silver">🥈</span>}
                        {index === 2 && <span className="medal bronze">🥉</span>}
                        {index > 2 && <span className="rank-text">{index + 1}</span>}
                      </div>
                      
                      <div className="rank-player-info">
                        <div className="rank-player-avatar">
                          <img 
                            src={player.profile_image} 
                            alt={player.name}
                            onError={(e) => { e.target.src = defaultProfile; }}
                          />
                        </div>
                        <div className="rank-player-details">
                          <span className="rank-player-name text-body">{player.name}</span>
                          <div className="rank-player-meta">
                            <span className="rank-player-position text-caption">
                              {player.position}
                            </span>
                            {selectedRankData.isOverall && player.quarterName && (
                              <span className="rank-player-quarter text-caption">
                                • {player.quarterName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="rank-value text-h4">
                        {player.displayValue}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DSModal.Body>
        </DSModal>
      )}
      </div>
    </div>
  );
};

export default Team_Anal;
