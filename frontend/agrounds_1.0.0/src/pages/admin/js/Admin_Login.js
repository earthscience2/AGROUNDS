import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Admin_Login.scss';
import adminLogo from '../../../assets/big_icons/logo_green.png';
import { AdminLoginApi } from '../../../function/api/admin/adminApi';

const Admin_Login = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userId.trim()) {
      newErrors.userId = '아이디를 입력해주세요.';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 핸들러
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await AdminLoginApi(formData.userId, formData.password);
      
      if (response.status === 200 && response.data) {
        // 로그인 성공 - 세션 스토리지에 관리자 정보 저장
        sessionStorage.setItem('adminUserCode', response.data.user_code);
        sessionStorage.setItem('adminUserId', response.data.user_id);
        sessionStorage.setItem('adminLoginType', response.data.login_type);
        
        // 로그인 시간 저장 (1시간 유효)
        const loginTime = new Date().getTime();
        sessionStorage.setItem('adminLoginTime', loginTime.toString());
        
        // 대시보드로 이동
        navigate('/app/admin/dashboard');
      } else if (response.error) {
        setErrorMessage(response.error);
      }
    } catch (error) {
      console.error('관리자 로그인 오류:', error);
      
      if (error.response) {
        // 서버 응답이 있는 경우
        const errorData = error.response.data;
        const errorMsg = errorData?.error || '로그인에 실패했습니다.';
        const statusCode = error.response.status;
        
        console.error('서버 응답 상태:', statusCode);
        console.error('서버 응답 데이터:', errorData);
        
        if (statusCode === 403) {
          // 403 에러 특별 처리 (권한 문제)
          setErrorMessage(`관리자 권한 오류: ${errorMsg}`);
        } else if (statusCode === 401) {
          // 401 에러 (인증 실패)
          setErrorMessage(`인증 실패: ${errorMsg}`);
        } else {
          setErrorMessage(errorMsg);
        }
      } else {
        setErrorMessage('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className={`admin-login-page ${isVisible ? 'visible' : ''}`}>
      <div className='admin-login-content'>
        <div className='admin-login-header'>
          <div className='admin-logo-badge'>
            <img 
              className='admin-logo-img' 
              src={adminLogo} 
              alt='AGROUNDS 관리자'
            />
          </div>
          <h1 className='admin-login-title text-h1'>AGROUNDS</h1>
          <h2 className='admin-login-subtitle text-h3'>관리자 페이지</h2>
        </div>

        <form className='admin-login-form' onSubmit={handleLogin}>
          <div className='form-group'>
            <label htmlFor='userId' className='form-label text-body'>
              아이디
            </label>
            <input
              id='userId'
              type='text'
              className={`text-input ${errors.userId ? 'error' : ''}`}
              placeholder='아이디를 입력하세요'
              value={formData.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              aria-label='관리자 아이디'
              aria-invalid={!!errors.userId}
            />
            {errors.userId && (
              <span className='error-text text-caption'>{errors.userId}</span>
            )}
          </div>

          <div className='form-group'>
            <label htmlFor='password' className='form-label text-body'>
              비밀번호
            </label>
            <input
              id='password'
              type='password'
              className={`text-input ${errors.password ? 'error' : ''}`}
              placeholder='비밀번호를 입력하세요'
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              aria-label='관리자 비밀번호'
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <span className='error-text text-caption'>{errors.password}</span>
            )}
          </div>

          {errorMessage && (
            <div className='login-error-message' role='alert'>
              <span className='text-body'>{errorMessage}</span>
              <div className='error-debug-info text-caption'>
                {errorMessage.includes('현재 권한 유형') && (
                  <div>
                    <p>💡 해결 방법:</p>
                    <p>• 데이터베이스에서 해당 계정의 login_type을 'messi' 또는 'guest'로 변경하세요</p>
                    <p>• 또는 관리자 권한이 있는 계정으로 로그인하세요</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type='submit'
            className='btn-primary admin-login-btn'
            disabled={loading}
            aria-label='관리자 로그인'
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className='admin-login-footer'>
          <p className='text-caption'>관리자 전용 페이지입니다</p>
        </div>
      </div>
    </div>
  );
};

export default Admin_Login;
