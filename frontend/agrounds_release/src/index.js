import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import Onboard from './pages/Onboard';
import Email from './pages/Email';
import Password from './pages/Password';

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
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

