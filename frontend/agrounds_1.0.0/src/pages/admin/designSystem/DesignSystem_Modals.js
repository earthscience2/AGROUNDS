import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DesignSystem_Modals.scss';

// 아이콘
import backIcon from '../../../assets/main_icons/back_black.png';
import editIcon from '../../../assets/common/ico_edit.png';
import trashIcon from '../../../assets/common/ico_trash.png';
import defaultProfile from '../../../assets/common/default_profile.png';

const DesignSystem_Modals = () => {
  const navigate = useNavigate();

  // 코드 토글 상태
  const [componentCodeCollapsed, setComponentCodeCollapsed] = useState({
    'text-modal': true,
    'option-modal': true,
    'region-modal': true,
    'action-modal': true,
    'rank-modal': true
  });

  const handleBackClick = () => {
    navigate('/app/admin/design-system');
  };

  const toggleComponentCode = (componentId) => {
    setComponentCodeCollapsed(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
  };

  return (
    <div className="design-system-modals">
      <header className="design-header">
        <div className="header-actions">
          <button className="back-btn" onClick={handleBackClick}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
        </div>
        <div className="header-content">
          <h1 className="text-h1">모달 시스템</h1>
          <p className="text-body">사용자 입력 및 선택을 위한 모달 컴포넌트들입니다.</p>
        </div>
      </header>

      <div className="design-container">
        <div className="design-content">
          {/* 모달 시스템 */}
          <div className="component-category">
            <h3>모달 시스템</h3>
            <p className="category-description">
              사용자 입력 및 선택을 위한 모달 컴포넌트들입니다. 
              모든 모달은 흐림 효과(backdrop blur)가 적용된 오버레이 위에 표시되며, 
              접근성 기준(44px 최소 터치 영역)을 준수합니다.
            </p>

            <div className="component-grid modal-grid">
              {/* 텍스트 입력 모달 */}
              <div className="component-item">
                <div className="component-sample">
                  <div className="modal-sample text-modal">
                    <div className="modal-header">
                      <h3 className="modal-title">닉네임 변경</h3>
                      <button className="modal-close">×</button>
                    </div>
                    <div className="modal-body">
                      <input type="text" placeholder="새로운 닉네임을 입력하세요" className="text-input" style={{width: '100%'}} />
                    </div>
                    <div className="modal-footer">
                      <button className="cancel-btn">취소</button>
                      <button className="save-btn">저장</button>
                    </div>
                  </div>
                  
                  <button 
                    className="code-toggle-btn-inner"
                    onClick={() => toggleComponentCode('text-modal')}
                  >
                    {componentCodeCollapsed['text-modal'] ? '코드 보기' : '코드 숨기기'} 
                    <span className={`toggle-icon ${componentCodeCollapsed['text-modal'] ? '' : 'expanded'}`}>▼</span>
                  </button>
                </div>
                <h4>텍스트 입력 모달</h4>
                
                {!componentCodeCollapsed['text-modal'] && (
                  <div className="component-code">
                    <pre><code>{`// 📝 텍스트 입력 모달
<div className="modal-overlay">
  <div className="text-modal">
    <div className="modal-header">
      <h3 className="modal-title">제목</h3>
      <button className="modal-close">×</button>
    </div>
    <div className="modal-body">
      <input type="text" placeholder="입력..." />
    </div>
    <div className="modal-footer">
      <button className="cancel-btn">취소</button>
      <button className="save-btn">저장</button>
    </div>
  </div>
</div>`}</code></pre>
                  </div>
                )}
              </div>

              {/* 옵션 선택 모달 */}
              <div className="component-item">
                <div className="component-sample">
                  <div className="modal-sample option-modal">
                    <div className="modal-header">
                      <h3 className="modal-title">포지션 선택</h3>
                      <button className="modal-close">×</button>
                    </div>
                    <div className="modal-body">
                      <div className="option-list">
                        <button className="option-item">
                          <div className="option-content">
                            <div className="option-color" style={{backgroundColor: '#FF6B6B'}}></div>
                            <span className="option-label">공격수 (FW)</span>
                          </div>
                          <span className="check-icon">✓</span>
                        </button>
                        <button className="option-item">
                          <div className="option-content">
                            <div className="option-color" style={{backgroundColor: '#4ECDC4'}}></div>
                            <span className="option-label">미드필더 (MF)</span>
                          </div>
                        </button>
                        <button className="option-item">
                          <div className="option-content">
                            <div className="option-color" style={{backgroundColor: '#45B7D1'}}></div>
                            <span className="option-label">수비수 (DF)</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="cancel-btn">취소</button>
                      <button className="save-btn">확인</button>
                    </div>
                  </div>
                  
                  <button 
                    className="code-toggle-btn-inner"
                    onClick={() => toggleComponentCode('option-modal')}
                  >
                    {componentCodeCollapsed['option-modal'] ? '코드 보기' : '코드 숨기기'} 
                    <span className={`toggle-icon ${componentCodeCollapsed['option-modal'] ? '' : 'expanded'}`}>▼</span>
                  </button>
                </div>
                <h4>옵션 선택 모달</h4>
                
                {!componentCodeCollapsed['option-modal'] && (
                  <div className="component-code">
                    <pre><code>{`// ☑️ 옵션 선택 모달
<div className="option-list">
  <button className="option-item">
    <div className="option-content">
      <div className="option-color"></div>
      <span className="option-label">옵션명</span>
    </div>
    <span className="check-icon">✓</span>
  </button>
</div>`}</code></pre>
                  </div>
                )}
              </div>

              {/* 지역 선택 모달 */}
              <div className="component-item">
                <div className="component-sample">
                  <div className="modal-sample region-modal">
                    <div className="modal-header">
                      <h3 className="modal-title">지역 선택</h3>
                      <button className="modal-close">×</button>
                    </div>
                    <div className="modal-body">
                      <div className="region-body">
                        <div className="region-columns">
                          <div className="region-column">
                            <div className="region-item selected">서울특별시</div>
                            <div className="region-item">경기도</div>
                            <div className="region-item">인천광역시</div>
                          </div>
                          <div className="region-column">
                            <div className="region-item">강남구</div>
                            <div className="region-item">서초구</div>
                            <div className="region-item">송파구</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="cancel-btn">취소</button>
                      <button className="save-btn">확인</button>
                    </div>
                  </div>
                  
                  <button 
                    className="code-toggle-btn-inner"
                    onClick={() => toggleComponentCode('region-modal')}
                  >
                    {componentCodeCollapsed['region-modal'] ? '코드 보기' : '코드 숨기기'} 
                    <span className={`toggle-icon ${componentCodeCollapsed['region-modal'] ? '' : 'expanded'}`}>▼</span>
                  </button>
                </div>
                <h4>지역 선택 모달</h4>
                
                {!componentCodeCollapsed['region-modal'] && (
                  <div className="component-code">
                    <pre><code>{`// 🗺️ 지역 선택 모달
<div className="region-body">
  <div className="region-columns">
    <div className="region-column">
      <div className="region-item selected">서울특별시</div>
      <div className="region-item">경기도</div>
    </div>
    <div className="region-column">
      <div className="region-item">강남구</div>
      <div className="region-item">서초구</div>
    </div>
  </div>
</div>`}</code></pre>
                  </div>
                )}
              </div>

              {/* 목록 액션 모달 */}
              <div className="component-item">
                <div className="component-sample">
                  <div className="modal-sample action-modal">
                    <div className="modal-header">
                      <h3 className="modal-title">경기 관리</h3>
                      <button className="modal-close">×</button>
                    </div>
                    <div className="modal-body">
                      <div className="action-list">
                        <button className="action-btn">
                          <div className="action-icon">
                            <img src={editIcon} alt="편집" />
                          </div>
                          이름 변경
                        </button>
                        <button className="action-btn danger">
                          <div className="action-icon">
                            <img src={trashIcon} alt="삭제" />
                          </div>
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="code-toggle-btn-inner"
                    onClick={() => toggleComponentCode('action-modal')}
                  >
                    {componentCodeCollapsed['action-modal'] ? '코드 보기' : '코드 숨기기'} 
                    <span className={`toggle-icon ${componentCodeCollapsed['action-modal'] ? '' : 'expanded'}`}>▼</span>
                  </button>
                </div>
                <h4>목록 액션 모달</h4>
                
                {!componentCodeCollapsed['action-modal'] && (
                  <div className="component-code">
                    <pre><code>{`// 🔧 목록 액션 모달
<div className="action-list">
  <button className="action-item edit">
    <span className="action-label">이름 수정</span>
  </button>
  <button className="action-item delete">
    <span className="action-label">삭제</span>
  </button>
</div>`}</code></pre>
                  </div>
                )}
              </div>

              {/* 순위 모달 */}
              <div className="component-item">
                <div className="component-sample">
                  <div className="modal-sample metric-rank-modal">
                    <div className="modal-header">
                      <h3 className="modal-title">전체 경기 - 최고속력 순위</h3>
                      <button className="modal-close">×</button>
                    </div>
                    <div className="modal-content">
                      <div className="rank-tabs">
                        <button className="rank-tab active">최고속력</button>
                        <button className="rank-tab">최고가속도</button>
                        <button className="rank-tab">스프린트</button>
                        <button className="rank-tab">평점</button>
                      </div>
                      <div className="rank-list">
                        <div className="rank-item top-rank">
                          <div className="rank-number">
                            <span className="medal gold">🥇</span>
                          </div>
                          <div className="rank-player-info">
                            <div className="rank-player-avatar">
                              <img src={defaultProfile} alt="이민수" />
                            </div>
                            <div className="rank-player-details">
                              <span className="rank-player-name">이민수</span>
                              <div className="rank-player-meta">
                                <span className="rank-player-position position-striker">ST</span>
                              </div>
                            </div>
                          </div>
                          <div className="rank-value">28.5km/h</div>
                        </div>
                        <div className="rank-item top-rank">
                          <div className="rank-number">
                            <span className="medal silver">🥈</span>
                          </div>
                          <div className="rank-player-info">
                            <div className="rank-player-avatar">
                              <img src={defaultProfile} alt="박지훈" />
                            </div>
                            <div className="rank-player-details">
                              <span className="rank-player-name">박지훈</span>
                              <div className="rank-player-meta">
                                <span className="rank-player-position position-midfielder">CM</span>
                              </div>
                            </div>
                          </div>
                          <div className="rank-value">26.2km/h</div>
                        </div>
                        <div className="rank-item top-rank">
                          <div className="rank-number">
                            <span className="medal bronze">🥉</span>
                          </div>
                          <div className="rank-player-info">
                            <div className="rank-player-avatar">
                              <img src={defaultProfile} alt="김철수" />
                            </div>
                            <div className="rank-player-details">
                              <span className="rank-player-name">김철수</span>
                              <div className="rank-player-meta">
                                <span className="rank-player-position position-striker">RWF</span>
                              </div>
                            </div>
                          </div>
                          <div className="rank-value">24.8km/h</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="code-toggle-btn-inner"
                    onClick={() => toggleComponentCode('rank-modal')}
                  >
                    {componentCodeCollapsed['rank-modal'] ? '코드 보기' : '코드 숨기기'} 
                    <span className={`toggle-icon ${componentCodeCollapsed['rank-modal'] ? '' : 'expanded'}`}>▼</span>
                  </button>
                </div>
                <h4>순위 모달</h4>
                
                {!componentCodeCollapsed['rank-modal'] && (
                  <div className="component-code">
                    <pre><code>{`// 🏆 순위 모달
<div className="rank-tabs">
  <button className="rank-tab active">최고속력</button>
  <button className="rank-tab">스프린트</button>
</div>
<div className="rank-list">
  <div className="rank-item top-rank">
    <div className="rank-number">
      <span className="medal gold">🥇</span>
    </div>
    <div className="rank-player-info">
      <div className="rank-player-avatar">
        <img src={profileImage} alt={name} />
      </div>
      <div className="rank-player-details">
        <span className="rank-player-name">{name}</span>
        <span className="rank-player-position">{position}</span>
      </div>
    </div>
    <div className="rank-value">{value}</div>
  </div>
</div>`}</code></pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystem_Modals;

