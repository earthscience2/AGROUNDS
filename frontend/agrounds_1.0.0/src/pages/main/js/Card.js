import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Card.scss';
import { GetUserInfoApi } from '../../../function/api/user/userApi';

// 카드 배경 이미지 import
import cardBlue from '../../../assets/card/card_blue.png';
import cardGreen from '../../../assets/card/card_green.png';
import cardOrange from '../../../assets/card/card_orange.png';
import cardYellow from '../../../assets/card/card_yellow.png';

// 로고 이미지 import
import agroundsLogo from '../../../assets/common/agrounds_circle_logo.png';
import blackLogo from '../../../assets/logo/black_logo.png';
import leftIcon from '../../../assets/common/left.png';

// 포지션 이미지 import
import positionCAM from '../../../assets/position/position_CAM.png';
import positionCB from '../../../assets/position/position_CB.png';
import positionCDM from '../../../assets/position/position_CDM.png';
import positionCM from '../../../assets/position/position_CM.png';
import positionGK from '../../../assets/position/position_GK.png';
import positionLB from '../../../assets/position/position_LB.png';
import positionLM from '../../../assets/position/position_LM.png';
import positionLWB from '../../../assets/position/position_LWB.png';
import positionLWF from '../../../assets/position/position_LWF.png';
import positionLWM from '../../../assets/position/position_LWM.png';
import positionRB from '../../../assets/position/position_RB.png';
import positionRM from '../../../assets/position/position_RM.png';
import positionRWB from '../../../assets/position/position_RWB.png';
import positionRWF from '../../../assets/position/position_RWF.png';
import positionRWM from '../../../assets/position/position_RWM.png';
import positionST from '../../../assets/position/position_ST.png';

