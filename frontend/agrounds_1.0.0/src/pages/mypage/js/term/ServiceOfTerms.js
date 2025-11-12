import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LogoBellNav from '../../../../components/Logo_bell_Nav';
import backIcon from '../../../../assets/main_icons/back_black.png';
import privacy1 from '../../../../assets/term/service-term1.png';
import privacy2 from '../../../../assets/term/service-term2.png';
import privacy3 from '../../../../assets/term/service-term3.png';
import privacy4 from '../../../../assets/term/service-term4.png';
import privacy5 from '../../../../assets/term/service-term5.png';
import privacy6 from '../../../../assets/term/service-term4.png';
import privacy7 from '../../../../assets/term/service-term5.png';

const ServiceOfTerms = () => {
  const navigate = useNavigate();

  return (
    <ServiceOfTermsStyle>
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
            <h1 className="text-h2">서비스 이용 약관</h1>
            <p className="subtitle text-body">AGROUNDS 서비스 이용에 관한 기본 약관</p>
          </div>
        </div>
      </div>
      
      <div className='content'>
        <img src={privacy1} className='img' alt='서비스 약관 1' />
        <img src={privacy2} className='img' alt='서비스 약관 2' />
        <img src={privacy3} className='img' alt='서비스 약관 3' />
        <img src={privacy4} className='img' alt='서비스 약관 4' />
        <img src={privacy5} className='img' alt='서비스 약관 5' />
        <img src={privacy6} className='img' alt='서비스 약관 6' />
        <img src={privacy7} className='img' alt='서비스 약관 7' />
      </div>
    </ServiceOfTermsStyle>
  );
};

export default ServiceOfTerms;

const ServiceOfTermsStyle = styled.div`
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