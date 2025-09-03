import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../onboard/css/GetStarted.scss';
import leftArrow from '../../../assets/common/left.png';

const Sign_in_4 = () => {
  const navigate = useNavigate();

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeRequired, setAgreeRequired] = useState(false);
  const [agreePrivacyUse, setAgreePrivacyUse] = useState(false);
  const [agreeMarketingUse, setAgreeMarketingUse] = useState(false);
  const [agreeMarketingReceive, setAgreeMarketingReceive] = useState(false);

  const isContinueEnabled = agreeRequired && agreePrivacyUse; // 필수 동의(이용약관, 개인정보 수집 이용)만 충족하면 계속 가능

  useEffect(() => {
    const savedRequired = localStorage.getItem('agree_required') === 'true';
    const savedPrivacyUse = localStorage.getItem('agree_privacy_use') === 'true';
    const savedMarketingUse = localStorage.getItem('agree_marketing_use') === 'true';
    const savedMarketingReceive = localStorage.getItem('agree_marketing_receive') === 'true';
    const savedAll = savedRequired && savedPrivacyUse && savedMarketingUse && savedMarketingReceive;

    setAgreeRequired(savedRequired);
    setAgreePrivacyUse(savedPrivacyUse);
    setAgreeMarketingUse(savedMarketingUse);
    setAgreeMarketingReceive(savedMarketingReceive);
    setAgreeAll(savedAll);
  }, []);

  useEffect(() => {
    const all = agreeRequired && agreePrivacyUse && agreeMarketingUse && agreeMarketingReceive;
    setAgreeAll(all);
    
    // 모든 동의 정보를 marketing_agree에 통합해서 저장
    const marketingAgreeData = {
      terms_agree: agreeRequired ? 'yes' : 'no',
      privacy_agree: agreePrivacyUse ? 'yes' : 'no',
      marketing_use_agree: agreeMarketingUse ? 'yes' : 'no',
      marketing_receive_agree: agreeMarketingReceive ? 'yes' : 'no'
    };
    
    localStorage.setItem('marketing_agree', JSON.stringify(marketingAgreeData));
  }, [agreeRequired, agreePrivacyUse, agreeMarketingUse, agreeMarketingReceive]);

  const toggleAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgreeRequired(next);
    setAgreePrivacyUse(next);
    setAgreeMarketingUse(next);
    setAgreeMarketingReceive(next);
  };

  const Row = ({ title, required = false, checked, onToggle, onOpen }) => (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #EFEFEF',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggle}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '2px solid #D9D9D9',
            background: checked ? '#079669' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          {checked ? '✓' : ''}
        </button>
        <span style={{ fontSize: '16px', color: '#111', fontWeight: 600 }}>
          {required ? '(필수) ' : '(선택) '} {title}
        </span>
      </div>
      <button
        onClick={onOpen}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E9E9E', fontSize: '18px' }}
      >
        ＞
      </button>
    </div>
  );

  const handleContinue = () => {
    if (!isContinueEnabled) return;
    navigate('/app/sign-in-2');
  };

  return (
    <div className='background'>
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '40px',
          left: '20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: 10,
          padding: '8px',
        }}
      >
        <img src={leftArrow} alt='뒤로가기' style={{ width: '24px', height: '24px' }} />
      </button>

      <div className='content' style={{ alignItems: 'flex-start', width: '100%', paddingTop: '96px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#111', padding: '0 40px' }}>약관동의</h1>
        <p style={{ fontSize: '16px', color: '#6F6F6F', margin: '8px 0 20px 0', padding: '0 40px' }}>약관에 동의해주세요</p>

        <div style={{ width: '86%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: '#F7F9FA',
              borderRadius: '20px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #E5E5E5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={toggleAll}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '2px solid #D9D9D9',
                  background: agreeAll ? '#079669' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                {agreeAll ? '✓' : ''}
              </button>
              <span style={{ fontSize: '16px', color: '#111', fontWeight: 700 }}>모두 동의 (선택항목 포함)</span>
            </div>
          </div>

          <Row
            title='이용약관'
            required
            checked={agreeRequired}
            onToggle={() => setAgreeRequired(v => !v)}
            onOpen={() => navigate('/app/serviceterm')}
          />
          <Row
            title='개인정보 수집 이용 동의'
            required
            checked={agreePrivacyUse}
            onToggle={() => setAgreePrivacyUse(v => !v)}
            onOpen={() => navigate('/app/privacyterm')}
          />
          <Row
            title='개인정보 마케팅 활용 동의'
            checked={agreeMarketingUse}
            onToggle={() => setAgreeMarketingUse(v => !v)}
            onOpen={() => navigate('/app/privacyterm')}
          />
          <Row
            title='마케팅 정보수신 동의'
            checked={agreeMarketingReceive}
            onToggle={() => setAgreeMarketingReceive(v => !v)}
            onOpen={() => navigate('/app/privacyterm')}
          />
        </div>
      </div>

      <div className='footer'>
        <div className='cta-area'>
          <button
            onClick={handleContinue}
            disabled={!isContinueEnabled}
            style={{
              width: '100%',
              height: '60px',
              border: 'none',
              borderRadius: '20px',
              backgroundColor: isContinueEnabled ? '#079669' : '#E5E5E5',
              color: isContinueEnabled ? '#FFFFFF' : '#9E9E9E',
              fontSize: '18px',
              fontWeight: 600,
              cursor: isContinueEnabled ? 'pointer' : 'not-allowed',
            }}
          >
            계속
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sign_in_4;


