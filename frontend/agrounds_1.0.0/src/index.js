import React,{useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider,useLocation, Outlet, useNavigate } from 'react-router-dom';
import { initializeContentsquare } from './utils/contentsquare';

import Get_Started from './pages/onboard/js/Get_Started';
import Login from './pages/onboard/js/Login';
import Sign_in_type from './pages/onboard/js/Sign_in_type';
// After user's rename: 1=약관, 2=닉네임, 3=개인정보, 4=추가정보
import Sign_in_1 from './pages/onboard/js/Sign_in_1';
import Sign_in_2 from './pages/onboard/js/Sign_in_2';
import Sign_in_3 from './pages/onboard/js/Sign_in_3';
import Sign_in_4 from './pages/onboard/js/Sign_in_4';
import Sign_in_end from './pages/onboard/js/Sign_in_end';

import Main from './pages/main/js/Main';
import Card from './pages/main/js/Card';
import MyPage from './pages/mypage/js/MyPage';
import SelectReason from './pages/mypage/js/withdraw/withdraw_1';
import SecessionLast from './pages/mypage/js/withdraw/withdraw_2';
import Complete from './pages/mypage/js/withdraw/withdraw_3';
import JoinTeam from './pages/main/js/Join_Team';
import TeamMake from './pages/main/js/Team_make';
import TeamInfo from './pages/team/js/Team_Info';
import TeamVideo from './pages/team/js/Team_Video';
import TeamAnal from './pages/team/js/Team_Anal';
import TeamAnalDetail from './pages/team/js/Team_Anal_Detail';
import TeamSetting from './pages/team/js/Team_Setting';
import TeamMember from './pages/team/js/Team_member';
import SecessionOtherReason from './components/SecessionOtherReason';
import Announcement from './pages/mypage/js/common/Announcement';
import Event from './pages/mypage/js/common/Event';
import Inquiry from './pages/mypage/js/common/Inquiry';
import Notification from './pages/mypage/js/common/Notification';
import ComponyIntroduce from './pages/web/ComponyIntroduce';
import ErrorPage from './pages/ErrorPage';
import InfoFix from './pages/mypage/js/InfoFix';
// HighlightVideo removed - 삭제된 video 폴더 참조 제거

import CampSide from './pages/gps/CampSide';
import SelectRest from './pages/gps/SelectRest';
import FindStadium from './pages/gps/FindStadium';
import SetQuarterInfo from './pages/gps/SetQuarterInfo';
import SetQuarterDetail from './pages/gps/SetQuarterDetail';
import SearchStadiumByMap from './pages/gps/SearchStadiumByMap';
import { FieldProvider } from './function/Context';
import DirectInputStadium from './pages/gps/DirectInputStadium';
import SetQuarterSide from './pages/gps/SetQuarterSide';
import ServiceOfTerms from './pages/mypage/js/term/ServiceOfTerms';
import CollectPrivacy from './pages/mypage/js/term/CollectPrivacy';
import GpsTerms from './pages/mypage/js/term/GpsTerms';
import LoadingForLogin from './function/login/loading_for_login';
import Footer from './components/Footer';
import Anal_Folder from './pages/player/js/Anal_Folder';
import Anal from './pages/player/js/Anal';
import Anal_Detail from './pages/player/js/Anal_Detail';
import Video_Folder from './pages/player/js/Video_Folder';
import Video_List from './pages/player/js/Video_List';
import Player_Data_Select_1 from './pages/anal/js/player_data_select_1';
import Team_Data_Select_1 from './pages/anal/js/team_data_select_1';
import PlayerGroundSelection2 from './pages/anal/js/player_ground_selection_2';
import PlayerGroundSelectionSelf21 from './pages/anal/js/player_ground_selection_self_2_1';
import PlayerRestAreaSelection3 from './pages/anal/js/player_rest_area_selection_3';
import PlayerQuarterInfo4 from './pages/anal/js/player_quarter_info_4';
import PlayerAnalysisProgress5 from './pages/anal/js/player_analysis_progress_5';
import AuthGuard from './components/AuthGuard';
import Admin_Login from './pages/admin/js/Admin_Login';
import Admin_Dashboard from './pages/admin/js/Admin_Dashboard';
import Admin_DesignSystem from './pages/admin/js/Admin_DesignSystem';

