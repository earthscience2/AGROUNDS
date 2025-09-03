import React,{useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider,useLocation, Outlet } from 'react-router-dom';

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
import My from './pages/mypage/js/My';
import SelectReason from './pages/mypage/js/secession/SelectReason';
import SecessionLast from './pages/mypage/js/secession/SecessionLast';
import Complete from './pages/mypage/js/secession/Complete';
import JoinTeam from './pages/main/js/join_team';
import SecessionOtherReason from './components/SecessionOtherReason';
import AnnouncementList from './pages/mypage/js/announcement/AnnouncementList';
import Announcement from './pages/mypage/js/announcement/Announcement';
import EventList from './pages/mypage/js/announcement/EventList';
import Event from './pages/mypage/js/announcement/Event';
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
import Design from './pages/design/js/Design';
import Anal_Folder from './pages/player/js/Anal_Folder';
import Anal from './pages/player/js/Anal';
import Anal_Detail from './pages/player/js/Anal_Detail';
import AuthGuard from './components/AuthGuard';



const useBodyClass = (className) => {
  React.useEffect(() => {
    document.body.className = className;
    return () => {
      document.body.className = ""; 
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
    '/app/card'
  ];
  
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  useBodyClass(isRootApp ? "onboard-body" : "default-body");

  useEffect(() => {
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
      { path: "mypage", element: <My /> },
      { path: "reason", element: <SelectReason /> },
      { path: "secessionlast", element: <SecessionLast /> },
      { path: "secessioncomplete", element: <Complete /> },
      { path: "jointeam", element: <JoinTeam /> },
      { path: "secession-other-reason", element: <SecessionOtherReason /> },
      { path: "announcement-list", element: <AnnouncementList /> },
      { path: "announcement", element: <Announcement /> },
      { path: "eventlist", element: <EventList /> },
      { path: "event", element: <Event /> },
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

    ],
  },
  // 디자인 시스템 페이지 (로그인 없이 접근 가능)
  {
    path: "/design",
    element: <Design />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FieldProvider>
      <RouterProvider router={router} />
    </FieldProvider>
  </React.StrictMode>
);