const Card = () => {
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      'CB': 'blue', 
      'LB': 'blue',
      'RB': 'blue',
      'LWB': 'blue',
      'RWB': 'blue',
      'CDM': 'green',
      'CM': 'green',
      'CAM': 'green',
      'LM': 'green',
      'RM': 'green',
      'LWM': 'green',
      'RWM': 'green',
      'LWF': 'orange',
      'RWF': 'orange',
      'ST': 'orange',
      'CF': 'orange'
    };
    return positionColorMap[position] || 'blue';
  };

  // 포지션별 이미지 매핑
  const getPositionImage = (position) => {
    const positionImageMap = {
      'CAM': positionCAM,
      'CB': positionCB,
      'CDM': positionCDM,
      'CM': positionCM,
      'GK': positionGK,
      'LB': positionLB,
      'LM': positionLM,
      'LWB': positionLWB,
      'LWF': positionLWF,
      'LWM': positionLWM,
      'RB': positionRB,
      'RM': positionRM,
      'RWB': positionRWB,
      'RWF': positionRWF,
      'RWM': positionRWM,
      'ST': positionST
    };
    return positionImageMap[position] || positionCB; // 기본값은 CB
  };

  useEffect(() => {
    // 선수 데이터 로드
    const loadPlayerData = async () => {
      try {
        // 사용자 로그인 확인
        const userCode = sessionStorage.getItem('userCode');
        if (!userCode) {
          // 로그인하지 않은 경우 메인 페이지로 리다이렉트
          navigate('/app/main');
          return;
        }

        // 실제 API를 사용하여 사용자 정보 조회
        console.log('사용자 코드:', userCode);
        try {
          const response = await GetUserInfoApi(userCode);
          console.log('사용자 정보 API 응답:', response);
          
          if (response.data) {
            const userInfo = response.data;
            console.log('사용자 정보:', userInfo);
            
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

            const userData = {
              name: userInfo.name || "사용자",
              age: calculateAge(userInfo.birth),
              height: userInfo.height ? `${Math.round(userInfo.height)}cm` : "175cm",
              weight: userInfo.weight ? `${Math.round(userInfo.weight)}kg` : "70kg",
              position: userInfo.preferred_position || "CB",
              team: null, // V3에서는 아직 팀 기능이 없으므로 null
              gender: userInfo.gender === 'male' ? '남성' : userInfo.gender === 'female' ? '여성' : '남성'
            };
            
            setPlayerData(userData);
          } else {
            throw new Error('사용자 정보를 가져올 수 없습니다.');
          }
        } catch (error) {
          console.error('사용자 정보 API 호출 실패:', error);
          // API 실패 시 세션 스토리지 사용 (fallback)
          const response = { data: {
            name: sessionStorage.getItem('userName') || '사용자',
            birth: sessionStorage.getItem('userBirth') || '1999-01-01',
            preferred_position: sessionStorage.getItem('userPosition') || 'CB'
          }};
          console.log('세션 데이터 응답 (fallback):', response);
        
          if (response.data) {
            const userInfo = response.data;
            console.log('사용자 정보 (fallback):', userInfo);
            
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

            const userData = {
              name: userInfo.name || "사용자",
              age: calculateAge(userInfo.birth),
              height: userInfo.height ? `${Math.round(userInfo.height)}cm` : "175cm",
              weight: userInfo.weight ? `${Math.round(userInfo.weight)}kg` : "70kg",
              position: userInfo.preferred_position || "CB",
              team: null, // V3에서는 아직 팀 기능이 없으므로 null
              gender: userInfo.gender === 'male' ? '남성' : userInfo.gender === 'female' ? '여성' : '남성'
            };
            
            setPlayerData(userData);
          } else {
            // API 응답이 없는 경우 기본값
            const defaultData = {
              name: "사용자",
              age: 25,
              height: "175cm",
              weight: "70kg",
              position: "CB",
              team: null,
              gender: "남성"
            };
            setPlayerData(defaultData);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('플레이어 데이터 로드 실패:', error);
        
        // 오류 발생 시 기본값으로 설정
        const defaultData = {
          name: "사용자",
          age: 25,
          height: "175cm",
          weight: "70kg",
          position: "CB",
          team: null,
          gender: "남성"
        };
        setPlayerData(defaultData);
        setLoading(false);
      }
    };

    loadPlayerData();
  }, [navigate]);

  const handleBackClick = () => {
    navigate(-1);
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
      {/* 헤더 */}
      <div className="card-header">
        <button className="back-button" onClick={handleBackClick}>
          <img src={leftIcon} alt="뒤로가기" />
        </button>
        <h1>선수 카드</h1>
      </div>

      {/* 선수 카드 */}
      <div className="player-card-container">
        <div 
          className={`player-card ${cardColor}`}
          style={{ backgroundImage: `url(${cardBackground})` }}
        >
          {/* 카드 상단 - 이름과 기본 정보 */}
          <div className="card-top">
            <div className="player-info">
              <h2 className="player-name">{playerData.name}</h2>
              <p className="player-age">만 {playerData.age}세</p>
            </div>
            <div className="player-specs">
              <div className="spec-item">
                <span className="spec-label">{playerData.gender}</span>
              </div>
              <div className="spec-item">
                <span className="spec-value">{playerData.height}</span>
              </div>
              <div className="spec-item">
                <span className="spec-value">{playerData.weight}</span>
              </div>
            </div>
          </div>

          {/* 카드 중앙 - 포지션 */}
          <div className="card-middle">
            <div className="position-display">
              <span className="position">{playerData.position}</span>
            </div>
            {/* 포지션 이미지 */}
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
            <div className="agrounds-logo">
              <img src={blackLogo} alt="Agrounds" />
            </div>
            {playerData.team ? (
              <div className="team-info">
                {playerData.team.logo && (
                  <img src={playerData.team.logo} alt={playerData.team.name} className="team-logo" />
                )}
                <span className="team-name">{playerData.team.name}</span>
              </div>
            ) : (
              <div className="team-info">
                <span className="team-name">AGROUNDS</span>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Card;