// 디자인 시스템 분리된 페이지들
import DesignSystem_Main from './pages/admin/designSystem/DesignSystem_Main';
import DesignSystem_Foundation from './pages/admin/designSystem/DesignSystem_Foundation';
import DesignSystem_Icons from './pages/admin/designSystem/DesignSystem_Icons';
import DesignSystem_Analysis from './pages/admin/designSystem/DesignSystem_Analysis';
import DesignSystem_PlayerCards from './pages/admin/designSystem/DesignSystem_PlayerCards';
import DesignSystem_Modals from './pages/admin/designSystem/DesignSystem_Modals';

// 테스트 플레이어 자동 로그인 컴포넌트
const TestPlayerAutoLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 세션 스토리지에 test_player 정보 자동 저장
    console.log('🧪 테스트 플레이어 모드 활성화');
    
    // 기존 세션 정보 완전 초기화
    sessionStorage.clear();
    
    // test_player 유저 코드만 설정 (나머지는 API를 통해 DB에서 가져옴)
    sessionStorage.setItem('userCode', 'test_player');
    sessionStorage.setItem('userId', 'test_player');
    sessionStorage.setItem('loginCompleted', 'true');
    sessionStorage.setItem('loginTimestamp', Date.now().toString());
    sessionStorage.setItem('testMode', 'true'); // 테스트 모드 플래그 (세션 타임아웃 비활성화)
    
    console.log('✅ 테스트 플레이어 세션 설정 완료');
    console.log('📦 userCode: test_player (상세 정보는 API를 통해 DB에서 로드)');
    
    // Main 페이지로 리다이렉트
    navigate('/app/main', { replace: true });
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ fontSize: '18px', fontWeight: '600', color: '#079669' }}>
        🧪 테스트 플레이어 모드
      </div>
      <div style={{ fontSize: '14px', color: '#6B7078' }}>
        로그인 중...
      </div>
    </div>
  );
};

// 테스트 팀 자동 로그인 컴포넌트
const TestTeamAutoLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 세션 스토리지에 test_team 정보 자동 저장
    console.log('🧪 테스트 팀 모드 활성화');
    
    // 기존 세션 정보 완전 초기화
    sessionStorage.clear();
    
    // test_team 유저 코드만 설정 (나머지는 API를 통해 DB에서 가져옴)
    sessionStorage.setItem('userCode', 'test_team');
    sessionStorage.setItem('userId', 'test_team');
    sessionStorage.setItem('loginCompleted', 'true');
    sessionStorage.setItem('loginTimestamp', Date.now().toString());
    sessionStorage.setItem('testMode', 'true'); // 테스트 모드 플래그 (세션 타임아웃 비활성화)
    
    console.log('✅ 테스트 팀 세션 설정 완료');
    console.log('📦 userCode: test_team (상세 정보는 API를 통해 DB에서 로드)');
    
    // Main 페이지로 리다이렉트
    navigate('/app/main', { replace: true });
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ fontSize: '18px', fontWeight: '600', color: '#079669' }}>
        🧪 테스트 팀 모드
      </div>
      <div style={{ fontSize: '14px', color: '#6B7078' }}>
        로그인 중...
      </div>
    </div>
  );
};

// 테스트 팀 멤버 자동 로그인 컴포넌트
const TestTeamMemberAutoLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 세션 스토리지에 u_mancity_ortega 정보 자동 저장
    console.log('🧪 테스트 팀 멤버 모드 활성화');
    
    // 기존 세션 정보 완전 초기화
    sessionStorage.clear();
    
    // u_mancity_ortega 유저 코드만 설정 (나머지는 API를 통해 DB에서 가져옴)
    sessionStorage.setItem('userCode', 'u_mancity_ortega');
    sessionStorage.setItem('userId', 'u_mancity_ortega');
    sessionStorage.setItem('loginCompleted', 'true');
    sessionStorage.setItem('loginTimestamp', Date.now().toString());
    sessionStorage.setItem('testMode', 'true'); // 테스트 모드 플래그 (세션 타임아웃 비활성화)
    
    console.log('✅ 테스트 팀 멤버 세션 설정 완료');
    console.log('📦 userCode: u_mancity_ortega (상세 정보는 API를 통해 DB에서 로드)');
    
    // Main 페이지로 리다이렉트
    navigate('/app/main', { replace: true });
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ fontSize: '18px', fontWeight: '600', color: '#079669' }}>
        🧪 테스트 팀 멤버 모드
      </div>
      <div style={{ fontSize: '14px', color: '#6B7078' }}>
        로그인 중...
      </div>
    </div>
  );
};


