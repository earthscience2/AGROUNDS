import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/player_analysis_progress_5.scss';
import ClockBlack from '../../../assets/main_icons/clock_black.png';

const PlayerAnalysisProgress5 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 이전 페이지에서 전달받은 데이터
  const matchName = location.state?.matchName;
  
  // 홈으로 이동
  const handleGoHome = () => {
    navigate('/app/main');
  };
  
  // 내 분석으로 이동
  const handleGoToMyAnalysis = () => {
    navigate('/app/player/analysis');
  };
  
  return (
    <div className='player-analysis-progress-5-page'>
      <LogoBellNav logo={true} />
      
      <div className="progress-container">
        {/* 헤더 */}
        <div className="header">
          <div className="header-content">
            <h1 className="text-h2">분석이 시작되었습니다</h1>
            <p className="subtitle text-body">
              GPS 데이터 분석이 백그라운드에서 진행됩니다
            </p>
          </div>
        </div>
        
        {/* 메인 메시지 */}
        <div className="main-content">
          {/* 성공 아이콘 */}
          <div className="success-illustration">
            <div className="success-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="var(--primary)" fillOpacity="0.1"/>
                <circle cx="40" cy="40" r="32" fill="var(--primary)" fillOpacity="0.2"/>
                <path d="M25 40L35 50L55 30" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="success-animation">
              <div className="circle-ripple"></div>
              <div className="circle-ripple delay-1"></div>
              <div className="circle-ripple delay-2"></div>
            </div>
          </div>
          
          {/* 메시지 */}
          <div className="message-section">
            <h3 className="text-h3">분석 요청이 접수되었습니다</h3>
            {matchName && (
              <p className="text-h4 match-name-display">
                {matchName}
              </p>
            )}
            <p className="text-body">
              경기 데이터 분석이 진행되고 있습니다.<br />
              완료되면 알림으로 안내해드리겠습니다.
            </p>
          </div>
        </div>
        
        
        {/* 예상 소요 시간 */}
        <div className="time-info-card">
          <img src={ClockBlack} alt="시간" className="time-icon" />
          <p className="time-text">
            예상 소요시간: 약 1분~3분
          </p>
        </div>
        
        {/* 액션 버튼 */}
        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={handleGoHome}
          >
            홈으로 이동
          </button>
          <button 
            className="btn-secondary"
            onClick={handleGoToMyAnalysis}
          >
            내 분석 보기
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default PlayerAnalysisProgress5;

