import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
// DSModal variants (디자인 시스템 공용 모달 사용)
import { MatchActionDSModal } from '../../../components/Modal/variants';
// DEV NOTE: 모든 모달은 디자인 시스템 공용 DSModal(variants 포함)만 사용합니다. 개별 오버레이/컨테이너 구현 금지.
import '../css/Anal.scss';

// API
import { GetUserAnalysisDataApi, GetUserOvrDataApi, GetUserStatsDataApi, GetUserPointDataApi } from '../../../function/api/anal/analApi';
import { GetMatchDetailApi, UpdateMatchNameApi, DeleteMatchApi, UpdateQuarterNameApi, DeleteQuarterApi } from '../../../function/api/match/matchApi';
import { GetProfileImageApi } from '../../../function/api/user/userApi';

// 아이콘 import (승인된 아이콘 디렉토리 사용)
import folderIcon from '../../../assets/main_icons/folder_black.png';
import backIcon from '../../../assets/main_icons/back_black.png';
import chartIcon from '../../../assets/main_icons/graph_black.png';
import starIcon from '../../../assets/identify_icon/star.png';
import optionIcon from '../../../assets/main_icons/option_black.png';
import sortIcon from '../../../assets/main_icons/sort_black.png';
import arrowDownIcon from '../../../assets/main_icons/down_gray.png';
import arrowUpIcon from '../../../assets/main_icons/up_gray.png';

// 더미 프로필 이미지 import
import defaultProfile from '../../../assets/common/default_profile.png';

