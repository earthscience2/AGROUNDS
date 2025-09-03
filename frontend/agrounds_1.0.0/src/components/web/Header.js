import React, { useState } from 'react';
import styled from 'styled-components';
import AgroundsLogo from '../../assets/web/AgroundsLogo.webp';
import menuIcon from '../../assets/web/menu.webp';

const Header = ({ tab, setTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeaderStyle>
      <div className="header-width">
        <img src={AgroundsLogo} onClick={() => setTab('home')} alt="Agrounds Logo" />
        <div className="tab-box">
          <Tab isActive={tab === 'companyI'} onClick={() => setTab('companyI')}>
            회사 소개
          </Tab>
          <Tab isActive={tab === 'service'} onClick={() => setTab('service')}>
            서비스
          </Tab>
        </div>

        <MenuIcon
          src={menuIcon}
          alt="Menu"
          onClick={() => setIsMenuOpen(true)}
        />
      </div>

      {isMenuOpen && (
        <MenuModal>
          <div className="close-btn-box">
            <div className="close-btn" onClick={() => setIsMenuOpen(false)}>
              &times;
            </div>
          </div>
          <div className="menu-box">
            <MenuItem isActive={tab === 'home'} onClick={() => { setTab('home'); setIsMenuOpen(false); }}>
              홈
            </MenuItem>
            <MenuItem isActive={tab === 'companyI'} onClick={() => { setTab('companyI'); setIsMenuOpen(false); }}>
              회사 소개
            </MenuItem>
            <MenuItem isActive={tab === 'service'} onClick={() => { setTab('service'); setIsMenuOpen(false); }}>
              서비스
            </MenuItem>
          </div>
        </MenuModal>
      )}
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
  font-family: 'Pretendard';

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

  @media (max-width: 480px) {
    .header-width {
      width: 90%;
    }

  }
`;

const Tab = styled.div`
  color: ${(props) => (props.isActive ? '#055540' : '#525252')};
  font-weight: 600;
  cursor: pointer;
  @media (max-width: 480px) {
    display: none;
  }
`;

const MenuIcon = styled.img`
  display: none;
  height: 3vh;
  cursor: pointer;

  @media (max-width: 480px) {
    display: block;
  }
`;

const MenuModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2000;

  .close-btn-box {
    width: 85%;
    display: flex;
    justify-content: end;
    margin-top: 5vh;

    .close-btn {
      font-size: 2rem;
      font-weight: 300;
      cursor: pointer;
      color: #525252;
      margin-bottom: 20px;
    }
  }

  .menu-box {
    width: 85%;
    margin-top: 2vh;
  }
`;

const MenuItem = styled.div`
  margin: 3vh 0;
  font-size: 2.8vh;
  font-weight: 700;
  cursor: pointer;
  color: ${(props) => (props.isActive ? '#055540' : '#525252')};
`;
