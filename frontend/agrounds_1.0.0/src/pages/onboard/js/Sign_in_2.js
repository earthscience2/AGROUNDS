import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../onboard/css/GetStarted.scss';
import bottomLogo from '../../../assets/logo/buttom_logo.png';
import leftArrow from '../../../assets/common/left.png';

const Sign_in_1 = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoBack = () => {
    navigate(-1);
  };

  const koreanNumberRegex = /^[가-힣0-9]+$/;
  const incompleteKoreanRegex = /[ㄱ-ㅎㅏ-ㅣ]/;

  const validateNickname = (value) => {
    if (value.length < 2 || value.length > 16) return false;
    if (!koreanNumberRegex.test(value)) return false;
    if (incompleteKoreanRegex.test(value)) return false;
    return true;
  };

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
      setIsValid(validateNickname(saved));
    }
  }, []);

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\s/g, '');
    setNickname(cleanValue);
    const valid = validateNickname(cleanValue);
    setIsValid(valid);
    localStorage.setItem('userNickname', cleanValue);
    if (valid) setErrorMessage('');
    else if (cleanValue.length > 0) {
      if (cleanValue.length < 2) setErrorMessage('닉네임은 2자 이상 입력해주세요.');
      else if (cleanValue.length > 16) setErrorMessage('닉네임은 16자 이하로 입력해주세요.');
      else if (incompleteKoreanRegex.test(cleanValue)) setErrorMessage('한글을 완성해서 입력해주세요.');
      else if (!koreanNumberRegex.test(cleanValue)) setErrorMessage('한글과 숫자만 입력 가능합니다.');
    } else setErrorMessage('');
  };

  const handleContinue = () => {
    if (!isValid) return;
    localStorage.setItem('userNickname', nickname);
    navigate('/app/sign-in-3');
  };

  return (
    <div className='background'>
      <button 
        onClick={handleGoBack}
        style={{ position: 'absolute', top: '40px', left: '20px', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10, padding: '8px' }}
      >
        <img src={leftArrow} alt="뒤로가기" style={{width: '24px', height: '24px'}} />
      </button>

      <div className='content' style={{ alignItems: 'flex-start', textAlign: 'left', width: '100%', height: 'auto', paddingTop: '96px', paddingLeft: 'calc(72px + env(safe-area-inset-left))', paddingRight: '72px', gap: '12px' }}>
        <h1 style={{ fontSize: '34px', fontWeight: '800', color: '#000000', margin: '0', lineHeight: '1.2', paddingLeft: '40px', paddingRight: '40px' }}>선수명</h1>
        <p style={{ fontSize: '16px', color: '#6F6F6F', margin: '8px 0 20px 0', lineHeight: '1.4', paddingLeft: '40px', paddingRight: '40px' }}>사용할 닉네임을 만들어주세요</p>

        <div style={{ width: '100%' }}>
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }}
            placeholder="닉네임을 입력해주세요(중복가능)"
            style={{ width: '86%', height: '60px', padding: '0 24px', border: 'none', borderRadius: '20px', backgroundColor: '#E9EEF1', fontSize: '16px', outline: 'none', boxSizing: 'border-box', color: '#000000', display: 'block', margin: '0 auto', fontFamily: "'Pretendard', sans-serif" }}
            maxLength={16}
          />

          {errorMessage && (
            <p style={{ fontSize: '14px', color: '#FF6B6B', margin: '12px auto 0', width: '86%', paddingLeft: '40px', paddingRight: '40px', textAlign: 'left' }}>{errorMessage}</p>
          )}
        </div>
      </div>

      <div className='footer'>
        <div className='cta-area'>
          <button onClick={handleContinue} disabled={!isValid} style={{ width: '100%', height: '60px', border: 'none', borderRadius: '20px', backgroundColor: isValid ? '#079669' : '#E5E5E5', color: isValid ? '#FFFFFF' : '#9E9E9E', fontSize: '18px', fontWeight: '600', cursor: isValid ? 'pointer' : 'not-allowed', transition: 'all 0.2s ease' }}>계속</button>
        </div>
        <img className='brand-image' src={bottomLogo} />
      </div>
    </div>
  );
};

export default Sign_in_1;
