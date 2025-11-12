import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/text_icon/logo_text_black.png';
import bell from '../assets/main_icons/bell_black.png';
import bellActivate from '../assets/main_icons/bell_activate_black.png';
import leftArrow from '../assets/main_icons/back_black.png';
import styled from 'styled-components';
import { GetNotificationListApi } from '../function/api/user/userApi';

const LogoBellNav = ({logo, showBack, onBack}) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const userCode = sessionStorage.getItem('userCode');

  useEffect(() => {
    // 읽지 않은 알림 개수 확인
    const fetchUnreadCount = async () => {
      if (!userCode) return;
      
      try {
        const response = await GetNotificationListApi(userCode, 1, 1);
        if (response.data) {
          setUnreadCount(response.data.unread_count || 0);
        }
      } catch (error) {
        console.error('알림 개수 조회 실패:', error);
      }
    };

    fetchUnreadCount();
    
    // 30초마다 알림 개수 갱신
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [userCode]);

  const handleBellClick = () => {
    navigate('/app/notifications');
  };

  const bellIcon = unreadCount > 0 ? bellActivate : bell;

  return (
    <LogoBellNavStyle >
      {showBack ? (
        <>
          <img src={leftArrow} className='back-arrow' onClick={onBack} alt="뒤로가기"/>
          <div className='bell-container' onClick={handleBellClick}>
            <img src={bellIcon} className='bell' alt="알림"/>
            {unreadCount > 0 && <span className='bell-badge'>{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </div>
        </>
      ) : logo ? (
        <>
          <img src={Logo} className='logo'/>
          <div className='bell-container' onClick={handleBellClick}>
            <img src={bellIcon} className='bell' alt="알림"/>
            {unreadCount > 0 && <span className='bell-badge'>{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </div>
        </>
      ) : (
        <>
          <div></div>
          <div className='bell-container' onClick={handleBellClick}>
            <img src={bellIcon} className='bell' alt="알림"/>
            {unreadCount > 0 && <span className='bell-badge'>{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </div>
        </>
      )}
    </LogoBellNavStyle>
  );
};

export default LogoBellNav;

const LogoBellNavStyle = styled.div`
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F2F4F6;
  position: relative;
  z-index: 20;

  .logo{
    padding: 0 2vh 0 1vh;
    height: 4vh;
  }
  
  .bell-container {
    position: relative;
    padding: 0 3.5vh 0 1vh;
    cursor: pointer;
    display: flex;
    align-items: center;
    
    .bell {
      height: 4vh;
      transition: opacity 0.2s;
      
      &:hover {
        opacity: 0.8;
      }
    }
    
    .bell-badge {
      position: absolute;
      top: -4px;
      right: 2.5vh;
      background-color: #ef4444;
      color: white;
      font-size: 10px;
      font-weight: 600;
      font-family: var(--font-text);
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      animation: pulse-badge 2s ease-in-out infinite;
    }
  }
  
  .back-arrow{
    padding: 0 2vh;
    height: 2.5vh;
    cursor: pointer;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.7;
    }
  }
  
  @keyframes pulse-badge {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

`