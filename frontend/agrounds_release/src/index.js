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

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

