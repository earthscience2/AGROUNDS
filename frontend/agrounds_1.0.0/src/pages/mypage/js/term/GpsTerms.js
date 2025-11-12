import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LogoBellNav from '../../../../components/Logo_bell_Nav';
import backIcon from '../../../../assets/main_icons/back_black.png';
import service1 from '../../../../assets/term/marketing-term.png';

const GpsTerms = () => {
  const navigate = useNavigate();

  return (
    <GpsTermsStyle>
      <LogoBellNav logo={true} />
      
      <div className="header-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <div className="empty-space"></div>
          </div>
          <div className="header-content">
            <h1 className="text-h2">위치정보 이용 약관</h1>
            <p className="subtitle text-body">AGROUNDS GPS 위치 서비스 이용 약관</p>
          </div>
        </div>
      </div>
      
      <div className='content'>
        <img src={service1} className='img' alt='GPS 약관' />
      </div>
    </GpsTermsStyle>
  );
};

export default GpsTerms;

const GpsTermsStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 499px;
  margin: 0 auto;
  background: var(--bg-primary);
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
  font-family: var(--font-text);
  padding-bottom: 100px;
  
  .header-container {
    width: 100%;
    max-width: 499px;
    margin: 0 auto;
    padding: 0 var(--spacing-xl);
    box-sizing: border-box;
    
    @media (max-width: 768px) {
      padding: 0 var(--spacing-lg);
    }
    
    .header {
      padding: 6px 0 var(--spacing-xl) 0;
      
      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-2xl);
        
        .back-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: none;
          min-height: 44px;
          min-width: 44px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          
          img {
            width: 20px;
            height: 20px;
          }
          
          &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-1px);
          }
          
          &:focus {
            outline: 2px solid var(--primary);
            outline-offset: 2px;
          }
        }
        
        .empty-space {
          width: 44px;
          height: 44px;
        }
      }
      
      .header-content {
        text-align: center;
        margin-bottom: var(--spacing-lg);
        
        h1 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--text-primary);
          font-family: var(--font-brand);
        }
        
        .subtitle {
          margin: 0;
          color: var(--text-secondary);
        }
      }
    }
  }
  
  .content {
    width: 100%;
    max-width: 460px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 var(--spacing-xl);
    box-sizing: border-box;
    
    @media (max-width: 768px) {
      padding: 0 var(--spacing-lg);
    }
    
    .img {
      width: 100%;
      margin-bottom: var(--spacing-md);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }
`;