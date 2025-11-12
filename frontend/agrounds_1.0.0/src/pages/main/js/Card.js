import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Card.scss';
import { GetUserInfoApi, GetMyTeamInfoApi, GetTeamLogoApi } from '../../../function/api/user/userApi';
import { toPng } from 'html-to-image';

// 카드 배경 이미지 import
import cardBlue from '../../../assets/card/card_blue.png';
import cardGreen from '../../../assets/card/card_green.png';
import cardOrange from '../../../assets/card/card_orange.png';
import cardYellow from '../../../assets/card/card_yellow.png';

// 승인된 아이콘 디렉토리 사용
import logoBlack from '../../../assets/big_icons/logo_black.png';
import logoTextBlack from '../../../assets/text_icon/logo_text_black.png';
import downloadIcon from '../../../assets/main_icons/download_black.png';
import backIcon from '../../../assets/main_icons/back_black.png';
import defaultTeamLogo from '../../../assets/main_icons/team_gray.png';

// 포지션 이미지 import (승인된 big_icons 디렉토리 - 카드용 dot 버전)
import positionCAM from '../../../assets/big_icons/position_CAM_dot.png';
import positionCB from '../../../assets/big_icons/position_CB_dot.png';
import positionCDM from '../../../assets/big_icons/position_CDM_dot.png';
import positionCM from '../../../assets/big_icons/position_CM_dot.png';
import positionGK from '../../../assets/big_icons/position_GK_dot.png';
import positionLB from '../../../assets/big_icons/position_LB_dot.png';
import positionLM from '../../../assets/big_icons/position_LM_dot.png';
import positionLWB from '../../../assets/big_icons/position_LWB_dot.png';
import positionLWF from '../../../assets/big_icons/position_LWF_dot.png';
import positionLWM from '../../../assets/big_icons/position_LWM_dot.png';
import positionRB from '../../../assets/big_icons/position_RB_dot.png';
import positionRM from '../../../assets/big_icons/position_RM_dot.png';
import positionRWB from '../../../assets/big_icons/position_RWB_dot.png';
import positionRWF from '../../../assets/big_icons/position_RWF_dot.png';
import positionRWM from '../../../assets/big_icons/position_RWM_dot.png';
import positionST from '../../../assets/big_icons/position_ST_dot.png';

