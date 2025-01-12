import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ComponyIntroduce from './pages/ComponyIntroduce';
import {createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ComponyIntroduce />,
  },

]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

