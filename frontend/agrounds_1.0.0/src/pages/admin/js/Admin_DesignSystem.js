import React, { useState, useEffect } from 'react';
import '../css/Admin_DesignSystem.scss';
import { GetQuarterDataApi } from '../../../function/api/anal/analApi';

// 아이콘 시스템 접기/펼치기용 아이콘
import downIconBlack from '../../../assets/main_icons/down_black.png';
import upIconBlack from '../../../assets/main_icons/up_black.png';

// 모든 assets 이미지들을 폴더별로 import
// Common 폴더 이미지들
import agroundsCircleLogo from '../../../assets/common/agrounds_circle_logo.png';
import agroundsLogo from '../../../assets/common/Agrounds_logo.png';
import appleLogo from '../../../assets/common/apple-logo.png';
import bellIcon from '../../../assets/common/bell.png';
import btnPlusIcon from '../../../assets/common/btn_plus.png';
import cameraIcon from '../../../assets/common/camera.png';
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
import cardBlue from '../../../assets/card/card_blue.png';
import cardGreen from '../../../assets/card/card_green.png';
import cardOrange from '../../../assets/card/card_orange.png';
import cardYellow from '../../../assets/card/card_yellow.png';

// 포지션 이미지 (big_icons - dot 버전)
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

// Ground 폴더 이미지들 (이미지 분석용)
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

// Position 폴더 이미지들 (색상 이미지만 - 포지션 아이콘은 big_icons에서 사용)
import positionBlue from '../../../assets/position/blue.png';
import positionGreen from '../../../assets/position/green.png';
import positionOrange from '../../../assets/position/orange.png';
import positionYellow from '../../../assets/position/yellow.png';

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

// Text Icon 폴더 이미지들
import logoTextBlack from '../../../assets/text_icon/logo_text_black.png';
import logoTextGray from '../../../assets/text_icon/logo_text_gray.png';
import logoTextGreen from '../../../assets/text_icon/logo_text_green.png';
import logoTextWhite from '../../../assets/text_icon/logo_text_white.png';

// Card_icons 폴더 - 미니 카드 배경 (Team_Anal.js 종목별 최고 선수용)
import redMiniCard from '../../../assets/card_icons/red_mini_card.png';
import greenMiniCard from '../../../assets/card_icons/green_mini_card.png';
import blueMiniCard from '../../../assets/card_icons/blue_mini_card.png';
import yellowMiniCard from '../../../assets/card_icons/yellow_mini_card.png';

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

