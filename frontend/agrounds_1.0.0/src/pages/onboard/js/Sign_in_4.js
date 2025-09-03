import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../onboard/css/GetStarted.scss';
import bottomLogo from '../../../assets/logo/buttom_logo.png';
import leftArrow from '../../../assets/common/left.png';
import rightArrow from '../../../assets/common/right.png';
import checkGreenIcon from '../../../assets/common/check_green.png';

const Sign_in_4 = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    userType: '',
    userLevel: '',
    preferredPosition: '',
    activityArea: '',
    aiPersonality: ''
  });
  const [isValid, setIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalOptions, setModalOptions] = useState([]);
  const sidoList = ['전국','서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시','세종특별자치시','경기도','강원특별자치도','충청북도','충청남도','전북특별자치도','전라남도','경상북도','경상남도','제주특별자치도'];
  const sigunguMap = {
    '전국': ['전체'],
    '서울특별시': ['전체','강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'],
    '부산광역시': ['전체','중구','서구','동구','영도구','부산진구','동래구','남구','북구','해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'],
    '대구광역시': ['전체','중구','동구','서구','남구','북구','수성구','달서구','달성군'],
    '인천광역시': ['전체','중구','동구','미추홀구','연수구','남동구','부평구','계양구','서구','강화군','옹진군'],
    '광주광역시': ['전체','동구','서구','남구','북구','광산구'],
    '대전광역시': ['전체','동구','중구','서구','유성구','대덕구'],
    '울산광역시': ['전체','중구','남구','동구','북구','울주군'],
    '세종특별자치시': ['전체','세종특별자치시'],
    '경기도': ['전체','수원시','고양시','용인시','성남시','부천시','화성시','안산시','남양주시','안양시','평택시','의정부시','파주시','시흥시','김포시','광주시','광명시','군포시','오산시','이천시','안성시','의왕시','하남시','양주시','구리시','포천시','여주시','동두천시','과천시'],
    '강원특별자치도': ['전체','춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군','영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'],
    '충청북도': ['전체','청주시','충주시','제천시','보은군','옥천군','영동군','증평군','진천군','괴산군','음성군','단양군'],
    '충청남도': ['전체','천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시','금산군','부여군','서천군','청양군','홍성군','예산군','태안군'],
    '전북특별자치도': ['전체','전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군','장수군','임실군','순창군','고창군','부안군'],
    '전라남도': ['전체','목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군','보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군','장성군','완도군','진도군','신안군'],
    '경상북도': ['전체','포항시','경주시','김천시','안동시','구미시','영주시','영천시','상주시','문경시','경산시','군위군','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군','예천군','봉화군','울진군','울릉군'],
    '경상남도': ['전체','창원시','진주시','통영시','사천시','김해시','밀양시','거제시','양산시','의령군','함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'],
    '제주특별자치도': ['전체','제주시','서귀포시']
  };
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigungu, setSelectedSigungu] = useState('');
  const [showRegionModal, setShowRegionModal] = useState(false);

  useEffect(() => {
    // 이전 페이지에서 저장된 정보 가져오기
    const nickname = localStorage.getItem('userNickname');
    const height = localStorage.getItem('userHeight');
    const weight = localStorage.getItem('userWeight');
    const birthDate = localStorage.getItem('userBirthDate');
    const gender = localStorage.getItem('userGender');
    
    if (!nickname || !height || !weight || !birthDate || !gender) {
      // 필수 정보가 없으면 개인정보 단계로 리다이렉트
      navigate('/app/sign-in-3');
    }
  }, [navigate]);

  // 폼 유효성 검사 (모든 필드 필수)
  useEffect(() => {
    const valid = userInfo.userType && userInfo.userLevel && userInfo.preferredPosition && userInfo.activityArea && userInfo.aiPersonality;
    setIsValid(valid);
  }, [userInfo]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const openModal = (fieldName, title, options) => {
    setCurrentField(fieldName);
    setModalTitle(title);
    setModalOptions(options);
    setShowModal(true);
  };

  const handleFieldSelect = (fieldName, value) => {
    setUserInfo(prev => ({
      ...prev,
      [fieldName]: value
    }));
    // 모달창은 닫지 않고 유지
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // 옵션 데이터
  const fieldOptions = {
    userType: [
      { value: 'player', label: '선수' },
      { value: 'coach', label: '감독, 코치' },
      { value: 'parent', label: '학부모' },
      { value: 'other', label: '기타' }
    ],
    userLevel: [
      { value: 'youth', label: '유소년' },
      { value: 'adult', label: '일반 성인' },
      { value: 'pro', label: '프로 성인' }
    ],
    preferredPosition: [
      { value: 'LWF', label: 'LWF', color: '#FF6B6B' },
      { value: 'ST', label: 'ST', color: '#FF6B6B' },
      { value: 'RWF', label: 'RWF', color: '#FF6B6B' },
      { value: 'LWM', label: 'LWM', color: '#079669' },
      { value: 'CAM', label: 'CAM', color: '#079669' },
      { value: 'RWM', label: 'RWF', color: '#079669' },
      { value: 'LM', label: 'LM', color: '#079669' },
      { value: 'CM', label: 'CM', color: '#079669' },
      { value: 'RM', label: 'RM', color: '#079669' },
      { value: 'CDM', label: 'CDM', color: '#079669' },
      { value: 'LWB', label: 'LWB', color: '#3B82F6' },
      { value: 'RWB', label: 'RWB', color: '#3B82F6' },
      { value: 'LB', label: 'LB', color: '#3B82F6' },
      { value: 'CB', label: 'CB', color: '#3B82F6' },
      { value: 'RB', label: 'RB', color: '#3B82F6' },
      { value: 'GK', label: 'GK', color: '#F59E0B' }
    ],
    aiPersonality: [
      { value: 'professional', label: '전문적으로' },
      { value: 'friendly', label: '친근하게' },
      { value: 'strict', label: '엄격하게' }
    ]
  };

  const handleContinue = async () => {
    if (!isValid) return;
    // 1) 로컬 저장: 이후 화면에서도 사용할 수 있도록 유지
    Object.entries(userInfo).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    try {
      // 2) 서버 저장 호출 (배포 서버 사용)
      const encryptedEmail = localStorage.getItem('social_email') || '';
      // 소셜 이메일이 없으면 정상적인 회원가입 흐름(로그인 후 유입)이 아닙니다.
      if (!encryptedEmail) {
        alert('로그인 정보가 없습니다. 카카오 로그인을 다시 진행해주세요.');
        navigate('/app/login');
        return;
      }
      const payload = {
        user_id: encodeURIComponent(encryptedEmail),
        password: '0',
        user_birth: localStorage.getItem('userBirthDate') || '',
        user_name: localStorage.getItem('userNickname') || '',
        user_gender: localStorage.getItem('userGender') || '',
        user_nickname: localStorage.getItem('userNickname') || '',
        marketing_agree: localStorage.getItem('marketing_agree') || JSON.stringify({
          terms_agree: 'no',
          privacy_agree: 'no',
          marketing_use_agree: 'no',
          marketing_receive_agree: 'no'
        }),
        user_height: localStorage.getItem('userHeight') || '',
        user_weight: localStorage.getItem('userWeight') || '',
        user_position: userInfo.preferredPosition || '',
        user_type: userInfo.userType || '',
        level: userInfo.userLevel || '',
        activity_area: userInfo.activityArea || '',
        ai_type: userInfo.aiPersonality || ''
      };

      const serverBase = window.location.hostname === 'localhost' ? 'https://agrounds.com' : 'https://agrounds.com';
      const socialType = localStorage.getItem('login_type') || 'kakao';
      const endpointType = socialType === 'naver' ? 'naver' : (socialType === 'apple' ? 'apple' : 'kakao');
      const resp = await fetch(`${serverBase}/api/login/${endpointType}/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 409) {
          throw new Error('이미 가입된 이메일입니다. 로그인 화면으로 이동해 주세요.');
        }
        if (resp.status === 400 && err && err.error) {
          throw new Error(err.error);
        }
        throw new Error(err.error || '회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }

      const data = await resp.json();
      // 백엔드가 토큰을 발급하지 않고 v3_user 저장만 할 수 있으므로 저장 성공만 확인

      // 3) 완료 페이지 이동 (로컬/운영 공통)
      navigate('/app/sign-in-end');
    } catch (e) {
      const message = (e && e.message) ? e.message : '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      alert(message);
      // 이미 가입된 경우 안내에 따라 로그인으로 유도
      if (message.includes('이미 가입된 이메일')) {
        navigate('/app/login');
      }
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
          추가정보
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6F6F6F',
          margin: '8px 0 20px 0',
          lineHeight: '1.4',
          paddingLeft: '40px',
          paddingRight: '40px'
        }}>
          추가 정보를 입력해주세요
        </p>

        {/* 정보 입력 필드들 */}
        <div style={{
          width: '86%',
          margin: '0 auto'
        }}>
          {/* 사용자 유형 */}
          <div 
            onClick={() => openModal('userType', '사용자 유형', fieldOptions.userType)}
            style={{
              backgroundColor: '#E9EEF1',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '12px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: userInfo.userType ? '2px solid #079669' : '2px solid transparent'
            }}
          >
            <span style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: '500'
            }}>
              {userInfo.userType ? fieldOptions.userType.find(opt => opt.value === userInfo.userType)?.label : '사용자 유형'}
            </span>
            <img 
              src={rightArrow} 
              alt="선택" 
              style={{
                width: '16px',
                height: '16px',
                opacity: '0.6'
              }}
            />
          </div>

          {/* 사용자 수준 */}
          <div 
            onClick={() => openModal('userLevel', '사용자 수준', fieldOptions.userLevel)}
            style={{
              backgroundColor: '#E9EEF1',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '12px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: userInfo.userLevel ? '2px solid #079669' : '2px solid transparent'
            }}
          >
            <span style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: '500'
            }}>
              {userInfo.userLevel ? fieldOptions.userLevel.find(opt => opt.value === userInfo.userLevel)?.label : '사용자 수준'}
            </span>
            <img 
              src={rightArrow} 
              alt="선택" 
              style={{
                width: '16px',
                height: '16px',
                opacity: '0.6'
              }}
            />
          </div>

          {/* 선호 포지션 */}
          <div 
            onClick={() => openModal('preferredPosition', '선호 포지션', fieldOptions.preferredPosition)}
            style={{
              backgroundColor: '#E9EEF1',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '12px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: userInfo.preferredPosition ? '2px solid #079669' : '2px solid transparent'
            }}
          >
            <span style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: '500'
            }}>
              {userInfo.preferredPosition ? fieldOptions.preferredPosition.find(opt => opt.value === userInfo.preferredPosition)?.label : '선호 포지션'}
            </span>
            <img 
              src={rightArrow} 
              alt="선택" 
              style={{
                width: '16px',
                height: '16px',
                opacity: '0.6'
              }}
            />
          </div>

          {/* 활동지역 - 모달 트리거 */}
          <div 
            onClick={() => setShowRegionModal(true)}
            style={{
              backgroundColor: '#E9EEF1',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '12px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: userInfo.activityArea ? '2px solid #079669' : '2px solid transparent'
            }}
          >
            <span style={{ fontSize:'16px', color:'#000000', fontWeight: '500' }}>
              {userInfo.activityArea ? userInfo.activityArea : '활동지역'}
            </span>
            <img 
              src={rightArrow} 
              alt="선택" 
              style={{ width: '16px', height: '16px', opacity: '0.6' }}
            />
          </div>

          {/* AI 성격 */}
          <div 
            onClick={() => openModal('aiPersonality', 'AI 성격', fieldOptions.aiPersonality)}
            style={{
              backgroundColor: '#E9EEF1',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '12px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: userInfo.aiPersonality ? '2px solid #079669' : '2px solid transparent'
            }}
          >
            <span style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: '500'
            }}>
              {userInfo.aiPersonality ? fieldOptions.aiPersonality.find(opt => opt.value === userInfo.aiPersonality)?.label : 'AI 성격'}
            </span>
            <img 
              src={rightArrow} 
              alt="선택" 
              style={{
                width: '16px',
                height: '16px',
                opacity: '0.6'
              }}
            />
          </div>
        </div>
      </div>

      {/* 모달창 */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#000000',
                margin: 0
              }}>
                {modalTitle}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#9E9E9E'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {modalOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleFieldSelect(currentField, option.value)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: '#F8F9FA',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#E9EEF1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#F8F9FA';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    {option.color && (
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: option.color
                      }} />
                    )}
                    <span style={{
                      fontSize: '16px',
                      color: '#000000',
                      fontWeight: '500'
                    }}>
                      {option.label}
                    </span>
                  </div>
                  
                  {userInfo[currentField] === option.value && (
                    <img 
                      src={checkGreenIcon} 
                      alt="선택됨" 
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 지역 선택 모달 */}
      {showRegionModal && (
        <div style={{
          position:'fixed', top:0, left:0, right:0, bottom:0,
          background:'rgba(0,0,0,0.5)', zIndex:1000,
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <div style={{
            background:'#FFFFFF', borderRadius:'20px', width:'90%', maxWidth:'420px',
            maxHeight:'80vh', overflow:'hidden', boxShadow:'0 10px 24px rgba(0,0,0,0.2)'
          }}>
            {/* 헤더 */}
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px', borderBottom:'1px solid #EFEFEF'}}>
              <strong style={{fontSize:'18px'}}>활동지역 선택</strong>
              <button onClick={()=>setShowRegionModal(false)} style={{background:'none',border:'none',fontSize:'22px',cursor:'pointer',color:'#9E9E9E'}}>×</button>
            </div>

            {/* 바디: 시도 / 시군구 2열 */}
            <div style={{display:'flex', gap:'0', height:'360px'}}>
              {/* 시도 컬럼 */}
              <div style={{flex:'1 1 50%', borderRight:'1px solid #F0F0F0', overflowY:'auto'}}>
                {sidoList.map(s => (
                  <div
                    key={s}
                    onClick={() => { 
                      setSelectedSido(s); 
                      setSelectedSigungu(''); 
                      // 전국, 세종특별자치시는 시군구가 없으므로 바로 선택 완료
                      if(s === '전국' || s === '세종특별자치시') {
                        setUserInfo(prev=>({...prev, activityArea: s}));
                        setShowRegionModal(false);
                      }
                    }}
                    style={{
                      padding:'14px 16px', cursor:'pointer',
                      background: selectedSido===s ? '#F2FBF7' : '#FFFFFF',
                      color:'#111', borderLeft: selectedSido===s ? '3px solid #079669' : '3px solid transparent'
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>

              {/* 시군구 컬럼 */}
              <div style={{flex:'1 1 50%', overflowY:'auto'}}>
                {(sigunguMap[selectedSido] || []).map(g => (
                  <div
                    key={g}
                    onClick={() => {
                      setSelectedSigungu(g);
                      // "전체" 선택 시 바로 선택 완료
                      if(g === '전체') {
                        const areaText = selectedSido === '전국' ? '전국' : selectedSido;
                        setUserInfo(prev=>({...prev, activityArea: areaText}));
                        setShowRegionModal(false);
                      }
                    }}
                    style={{
                      padding:'14px 16px', cursor:'pointer',
                      background: selectedSigungu===g ? '#F2FBF7' : '#FFFFFF',
                      color:'#111', borderLeft: selectedSigungu===g ? '3px solid #079669' : '3px solid transparent'
                    }}
                  >
                    {g}
                  </div>
                ))}
              </div>
            </div>

            {/* 푸터 */}
            <div style={{padding:'12px 16px', borderTop:'1px solid #EFEFEF', display:'flex', gap:'10px'}}>
              <button
                onClick={()=>{ setSelectedSido(''); setSelectedSigungu(''); }}
                style={{flex:1, height:'44px', border:'1px solid #E5E5E5', borderRadius:'12px', background:'#FFFFFF', color:'#6F6F6F', fontWeight:600, cursor:'pointer'}}
              >초기화</button>
              <button
                onClick={()=>{
                  // 전국, 세종특별자치시는 시군구가 없으므로 시도만 선택해도 완료
                  if(selectedSido && (selectedSigungu || selectedSido === '전국' || selectedSido === '세종특별자치시')){
                    let areaText;
                    if(selectedSido === '전국' || selectedSido === '세종특별자치시') {
                      areaText = selectedSido;
                    } else if(selectedSigungu === '전체') {
                      areaText = selectedSido;
                    } else {
                      areaText = `${selectedSido} ${selectedSigungu}`;
                    }
                    setUserInfo(prev=>({...prev, activityArea: areaText}));
                    setShowRegionModal(false);
                  }
                }}
                disabled={!(selectedSido && (selectedSigungu || selectedSido === '전국' || selectedSido === '세종특별자치시'))}
                style={{flex:2, height:'44px', border:'none', borderRadius:'12px', background: (selectedSido && (selectedSigungu || selectedSido === '전국' || selectedSido === '세종특별자치시')) ? '#079669' : '#E5E5E5', color:(selectedSido && (selectedSigungu || selectedSido === '전국' || selectedSido === '세종특별자치시'))?'#FFFFFF':'#9E9E9E', fontWeight:700, cursor:(selectedSido && (selectedSigungu || selectedSido === '전국' || selectedSido === '세종특별자치시'))?'pointer':'not-allowed'}}
              >선택 완료</button>
            </div>
          </div>
        </div>
      )}

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

export default Sign_in_4;
