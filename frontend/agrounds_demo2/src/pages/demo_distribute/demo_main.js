import React from 'react';
import Nav from '../../components/display/Nav';
import MainLayout from '../../components/demo/MainLayout';
import main1 from '../../assets/demo/main1.png';
import main2 from '../../assets/demo/main2.png';
import main3 from '../../assets/demo/main3.png';
import main4 from '../../assets/demo/main4.png';
import main5 from '../../assets/demo/main5.png';
import main6 from '../../assets/demo/main6.png';
import { useNavigate } from "react-router-dom"

const Demo_main = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Nav />
      <MainLayout imgsrc={main1} bgColor="#616161" onClick={() => navigate('/demo/teamMov')}>확인</MainLayout>
      <MainLayout imgsrc={main2} bgColor="#616161" onClick={() => navigate('/demo/personalMov')}>확인</MainLayout>
      <MainLayout imgsrc={main6} bgColor="#616161" onClick={() => navigate('/demo/totalmov')}>확인</MainLayout>
      <MainLayout imgsrc={main3} bgColor="#616161" onClick={() => navigate('/demo/anal')}>확인</MainLayout>
      <MainLayout imgsrc={main4} bgColor="#616161" onClick={() => window.location.href = 'https://forms.gle/qjFGZjtEWr4FfPe67'}>확인</MainLayout>
      <MainLayout imgsrc={main5} bgColor="#055540" onClick={() => navigate('/display/main')} >둘러보기</MainLayout>
    </div>
  );
};

export default Demo_main;

