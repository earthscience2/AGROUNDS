import React, { useEffect, useState } from 'react';
import Nav from '../../components/display/Nav';
import MainLayout from '../../components/demo/MainLayout';
import main1 from '../../assets/demo/main1.png';
import main2 from '../../assets/demo/main2.png';
import main3 from '../../assets/demo/main3.png';
import main4 from '../../assets/demo/main4.png';
import main5 from '../../assets/demo/main5.png';
import main6 from '../../assets/demo/main6.png';
import main7 from '../../assets/demo/main7.png';
import { useNavigate, useLocation } from "react-router-dom";
import client from '../../clients';


const Demo_main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [type, setType] = useState();
  const [error, setError] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  
  let userId = searchParams.get('user_id') || '';
  let matchCode = searchParams.get('match_code') || '';

  if (!userId && !matchCode) {
    userId = 'u_001';
    matchCode = 'm_001';
  }

  sessionStorage.setItem('user_id', userId);
  sessionStorage.setItem('match_code', matchCode);

  const data = {
    match_code: matchCode
  }

  useEffect (() => {
    client.post('/api/test_page/get-match-type/', data)
    .then((response) => {
      setType(response.data.match_type);
      setError(null);
    })
    .catch((error) => {
      setError("매치 타입을 불러오는데 실패했습니다. 다시 시도해주세요."); 
        console.error(error);
    })
  }, [])

  const MoreService = () => {
    sessionStorage.clear();
    navigate('/demo/main');
    window.location.reload();
  }
  const TypeReturn = () => {
    if (type === 'full') {
      return (
        <>
          <MainLayout imgsrc={main6} bgColor="#616161" onClick={() => navigate('/demo/totalmov')}>확인</MainLayout>
          <MainLayout imgsrc={main4} bgColor="#616161" onClick={() => window.location.href = 'https://forms.gle/qjFGZjtEWr4FfPe67'}>확인</MainLayout>
          <MainLayout imgsrc={main7} bgColor="#616161" onClick={MoreService}>확인</MainLayout>
          <MainLayout imgsrc={main5} bgColor="#055540" onClick={() => navigate('/')} >둘러보기</MainLayout>
        </>
      )
    } else if (type === 'full_team') {
      return (
        <>
          <MainLayout imgsrc={main6} bgColor="#616161" onClick={() => navigate('/demo/totalmov')}>확인</MainLayout>
          <MainLayout imgsrc={main1} bgColor="#616161" onClick={() => navigate('/demo/teamMov')}>확인</MainLayout>
          <MainLayout imgsrc={main4} bgColor="#616161" onClick={() => window.location.href = 'https://forms.gle/qjFGZjtEWr4FfPe67'}>확인</MainLayout>
          <MainLayout imgsrc={main7} bgColor="#616161" onClick={MoreService}>확인</MainLayout>
          <MainLayout imgsrc={main5} bgColor="#055540" onClick={() => navigate('/')} >둘러보기</MainLayout>
        </>
      )
    } else if (type ==='all'){
      return (
        <>
          <MainLayout imgsrc={main6} bgColor="#616161" onClick={() => navigate('/demo/totalmov')}>확인</MainLayout>
          <MainLayout imgsrc={main1} bgColor="#616161" onClick={() => navigate('/demo/teamMov')}>확인</MainLayout>
          <MainLayout imgsrc={main2} bgColor="#616161" onClick={() => navigate('/demo/personalMov')}>확인</MainLayout>
          <MainLayout imgsrc={main3} bgColor="#616161" onClick={() => navigate('/demo/anal')}>확인</MainLayout>
          <MainLayout imgsrc={main4} bgColor="#616161" onClick={() => window.location.href = 'https://forms.gle/qjFGZjtEWr4FfPe67'}>확인</MainLayout>
          <MainLayout imgsrc={main5} bgColor="#055540" onClick={() => navigate('/')} >둘러보기</MainLayout>
      </>
      )
    } else {
      return <p></p>;
    }
  }

  return (
    <div>
      <Nav />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {TypeReturn()}
    </div>
  );
};

export default Demo_main;

const ErrorMessage = ({ children }) => {
  return (
    <div
      style={{
        color: "red",
        backgroundColor: "#ffe5e5",
        padding: "10px",
        borderRadius: "5px",
        margin: "20px 0",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};