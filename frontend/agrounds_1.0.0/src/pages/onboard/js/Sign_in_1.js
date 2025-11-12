import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginModal.scss';
import leftArrow from '../../../assets/main_icons/back_black.png';

const Sign_in_1 = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeRequired, setAgreeRequired] = useState(false);
  const [agreePrivacyUse, setAgreePrivacyUse] = useState(false);
  const [agreeMarketingUse, setAgreeMarketingUse] = useState(false);
  const [agreeMarketingReceive, setAgreeMarketingReceive] = useState(false);

  const isContinueEnabled = agreeRequired && agreePrivacyUse; // 필수 동의(이용약관, 개인정보 수집 이용)만 충족하면 계속 가능

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
        background: 'var(--bg-surface)',
        borderRadius: '20px',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid var(--border)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggle}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '2px solid var(--border)',
            background: checked ? 'var(--primary)' : 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bg-surface)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {checked ? '✓' : ''}
        </button>
        <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-text)' }}>
          {required ? '(필수) ' : '(선택) '} {title}
        </span>
      </div>
      <button
        onClick={onOpen}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)', fontSize: '18px', padding: '8px' }}
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
    <div className={`login-page ${isVisible ? 'visible' : ''}`}>
      <div className='login-content'>
        <button
          className='back-button'
          onClick={() => navigate('/app/sign-in-type')}
          aria-label='뒤로가기'
        >
          <img src={leftArrow} alt='뒤로가기' className='back-icon' />
        </button>

        <div className='login-header' style={{ alignItems: 'flex-start', paddingTop: '96px', gap: '8px' }}>
          <h1 className='text-h1' style={{ margin: 0, color: 'var(--text-primary)' }}>약관동의</h1>
          <p className='text-body' style={{ color: 'var(--text-secondary)', margin: '8px 0 24px 0' }}>약관에 동의해주세요</p>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                background: 'var(--bg-primary)',
                borderRadius: '20px',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={toggleAll}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '2px solid var(--border)',
                    background: agreeAll ? 'var(--primary)' : 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {agreeAll ? '✓' : ''}
                </button>
                <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-text)' }}>모두 동의 (선택항목 포함)</span>
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

        <div className='login-footer'>
          <div className='login-buttons' style={{ maxWidth: '100%' }}>
            <button
              onClick={handleContinue}
              disabled={!isContinueEnabled}
              className='social-login-btn'
              style={{
                backgroundColor: isContinueEnabled ? 'var(--primary)' : 'var(--border)',
                color: isContinueEnabled ? 'var(--bg-surface)' : 'var(--text-disabled)',
                cursor: isContinueEnabled ? 'pointer' : 'not-allowed',
                height: '54px',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              계속
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign_in_1;
