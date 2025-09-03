import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import MatchActionModal from '../../../components/MatchActionModal';
import '../css/Anal.scss';

// API
import { GetUserAnalysisDataApi, GetMatchDetailApi, GetUserOvrDataApi, GetUserStatsDataApi, GetUserPointDataApi, UpdateMatchNameApi, DeleteMatchApi, UpdateQuarterNameApi, DeleteQuarterApi } from '../../../function/api/user/userApi';

// 아이콘 import
import folderIcon from '../../../assets/common/folder.png';
import rightIcon from '../../../assets/common/right.png';
import chartIcon from '../../../assets/common/graph-black.png';
import speedIcon from '../../../assets/common/star.png';
import distanceIcon from '../../../assets/common/location.png';
import timeIcon from '../../../assets/common/clock.png';
import starIcon from '../../../assets/common/star.png';
import dot3Icon from '../../../assets/common/dot3.png';

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
  
  // state에서 matchData와 matchId 가져오기
  const { matchData: passedMatchData, matchId } = location.state || {};

  // 프로필 이미지 가져오기 함수
  const getProfileImage = (userCode) => {
    return defaultProfile;
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
        console.warn('사용자 코드가 없습니다.');
        navigate('/app/player/folder');
        return;
      }

      console.log(`분석 데이터 로드 시작: ${userCode}, matchId: ${matchId}`);

      // 매치 상세 정보 먼저 가져오기
      const matchDetailResponse = await GetMatchDetailApi(userCode, matchId);
      
      console.log('API 응답 전체:', matchDetailResponse);
      console.log('API 응답 데이터:', matchDetailResponse.data);
      
      if (!matchDetailResponse.data || !matchDetailResponse.data.success) {
        const errorMsg = matchDetailResponse.data?.error || matchDetailResponse.data?.message || '경기 데이터를 불러올 수 없습니다.';
        throw new Error(errorMsg);
      }
      
      const matchDetail = matchDetailResponse.data.data;
      console.log('매치 상세 정보:', matchDetail);
      console.log('AI 요약 데이터:', matchDetail.ai_summary);
      console.log('디버깅 정보:', matchDetail.debug_info);

      // API 데이터를 화면 표시용 형태로 변환
      const formattedData = {
        playerName: matchDetail.user_info?.user_name || sessionStorage.getItem('userName') || '사용자',
        playerPosition: matchDetail.user_info?.user_position || '포지션 미설정',
        playerRole: matchDetail.match_info?.ground_name || matchDetail.match_info?.name || '경기 분석',
        matchTime: `${matchDetail.match_stats?.total_duration_minutes || 0}분`,
        quarterCount: `${matchDetail.match_stats?.quarter_count || 0}쿼터`,
        maxSpeed: `${matchDetail.match_stats?.max_speed || 0}km/h`,
        totalDistance: `${(matchDetail.match_stats?.total_distance || 0).toFixed(2)}km`,

        aiAnalysis: matchDetail.ai_summary || ['AI 분석이 완료되었습니다.'],
        quarters: (matchDetail.quarters || [])
          .sort((a, b) => {
            // start_time 기준으로 오래된 순(오름차순) 정렬
            const timeA = new Date(a.start_time || 0);
            const timeB = new Date(b.start_time || 0);
            return timeA - timeB;
          })
          .map((quarter, index) => ({
            quarter: index + 1,
            quarter_code: quarter.quarter_code,
            name: quarter.name || `${index + 1}쿼터`,
            duration: quarter.duration || 0,
            actual_move_time: quarter.actual_move_time || 0,  // 실제 이동시간
            status: quarter.status || '완료',
            points: Math.round(quarter.points || 0),
            distance: quarter.distance ? `${quarter.distance.toFixed(2)}km` : '0km',
            max_speed: quarter.max_speed ? `${quarter.max_speed}km/h` : '0km/h',
            start_time: quarter.start_time,  // start_time 정보 보존
            end_time: quarter.end_time,      // end_time 정보 보존
            sprint_count: quarter.sprint_count,  // 스프린트 횟수 보존
            radar_scores: quarter.radar_scores   // 레이더 차트 점수 보존
          })),
        matchInfo: matchDetail.match_info || {}
      };
      
      setMatchData(formattedData);
      
    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
      
      // 상세한 에러 정보 로깅
      if (error.response) {
        console.error('서버 응답 에러:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('네트워크 에러:', error.request);
      } else {
        console.error('요청 에러:', error.message);
      }
      
      // API 실패 시 폴더에서 전달받은 기본 정보라도 표시
      if (passedMatchData) {
        const fallbackData = {
          playerName: sessionStorage.getItem('userName') || '사용자',
          playerRole: passedMatchData.title || '경기 분석',
          matchTime: '분석 중',
          quarterCount: `${passedMatchData.quarter_count || 0}쿼터`,
          maxSpeed: '분석 중',
          totalDistance: '분석 중',
          avgSpeed: '분석 중',
          totalPoints: 0,
          aiAnalysis: ['경기 데이터를 분석 중입니다. 잠시 후 다시 확인해주세요.'],
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
    setActiveQuarter(quarter);
    console.log(`${quarter}쿼터 분석 상세보기`);
    
    // 해당 쿼터 데이터 찾기
    const quarterData = matchData.quarters.find(q => q.quarter === quarter);
    
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
      console.log(`쿼터 ${selectedQuarter.quarter} 이름을 "${newName}"으로 변경`);
      
      // API 호출하여 DB 업데이트
      const response = await UpdateQuarterNameApi(userCode, matchId, selectedQuarter.quarter, newName);
      
      if (response.data.success) {
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
        
        console.log('쿼터 이름이 변경되었습니다.');
      } else {
        throw new Error(response.data.error || '이름 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('이름 변경 실패:', error);
      alert('이름 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 쿼터 삭제
  const handleDelete = async () => {
    if (!selectedQuarter) return;
    
    try {
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      console.log(`쿼터 ${selectedQuarter.quarter} 삭제`);
      
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
        
        console.log('쿼터가 삭제되었습니다.');
      } else {
        throw new Error(response.data.error || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <div className='anal-page'>
        <LogoBellNav showBack={true} onBack={handleBack} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="text-body">분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className='anal-page'>
        <LogoBellNav showBack={true} onBack={handleBack} />
        <div className="error-container">
          <p className="text-body">분석 데이터를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='anal-page'>
      <LogoBellNav showBack={true} onBack={handleBack} />
      
      {/* 페이지 헤더 */}
      <div className="page-header">
        <h1 className="match-title-large text-h1">{matchData.matchInfo?.name || '개인 경기분석'}</h1>
        <p className="match-description text-body">경기 데이터를 요약해 보여줘요</p>
      </div>

      {/* 통합 정보 카드 */}
      <div className="player-info-card">
        <div className="match-info-section">
          <div className="match-info-left">
            <div className="player-profile">
              <div className="player-avatar">
                <img src={getProfileImage(matchData.userCode)} alt="프로필" />
              </div>
              <div className="player-details">
                <p className={`player-position ${getPositionClass(matchData.playerPosition)} text-h3`} >{matchData.playerPosition}</p>
                <h2 className="player-name text-h2">{matchData.playerName}</h2>
              </div>
            </div>
            <div className="match-location text-body">{matchData.playerRole}</div>
            <div className="match-datetime text-body">
              {matchData.matchInfo?.date || '날짜 미정'} {matchData.matchInfo?.time || ''}
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
          <div className="section-icon">
            <img src={starIcon} alt="AI 요약" />
          </div>
          <h3 className="section-title text-h3">AI 요약</h3>
        </div>
        <div className="ai-analysis">
          <ul className="analysis-list">
            {matchData.aiAnalysis && matchData.aiAnalysis.length > 0 ? (
              matchData.aiAnalysis.map((analysis, index) => (
                <li key={index} className="analysis-item text-body">
                  {analysis}
                </li>
              ))
            ) : (
              <li className="analysis-item text-body">
                AI 분석 데이터를 불러오는 중입니다...
              </li>
            )}
          </ul>
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
                      {quarter.duration}분 • {quarter.points}점 • {quarter.distance}
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
                    <img src={dot3Icon} alt="더보기" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          

        </div>
      )}

      {/* 쿼터 액션 모달 */}
      {isModalOpen && selectedQuarter && (
        <MatchActionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          matchData={selectedQuarter}
          matchTitle={selectedQuarter.name}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Anal;
