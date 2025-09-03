import React, { useState } from 'react';
import '../css/Design.scss';

// 모든 assets 이미지들을 폴더별로 import
// Common 폴더 이미지들
import agroundsCircleLogo from '../../../assets/common/agrounds_circle_logo.png';
import agroundsLogo from '../../../assets/common/Agrounds_logo.png';
import appleLogo from '../../../assets/common/apple-logo.png';
import bellIcon from '../../../assets/common/bell.png';
import btnPlusIcon from '../../../assets/common/btn_plus.png';
import cameraIcon from '../../../assets/common/camera.png';
import cardBlue from '../../../assets/common/card-blue.png';
import cardGreen from '../../../assets/common/card-green.png';
import cardRed from '../../../assets/common/card-red.png';
import cardYellow from '../../../assets/common/card-yellow.png';
import checkGreen from '../../../assets/common/check_green.png';
import checkIcon from '../../../assets/common/check.png';
import clockIcon from '../../../assets/common/clock.png';
import cogIcon from '../../../assets/common/cog.png';
import connectBlack from '../../../assets/common/connect-black.png';
import connectGrey from '../../../assets/common/connect-grey.png';
import defaultProfile from '../../../assets/common/default_profile.png';
import defaultTeamLogo from '../../../assets/common/default-team-logo.png';
import deviceIcon from '../../../assets/common/device.png';
import dot3Icon from '../../../assets/common/dot3.png';
import dotsIcon from '../../../assets/common/dots.png';
import downIcon from '../../../assets/common/down.png';
import downloadIcon from '../../../assets/common/download.png';
import ellipseBlue from '../../../assets/common/Ellipse-blue.png';
import ellipseGreen from '../../../assets/common/Ellipse-green.png';
import ellipseRed from '../../../assets/common/Ellipse-red.png';
import ellipseYellow from '../../../assets/common/Ellipse-yellow.png';
import exclamationCircle from '../../../assets/common/exclamation-circle.png';
import eyeOffIcon from '../../../assets/common/eye-off.png';
import eyeIcon from '../../../assets/common/eye.png';
import folderIcon from '../../../assets/common/folder.png';
import graphBlackIcon from '../../../assets/common/graph-black.png';
import graphGreyIcon from '../../../assets/common/graph-grey.png';
import greenCheckIcon from '../../../assets/common/green-check.png';
import greyCheckIcon from '../../../assets/common/grey-check.png';
import homeBlackIcon from '../../../assets/common/home-black.png';
import homeGreyIcon from '../../../assets/common/home-grey.png';
import icoCheck from '../../../assets/common/ico_check.png';
import editIcon from '../../../assets/common/ico_edit.png';
import icoGroundLeft from '../../../assets/common/ico_ground-left.png';
import icoGroundRight from '../../../assets/common/ico_ground-right.png';
import icoPaper from '../../../assets/common/ico_paper.png';
import trashIcon from '../../../assets/common/ico_trash.png';
import illCheck from '../../../assets/common/ill_check.png';
import illNote from '../../../assets/common/ill_note.png';
import illustGround from '../../../assets/common/illust_ground.png';
import infoIcon from '../../../assets/common/info.png';
import kakaoIcon from '../../../assets/common/kakao.png';
import leftWhiteIcon from '../../../assets/common/left-white.png';
import leftIcon from '../../../assets/common/left.png';
import locationNoback from '../../../assets/common/location_noback.png';
import locationIcon from '../../../assets/common/location.png';
import lockIcon from '../../../assets/common/lock.png';
import logoButtom from '../../../assets/common/logo_buttom.png';
import logoSample from '../../../assets/common/logo_sample.png';
import manIcon from '../../../assets/common/man.png';
import nicknameErrorTooltip from '../../../assets/common/nickname-error-tooltip.png';
import onboardBg from '../../../assets/common/onboard_bg.png';
import ovrIcon from '../../../assets/common/ovr.png';
import pencilIcon from '../../../assets/common/pencil.png';
import playlistIcon from '../../../assets/common/playlist.png';
import polygonIcon from '../../../assets/common/polygon.png';
import rankBlue from '../../../assets/common/rank-blue.png';
import rankGreen from '../../../assets/common/rank-green.png';
import rankRed from '../../../assets/common/rank-red.png';
import rankYellow from '../../../assets/common/rank-yellow.png';
import reloadIcon from '../../../assets/common/reload.png';
import rightIcon from '../../../assets/common/right.png';
import searchIcon from '../../../assets/common/search.png';
import shareIcon from '../../../assets/common/share.png';
import starIcon from '../../../assets/common/star.png';
import starIconCap from '../../../assets/common/Star.png';
import startLogo from '../../../assets/common/Start_logo.png';
import symbolIcon from '../../../assets/common/symbol.png';
import teamBlueBg from '../../../assets/common/team-blue-bg.png';
import teamGreenBg from '../../../assets/common/team-green-bg.png';
import teamRedBg from '../../../assets/common/team-red-bg.png';
import teamYellowBg from '../../../assets/common/team-yellow-bg.png';
import userBlackIcon from '../../../assets/common/user-black.png';
import userGreyIcon from '../../../assets/common/user-grey.png';
import videoBlackIcon from '../../../assets/common/video-black.png';
import videoGreyIcon from '../../../assets/common/video-grey.png';
import whitePlusIcon from '../../../assets/common/white-plus.png';
import womanIcon from '../../../assets/common/woman.png';
import xIcon from '../../../assets/common/x.png';

// Card 폴더 이미지들
import cardBlueOld from '../../../assets/card/card_blue.png';
import cardGreenOld from '../../../assets/card/card_green.png';
import cardOrangeOld from '../../../assets/card/card_orange.png';
import cardYellowOld from '../../../assets/card/card_yellow.png';

// Ground 폴더 이미지들
import groundLeft from '../../../assets/ground/ground_left.jpg';
import groundRight from '../../../assets/ground/ground_right.jpg';

