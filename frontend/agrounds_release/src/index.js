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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Onboard />,
  },
  {
    path: "/email",
    element: <Email />,
  },
  {
    path: "/password",
    element: <Password />,
  },
  {
    path: "/findpassword",
    element: <FindPw />,
  },
  {
    path: "/notuser",
    element: <NotUserMessage />,
  },
  {
    path: "/completesignup",
    element: <CompleteSignup />,
  },
  {
    path: "/resetpassword",
    element: <ResetPw />,
  },
  {
    path: "/password-reset-complete",
    element: <PwResetComplete />,
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
    path: "/prefer-position",
    element: <PreferPosition />,
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

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

