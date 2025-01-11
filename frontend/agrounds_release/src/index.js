import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import Onboard from './pages/onboard/js/Onboard';
import Email from './pages/onboard/js/Email';
import Password from './pages/onboard/js/Password';
import FindPw from './pages/onboard/js/FindPw';
import NotUserMessage from './pages/onboard/js/NotUserMessage';
import CompleteSignup from './pages/onboard/js/CompleteSignup';
import ResetPw from './pages/onboard/js/ResetPw';
import PwResetComplete from './pages/onboard/js/PwResetComplete';
import EssencialInfo from './pages/onboard/js/EssencialInfo';
import ExtraInfo from './pages/onboard/js/ExtraInfo';
import PreferPosition from './pages/onboard/js/PreferPosition';
import Main from './pages/main/js/Main';
import UserInfoCard from './pages/main/js/UserInfoCard';
import TeamList from './pages/main/js/TeamList';
import MyTeam from './pages/main/js/MyTeam';
import MyOvr from './pages/main/js/MyOvr';
import Anal from './pages/main/js/Anal';
import PersonalAnalysis from './pages/main/js/PersonalAnalysis';
import Video from './pages/main/js/Video';
import PersonalVideo from './pages/video/js/PersonalVideo';
import TeamVideo from './pages/video/js/TeamVideo';
import FullVideo from './pages/video/js/FullVideo';
import VideoByQuarter from './pages/video/js/VideoByQuarter';
import My from './pages/mypage/js/My';
import SelectReason from './pages/mypage/js/secession/SelectReason';
import SecessionLast from './pages/mypage/js/secession/SecessionLast';
import Complete from './pages/mypage/js/secession/Complete';
import MakeTeam from './pages/team/js/MakeTeam';
import CompMakeTeam from './pages/team/js/CompMakeTeam';
import TeamSetting from './pages/team/js/TeamSetting';
import ChangeTeamName from './pages/team/js/ChangeTeamName';
import CompChangeName from './pages/team/js/CompChangeName';
import CompChangeLogo from './pages/team/js/CompChangeLogo';
import ChangeTeamLogo from './pages/team/js/ChangeTeamLogo';
import MemberManage from './pages/team/js/MemberManage';
import JoinTeam from './pages/team/js/JoinTeam';
import LoadingPage from './function/login/loading_for_login';
import SecessionOtherReason from './components/SecessionOtherReason';
import AnnouncementList from './pages/mypage/js/announcement/AnnouncementList';
import Announcement from './pages/mypage/js/announcement/Announcement';
import EventList from './pages/mypage/js/announcement/EventList';
import Event from './pages/mypage/js/announcement/Event';
import TeamAnalysis from './pages/main/js/TeamAnalysis';
import RecentMatch from './pages/team/js/RecentMatch';

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
    element: <Onboard />,
  },
  {
    path: "/loading-for-login",
    element: <LoadingPage />
  },
  {
    path: "/completesignup",
    element: <CompleteSignup />,
  },
  
  {
    path: "/essencial-info",
    element: <EssencialInfo />,
  },
  {
    path: "/extra-info",
    element: <ExtraInfo />,
  },
  {
    path: "/main",
    element: <Main />,
  },
  {
    path: "/userinfo",
    element: <UserInfoCard />,
  },
  {
    path: "/teamlist",
    element: <TeamList />,
  },
  {
    path: "/myteam",
    element: <MyTeam />,
  },
  {
    path: "/myovr",
    element: <MyOvr />,
  },
  {
    path: "/analysis",
    element: <Anal />,
  },
  {
    path: "/personalanalysis",
    element: <PersonalAnalysis />,
  },
  {
    path: "/video",
    element: <Video />,
  },
  {
    path: "/personalvideo",
    element: <PersonalVideo />,
  },
  {
    path: "/teamvideo",
    element: <TeamVideo />,
  },
  {
    path: "/fullvideo",
    element: <FullVideo />,
  },
  {
    path: "/videobyquarter",
    element: <VideoByQuarter />,
  },
  {
    path: "/mypage",
    element: <My />,
  },
  {
    path: "/reason",
    element: <SelectReason />,
  },
  {
    path: "/secessionlast",
    element: <SecessionLast />,
  },
  {
    path: "/secessioncomplete",
    element: <Complete />,
  },
  {
    path: "/maketeam",
    element: <MakeTeam />,
  },
  {
    path: "/completemaketeam",
    element: <CompMakeTeam />,
  },
  {
    path: "/teamsetting",
    element: <TeamSetting />,
  },
  {
    path: "/changeteamname",
    element: <ChangeTeamName />,
  },
  {
    path: "/completechangename",
    element: <CompChangeName />,
  },
  {
    path: "/completechangelogo",
    element: <CompChangeLogo />,
  },
  {
    path: "/changeteamlogo",
    element: <ChangeTeamLogo />,
  },
  {
    path: "/managemember",
    element: <MemberManage />,
  },
  {
    path: "/jointeam",
    element: <JoinTeam />,
  },
  {
    path: "/secession-other-reason",
    element: <SecessionOtherReason />,
  },
  {
    path: "/announcement-list",
    element: <AnnouncementList />,
  },
  {
    path: "/announcement",
    element: <Announcement />,
  },
  {
    path: "/eventlist",
    element: <EventList />,
  },
  {
    path: "/event",
    element: <Event />,
  },
  {
    path: "/teamanalysis",
    element: <TeamAnalysis />,
  },
  {
    path: "/recentmatch",
    element: <RecentMatch />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

