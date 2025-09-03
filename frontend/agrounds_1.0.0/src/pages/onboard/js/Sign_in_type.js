import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../onboard/css/GetStarted.scss';
import startLogo from '../../../assets/logo/start_logo.png';
import appleLogo from '../../../assets/logo/apple_logo.png';
import kakaoLogo from '../../../assets/logo/kakao_logo.png';
import naverLogo from '../../../assets/logo/naver_logo.png';
import bottomLogo from '../../../assets/logo/buttom_logo.png';
import leftArrow from '../../../assets/common/left.png';
import blackLogo from '../../../assets/logo/black_logo.png';

const Sign_in_type = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // 뒤로가기 시 /app으로 이동하여 회원가입 문구가 나오지 않도록 함
    navigate('/app');
  };

  const kakaoSignup = () => { // 카카오 로그인 처리를 위해 절대주소로 이동
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost';
    const serverBase = 'https://agrounds.com';
    const callbackHost = 'agrounds.com';
    const clientParam = isLocal ? 'localhost' : 'agrounds.com';
    window.location.href = `${serverBase}/api/login/kakao/?hostname=${callbackHost}&client=${clientParam}`;
  };

  const handleKakaoSignup = async () => {
    localStorage.setItem('login_type', 'kakao');
    try {
      // 카카오 콜백에서 저장된 암호화 이메일이 있으면 선확인
      const encId = localStorage.getItem('social_email');
      if (encId) {
        const serverBase = 'https://agrounds.com';
        const resp = await fetch(`${serverBase}/api/login/check-user-exists/?id=${encodeURIComponent(encId)}&login_type=kakao`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.exists) {
            alert('이미 가입된 회원입니다');
            navigate('/app/login');
            return;
          }
        }
      }
    } catch (_) {
      // 무시 후 진행
    }
    navigate('/app/sign-in-1');
  };

  const handleNaverSignup = async () => {
    localStorage.setItem('login_type', 'naver');
    try {
      const encId = localStorage.getItem('social_email');
      if (encId) {
        const serverBase = 'https://agrounds.com';
        const resp = await fetch(`${serverBase}/api/login/check-user-exists/?id=${encodeURIComponent(encId)}&login_type=naver`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.exists) {
            alert('이미 가입된 회원입니다');
            navigate('/app/login');
            return;
          }
        }
      }
    } catch (_) {}
    navigate('/app/sign-in-1');
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
        <p className='subtitle'>서툰 시작은 부끄러운 게 아니에요</p>
      </div>

      <div className='footer'>
        <div className='cta-area'>
          <div style={{display:'flex', flexDirection:'column', gap:'14px', width:'100%'}}>
            <div style={{position:'relative', display:'flex', alignItems:'center', background:'#EFEFEF', height:'54px', borderRadius:'28px', padding:'0 18px', justifyContent:'center', fontWeight:600, cursor:'pointer'}} onClick={() => { localStorage.setItem('login_type','apple'); navigate('/app/sign-in-1'); }}>
              <img src={appleLogo} style={{width:'20px', position:'absolute', left:'18px'}} />
              <span className="btn-text">애플로 회원가입</span>
            </div>
            <div style={{position:'relative', display:'flex', alignItems:'center', background:'#F7DE0C', height:'54px', borderRadius:'28px', padding:'0 18px', justifyContent:'center', fontWeight:600, cursor:'pointer'}} onClick={handleKakaoSignup}>
              <img src={kakaoLogo} style={{width:'20px', position:'absolute', left:'18px'}} />
              <span className="btn-text">카카오톡으로 회원가입</span>
            </div>
            <div style={{position:'relative', display:'flex', alignItems:'center', background:'#00C05A', height:'54px', borderRadius:'28px', padding:'0 18px', justifyContent:'center', fontWeight:600, color:'#fff'}} onClick={handleNaverSignup}>
              <img src={naverLogo} style={{width:'20px', position:'absolute', left:'18px'}} />
              <span className="btn-text">네이버로 회원가입</span>
            </div>
          </div>
        </div>
        <img className='brand-image' src={bottomLogo} />
      </div>
    </div>
  );
};

export default Sign_in_type;