const Card = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myTeamInfo, setMyTeamInfo] = useState({
    hasTeam: false,
    teamData: null,
    loading: false,
    error: null
  });

  // 카드 배경 색상별 이미지 매핑
  const cardBackgrounds = {
    blue: cardBlue,
    green: cardGreen,
    orange: cardOrange,
    yellow: cardYellow
  };

  // 포지션별 카드 색상 매핑
  const getCardColor = (position) => {
    const positionColorMap = {
      'GK': 'yellow',
      'CB': 'blue', 'LB': 'blue', 'RB': 'blue', 'LWB': 'blue', 'RWB': 'blue',
      'CDM': 'green', 'CM': 'green', 'CAM': 'green', 'LM': 'green', 'RM': 'green', 'LWM': 'green', 'RWM': 'green',
      'LWF': 'orange', 'RWF': 'orange', 'ST': 'orange', 'CF': 'orange'
    };
    return positionColorMap[position] || 'blue';
  };

  // 포지션별 이미지 매핑
  const getPositionImage = (position) => {
    const positionImageMap = {
      'CAM': positionCAM, 'CB': positionCB, 'CDM': positionCDM, 'CM': positionCM,
      'GK': positionGK, 'LB': positionLB, 'LM': positionLM, 'LWB': positionLWB,
      'LWF': positionLWF, 'LWM': positionLWM, 'RB': positionRB, 'RM': positionRM,
      'RWB': positionRWB, 'RWF': positionRWF, 'RWM': positionRWM, 'ST': positionST
    };
    return positionImageMap[position] || positionCB;
  };

  // 이름 길이에 따른 폰트 크기 클래스 반환
  const getNameSizeClass = (name) => {
    if (!name) return '';
    const length = name.length;
    
    if (length <= 4) return 'name-size-xl';
    if (length <= 8) return 'name-size-lg';
    if (length <= 12) return 'name-size-md';
    if (length <= 16) return 'name-size-sm';
    return 'name-size-xs';
  };

  // 팀 이름 길이에 따른 폰트 크기 클래스 반환
  const getTeamNameSizeClass = (name) => {
    if (!name) return '';
    const length = name.length;
    
    if (length <= 4) return 'team-size-xl';
    if (length <= 8) return 'team-size-lg';
    if (length <= 12) return 'team-size-md';
    if (length <= 16) return 'team-size-sm';
    return 'team-size-xs';
  };

  // 나이 계산 함수
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

  // 사용자 데이터 생성 함수
  const createUserData = (userInfo) => ({
    name: userInfo.name || "사용자",
    age: calculateAge(userInfo.birth),
    height: userInfo.height ? `${Math.round(userInfo.height)}cm` : "175cm",
    weight: userInfo.weight ? `${Math.round(userInfo.weight)}kg` : "70kg",
    position: userInfo.preferred_position || "CB",
    gender: userInfo.gender === 'male' ? '남성' : userInfo.gender === 'female' ? '여성' : '남성'
  });

  // 팀 로고 가져오기 함수
  const getTeamLogoUrl = async (teamCode) => {
    if (!teamCode) return defaultTeamLogo;
    
    try {
      const response = await GetTeamLogoApi(teamCode);
      return response.data.exists && response.data.image_url ? response.data.image_url : defaultTeamLogo;
    } catch (error) {
      return defaultTeamLogo;
    }
  };

  // 내 팀 정보 가져오기 함수
  const fetchMyTeamInfo = async (userCode) => {
    if (!userCode) return;

    try {
      setMyTeamInfo(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await GetMyTeamInfoApi(userCode);
      
      if (response.data && response.data.has_team && response.data.team_info) {
        const teamData = response.data.team_info;
        const logoUrl = await getTeamLogoUrl(teamData.team_code);
        
        setMyTeamInfo({
          hasTeam: true,
          teamData: { ...teamData, logo_url: logoUrl },
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

  // 사용자 데이터 로드 함수
  const loadPlayerData = async () => {
    try {
      const userCode = sessionStorage.getItem('userCode');
      if (!userCode) {
        navigate('/app/main');
        return;
      }

      try {
        const response = await GetUserInfoApi(userCode);
        if (response.data) {
          setPlayerData(createUserData(response.data));
          fetchMyTeamInfo(userCode);
        } else {
          throw new Error('사용자 정보를 가져올 수 없습니다.');
        }
      } catch (error) {
        // API 실패 시 세션 스토리지 사용 (fallback)
        const fallbackData = {
          name: sessionStorage.getItem('userName') || '사용자',
          birth: sessionStorage.getItem('userBirth') || '1999-01-01',
          preferred_position: sessionStorage.getItem('userPosition') || 'CB'
        };
        
        setPlayerData(createUserData(fallbackData));
        
        const userCodeFromSession = sessionStorage.getItem('userCode');
        if (userCodeFromSession) {
          fetchMyTeamInfo(userCodeFromSession);
        }
      }
      
      setLoading(false);
    } catch (error) {
      setPlayerData({
        name: "사용자",
        age: 25,
        height: "175cm",
        weight: "70kg",
        position: "CB",
        gender: "남성"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayerData();
  }, [navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;

    const cardElement = cardRef.current;
    const rect = cardElement.getBoundingClientRect();
    const scale = window.devicePixelRatio || 2;

    try {
      const dataUrl = await toPng(cardElement, {
        width: rect.width,
        height: rect.height,
        pixelRatio: scale,
        cacheBust: true
      });

      const link = document.createElement('a');
      const playerName = playerData?.name || 'player';
      link.download = `agrounds_card_${playerName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('card download failed', error);
      alert('카드를 다운로드하는데 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="card-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!playerData) {
    return (
      <div className="card-page">
        <div className="error">플레이어 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const cardColor = getCardColor(playerData.position);
  const cardBackground = cardBackgrounds[cardColor];

  return (
    <div className={`card-page ${playerData ? `bg-${cardColor}` : ''}`}>
      <div className="card-container">
        {/* 상단 로고 및 다운로드 */}
        <div className="top-bar">
          <img src={logoTextBlack} alt="AGROUNDS" className="logo-text" />
          <img 
            src={downloadIcon} 
            alt="다운로드" 
            className="bell-icon" 
            onClick={handleDownloadCard}
          />
        </div>

        {/* 헤더 */}
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={handleBackClick}>
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <div className="empty-space"></div>
          </div>
          <div className="header-content">
            <h1>선수 카드</h1>
          </div>
        </div>

        {/* 선수 카드 */}
        <div className="player-card-container">
          <div 
            ref={cardRef}
            className={`player-card ${cardColor}`}
            style={{ backgroundImage: `url(${cardBackground})` }}
          >
            {/* 카드 상단 - 이름과 기본 정보 */}
            <div className="card-top">
              <div className="left-column">
                <div className="info-box age-box">
                  <p className="player-age">만 {playerData.age}세</p>
                </div>
                <div className="info-box name-box">
                  <h2 className={`player-name ${getNameSizeClass(playerData.name)}`}>
                    {playerData.name}
                  </h2>
                </div>
              </div>
              <div className="right-column">
                <div className="info-box gender-box">
                  <span className="spec-label">{playerData.gender}</span>
                </div>
                <div className="info-box height-box">
                  <span className="spec-value">{playerData.height}</span>
                </div>
                <div className="info-box weight-box">
                  <span className="spec-value">{playerData.weight}</span>
                </div>
              </div>
            </div>

            {/* 카드 중앙 - 포지션 */}
            <div className="card-middle">
              <div className="position-display">
                <span className="position">{playerData.position}</span>
              </div>
              <div className="position-image">
                <img 
                  src={getPositionImage(playerData.position)} 
                  alt={`${playerData.position} 포지션`}
                  className="position-icon"
                />
              </div>
            </div>

            {/* 카드 하단 - 팀 정보 */}
            <div className="card-bottom">
              <div className="info-box logo-box">
                <img src={logoBlack} alt="Agrounds" />
              </div>
              <div className="info-box team-box">
                {myTeamInfo.hasTeam && myTeamInfo.teamData ? (
                  <>
                    <img 
                      src={myTeamInfo.teamData.logo_url || defaultTeamLogo} 
                      alt={myTeamInfo.teamData.name} 
                      className="team-logo"
                      onError={(e) => {
                        e.target.src = defaultTeamLogo;
                      }}
                    />
                    <span className={`team-name ${getTeamNameSizeClass(myTeamInfo.teamData.name)}`}>
                      {myTeamInfo.teamData.name}
                    </span>
                  </>
                ) : (
                  <span className="team-name">AGROUNDS</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;