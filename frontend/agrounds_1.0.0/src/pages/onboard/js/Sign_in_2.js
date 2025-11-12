import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginModal.scss';
import bottomLogo from '../../../assets/text_icon/logo_text_gray.png';
import leftArrow from '../../../assets/main_icons/back_black.png';

const Sign_in_2 = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const koreanNumberLowercaseRegex = /^[가-힣0-9a-z]+$/;
  const incompleteKoreanRegex = /[ㄱ-ㅎㅏ-ㅣ]/;

  const validateNickname = (value) => {
    if (value.length < 2 || value.length > 16) return false;
    if (!koreanNumberLowercaseRegex.test(value)) return false;
    if (incompleteKoreanRegex.test(value)) return false;
    return true;
  };

  const checkNameDuplicate = async (name) => {
    if (!name || name.length < 2) {
      setDuplicateCount(0);
      return;
    }

    setIsCheckingDuplicate(true);
    try {
      const response = await fetch(`https://agrounds.com/api/user/check-name-duplicate/?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      
      if (response.ok) {
        setDuplicateCount(data.duplicate_count);
      } else {
        setDuplicateCount(0);
      }
    } catch (error) {
      setDuplicateCount(0);
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  const debouncedCheckDuplicate = (name) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const timer = setTimeout(() => {
      checkNameDuplicate(name);
    }, 500); // 500ms 디바운스
    
    setDebounceTimer(timer);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromKakao = params.get('email');
    const loginFromKakao = params.get('login');
    const alertEmail = params.get('alert_email');
    if (emailFromKakao) localStorage.setItem('social_email', emailFromKakao);
    if (loginFromKakao) localStorage.setItem('login_type', loginFromKakao);
    if (alertEmail) alert(`등록된 계정이 없어요. 회원가입 페이지로 이동합니다.\n이메일: ${alertEmail}`);

    const saved = localStorage.getItem('userNickname');
    if (saved) {
      setNickname(saved);
      const valid = validateNickname(saved);
      setIsValid(valid);
      if (valid) {
        checkNameDuplicate(saved);
      }
    }
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    // 공백 제거 및 대문자를 소문자로 변환
    const cleanValue = value.replace(/\s/g, '').toLowerCase();
    setNickname(cleanValue);
    const valid = validateNickname(cleanValue);
    setIsValid(valid);
    localStorage.setItem('userNickname', cleanValue);
    
    if (valid) {
      setErrorMessage('');
      // 유효한 닉네임일 때만 중복 확인 (디바운싱 적용)
      debouncedCheckDuplicate(cleanValue);
    } else if (cleanValue.length > 0) {
      if (cleanValue.length < 2) setErrorMessage('닉네임은 2자 이상 입력해주세요.');
      else if (cleanValue.length > 16) setErrorMessage('닉네임은 16자 이하로 입력해주세요.');
      else if (incompleteKoreanRegex.test(cleanValue)) setErrorMessage('한글을 완성해서 입력해주세요.');
      else if (!koreanNumberLowercaseRegex.test(cleanValue)) setErrorMessage('한글, 영어 소문자, 숫자만 입력 가능합니다.');
      setDuplicateCount(0);
    } else {
      setErrorMessage('');
      setDuplicateCount(0);
    }
  };

  const handleContinue = () => {
    if (!isValid) return;
    localStorage.setItem('userNickname', nickname);
    navigate('/app/sign-in-3');
  };

  return (
    <div className={`login-page ${isVisible ? 'visible' : ''}`}>
      <div className='login-content'>
        <button 
          className='back-button'
          onClick={handleGoBack}
          aria-label='뒤로가기'
        >
          <img src={leftArrow} alt='뒤로가기' className='back-icon' />
        </button>

        <div className='login-header' style={{ alignItems: 'flex-start', paddingTop: '96px', gap: '8px' }}>
          <h1 className='text-h1' style={{ margin: 0, color: 'var(--text-primary)' }}>선수명</h1>
          <p className='text-body' style={{ color: 'var(--text-secondary)', margin: '8px 0 24px 0' }}>사용할 닉네임을 만들어주세요(중복가능)</p>

          <div style={{ width: '100%' }}>
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }}
              placeholder="닉네임을 입력해주세요(중복가능)"
              style={{ 
                width: '100%', 
                height: '60px', 
                padding: '0 24px', 
                border: 'none', 
                borderRadius: '20px', 
                backgroundColor: 'var(--bg-primary)', 
                fontSize: '16px', 
                outline: 'none', 
                boxSizing: 'border-box', 
                color: 'var(--text-primary)', 
                fontFamily: 'var(--font-text)'
              }}
              maxLength={16}
            />

            {errorMessage && (
              <p className='text-body-sm' style={{ color: 'var(--error)', margin: '12px 0 0', paddingLeft: '24px', textAlign: 'left' }}>{errorMessage}</p>
            )}
            
            {isValid && !errorMessage && (
              <div style={{ margin: '12px 0 0', paddingLeft: '24px', textAlign: 'left' }}>
                {isCheckingDuplicate ? (
                  <p className='text-body-sm' style={{ color: 'var(--text-secondary)', margin: '0' }}>중복 확인 중...</p>
                ) : duplicateCount > 0 ? (
                  <p className='text-body-sm' style={{ color: 'var(--primary)', margin: '0' }}>
                    해당 이름을 사용하는 사람이 {duplicateCount}명 있어요!
                  </p>
                ) : (
                  <p className='text-body-sm' style={{ color: 'var(--primary)', margin: '0' }}>
                    해당 이름을 사용하는 사람이 아무도 없어요!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className='login-footer'>
          <div className='login-buttons' style={{ maxWidth: '100%' }}>
            <button 
              onClick={handleContinue} 
              disabled={!isValid}
              className='social-login-btn'
              style={{ 
                backgroundColor: isValid ? 'var(--primary)' : 'var(--border)', 
                color: isValid ? 'var(--bg-surface)' : 'var(--text-disabled)', 
                cursor: isValid ? 'pointer' : 'not-allowed',
                height: '54px',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              계속
            </button>
          </div>
          <img className='brand-image' src={bottomLogo} alt='AGROUNDS' />
        </div>
      </div>
    </div>
  );
};

export default Sign_in_2;
