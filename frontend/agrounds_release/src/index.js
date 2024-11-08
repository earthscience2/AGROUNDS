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
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

