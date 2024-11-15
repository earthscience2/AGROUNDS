import React from 'react';
import Nav from '../../components/display/Nav';
import MainLayout from '../../components/demo/MainLayout';
import main1 from '../../assets/demo/main1.png';
import main2 from '../../assets/demo/main2.png';
import main3 from '../../assets/demo/main3.png';
import main4 from '../../assets/demo/main4.png';
import main5 from '../../assets/demo/main5.png';
import main6 from '../../assets/demo/main6.png';
import { useNavigate, useLocation } from "react-router-dom";


const Demo_main = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('user_id') || 'u_001';
  const matchCode = searchParams.get('match_code') || 'm_001';
  sessionStorage.setItem('user_id', userId);
  sessionStorage.setItem('match_code', matchCode);

  return (
    <div>
      <Nav />
      <MainLayout imgsrc={main6} bgColor="#616161" onClick={() => navigate('/demo/totalmov')}>확인</MainLayout>
      <MainLayout imgsrc={main1} bgColor="#616161" onClick={() => navigate('/demo/teamMov')}>확인</MainLayout>
      <MainLayout imgsrc={main2} bgColor="#616161" onClick={() => navigate('/demo/personalMov')}>확인</MainLayout>
      <MainLayout imgsrc={main3} bgColor="#616161" onClick={() => navigate('/demo/anal')}>확인</MainLayout>
      <MainLayout imgsrc={main4} bgColor="#616161" onClick={() => window.location.href = 'https://forms.gle/qjFGZjtEWr4FfPe67'}>확인</MainLayout>
      <MainLayout imgsrc={main5} bgColor="#055540" onClick={() => navigate('/')} >둘러보기</MainLayout>
    </div>
  );
};

export default Demo_main;