const Admin_DesignSystem = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copyText, setCopyText] = useState('');
  
  // 컴포넌트 카테고리 필터 상태 (localStorage 사용)
  const [componentCategory, setComponentCategory] = useState(() => {
    return localStorage.getItem('designSystemComponentCategory') || '전체';
  });
  
  // 아이콘 폴더 접기/펼치기 상태 관리
  const [collapsedFolders, setCollapsedFolders] = useState({});
  const [colorIconColors, setColorIconColors] = useState({ color_icons: 'black' });
  const [mainIconColors, setMainIconColors] = useState({ main_icons: 'black' });
  const [viewModes, setViewModes] = useState({
    main_icons: 'simple',
    color_icons: 'simple',
    identify_icon: 'simple',
    nav_icons: 'simple',
    big_icons: 'simple',
    card_icons: 'simple',
    special_icon: 'simple',
    text_icon: 'simple'
  }); // 기본값: 간단 모드
  const [componentCodeCollapsed, setComponentCodeCollapsed] = useState({
    'radar-chart': true,
    'activity-ratio': true,
    'line-chart': true,
    'activity-bars': true,
    'speed-charts': true,
    'player-card': true,
    'top-performer': true,
    'player-list-item': true,
    'high-box': true,
    'rank-box': true,
    'team-ranking': true,
    'text-modal': true,
    'option-modal': true,
    'region-modal': true,
    'action-modal': true,
    'rank-modal': true
  });
  
  // 이미지 분석 탭 상태
  const [activeMapTab, setActiveMapTab] = useState('heatmap');
  
  // 활동량 탭 상태
  const [activeActivityTab, setActiveActivityTab] = useState('total');
  
  // 속력/가속도 탭 상태
  const [activeSpeedTab, setActiveSpeedTab] = useState('speed');
  
  // 선수 카드 포지션 선택 상태
  const [selectedPosition, setSelectedPosition] = useState('GK');
  
  // 실제 분석 데이터 상태
  const [realAnalData, setRealAnalData] = useState(null);
  const [analDataLoading, setAnalDataLoading] = useState(false);

  // 글꼴 로딩 최적화
  useEffect(() => {
    const optimizedDesignFontLoad = async () => {
      try {
        // 글꼴 로딩 중 클래스 추가
        document.body.classList.add('font-loading');
        
        if ('fonts' in document) {
          // 이미 로드된 글꼴이 있는지 확인
          const paperlogyLoaded = document.fonts.check('800 48px Paperlogy-8ExtraBold');
          const pretendardLoaded = document.fonts.check('400 16px Pretendard');
          
          if (!paperlogyLoaded || !pretendardLoaded) {
            // 글꼴이 로드되지 않았다면 강제 로드
            await document.fonts.ready;
            
            if (!paperlogyLoaded) {
              const paperlogyFont = new FontFace('Paperlogy-8ExtraBold', 'url(/font/Paperlogy-8ExtraBold.woff2)');
              await paperlogyFont.load();
              document.fonts.add(paperlogyFont);
            }
            
            if (!pretendardLoaded) {
              const pretendardFont = new FontFace('Pretendard', 'url(/font/Pretendard-Regular.woff2)');
              await pretendardFont.load();
              document.fonts.add(pretendardFont);
            }
          }
          
          // 글꼴 로딩 완료
          document.body.classList.remove('font-loading');
          document.body.classList.add('fonts-loaded');
          console.log('Design page fonts optimized loading completed');
        }
      } catch (error) {
        console.warn('Design page font optimization failed:', error);
        // 오류 시에도 텍스트 표시
        document.body.classList.remove('font-loading');
        document.body.classList.add('fonts-loaded');
      }
    };
    
    // 즉시 실행
    optimizedDesignFontLoad();
  }, []);

  // 실제 분석 데이터 로드
  useEffect(() => {
    const loadRealAnalData = async () => {
      setAnalDataLoading(true);
      try {
        // 실제 쿼터 데이터 조회 (q_752eeb14fbb9)
        const response = await GetQuarterDataApi('u_test', 'q_752eeb14fbb9');
        setRealAnalData(response.data);
        console.log('✅ Real anal data loaded:', response.data);
      } catch (error) {
        console.error('❌ Failed to load real anal data:', error);
        // 에러 시 null 유지
        setRealAnalData(null);
      } finally {
        setAnalDataLoading(false);
      }
    };
    
    // 컴포넌트 섹션이 활성화되면 데이터 로드
    if (activeSection === 'components') {
      loadRealAnalData();
    }
  }, [activeSection]);

  // 복사 기능
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyText(text);
    setTimeout(() => setCopyText(''), 2000);
  };

  // 컴포넌트 카테고리 변경 및 저장
  const handleComponentCategoryChange = (category) => {
    setComponentCategory(category);
    localStorage.setItem('designSystemComponentCategory', category);
  };

  // 색상 팔레트 (아이콘 시스템 기반)
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

  // 전체 아이콘 시스템 - 동적 이미지 로드
  const getIconSrc = (folderName, fileName) => {
    try {
      const image = require(`../../../assets/${folderName}/${fileName}`);
      return image.default || image;
    } catch (err) {
      console.warn(`Icon not found: ${folderName}/${fileName}`);
      return null;
    }
  };

  const createIconData = () => {
    const iconFolders = {
      big_icons: [
        'ground_left_small.png', 'ground_right_small.png', 'logo_black.png', 'logo_gray.png', 'logo_green.png',
        'position_CAM.png', 'position_CB.png', 'position_CDM.png', 'position_CM.png', 'position_GK.png',
        'position_LB.png', 'position_LM.png', 'position_LWB.png', 'position_LWF.png', 'position_LWM.png',
        'position_RB.png', 'position_RM.png', 'position_RWB.png', 'position_RWF.png', 'position_RWM.png',
        'position_ST.png', 'rader.png'
      ],
      card_icons: [
        'blue_card.png', 'green_card.png', 'red_card.png', 'yellow_card.png'
      ],
      color_icons: [
        'alarm_black.png', 'alarm_gray.png', 'alarm_green.png', 'alarm_red.png', 'alarm_white.png', 'alarm_yellow.png', 'alarm_blue.png',
        'check_activate_black.png', 'check_activate_gray.png', 'check_activate_green.png', 'check_activate_red.png',
        'check_activate_white.png', 'check_activate_yellow.png', 'check_activate_blue.png', 'check_black.png', 'check_deactivate_black.png',
        'check_deactivate_gray.png', 'check_deactivate_green.png', 'check_deactivate_red.png', 'check_deactivate_white.png',
        'check_deactivate_yellow.png', 'check_deactivate_blue.png', 'check_gray.png', 'check_green.png', 'check_red.png', 'check_white.png', 'check_yellow.png', 'check_blue.png',
        'info_black.png', 'info_gray.png', 'info_green.png', 'info_red.png', 'info_white.png', 'info_yellow.png', 'info_blue.png',
        'out_black.png', 'out_gray.png', 'out_green.png', 'out_red.png', 'out_white.png', 'out_yellow.png', 'out_blue.png',
        'place_black.png', 'place_gray.png', 'place_green.png', 'place_red.png', 'place_white.png', 'place_yellow.png', 'place_blue.png',
        'question_black.png', 'question_gray.png', 'question_green.png', 'question_red.png', 'question_white.png', 'question_yellow.png', 'question_blue.png'
      ],
      identify_icon: [
        'add.png', 'apple.png', 'calendar.png', 'delete.png', 'edit.png', 'kakao.png',
        'man.png', 'naver.png', 'no_sign.png', 'star.png', 'woman.png', 'yes_sign.png'
      ],
      main_icons: [
        'back_black.png', 'back_gray.png', 'back_white.png', 'bell_activate_black.png', 'bell_activate_gray.png',
        'bell_activate_white.png', 'bell_balck.png', 'bell_gray.png', 'bell_white.png', 'camera_black.png',
        'camera_gray.png', 'camera_white.png', 'clock_black.png', 'clock_gray.png', 'clock_white.png',
        'close_black.png', 'close_gray.png', 'close_white.png', 'down_black.png', 'down_gray.png', 'down_white.png',
        'download_black.png', 'download_gray.png', 'download_white.png', 'eye_black.png', 'eye_gray.png',
        'eye_off_black.png', 'eye_off_gray.png', 'eye_off_white.png', 'eye_white.png', 'file_black.png',
        'folder_black.png', 'folder_gray.png', 'folder_white.png', 'front_black.png', 'front_gray.png', 'front_white.png',
        'graph_black.png', 'graph_gray.png', 'graph_white.png', 'heart_black.png', 'heart_gray.png', 'heart_white.png',
        'line_black.png', 'line_gray.png', 'line_white.png', 'lock_black.png', 'lock_gray.png', 'lock_white.png',
        'option_black.png', 'option_gray.png', 'option_white.png', 'pencil_black.png', 'pencil_gray.png', 'pencil_white.png',
        'play_black.png', 'play_gray.png', 'play_white.png', 'refresh_black.png', 'refresh_gray.png', 'refresh_white.png',
        'search_black.png', 'search_gray.png', 'search_white.png', 'setting_black.png', 'setting_gray.png', 'setting_white.png',
        'share_black.png', 'share_gray.png', 'share_white.png', 'sort_black.png', 'sort_gray.png', 'sort_white.png',
        'team_black.png', 'team_gray.png', 'team_white.png',
        'unlock_black.png', 'unlock_gray.png', 'unlock_white.png', 'up_black.png', 'up_gray.png', 'up_white.png',
        'user_account_black.png', 'user_account_gray.png', 'user_account_white.png', 'user_black.png', 'user_gray.png', 'user_white.png'
      ],
      nav_icons: [
        'anal_black.png', 'anal_gray.png', 'home_black.png', 'home_gray.png', 'nav_anal_black.png', 'nav_anal_gray.png',
        'nav_home_black.png', 'nav_home_gray.png', 'nav_my_black.png', 'nav_my_gray.png', 'nav_upload_black.png',
        'nav_upload_gray.png', 'nav_video_black.png', 'nav_video_gray.png', 'player_black.png', 'player_gray.png',
        'upload_black.png', 'upload_gray.png', 'video_black.png', 'video_gray.png'
      ],
      special_icon: [
        'ground_left.png', 'ground_right.png'
      ],
      text_icon: [
        'logo_text_black.png', 'logo_text_gray.png', 'logo_text_green.png', 'logo_text_white.png'
      ]
    };

    // 아이콘명을 기반으로 카테고리와 용도 자동 분류
    const getCategoryAndUsage = (fileName, folderName) => {
      const name = fileName.replace('.png', '').toLowerCase();
      
      // 폴더별 기본 카테고리
      if (folderName === 'big_icons') {
        if (name.includes('position_')) return { category: 'Position', usage: `${name.replace('position_', '').toUpperCase()} 포지션` };
        if (name.includes('logo_')) return { category: 'Logo', usage: `로고 (${name.replace('logo_', '')})` };
        if (name.includes('ground_')) return { category: 'Ground', usage: '그라운드 아이콘' };
        return { category: 'Big Icons', usage: '대형 아이콘' };
      }
      
      if (folderName === 'card_icons') {
        return { category: 'Card', usage: `${name.replace('_card', '')} 카드` };
      }
      
      if (folderName === 'color_icons') {
        if (name.includes('alarm')) return { category: 'Notification', usage: '알람 아이콘' };
        if (name.includes('check')) return { category: 'Status', usage: '체크 아이콘' };
        if (name.includes('info')) return { category: 'Info', usage: '정보 아이콘' };
        if (name.includes('out')) return { category: 'Action', usage: '나가기 아이콘' };
        if (name.includes('place')) return { category: 'Location', usage: '위치 아이콘' };
        if (name.includes('question')) return { category: 'Help', usage: '질문 아이콘' };
        return { category: 'Color Icons', usage: '컬러 아이콘' };
      }
      
      if (folderName === 'identify_icon') {
        if (name.includes('apple') || name.includes('kakao') || name.includes('naver')) return { category: 'Auth', usage: 'SNS 로그인' };
        if (name.includes('man') || name.includes('woman')) return { category: 'User', usage: '성별 아이콘' };
        if (name.includes('calendar')) return { category: 'Time', usage: '달력' };
        if (name.includes('add')) return { category: 'Action', usage: '추가' };
        if (name.includes('delete')) return { category: 'Action', usage: '삭제' };
        if (name.includes('edit')) return { category: 'Action', usage: '편집' };
        if (name.includes('star')) return { category: 'Rating', usage: '별점/즐겨찾기' };
        if (name.includes('no_sign')) return { category: 'Status', usage: '금지 표시' };
        if (name.includes('yes_sign')) return { category: 'Status', usage: '허용 표시' };
        return { category: 'Identity', usage: '식별 아이콘' };
      }
      
      if (folderName === 'main_icons') {
        if (name.includes('back') || name.includes('front') || name.includes('up') || name.includes('down')) return { category: 'Navigation', usage: '네비게이션' };
        if (name.includes('bell')) return { category: 'Notification', usage: '알림' };
        if (name.includes('camera') || name.includes('play')) return { category: 'Media', usage: '미디어' };
        if (name.includes('graph')) return { category: 'Data', usage: '데이터 시각화' };
        if (name.includes('user') || name.includes('team')) return { category: 'User', usage: '사용자' };
        if (name.includes('lock') || name.includes('unlock')) return { category: 'Security', usage: '보안' };
        if (name.includes('heart') || name.includes('share')) return { category: 'Social', usage: '소셜' };
        if (name.includes('search') || name.includes('setting') || name.includes('option') || name.includes('sort')) return { category: 'Interface', usage: '인터페이스' };
        return { category: 'Main', usage: '메인 아이콘' };
      }
      
      if (folderName === 'nav_icons') {
        return { category: 'Navigation', usage: '네비게이션' };
      }
      
      if (folderName === 'special_icon') {
        return { category: 'Ground', usage: '특별 그라운드' };
      }
      
      return { category: 'Other', usage: '기타' };
    };

    // 모든 아이콘 데이터 생성 및 이미지 동적 로드
    const allIcons = [];
    Object.entries(iconFolders).forEach(([folder, files]) => {
      files.forEach(fileName => {
        const { category, usage } = getCategoryAndUsage(fileName, folder);
        const imageSrc = getIconSrc(folder, fileName);
        
        allIcons.push({
          name: fileName.replace('.png', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `${folder}/${fileName}`,
          folder,
          category,
          usage,
          src: imageSrc // 동적으로 로드된 이미지
        });
      });
    });

    return allIcons;
  };
  
  const allIcons = createIconData();

  // 간격 시스템 (실제 사용 사례 기반)
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
      </div>
    </div>
  );

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
        
        {/* 아이콘 색상 활용 예제 */}
        <div className="color-showcase">
          <h4>🎯 통합 아이콘 색상 시스템</h4>
          <div className="icon-color-demo">
            <div className="demo-row">
              <span className="demo-label">기본 아이콘 색상:</span>
              <div className="demo-icons">
                <div className="demo-icon black">🏠</div>
                <div className="demo-icon gray">🏠</div>
                <div className="demo-icon white">🏠</div>
              </div>
            </div>
            <div className="demo-row">
              <span className="demo-label">상태별 아이콘 색상:</span>
              <div className="demo-icons">
                <div className="demo-icon brand-light">✓</div>
                <div className="demo-icon red">✗</div>
                <div className="demo-icon accent">⚠</div>
                <div className="demo-icon blue">ⓘ</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="code-example">
          <pre><code>{`/* 새로운 브랜드 색상 시스템 */
.primary-button {
  background-color: var(--primary);      /* #055540 - 다크 그린 */
  color: var(--bg-surface);              /* #FFFFFF */
}

.primary-button:hover {
  background-color: var(--primary-hover); /* #079669 - 라이트 그린 */
}

.secondary-button {
  background-color: var(--secondary);     /* #0a5d42 - 미드 그린 */
  color: var(--bg-surface);
}

.accent-button {
  background-color: var(--accent);        /* #f4a100 - 골든 옐로우 */
  color: var(--text-primary);             /* #262626 */
  font-weight: 600;
}

/* 통합 아이콘 색상 시스템 */
.icon-default { color: var(--icon-black); }      /* #000000 */
.icon-inactive { color: var(--icon-gray); }      /* #6B7078 */
.icon-on-dark { color: var(--icon-white); }      /* #FFFFFF */

/* 상태별 아이콘 색상 */
.status-success { color: var(--status-green); }  /* #079669 */
.status-error { color: var(--status-red); }      /* #ef4444 */
.status-warning { color: var(--status-yellow); } /* #f59e0b */
.status-info { color: var(--status-blue); }      /* #3b82f6 */

/* 브랜드 색상 조합 예제 */
.brand-header {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: var(--bg-surface);
}

.cta-section {
  background-color: var(--accent);        /* 강조 섹션 */
  color: var(--text-primary);
}

.nav-icon {
  color: var(--icon-gray);                /* 기본: 회색 */
  transition: color 0.2s ease;
}

.nav-icon.active {
  color: var(--primary);                  /* 활성: 다크 그린 */
}

.nav-icon:hover {
  color: var(--primary-hover);            /* 호버: 라이트 그린 */
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
  const iconsByCategory = allIcons.reduce((acc, icon) => {
    if (!acc[icon.category]) {
      acc[icon.category] = [];
    }
    acc[icon.category].push(icon);
    return acc;
  }, {});

  // 폴더 접기/펼치기 함수
  const toggleFolder = (folderName) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  // 보기 모드 변경 함수
  const toggleViewMode = (folderName, mode) => {
    setViewModes(prev => ({
      ...prev,
      [folderName]: mode
    }));
  };

  // 컴포넌트 코드 접기/펼치기 함수
  const toggleComponentCode = (componentKey) => {
    setComponentCodeCollapsed(prev => ({
      ...prev,
      [componentKey]: !prev[componentKey]
    }));
  };

  // 색상 아이콘 색상 변경 함수
  const getColorIconWithColor = (icon, color = 'black') => {
    const baseName = icon.path.split('/')[1].replace(/_(black|gray|green|red|white|yellow|blue)\.png$/i, '');
    const newFileName = `${baseName}_${color}.png`;
    const newSrc = getIconSrc('color_icons', newFileName);
    
    return newSrc ? {
      ...icon,
      src: newSrc,
      currentColor: color
    } : icon;
  };

  // 메인 아이콘 색상 변경 함수
  const getMainIconWithColor = (icon, color = 'black') => {
    const baseName = icon.path.split('/')[1].replace(/_(black|gray|white)\.png$/i, '');
    const newFileName = `${baseName}_${color}.png`;
    const newSrc = getIconSrc('main_icons', newFileName);
    
    return newSrc ? {
      ...icon,
      src: newSrc,
      currentColor: color
    } : icon;
  };

  // 아이콘 섹션 - 폴더명 기준으로 정리된 아이콘 시스템
  const renderIconsSection = () => {
    // 폴더별 설명
    const folderInfo = {
      'big_icons': {
        title: 'BIG ICONS',
        description: '로고, 포지션, 레이더 차트 등 대형 아이콘',
        purpose: '메인 브랜딩 및 포지션 표시용'
      },
      'card_icons': {
        title: 'CARD ICONS',
        description: '축구 경기에서 사용되는 카드 아이콘',
        purpose: '블루/그린/레드/옐로우 카드 표시용'
      },
      'color_icons': {
        title: 'COLOR ICONS', 
        description: '7가지 색상으로 구성된 상태 표시 아이콘',
        purpose: '다양한 상태와 액션을 컬러로 구분하여 표시'
      },
      'identify_icon': {
        title: 'IDENTIFY ICONS',
        description: 'SNS 로그인, 성별, 액션 등 식별용 아이콘', 
        purpose: '사용자 식별 및 기본 액션용'
      },
      'main_icons': {
        title: 'MAIN ICONS',
        description: '주요 UI에서 사용되는 3색상 아이콘 시스템',
        purpose: 'Black/Gray/White 3색상으로 다양한 테마 대응'
      },
      'nav_icons': {
        title: 'NAV ICONS', 
        description: '내비게이션 바 전용 아이콘',
        purpose: '하단 네비게이션 및 메뉴 표시용'
      },
      'special_icon': {
        title: 'SPECIAL ICONS',
        description: '특수한 그라운드 표시 아이콘',
        purpose: '그라운드 방향 및 특수 상황 표시용'
      },
      'text_icon': {
        title: 'TEXT ICONS',
        description: 'AGROUNDS 텍스트 로고 아이콘',
        purpose: '페이지 하단 브랜딩 및 텍스트 로고 표시용'
      }
    };

    return (
      <div className="design-section">
        <h2>아이콘 시스템</h2>
        <p className="section-description">
          총 <strong>{allIcons.length}개</strong>의 아이콘을 <strong>8개 폴더</strong>에 체계적으로 정리했습니다. 
          각 폴더는 명확한 용도와 목적을 가지고 있어 효율적인 아이콘 관리를 제공합니다.
        </p>

        {/* 폴더별 개요 통계 */}
        <div className="folder-overview">
          <h3>폴더별 아이콘 현황</h3>
          <div className="folder-stats-grid">
            {['main_icons', 'color_icons', 'identify_icon', 'nav_icons', 'big_icons', 'card_icons', 'special_icon', 'text_icon'].map((folderName) => {
              const info = folderInfo[folderName];
              const folderIcons = allIcons.filter(icon => icon.folder === folderName);
              return (
                <div key={folderName} className="folder-stat-card">
                  <div className="folder-header">
                    <div className="folder-meta">
                      <h4>{info.title}</h4>
                      <span className="folder-count">{folderIcons.length}개</span>
                    </div>
                  </div>
                  <p className="folder-description">{info.description}</p>
                  <span className="folder-purpose">{info.purpose}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 폴더별 아이콘 상세 표시 - 지정된 순서로 */}
        {['main_icons', 'color_icons', 'identify_icon', 'nav_icons', 'big_icons', 'card_icons', 'special_icon', 'text_icon'].map((folderName) => {
          const info = folderInfo[folderName];
          const folderIcons = allIcons.filter(icon => icon.folder === folderName);
          const isCollapsed = collapsedFolders[folderName];
          
          return (
            <div key={folderName} className="icon-folder-section">
              <div className="folder-header-detail">
                <div className="folder-title-main">
                  <span className="folder-name">{info.title}</span>
                  <span className="folder-badge">
                    {(() => {
                      let count = folderIcons.length;
                      
                      // COLOR ICONS 필터링된 개수 계산
                      if (folderName === 'color_icons' && colorIconColors[folderName]) {
                        const selectedColor = colorIconColors[folderName];
                        count = folderIcons.filter(icon => {
                          const fileName = icon.path.split('/')[1];
                          return fileName.toLowerCase().includes(`_${selectedColor}.png`);
                        }).length;
                      }
                      
                      // MAIN ICONS 필터링된 개수 계산
                      if (folderName === 'main_icons' && mainIconColors[folderName]) {
                        const selectedColor = mainIconColors[folderName];
                        count = folderIcons.filter(icon => {
                          const fileName = icon.path.split('/')[1];
                          return fileName.toLowerCase().includes(`_${selectedColor}.png`);
                        }).length;
                      }
                      
                      return `${count}개`;
                    })()}
                  </span>
                  
                  {/* 간단/자세히 보기 모드 버튼 */}
                  {!isCollapsed && (
                    <div className="view-mode-buttons">
                      <button 
                        className={`view-mode-btn ${viewModes[folderName] === 'simple' ? 'active' : ''}`}
                        onClick={() => toggleViewMode(folderName, 'simple')}
                      >
                        간단
                      </button>
                      <button 
                        className={`view-mode-btn ${viewModes[folderName] === 'detailed' ? 'active' : ''}`}
                        onClick={() => toggleViewMode(folderName, 'detailed')}
                      >
                        자세히
                      </button>
                    </div>
                  )}
                  
                  <button 
                    className="folder-toggle-btn"
                    onClick={() => toggleFolder(folderName)}
                    aria-label={isCollapsed ? '펼치기' : '접기'}
                  >
                    <img 
                      src={isCollapsed ? downIconBlack : upIconBlack} 
                      alt={isCollapsed ? '펼치기' : '접기'}
                    />
                  </button>
                </div>
                <div className="folder-description-detail">
                  <p>{info.description}</p>
                  <span className="folder-path">/src/assets/{folderName}/</span>
                </div>
                
                {/* 색상 변경 컨트롤 */}
                {(folderName === 'color_icons' || folderName === 'main_icons') && !isCollapsed && (
                  <div className="color-controls">
                    <span className="color-label">색상 선택:</span>
                    <div className="color-buttons">
                      {folderName === 'color_icons' ? (
                        [
                          { name: 'black', displayName: 'Black', bgColor: '#000000' },
                          { name: 'gray', displayName: 'Gray', bgColor: '#6B7078' },
                          { name: 'green', displayName: 'Green', bgColor: '#079669' },
                          { name: 'red', displayName: 'Red', bgColor: '#ef4444' },
                          { name: 'white', displayName: 'White', bgColor: '#FFFFFF' },
                          { name: 'yellow', displayName: 'Yellow', bgColor: '#f59e0b' },
                          { name: 'blue', displayName: 'Blue', bgColor: '#3b82f6' }
                        ].map(({ name, displayName, bgColor }) => (
                          <button
                            key={name}
                            className={`color-swatch-btn ${colorIconColors[folderName] === name ? 'active' : ''}`}
                            title={`${displayName} 색상으로 변경`}
                            onClick={() => {
                              setColorIconColors(prev => ({
                                ...prev,
                                [folderName]: name
                              }));
                            }}
                            style={{ 
                              backgroundColor: bgColor,
                              border: name === 'white' ? '2px solid var(--border)' : '2px solid transparent'
                            }}
                            aria-label={`${displayName} 색상`}
                          >
                            <span className="color-name">{displayName}</span>
                          </button>
                        ))
                      ) : (
                        [
                          { name: 'black', displayName: 'Black', bgColor: '#000000' },
                          { name: 'gray', displayName: 'Gray', bgColor: '#6B7078' },
                          { name: 'white', displayName: 'White', bgColor: '#FFFFFF' }
                        ].map(({ name, displayName, bgColor }) => (
                          <button
                            key={name}
                            className={`color-swatch-btn ${mainIconColors[folderName] === name ? 'active' : ''}`}
                            title={`${displayName} 색상으로 변경`}
                            onClick={() => {
                              setMainIconColors(prev => ({
                                ...prev,
                                [folderName]: name
                              }));
                            }}
                            style={{ 
                              backgroundColor: bgColor,
                              border: name === 'white' ? '2px solid var(--border)' : '2px solid transparent'
                            }}
                            aria-label={`${displayName} 색상`}
                          >
                            <span className="color-name">{displayName}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <div className={`icons-grid ${(folderName === 'big_icons' || folderName === 'special_icon') ? 'large-icons-grid' : ''} ${viewModes[folderName] === 'simple' ? 'simple-mode' : ''}`}>
                  {(() => {
                    let filteredIcons = folderIcons;
                    
                    // COLOR ICONS: 선택된 색상에 해당하는 아이콘만 필터링
                    if (folderName === 'color_icons' && colorIconColors[folderName]) {
                      const selectedColor = colorIconColors[folderName];
                      filteredIcons = folderIcons.filter(icon => {
                        const fileName = icon.path.split('/')[1];
                        return fileName.toLowerCase().includes(`_${selectedColor}.png`);
                      });
                    }
                    
                    // MAIN ICONS: 선택된 색상에 해당하는 아이콘만 필터링
                    if (folderName === 'main_icons' && mainIconColors[folderName]) {
                      const selectedColor = mainIconColors[folderName];
                      filteredIcons = folderIcons.filter(icon => {
                        const fileName = icon.path.split('/')[1];
                        return fileName.toLowerCase().includes(`_${selectedColor}.png`);
                      });
                    }
                    
                    return filteredIcons.map((icon, index) => {
                      const displayIcon = icon;
                      const fileName = displayIcon.path.split('/')[1];
                      const selectedColor = (folderName === 'color_icons' ? colorIconColors[folderName] : 
                                           folderName === 'main_icons' ? mainIconColors[folderName] : null);
                      const isWhiteIcon = selectedColor === 'white';
                    
                      const isSimpleMode = viewModes[folderName] === 'simple';

                      return (
                        <div key={index} className={`icon-item ${(folderName === 'big_icons' || folderName === 'special_icon' || folderName === 'text_icon') ? 'icon-item-large' : ''} ${isSimpleMode ? 'icon-item-simple' : ''}`}>
                          <div className={`icon-display ${isWhiteIcon ? 'white-icon-bg' : ''} ${(folderName === 'big_icons' || folderName === 'special_icon' || folderName === 'text_icon') ? 'icon-display-large' : ''}`}>
                            <div className="icon-image-container">
                              {displayIcon.src ? (
                                <img 
                                  src={displayIcon.src}
                                  alt={displayIcon.name}
                                  className={`icon-image-large ${(folderName === 'big_icons' || folderName === 'special_icon' || folderName === 'text_icon') ? 'icon-image-xl' : ''}`}
                                  loading="lazy"
                                  title={isSimpleMode ? displayIcon.name : ''}
                                />
                              ) : (
                                <div className="icon-placeholder" title={displayIcon.name}>
                                  <span className="icon-name-short">{displayIcon.name.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* 자세히 모드일 때만 상세 정보 표시 */}
                          {!isSimpleMode && (
                            <div className="icon-info">
                              <h4>{displayIcon.name}</h4>
                              <div className="icon-details">
                                <span className="icon-category-tag">{displayIcon.category}</span>
                                <span className="icon-path-code">{fileName}</span>
                                {selectedColor && (
                                  <span className="current-color-tag">{selectedColor.toUpperCase()}</span>
                                )}
                              </div>
                              <p className="icon-usage">{displayIcon.usage}</p>
                              <button 
                                className="copy-path-btn"
                                onClick={() => copyToClipboard(`import ${displayIcon.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')} from '../../../assets/${displayIcon.path}';`)}
                                title="Import 구문 복사"
                              >
                                Import 복사
                              </button>
                            </div>
                          )}
                          
                          {/* 간단 모드일 때는 아이콘 이름만 표시 */}
                          {isSimpleMode && (
                            <div className="icon-simple-name">
                              {displayIcon.name}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          );
        })}
        
        <div className="usage-example">
          <h3>폴더별 사용 가이드라인</h3>
          <div className="folder-guidelines">
            {['main_icons', 'color_icons', 'identify_icon', 'nav_icons', 'big_icons', 'card_icons', 'special_icon'].map((folderName) => {
              const info = folderInfo[folderName];
              return (
              <div key={folderName} className="guideline-folder">
                <h4>{info.title}</h4>
                <div className="guideline-content">
                  <div className="guideline-description">
                    <strong>용도:</strong> {info.description}
                  </div>
                  <div className="guideline-purpose">
                    <strong>목적:</strong> {info.purpose}
                  </div>
                  <div className="guideline-path">
                    <strong>경로:</strong> <code>/src/assets/{folderName}/</code>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
          
          <div className="code-example">
            <h4>폴더별 Import 예제</h4>
            <pre><code>{`// 1. MAIN ICONS - 주요 UI (3색상)
import userBlack from '../../../assets/main_icons/user_black.png';
import userGray from '../../../assets/main_icons/user_gray.png';
import userWhite from '../../../assets/main_icons/user_white.png';

// 2. COLOR ICONS - 상태 표시 (6색상)
import checkGreen from '../../../assets/color_icons/check_green.png';
import alarmRed from '../../../assets/color_icons/alarm_red.png';
import infoBlack from '../../../assets/color_icons/info_black.png';

// 3. IDENTIFY ICONS - 식별 및 인증
import kakaoIcon from '../../../assets/identify_icon/kakao.png';
import manIcon from '../../../assets/identify_icon/man.png';
import appleIcon from '../../../assets/identify_icon/apple.png';
import yesSign from '../../../assets/identify_icon/yes_sign.png';
import noSign from '../../../assets/identify_icon/no_sign.png';

// 4. NAV ICONS - 네비게이션
import homeBlack from '../../../assets/nav_icons/home_black.png';
import analGray from '../../../assets/nav_icons/anal_gray.png';
import navMyBlack from '../../../assets/nav_icons/nav_my_black.png';

// 5. BIG ICONS - 로고 및 포지션 (큰 크기)
import logoGreen from '../../../assets/big_icons/logo_green.png';
import positionST from '../../../assets/big_icons/position_ST.png';
import rader from '../../../assets/big_icons/rader.png';

// 6. CARD ICONS - 축구 카드
import redCard from '../../../assets/card_icons/red_card.png';
import yellowCard from '../../../assets/card_icons/yellow_card.png';

// 7. SPECIAL ICONS - 그라운드 (큰 크기)
import groundLeft from '../../../assets/special_icon/ground_left.png';
import groundRight from '../../../assets/special_icon/ground_right.png';

// 8. TEXT ICONS - 텍스트 로고 (큰 크기)
import logoTextGray from '../../../assets/text_icon/logo_text_gray.png';
import logoTextGreen from '../../../assets/text_icon/logo_text_green.png';
import logoTextBlack from '../../../assets/text_icon/logo_text_black.png';
import logoTextWhite from '../../../assets/text_icon/logo_text_white.png';`}</code></pre>
          </div>
        </div>
      </div>
    );
  };

  const renderComponentsSection = () => (
    <div className="design-section">
      <h2>컴포넌트 시스템</h2>
      <p className="section-description">AGROUNDS 분석 플랫폼에서 사용되는 모든 UI 컴포넌트들을 체계적으로 정리했습니다.</p>
      
      {/* 카테고리 필터 */}
      <div className="component-category-filter" style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        padding: '16px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        flexWrap: 'wrap'
      }}>
        <button
          className={componentCategory === '전체' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleComponentCategoryChange('전체')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: componentCategory === '전체' ? '2px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: componentCategory === '전체' ? 'var(--primary)' : 'var(--bg-surface)',
            color: componentCategory === '전체' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: componentCategory === '전체' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px'
          }}
        >
          전체
        </button>
        <button
          className={componentCategory === '분석관련' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleComponentCategoryChange('분석관련')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: componentCategory === '분석관련' ? '2px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: componentCategory === '분석관련' ? 'var(--primary)' : 'var(--bg-surface)',
            color: componentCategory === '분석관련' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: componentCategory === '분석관련' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px'
          }}
        >
          분석관련
        </button>
        <button
          className={componentCategory === '선수카드' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleComponentCategoryChange('선수카드')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: componentCategory === '선수카드' ? '2px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: componentCategory === '선수카드' ? 'var(--primary)' : 'var(--bg-surface)',
            color: componentCategory === '선수카드' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: componentCategory === '선수카드' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px'
          }}
        >
          선수카드
        </button>
        <button
          className={componentCategory === '모달창' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleComponentCategoryChange('모달창')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: componentCategory === '모달창' ? '2px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: componentCategory === '모달창' ? 'var(--primary)' : 'var(--bg-surface)',
            color: componentCategory === '모달창' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: componentCategory === '모달창' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px'
          }}
        >
          모달창
        </button>
        <button
          className={componentCategory === '일반' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleComponentCategoryChange('일반')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: componentCategory === '일반' ? '2px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: componentCategory === '일반' ? 'var(--primary)' : 'var(--bg-surface)',
            color: componentCategory === '일반' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: componentCategory === '일반' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px'
          }}
        >
          일반
        </button>
      </div>
      
      {/* 차트 & 데이터 시각화 */}
      {(componentCategory === '전체' || componentCategory === '분석관련') && (
      <div className="component-category">
        <h3>차트 & 데이터 시각화</h3>
        <div className="component-grid chart-grid-2col">
          <div className="component-item">
            <div className="component-sample">
              <div className="sample-radar-chart">
                {(() => {
                  // Main.js와 완전히 동일한 레이더 차트
                  const radarChartData = [
                    { label: '참여도', value: 82 },
                    { label: '속력', value: 91 },
                    { label: '가속도', value: 78 },
                    { label: '스프린트', value: 83 },
                    { label: '적극성', value: 75 },
                    { label: '체력', value: 85 }
                  ];

                  const calculateHexagonPoints = (centerX, centerY, radius, values, minValue = 0, maxValue = 100) => {
                    const points = [];
                    const angleStep = 360 / values.length;
                    for (let i = 0; i < values.length; i++) {
                      const angle = (Math.PI / 180) * (i * angleStep - 90);
                      const value = values[i] || 0;
                      const normalizedValue = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
                      const scaledRadius = normalizedValue * radius;
                      const x = centerX + scaledRadius * Math.cos(angle);
                      const y = centerY + scaledRadius * Math.sin(angle);
                      points.push({ x, y, value });
                    }
                    return points;
                  };

                  const getGridHexagonPoints = (centerX, centerY, radius) => {
                    const points = [];
                    const angleStep = 360 / radarChartData.length;
                    for (let i = 0; i < radarChartData.length; i++) {
                      const angle = (Math.PI / 180) * (i * angleStep - 90);
                      const x = centerX + radius * Math.cos(angle);
                      const y = centerY + radius * Math.sin(angle);
                      points.push({ x, y });
                    }
                    return points;
                  };

                  const getLabelPositions = (centerX, centerY, radius) => {
                    return radarChartData.map((item, i) => {
                      const angleStep = 360 / radarChartData.length;
                      const angle = (Math.PI / 180) * (i * angleStep - 90);
                      const labelRadius = radius + 25;
                      const x = centerX + labelRadius * Math.cos(angle);
                      const y = centerY + labelRadius * Math.sin(angle);
                      return { x, y, label: item.label };
                    });
                  };

                  const calculateTotalOVR = () => {
                    const values = radarChartData.map(item => item.value);
                    const sum = values.reduce((acc, val) => acc + val, 0);
                    return Math.round(sum / values.length);
                  };

                  return (
                    <svg width="400" height="400" viewBox="0 0 400 400">
                      <defs>
                        <radialGradient id="designRadarGradient" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgba(34, 197, 94, 0.6)" />
                          <stop offset="70%" stopColor="rgba(34, 197, 94, 0.3)" />
                          <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
                        </radialGradient>
                      </defs>
                      
                      {[0, 25, 50, 75, 100].map((value, index) => {
                        const normalizedValue = value / 100;
                        const radius = normalizedValue * 140;
                        const gridPoints = getGridHexagonPoints(200, 200, radius);
                        return (
                          <polygon
                            key={`grid-${index}`}
                            points={gridPoints.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                          />
                        );
                      })}
                      
                      {getGridHexagonPoints(200, 200, 140).map((point, index) => (
                        <line
                          key={`axis-${index}`}
                          x1="200"
                          y1="200"
                          x2={point.x}
                          y2={point.y}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {(() => {
                        const values = radarChartData.map(item => item.value);
                        const dataPoints = calculateHexagonPoints(200, 200, 140, values);
                        return (
                          <polygon
                            points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="url(#designRadarGradient)"
                            stroke="#22c55e"
                            strokeWidth="2"
                          />
                        );
                      })()}
                      
                      {getLabelPositions(200, 200, 140).map((pos, index) => (
                        <g key={`label-group-${index}`}>
                          <text
                            x={pos.x}
                            y={pos.y - 8}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="14"
                            fontWeight="600"
                            fill="#374151"
                          >
                            {pos.label}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y + 8}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="12"
                            fontWeight="500"
                            fill="#6B7280"
                          >
                            {radarChartData[index].value || 0}
                          </text>
                        </g>
                      ))}
                      
                      <text
                        x="200"
                        y="200"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="48"
                        fontWeight="800"
                        fill="#000000"
                      >
                        {calculateTotalOVR()}
                      </text>
                    </svg>
                  );
                })()}
              </div>
              
              <button 
                className="code-toggle-btn-inner"
                onClick={() => toggleComponentCode('radar-chart')}
              >
                {componentCodeCollapsed['radar-chart'] ? '코드 보기' : '코드 숨기기'} 
                <span className={`toggle-icon ${componentCodeCollapsed['radar-chart'] ? '' : 'expanded'}`}>▼</span>
              </button>
            </div>
            <h4>레이더 차트 (육각형)</h4>
            
            {!componentCodeCollapsed['radar-chart'] && (
              <div className="component-code">
                <pre><code>{`// 🎯 레이더 차트 - Main.js에서 실제 사용
  const radarChartData = [
  { label: '참여도', value: calculateParticipation() },
  { label: '속력', value: radarData.point_speed || 0 },
  { label: '가속도', value: radarData.point_acceleration || 0 },
  { label: '스프린트', value: radarData.point_sprint || 0 },
  { label: '적극성', value: radarData.point_positiveness || 0 },
  { label: '체력', value: radarData.point_stamina || 0 }
];

// 육각형 배경 그리드 (0 ~ 100 범위), SVG 400x400
// 중앙 (200, 200), 반지름 140

// 헬퍼 함수들
const calculateHexagonPoints = (centerX, centerY, radius, values, minValue = 0, maxValue = 100) => {
  const points = [];
  const angleStep = 360 / values.length;
  for (let i = 0; i < values.length; i++) {
    const angle = (Math.PI / 180) * (i * angleStep - 90); // -90도에서 시작 (상단부터)
    const value = values[i] || 0;
    const normalizedValue = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
    const scaledRadius = normalizedValue * radius;
    const x = centerX + scaledRadius * Math.cos(angle);
    const y = centerY + scaledRadius * Math.sin(angle);
    points.push({ x, y, value });
  }
  return points;
};

// 중앙 OVR 값 표시
<text x="200" y="200" fontSize="48" fontWeight="800" fill="#000000">
  {calculateTotalOVR()}
</text>`}</code></pre>
              </div>
            )}
          </div>


          <div className="component-item">
            <div className="component-sample">
              <div className="sample-stats-trends">
                {(() => {
                  // Main.js와 완전히 동일한 지표 추이
                  const miniChartData = {
                    point_total: [68, 72, 75, 78, 82],
                    distance: [8.2, 8.5, 8.9, 9.1, 9.3],
                    max_speed: [22.5, 23.1, 24.2, 23.8, 24.5],
                    sprint: [45, 48, 52, 50, 54]
                  };

                  const createSmoothPath = (data, width, height) => {
                    if (data.length < 2) return { path: '', points: [] };
                    
                    const max = Math.max(...data, 1);
                    const min = Math.min(...data);
                    const range = max - min || 1;
                    
                    const paddingLeft = 10;
                    const paddingRight = 20;
                    const paddingTop = 6;
                    const paddingBottom = 6;
                    const innerWidth = Math.max(1, width - paddingLeft - paddingRight);
                    const innerHeight = Math.max(1, height - paddingTop - paddingBottom);

                    const points = data.map((value, index) => ({
                      x: paddingLeft + (index / (data.length - 1)) * innerWidth,
                      y: paddingTop + innerHeight - ((value - min) / range) * innerHeight
                    }));
                    
                    let path = `M ${points[0].x} ${points[0].y}`;
                    
                    for (let i = 1; i < points.length; i++) {
                      const prev = points[i - 1];
                      const curr = points[i];
                      
                      if (i === 1) {
                        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                        const cp1y = prev.y;
                        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                        const cp2y = curr.y;
                        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                      } else {
                        const prevPrev = points[i - 2];
                        const cp1x = prev.x + (curr.x - prevPrev.x) * 0.15;
                        const cp1y = prev.y + (curr.y - prevPrev.y) * 0.15;
                        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                        const cp2y = curr.y;
                        path += ` S ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                      }
                    }
                    
                    return { path, points };
                  };

                  const createMiniChart = (data, color = '#22c55e', width = 160, height = 36) => {
                    const { path, points } = createSmoothPath(data, width, height);
                    if (points.length === 0) return null;
                    
                    const lastPoint = points[points.length - 1];
                    const firstPoint = points[0];
                  
                  return (
                      <svg 
                        width={width} 
                        height={height} 
                        viewBox={`0 0 ${width} ${height}`}
                        preserveAspectRatio="xMidYMid meet"
                        className="mini-chart"
                      >
                        <path
                          d={path}
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle
                          cx={firstPoint.x}
                          cy={firstPoint.y}
                          r="2.5"
                          fill="#ffffff"
                          stroke={color}
                          strokeWidth="1.5"
                        />
                        <circle
                          cx={lastPoint.x}
                          cy={lastPoint.y}
                          r="2.5"
                          fill={color}
                        />
                      </svg>
                    );
                  };
                  
                  return (
                    <div className="stats-trends-container">
                      
                      <div className="stats-cards-grid">
                        <div className="stat-trend-card">
                          <h4 className="stat-trend-label">평점</h4>
                          <div className="stat-trend-content">
                            <div className="stat-trend-chart">
                              {createMiniChart(miniChartData.point_total, '#22c55e')}
                            </div>
                            <div className="stat-trend-value">
                              {Math.round(miniChartData.point_total[4]) || 0}<span className="stat-unit">점</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="stat-trend-card">
                          <h4 className="stat-trend-label">이동거리</h4>
                          <div className="stat-trend-content">
                            <div className="stat-trend-chart">
                              {createMiniChart(miniChartData.distance, '#ef4444')}
                          </div>
                            <div className="stat-trend-value">
                              {(miniChartData.distance[4] || 0).toFixed(2)}<span className="stat-unit">km</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="stat-trend-card">
                          <h4 className="stat-trend-label">최고속력</h4>
                          <div className="stat-trend-content">
                            <div className="stat-trend-chart">
                              {createMiniChart(miniChartData.max_speed, '#3b82f6')}
                            </div>
                            <div className="stat-trend-value">
                              {(miniChartData.max_speed[4] || 0).toFixed(1)}<span className="stat-unit">km/h</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="stat-trend-card">
                          <h4 className="stat-trend-label">스프린트</h4>
                          <div className="stat-trend-content">
                            <div className="stat-trend-chart">
                              {createMiniChart(miniChartData.sprint, '#8b5cf6')}
                            </div>
                            <div className="stat-trend-value">
                              {Math.round(miniChartData.sprint[4]) || 0}<span className="stat-unit">회</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <button 
                className="code-toggle-btn-inner"
                onClick={() => toggleComponentCode('activity-ratio')}
              >
                {componentCodeCollapsed['activity-ratio'] ? '코드 보기' : '코드 숨기기'} 
                <span className={`toggle-icon ${componentCodeCollapsed['activity-ratio'] ? '' : 'expanded'}`}>▼</span>
              </button>
            </div>
            <h4>지표 추이 카드</h4>
            
            {!componentCodeCollapsed['activity-ratio'] && (
              <div className="component-code">
                <pre><code>{`// 📊 지표 추이 - Main.js에서 실제 사용
const createMiniChart = (data, color = '#22c55e', width = 160, height = 36) => {
  const { path, points } = createSmoothPath(data, width, height);
  return (
    <svg width={width} height={height}>
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
      <circle cx={firstPoint.x} cy={firstPoint.y} r="2.5" 
              fill="#ffffff" stroke={color} strokeWidth="1.5" />
      <circle cx={lastPoint.x} cy={lastPoint.y} r="2.5" fill={color} />
    </svg>
  );
};

<div className="stat-card">
  <h4>평점</h4>
  <div className="stat-content">
    <div className="stat-chart">
      {createMiniChart(miniChartData.point_total, '#22c55e')}
      </div>
    <div className="stat-number">82<span>점</span></div>
      </div>
    </div>

// 색상: 평점(#22c55e), 이동거리(#ef4444), 최고속력(#3b82f6), 스프린트(#8b5cf6)`}</code></pre>
  </div>
            )}
</div>

          <div className="component-item">
            <div className="component-sample">
              <div className="sample-image-analysis">
                {(() => {
                  // Anal_Detail.js와 완전히 동일한 이미지 분석 (실제 API 데이터 사용)
                  
                  // processHeatmapData 함수 (Anal_Detail.js와 완전히 동일)
                  const processHeatmapData = (tHmapData) => {
                    if (!tHmapData || !tHmapData.layers || tHmapData.layers.length === 0) {
                      return null;
                    }

                    try {
                      const layer = tHmapData.layers[0];
                      const { shape, b64, dtype } = layer;
                      
                      if (!shape || !b64) return null;
                      
                      const [height, width] = shape;
                      
                      // Base64 디코딩
                      const binaryString = atob(b64);
                      const bytes = new Uint8Array(binaryString.length);
                      for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                      }
                      
                      // 데이터 타입에 따른 처리
                      let dataArray;
                      if (dtype === 'uint16') {
                        dataArray = new Uint16Array(bytes.buffer);
                        dataArray = Array.from(dataArray).map(val => val / 10.0);
                      } else {
                        dataArray = new Float32Array(bytes.buffer);
                      }
                      
                      // 2D 배열로 변환
                      const heatmapArray = [];
                      for (let i = 0; i < height; i++) {
                        const row = [];
                        for (let j = 0; j < width; j++) {
                          row.push(dataArray[i * width + j]);
                        }
                        heatmapArray.push(row);
                      }
                      
                      return {
                        data: heatmapArray,
                        width,
                        height,
                        maxValue: Math.max(...dataArray)
                      };
                    } catch (error) {
                      console.error('Heatmap processing error:', error);
                      return null;
                    }
                  };
                  
                  // 가우시안 스무딩 적용 (Anal_Detail.js와 동일)
                  const applyGaussianSmoothing = (data, sigma = 1.5) => {
                    if (!data || data.length === 0 || sigma <= 0) return data;
                    
                    const height = data.length;
                    const width = data[0].length;
                    const smoothed = Array(height).fill().map(() => Array(width).fill(0));
                    
                    const kernelSize = Math.ceil(3 * sigma) * 2 + 1;
                    const center = Math.floor(kernelSize / 2);
                    const kernel = [];
                    
                    for (let i = 0; i < kernelSize; i++) {
                      kernel[i] = [];
                      for (let j = 0; j < kernelSize; j++) {
                        const x = i - center;
                        const y = j - center;
                        kernel[i][j] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
                      }
                    }
                    
                    let kernelSum = 0;
                    for (let i = 0; i < kernelSize; i++) {
                      for (let j = 0; j < kernelSize; j++) {
                        kernelSum += kernel[i][j];
                      }
                    }
                    
                    for (let i = 0; i < kernelSize; i++) {
                      for (let j = 0; j < kernelSize; j++) {
                        kernel[i][j] /= kernelSum;
                      }
                    }
                    
                    for (let i = 0; i < height; i++) {
                      for (let j = 0; j < width; j++) {
                        let sum = 0;
                        let weightSum = 0;
                        
                        for (let ki = 0; ki < kernelSize; ki++) {
                          for (let kj = 0; kj < kernelSize; kj++) {
                            const ii = i + ki - center;
                            const jj = j + kj - center;
                            
                            if (ii >= 0 && ii < height && jj >= 0 && jj < width) {
                              sum += data[ii][jj] * kernel[ki][kj];
                              weightSum += kernel[ki][kj];
                            }
                          }
                        }
                        
                        smoothed[i][j] = weightSum > 0 ? sum / weightSum : 0;
                      }
                    }
                    
                    return smoothed;
                  };
                  
                  // generateHeatmap 함수 (Anal_Detail.js와 완전히 동일)
                  const generateHeatmap = (tHmapData, standard = "north", home = "west", status = "normal") => {
                    const processedData = processHeatmapData(tHmapData);
                    
                    if (!processedData) {
                      return (
                        <div className="design-heatmap-container">
                          <div className="design-heatmap-placeholder">
                            <p className="text-body">히트맵 데이터가 없습니다</p>
              </div>
          </div>
                      );
                    }

                    // 가우시안 스무딩 적용
                    const smoothedData = applyGaussianSmoothing(processedData.data, 1.5);
                    
                    // p95 정규화
                    let vmax = 1.0;
                    if (smoothedData.length > 0) {
                      const flatData = smoothedData.flat().filter(val => val > 0);
                      if (flatData.length > 0) {
                        const sortedData = flatData.sort((a, b) => a - b);
                        const p95Index = Math.floor(sortedData.length * 0.95);
                        vmax = sortedData[p95Index];
                      } else {
                        vmax = Math.max(...smoothedData.flat());
                      }
                      if (vmax <= 0) vmax = 1.0;
                    }
                    
                    // 데이터 경계 분석
                    const dataHeight = smoothedData.length;
                    const dataWidth = smoothedData[0] ? smoothedData[0].length : 0;
                    
                    let minX = dataWidth, maxX = 0, minY = dataHeight, maxY = 0;
                    let hasData = false;
                    
                    for (let i = 0; i < dataHeight; i++) {
                      for (let j = 0; j < dataWidth; j++) {
                        if (smoothedData[i][j] > 0) {
                          hasData = true;
                          minX = Math.min(minX, j);
                          maxX = Math.max(maxX, j);
                          minY = Math.min(minY, i);
                          maxY = Math.max(maxY, i);
                        }
                      }
                    }
                    
                    // 경기장 이미지 선택
                    const fieldWidth = 360;
                    const fieldHeight = 240;
                    
                    const isAttackPhase = status === "attack" || status === "offensive" || status === "attacking";
                    const isDefensePhase = status === "defense" || status === "defensive" || status === "defending";
                    
                    let fieldImage;
                    if (isAttackPhase) {
                      if (standard === "south") {
                        fieldImage = home === "east" ? groundRight : groundLeft;
                      } else {
                        fieldImage = home === "west" ? groundRight : groundLeft;
                      }
                    } else if (isDefensePhase) {
                      if (standard === "south") {
                        fieldImage = home === "west" ? groundRight : groundLeft;
                      } else {
                        fieldImage = home === "east" ? groundRight : groundLeft;
                      }
                    } else {
                      fieldImage = (standard === "south" && home === "east") || 
                                   (standard === "north" && home === "west") ? groundRight : groundLeft;
                    }
                    
                    const extent = standard === "south" ? [90, 0, 60, 0] : [0, 90, 0, 60];
                    
                      return (
                      <div className="design-heatmap-container">
                        <div className="design-heatmap-field">
                          <img src={fieldImage} alt="경기장" className="field-bg" />
                          <svg viewBox="0 0 360 240" className="design-heatmap-svg">
                            {hasData && (
                              <>
                                <defs>
                                  <filter id="designGaussianBlur" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="1.5"/>
                                  </filter>
                                </defs>
                                
                                <g filter="url(#designGaussianBlur)" opacity="0.6">
                                  {smoothedData.map((row, i) => 
                                    row.map((value, j) => {
                                      if (value <= 0) return null;
                                      
                                      // 정규화
                                      const normalizedValue = Math.min(Math.max(value / vmax, 0.0), 1.0);
                                      
                                      // extent에 따른 좌표 변환
                                      const normalizedX = j / (dataWidth - 1);
                                      const normalizedY = i / (dataHeight - 1);
                                      
                                      let x, y;
                                      if (standard === "south") {
                                        x = 90 - (normalizedX * 90);
                                        y = 60 - (normalizedY * 60);
                                      } else {
                                        x = normalizedX * 90;
                                        y = normalizedY * 60;
                                      }
                                      
                                      // SVG 좌표로 변환 (0.95배 축소)
                                      const scale = 0.95;
                                      const offsetX = fieldWidth * (1 - scale) / 2;
                                      const offsetY = fieldHeight * (1 - scale) / 2;
                                      
                                      const svgX = (x / 90) * fieldWidth * scale + offsetX;
                                      const svgY = (1 - y / 60) * fieldHeight * scale + offsetY;
                                      
                                      // 색상 계산
                                      const intensity = normalizedValue;
                                      let red, green, blue;
                                      
                                      if (intensity <= 0.0) {
                                        red = green = blue = 0;
                                      } else if (intensity < 0.25) {
                                        const t = intensity / 0.25;
                                        red = 0;
                                        green = Math.floor(100 * t);
                                        blue = Math.floor(255 * t);
                                      } else if (intensity < 0.5) {
                                        const t = (intensity - 0.25) / 0.25;
                                        red = 0;
                                        green = Math.floor(100 + 155 * t);
                                        blue = 255;
                                      } else if (intensity < 0.75) {
                                        const t = (intensity - 0.5) / 0.25;
                                        red = Math.floor(255 * t);
                                        green = 255;
                                        blue = Math.floor(255 * (1 - t));
                                      } else {
                                        const t = (intensity - 0.75) / 0.25;
                                        red = 255;
                                        green = Math.floor(255 * (1 - t));
                                        blue = 0;
                                      }
                                      
                                      const radius = Math.max(1, Math.min(4, normalizedValue * 3 + 1));
                                      
                                      return (
                                        <circle
                                          key={`heatmap-${i}-${j}`}
                                          cx={svgX}
                                          cy={svgY}
                                          r={radius}
                                          fill={`rgb(${red}, ${green}, ${blue})`}
                                          opacity={Math.max(0.1, normalizedValue * 0.8)}
                                          className="heatmap-point"
                                        />
                                      );
                                    })
                                  )}
                                </g>
                              </>
                            )}
                          </svg>
                        </div>
                        <p className="design-map-legend">※ 파랑색: 낮은 체류시간, 빨간색: 높은 체류시간</p>
                        </div>
                      );
                  };
                  
                  // processSprintData 함수 (Anal_Detail.js와 완전히 동일)
                  const processSprintData = (smapData) => {
                    if (!smapData || !smapData.layers || smapData.layers.length < 3) {
                      return null;
                    }

                    try {
                      const countLayer = smapData.layers[0];
                      const angleLayer = smapData.layers[1];
                      const vmaxLayer = smapData.layers[2];

                      const count = processHeatmapData({ layers: [countLayer] });
                      const angle = processHeatmapData({ layers: [angleLayer] });
                      const vmax = processHeatmapData({ layers: [vmaxLayer] });

                      if (!count || !angle || !vmax) {
                        return null;
                      }

                      return {
                        count: count.data,
                        angle: angle.data,
                        vmax: vmax.data,
                        width: count.width,
                        height: count.height,
                        maxVmax: Math.max(...vmax.data.flat())
                      };
                    } catch (error) {
                      console.error('Sprint processing error:', error);
                      return null;
                    }
                  };
                  
                  // generateSprintArrows 함수 (Anal_Detail.js와 완전히 동일)
                  const generateSprintArrows = (sprintData, standard = "north", home = "west") => {
                    if (!sprintData) {
                    return (
                        <div className="design-heatmap-container">
                          <div className="design-heatmap-placeholder">
                            <p className="text-body">스프린트 데이터가 없습니다</p>
                            <p className="text-caption" style={{marginTop: '8px', color: '#8A8F98'}}>
                              이 쿼터에서는 스프린트 활동이 기록되지 않았습니다
                            </p>
                        </div>
                        </div>
                      );
                    }

                    const fieldWidth = 360;
                    const fieldHeight = 240;
                    
                    let fieldImage;
                    fieldImage = (standard === "south" && home === "east") || 
                                 (standard === "north" && home === "west") ? groundRight : groundLeft;

                    const extent = standard === "south" ? [90, 0, 60, 0] : [0, 90, 0, 60];
                    const level_3 = 24.0;
                    const level_2 = 21.0;
                    const maxLen = 32.0;

                    return (
                      <div className="design-heatmap-container">
                        <div className="design-heatmap-field">
                          <img src={fieldImage} alt="경기장" className="field-bg" />
                          <svg viewBox="0 0 360 240" className="design-heatmap-svg">
                            {sprintData.count.map((row, i) => 
                              row.map((count, j) => {
                                if (count <= 0) return null;
                                
                                const angle = sprintData.angle[i][j];
                                const vmax = sprintData.vmax[i][j];
                                const length = (vmax / sprintData.maxVmax) * maxLen;
                                
                                const normalizedX = j / (sprintData.width - 1);
                                const normalizedY = i / (sprintData.height - 1);
                                
                                let x, y;
                                if (standard === "south") {
                                  x = 90 - (normalizedX * 90);
                                  y = 60 - (normalizedY * 60);
                                } else {
                                  x = normalizedX * 90;
                                  y = normalizedY * 60;
                                }
                                
                                const scale = 0.95;
                                const offsetX = fieldWidth * (1 - scale) / 2;
                                const offsetY = fieldHeight * (1 - scale) / 2;
                                
                                const svgX = (x / 90) * fieldWidth * scale + offsetX;
                                const svgY = (1 - y / 60) * fieldHeight * scale + offsetY;
                                
                                const dx = length * Math.cos(angle * Math.PI / 180);
                                const dy = length * Math.sin(angle * Math.PI / 180);
                                
                                let color;
                                if (vmax >= level_3) {
                                  color = "#F90716";
                                } else if (vmax >= level_2) {
                                  color = "#FF5403";
                                } else {
                                  color = "#FFCA03";
                                }
                                
                                const arrowHeadSize = 8;
                                const arrowAngle = angle * Math.PI / 180;
                                const headOffset = -4;
                                const headBaseX = (svgX + dx) - headOffset * Math.cos(arrowAngle);
                                const headBaseY = (svgY + dy) - headOffset * Math.sin(arrowAngle);
                                
                                const headX1 = headBaseX - arrowHeadSize * Math.cos(arrowAngle - Math.PI / 6);
                                const headY1 = headBaseY - arrowHeadSize * Math.sin(arrowAngle - Math.PI / 6);
                                const headX2 = headBaseX - arrowHeadSize * Math.cos(arrowAngle + Math.PI / 6);
                                const headY2 = headBaseY - arrowHeadSize * Math.sin(arrowAngle + Math.PI / 6);
                                
                                return (
                                  <g key={`sprint-${i}-${j}`}>
                                    <line
                                      x1={svgX}
                                      y1={svgY}
                                      x2={svgX + dx}
                                      y2={svgY + dy}
                            stroke={color}
                                      strokeWidth="4"
                                      opacity="0.85"
                                    />
                                    <polygon
                                      points={`${headBaseX},${headBaseY} ${headX1},${headY1} ${headX2},${headY2}`}
                                      fill={color}
                                      opacity="0.85"
                                    />
                                  </g>
                                );
                              })
                            )}
                        </svg>
                        </div>
                        <p className="design-map-legend">※ 방향과 속도를 표시합니다 (빨강: 고속, 주황: 중간, 노랑: 저속)</p>
                      </div>
                    );
                  };

                  // processDirectionData 함수 (Anal_Detail.js와 완전히 동일)
                  const processDirectionData = (dmapData) => {
                    if (!dmapData || !dmapData.layers || dmapData.layers.length < 2) {
                      return null;
                    }

                    try {
                      const ldtLayer = dmapData.layers[0];
                      const hdtLayer = dmapData.layers[1];

                      const ldt = processHeatmapData({ layers: [ldtLayer] });
                      const hdt = processHeatmapData({ layers: [hdtLayer] });

                      if (!ldt || !hdt) {
                        return null;
                      }

                      return {
                        ldt: ldt.data,
                        hdt: hdt.data,
                        width: ldt.width,
                        height: ldt.height
                      };
                    } catch (error) {
                      console.error('Direction processing error:', error);
                      return null;
                    }
                  };
                  
                  // generateDirectionPoints 함수 (Anal_Detail.js와 완전히 동일)
                  const generateDirectionPoints = (directionData, standard = "north", home = "west") => {
                    if (!directionData) {
                      return (
                        <div className="design-heatmap-container">
                          <div className="design-heatmap-placeholder">
                            <p className="text-body">방향전환 데이터가 없습니다</p>
                            <p className="text-caption" style={{marginTop: '8px', color: '#8A8F98'}}>
                              이 쿼터에서는 방향전환 활동이 기록되지 않았습니다
                            </p>
                          </div>
                        </div>
                      );
                    }

                    const fieldWidth = 360;
                    const fieldHeight = 240;
                    
                    let fieldImage;
                    fieldImage = (standard === "south" && home === "east") || 
                                 (standard === "north" && home === "west") ? groundRight : groundLeft;

                    const extent = standard === "south" ? [90, 0, 60, 0] : [0, 90, 0, 60];

                    return (
                      <div className="design-heatmap-container">
                        <div className="design-heatmap-field">
                          <img src={fieldImage} alt="경기장" className="field-bg" />
                          <svg viewBox="0 0 360 240" className="design-heatmap-svg">
                            {/* LDT (저각 방향전환) - 주황색 */}
                            {directionData.ldt.map((row, i) => 
                              row.map((value, j) => {
                                if (value <= 0) return null;
                                
                                const normalizedX = j / (directionData.width - 1);
                                const normalizedY = i / (directionData.height - 1);
                                
                                let x, y;
                                if (standard === "south") {
                                  x = 90 - (normalizedX * 90);
                                  y = 60 - (normalizedY * 60);
                                } else {
                                  x = normalizedX * 90;
                                  y = normalizedY * 60;
                                }
                                
                                const scale = 0.95;
                                const offsetX = fieldWidth * (1 - scale) / 2;
                                const offsetY = fieldHeight * (1 - scale) / 2;
                                
                                const svgX = (x / 90) * fieldWidth * scale + offsetX;
                                const svgY = (1 - y / 60) * fieldHeight * scale + offsetY;
                                
                                return (
                                  <circle
                                    key={`ldt-${i}-${j}`}
                                    cx={svgX}
                                    cy={svgY}
                                    r="3"
                                    fill="#FFA500"
                                    opacity="0.85"
                                  />
                                );
                              })
                            )}
                            
                            {/* HDT (고각 방향전환) - 빨간색 */}
                            {directionData.hdt.map((row, i) => 
                              row.map((value, j) => {
                                if (value <= 0) return null;
                                
                                const normalizedX = j / (directionData.width - 1);
                                const normalizedY = i / (directionData.height - 1);
                                
                                let x, y;
                                if (standard === "south") {
                                  x = 90 - (normalizedX * 90);
                                  y = 60 - (normalizedY * 60);
                                } else {
                                  x = normalizedX * 90;
                                  y = normalizedY * 60;
                                }
                                
                                const scale = 0.95;
                                const offsetX = fieldWidth * (1 - scale) / 2;
                                const offsetY = fieldHeight * (1 - scale) / 2;
                                
                                const svgX = (x / 90) * fieldWidth * scale + offsetX;
                                const svgY = (1 - y / 60) * fieldHeight * scale + offsetY;
                                
                                return (
                                  <circle
                                    key={`hdt-${i}-${j}`}
                                    cx={svgX}
                                    cy={svgY}
                                    r="3"
                                    fill="#FF3300"
                                    opacity="0.85"
                                  />
                                );
                              })
                            )}
                          </svg>
                        </div>
                        <p className="design-map-legend">※ 방향 변화를 표시합니다 (주황: 완만한 방향전환, 빨강: 급격한 방향전환)</p>
                      </div>
                    );
                  };
                  
                  // 실제 API 데이터 사용
                  if (analDataLoading) {
                    return (
                      <div className="image-analysis-wrapper">
                        <div className="design-loading-state">
                          <p className="text-body">실제 분석 데이터를 불러오는 중...</p>
                        </div>
                      </div>
                    );
                  }
                  
                  if (!realAnalData) {
                    return (
                      <div className="image-analysis-wrapper">
                        <div className="design-error-state">
                          <p className="text-body">분석 데이터를 불러올 수 없습니다</p>
                          <p className="text-caption" style={{marginTop: '8px', color: 'var(--text-secondary)'}}>
                            쿼터 코드: q_6ed76e24ac34
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  // 실제 데이터 사용
                  const heatmapData = realAnalData.total_data?.heatmap_data;
                  const sprintData = realAnalData.total_data?.sprint_map_data;
                  const directionData = realAnalData.total_data?.direction_map_data;
                  const standard = realAnalData.match_info?.standard || "north";
                  const home = realAnalData.quarter_info?.home || "west";
                  const status = realAnalData.quarter_info?.status || "normal";
                  
                  return (
                    <div className="image-analysis-wrapper">
                      <div className="design-map-tabs">
                        <button
                          className={`design-map-tab ${activeMapTab === 'heatmap' ? 'active' : ''}`}
                          onClick={() => setActiveMapTab('heatmap')}
                        >
                          히트맵
                        </button>
                        <button
                          className={`design-map-tab ${activeMapTab === 'sprint' ? 'active' : ''}`}
                          onClick={() => setActiveMapTab('sprint')}
                        >
                          스프린트
                        </button>
                        <button
                          className={`design-map-tab ${activeMapTab === 'direction' ? 'active' : ''}`}
                          onClick={() => setActiveMapTab('direction')}
                        >
                          방향전환
                        </button>
                      </div>
                      <div className="design-map-content">
                        {activeMapTab === 'heatmap' && generateHeatmap(heatmapData, standard, home, status)}
                        {activeMapTab === 'sprint' && generateSprintArrows(processSprintData(sprintData), standard, home)}
                        {activeMapTab === 'direction' && generateDirectionPoints(processDirectionData(directionData), standard, home)}
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <button 
                className="code-toggle-btn-inner"
                onClick={() => toggleComponentCode('line-chart')}
              >
                {componentCodeCollapsed['line-chart'] ? '코드 보기' : '코드 숨기기'} 
                <span className={`toggle-icon ${componentCodeCollapsed['line-chart'] ? '' : 'expanded'}`}>▼</span>
              </button>
            </div>
            <h4>이미지 분석 (히트맵/스프린트/방향전환)</h4>
            
            {!componentCodeCollapsed['line-chart'] && (
              <div className="component-code">
                <pre><code>{`// 🗺️ 이미지 분석 - Anal_Detail.js에서 실제 사용
// 실제 데이터베이스 구조:
// - T_HMAP: { layers: [{ shape: [30, 50], b64: "...", dtype: "uint16" }] }
// - T_SMAP: { layers: [countLayer, angleLayer, vmaxLayer] } // 3개 레이어
// - T_DMAP: { layers: [ldtLayer, hdtLayer] } // 2개 레이어

// 히트맵 (30x50 그리드)
const processHeatmapData = (tHmapData) => {
  const layer = tHmapData.layers[0];
  const [height, width] = layer.shape; // [30, 50]
  // Base64 디코딩 -> Uint16Array -> 2D 배열
  // 가우시안 스무딩 적용 (sigma=1.5)
  // p95 정규화
};

// 스프린트맵 (count, angle, vmax)
const processSprintData = (smapData) => {
  return {
    count: count.data,  // 스프린트 발생 횟수
    angle: angle.data,  // 이동 방향 (0-360도)
    vmax: vmax.data     // 최고 속도 (km/h)
  };
};

// 방향전환 (ldt, hdt)
const processDirectionData = (dmapData) => {
  return {
    ldt: ldt.data,  // 저각 방향전환 (완만)
    hdt: hdt.data   // 고각 방향전환 (급격)
  };
};`}</code></pre>
              </div>
            )}
          </div>

          <div className="component-item">
            <div className="component-sample">
              <div className="sample-activity-bars">
                {(() => {
                  // Anal_Detail.js와 완전히 동일한 활동량 막대 그래프
                  
                  if (!realAnalData) {
    return (
                      <div className="activity-loading">
                        <p className="text-body">활동량 데이터를 불러오는 중...</p>
      </div>
    );
  }

                  // formatValue 함수
                  const formatValue = (value, unit = '') => {
                    if (value === null || value === undefined) return `- ${unit}`;
                    return `${value} ${unit}`;
                  };
                  
                  // 공격/수비 비율 계산
                  const attackPercentage = parseFloat(realAnalData.attack_data?.time_percentage || 0);
                  const defensePercentage = parseFloat(realAnalData.defense_data?.time_percentage || 0);
                  const total = attackPercentage + defensePercentage;
                  
                  let normalizedAttack = 50;
                  let normalizedDefense = 50;
                  
                  if (total > 0) {
                    normalizedAttack = (attackPercentage / total) * 100;
                    normalizedDefense = (defensePercentage / total) * 100;
                  }
  
  return (
                    <div className="activity-bars-container">
                      {/* 공격/수비 비율 막대 */}
                      <div className="design-activity-ratio-chart">
                        <div className="design-ratio-bar-container">
                          <div className="design-ratio-labels">
                            <span className="design-ratio-label-left text-caption">공격</span>
                            <span className="design-ratio-label-right text-caption">수비</span>
      </div>
                          
                          <div className="design-ratio-bar">
                            <div 
                              className="design-ratio-attack" 
                              style={{
                                width: `${normalizedAttack}%`,
                                backgroundColor: '#FF4444'
                              }}
                            >
                              <span className="design-ratio-text">{normalizedAttack.toFixed(1)}%</span>
                            </div>
                            <div 
                              className="design-ratio-defense" 
                              style={{
                                width: `${normalizedDefense}%`,
                                backgroundColor: '#4466FF'
                              }}
                            >
                              <span className="design-ratio-text">{normalizedDefense.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 활동량 탭 메뉴 */}
                      <div className="design-activity-tabs">
                        <button
                          className={`design-activity-tab ${activeActivityTab === 'total' ? 'active' : ''}`}
                          onClick={() => setActiveActivityTab('total')}
                        >
                          전체
                        </button>
                        <button
                          className={`design-activity-tab ${activeActivityTab === 'attack' ? 'active' : ''}`}
                          onClick={() => setActiveActivityTab('attack')}
                        >
                          공격
                        </button>
                        <button
                          className={`design-activity-tab ${activeActivityTab === 'defense' ? 'active' : ''}`}
                          onClick={() => setActiveActivityTab('defense')}
                        >
                          수비
                        </button>
                      </div>

                      {/* 활동량 탭 내용 */}
                      <div className="design-activity-details">
                        {activeActivityTab === 'total' && (
                          <div className="design-activity-stats-grid">
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">활동시간</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.total_data?.time, '분')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">이동거리</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.total_data?.distance, 'km')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">분당 이동거리</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.total_data?.distance_per_minute ? parseFloat(realAnalData.total_data.distance_per_minute).toFixed(1) : 0, 'm')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">활동 범위</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.total_data?.movement_ratio ? parseFloat(realAnalData.total_data.movement_ratio).toFixed(1) : 0, '%')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">완만한 방향전환 횟수</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.total_data?.direction_change_90_150, '회')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">급격한 방향전환 횟수</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.total_data?.direction_change_150_180, '회')}</span>
                            </div>
                          </div>
                        )}
                        
                        {activeActivityTab === 'attack' && (
                          <div className="design-activity-stats-grid">
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">공격지역 활동시간</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.attack_data?.time, '분')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">공격지역 이동거리</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.attack_data?.distance, 'km')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">공격지역 분당 이동거리</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.attack_data?.distance_per_minute, 'm')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">공격지역 내 활동 범위</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.attack_data?.movement_ratio ? parseFloat(realAnalData.attack_data.movement_ratio).toFixed(1) : 0, '%')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">공격지역 내 완만한 방향전환</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.attack_data?.direction_change_90_150, '회')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">공격지역 내 급격한 방향전환</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.attack_data?.direction_change_150_180, '회')}</span>
                            </div>
                          </div>
                        )}
                        
                        {activeActivityTab === 'defense' && (
                          <div className="design-activity-stats-grid">
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">수비지역 활동시간</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.defense_data?.time, '분')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">수비지역 이동거리</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.defense_data?.distance ? parseFloat(realAnalData.defense_data.distance).toFixed(2) : 0, 'km')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">수비지역 내 분당 이동거리</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.defense_data?.distance_per_minute ? parseFloat(realAnalData.defense_data.distance_per_minute).toFixed(1) : 0, 'm')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">수비지역 내 활동 범위</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.defense_data?.movement_ratio ? parseFloat(realAnalData.defense_data.movement_ratio).toFixed(1) : 0, '%')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">수비지역 내 완만한 방향전환</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.defense_data?.direction_change_90_150, '회')}</span>
                            </div>
                            <div className="design-activity-stat">
                              <span className="design-stat-label text-caption">수비지역 내 급격한 방향전환</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.defense_data?.direction_change_150_180, '회')}</span>
                            </div>
                          </div>
                        )}
                      </div>
    </div>
  );
                })()}
              </div>
              
              <button 
                className="code-toggle-btn-inner"
                onClick={() => toggleComponentCode('activity-bars')}
              >
                {componentCodeCollapsed['activity-bars'] ? '코드 보기' : '코드 숨기기'} 
                <span className={`toggle-icon ${componentCodeCollapsed['activity-bars'] ? '' : 'expanded'}`}>▼</span>
              </button>
            </div>
            <h4>활동량 막대 그래프</h4>
            
            {!componentCodeCollapsed['activity-bars'] && (
              <div className="component-code">
                <pre><code>{`// 📊 활동량 막대 그래프 - Anal_Detail.js에서 실제 사용
// 공격/수비 비율 막대
const attackPercentage = parseFloat(apiData.attack_data?.time_percentage || 0);
const defensePercentage = parseFloat(apiData.defense_data?.time_percentage || 0);
const total = attackPercentage + defensePercentage;

let normalizedAttack = (attackPercentage / total) * 100;
let normalizedDefense = (defensePercentage / total) * 100;

<div className="ratio-bar">
  <div className="ratio-attack" style={{width: normalizedAttack + '%'}}>
    {normalizedAttack.toFixed(1)}%
  </div>
  <div className="ratio-defense" style={{width: normalizedDefense + '%'}}>
    {normalizedDefense.toFixed(1)}%
  </div>
</div>

// 활동량 탭: 전체, 공격, 수비
// 각 탭별 6개 통계: 활동시간, 이동거리, 분당거리, 활동범위, 완만한방향전환, 급격한방향전환`}</code></pre>
              </div>
            )}
          </div>

          <div className="component-item">
            <div className="component-sample">
              <div className="sample-speed-charts">
                {(() => {
                  // Anal_Detail.js와 완전히 동일한 속력 및 가속도 그래프
                  
                  if (!realAnalData) {
                    return (
                      <div className="speed-loading">
                        <p className="text-body">속력 데이터를 불러오는 중...</p>
                      </div>
                    );
                  }
                  
                  // formatValue 함수
                  const formatValue = (value, unit = '') => {
                    if (value === null || value === undefined) return `- ${unit}`;
                    return `${value} ${unit}`;
                  };
                  
                  // createSmoothPath 함수 (공통)
                  const createSmoothPath = (data, minValue, maxValue) => {
                    if (!data || data.length < 2) return '';
                    
                    const margin = { top: 35, right: 25, bottom: 25, left: 45 };
                    const chartWidth = 400 - margin.left - margin.right;
                    const chartHeight = 180 - margin.top - margin.bottom;
                    const range = maxValue - minValue || 1;
                    
                    const points = data.map((value, index) => ({
                      x: margin.left + (index / (data.length - 1)) * chartWidth,
                      y: margin.top + chartHeight - ((value - minValue) / range) * chartHeight
                    }));
                    
                    let path = `M ${points[0].x} ${points[0].y}`;
                    
                    for (let i = 1; i < points.length; i++) {
                      const prev = points[i - 1];
                      const curr = points[i];
                      const next = points[i + 1];
                      
                      if (i === 1) {
                        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                        const cp1y = prev.y;
                        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                        const cp2y = curr.y;
                        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                      } else if (i === points.length - 1) {
                        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                        const cp1y = prev.y;
                        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
                        const cp2y = curr.y;
                        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                      } else {
                        const prevPrev = points[i - 2];
                        const tension = 0.3;
                        
                        const cp1x = prev.x + (curr.x - prevPrev.x) * tension;
                        const cp1y = prev.y + (curr.y - prevPrev.y) * tension;
                        const cp2x = curr.x - (next.x - prev.x) * tension;
                        const cp2y = curr.y - (next.y - prev.y) * tension;
                        
                        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
                      }
                    }
                    
                    return path;
                  };
                  
                  // 속력 데이터 파싱
                  let speedData = null;
                  try {
                    const rawData = realAnalData.total_data?.average_speed_list;
                    if (rawData) {
                      speedData = JSON.parse(rawData);
                    }
                  } catch (error) {
                    console.error('Speed data parsing error:', error);
                  }
                  
                  // 가속도 데이터 파싱
                  let accelerationData = null;
                  try {
                    const rawData = realAnalData.total_data?.average_acceleration_list;
                    if (rawData) {
                      accelerationData = JSON.parse(rawData);
                    }
                  } catch (error) {
                    console.error('Acceleration data parsing error:', error);
                  }
                  
                  return (
                    <div className="speed-charts-container">
                      {/* 속력/가속도 탭 메뉴 */}
                      <div className="design-speed-tabs">
                        <button
                          className={`design-speed-tab ${activeSpeedTab === 'speed' ? 'active' : ''}`}
                          onClick={() => setActiveSpeedTab('speed')}
                        >
                          속력
                        </button>
                        <button
                          className={`design-speed-tab ${activeSpeedTab === 'acceleration' ? 'active' : ''}`}
                          onClick={() => setActiveSpeedTab('acceleration')}
                        >
                          가속도
                        </button>
                      </div>

                      {/* 속력 탭 */}
                      {activeSpeedTab === 'speed' && (
                        <div className="design-speed-analysis">
                          <div className="design-speed-charts">
                            <div className="design-speed-chart-row">
                              <div className="design-speed-item">
                                <span className="design-speed-label text-caption">평균 속력 그래프</span>
                                <div className="design-speed-chart-container">
                                  <svg className="design-speed-chart" viewBox="0 0 400 180">
                                    {speedData && speedData.length > 0 ? (() => {
                                      const margin = { top: 35, right: 25, bottom: 25, left: 45 };
                                      const chartWidth = 400 - margin.left - margin.right;
                                      const chartHeight = 180 - margin.top - margin.bottom;
                                      const maxSpeed = Math.max(...speedData);
                                      const minSpeed = Math.min(...speedData);
                                      const range = maxSpeed - minSpeed || 1;
                                      const totalTime = realAnalData.total_data?.time || 0;
                                      
                                      return (
                                        <>
                                          <defs>
                                            <linearGradient id="designSpeedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                              <stop offset="0%" stopColor="rgba(7, 150, 105, 0.3)" />
                                              <stop offset="100%" stopColor="rgba(7, 150, 105, 0.05)" />
                                            </linearGradient>
                                          </defs>
                                          
                                          {/* 격자선 */}
                                          {[0.25, 0.5, 0.75].map((ratio, index) => (
                                            <line 
                                              key={`grid-${index}`}
                                              x1={margin.left} 
                                              y1={margin.top + chartHeight * ratio} 
                                              x2={margin.left + chartWidth} 
                                              y2={margin.top + chartHeight * ratio} 
                                              stroke="#E2E8F0" 
                                              strokeWidth="0.5"
                                              opacity="0.6"
                                            />
                                          ))}
                                          
                                          {/* Y축 라벨 */}
                                          {[0, 0.5, 1].map((ratio, index) => {
                                            const value = minSpeed + (range * ratio);
                                            const y = margin.top + chartHeight - (ratio * chartHeight);
                                            return (
                                              <text 
                                                key={index}
                                                x={margin.left - 8} 
                                                y={y + 4} 
                                                fontSize="11" 
                                                fill="#8A8F98" 
                                                textAnchor="end"
                                              >
                                                {value.toFixed(0)}
                                              </text>
                                            );
                                          })}
                                          
                                          {/* X축 라벨 */}
                                          {(() => {
                                            const timeInterval = Math.max(5, Math.ceil(totalTime / 5) * 5 / 5);
                                            const timeLabels = [];
                                            
                                            for (let i = 0; i <= 5; i++) {
                                              const timeValue = i * timeInterval;
                                              if (timeValue <= totalTime) {
                                                timeLabels.push({
                                                  ratio: timeValue / totalTime,
                                                  label: `${timeValue}분`
                                                });
                                              }
                                            }
                                            
                                            return timeLabels.map((item, index) => {
                                              const x = margin.left + (item.ratio * chartWidth);
                                              return (
                                                <text 
                                                  key={index}
                                                  x={x} 
                                                  y={margin.top + chartHeight + 20} 
                                                  fontSize="11" 
                                                  fill="#8A8F98" 
                                                  textAnchor="middle"
                                                >
                                                  {item.label}
                                                </text>
                                              );
                                            });
                                          })()}
                                          
                                          {/* 영역 채우기 */}
                                          <path
                                            d={`${createSmoothPath(speedData, minSpeed, maxSpeed)} L ${margin.left + chartWidth} ${margin.top + chartHeight} L ${margin.left} ${margin.top + chartHeight} Z`}
                                            fill="url(#designSpeedGradient)"
                                          />
                                          
                                          {/* 메인 라인 */}
                                          <path
                                            d={createSmoothPath(speedData, minSpeed, maxSpeed)}
                                            fill="none"
                                            stroke="#079669"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          
                                          {/* 데이터 포인트 */}
                                          {speedData.map((value, index) => {
                                            if (index % Math.ceil(speedData.length / 8) !== 0) return null;
                                            const x = margin.left + (index / (speedData.length - 1)) * chartWidth;
                                            const y = margin.top + chartHeight - ((value - minSpeed) / range) * chartHeight;
                                            return (
                                              <circle
                                                key={index}
                                                cx={x}
                                                cy={y}
                                                r="2"
                                                fill="#079669"
                                              />
                                            );
                                          })}
                                        </>
                                      );
                                    })() : (
                                      <g>
                                        <text x="200" y="90" textAnchor="middle" fill="#8A8F98" fontSize="14" fontWeight="500">
                                          충분한 속력 데이터가 없습니다
                                        </text>
                                      </g>
                                    )}
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* 속력 상세 정보 */}
                          <div className="design-speed-stats-grid">
                            <div className="design-speed-stat">
                              <span className="design-stat-label text-caption">최고 속력</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.total_data?.max_speed, 'km/h')}</span>
                            </div>
                            <div className="design-speed-stat">
                              <span className="design-stat-label text-caption">평균 속력</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.total_data?.average_speed, 'km/h')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* 가속도 탭 */}
                      {activeSpeedTab === 'acceleration' && (
                        <div className="design-acceleration-analysis">
                          <div className="design-acceleration-charts">
                            <div className="design-acceleration-chart-row">
                              <div className="design-acceleration-item">
                                <span className="design-acceleration-label text-caption">평균 가속도 그래프</span>
                                <div className="design-acceleration-chart-container">
                                  <svg className="design-acceleration-chart" viewBox="0 0 400 180">
                                    {accelerationData && accelerationData.length > 0 ? (() => {
                                      const margin = { top: 35, right: 25, bottom: 25, left: 45 };
                                      const chartWidth = 400 - margin.left - margin.right;
                                      const chartHeight = 180 - margin.top - margin.bottom;
                                      const maxAcceleration = Math.max(...accelerationData);
                                      const minAcceleration = Math.min(...accelerationData);
                                      const range = maxAcceleration - minAcceleration || 1;
                                      const totalTime = realAnalData.total_data?.time || 0;
                                      
                                      return (
                                        <>
                                          <defs>
                                            <linearGradient id="designAccelerationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                                              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
                                            </linearGradient>
                                          </defs>
                                          
                                          {/* 격자선 */}
                                          {[0.25, 0.5, 0.75].map((ratio, index) => (
                                            <line 
                                              key={`grid-acc-${index}`}
                                              x1={margin.left} 
                                              y1={margin.top + chartHeight * ratio} 
                                              x2={margin.left + chartWidth} 
                                              y2={margin.top + chartHeight * ratio} 
                                              stroke="#E2E8F0" 
                                              strokeWidth="0.5"
                                              opacity="0.6"
                                            />
                                          ))}
                                          
                                          {/* Y축 라벨 */}
                                          {[0, 0.5, 1].map((ratio, index) => {
                                            const value = minAcceleration + (range * ratio);
                                            const y = margin.top + chartHeight - (ratio * chartHeight);
                                            return (
                                              <text 
                                                key={index}
                                                x={margin.left - 8} 
                                                y={y + 4} 
                                                fontSize="11" 
                                                fill="#8A8F98" 
                                                textAnchor="end"
                                              >
                                                {value.toFixed(0)}
                                              </text>
                                            );
                                          })}
                                          
                                          {/* X축 라벨 */}
                                          {(() => {
                                            const timeInterval = Math.max(5, Math.ceil(totalTime / 5) * 5 / 5);
                                            const timeLabels = [];
                                            
                                            for (let i = 0; i <= 5; i++) {
                                              const timeValue = i * timeInterval;
                                              if (timeValue <= totalTime) {
                                                timeLabels.push({
                                                  ratio: timeValue / totalTime,
                                                  label: `${timeValue}분`
                                                });
                                              }
                                            }
                                            
                                            return timeLabels.map((item, index) => {
                                              const x = margin.left + (item.ratio * chartWidth);
                                              return (
                                                <text 
                                                  key={index}
                                                  x={x} 
                                                  y={margin.top + chartHeight + 20} 
                                                  fontSize="11" 
                                                  fill="#8A8F98" 
                                                  textAnchor="middle"
                                                >
                                                  {item.label}
                                                </text>
                                              );
                                            });
                                          })()}
                                          
                                          {/* 영역 채우기 */}
                                          <path
                                            d={`${createSmoothPath(accelerationData, minAcceleration, maxAcceleration)} L ${margin.left + chartWidth} ${margin.top + chartHeight} L ${margin.left} ${margin.top + chartHeight} Z`}
                                            fill="url(#designAccelerationGradient)"
                                          />
                                          
                                          {/* 메인 라인 */}
                                          <path
                                            d={createSmoothPath(accelerationData, minAcceleration, maxAcceleration)}
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          
                                          {/* 데이터 포인트 */}
                                          {accelerationData.map((value, index) => {
                                            if (index % Math.ceil(accelerationData.length / 8) !== 0) return null;
                                            const x = margin.left + (index / (accelerationData.length - 1)) * chartWidth;
                                            const y = margin.top + chartHeight - ((value - minAcceleration) / range) * chartHeight;
                                            return (
                                              <circle
                                                key={index}
                                                cx={x}
                                                cy={y}
                                                r="2"
                                                fill="#3b82f6"
                                              />
                                            );
                                          })}
                                        </>
                                      );
                                    })() : (
                                      <g>
                                        <text x="200" y="90" textAnchor="middle" fill="#8A8F98" fontSize="14" fontWeight="500">
                                          충분한 가속도 데이터가 없습니다
                                        </text>
                                      </g>
                                    )}
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* 가속도 상세 정보 */}
                          <div className="design-acceleration-stats-grid">
                            <div className="design-acceleration-stat">
                              <span className="design-stat-label text-caption">최고 가속도</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.total_data?.max_acceleration ? parseFloat(realAnalData.total_data.max_acceleration).toFixed(2) : 0, 'm/s²')}</span>
                            </div>
                            <div className="design-acceleration-stat">
                              <span className="design-stat-label text-caption">평균 가속도</span>
                              <span className="design-stat-value text-body">{formatValue(realAnalData.total_data?.average_acceleration ? parseFloat(realAnalData.total_data.average_acceleration).toFixed(2) : 0, 'm/s²')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              
              <button 
                className="code-toggle-btn-inner"
                onClick={() => toggleComponentCode('speed-charts')}
              >
                {componentCodeCollapsed['speed-charts'] ? '코드 보기' : '코드 숨기기'} 
                <span className={`toggle-icon ${componentCodeCollapsed['speed-charts'] ? '' : 'expanded'}`}>▼</span>
              </button>
            </div>
            <h4>속력 및 가속도 그래프</h4>
            
            {!componentCodeCollapsed['speed-charts'] && (
              <div className="component-code">
                <pre><code>{`// 📈 속력 및 가속도 그래프 - Anal_Detail.js에서 실제 사용
// 속력 데이터: average_speed_list (JSON 문자열)
// 가속도 데이터: average_acceleration_list (JSON 문자열)

const speedData = JSON.parse(apiData.total_data?.average_speed_list);
const accelerationData = JSON.parse(apiData.total_data?.average_acceleration_list);

// 부드러운 곡선 (cubic bezier)
// 그라데이션 영역 채우기
// 격자선 + Y축/X축 라벨
// 속력: 초록색(#079669), 가속도: 파랑색(#3b82f6)`}</code></pre>
              </div>
            )}
          </div>

        </div>
      </div>
      )}

      {/* 선수 카드 */}
      {(componentCategory === '전체' || componentCategory === '선수카드') && (
      <div className="component-category">
        <h3>선수 카드</h3>
        
        {/* 포지션 선택 */}
        <div className="position-selector">
          <div className="position-group">
            <span className="position-group-label">골키퍼</span>
            <button 
              className={`position-btn ${selectedPosition === 'GK' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('GK')}
            >
              GK
            </button>
          </div>
          <div className="position-group">
            <span className="position-group-label">수비</span>
            <button 
              className={`position-btn ${selectedPosition === 'CB' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('CB')}
            >
              CB
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'LB' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('LB')}
            >
              LB
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'RB' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('RB')}
            >
              RB
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'LWB' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('LWB')}
            >
              LWB
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'RWB' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('RWB')}
            >
              RWB
            </button>
          </div>
          <div className="position-group">
            <span className="position-group-label">미드필더</span>
            <button 
              className={`position-btn ${selectedPosition === 'CDM' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('CDM')}
            >
              CDM
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'CM' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('CM')}
            >
              CM
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'CAM' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('CAM')}
            >
              CAM
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'LM' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('LM')}
            >
              LM
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'RM' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('RM')}
            >
              RM
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'LWM' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('LWM')}
            >
              LWM
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'RWM' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('RWM')}
            >
              RWM
            </button>
          </div>
          <div className="position-group">
            <span className="position-group-label">공격</span>
            <button 
              className={`position-btn ${selectedPosition === 'LWF' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('LWF')}
            >
              LWF
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'RWF' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('RWF')}
            >
              RWF
            </button>
            <button 
              className={`position-btn ${selectedPosition === 'ST' ? 'active' : ''}`}
              onClick={() => setSelectedPosition('ST')}
            >
              ST
            </button>
          </div>
        </div>
        
        <div className="component-grid player-card-grid">
          <div className="component-item">
            <div className="component-sample">
              <div className="sample-player-card-container">
                {(() => {
                  // Card.js와 완전히 동일한 선수 카드
                  
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
                  
                  // 이름 길이에 따른 폰트 크기 클래스
                  const getNameSizeClass = (name) => {
                    if (!name) return '';
                    const length = name.length;
                    if (length <= 4) return 'name-size-xl';
                    if (length <= 8) return 'name-size-lg';
                    if (length <= 12) return 'name-size-md';
                    if (length <= 16) return 'name-size-sm';
                    return 'name-size-xs';
                  };
                  
                  // 카드 배경 이미지 매핑
                  const cardBackgrounds = {
                    blue: cardBlue,
                    green: cardGreen,
                    orange: cardOrange,
                    yellow: cardYellow
                  };
                  
                  const cardColor = getCardColor(selectedPosition);
                  const cardBackground = cardBackgrounds[cardColor];
                  
                  // 더미 선수 데이터
                  const playerData = {
                    name: selectedPosition === 'GK' ? '이영수' : selectedPosition === 'ST' ? '김민수' : '박철호',
                    age: 25,
                    height: '180cm',
                    weight: '75kg',
                    position: selectedPosition,
                    gender: '남성',
                    teamName: 'AGROUNDS FC'
                  };
                  
                  return (
                    <div 
                      className={`design-player-card ${cardColor}`}
                      style={{ backgroundImage: `url(${cardBackground})` }}
                    >
                      {/* 카드 상단 - 이름과 기본 정보 */}
                      <div className="design-card-top">
                        <div className="design-left-column">
                          <div className="design-info-box design-age-box">
                            <p className="design-player-age">만 {playerData.age}세</p>
                          </div>
                          <div className="design-info-box design-name-box">
                            <h2 className={`design-player-name ${getNameSizeClass(playerData.name)}`}>
                              {playerData.name}
                            </h2>
                          </div>
                        </div>
                        <div className="design-right-column">
                          <div className="design-info-box design-gender-box">
                            <span className="design-spec-label">{playerData.gender}</span>
                          </div>
                          <div className="design-info-box design-height-box">
                            <span className="design-spec-value">{playerData.height}</span>
                          </div>
                          <div className="design-info-box design-weight-box">
                            <span className="design-spec-value">{playerData.weight}</span>
                          </div>
                        </div>
                      </div>

                      {/* 카드 중앙 - 포지션 */}
                      <div className="design-card-middle">
                        <div className="design-position-display">
                          <span className="design-position">{playerData.position}</span>
                        </div>
                        <div className="design-position-image">
                          <img 
                            src={getPositionImage(playerData.position)} 
                            alt={`${playerData.position} 포지션`}
                            className="design-position-icon"
                          />
                        </div>
                      </div>

                      {/* 카드 하단 - 팀 정보 */}
                      <div className="design-card-bottom">
                        <div className="design-info-box design-logo-box">
                          <img src={blackLogo} alt="Agrounds" />
                        </div>
                        <div className="design-info-box design-team-box">
                          <span className="design-team-name">{playerData.teamName}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <button 
                className="code-toggle-btn-inner"
                onClick={() => toggleComponentCode('player-card')}
              >
                {componentCodeCollapsed['player-card'] ? '코드 보기' : '코드 숨기기'} 
                <span className={`toggle-icon ${componentCodeCollapsed['player-card'] ? '' : 'expanded'}`}>▼</span>
              </button>
            </div>
            <h4>선수 카드</h4>
            
            {!componentCodeCollapsed['player-card'] && (
              <div className="component-code">
                <pre><code>{`// 🎴 선수 카드 - Card.js에서 실제 사용
// 포지션별 카드 색상:
// - GK: yellow (노란색)
// - 수비 (CB, LB, RB, LWB, RWB): blue (파란색)
// - 미드필더 (CDM, CM, CAM, LM, RM, LWM, RWM): green (초록색)
// - 공격 (LWF, RWF, ST, CF): orange (주황색)

const getCardColor = (position) => {
  const positionColorMap = {
    'GK': 'yellow',
    'CB': 'blue', 'LB': 'blue', 'RB': 'blue',
    'CDM': 'green', 'CM': 'green', 'CAM': 'green',
    'LWF': 'orange', 'RWF': 'orange', 'ST': 'orange'
  };
  return positionColorMap[position] || 'blue';
};

// 카드 구조:
// - 상단: 나이, 이름, 성별, 키, 몸무게
// - 중앙: 포지션 코드 + 포지션 아이콘
// - 하단: AGROUNDS 로고 + 팀 이름`}</code></pre>
              </div>
            )}
          </div>

          <div className="component-item top-performers-item">
            <div className="component-sample">
              <div className="sample-top-performers-wrapper">
                {(() => {
                  // 포지션별 미니카드 배경 매핑
                  const getPositionCardImage = (position) => {
                    if (!position) return greenMiniCard;
                    const positionUpper = position.toUpperCase();
                    
                    if (['LWF', 'ST', 'RWF', 'CF'].includes(positionUpper)) {
                      return redMiniCard;
                    } else if (['LWM', 'CAM', 'RWM', 'LM', 'CM', 'RM', 'CDM', 'AM', 'DM'].includes(positionUpper)) {
                      return greenMiniCard;
                    } else if (['LWB', 'RWB', 'LB', 'CB', 'RB', 'SW'].includes(positionUpper)) {
                      return blueMiniCard;
                    } else if (['GK'].includes(positionUpper)) {
                      return yellowMiniCard;
                    } else {
                      return greenMiniCard;
                    }
                  };
                  
                  // 포지션 클래스 (색상용)
                  const getPositionClass = (position) => {
                    if (!position) return 'position-midfielder';
                    const positionUpper = position.toUpperCase();
                    
                    if (['LWF', 'ST', 'RWF', 'CF'].includes(positionUpper)) {
                      return 'position-striker';
                    } else if (['LWM', 'CAM', 'RWM', 'LM', 'CM', 'RM', 'CDM', 'AM', 'DM'].includes(positionUpper)) {
                      return 'position-midfielder';
                    } else if (['LWB', 'RWB', 'LB', 'CB', 'RB', 'SW'].includes(positionUpper)) {
                      return 'position-defender';
                    } else if (['GK'].includes(positionUpper)) {
                      return 'position-goalkeeper';
                    } else {
                      return 'position-midfielder';
                    }
                  };
                  
                  // 4개의 더미 선수 데이터
                  const topPlayers = [
                    {
                      name: '이민수',
                      position: 'ST',
                      value: '28.5km/h',
                      statTitle: '최고속력',
                      profileImage: defaultProfile
                    },
                    {
                      name: '박지훈',
                      position: 'CM',
                      value: '2.8m/s²',
                      statTitle: '최고가속도',
                      profileImage: defaultProfile
                    },
                    {
                      name: '김철수',
                      position: 'RWF',
                      value: '15회',
                      statTitle: '스프린트',
                      profileImage: defaultProfile
                    },
                    {
                      name: '정우성',
                      position: 'CB',
                      value: '92점',
                      statTitle: '평점',
                      profileImage: defaultProfile
                    }
                  ];
                  
                  return (
                    <div className="overall-top-performers">
                      {topPlayers.map((player, index) => (
                        <div 
                          key={index}
                          className={`top-performer-card ${getPositionClass(player.position)}`}
                          style={{
                            backgroundImage: `url(${getPositionCardImage(player.position)})`
                          }}
                        >
                          <div className="top-performer-content">
                            <div className="player-info-top">
                              <div className="player-avatar">
                                <img 
                                  src={player.profileImage} 
                                  alt={player.name}
                                />
                              </div>
                              <span className="player-name">
                                {player.name}
                              </span>
                            </div>
                            <div className="stat-info">
                              <span className="stat-title">{player.statTitle}</span>
                              <span className="stat-value">{player.value}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              
              <button 
                className="code-toggle-btn-inner"
                onClick={() => toggleComponentCode('top-performer')}
              >
                {componentCodeCollapsed['top-performer'] ? '코드 보기' : '코드 숨기기'} 
                <span className={`toggle-icon ${componentCodeCollapsed['top-performer'] ? '' : 'expanded'}`}>▼</span>
              </button>
            </div>
            <h4>종목별 최고 선수 카드</h4>
            
            {!componentCodeCollapsed['top-performer'] && (
              <div className="component-code">
                <pre><code>{`// 🏆 종목별 최고 선수 카드 - Team_Anal.js
// GK: yellow, 수비: blue, 미드필더: green, 공격: red

const getPositionCardImage = (position) => {
  if (['LWF','ST','RWF'].includes(position)) return redMiniCard;
  if (['CDM','CM','CAM','LM','RM'].includes(position)) return greenMiniCard;
  if (['CB','LB','RB','LWB','RWB'].includes(position)) return blueMiniCard;
  if (['GK'].includes(position)) return yellowMiniCard;
};`}</code></pre>
              </div>
            )}
          </div>

          <div className="component-item players-list-item">
            <div className="component-sample">
              <div className="sample-players-list-wrapper">
                {(() => {
                  // 포지션 클래스 (색상용)
                  const getPositionClass = (position) => {
                    if (!position) return 'position-midfielder';
                    const positionUpper = position.toUpperCase();
                    
                    if (['LWF', 'ST', 'RWF', 'CF'].includes(positionUpper)) {
                      return 'position-striker';
                    } else if (['LWM', 'CAM', 'RWM', 'LM', 'CM', 'RM', 'CDM', 'AM', 'DM'].includes(positionUpper)) {
                      return 'position-midfielder';
                    } else if (['LWB', 'RWB', 'LB', 'CB', 'RB', 'SW'].includes(positionUpper)) {
                      return 'position-defender';
                    } else if (['GK'].includes(positionUpper)) {
                      return 'position-goalkeeper';
                    } else {
                      return 'position-midfielder';
                    }
                  };
                  
                  // 4개의 더미 팀원 데이터 (Team_Info.js 스타일)
                  const membersData = [
                    {
                      name: '이철호',
                      role: 'owner',
                      age: 28,
                      number: 10,
                      position: 'ST',
                      profileImage: defaultProfile,
                      location: '서울시 강남구',
                      joinedDate: '2024.01.15'
                    },
                    {
                      name: '박민준',
                      role: 'manager',
                      age: 25,
                      number: 7,
                      position: 'CM',
                      profileImage: defaultProfile,
                      location: '서울시 서초구',
                      joinedDate: '2024.02.20'
                    },
                    {
                      name: '김태양',
                      role: 'member',
                      age: 23,
                      number: 4,
                      position: 'CB',
                      profileImage: defaultProfile,
                      location: '경기도 성남시',
                      joinedDate: '2024.03.10'
                    },
                    {
                      name: '정우진',
                      role: 'member',
                      age: 26,
                      number: 1,
                      position: 'GK',
                      profileImage: defaultProfile,
                      location: '서울시 송파구',
                      joinedDate: '2024.03.25'
                    }
                  ];
                  
                  return (
                    <div className="members-list">
                      {membersData.map((member, index) => (
                        <div key={index} className={`member-card ${index === 0 ? 'current-user' : ''}`}>
                          <div className="member-avatar">
                            <img 
                              src={member.profileImage} 
                              alt={member.name}
                            />
                            {index === 0 && <div className="current-user-badge">나</div>}
                          </div>
                          <div className="member-info">
                            <div className="member-header">
                              <h4 className="member-name text-h4">{member.name}</h4>
                              <span className={`member-role ${member.role}`}>
                                {member.role === 'owner' ? '팀장' : 
                                 member.role === 'manager' ? '매니저' : '멤버'}
                              </span>
                            </div>
                            <div className="member-details">
                              <span className="member-age text-body-sm">
                                {member.age}세
                              </span>
                              <span className="member-divider">•</span>
                              <span className="member-number text-body-sm">
                                {member.number}번
                              </span>
                              <span className="member-divider">•</span>
                              <span className={`member-position text-body-sm ${getPositionClass(member.position)}`}>
                                {member.position}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              
              <button 
                className="code-toggle-btn-inner"
                onClick={() => toggleComponentCode('player-list-item')}
              >
                {componentCodeCollapsed['player-list-item'] ? '코드 보기' : '코드 숨기기'} 
                <span className={`toggle-icon ${componentCodeCollapsed['player-list-item'] ? '' : 'expanded'}`}>▼</span>
              </button>
            </div>
            <h4>선수목록</h4>
            
            {!componentCodeCollapsed['player-list-item'] && (
              <div className="component-code">
                <pre><code>{`// 👥 선수 목록 아이템 - Team_Anal.js
// 프로필 이미지 + 이름 + 포지션 뱃지 + 통계 (속력/거리/평점)

<div className="player-item">
  <div className="player-avatar">
    <img src={profileImage} alt={name} />
  </div>
  <div className="player-info">
    <div className="player-header">
      <h4>{name}</h4>
      <span className="player-position">{position}</span>
    </div>
    <div className="player-details">
      <span>{maxSpeed} km/h</span>
      <span>•</span>
      <span>{distance} km</span>
      <span>•</span>
      <span>평점 {points}</span>
    </div>
  </div>
</div>`}</code></pre>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* 기본 UI 컴포넌트 */}
      {(componentCategory === '전체' || componentCategory === '일반') && (
      <div className="component-category">
        <h3>기본 UI 컴포넌트</h3>
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
      </div>
      )}

      {/* 상태 & 피드백 */}
      {(componentCategory === '전체' || componentCategory === '일반') && (
      <div className="component-category">
        <h3>상태 & 피드백</h3>
        <div className="component-grid">
          <div className="component-item">
            <div className="component-sample">
              <div className="sample-loading">
                <div className="loading-spinner"></div>
                <span>로딩 중...</span>
              </div>
            </div>
            <h4>로딩 상태</h4>
            <p>데이터 로딩 시 사용자 피드백</p>
          </div>

          <div className="component-item">
            <div className="component-sample">
              <div className="sample-info-grid">
                <div className="info-item">
                  <span className="info-label">포지션</span>
                  <span className="info-value">ST</span>
                </div>
                <div className="info-item">
                  <span className="info-label">평점</span>
                  <span className="info-value">85점</span>
                </div>
              </div>
            </div>
            <h4>정보 그리드</h4>
            <p>라벨-값 쌍의 정보 표시</p>
          </div>

          <div className="component-item">
            <div className="component-sample">
              <div className="sample-summary">
                <div className="summary-header">
                  <div className="star-icon">⭐</div>
                  <span>AI 요약</span>
                </div>
                <p>이번 경기에서 뛰어난 스피드와 활동량을 보여주었습니다.</p>
              </div>
            </div>
            <h4>AI 요약</h4>
            <p>경기 분석 결과 요약 표시</p>
          </div>
        </div>
      </div>
      )}

      {/* 입력 필드 */}
      {(componentCategory === '전체' || componentCategory === '일반') && (
      <div className="component-category">
        <h3>입력 필드</h3>
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
      )}

      {/* 모달 시스템 */}
      {(componentCategory === '전체' || componentCategory === '모달창') && (
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
      )}

      {/* 기본 UI 컴포넌트 */}
      {(componentCategory === '전체' || componentCategory === '일반') && (
      <div className="component-category">
        <h3>기본 UI 컴포넌트</h3>
        <div className="component-showcase">
          
          <div className="modal-preview">
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
          </div>

          <div className="design-specs">
            <h5>옵션 아이템 규격</h5>
            <ul>
              <li><strong>패딩:</strong> 16px</li>
              <li><strong>구분선:</strong> border-bottom: 1px solid var(--border)</li>
              <li><strong>최소 높이:</strong> min-height: 44px</li>
              <li><strong>첫 번째/마지막:</strong> border-radius: 8px (상단/하단)</li>
              <li><strong>호버 효과:</strong> background: var(--bg-primary)</li>
              <li><strong>포커스:</strong> 2px outline, primary 색상</li>
            </ul>

            <h5>색상 인디케이터</h5>
            <ul>
              <li><strong>크기:</strong> 16px × 16px</li>
              <li><strong>모양:</strong> border-radius: 50% (원형)</li>
              <li><strong>간격:</strong> gap: 12px (레이블과의 간격)</li>
            </ul>

            <h5>체크 아이콘</h5>
            <ul>
              <li><strong>크기:</strong> 20px × 20px</li>
              <li><strong>위치:</strong> 우측 끝, margin-left: var(--spacing-sm)</li>
              <li><strong>투명도:</strong> opacity: 0.8</li>
            </ul>
          </div>

          <div className="code-example">
            <h5>구조 예시</h5>
            <pre>{`<div className="option-list">
  <button className="option-item">
    <div className="option-content">
      <div className="option-color" style={{backgroundColor: '#FF6B6B'}}></div>
      <span className="option-label">옵션명</span>
    </div>
    <span className="check-icon">✓</span>
  </button>
</div>`}</pre>
          </div>
        </div>

        {/* 지역 선택 모달 */}
        <div className="modal-type-section">
          <h4>🗺️ 지역 선택 모달 (Region Selection Modal)</h4>
          <p className="modal-description">계층적 지역 선택을 위한 다중 컬럼 모달입니다 (시/도 → 시/군/구).</p>
          
          <div className="modal-preview">
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
                      <div className="region-item">부산광역시</div>
                    </div>
                    <div className="region-column">
                      <div className="region-item">강남구</div>
                      <div className="region-item">서초구</div>
                      <div className="region-item">송파구</div>
                      <div className="region-item">강서구</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn">취소</button>
                <button className="save-btn">확인</button>
              </div>
            </div>
          </div>

          <div className="design-specs">
            <h5>컨테이너 규격</h5>
            <ul>
              <li><strong>높이:</strong> height: 360px (기본), max-height: 50vh</li>
              <li><strong>스크롤:</strong> overflow-y: auto (각 컬럼별 독립 스크롤)</li>
              <li><strong>배경:</strong> var(--bg-surface)</li>
            </ul>

            <h5>컬럼 구조</h5>
            <ul>
              <li><strong>레이아웃:</strong> display: flex (가로 배치)</li>
              <li><strong>너비:</strong> flex: 1 (동일 너비)</li>
              <li><strong>구분선:</strong> border-right: 1px solid var(--border)</li>
              <li><strong>마지막 컬럼:</strong> border-right 제거</li>
            </ul>

            <h5>지역 아이템 규격</h5>
            <ul>
              <li><strong>패딩:</strong> var(--spacing-md) var(--spacing-lg)</li>
              <li><strong>구분선:</strong> border-bottom: 1px solid var(--border)</li>
              <li><strong>좌측 강조선:</strong> border-left: 3px solid transparent (기본)</li>
              <li><strong>최소 높이:</strong> min-height: 44px</li>
              <li><strong>폰트:</strong> font-size: 14px, font-weight: 500</li>
            </ul>

            <h5>선택 상태 (Selected)</h5>
            <ul>
              <li><strong>배경:</strong> rgba(7, 150, 105, 0.08)</li>
              <li><strong>좌측 선:</strong> border-left-color: var(--primary)</li>
              <li><strong>텍스트:</strong> color: var(--primary), font-weight: 600</li>
            </ul>

            <h5>호버 효과</h5>
            <ul>
              <li><strong>미선택 아이템:</strong> background: var(--bg-primary)</li>
              <li><strong>전환:</strong> transition: all 0.2s ease</li>
            </ul>
          </div>

          <div className="code-example">
            <h5>구조 예시</h5>
            <pre>{`<div className="region-body">
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
</div>`}</pre>
          </div>
        </div>

        {/* 공통 규칙 */}
        <div className="modal-type-section">
          <h4>📋 공통 디자인 규칙</h4>
          
          <div className="design-specs">
            <h5>접근성 (Accessibility)</h5>
            <ul>
              <li><strong>최소 터치 영역:</strong> 44px × 44px (WCAG 기준)</li>
              <li><strong>포커스 인디케이터:</strong> 2px solid outline, primary 색상</li>
              <li><strong>키보드 네비게이션:</strong> Tab, Enter, Escape 키 지원</li>
              <li><strong>색상 대비:</strong> WCAG AA 준수 (4.5:1 이상)</li>
            </ul>

            <h5>반응형 대응</h5>
            <ul>
              <li><strong>데스크톱:</strong> max-width: 400px, padding: var(--spacing-xl)</li>
              <li><strong>태블릿 (≤768px):</strong> width: calc(100% - 24px), padding: var(--spacing-lg)</li>
              <li><strong>모바일 (≤480px):</strong> width: calc(100% - 16px), padding: var(--spacing-md)</li>
              <li><strong>소형 (≤320px):</strong> width: calc(100% - 12px), padding: var(--spacing-md)</li>
            </ul>

            <h5>인터랙션</h5>
            <ul>
              <li><strong>열림 애니메이션:</strong> fade-in + scale (권장)</li>
              <li><strong>닫힘 방법:</strong> 닫기 버튼, 취소 버튼, 오버레이 클릭, Escape 키</li>
              <li><strong>버튼 호버:</strong> 배경색 변화 + 색상 변화 (0.2s ease)</li>
              <li><strong>버튼 클릭:</strong> transform: translateY(-1px) (save 버튼)</li>
            </ul>

            <h5>스크롤 동작</h5>
            <ul>
              <li><strong>배경 스크롤 방지:</strong> body overflow: hidden (모달 열림 시)</li>
              <li><strong>모달 내부 스크롤:</strong> modal-body에만 overflow-y: auto</li>
              <li><strong>스크롤바 스타일:</strong> 브라우저 기본값 (크로스 브라우저 호환성)</li>
            </ul>
          </div>
        </div>

        {/* CSS 변수 참조 */}
        <div className="modal-type-section">
          <h4>🎨 사용된 CSS 변수</h4>
          
          <div className="design-specs">
            <h5>색상</h5>
            <ul>
              <li><code>--bg-surface</code>: #FFFFFF (모달 배경)</li>
              <li><code>--primary</code>: #079669 (주요 액션)</li>
              <li><code>--primary-hover</code>: #068A5B (호버 상태)</li>
              <li><code>--text-primary</code>: #262626 (주요 텍스트)</li>
              <li><code>--text-secondary</code>: #6B7078 (보조 텍스트)</li>
              <li><code>--text-disabled</code>: #9CA3AF (비활성 상태)</li>
              <li><code>--border</code>: #E5E7EB (구분선)</li>
              <li><code>--bg-primary</code>: rgba(7, 150, 105, 0.05) (호버 배경)</li>
            </ul>

            <h5>간격</h5>
            <ul>
              <li><code>--spacing-xs</code>: 4px</li>
              <li><code>--spacing-sm</code>: 8px</li>
              <li><code>--spacing-md</code>: 12px</li>
              <li><code>--spacing-lg</code>: 16px</li>
              <li><code>--spacing-xl</code>: 20px</li>
            </ul>

            <h5>폰트</h5>
            <ul>
              <li><code>--font-text</code>: 'Pretendard' (본문 텍스트)</li>
              <li><code>--font-brand</code>: 'Paperlogy-8ExtraBold' (브랜드 제목)</li>
            </ul>
          </div>
        </div>

        {/* 사용 사례 */}
        <div className="modal-type-section">
          <h4>💼 실제 사용 사례</h4>
          
          <div className="use-cases">
            <div className="use-case">
              <h5>텍스트 입력 모달</h5>
              <ul>
                <li>닉네임 변경</li>
                <li>이메일 수정</li>
                <li>비밀번호 변경</li>
                <li>한 줄 소개 작성</li>
              </ul>
            </div>

            <div className="use-case">
              <h5>옵션 선택 모달</h5>
              <ul>
                <li>포지션 선택 (FW, MF, DF, GK)</li>
                <li>주발 선택 (왼발, 오른발, 양발)</li>
                <li>팀 색상 선택</li>
                <li>언어 설정</li>
              </ul>
            </div>

            <div className="use-case">
              <h5>지역 선택 모달</h5>
              <ul>
                <li>사용자 거주 지역 설정</li>
                <li>경기장 위치 선택</li>
                <li>팀 활동 지역 설정</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      )}
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
        <h3>💡 실제 사용 예제</h3>
        
        {/* 실제 디자인 페이지 사용 사례 */}
        <div className="spacing-showcase">
          <h4>🎯 AGROUNDS 디자인 페이지 실제 활용</h4>
          <div className="real-examples">
            <div className="example-section">
              <span className="example-title">컴포넌트 카드</span>
              <div className="example-demo card-demo">
                <div className="demo-card" style={{ padding: '24px', gap: '16px' }}>
                  <h5>카드 제목</h5>
                  <p>카드 내용</p>
                  <button>버튼</button>
                </div>
              </div>
              <code>padding: var(--spacing-2xl) /* 24px */, gap: var(--spacing-lg) /* 16px */</code>
            </div>
            
            <div className="example-section">
              <span className="example-title">아이콘 그리드</span>
              <div className="example-demo icon-demo">
                <div className="demo-icon-grid" style={{ gap: '20px' }}>
                  <div className="demo-icon-item">🎨</div>
                  <div className="demo-icon-item">🔧</div>
                  <div className="demo-icon-item">📏</div>
                </div>
              </div>
              <code>gap: var(--spacing-xl) /* 20px */</code>
            </div>
            
            <div className="example-section">
              <span className="example-title">컬러 버튼</span>
              <div className="example-demo button-demo">
                <div className="demo-button-group" style={{ gap: '8px' }}>
                  <button className="demo-color-btn">BLACK</button>
                  <button className="demo-color-btn">GRAY</button>
                  <button className="demo-color-btn">BLUE</button>
                </div>
              </div>
              <code>gap: var(--spacing-sm) /* 8px */</code>
            </div>
          </div>
        </div>
        
        <div className="code-example">
          <pre><code>{`/* 📱 실제 AGROUNDS 컴포넌트 간격 활용 */

// 🔬 마이크로 간격 (4-12px)
.color-buttons {
  gap: var(--spacing-sm);        /* 8px - 컬러 버튼 간격 */
}

.icon-details {
  margin: var(--spacing-xs) 0;   /* 4px - 아이콘 상세 정보 */
}

// 🧩 컴포넌트 간격 (16-24px)  
.component-sample {
  padding: var(--spacing-2xl);   /* 24px - 카드 내부 패딩 */
}

.component-grid {
  gap: var(--spacing-xl);        /* 20px - 컴포넌트 간 간격 */
}

.folder-section {
  margin-bottom: var(--spacing-lg); /* 16px - 폴더 간격 */
}

// 📐 레이아웃 간격 (32-60px)
.design-container {
  padding: var(--spacing-4xl);   /* 40px - 메인 컨테이너 */
}

.design-header {
  padding: var(--spacing-5xl) 0; /* 60px - 헤더 상하 패딩 */
}

.section-margin {
  margin-bottom: var(--spacing-3xl); /* 32px - 섹션 구분 */
}

/* 🎨 간격 조합 패턴 */
.card-component {
  padding: var(--spacing-2xl);       /* 24px - 내부 패딩 */
  margin-bottom: var(--spacing-xl);  /* 20px - 카드 간격 */
  gap: var(--spacing-lg);            /* 16px - 요소 간격 */
}

.icon-grid {
  gap: var(--spacing-xl);            /* 20px - 아이콘 간격 */
  padding: var(--spacing-lg);        /* 16px - 그리드 패딩 */
}`}</code></pre>
        </div>
        
        {/* 간격 가이드라인 */}
        <div className="spacing-guidelines">
          <h4>📋 간격 사용 가이드라인</h4>
          <div className="guidelines-grid">
            <div className="guideline-item">
              <h5>🔬 마이크로 간격 (4-12px)</h5>
              <ul>
                <li><strong>4px (xs):</strong> 미세 조정, 아이콘 내부</li>
                <li><strong>8px (sm):</strong> 작은 요소 간격, 인라인 태그</li>
                <li><strong>12px (md):</strong> 기본 요소 간격, 폼 필드</li>
              </ul>
            </div>
            
            <div className="guideline-item">
              <h5>🧩 컴포넌트 간격 (16-24px)</h5>
              <ul>
                <li><strong>16px (lg):</strong> 컴포넌트 내부 패딩</li>
                <li><strong>20px (xl):</strong> 컴포넌트 간 여백</li>
                <li><strong>24px (2xl):</strong> 섹션 내부 간격</li>
              </ul>
            </div>
            
            <div className="guideline-item">
              <h5>📐 레이아웃 간격 (32-60px)</h5>
              <ul>
                <li><strong>32px (3xl):</strong> 큰 섹션 구분</li>
                <li><strong>40px (4xl):</strong> 페이지 레벨 여백</li>
                <li><strong>60px (5xl):</strong> 헤더, 메인 섹션</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 레이아웃 시스템 (실제 구현 기반)
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

  const renderLayoutSection = () => (
    <div className="design-section">
      <h2>레이아웃 시스템</h2>
      <p className="section-description">
        AGROUNDS 디자인 페이지에서 실제로 사용되는 레이아웃 패턴을 분석하여 체계화한 레이아웃 시스템입니다. <br/>
        <strong>컨테이너</strong>, <strong>그리드 시스템</strong>, <strong>브레이크포인트</strong>로 구성되어 유연하고 일관된 레이아웃을 제공합니다.
      </p>
      
      {/* 컨테이너 시스템 */}
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

      {/* 그리드 시스템 */}
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

      {/* 브레이크포인트 시스템 */}
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

      <div className="usage-example">
        <h3>💡 실제 AGROUNDS 레이아웃 활용</h3>
        
        {/* 실제 레이아웃 구조 시각화 */}
        <div className="layout-showcase">
          <h4>🏗️ 실제 디자인 페이지 구조</h4>
          <div className="layout-structure">
            <div className="structure-header">
              <span>Header (max-width: 1200px)</span>
            </div>
            <div className="structure-main">
              <div className="structure-nav">
                <span>Navigation (240px)</span>
              </div>
              <div className="structure-content">
                <span>Content (flex: 1)</span>
                <div className="structure-grids">
                  <div className="mini-grid">Small Grid</div>
                  <div className="mini-grid">Standard Grid</div>
                  <div className="mini-grid">Two Col Grid</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="code-example">
          <pre><code>{`/* 🏗️ AGROUNDS 디자인 페이지 실제 레이아웃 구조 */

// 메인 컨테이너 (최대 1400px)
.design-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
  padding: 40px;
}

// 네비게이션 (고정 240px)
.design-nav {
  width: 240px;
  flex-shrink: 0;
}

// 콘텐츠 영역 (남은 공간 전체)
.design-content {
  flex: 1;
}

/* 🎯 간소화된 핵심 그리드 시스템 (3가지) */

// 1. 작은 요소용 그리드 (200px)
.grid-small {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
// 사용: 아이콘, 작은 카드, 간단한 목록

// 2. 표준 그리드 (280px) - 가장 많이 사용
.grid-standard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
// 사용: 색상 팔레트, 컴포넌트 카드, 간격 시스템, 가이드라인

// 3. 고정 2컬럼 그리드 (특수 용도)
.grid-two-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
}
// 사용: 차트 비교, 이미지 갤러리, Before/After

/* 📱 반응형 브레이크포인트 */
@media (max-width: 968px) {
  .grid-two-col {
    grid-template-columns: 1fr;  /* 2컬럼 → 1컬럼 */
  }
}

@media (max-width: 768px) {
  .design-container {
    flex-direction: column;      /* 사이드바 + 콘텐츠 → 세로 배치 */
    padding: 20px;
    gap: 20px;
  }
  
  .design-nav {
    width: 100%;                /* 네비게이션 전체 너비 */
  }
  
  .grid-standard,
  .grid-small {
    grid-template-columns: 1fr;  /* 모든 그리드 → 1컬럼 */
  }
}

/* 🎨 실제 AGROUNDS 레이아웃 활용 패턴 */
.main-layout {
  max-width: 1400px;           
  margin: 0 auto;              
  display: flex;               
  gap: var(--spacing-4xl);     
}

.sidebar-layout {
  width: 240px;                
  flex-shrink: 0;              
}

.content-layout {
  flex: 1;                     
  min-width: 0;                
}`}</code></pre>
        </div>
        
        {/* 레이아웃 가이드라인 */}
        <div className="layout-guidelines">
          <h4>📋 레이아웃 사용 가이드라인</h4>
          <div className="guidelines-grid">
            <div className="guideline-item">
              <h5>📦 컨테이너 선택 기준</h5>
              <ul>
                <li><strong>1200px:</strong> 헤더, 로고 영역</li>
                <li><strong>1400px:</strong> 메인 콘텐츠 영역</li>
                <li><strong>100% + flex:</strong> 동적 콘텐츠</li>
              </ul>
            </div>
            
            <div className="guideline-item">
              <h5>🎯 그리드 선택 기준 (간소화)</h5>
              <ul>
                <li><strong>Small Grid (200px):</strong> 아이콘, 작은 요소</li>
                <li><strong>Standard Grid (280px):</strong> 대부분의 카드, 콘텐츠</li>
                <li><strong>Two Column Grid:</strong> 차트, 비교 요소</li>
              </ul>
              <p style={{fontSize: '12px', color: 'var(--text-disabled)', fontStyle: 'italic', marginTop: '8px'}}>
                💡 80% 이상의 경우 Standard Grid 사용 권장
              </p>
            </div>
            
            <div className="guideline-item">
              <h5>📱 반응형 전략 (간소화)</h5>
              <ul>
                <li><strong>968px 이하:</strong> Two Column Grid → 1컬럼</li>
                <li><strong>768px 이하:</strong> 모든 그리드 → 1컬럼</li>
                <li><strong>사이드바:</strong> 세로 배치로 변경</li>
              </ul>
              <p style={{fontSize: '12px', color: 'var(--text-disabled)', fontStyle: 'italic', marginTop: '8px'}}>
                💡 대부분의 그리드는 자동으로 반응형 동작
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return renderOverviewSection();
      case 'colors': return renderColorSection();
      case 'typography': return renderTypographySection();
      case 'icons': return renderIconsSection();
      case 'components': return renderComponentsSection();
      case 'spacing': return renderSpacingSection();
      case 'layout': return renderLayoutSection();
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
        <nav className="design-nav" aria-label="디자인 시스템 섹션 탭">
          <ul role="tablist">
            <li 
              className={activeSection === 'overview' ? 'active' : ''}
              onClick={() => setActiveSection('overview')}
              onKeyDown={(e) => e.key === 'Enter' && setActiveSection('overview')}
              tabIndex={0}
              role="tab"
              aria-selected={activeSection === 'overview'}
              aria-label="개요 탭"
            >
              개요
            </li>
            <li 
              className={activeSection === 'colors' ? 'active' : ''}
              onClick={() => setActiveSection('colors')}
              onKeyDown={(e) => e.key === 'Enter' && setActiveSection('colors')}
              tabIndex={0}
              role="tab"
              aria-selected={activeSection === 'colors'}
              aria-label="색상 탭"
            >
              색상
            </li>
            <li 
              className={activeSection === 'typography' ? 'active' : ''}
              onClick={() => setActiveSection('typography')}
              onKeyDown={(e) => e.key === 'Enter' && setActiveSection('typography')}
              tabIndex={0}
              role="tab"
              aria-selected={activeSection === 'typography'}
              aria-label="타이포그래피 탭"
            >
              타이포그래피
            </li>
            <li 
              className={activeSection === 'icons' ? 'active' : ''}
              onClick={() => setActiveSection('icons')}
              onKeyDown={(e) => e.key === 'Enter' && setActiveSection('icons')}
              tabIndex={0}
              role="tab"
              aria-selected={activeSection === 'icons'}
              aria-label="아이콘 탭"
            >
              아이콘
            </li>
            <li 
              className={activeSection === 'components' ? 'active' : ''}
              onClick={() => setActiveSection('components')}
              onKeyDown={(e) => e.key === 'Enter' && setActiveSection('components')}
              tabIndex={0}
              role="tab"
              aria-selected={activeSection === 'components'}
              aria-label="컴포넌트 탭"
            >
              컴포넌트
            </li>
            <li 
              className={activeSection === 'spacing' ? 'active' : ''}
              onClick={() => setActiveSection('spacing')}
              onKeyDown={(e) => e.key === 'Enter' && setActiveSection('spacing')}
              tabIndex={0}
              role="tab"
              aria-selected={activeSection === 'spacing'}
              aria-label="간격 탭"
            >
              간격
            </li>
            <li 
              className={activeSection === 'layout' ? 'active' : ''}
              onClick={() => setActiveSection('layout')}
              onKeyDown={(e) => e.key === 'Enter' && setActiveSection('layout')}
              tabIndex={0}
              role="tab"
              aria-selected={activeSection === 'layout'}
              aria-label="레이아웃 탭"
            >
              레이아웃
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

export default Admin_DesignSystem;