// Logo 폴더 이미지들
import appleLogoFile from '../../../assets/logo/apple_logo.png';
import blackLogo from '../../../assets/logo/black_logo.png';
import buttomLogo from '../../../assets/logo/buttom_logo.png';
import kakaoLogo from '../../../assets/logo/kakao_logo.png';
import naverLogo from '../../../assets/logo/naver_logo.png';
import startLogoFile from '../../../assets/logo/start_logo.png';

// OVR 폴더 이미지들
import ovrBgr from '../../../assets/ovr/ovr_bgr.png';
import ovrNone from '../../../assets/ovr/ovr_none.png';
import ovrSmall from '../../../assets/ovr/ovr_small.png';

// Position 폴더 이미지들
import positionBlue from '../../../assets/position/blue.png';
import positionGreen from '../../../assets/position/green.png';
import positionOrange from '../../../assets/position/orange.png';
import positionYellow from '../../../assets/position/yellow.png';
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

// Term 폴더 이미지들
import marketingTerm from '../../../assets/term/marketing-term.png';
import privacyTerm1 from '../../../assets/term/privacy-term1.png';
import privacyTerm2 from '../../../assets/term/privacy-term2.png';
import privacyTerm3 from '../../../assets/term/privacy-term3.png';
import privacyTerm4 from '../../../assets/term/privacy-term4.png';
import privacyTerm5 from '../../../assets/term/privacy-term5.png';
import serviceTerm1 from '../../../assets/term/service-term1.png';
import serviceTerm2 from '../../../assets/term/service-term2.png';
import serviceTerm3 from '../../../assets/term/service-term3.png';
import serviceTerm4 from '../../../assets/term/service-term4.png';
import serviceTerm5 from '../../../assets/term/service-term5.png';
import serviceTerm6 from '../../../assets/term/service-term6.png';
import serviceTerm7 from '../../../assets/term/service-term7.png';

// Web 폴더 이미지들
import agroundsLogoWebp from '../../../assets/web/AgroundsLogo.webp';
import heeguWebp from '../../../assets/web/heegu.webp';
import introsec1Webp from '../../../assets/web/introsec1.webp';
import introsecm1Webp from '../../../assets/web/introsecm1.webp';
import introsecm2Webp from '../../../assets/web/introsecm2.webp';
import introsecm3Webp from '../../../assets/web/introsecm3.webp';
import introsecm4Webp from '../../../assets/web/introsecm4.webp';
import jayouWebp from '../../../assets/web/jayou.webp';
import menuWebp from '../../../assets/web/menu.webp';
import section1Webp from '../../../assets/web/section1.webp';
import section2Webp from '../../../assets/web/section2.webp';
import section3Webp from '../../../assets/web/section3.webp';
import section4Webp from '../../../assets/web/section4.webp';
import section5Webp from '../../../assets/web/section5.webp';
import section7Webp from '../../../assets/web/section7.webp';
import serviceWidePng from '../../../assets/web/service-wide.png';
import servicePng from '../../../assets/web/service.png';
import serviceWebp from '../../../assets/web/service.webp';
import servicem1Webp from '../../../assets/web/servicem1.webp';
import servicem2Webp from '../../../assets/web/servicem2.webp';
import servicem3Webp from '../../../assets/web/servicem3.webp';
import servicem4Webp from '../../../assets/web/servicem4.webp';
import servicem5Webp from '../../../assets/web/servicem5.webp';
import servicem6Webp from '../../../assets/web/servicem6.webp';
import sowonWebp from '../../../assets/web/sowon.webp';
import soyeongWebp from '../../../assets/web/soyeong.webp';
import uichanWebp from '../../../assets/web/uichan.webp';

