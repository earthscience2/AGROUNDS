import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../onboard/css/GetStarted.scss';
import bottomLogo from '../../../assets/logo/buttom_logo.png';
import leftArrow from '../../../assets/common/left.png';
import manIcon from '../../../assets/common/man.png';
import womanIcon from '../../../assets/common/woman.png';
import checkIcon from '../../../assets/common/check.png';
import checkGreenIcon from '../../../assets/common/check_green.png';

const Sign_in_2 = () => {
  const navigate = useNavigate();
  const [userNickname, setUserNickname] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // 이전 단계 저장값 불러오기 (뒤로 가기 시에도 유지)
    const nickname = localStorage.getItem('userNickname');
    const h = localStorage.getItem('userHeight');
    const w = localStorage.getItem('userWeight');
    const b = localStorage.getItem('userBirthDate');
    const g = localStorage.getItem('userGender');
    if (nickname) setUserNickname(nickname); else navigate('/app/sign-in-1');
    if (h) setHeight(h);
    if (w) setWeight(w);
    if (b) setBirthDate(b);
    if (g) setGender(g);
  }, [navigate]);

  // 폼 유효성 검사
  useEffect(() => {
    const valid = height && weight && birthDate && gender;
    setIsValid(valid);
  }, [height, weight, birthDate, gender]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력 가능
    if (/^\d*$/.test(value)) {
      setHeight(value);
      localStorage.setItem('userHeight', value);
    }
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력 가능
    if (/^\d*$/.test(value)) {
      setWeight(value);
      localStorage.setItem('userWeight', value);
    }
  };

  const handleBirthDateChange = (e) => {
    setBirthDate(e.target.value);
    localStorage.setItem('userBirthDate', e.target.value);
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    localStorage.setItem('userGender', selectedGender);
  };

  const handleContinue = () => {
    if (isValid) {
      // 사용자 정보를 localStorage에 저장
      localStorage.setItem('userHeight', height);
      localStorage.setItem('userWeight', weight);
      localStorage.setItem('userBirthDate', birthDate);
      localStorage.setItem('userGender', gender);
      
      // 다음 단계로 이동
      navigate('/app/sign-in-4');
    }
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

      <div 
        className='content'
        style={{
          alignItems: 'flex-start',
          textAlign: 'left',
          width: '100%',
          height: 'auto',
          paddingTop: '96px',
          paddingLeft: 'calc(72px + env(safe-area-inset-left))',
          paddingRight: '72px',
          gap: '12px'
        }}
      >
        <h1 style={{
          fontSize: '34px',
          fontWeight: '800',
          color: '#000000',
          margin: '0',
          lineHeight: '1.2',
          paddingLeft: '40px',
          paddingRight: '40px'
        }}>
          개인정보
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6F6F6F',
          margin: '8px 0 20px 0',
          lineHeight: '1.4',
          paddingLeft: '40px',
          paddingRight: '40px'
        }}>
          본인 정보를 입력해주세요
        </p>

        {/* 입력 필드들 */}
        <div style={{
          width: '70%',
          backgroundColor: '#E9EEF1',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '4px',
          margin: '0 auto'
        }}>
          {/* 키 입력 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: '1px solid #D1D5DB'
          }}>
            <span style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: '500'
            }}>
              키
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <input
                type="text"
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
                  color: '#000000'
                }}
                maxLength={3}
              />
              <span style={{
                fontSize: '16px',
                color: '#6F6F6F'
              }}>
                cm
              </span>
            </div>
          </div>

          {/* 몸무게 입력 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: '1px solid #D1D5DB'
          }}>
            <span style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: '500'
            }}>
              몸무게
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <input
                type="text"
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
                  color: '#000000'
                }}
                maxLength={3}
              />
              <span style={{
                fontSize: '16px',
                color: '#6F6F6F'
              }}>
                kg
              </span>
            </div>
          </div>

          {/* 생년월일 입력 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0'
          }}>
            <span style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: '500'
            }}>
              생년월일
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <input
                type="date"
                value={birthDate}
                onChange={handleBirthDateChange}
                style={{
                  width: '86%',
                  border: 'none',
                  background: 'none',
                  fontSize: '16px',
                  textAlign: 'right',
                  outline: 'none',
                  color: '#000000'
                }}
              />
            </div>
          </div>
        </div>

        {/* 성별 선택 */}
        <div style={{
          width: '86%',
          display: 'flex',
          gap: '15px',
          marginBottom: '20px',
          margin: '0 auto'
        }}>
          {/* 남성 선택 카드 */}
          <div 
            onClick={() => handleGenderSelect('male')}
            style={{
              flex: 1,
              backgroundColor: '#E9EEF1',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '2px solid transparent'
            }}
          >
            <img 
              src={manIcon} 
              alt="남성" 
              style={{
                width: '32px',
                height: '50px',
                marginBottom: '12px'
              }}
            />
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#000000',
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
              backgroundColor: '#E9EEF1',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '2px solid transparent'
            }}
          >
            <img 
              src={womanIcon} 
              alt="여성" 
              style={{
                width: '32px',
                height: '50px',
                marginBottom: '12px'
              }}
            />
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#000000',
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

      <div className='footer'>
        <div className='cta-area'>
          <button
            onClick={handleContinue}
            disabled={!isValid}
            style={{
              width: '100%',
              height: '60px',
              border: 'none',
              borderRadius: '20px',
              backgroundColor: isValid ? '#079669' : '#E5E5E5',
              color: isValid ? '#FFFFFF' : '#9E9E9E',
              fontSize: '18px',
              fontWeight: '600',
              cursor: isValid ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            계속
          </button>
        </div>
        <img className='brand-image' src={bottomLogo} />
      </div>
    </div>
  );
};

export default Sign_in_2;
