import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DesignSystem_Foundation.scss';

// 아이콘
import backIcon from '../../../assets/main_icons/back_black.png';

const DesignSystem_Foundation = () => {
  const [activeTab, setActiveTab] = useState('colors');
  const [copyText, setCopyText] = useState('');
  const navigate = useNavigate();

  // 복사 기능
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyText(text);
    setTimeout(() => setCopyText(''), 2000);
  };

  // 색상 팔레트
  const colorPalette = {
    brand: [
      { name: 'Primary Dark Green', color: '#055540', usage: '메인 브랜드 색상, 로고', cssVar: '--primary' },
      { name: 'Primary Light Green', color: '#079669', usage: '호버 상태, 액센트', cssVar: '--primary-hover' },
      { name: 'Secondary Green', color: '#0a5d42', usage: '서브 브랜드, 활성 상태', cssVar: '--secondary' },
      { name: 'Accent Gold', color: '#f4a100', usage: 'CTA 버튼, 강조 요소', cssVar: '--accent' }
    ],
    system: [
      { name: 'Text Primary', color: '#262626', usage: '메인 텍스트 색상', cssVar: '--text-primary' },
      { name: 'Text Secondary', color: '#6B7078', usage: '보조 텍스트 색상', cssVar: '--text-secondary' },
      { name: 'Text Disabled', color: '#8A8F98', usage: '비활성 텍스트 색상', cssVar: '--text-disabled' },
      { name: 'Background Primary', color: '#F2F4F6', usage: '페이지 배경', cssVar: '--bg-primary' },
      { name: 'Surface White', color: '#FFFFFF', usage: '카드, 컴포넌트 배경', cssVar: '--bg-surface' },
      { name: 'Border', color: '#E2E8F0', usage: '테두리, 구분선', cssVar: '--border' },
      { name: 'Icon Black', color: '#000000', usage: '아이콘 기본 상태 (main/color icons)', cssVar: '--icon-black' },
      { name: 'Icon Gray', color: '#6B7078', usage: '아이콘 비활성/중립 상태', cssVar: '--icon-gray' },
      { name: 'Icon White', color: '#FFFFFF', usage: '아이콘 다크 배경용', cssVar: '--icon-white' },
      { name: 'Status Green', color: '#079669', usage: '성공, 활성 상태 아이콘', cssVar: '--status-green' },
      { name: 'Status Red', color: '#ef4444', usage: '오류, 경고 상태 아이콘', cssVar: '--status-red' },
      { name: 'Status Yellow', color: '#f59e0b', usage: '주의, 강조 상태 아이콘', cssVar: '--status-yellow' },
      { name: 'Status Blue', color: '#3b82f6', usage: '정보, 알림 상태 아이콘', cssVar: '--status-blue' }
    ],
    semantic: [
      { name: 'Info Blue', color: '#3b82f6', usage: '정보 표시, 링크', cssVar: '--info' },
      { name: 'Warning Orange', color: '#f59e0b', usage: '주의, 경고 상태', cssVar: '--warning' },
      { name: 'Error Red', color: '#ef4444', usage: '오류, 실패 상태', cssVar: '--error' }
    ]
  };

  // 타이포그래피
  const typography = [
    { name: 'Display', size: '48px', weight: '800', lineHeight: '1.1', usage: '메인 제목, 사용자 이름', cssClass: 'text-display', 
      font: 'Paperlogy-8ExtraBold (CDN)', sampleEn: 'Agrounds Design System', sampleKo: '에이그라운즈 디자인 시스템' },
    { name: 'Heading 1', size: '32px', weight: '800', lineHeight: '1.2', usage: '페이지 제목', cssClass: 'text-h1',
      font: 'Paperlogy-8ExtraBold (CDN)', sampleEn: 'Welcome to Agrounds', sampleKo: '에이그라운즈에 오신 것을 환영합니다' },
    { name: 'Heading 2', size: '24px', weight: '800', lineHeight: '1.3', usage: '섹션 제목', cssClass: 'text-h2',
      font: 'Paperlogy-8ExtraBold (CDN)', sampleEn: 'Typography System', sampleKo: '타이포그래피 시스템' },
    { name: 'Heading 3', size: '20px', weight: '600', lineHeight: '1.4', usage: '하위 섹션 제목', cssClass: 'text-h3',
      font: 'Pretendard (CDN)', sampleEn: 'Component Guidelines', sampleKo: '컴포넌트 가이드라인' },
    { name: 'Heading 4', size: '18px', weight: '600', lineHeight: '1.4', usage: '카드 제목', cssClass: 'text-h4',
      font: 'Pretendard (CDN)', sampleEn: 'Team Statistics', sampleKo: '팀 통계' },
    { name: 'Body Large', size: '16px', weight: '400', lineHeight: '1.5', usage: '본문 텍스트', cssClass: 'text-body-lg',
      font: 'Pretendard (CDN)', sampleEn: 'This is a large body text for important content.', sampleKo: '중요한 내용을 위한 큰 본문 텍스트입니다.' },
    { name: 'Body', size: '14px', weight: '400', lineHeight: '1.5', usage: '일반 텍스트', cssClass: 'text-body',
      font: 'Pretendard (CDN)', sampleEn: 'Regular body text for general content and descriptions.', sampleKo: '일반적인 내용과 설명을 위한 기본 본문 텍스트입니다.' },
    { name: 'Body Small', size: '12px', weight: '400', lineHeight: '1.4', usage: '설명 텍스트', cssClass: 'text-body-sm',
      font: 'Pretendard (CDN)', sampleEn: 'Small text for additional information.', sampleKo: '추가 정보를 위한 작은 텍스트입니다.' },
    { name: 'Caption', size: '11px', weight: '400', lineHeight: '1.3', usage: '라벨, 단위', cssClass: 'text-caption',
      font: 'Pretendard (CDN)', sampleEn: 'Caption text for labels', sampleKo: '라벨용 캡션 텍스트' }
  ];

  // 간격 시스템
  const spacingSystem = {
    micro: [
      { name: 'xs', value: '4px', usage: '아이콘 간격, 작은 요소 마진', cssVar: '--spacing-xs', 
        examples: ['체크박스-라벨 간격', '아이콘 내부 패딩', '미세 조정'] },
      { name: 'sm', value: '8px', usage: '버튼 내부 간격, 태그 간격', cssVar: '--spacing-sm',
        examples: ['색상 버튼 gap', '태그 간격', '폼 요소 간격'] },
      { name: 'md', value: '12px', usage: '기본 요소 간격', cssVar: '--spacing-md',
        examples: ['input 패딩', '카드 내부 간격', '리스트 아이템 간격'] }
    ],
    component: [
      { name: 'lg', value: '16px', usage: '컴포넌트 내부 패딩', cssVar: '--spacing-lg',
        examples: ['카드 패딩', '버튼 패딩', '컴포넌트 gap'] },
      { name: 'xl', value: '20px', usage: '컴포넌트 간 여백', cssVar: '--spacing-xl',
        examples: ['아이콘 그리드 gap', '폴더 섹션 간격', '컴포넌트 마진'] },
      { name: '2xl', value: '24px', usage: '섹션 내부 간격', cssVar: '--spacing-2xl',
        examples: ['카테고리 간격', '그리드 gap', '섹션 패딩'] }
    ],
    layout: [
      { name: '3xl', value: '32px', usage: '큰 섹션 간격', cssVar: '--spacing-3xl',
        examples: ['주요 섹션 마진', '컨테이너 패딩', '레이아웃 간격'] },
      { name: '4xl', value: '40px', usage: '페이지 레벨 간격', cssVar: '--spacing-4xl',
        examples: ['페이지 상단/하단', '메인 컨테이너', '큰 구분선'] },
      { name: '5xl', value: '60px', usage: '헤더/섹션 간격', cssVar: '--spacing-5xl',
        examples: ['헤더 패딩', '메인 섹션 구분', '페이지 여백'] }
    ]
  };

  // 레이아웃 시스템
  const layoutSystem = {
    containers: [
      { name: 'Header Container', maxWidth: '1200px', usage: '헤더 콘텐츠 영역', cssClass: 'header-content' },
      { name: 'Main Container', maxWidth: '1400px', usage: '메인 디자인 컨테이너', cssClass: 'design-container' },
      { name: 'Content Container', maxWidth: '100%', usage: '플렉스 기반 콘텐츠', cssClass: 'design-content' }
    ],
    grids: [
      { name: 'Small Grid', columns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', usage: '아이콘, 작은 카드 요소', 
        examples: ['아이콘 그리드', '작은 컴포넌트', '간단한 목록'] },
      { name: 'Standard Grid', columns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', usage: '일반적인 카드, 콘텐츠', 
        examples: ['색상 팔레트', '컴포넌트 카드', '간격 시스템', '가이드라인'] },
      { name: 'Two Column Grid', columns: 'repeat(2, 1fr)', gap: '20px', usage: '고정 2컬럼 비교 레이아웃', 
        examples: ['차트 비교', '이미지 갤러리', 'Before/After'] }
    ],
    breakpoints: [
      { name: 'Mobile', value: '768px', description: '모바일 디바이스', usage: '1컬럼 레이아웃으로 변경' },
      { name: 'Tablet', value: '968px', description: '태블릿/소형 데스크톱', usage: '차트 그리드 전용 브레이크포인트' },
      { name: 'Desktop', value: '1400px', description: '데스크톱', usage: '메인 컨테이너 최대 너비' }
    ]
  };

  const handleBackClick = () => {
    navigate('/app/admin/design-system');
  };

  const renderColorSection = () => (
    <div className="design-section">
      <h2>색상 시스템</h2>
      <p className="section-description">
        AGROUNDS의 일관된 디자인을 위한 통합 색상 시스템입니다. <br/>
        <strong>브랜드 색상</strong>, <strong>시스템 색상</strong>, <strong>의미 색상</strong>으로 구성되어 체계적인 색상 활용을 지원합니다.
      </p>
      
      {Object.entries(colorPalette).map(([category, colors]) => (
        <div key={category} className="color-category">
          <h3>
            {category === 'brand' ? '🎨 브랜드 색상' : 
             category === 'system' ? '🔧 시스템 색상 (텍스트, 배경, 아이콘)' : 
             '🔖 의미 색상'}
          </h3>
          <div className="color-grid">
            {colors.map((color, index) => (
              <div key={index} className="color-item">
                <div 
                  className={`color-swatch ${color.color === '#FFFFFF' ? 'white-swatch' : ''}`}
                  style={{ backgroundColor: color.color }}
                  onClick={() => copyToClipboard(color.color)}
                  title="클릭하여 복사"
                ></div>
                <div className="color-info">
                  <h4>{color.name}</h4>
                  <div className="color-codes">
                    <code 
                      className="color-code hex" 
                      onClick={() => copyToClipboard(color.color)}
                    >
                      {color.color}
                    </code>
                    {color.cssVar && (
                      <code 
                        className="color-code css-var"
                        onClick={() => copyToClipboard(`var(${color.cssVar})`)}
                      >
                        {color.cssVar}
                      </code>
                    )}
                  </div>
                  <p className="color-usage">{color.usage}</p>
                  {copyText === color.color && <span className="copy-feedback">복사됨!</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="usage-example">
        <h3>💡 사용 예제</h3>
        <div className="code-example">
          <pre><code>{`/* 새로운 브랜드 색상 시스템 */
.primary-button {
  background-color: var(--primary);      /* #055540 - 다크 그린 */
  color: var(--bg-surface);              /* #FFFFFF */
}

.primary-button:hover {
  background-color: var(--primary-hover); /* #079669 - 라이트 그린 */
}

/* 통합 아이콘 색상 시스템 */
.icon-default { color: var(--icon-black); }
.icon-inactive { color: var(--icon-gray); }
.icon-on-dark { color: var(--icon-white); }

/* 상태별 아이콘 색상 */
.status-success { color: var(--status-green); }
.status-error { color: var(--status-red); }
.status-warning { color: var(--status-yellow); }
.status-info { color: var(--status-blue); }`}</code></pre>
        </div>
      </div>
    </div>
  );

  const renderTypographySection = () => (
    <div className="design-section">
      <h2>타이포그래피</h2>
      <p className="section-description">읽기 쉽고 일관된 텍스트 계층 구조를 제공합니다. 한글과 영문 모두에 최적화되어 있습니다.</p>
      
      <div className="typography-grid">
        {typography.map((typo, index) => (
          <div key={index} className="typography-item">
            <div className="typography-samples">
              <div 
                className={`typography-sample korean ${typo.cssClass}`}
                style={{ 
                  fontSize: typo.size, 
                  fontWeight: typo.weight,
                  lineHeight: typo.lineHeight,
                  fontFamily: typo.font.includes('Paperlogy') ? "'Paperlogy-8ExtraBold', sans-serif" : "'Pretendard', sans-serif"
                }}
              >
                {typo.sampleKo}
              </div>
              <div 
                className={`typography-sample english ${typo.cssClass}`}
                style={{ 
                  fontSize: typo.size, 
                  fontWeight: typo.weight,
                  lineHeight: typo.lineHeight,
                  fontFamily: typo.font.includes('Paperlogy') ? "'Paperlogy-8ExtraBold', sans-serif" : "'Pretendard', sans-serif"
                }}
              >
                {typo.sampleEn}
              </div>
            </div>
            <div className="typography-info">
              <h4>{typo.name}</h4>
              <div className="typography-specs">
                <span>폰트: {typo.font}</span>
                <span>크기: {typo.size}</span>
                <span>굵기: {typo.weight}</span>
                <span>행간: {typo.lineHeight}</span>
              </div>
              <code className="css-class" onClick={() => copyToClipboard(`.${typo.cssClass}`)}>
                .{typo.cssClass}
              </code>
              <p className="usage">{typo.usage}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="usage-example">
        <h3>💡 사용 예제</h3>
        <div className="code-example">
          <pre><code>{`<!-- 브랜드 폰트 (Paperlogy-8ExtraBold) 사용 -->
<h1 class="text-display">디스플레이 텍스트</h1>
<h2 class="text-h2">섹션 제목</h2>

<!-- 텍스트 폰트 (Pretendard) 사용 -->
<h3 class="text-h3">하위 제목</h3>
<p class="text-body">본문 텍스트입니다.</p>
<span class="text-caption">캡션 텍스트</span>`}</code></pre>
        </div>
      </div>
    </div>
  );

  const renderSpacingSection = () => (
    <div className="design-section">
      <h2>간격 시스템</h2>
      <p className="section-description">
        AGROUNDS 디자인 페이지에서 실제로 사용되는 간격을 분석하여 체계화한 간격 시스템입니다. <br/>
        <strong>마이크로 간격</strong>, <strong>컴포넌트 간격</strong>, <strong>레이아웃 간격</strong>으로 구분하여 일관된 공간 설계를 지원합니다.
      </p>
      
      {Object.entries(spacingSystem).map(([category, spacings]) => (
        <div key={category} className="spacing-category">
          <h3>
            {category === 'micro' ? '🔬 마이크로 간격' : 
             category === 'component' ? '🧩 컴포넌트 간격' : 
             '📐 레이아웃 간격'}
          </h3>
          <div className="spacing-grid">
            {spacings.map((space, index) => (
              <div key={index} className="spacing-item">
                <div className="spacing-visual">
                  <div 
                    className="spacing-sample" 
                    style={{ width: space.value, height: space.value }}
                  ></div>
                  <div className="spacing-label">{space.value}</div>
                </div>
                <div className="spacing-info">
                  <h4>spacing-{space.name}</h4>
                  <p className="spacing-usage">{space.usage}</p>
                  <code className="spacing-var" onClick={() => copyToClipboard(`var(${space.cssVar})`)}>
                    {space.cssVar}
                  </code>
                  <div className="spacing-examples">
                    {space.examples.map((example, idx) => (
                      <span key={idx} className="example-tag">{example}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="usage-example">
        <h3>💡 사용 예제</h3>
        <div className="code-example">
          <pre><code>{`/* 마이크로 간격 (4-12px) */
.color-buttons {
  gap: var(--spacing-sm);        /* 8px */
}

/* 컴포넌트 간격 (16-24px) */
.component-sample {
  padding: var(--spacing-2xl);   /* 24px */
}

/* 레이아웃 간격 (32-60px) */
.design-container {
  padding: var(--spacing-4xl);   /* 40px */
}`}</code></pre>
        </div>
      </div>
    </div>
  );

  const renderLayoutSection = () => (
    <div className="design-section">
      <h2>레이아웃 시스템</h2>
      <p className="section-description">
        AGROUNDS 디자인 페이지에서 실제로 사용되는 레이아웃 패턴을 분석하여 체계화한 레이아웃 시스템입니다. <br/>
        <strong>컨테이너</strong>, <strong>그리드 시스템</strong>, <strong>브레이크포인트</strong>로 구성되어 유연하고 일관된 레이아웃을 제공합니다.
      </p>
      
      <div className="layout-category">
        <h3>📦 컨테이너 시스템</h3>
        <div className="container-showcase">
          {layoutSystem.containers.map((container, index) => (
            <div key={index} className="container-item">
              <div className="container-visual" style={{ maxWidth: container.maxWidth === '100%' ? '100%' : container.maxWidth }}>
                <div className="container-content">
                  <span className="container-name">{container.name}</span>
                  <span className="container-width">{container.maxWidth}</span>
                </div>
              </div>
              <div className="container-info">
                <h4>{container.name}</h4>
                <p>{container.usage}</p>
                <code className="css-class" onClick={() => copyToClipboard(`.${container.cssClass}`)}>
                  .{container.cssClass}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="layout-category">
        <h3>🎯 그리드 시스템</h3>
        <div className="grid-showcase">
          {layoutSystem.grids.map((grid, index) => (
            <div key={index} className="grid-item">
              <div className="grid-visual">
                <div className="grid-demo-container">
                  <div className="grid-pattern" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: grid.name === 'Two Column Grid' ? 'repeat(2, 1fr)' :
                                        grid.name === 'Small Grid' ? 'repeat(4, 1fr)' :
                                        'repeat(3, 1fr)',
                    gap: '8px' 
                  }}>
                    {Array.from({ length: grid.name === 'Two Column Grid' ? 2 : 
                                           grid.name === 'Small Grid' ? 4 : 3 }, (_, i) => (
                      <div key={i} className="grid-cell">{i + 1}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid-info">
                <h4>{grid.name}</h4>
                <p className="grid-usage">{grid.usage}</p>
                <div className="grid-specs">
                  <code className="grid-columns" onClick={() => copyToClipboard(grid.columns)}>
                    {grid.columns}
                  </code>
                  <code className="grid-gap" onClick={() => copyToClipboard(`gap: ${grid.gap}`)}>
                    gap: {grid.gap}
                  </code>
                </div>
                <div className="grid-examples">
                  <span className="examples-label">사용 예:</span>
                  {grid.examples.map((example, idx) => (
                    <span key={idx} className="example-tag">{example}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="layout-category">
        <h3>📱 브레이크포인트</h3>
        <div className="breakpoint-showcase">
          {layoutSystem.breakpoints.map((bp, index) => (
            <div key={index} className="breakpoint-item">
              <div className="breakpoint-visual">
                <div className={`device-demo ${bp.name.toLowerCase()}`}>
                  <span className="device-label">{bp.name}</span>
                  <span className="device-size">{bp.value}</span>
                </div>
              </div>
              <div className="breakpoint-info">
                <h4>{bp.name}</h4>
                <p className="breakpoint-desc">{bp.description}</p>
                <p className="breakpoint-usage">{bp.usage}</p>
                <code className="breakpoint-code" onClick={() => copyToClipboard(`@media (max-width: ${bp.value})`)}>
                  @media (max-width: {bp.value})
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'colors': return renderColorSection();
      case 'typography': return renderTypographySection();
      case 'spacing': return renderSpacingSection();
      case 'layout': return renderLayoutSection();
      default: return renderColorSection();
    }
  };

  return (
    <div className="design-system-foundation">
      <header className="design-header">
        <div className="header-actions">
          <button className="back-btn" onClick={handleBackClick}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
        </div>
        <div className="header-content">
          <h1 className="text-h1">색상 &amp; 타이포그래피</h1>
          <p className="text-body">기본 디자인 토큰 시스템</p>
        </div>
      </header>

      <div className="design-container">
        <nav className="design-nav" aria-label="Foundation 섹션 탭">
          <ul role="tablist">
            <li 
              className={activeTab === 'colors' ? 'active' : ''}
              onClick={() => setActiveTab('colors')}
              role="tab"
              aria-selected={activeTab === 'colors'}
            >
              색상
            </li>
            <li 
              className={activeTab === 'typography' ? 'active' : ''}
              onClick={() => setActiveTab('typography')}
              role="tab"
              aria-selected={activeTab === 'typography'}
            >
              타이포그래피
            </li>
            <li 
              className={activeTab === 'spacing' ? 'active' : ''}
              onClick={() => setActiveTab('spacing')}
              role="tab"
              aria-selected={activeTab === 'spacing'}
            >
              간격
            </li>
            <li 
              className={activeTab === 'layout' ? 'active' : ''}
              onClick={() => setActiveTab('layout')}
              role="tab"
              aria-selected={activeTab === 'layout'}
            >
              레이아웃
            </li>
          </ul>
        </nav>

        <main className="design-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DesignSystem_Foundation;

