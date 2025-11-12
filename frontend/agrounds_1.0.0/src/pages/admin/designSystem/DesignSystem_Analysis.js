import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DesignSystem_Analysis.scss';

// 아이콘
import backIcon from '../../../assets/main_icons/back_black.png';

const DesignSystem_Analysis = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/app/admin/design-system');
  };

  return (
    <div className="design-system-analysis">
      <header className="design-header">
        <div className="header-actions">
          <button className="back-btn" onClick={handleBackClick}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
        </div>
        <div className="header-content">
          <h1 className="text-h1">분석 컴포넌트</h1>
          <p className="text-body">레이더 차트, 지표 추이, 이미지 분석, 활동량, 속력/가속도</p>
        </div>
      </header>

      <div className="design-container">
        <div className="design-content">
          <div className="design-section">
            <h2>분석 컴포넌트 시스템</h2>
            <p className="section-description">
              AGROUNDS 분석 플랫폼에서 사용되는 분석 관련 UI 컴포넌트들입니다.
            </p>
            
            <div className="component-list">
              <div className="component-card">
                <h3>🎯 레이더 차트</h3>
                <p>6각형 레이더 차트 (0~100 범위, 중앙 OVR 표시)</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 1349-1450<br/>
                  📂 컴포넌트 카테고리: 분석관련
                </p>
              </div>

              <div className="component-card">
                <h3>📈 지표 추이</h3>
                <p>4개 지표의 미니 라인 차트 (평점, 이동거리, 최고속력, 스프린트)</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 1452-1580<br/>
                  📂 컴포넌트 카테고리: 분석관련
                </p>
              </div>

              <div className="component-card">
                <h3>🗺️ 이미지 분석</h3>
                <p>히트맵, 스프린트맵, 방향전환맵 (3개 탭)</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 1582-1950<br/>
                  📂 컴포넌트 카테고리: 분석관련
                </p>
              </div>

              <div className="component-card">
                <h3>📊 활동량 막대 그래프</h3>
                <p>공수 비율 바, 전체/공격/수비 탭별 상세 통계</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 1952-2130<br/>
                  📂 컴포넌트 카테고리: 분석관련
                </p>
              </div>

              <div className="component-card">
                <h3>⚡ 속력 및 가속도 그래프</h3>
                <p>평균 속력/가속도 그래프, 최고/평균 속력/가속도 통계</p>
                <p className="component-note">
                  📍 위치: Admin_DesignSystem.js 라인 2132-2310<br/>
                  📂 컴포넌트 카테고리: 분석관련
                </p>
              </div>
            </div>

            <div className="note-card">
              <h3>💡 구현 안내</h3>
              <p>
                분석 컴포넌트들은 복잡한 데이터 시각화와 상태 관리를 포함하고 있습니다. 
                현재는 참조 위치만 표시하며, 실제 컴포넌트는 <code>Admin_DesignSystem.js</code>에서 확인할 수 있습니다.
              </p>
              <p>
                향후 각 컴포넌트를 독립적인 파일로 분리하고, 재사용 가능한 라이브러리로 구성할 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystem_Analysis;

