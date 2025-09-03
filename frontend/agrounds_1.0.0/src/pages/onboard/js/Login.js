import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../onboard/css/GetStarted.scss';
import appleLogo from '../../../assets/logo/apple_logo.png';
import kakaoLogo from '../../../assets/logo/kakao_logo.png';
import naverLogo from '../../../assets/logo/naver_logo.png';
import startLogo from '../../../assets/logo/start_logo.png';
import bottomLogo from '../../../assets/logo/buttom_logo.png';
import blackLogo from '../../../assets/logo/black_logo.png';
import leftArrow from '../../../assets/common/left.png';

const Login = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // 콜백에서 미가입자일 경우 알림 후 회원가입 페이지로 이동
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signupPrompt') === '1') {
      const encryptedId = params.get('id');
      if (encryptedId) {
        // 서버가 전달한 암호화된 이메일을 저장 (서버에서 복호화됨)
        localStorage.setItem('social_email', encryptedId);
      }
      const confirmed = window.confirm('등록되지 않은 계정입니다. 회원가입을 진행하시겠습니까?');
      if (confirmed) {
        navigate('/app/sign-in-type');
      }
    }
  }, [navigate]);

  const kakaoLogin = () => {
    // 백엔드 카카오 로그인 API 호출
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    // 인증은 배포 서버에서 처리, 콜백 후 리다이렉트 대상은 client 파라미터로 지정
    const serverBase = 'https://agrounds.com';
    const callbackHost = isLocal ? 'agrounds.com' : 'agrounds.com';
    const clientParam = isLocal ? 'localhost' : 'agrounds.com';
    const kakaoLoginUrl = `${serverBase}/api/login/kakao/?hostname=${callbackHost}&client=${clientParam}`;
    window.location.href = kakaoLoginUrl;
  };

  const handleAppleLogin = () => {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    const serverBase = 'https://agrounds.com';
    const callbackHost = isLocal ? 'agrounds.com' : 'agrounds.com';
    const clientParam = isLocal ? 'localhost' : 'agrounds.com';
    const appleLoginUrl = `${serverBase}/api/login/apple/?hostname=${callbackHost}&client=${clientParam}`;
    window.location.href = appleLoginUrl;
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 처리
    // 실제 구현에서는 카카오 OAuth 로그인 로직 추가
    checkUserInfoAndRedirect();
  };

  const handleNaverLogin = () => {
    // 백엔드 네이버 로그인 API 호출
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    const serverBase = 'https://agrounds.com';
    const callbackHost = isLocal ? 'agrounds.com' : 'agrounds.com';
    const clientParam = isLocal ? 'localhost' : 'agrounds.com';
    const naverLoginUrl = `${serverBase}/api/login/naver/?hostname=${callbackHost}&client=${clientParam}`;
    window.location.href = naverLoginUrl;
  };

  // 유저 정보 확인 및 리다이렉트 처리
  const checkUserInfoAndRedirect = async () => {
    try {
      // 실제 구현에서는 로그인 후 받은 토큰이나 사용자 ID로 유저 정보 확인
      const response = await fetch(`/api/user/info/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // 실제 토큰 사용
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData && userData.user_code) {
          // 유저 정보가 있으면 메인 페이지로 이동
          navigate('/app/main');
        } else {
          // 유저 정보가 없으면 알림창 표시 후 회원가입 페이지로 이동
          showUserNotFoundAlert();
        }
      } else {
        // API 호출 실패 시에도 회원가입 페이지로 이동
        showUserNotFoundAlert();
      }
    } catch (error) {
      // 네트워크 오류 등으로 인해 유저 정보 확인 실패 시 회원가입 페이지로 이동
      showUserNotFoundAlert();
    }
  };

  // 유저 정보 없음 알림창 표시
  const showUserNotFoundAlert = () => {
    alert('등록된 정보가 없습니다. 회원가입 페이지로 이동합니다.');
    navigate('/app/sign-in-type');
  };

  return (
    <div className='background'>
      <button 
        onClick={handleGoBack}
        style={{
          position: 'absolute',
          top: '40px',
          left: '20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: 10,
          padding: '8px'
        }}
      >
        <img src={leftArrow} alt="뒤로가기" style={{width: '24px', height: '24px'}} />
      </button>

      <div className='content'>
        <div className='symbol-badge'>
          <img className='symbol-img' src={startLogo} />
        </div>
        <p className='subtitle'>오늘의 시작이 내일의 나를 키워요</p>
      </div>

      <div className='footer'>
        <div className='cta-area'>
          <div style={{display:'flex', flexDirection:'column', gap:'14px', width:'100%'}}>
            <div style={{position:'relative', display:'flex', alignItems:'center', background:'#EFEFEF', height:'54px', borderRadius:'28px', padding:'0 18px', justifyContent:'center', fontWeight:600, cursor:'pointer'}} onClick={handleAppleLogin}>
              <img src={appleLogo} style={{width:'20px', position:'absolute', left:'18px'}} />
              <span className="btn-text">애플로 로그인</span>
            </div>
            <div style={{position:'relative', display:'flex', alignItems:'center', background:'#F7DE0C', height:'54px', borderRadius:'28px', padding:'0 18px', justifyContent:'center', fontWeight:600, cursor:'pointer'}} onClick={kakaoLogin}>
              <img src={kakaoLogo} style={{width:'20px', position:'absolute', left:'18px'}} />
              <span className="btn-text">카카오톡으로 로그인</span>
            </div>
            <div style={{position:'relative', display:'flex', alignItems:'center', background:'#00C05A', height:'54px', borderRadius:'28px', padding:'0 18px', justifyContent:'center', fontWeight:600, color:'#fff', cursor:'pointer'}} onClick={handleNaverLogin}>
              <img src={naverLogo} style={{width:'20px', position:'absolute', left:'18px'}} />
              <span className="btn-text">네이버로 로그인</span>
            </div>
            <div style={{position:'relative', display:'flex', alignItems:'center', background:'#0B8B69', height:'54px', borderRadius:'28px', padding:'0 18px', justifyContent:'center', fontWeight:600, color:'#fff', cursor:'pointer'}} onClick={() => navigate('/app/sign-in-type')}>
              <img src={blackLogo} style={{width:'20px', position:'absolute', left:'18px'}} />
              <span className="btn-text">AGROUNDS 회원가입</span>
            </div>
          </div>
        </div>
        <img className='brand-image' src={bottomLogo} />
      </div>
    </div>
  );
};

export default Login;


