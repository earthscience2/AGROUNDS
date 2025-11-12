import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DesignSystem_Main.scss';

// 아이콘
import backIcon from '../../../assets/main_icons/back_black.png';
import colorIcon from '../../../assets/main_icons/pencil_black.png'; // 색상 아이콘 대용
import iconSystemIcon from '../../../assets/main_icons/search_black.png'; // 아이콘 시스템 대용
import componentIcon from '../../../assets/main_icons/graph_black.png'; // 컴포넌트 대용
import playerCardIcon from '../../../assets/main_icons/team_black.png';
import modalIcon from '../../../assets/main_icons/setting_black.png';

const DesignSystem_Main = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'foundation',
      title: '색상 & 타이포그래피',
      description: 'CSS 변수, 컬러 팔레트, 폰트 시스템, 스페이싱',
      icon: colorIcon,
      path: '/app/admin/design-system/foundation',
      color: '#3b82f6'
    },
    {
      id: 'icons',
      title: '아이콘 시스템',
      description: '모든 아이콘 폴더 및 사용 가이드',
      icon: iconSystemIcon,
      path: '/app/admin/design-system/icons',
      color: '#8b5cf6'
    },
    {
      id: 'analysis',
      title: '분석 컴포넌트',
      description: '레이더 차트, 지표 추이, 이미지 분석, 활동량, 속력/가속도',
      icon: componentIcon,
      path: '/app/admin/design-system/analysis',
      color: '#079669'
    },
    {
      id: 'player-cards',
      title: '선수 카드',
      description: '선수 카드, 종목별 최고 선수, 선수 목록, 스코어/랭킹',
      icon: playerCardIcon,
      path: '/app/admin/design-system/player-cards',
      color: '#f59e0b'
    },
    {
      id: 'modals',
      title: '모달 컴포넌트',
      description: '텍스트 입력, 옵션 선택, 지역 선택 모달',
      icon: modalIcon,
      path: '/app/admin/design-system/modals',
      color: '#ef4444'
    }
  ];

  const handleBackClick = () => {
    navigate('/app/admin/dashboard');
  };

  const handleSectionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="design-system-main">
      {/* 헤더 */}
      <div className="ds-header">
        <div className="header-actions">
          <button className="back-btn" onClick={handleBackClick}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
        </div>
        <div className="header-content">
          <h1 className="text-h1">AGROUNDS 디자인 시스템</h1>
          <p className="text-body">UI/UX 일관성을 위한 통합 디자인 가이드</p>
        </div>
      </div>

      {/* 섹션 그리드 */}
      <div className="ds-sections-grid">
        {sections.map((section) => (
          <div 
            key={section.id}
            className="ds-section-card"
            onClick={() => handleSectionClick(section.path)}
            style={{
              '--section-color': section.color
            }}
          >
            <div className="section-icon">
              <img src={section.icon} alt={section.title} />
            </div>
            <div className="section-content">
              <h2 className="section-title text-h3">{section.title}</h2>
              <p className="section-description text-body">{section.description}</p>
            </div>
            <div className="section-arrow">→</div>
          </div>
        ))}
      </div>

      {/* 정보 섹션 */}
      <div className="ds-info">
        <div className="info-card">
          <h3 className="text-h4">💡 사용 안내</h3>
          <ul className="text-body">
            <li>각 섹션은 독립적으로 탐색 가능합니다</li>
            <li>코드 예시는 실제 프로젝트에서 사용 중인 패턴입니다</li>
            <li>분석 컴포넌트는 실제 API 데이터를 사용합니다</li>
            <li>선수 카드는 포지션별로 확인할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DesignSystem_Main;