const Anal = () => {
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
  const [profileImage, setProfileImage] = useState(defaultProfile);
  
  // state에서 matchData와 matchId 가져오기
  const { matchData: passedMatchData, matchId } = location.state || {};

  // 프로필 이미지 가져오기 함수
  const getProfileImage = async (userCode) => {
    if (!userCode) return defaultProfile;
    
    try {
      const response = await GetProfileImageApi(userCode);
      
      if (response.data.exists && response.data.image_url) {
        return response.data.image_url;
      } else {
        return defaultProfile;
      }
    } catch (error) {
      return defaultProfile;
    }
  };

  // 포지션별 색상 클래스 반환 함수
  const getPositionClass = (position) => {
    if (!position) return 'position-default';
    
    const positionUpper = position.toUpperCase();
    
    // 공격수 포지션 (빨간색 계열)
    if (['LWF', 'ST', 'RWF'].includes(positionUpper)) {
      return 'position-striker';
    }
    // 미드필더 포지션 (초록색 계열)
    else if (['LWM', 'CAM', 'RWM', 'LM', 'CM', 'RM', 'CDM'].includes(positionUpper)) {
      return 'position-midfielder';
    }
    // 수비수 포지션 (파란색 계열)
    else if (['LWB', 'RWB', 'LB', 'CB', 'RB'].includes(positionUpper)) {
      return 'position-defender';
    }
    // 골키퍼 포지션 (주황색 계열)
    else if (['GK'].includes(positionUpper)) {
      return 'position-goalkeeper';
    }
    // 한글 포지션명 처리
    else if (position.includes('공격') || position.includes('스트라이커') || position.includes('윙어')) {
      return 'position-striker';
    } else if (position.includes('미드필더') || position.includes('미드') || position.includes('중앙')) {
      return 'position-midfielder';
    } else if (position.includes('수비') || position.includes('백')) {
      return 'position-defender';
    } else if (position.includes('골키퍼') || position.includes('키퍼')) {
      return 'position-goalkeeper';
    } else {
      return 'position-default';
    }
  };

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

  // 뒤로가기 함수
  const handleBack = () => {
    navigate('/app/player/folder');
  };

  // 실제 DB에서 분석 데이터 불러오기
  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      
      if (!userCode) {
        navigate('/app/player/folder');
        return;
      }

      // 매치 상세 정보 먼저 가져오기 (userCode도 함께 전달하여 사용자 정보 포함)
      const matchDetailResponse = await GetMatchDetailApi(userCode, matchId);
      
      if (!matchDetailResponse.data) {
        const errorMsg = matchDetailResponse.data?.error || matchDetailResponse.data?.message || '경기 데이터를 불러올 수 없습니다.';
        throw new Error(errorMsg);
      }
      
      const matchDetail = matchDetailResponse.data;

      // API 데이터를 화면 표시용 형태로 변환
      const userName = sessionStorage.getItem('userName') || localStorage.getItem('userName') || '사용자';
      const userPosition = sessionStorage.getItem('userPosition') || localStorage.getItem('userPosition') || 
                          sessionStorage.getItem('preferred_position') || localStorage.getItem('preferred_position') || 'MF';
      
      const formattedData = {
        playerName: matchDetail.user_info?.user_name || userName,
        playerPosition: matchDetail.user_info?.user_position || userPosition,
        playerRole: matchDetail.match_info?.ground_name || matchDetail.match_info?.name || '경기 분석',
        matchTime: `${matchDetail.match_stats?.total_duration_minutes || 0}분`,
        quarterCount: `${matchDetail.match_stats?.quarter_count || 0}쿼터`,
        maxSpeed: `${matchDetail.match_stats?.max_speed || 0}km/h`,
        totalDistance: `${(matchDetail.match_stats?.total_distance || 0).toFixed(2)}km`,

        aiAnalysis: matchDetail.ai_summary?.key_points || [],
        
        // 경기 날짜/시간 정보 처리
        matchDate: matchDetail.match_info?.start_time ? 
          new Date(matchDetail.match_info.start_time).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : '날짜 미정',
        matchStartTime: matchDetail.match_info?.start_time ? 
          new Date(matchDetail.match_info.start_time).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) : '',
        
        quarters: (matchDetail.quarters || [])
          .sort((a, b) => {
            // start_time 기준으로 오래된 순(오름차순) 정렬
            const timeA = new Date(a.start_time || 0);
            const timeB = new Date(b.start_time || 0);
            return timeA - timeB;
          })
          .map((quarter, index) => {
            // 백엔드에서 제공하는 duration_minutes 직접 사용
            const duration = Math.round(quarter.duration_minutes || 0);

            return {
              quarter: index + 1,
              quarter_code: quarter.quarter_code,
              name: quarter.name || `${index + 1}쿼터`,
              duration: duration,
              actual_move_time: duration,  // 실제 이동시간
              status: quarter.status || '완료',
              home: quarter.home,  // home 필드 추가
              points: Math.round(quarter.points || 0),  // 백엔드에서 직접 제공
              distance: quarter.distance ? `${quarter.distance.toFixed(2)}km` : '0km',  // 백엔드에서 직접 제공
              max_speed: quarter.max_speed ? `${quarter.max_speed.toFixed(1)}km/h` : '0km/h',  // 백엔드에서 직접 제공
              avg_speed: quarter.avg_speed ? `${quarter.avg_speed.toFixed(1)}km/h` : '0km/h',  // 백엔드에서 직접 제공
              start_time: quarter.start_time,  // start_time 정보 보존
              end_time: quarter.end_time,      // end_time 정보 보존
              sprint_count: quarter.sprint_count || 0,  // 스프린트 횟수 보존
              movement_ratio: quarter.movement_ratio || 0,  // 활동 비율 보존
              radar_scores: quarter.radar_scores || {}   // 레이더 차트 점수 보존
            };
          }),
        matchInfo: matchDetail.match_info || {}
      };
      
      setMatchData(formattedData);
      
      // 프로필 이미지 가져오기
      try {
        const profileImg = await getProfileImage(userCode);
        setProfileImage(profileImg);
      } catch (error) {
        setProfileImage(defaultProfile);
      }
      
    } catch (error) {
      // API 실패 시 폴더에서 전달받은 기본 정보라도 표시
      if (passedMatchData) {
        const fallbackData = {
          playerName: sessionStorage.getItem('userName') || '사용자',
          playerPosition: sessionStorage.getItem('userPosition') || localStorage.getItem('preferred_position') || 'MF',
          playerRole: passedMatchData.title || '경기 분석',
          matchTime: '분석 중',
          quarterCount: `${passedMatchData.quarter_count || 0}쿼터`,
          maxSpeed: '분석 중',
          totalDistance: '분석 중',
          avgSpeed: '분석 중',
          totalPoints: 0,
          matchDate: passedMatchData.match_date || '날짜 미정',
          matchStartTime: passedMatchData.match_time || '',
          aiAnalysis: [],
          quarters: []
        };
        setMatchData(fallbackData);
      } else {
        alert(`분석 데이터를 불러올 수 없습니다: ${error.message}`);
        navigate('/app/player/folder');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // state에서 전달받은 데이터가 없는 경우 폴더 페이지로 리다이렉트
    if (!passedMatchData || !matchId) {
      navigate('/app/player/folder');
      return;
    }
    
    fetchAnalysisData();
  }, [passedMatchData, matchId, navigate]);

  // 쿼터별 경기 분석 클릭
  const handleQuarterClick = (quarter) => {
    // 해당 쿼터 데이터 찾기
    const quarterData = matchData.quarters.find(q => q.quarter === quarter);
    
    // 비출전 쿼터인 경우 클릭 무시 (status가 'rest'인 경우)
    if (quarterData && quarterData.status === 'rest') {
      return;
    }
    
    setActiveQuarter(quarter);
    
    if (quarterData) {
      // 상세 페이지로 네비게이션
      navigate('/app/player/anal-detail', {
        state: {
          quarter: quarterData,
          matchData: matchData
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
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      
      // API 호출하여 DB 업데이트
      const response = await UpdateQuarterNameApi(userCode, matchId, selectedQuarter.quarter, newName);
      
      if (response.data && response.data.success) {
        // 성공 시 로컬 상태도 업데이트
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
      } else {
        throw new Error(response.data?.error || '이름 변경에 실패했습니다.');
      }
    } catch (error) {
      alert('이름 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 쿼터 삭제
  const handleDelete = async () => {
    if (!selectedQuarter) return;
    
    try {
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      
      // API 호출하여 DB에서 삭제
      const response = await DeleteQuarterApi(userCode, matchId, selectedQuarter.quarter);
      
      if (response.data.success) {
        // 성공 시 로컬 상태도 업데이트
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
      } else {
        throw new Error(response.data.error || '삭제에 실패했습니다.');
      }
    } catch (error) {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 키포인트 아코디언 토글
  const toggleKeyPoint = (index) => {
    setExpandedKeyPoint(expandedKeyPoint === index ? null : index);
  };

  if (loading) {
    return (
      <div className='player-anal-page'>
        <LogoBellNav logo={true} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="text-body">분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className='player-anal-page'>
        <LogoBellNav logo={true} />
        <div className="error-container">
          <p className="text-body">분석 데이터를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='player-anal-page'>
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
            <h1 className="text-h2">{matchData.matchInfo?.match_name}</h1>
            <p className="subtitle text-body">경기 데이터를 요약해 보여줘요</p>
          </div>
        </div>

        {/* 통합 정보 카드 */}
        <div className="player-info-card">
        <div className="match-info-section">
          <div className="match-info-left">
            <div className="player-profile">
              <div className="player-avatar">
                <img src={profileImage} alt="프로필" />
              </div>
              <div className="player-info">
                <p className={`player-position ${getPositionClass(matchData.playerPosition)} text-h3`} >{matchData.playerPosition}</p>
                <h2 className={`player-name text-h2 ${getNameSizeClass(matchData.playerName)}`}>{matchData.playerName}</h2>
              </div>
            </div>
            <div className="match-location text-body">{matchData.playerRole}</div>
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
              <span className="stat-label text-caption">최고속력</span>
              <span className="stat-value text-body">{matchData.maxSpeed}</span>
            </div>
            <div className="match-stat">
              <span className="stat-label text-caption">이동거리</span>
              <span className="stat-value text-body">{matchData.totalDistance}</span>
            </div>
          </div>
        </div>
      </div>

        {/* AI 요약 */}
        <div className="analysis-section">
        <div className="section-header">
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
            {matchData.quarters.map((quarter) => {
              // status가 'rest'이면 비출전, 'play'면 출전
              const isNonPlay = quarter.status === 'rest';
              
              return (
                <div 
                  key={quarter.quarter} 
                  className={`quarter-card ${isNonPlay ? 'disabled' : ''}`}
                  onClick={() => handleQuarterClick(quarter.quarter)}
                >
                  <div className="quarter-info">
                    <div className="quarter-icon">
                      <img src={folderIcon} alt="쿼터" />
                    </div>
                    <div className="quarter-details">
                      <h4 className="quarter-title text-h4">{quarter.name}</h4>
                      <p className="quarter-meta text-caption">
                        {isNonPlay 
                          ? "비출전" 
                          : `${quarter.duration}분 • ${quarter.points}점 • ${quarter.distance}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="quarter-actions">
                    <button 
                      className="more-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoreClick(quarter);
                      }}
                    >
                      <img src={optionIcon} alt="더보기" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          

          </div>
        )}

        {/* 쿼터 액션 모달 - DSModal */}
        {isModalOpen && selectedQuarter && (
          <MatchActionDSModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            matchData={selectedQuarter}
            matchTitle={selectedQuarter.name}
            onRename={handleRename}
            onDelete={handleDelete}
            hideDelete={true}
          />
        )}
      </div>
    </div>
  );
};

export default Anal;