const useBodyClass = (className) => {
  React.useEffect(() => {
    // body와 html 요소 모두에 클래스 적용
    document.body.className = className;
    document.documentElement.className = className;
    
    return () => {
      document.body.className = ""; 
      document.documentElement.className = "";
    };
  }, [className]);
};

const AppWrapper = () => {
  const location = useLocation();
  const isRootApp = location.pathname.replace(/\/+$/, "").startsWith("/app");

  // Footer를 숨겨야 하는 경로들
  const hideFooterPaths = [
    '/app',
    '/app/',
    '/app/login',
    '/app/loading',
    '/app/sign-in-type',
    '/app/sign-in-1',
    '/app/sign-in-2',
    '/app/sign-in-3',
    '/app/sign-in-4',
    '/app/sign-in-end',
    '/app/card',
    '/app/admin/login',
    '/app/admin/dashboard',
    '/app/admin/design-system',
    '/app/admin/design-system/foundation',
    '/app/admin/design-system/icons',
    '/app/admin/design-system/analysis',
    '/app/admin/design-system/player-cards',
    '/app/admin/design-system/modals',
    '/app/test_player/main',
    '/app/test_team/main',
    '/app/test_team_member/main'
  ];
  
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  // 관리자 페이지 감지
  const isAdminPage = location.pathname.startsWith('/app/admin/');
  
  useBodyClass(isRootApp ? "onboard-body" : isAdminPage ? "admin-body" : "default-body");

  useEffect(() => {
    // 🧪 테스트 모드일 경우 세션 타임아웃 비활성화
    const isTestMode = sessionStorage.getItem('testMode') === 'true';
    
    if (isTestMode) {
      console.log('🧪 테스트 모드: 세션 타임아웃 비활성화');
      return; // 세션 타임아웃 로직 건너뛰기
    }
    
    const SESSION_TIMEOUT = 20 * 60 * 1000; // 20분
    let inactivityTimeout;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        sessionStorage.clear();
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/app'; 
      }, SESSION_TIMEOUT);
    };

    ['mousemove', 'keydown', 'click', 'scroll'].forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer(); 

    return () => {
      ['mousemove', 'keydown', 'click', 'scroll'].forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      clearTimeout(inactivityTimeout);
    };
  }, []);


  return (
    <AuthGuard>
      <Outlet />
      {!shouldHideFooter && <Footer />}
    </AuthGuard>
  );
};


