import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 로그인, 회원가입 페이지는 인증 체크 제외
    const publicPaths = ['/app', '/signup', '/'];
    const currentPath = location.pathname;
    
    // 공개 페이지인 경우 인증 체크 건너뛰기
    if (publicPaths.includes(currentPath) || currentPath.startsWith('/app/')) {
      return;
    }

    // 세션 스토리지에서 사용자 정보 확인
    const userCode = sessionStorage.getItem('userCode');
    const userName = sessionStorage.getItem('userName');
    
    // 사용자 정보가 없는 경우 앱 페이지로 리다이렉트
    if (!userCode || !userName) {
      console.log('인증되지 않은 접근 감지, 앱 페이지로 리다이렉트');
      navigate('/app', { replace: true });
      return;
    }

    console.log('인증된 사용자:', { userCode, userName });
  }, [navigate, location.pathname]);

  // 로그인, 회원가입 페이지는 인증 체크 제외
  const publicPaths = ['/app', '/signup', '/'];
  const currentPath = location.pathname;
  
  if (publicPaths.includes(currentPath) || currentPath.startsWith('/app/')) {
    return children;
  }

  // 사용자 정보가 없는 경우 로딩 표시 (리다이렉트 중)
  const userCode = sessionStorage.getItem('userCode');
  const userName = sessionStorage.getItem('userName');
  
  if (!userCode || !userName) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        인증 확인 중...
      </div>
    );
  }

  return children;
};

export default AuthGuard;
