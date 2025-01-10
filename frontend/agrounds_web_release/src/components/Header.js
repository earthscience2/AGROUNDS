import React from 'react';
import AgroundsLogo from '../assets/AgroundsLogo.png';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Header = ({tab, setTab}) => {
  return (
    <HeaderStyle>
      <div className='header-width'>
        <img src={AgroundsLogo} onClick={() => setTab(null)}/>
        <div className='tab-box'>
          <Tab
              isActive={tab === 'companyI'}
              onClick={() => setTab('companyI')}
            >
            회사 소개
          </Tab>
          <Tab
            isActive={tab === 'service'}
            onClick={() => setTab('service')}
          >
            서비스
          </Tab>
        </div>
      </div>
      
    </HeaderStyle>
  );
};

export default Header;

const HeaderStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8vh;
  border-bottom: 1px solid #F2F4F8;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 1999;

  .header-width {
    width: 60%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    img {
      height: 3vh;
      cursor: pointer;
    }

    .tab-box {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: 20px;
      font-size: 1.7vh;
      color: #525252;
      white-space: nowrap; 
    }
  }

  @media (max-width: 768px) {
    .header-width {
      width: 90%; 
    }

    .tab-box {
      gap: 10px; 
      font-size: 1.5vh; 
    }
  }
`;

const Tab = styled.div`
  color: ${(props) => (props.isActive ? '#055540' : '#525252')};
  font-weight: 600;
  cursor: pointer;
`