const router = createBrowserRouter([
  // 자체 로그인 
  // {
  //   path: "/email",
  //   element: <Email />,
  // },
  // {
  //   path: "/password",
  //   element: <Password />,
  // },
  // {
  //   path: "/findpassword",
  //   element: <FindPw />,
  // },
  // {
  //   path: "/notuser",
  //   element: <NotUserMessage />,
  // },
  // {
  //   path: "/resetpassword",
  //   element: <ResetPw />,
  // },
  // {
  //   path: "/password-reset-complete",
  //   element: <PwResetComplete />,
  // },
  {
    path: "/",
    element: <ComponyIntroduce />, // 홍보 페이지
  },

  // 앱
  {
    path: "/app/*",
    element: <AppWrapper />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <Get_Started /> },

      { path: "login", element: <Login /> },
      { path: "loading", element: <LoadingForLogin /> },
      { path: "sign-in-type", element: <Sign_in_type /> },
      { path: "sign-in-1", element: <Sign_in_1 /> },
      { path: "sign-in-2", element: <Sign_in_2 /> },
      { path: "sign-in-3", element: <Sign_in_3 /> },
      { path: "sign-in-4", element: <Sign_in_4 /> },
      { path: "sign-in-end", element: <Sign_in_end /> },

      { path: "main", element: <Main /> },
      { path: "card", element: <Card /> },
      { path: "mypage", element: <MyPage /> },
      { path: "reason", element: <SelectReason /> },
      { path: "withdrawlast", element: <SecessionLast /> },
      { path: "withdrawcomplete", element: <Complete /> },
      { path: "jointeam", element: <JoinTeam /> },
      { path: "team-make", element: <TeamMake /> },
      { path: "team/info", element: <TeamInfo /> },
      { path: "team/setting", element: <TeamSetting /> },
      { path: "team/members", element: <TeamMember /> },
      { path: "team/video", element: <TeamVideo /> },
      { path: "team/anal", element: <TeamAnal /> },
      { path: "team/anal/detail", element: <TeamAnalDetail /> },
      { path: "withdraw-other-reason", element: <SecessionOtherReason /> },
      { path: "announcement-list", element: <Announcement /> },
      { path: "event", element: <Event /> },
      { path: "inquiry", element: <Inquiry /> },
      { path: "notifications", element: <Notification /> },
      { path: "errorpage", element: <ErrorPage /> },
      { path: "infofix", element: <InfoFix /> },
      { path: "campside", element: <CampSide /> },
      { path: "selectrest", element: <SelectRest /> },
      { path: "findstadium", element: <FindStadium /> },
      { path: "set-quarter-info", element: <SetQuarterInfo /> },
      { path: "set-quarter-detail", element: <SetQuarterDetail /> },
      { path: "search-stadium-by-map", element: <SearchStadiumByMap /> },
      { path: "direct-input-stadium", element: <DirectInputStadium /> },
      { path: "set-quarter-side", element: <SetQuarterSide /> },
      { path: "serviceterm", element: <ServiceOfTerms /> },
      { path: "privacyterm", element: <CollectPrivacy /> },
      { path: "gpsterm", element: <GpsTerms /> },
      { path: "player/folder", element: <Anal_Folder /> },
      { path: "player/analysis", element: <Anal /> },
      { path: "player/anal-detail", element: <Anal_Detail /> },
      { path: "player/video-folder", element: <Video_Folder /> },
      { path: "player/video-list", element: <Video_List /> },
      { path: "player/data-select", element: <Player_Data_Select_1 /> },
      { path: "anal/data-select", element: <Player_Data_Select_1 /> },
      { path: "team/data-select", element: <Team_Data_Select_1 /> },
      { path: "anal/ground-selection", element: <PlayerGroundSelection2 /> },
      { path: "anal/rest-area-selection", element: <PlayerRestAreaSelection3 /> },
      { path: "anal/quarter-info", element: <PlayerQuarterInfo4 /> },
      { path: "anal/progress", element: <PlayerAnalysisProgress5 /> },
      { path: "anal/ground-zone-setup", element: <PlayerGroundSelectionSelf21 /> },
      
      // 관리자 페이지
      { path: "admin/login", element: <Admin_Login /> },
      { path: "admin/dashboard", element: <Admin_Dashboard /> },
      { path: "admin/design-system-old", element: <Admin_DesignSystem /> }, // 기존 통합 페이지 (참조용)
      
      // 디자인 시스템 (분리된 페이지)
      { path: "admin/design-system", element: <DesignSystem_Main /> },
      { path: "admin/design-system/foundation", element: <DesignSystem_Foundation /> },
      { path: "admin/design-system/icons", element: <DesignSystem_Icons /> },
      { path: "admin/design-system/analysis", element: <DesignSystem_Analysis /> },
      { path: "admin/design-system/player-cards", element: <DesignSystem_PlayerCards /> },
      { path: "admin/design-system/modals", element: <DesignSystem_Modals /> },
      
      // 🧪 테스트 플레이어 자동 로그인 (로그인 없이 test_player 유저로 접속)
      { path: "test_player/main", element: <TestPlayerAutoLogin /> },
      
      // 🧪 테스트 팀 자동 로그인 (로그인 없이 test_team 유저로 접속)
      { path: "test_team/main", element: <TestTeamAutoLogin /> },
      
      // 🧪 테스트 팀 멤버 자동 로그인 (로그인 없이 u_mancity_ortega 유저로 접속)
      { path: "test_team_member/main", element: <TestTeamMemberAutoLogin /> },

    ],
  },
]);

// Contentsquare(Xiti) 추적 스크립트 초기화
initializeContentsquare();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FieldProvider>
      <RouterProvider router={router} />
    </FieldProvider>
  </React.StrictMode>
);
