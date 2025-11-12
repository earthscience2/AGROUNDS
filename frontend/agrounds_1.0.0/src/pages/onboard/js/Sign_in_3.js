import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginModal.scss';
import bottomLogo from '../../../assets/text_icon/logo_text_gray.png';
import leftArrow from '../../../assets/main_icons/back_black.png';
import manIcon from '../../../assets/identify_icon/man.png';
import womanIcon from '../../../assets/identify_icon/woman.png';
import checkIcon from '../../../assets/color_icons/check_gray.png';
import checkGreenIcon from '../../../assets/color_icons/check_green.png';

const Sign_in_3 = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [heightError, setHeightError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [birthDateError, setBirthDateError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 이전 단계 저장값 불러오기 (뒤로 가기 시에도 유지)
    const nickname = localStorage.getItem('userNickname');
    const h = localStorage.getItem('userHeight');
    const w = localStorage.getItem('userWeight');
    const b = localStorage.getItem('userBirthDate');
    const g = localStorage.getItem('userGender');
    if (nickname) setUserNickname(nickname); else navigate('/app/sign-in-1');
    if (h) {
      setHeight(h);
      // 키 범위 검사
      if (parseInt(h) < 50 || parseInt(h) > 250) {
        setHeightError('수치가 기준 범위를 벗어났습니다.');
      }
    }
    if (w) {
      setWeight(w);
      // 몸무게 범위 검사
      if (parseInt(w) < 30 || parseInt(w) > 300) {
        setWeightError('수치가 기준 범위를 벗어났습니다.');
      }
    }
    if (b) {
      // YYYY-MM-DD 형식을 8자리로 변환
      const birthDate8Digit = b.replace(/-/g, '');
      setBirthDate(birthDate8Digit);
      
      // 생년월일 유효성 검사
      if (birthDate8Digit.length === 8) {
        const year = parseInt(birthDate8Digit.substring(0, 4));
        const month = parseInt(birthDate8Digit.substring(4, 6));
        const day = parseInt(birthDate8Digit.substring(6, 8));
        
        if (year < 1900 || year > new Date().getFullYear()) {
          setBirthDateError('올바른 연도를 입력해주세요.');
        } else if (month < 1 || month > 12) {
          setBirthDateError('올바른 월을 입력해주세요.');
        } else if (day < 1 || day > 31) {
          setBirthDateError('올바른 일을 입력해주세요.');
        } else {
          const date = new Date(year, month - 1, day);
          if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            setBirthDateError('올바른 날짜를 입력해주세요.');
          }
        }
      }
    }
    if (g) setGender(g);
  }, [navigate]);

  // 폼 유효성 검사
  useEffect(() => {
    const valid = height && weight && birthDate && gender && !heightError && !weightError && !birthDateError;
    setIsValid(valid);
  }, [height, weight, birthDate, gender, heightError, weightError, birthDateError]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력 가능
    if (/^\d*$/.test(value)) {
      setHeight(value);
      localStorage.setItem('userHeight', value);
      
      // 키 범위 검사 (50~250)
      if (value && (parseInt(value) < 50 || parseInt(value) > 250)) {
        setHeightError('수치가 기준 범위를 벗어났습니다.');
      } else {
        setHeightError('');
      }
    }
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력 가능
    if (/^\d*$/.test(value)) {
      setWeight(value);
      localStorage.setItem('userWeight', value);
      
      // 몸무게 범위 검사 (30~300)
      if (value && (parseInt(value) < 30 || parseInt(value) > 300)) {
        setWeightError('수치가 기준 범위를 벗어났습니다.');
      } else {
        setWeightError('');
      }
    }
  };

  const handleBirthDateChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력 가능하고 8자리로 제한
    if (/^\d*$/.test(value) && value.length <= 8) {
      setBirthDate(value);
      localStorage.setItem('userBirthDate', value);
      
      // 8자리 완성 시 유효성 검사
      if (value.length === 8) {
        const year = parseInt(value.substring(0, 4));
        const month = parseInt(value.substring(4, 6));
        const day = parseInt(value.substring(6, 8));
        
        // 기본 유효성 검사
        if (year < 1900 || year > new Date().getFullYear()) {
          setBirthDateError('올바른 연도를 입력해주세요.');
        } else if (month < 1 || month > 12) {
          setBirthDateError('올바른 월을 입력해주세요.');
        } else if (day < 1 || day > 31) {
          setBirthDateError('올바른 일을 입력해주세요.');
        } else {
          // 실제 날짜 유효성 검사
          const date = new Date(year, month - 1, day);
          if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            setBirthDateError('올바른 날짜를 입력해주세요.');
          } else {
            setBirthDateError('');
          }
        }
      } else if (value.length > 0) {
        setBirthDateError('생년월일을 8자리로 입력해주세요.');
      } else {
        setBirthDateError('');
      }
    }
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    localStorage.setItem('userGender', selectedGender);
  };

  const handleContinue = () => {
    if (isValid) {
      // 8자리 생년월일을 YYYY-MM-DD 형식으로 변환
      const formattedBirthDate = birthDate.length === 8 
        ? `${birthDate.substring(0, 4)}-${birthDate.substring(4, 6)}-${birthDate.substring(6, 8)}`
        : birthDate;
      
      // 사용자 정보를 localStorage에 저장
      localStorage.setItem('userHeight', height);
      localStorage.setItem('userWeight', weight);
      localStorage.setItem('userBirthDate', formattedBirthDate);
      localStorage.setItem('userGender', gender);
      
      // 다음 단계로 이동
      navigate('/app/sign-in-4');
    }
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
          <h1 className='text-h1' style={{ margin: 0, color: 'var(--text-primary)' }}>개인정보</h1>
          <p className='text-body' style={{ color: 'var(--text-secondary)', margin: '8px 0 24px 0' }}>본인 정보를 입력해주세요</p>

          {/* 입력 필드들 */}
          <div style={{
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '16px',
            boxSizing: 'border-box'
          }}>
            {/* 키 입력 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid var(--border)'
            }}>
              <span className='text-body' style={{ color: 'var(--text-primary)', fontWeight: '500' }}>키</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={height}
                  onChange={handleHeightChange}
                  placeholder="0"
                  style={{
                    width: '120px',
                    border: 'none',
                    background: 'none',
                    fontSize: '16px',
                    textAlign: 'right',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-text)'
                  }}
                  maxLength={3}
                />
                <span className='text-body' style={{ color: 'var(--text-secondary)' }}>cm</span>
              </div>
            </div>
            {heightError && (
              <p className='text-body-sm' style={{ color: 'var(--error)', margin: '8px 0 0 0', textAlign: 'right' }}>
                {heightError}
              </p>
            )}

            {/* 몸무게 입력 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid var(--border)'
            }}>
              <span className='text-body' style={{ color: 'var(--text-primary)', fontWeight: '500' }}>몸무게</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={weight}
                  onChange={handleWeightChange}
                  placeholder="0"
                  style={{
                    width: '120px',
                    border: 'none',
                    background: 'none',
                    fontSize: '16px',
                    textAlign: 'right',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-text)'
                  }}
                  maxLength={3}
                />
                <span className='text-body' style={{ color: 'var(--text-secondary)' }}>kg</span>
              </div>
            </div>
            {weightError && (
              <p className='text-body-sm' style={{ color: 'var(--error)', margin: '8px 0 0 0', textAlign: 'right' }}>
                {weightError}
              </p>
            )}

            {/* 생년월일 입력 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0'
            }}>
              <span className='text-body' style={{ color: 'var(--text-primary)', fontWeight: '500' }}>생년월일</span>
              <input
                type="text"
                inputMode="numeric"
                value={birthDate}
                onChange={handleBirthDateChange}
                placeholder="YYYYMMDD"
                style={{
                  width: '120px',
                  border: 'none',
                  background: 'none',
                  fontSize: '16px',
                  textAlign: 'right',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-text)'
                }}
                maxLength={8}
              />
            </div>
            {birthDateError && (
              <p className='text-body-sm' style={{ color: 'var(--error)', margin: '8px 0 0 0', textAlign: 'right' }}>
                {birthDateError}
              </p>
            )}
          </div>

          {/* 성별 선택 */}
          <div style={{
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            gap: '15px',
            marginBottom: '20px',
            boxSizing: 'border-box'
          }}>
            {/* 남성 선택 카드 */}
            <div 
              onClick={() => handleGenderSelect('male')}
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: gender === 'male' ? '2px solid var(--primary)' : '2px solid transparent'
              }}
            >
            <img 
              src={manIcon} 
              alt="남성" 
              style={{
                width: '40px',
                height: '40px',
                marginBottom: '12px',
                objectFit: 'contain'
              }}
            />
            <div className='text-body' style={{
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              남성
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {gender === 'male' ? (
                <img 
                  src={checkGreenIcon} 
                  alt="선택됨" 
                  style={{
                    width: '24px',
                    height: '24px'
                  }}
                />
              ) : (
                <img 
                  src={checkIcon} 
                  alt="선택 안됨" 
                  style={{
                    width: '24px',
                    height: '24px',
                    opacity: '0.3'
                  }}
                />
              )}
            </div>
          </div>

            {/* 여성 선택 카드 */}
            <div 
              onClick={() => handleGenderSelect('female')}
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: gender === 'female' ? '2px solid var(--primary)' : '2px solid transparent'
              }}
            >
            <img 
              src={womanIcon} 
              alt="여성" 
              style={{
                width: '40px',
                height: '40px',
                marginBottom: '12px',
                objectFit: 'contain'
              }}
            />
            <div className='text-body' style={{
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              여성
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {gender === 'female' ? (
                <img 
                  src={checkGreenIcon} 
                  alt="선택됨" 
                  style={{
                    width: '24px',
                    height: '24px'
                  }}
                />
              ) : (
                <img 
                  src={checkIcon} 
                  alt="선택 안됨" 
                  style={{
                    width: '24px',
                    height: '24px',
                    opacity: '0.3'
                  }}
                />
              )}
            </div>
          </div>
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

export default Sign_in_3;