const Design = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copyText, setCopyText] = useState('');

  // 복사 기능
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyText(text);
    setTimeout(() => setCopyText(''), 2000);
  };

  // 색상 팔레트 (정리된 버전)
  const colorPalette = {
    primary: [
      { name: 'Primary', color: '#079669', usage: '메인 액션 버튼, CTA', cssVar: '--primary' },
      { name: 'Primary Hover', color: '#068A5B', usage: '호버 상태', cssVar: '--primary-hover' },
      { name: 'Success', color: '#079669', usage: '성공 상태, 차트', cssVar: '--success' }
    ],
    neutral: [
      { name: 'Text Primary', color: '#262626', usage: '메인 텍스트', cssVar: '--text-primary' },
      { name: 'Text Secondary', color: '#6B7078', usage: '보조 텍스트', cssVar: '--text-secondary' },
      { name: 'Text Disabled', color: '#8A8F98', usage: '비활성 텍스트', cssVar: '--text-disabled' },
      { name: 'Background', color: '#F2F4F6', usage: '페이지 배경', cssVar: '--bg-primary' },
      { name: 'Surface', color: '#FFFFFF', usage: '카드 배경', cssVar: '--bg-surface' },
      { name: 'Border', color: '#E2E8F0', usage: '테두리', cssVar: '--border' }
    ],
    semantic: [
      { name: 'Info', color: '#3b82f6', usage: '정보, 링크', cssVar: '--info' },
      { name: 'Warning', color: '#f59e0b', usage: '경고', cssVar: '--warning' },
      { name: 'Error', color: '#ef4444', usage: '오류', cssVar: '--error' },
      { name: 'Chart Blue', color: '#3b82f6', usage: '차트 색상', cssVar: '--chart-blue' },
      { name: 'Chart Purple', color: '#8b5cf6', usage: '차트 색상', cssVar: '--chart-purple' }
    ]
  };

  // 타이포그래피 (CSS 변수 포함)
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

  // 아이콘 목록 (common 폴더로 이동된 경로 반영)
  const icons = [
    { name: 'Bell', src: bellIcon, path: 'common/bell.png', usage: '알림, 메시지', category: 'Interface' },
    { name: 'Search', src: searchIcon, path: 'common/search.png', usage: '검색 기능', category: 'Interface' },
    { name: 'User Black', src: userBlackIcon, path: 'common/user-black.png', usage: '사용자 (어두운 테마)', category: 'User' },
    { name: 'User Grey', src: userGreyIcon, path: 'common/user-grey.png', usage: '사용자 (밝은 테마)', category: 'User' },
    { name: 'Home Black', src: homeBlackIcon, path: 'common/home-black.png', usage: '홈 (어두운 테마)', category: 'Navigation' },
    { name: 'Home Grey', src: homeGreyIcon, path: 'common/home-grey.png', usage: '홈 (밝은 테마)', category: 'Navigation' },
    { name: 'Plus Button', src: btnPlusIcon, path: 'common/btn_plus.png', usage: '추가 버튼', category: 'Action' },
    { name: 'White Plus', src: whitePlusIcon, path: 'common/white-plus.png', usage: '흰색 플러스', category: 'Action' },
    { name: 'Settings', src: cogIcon, path: 'common/cog.png', usage: '설정', category: 'Interface' },
    { name: 'Check', src: checkIcon, path: 'common/check.png', usage: '체크, 완료', category: 'Status' },
    { name: 'Green Check', src: greenCheckIcon, path: 'common/green-check.png', usage: '성공 체크', category: 'Status' },
    { name: 'Clock', src: clockIcon, path: 'common/clock.png', usage: '시간, 시계', category: 'Interface' },
    { name: 'Location', src: locationIcon, path: 'common/location.png', usage: '위치, 장소', category: 'Interface' },
    { name: 'Camera', src: cameraIcon, path: 'common/camera.png', usage: '카메라, 사진', category: 'Media' },
    { name: 'Video Black', src: videoBlackIcon, path: 'common/video-black.png', usage: '비디오 (어두운 테마)', category: 'Media' },
    { name: 'Video Grey', src: videoGreyIcon, path: 'common/video-grey.png', usage: '비디오 (밝은 테마)', category: 'Media' },
    { name: 'Graph Black', src: graphBlackIcon, path: 'common/graph-black.png', usage: '그래프 (어두운 테마)', category: 'Data' },
    { name: 'Graph Grey', src: graphGreyIcon, path: 'common/graph-grey.png', usage: '그래프 (밝은 테마)', category: 'Data' },
    { name: 'Left Arrow', src: leftIcon, path: 'common/left.png', usage: '왼쪽 화살표', category: 'Navigation' },
    { name: 'Right Arrow', src: rightIcon, path: 'common/right.png', usage: '오른쪽 화살표', category: 'Navigation' },
    { name: 'Down Arrow', src: downIcon, path: 'common/down.png', usage: '아래 화살표', category: 'Navigation' },
    { name: 'Eye', src: eyeIcon, path: 'common/eye.png', usage: '보기, 표시', category: 'Interface' },
    { name: 'Eye Off', src: eyeOffIcon, path: 'common/eye-off.png', usage: '숨기기, 비표시', category: 'Interface' },
    { name: 'Star', src: starIcon, path: 'common/Star.png', usage: '즐겨찾기, 평점', category: 'Interface' },
    { name: 'Share', src: shareIcon, path: 'common/share.png', usage: '공유', category: 'Action' },
    { name: 'Download', src: downloadIcon, path: 'common/download.png', usage: '다운로드', category: 'Action' },
    { name: 'Reload', src: reloadIcon, path: 'common/reload.png', usage: '새로고침', category: 'Action' },
    { name: 'Close X', src: xIcon, path: 'common/x.png', usage: '닫기', category: 'Interface' },
    { name: 'Dots Menu', src: dotsIcon, path: 'common/dots.png', usage: '더보기 메뉴', category: 'Interface' },
    { name: 'Info', src: infoIcon, path: 'common/info.png', usage: '정보', category: 'Interface' },
    { name: 'Folder', src: folderIcon, path: 'common/folder.png', usage: '폴더, 분류', category: 'Interface' },
    { name: 'Edit', src: editIcon, path: 'common/ico_edit.png', usage: '편집', category: 'Action' },
    { name: 'Trash', src: trashIcon, path: 'common/ico_trash.png', usage: '삭제', category: 'Action' },
    { name: 'Lock', src: lockIcon, path: 'common/lock.png', usage: '잠금, 보안', category: 'Interface' },
    { name: 'Pencil', src: pencilIcon, path: 'common/pencil.png', usage: '수정, 편집', category: 'Action' }
  ];

  // 간격 시스템
  const spacing = [
    { name: 'xs', value: '4px', usage: '매우 작은 간격' },
    { name: 'sm', value: '8px', usage: '작은 간격' },
    { name: 'md', value: '12px', usage: '기본 간격' },
    { name: 'lg', value: '16px', usage: '큰 간격' },
    { name: 'xl', value: '20px', usage: '매우 큰 간격' },
    { name: '2xl', value: '24px', usage: '섹션 간격' },
    { name: '3xl', value: '32px', usage: '컴포넌트 간격' },
    { name: '4xl', value: '40px', usage: '페이지 간격' }
  ];

  // 컴포넌트 상태
  const componentStates = [
    { name: 'Default', description: '기본 상태' },
    { name: 'Hover', description: '마우스 오버 상태' },
    { name: 'Active', description: '활성화 상태' },
    { name: 'Focus', description: '포커스 상태' },
    { name: 'Disabled', description: '비활성화 상태' },
    { name: 'Loading', description: '로딩 상태' }
  ];

  // 개요 섹션
  const renderOverviewSection = () => (
    <div className="design-section">
      <h2>AGROUNDS 디자인 시스템 개요</h2>
      <div className="overview-content">
        <div className="overview-card">
          <h3>목적</h3>
          <p>일관된 사용자 경험과 효율적인 개발을 위한 디자인 가이드라인</p>
        </div>
        <div className="overview-card">
          <h3>원칙</h3>
          <ul>
            <li><strong>일관성:</strong> 모든 플랫폼에서 동일한 시각적 언어</li>
            <li><strong>접근성:</strong> 모든 사용자가 쉽게 접근할 수 있는 디자인</li>
            <li><strong>확장성:</strong> 미래의 요구사항에 유연하게 대응</li>
            <li><strong>효율성:</strong> 빠른 개발과 유지보수 가능</li>
          </ul>
        </div>
        <div className="overview-card">
          <h3>폰트 시스템</h3>
          <div className="font-info">
            <div className="font-item">
              <strong>Paperlogy-8ExtraBold</strong> - 브랜드 폰트
              <p>헤더, 제목에서 사용하는 강력한 브랜드 아이덴티티 (CDN 로드)</p>
            </div>
            <div className="font-item">
              <strong>Pretendard</strong> - 텍스트 폰트
              <p>본문, 설명 등 가독성이 중요한 콘텐츠용 (CDN 로드)</p>
            </div>
          </div>
        </div>
        <div className="overview-card">
          <h3>구성 요소</h3>
          <div className="component-overview">
            <span className="overview-tag">색상</span>
            <span className="overview-tag">폰트</span>
            <span className="overview-tag">타이포그래피</span>
            <span className="overview-tag">아이콘</span>
            <span className="overview-tag">컴포넌트</span>
            <span className="overview-tag">레이아웃</span>
            <span className="overview-tag">접근성</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderColorSection = () => (
    <div className="design-section">
      <h2>색상 시스템</h2>
      <p className="section-description">AGROUNDS의 브랜드 아이덴티티를 반영하는 색상 팔레트입니다.</p>
      
      {Object.entries(colorPalette).map(([category, colors]) => (
        <div key={category} className="color-category">
          <h3>
            {category === 'primary' ? '🎨 주요 색상' : 
             category === 'neutral' ? '⚪ 중성 색상' : 
             '🔖 의미 색상'}
          </h3>
          <div className="color-grid">
            {colors.map((color, index) => (
              <div key={index} className="color-item">
                <div 
                  className="color-swatch" 
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
          <pre><code>{`.primary-button {
  background-color: var(--primary);
  color: var(--bg-surface);
}

.primary-button:hover {
  background-color: var(--primary-hover);
}`}</code></pre>
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
                className="typography-sample korean"
                style={{ 
                  fontSize: typo.size, 
                  fontWeight: typo.weight,
                  lineHeight: typo.lineHeight
                }}
              >
                {typo.sampleKo}
              </div>
              <div 
                className="typography-sample english"
                style={{ 
                  fontSize: typo.size, 
                  fontWeight: typo.weight,
                  lineHeight: typo.lineHeight
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
        <div className="typography-demo">
          <div className="demo-text">
            <h1 className="text-display">디스플레이 텍스트</h1>
            <h2 className="text-h2">섹션 제목</h2>
            <p className="text-body">본문 텍스트입니다. 일반적인 내용과 설명을 위한 기본 본문 텍스트입니다.</p>
            <span className="text-caption">캡션 텍스트</span>
          </div>
        </div>
        <div className="code-example">
          <pre><code>{`<!-- 브랜드 폰트 (Paperlogy-8ExtraBold) 사용 -->
<h1 class="text-display">디스플레이 텍스트</h1>
<h2 class="text-h2">섹션 제목</h2>

<!-- 텍스트 폰트 (Pretendard) 사용 -->
<h3 class="text-h3">하위 제목</h3>
<p class="text-body">본문 텍스트입니다.</p>
<span class="text-caption">캡션 텍스트</span>

/* CSS 폰트 변수 (index.css CDN 로드됨) */
:root {
  --font-brand: 'Paperlogy-8ExtraBold', sans-serif;
  --font-text: 'Pretendard', sans-serif;
}`}</code></pre>
        </div>
      </div>
    </div>
  );

  // 아이콘을 카테고리별로 그룹화
  const iconsByCategory = icons.reduce((acc, icon) => {
    if (!acc[icon.category]) {
      acc[icon.category] = [];
    }
    acc[icon.category].push(icon);
    return acc;
  }, {});

  // 아이콘 섹션
  const renderIconsSection = () => (
    <div className="design-section">
      <h2>아이콘 시스템</h2>
      <p className="section-description">직관적이고 일관된 아이콘으로 사용자 인터페이스를 개선합니다. 실제 프로젝트에서 사용되는 아이콘들입니다.</p>
      
      {Object.entries(iconsByCategory).map(([category, categoryIcons]) => (
        <div key={category} className="icon-category">
          <h3>
            {category === 'Interface' ? '🔧 인터페이스' :
             category === 'Navigation' ? '🧭 네비게이션' :
             category === 'Action' ? '⚡ 액션' :
             category === 'Media' ? '📽️ 미디어' :
             category === 'Data' ? '📊 데이터' :
             category === 'User' ? '👤 사용자' :
             category === 'Status' ? '✅ 상태' : category}
          </h3>
          <div className="icons-grid">
            {categoryIcons.map((icon, index) => (
              <div key={index} className="icon-item">
                <div className="icon-display">
                  <div className="icon-image-container">
                    <img 
                      src={icon.src} 
                      alt={icon.name}
                      className="icon-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="icon-placeholder" style={{ display: 'none' }}>
                      <span className="icon-name-short">{icon.name.charAt(0)}</span>
                    </div>
                  </div>
                </div>
                <div className="icon-info">
                  <h4>{icon.name}</h4>
                  <p className="icon-path">{icon.path}</p>
                  <p className="icon-usage">{icon.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="usage-example">
        <h3>💡 사용 가이드라인</h3>
        <div className="guidelines-grid">
          <div className="guideline-item">
            <h4>크기 기준</h4>
            <ul>
              <li>Small: 16px × 16px</li>
              <li>Medium: 20px × 20px</li>
              <li>Large: 24px × 24px</li>
              <li>XL: 32px × 32px</li>
            </ul>
          </div>
          <div className="guideline-item">
            <h4>사용 원칙</h4>
            <ul>
              <li>텍스트와 함께 사용 시 의미 명확화</li>
              <li>터치 가능한 아이콘은 최소 44px 영역</li>
              <li>일관된 스타일과 두께 유지</li>
              <li>브랜드 컬러 또는 중성 색상 사용</li>
            </ul>
          </div>
          <div className="guideline-item">
            <h4>컬러 변형</h4>
            <ul>
              <li>Black: 어두운 배경용</li>
              <li>Grey: 밝은 배경용</li>
              <li>White: 컬러 배경용</li>
              <li>Brand: 강조 표시용</li>
            </ul>
          </div>
        </div>
        
        <div className="code-example">
          <pre><code>{`// React에서 아이콘 import 방식 (common 폴더 경로)
import bellIcon from '../../../assets/common/bell.png';
import userBlackIcon from '../../../assets/common/user-black.png';

// 사용 예제
<img src={bellIcon} alt="알림" className="icon-medium" />
<img src={userBlackIcon} alt="사용자" className="icon-large" />

// CSS로 아이콘 크기 조절
.icon-small { width: 16px; height: 16px; }
.icon-medium { width: 20px; height: 20px; }
.icon-large { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }`}</code></pre>
        </div>
      </div>
    </div>
  );

  const renderComponentsSection = () => (
    <div className="design-section">
      <h2>컴포넌트</h2>
      <p className="section-description">재사용 가능한 UI 컴포넌트들로 일관된 인터페이스를 구축합니다.</p>
      
      <div className="component-category">
        <h3>🔘 버튼</h3>
        <div className="component-showcase">
          <div className="component-states">
            <h4>Primary Button</h4>
            <div className="button-states">
              <button className="btn-primary">기본</button>
              <button className="btn-primary hover">호버</button>
              <button className="btn-primary active">활성</button>
              <button className="btn-primary" disabled>비활성</button>
            </div>
          </div>
          <div className="component-states">
            <h4>Secondary Button</h4>
            <div className="button-states">
              <button className="btn-secondary">기본</button>
              <button className="btn-secondary hover">호버</button>
              <button className="btn-secondary active">활성</button>
              <button className="btn-secondary" disabled>비활성</button>
            </div>
          </div>
        </div>
        <div className="code-example">
          <pre><code>{`<button class="btn-primary">Primary Button</button>
<button class="btn-secondary">Secondary Button</button>`}</code></pre>
        </div>
      </div>

      <div className="component-category">
        <h3>📋 카드</h3>
        <div className="component-grid">
          <div className="component-item">
            <div className="component-sample">
              <div className="sample-main-card">
                <div className="card-header">
                  <h3>나의 팀</h3>
                  <span>→</span>
                </div>
                <p>함께할 팀을 찾고 합류해보세요</p>
                <button className="btn-primary small">팀 찾기</button>
              </div>
            </div>
            <p>메인 카드</p>
          </div>

          <div className="component-item">
            <div className="component-sample">
              <div className="sample-stats-card">
                <h4>평점</h4>
                <div className="stat-content">
                  <div className="mini-chart"></div>
                  <div className="stat-number">85<span>점</span></div>
                </div>
              </div>
            </div>
            <p>통계 카드</p>
          </div>
        </div>
      </div>

      <div className="component-category">
        <h3>📝 입력 필드</h3>
        <div className="input-showcase">
          <div className="input-group">
            <label>기본 입력</label>
            <input type="text" className="text-input" placeholder="텍스트를 입력하세요" />
          </div>
          <div className="input-group">
            <label>검색 입력</label>
            <div className="search-input">
              <input type="text" placeholder="검색..." />
              <span className="search-icon">🔍</span>
            </div>
          </div>
          <div className="input-group">
            <label>오류 상태</label>
            <input type="text" className="text-input error" placeholder="오류가 있는 입력" />
            <span className="error-message">필수 입력 항목입니다</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpacingSection = () => (
    <div className="design-section">
      <h2>간격 시스템</h2>
      <p className="section-description">일관된 간격으로 조화로운 레이아웃을 만듭니다.</p>
      
      <div className="spacing-grid">
        {spacing.map((space, index) => (
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
              <p>{space.usage}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="usage-example">
        <h3>💡 사용 예제</h3>
        <div className="spacing-demo">
          <div className="spacing-demo-box" style={{ padding: '16px', margin: '8px' }}>
            <span>padding: 16px, margin: 8px</span>
          </div>
        </div>
        <div className="code-example">
          <pre><code>{`.component {
  padding: var(--spacing-lg); /* 16px */
  margin: var(--spacing-sm);  /* 8px */
  gap: var(--spacing-md);     /* 12px */
}`}</code></pre>
        </div>
      </div>
    </div>
  );

  // 레이아웃 섹션
  const renderLayoutSection = () => (
    <div className="design-section">
      <h2>레이아웃 시스템</h2>
      <p className="section-description">반응형 그리드와 컨테이너로 구조화된 레이아웃을 제공합니다.</p>
      
      <div className="layout-category">
        <h3>📱 컨테이너</h3>
        <div className="container-demo">
          <div className="demo-container">
            <div className="demo-content">Mobile: max-width 499px</div>
          </div>
          <div className="demo-container tablet">
            <div className="demo-content">Tablet: max-width 768px</div>
          </div>
          <div className="demo-container desktop">
            <div className="demo-content">Desktop: max-width 1200px</div>
          </div>
        </div>
      </div>

      <div className="layout-category">
        <h3>📏 그리드 시스템</h3>
        <div className="grid-demo">
          <div className="grid-row">
            <div className="grid-col">1/3</div>
            <div className="grid-col">1/3</div>
            <div className="grid-col">1/3</div>
          </div>
          <div className="grid-row">
            <div className="grid-col wide">2/3</div>
            <div className="grid-col">1/3</div>
          </div>
        </div>
      </div>

      <div className="usage-example">
        <h3>💡 사용 예제</h3>
        <div className="code-example">
          <pre><code>{`.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--spacing-lg);
}`}</code></pre>
        </div>
      </div>
    </div>
  );

  // 접근성 섹션
  const renderAccessibilitySection = () => (
    <div className="design-section">
      <h2>접근성 가이드라인</h2>
      <p className="section-description">모든 사용자가 쉽게 접근할 수 있는 디자인 원칙입니다.</p>
      
      <div className="accessibility-grid">
        <div className="accessibility-card">
          <h3>🎨 색상 대비</h3>
          <p>WCAG AA 기준 4.5:1 이상의 색상 대비 유지</p>
          <div className="contrast-examples">
            <div className="contrast-good">
              <span style={{ background: '#079669', color: '#FFFFFF' }}>좋은 예시</span>
            </div>
            <div className="contrast-bad">
              <span style={{ background: '#22c55e', color: '#FFFFFF' }}>나쁜 예시</span>
            </div>
          </div>
        </div>
        
        <div className="accessibility-card">
          <h3>🎯 터치 영역</h3>
          <p>최소 44px × 44px 크기 확보</p>
          <div className="touch-demo">
            <button className="touch-good">적절한 크기</button>
            <button className="touch-bad">너무 작음</button>
          </div>
        </div>
        
        <div className="accessibility-card">
          <h3>📱 반응형 디자인</h3>
          <p>모든 기기에서 일관된 경험 제공</p>
          <ul>
            <li>모바일: 320px ~ 767px</li>
            <li>태블릿: 768px ~ 1199px</li>
            <li>데스크톱: 1200px 이상</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Assets 섹션 렌더링
  const renderAssetsSection = () => {
    // 모든 assets를 폴더별로 정리
    const assetsData = {
      common: [
        { name: 'Agrounds Circle Logo', src: agroundsCircleLogo, path: 'common/agrounds_circle_logo.png' },
        { name: 'Agrounds Logo', src: agroundsLogo, path: 'common/Agrounds_logo.png' },
        { name: 'Apple Logo', src: appleLogo, path: 'common/apple-logo.png' },
        { name: 'Bell', src: bellIcon, path: 'common/bell.png' },
        { name: 'Button Plus', src: btnPlusIcon, path: 'common/btn_plus.png' },
        { name: 'Camera', src: cameraIcon, path: 'common/camera.png' },
        { name: 'Card Blue', src: cardBlue, path: 'common/card-blue.png' },
        { name: 'Card Green', src: cardGreen, path: 'common/card-green.png' },
        { name: 'Card Red', src: cardRed, path: 'common/card-red.png' },
        { name: 'Card Yellow', src: cardYellow, path: 'common/card-yellow.png' },
        { name: 'Check Green', src: checkGreen, path: 'common/check_green.png' },
        { name: 'Check', src: checkIcon, path: 'common/check.png' },
        { name: 'Clock', src: clockIcon, path: 'common/clock.png' },
        { name: 'Cog', src: cogIcon, path: 'common/cog.png' },
        { name: 'Connect Black', src: connectBlack, path: 'common/connect-black.png' },
        { name: 'Connect Grey', src: connectGrey, path: 'common/connect-grey.png' },
        { name: 'Default Profile', src: defaultProfile, path: 'common/default_profile.png' },
        { name: 'Default Team Logo', src: defaultTeamLogo, path: 'common/default-team-logo.png' },
        { name: 'Device', src: deviceIcon, path: 'common/device.png' },
        { name: 'Dot3', src: dot3Icon, path: 'common/dot3.png' },
        { name: 'Dots', src: dotsIcon, path: 'common/dots.png' },
        { name: 'Down', src: downIcon, path: 'common/down.png' },
        { name: 'Download', src: downloadIcon, path: 'common/download.png' },
        { name: 'Ellipse Blue', src: ellipseBlue, path: 'common/Ellipse-blue.png' },
        { name: 'Ellipse Green', src: ellipseGreen, path: 'common/Ellipse-green.png' },
        { name: 'Ellipse Red', src: ellipseRed, path: 'common/Ellipse-red.png' },
        { name: 'Ellipse Yellow', src: ellipseYellow, path: 'common/Ellipse-yellow.png' },
        { name: 'Exclamation Circle', src: exclamationCircle, path: 'common/exclamation-circle.png' },
        { name: 'Eye Off', src: eyeOffIcon, path: 'common/eye-off.png' },
        { name: 'Eye', src: eyeIcon, path: 'common/eye.png' },
        { name: 'Folder', src: folderIcon, path: 'common/folder.png' },
        { name: 'Graph Black', src: graphBlackIcon, path: 'common/graph-black.png' },
        { name: 'Graph Grey', src: graphGreyIcon, path: 'common/graph-grey.png' },
        { name: 'Green Check', src: greenCheckIcon, path: 'common/green-check.png' },
        { name: 'Grey Check', src: greyCheckIcon, path: 'common/grey-check.png' },
        { name: 'Home Black', src: homeBlackIcon, path: 'common/home-black.png' },
        { name: 'Home Grey', src: homeGreyIcon, path: 'common/home-grey.png' },
        { name: 'Ico Check', src: icoCheck, path: 'common/ico_check.png' },
        { name: 'Edit', src: editIcon, path: 'common/ico_edit.png' },
        { name: 'Ico Ground Left', src: icoGroundLeft, path: 'common/ico_ground-left.png' },
        { name: 'Ico Ground Right', src: icoGroundRight, path: 'common/ico_ground-right.png' },
        { name: 'Ico Paper', src: icoPaper, path: 'common/ico_paper.png' },
        { name: 'Trash', src: trashIcon, path: 'common/ico_trash.png' },
        { name: 'Ill Check', src: illCheck, path: 'common/ill_check.png' },
        { name: 'Ill Note', src: illNote, path: 'common/ill_note.png' },
        { name: 'Illust Ground', src: illustGround, path: 'common/illust_ground.png' },
        { name: 'Info', src: infoIcon, path: 'common/info.png' },
        { name: 'Kakao', src: kakaoIcon, path: 'common/kakao.png' },
        { name: 'Left White', src: leftWhiteIcon, path: 'common/left-white.png' },
        { name: 'Left', src: leftIcon, path: 'common/left.png' },
        { name: 'Location No Back', src: locationNoback, path: 'common/location_noback.png' },
        { name: 'Location', src: locationIcon, path: 'common/location.png' },
        { name: 'Lock', src: lockIcon, path: 'common/lock.png' },
        { name: 'Logo Bottom', src: logoButtom, path: 'common/logo_buttom.png' },
        { name: 'Logo Sample', src: logoSample, path: 'common/logo_sample.png' },
        { name: 'Man', src: manIcon, path: 'common/man.png' },
        { name: 'Nickname Error Tooltip', src: nicknameErrorTooltip, path: 'common/nickname-error-tooltip.png' },
        { name: 'Onboard BG', src: onboardBg, path: 'common/onboard_bg.png' },
        { name: 'OVR', src: ovrIcon, path: 'common/ovr.png' },
        { name: 'Pencil', src: pencilIcon, path: 'common/pencil.png' },
        { name: 'Playlist', src: playlistIcon, path: 'common/playlist.png' },
        { name: 'Polygon', src: polygonIcon, path: 'common/polygon.png' },
        { name: 'Rank Blue', src: rankBlue, path: 'common/rank-blue.png' },
        { name: 'Rank Green', src: rankGreen, path: 'common/rank-green.png' },
        { name: 'Rank Red', src: rankRed, path: 'common/rank-red.png' },
        { name: 'Rank Yellow', src: rankYellow, path: 'common/rank-yellow.png' },
        { name: 'Reload', src: reloadIcon, path: 'common/reload.png' },
        { name: 'Right', src: rightIcon, path: 'common/right.png' },
        { name: 'Search', src: searchIcon, path: 'common/search.png' },
        { name: 'Share', src: shareIcon, path: 'common/share.png' },
        { name: 'Star', src: starIcon, path: 'common/star.png' },
        { name: 'Star Cap', src: starIconCap, path: 'common/Star.png' },
        { name: 'Start Logo', src: startLogo, path: 'common/Start_logo.png' },
        { name: 'Symbol', src: symbolIcon, path: 'common/symbol.png' },
        { name: 'Team Blue BG', src: teamBlueBg, path: 'common/team-blue-bg.png' },
        { name: 'Team Green BG', src: teamGreenBg, path: 'common/team-green-bg.png' },
        { name: 'Team Red BG', src: teamRedBg, path: 'common/team-red-bg.png' },
        { name: 'Team Yellow BG', src: teamYellowBg, path: 'common/team-yellow-bg.png' },
        { name: 'User Black', src: userBlackIcon, path: 'common/user-black.png' },
        { name: 'User Grey', src: userGreyIcon, path: 'common/user-grey.png' },
        { name: 'Video Black', src: videoBlackIcon, path: 'common/video-black.png' },
        { name: 'Video Grey', src: videoGreyIcon, path: 'common/video-grey.png' },
        { name: 'White Plus', src: whitePlusIcon, path: 'common/white-plus.png' },
        { name: 'Woman', src: womanIcon, path: 'common/woman.png' },
        { name: 'X', src: xIcon, path: 'common/x.png' }
      ],
      card: [
        { name: 'Card Blue', src: cardBlueOld, path: 'card/card_blue.png' },
        { name: 'Card Green', src: cardGreenOld, path: 'card/card_green.png' },
        { name: 'Card Orange', src: cardOrangeOld, path: 'card/card_orange.png' },
        { name: 'Card Yellow', src: cardYellowOld, path: 'card/card_yellow.png' }
      ],
      ground: [
        { name: 'Ground Left', src: groundLeft, path: 'ground/ground_left.jpg' },
        { name: 'Ground Right', src: groundRight, path: 'ground/ground_right.jpg' }
      ],
      logo: [
        { name: 'Apple Logo', src: appleLogoFile, path: 'logo/apple_logo.png' },
        { name: 'Black Logo', src: blackLogo, path: 'logo/black_logo.png' },
        { name: 'Bottom Logo', src: buttomLogo, path: 'logo/buttom_logo.png' },
        { name: 'Kakao Logo', src: kakaoLogo, path: 'logo/kakao_logo.png' },
        { name: 'Naver Logo', src: naverLogo, path: 'logo/naver_logo.png' },
        { name: 'Start Logo', src: startLogoFile, path: 'logo/start_logo.png' }
      ],
      ovr: [
        { name: 'OVR Background', src: ovrBgr, path: 'ovr/ovr_bgr.png' },
        { name: 'OVR None', src: ovrNone, path: 'ovr/ovr_none.png' },
        { name: 'OVR Small', src: ovrSmall, path: 'ovr/ovr_small.png' }
      ],
      position: [
        { name: 'Blue', src: positionBlue, path: 'position/blue.png' },
        { name: 'Green', src: positionGreen, path: 'position/green.png' },
        { name: 'Orange', src: positionOrange, path: 'position/orange.png' },
        { name: 'Yellow', src: positionYellow, path: 'position/yellow.png' },
        { name: 'CAM', src: positionCAM, path: 'position/position_CAM.png' },
        { name: 'CB', src: positionCB, path: 'position/position_CB.png' },
        { name: 'CDM', src: positionCDM, path: 'position/position_CDM.png' },
        { name: 'CM', src: positionCM, path: 'position/position_CM.png' },
        { name: 'GK', src: positionGK, path: 'position/position_GK.png' },
        { name: 'LB', src: positionLB, path: 'position/position_LB.png' },
        { name: 'LM', src: positionLM, path: 'position/position_LM.png' },
        { name: 'LWB', src: positionLWB, path: 'position/position_LWB.png' },
        { name: 'LWF', src: positionLWF, path: 'position/position_LWF.png' },
        { name: 'LWM', src: positionLWM, path: 'position/position_LWM.png' },
        { name: 'RB', src: positionRB, path: 'position/position_RB.png' },
        { name: 'RM', src: positionRM, path: 'position/position_RM.png' },
        { name: 'RWB', src: positionRWB, path: 'position/position_RWB.png' },
        { name: 'RWF', src: positionRWF, path: 'position/position_RWF.png' },
        { name: 'RWM', src: positionRWM, path: 'position/position_RWM.png' },
        { name: 'ST', src: positionST, path: 'position/position_ST.png' }
      ],
      term: [
        { name: 'Marketing Term', src: marketingTerm, path: 'term/marketing-term.png' },
        { name: 'Privacy Term 1', src: privacyTerm1, path: 'term/privacy-term1.png' },
        { name: 'Privacy Term 2', src: privacyTerm2, path: 'term/privacy-term2.png' },
        { name: 'Privacy Term 3', src: privacyTerm3, path: 'term/privacy-term3.png' },
        { name: 'Privacy Term 4', src: privacyTerm4, path: 'term/privacy-term4.png' },
        { name: 'Privacy Term 5', src: privacyTerm5, path: 'term/privacy-term5.png' },
        { name: 'Service Term 1', src: serviceTerm1, path: 'term/service-term1.png' },
        { name: 'Service Term 2', src: serviceTerm2, path: 'term/service-term2.png' },
        { name: 'Service Term 3', src: serviceTerm3, path: 'term/service-term3.png' },
        { name: 'Service Term 4', src: serviceTerm4, path: 'term/service-term4.png' },
        { name: 'Service Term 5', src: serviceTerm5, path: 'term/service-term5.png' },
        { name: 'Service Term 6', src: serviceTerm6, path: 'term/service-term6.png' },
        { name: 'Service Term 7', src: serviceTerm7, path: 'term/service-term7.png' }
      ],
      web: [
        { name: 'Agrounds Logo', src: agroundsLogoWebp, path: 'web/AgroundsLogo.webp' },
        { name: 'Heegu', src: heeguWebp, path: 'web/heegu.webp' },
        { name: 'Intro Sec 1', src: introsec1Webp, path: 'web/introsec1.webp' },
        { name: 'Intro Sec M1', src: introsecm1Webp, path: 'web/introsecm1.webp' },
        { name: 'Intro Sec M2', src: introsecm2Webp, path: 'web/introsecm2.webp' },
        { name: 'Intro Sec M3', src: introsecm3Webp, path: 'web/introsecm3.webp' },
        { name: 'Intro Sec M4', src: introsecm4Webp, path: 'web/introsecm4.webp' },
        { name: 'Jayou', src: jayouWebp, path: 'web/jayou.webp' },
        { name: 'Menu', src: menuWebp, path: 'web/menu.webp' },
        { name: 'Section 1', src: section1Webp, path: 'web/section1.webp' },
        { name: 'Section 2', src: section2Webp, path: 'web/section2.webp' },
        { name: 'Section 3', src: section3Webp, path: 'web/section3.webp' },
        { name: 'Section 4', src: section4Webp, path: 'web/section4.webp' },
        { name: 'Section 5', src: section5Webp, path: 'web/section5.webp' },
        { name: 'Section 7', src: section7Webp, path: 'web/section7.webp' },
        { name: 'Service Wide', src: serviceWidePng, path: 'web/service-wide.png' },
        { name: 'Service PNG', src: servicePng, path: 'web/service.png' },
        { name: 'Service', src: serviceWebp, path: 'web/service.webp' },
        { name: 'Service M1', src: servicem1Webp, path: 'web/servicem1.webp' },
        { name: 'Service M2', src: servicem2Webp, path: 'web/servicem2.webp' },
        { name: 'Service M3', src: servicem3Webp, path: 'web/servicem3.webp' },
        { name: 'Service M4', src: servicem4Webp, path: 'web/servicem4.webp' },
        { name: 'Service M5', src: servicem5Webp, path: 'web/servicem5.webp' },
        { name: 'Service M6', src: servicem6Webp, path: 'web/servicem6.webp' },
        { name: 'Sowon', src: sowonWebp, path: 'web/sowon.webp' },
        { name: 'Soyeong', src: soyeongWebp, path: 'web/soyeong.webp' },
        { name: 'Uichan', src: uichanWebp, path: 'web/uichan.webp' }
      ]
    };

    return (
      <div className="design-section">
        <h2>Assets 이미지 갤러리</h2>
        <p className="section-description">프로젝트에서 사용되는 모든 이미지 assets를 폴더별로 정리하여 보여줍니다.</p>
        
        {Object.entries(assetsData).map(([folder, images]) => (
          <div key={folder} className="assets-folder">
            <h3 className="folder-title">📁 {folder} 폴더 ({images.length}개)</h3>
            <div className="assets-grid">
              {images.map((asset, index) => (
                <div key={index} className="asset-card">
                  <div className="asset-image">
                    <img src={asset.src} alt={asset.name} />
                  </div>
                  <div className="asset-info">
                    <h4>{asset.name}</h4>
                    <p className="asset-path">{asset.path}</p>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(`import ${asset.name.replace(/\s+/g, '')} from '../../../assets/${asset.path}';`)}
                    >
                      Import 복사
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return renderOverviewSection();
      case 'colors': return renderColorSection();
      case 'typography': return renderTypographySection();
      case 'icons': return renderIconsSection();
      case 'components': return renderComponentsSection();
      case 'spacing': return renderSpacingSection();
      case 'layout': return renderLayoutSection();
      case 'accessibility': return renderAccessibilitySection();
      case 'assets': return renderAssetsSection();
      default: return renderOverviewSection();
    }
  };

  return (
    <div className="design-system">
      <header className="design-header">
        <div className="header-content">
          <h1>AGROUNDS 디자인 시스템</h1>
          <p>일관된 사용자 경험을 위한 디자인 가이드라인</p>
        </div>
      </header>

      <div className="design-container">
        <nav className="design-nav">
          <ul>
            <li 
              className={activeSection === 'overview' ? 'active' : ''}
              onClick={() => setActiveSection('overview')}
            >
              📋 개요
            </li>
            <li 
              className={activeSection === 'colors' ? 'active' : ''}
              onClick={() => setActiveSection('colors')}
            >
              🎨 색상
            </li>
            <li 
              className={activeSection === 'typography' ? 'active' : ''}
              onClick={() => setActiveSection('typography')}
            >
              📝 타이포그래피
            </li>
            <li 
              className={activeSection === 'icons' ? 'active' : ''}
              onClick={() => setActiveSection('icons')}
            >
              🔗 아이콘
            </li>
            <li 
              className={activeSection === 'components' ? 'active' : ''}
              onClick={() => setActiveSection('components')}
            >
              🧩 컴포넌트
            </li>
            <li 
              className={activeSection === 'spacing' ? 'active' : ''}
              onClick={() => setActiveSection('spacing')}
            >
              📏 간격
            </li>
            <li 
              className={activeSection === 'layout' ? 'active' : ''}
              onClick={() => setActiveSection('layout')}
            >
              📐 레이아웃
            </li>
            <li 
              className={activeSection === 'accessibility' ? 'active' : ''}
              onClick={() => setActiveSection('accessibility')}
            >
              ♿ 접근성
            </li>
            <li 
              className={activeSection === 'assets' ? 'active' : ''}
              onClick={() => setActiveSection('assets')}
            >
              🖼️ Assets
            </li>
          </ul>
        </nav>

        <main className="design-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Design;

