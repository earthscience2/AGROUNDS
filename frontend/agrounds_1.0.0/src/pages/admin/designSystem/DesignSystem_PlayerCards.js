import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DesignSystem_PlayerCards.scss';

// 아이콘
import backIcon from '../../../assets/main_icons/back_black.png';

const DesignSystem_PlayerCards = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/app/admin/design-system');
  };

  return (
    <div className="design-system-player-cards">
      <header className="design-header">
        <div className="header-actions">
          <button className="back-btn" onClick={handleBackClick}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
        </div>
        <div className="header-content">
          <h1 className="text-h1">선수 카드</h1>
          <p className="text-body">선수 카드, 종목별 최고 선수, 선수 목록, 스코어/랭킹</p>
        </div>
      </header>

      <div className="design-container">
        <div className="design-content">
          <div className="design-section">
            <h2>선수 카드 컴포넌트 시스템</h2>
            <p className="section-description">
              AGROUNDS 선수 정보 표시를 위한 UI 컴포넌트들입니다.
            </p>
            
            <div className="component-list">
              <div className="component-card">
                <h3>🎴 선수 카드</h3>
                <p>포지션별 색상 카드 디자인 (GK:노랑, 수비:파랑, 미드:초록, 공격:주황)</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 2312-2500<br/>
                  📂 컴포넌트 카테고리: 선수카드
                </p>
              </div>

              <div className="component-card">
                <h3>🏆 종목별 최고 선수 카드</h3>
                <p>미니 카드 형태로 종목별 최고 선수 표시</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 2502-2680<br/>
                  📂 컴포넌트 카테고리: 선수카드
                </p>
              </div>

              <div className="component-card">
                <h3>📋 선수 목록 아이템</h3>
                <p>포지션별 스타일링, 통계 표시</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 2682-2880<br/>
                  📂 컴포넌트 카테고리: 선수카드
                </p>
              </div>

              <div className="component-card">
                <h3>⚡ High Box</h3>
                <p>최고 기록 표시 박스</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 2882-3020<br/>
                  📂 컴포넌트 카테고리: 선수카드
                </p>
              </div>

              <div className="component-card">
                <h3>🏅 Rank Box</h3>
                <p>순위 표시 박스</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 3022-3150<br/>
                  📂 컴포넌트 카테고리: 선수카드
                </p>
              </div>

              <div className="component-card">
                <h3>👥 팀 순위표</h3>
                <p>팀별 순위 및 통계 표시</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 3152-3300<br/>
                  📂 컴포넌트 카테고리: 선수카드
                </p>
              </div>
            </div>

            <div className="note-card">
              <h3>💡 구현 안내</h3>
              <p>
                선수 카드 컴포넌트들은 포지션별 스타일링과 복잡한 레이아웃을 포함하고 있습니다. 
                현재는 참조 위치만 표시하며, 실제 컴포넌트는 <code>Admin_DesignSystem.js</code>에서 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystem_PlayerCards;

