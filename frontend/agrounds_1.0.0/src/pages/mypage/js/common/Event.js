import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/common/Event.scss';
import LogoBellNav from '../../../../components/Logo_bell_Nav';
import { getEventList, getContentDetail } from '../../../../function/api/user/announcementApi';
import { EventDetailModal } from '../../../../components/Modal/variants';

// 아이콘 import (디자인 시스템 승인 아이콘)
import rightArrowIcon from '../../../../assets/main_icons/front_gray.png';
import bellIcon from '../../../../assets/main_icons/bell_gray.png';
import paperIcon from '../../../../assets/common/ico_paper.png';
import backIcon from '../../../../assets/main_icons/back_black.png';

const Event = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (status = 'all') => {
    setLoading(true);
    try {
      const response = await getEventList(1, 20, status);
      if (response.data && response.data.results) {
        setEvents(response.data.results);
      }
    } catch (error) {
      console.error('이벤트 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    fetchEvents(status);
  };

  const handleEventClick = async (event) => {
    try {
      const response = await getContentDetail(event.content_code);
      if (response.data) {
        setSelectedEvent(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('이벤트 상세 조회 실패:', error);
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedEvent(null);
  };

  const getEventStatus = (event) => {
    if (!event.event_start_date || !event.event_end_date) return 'unknown';
    
    const now = new Date();
    const startDate = new Date(event.event_start_date);
    const endDate = new Date(event.event_end_date);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'ended';
    return 'active';
  };

  const getStatusText = (event) => {
    const status = getEventStatus(event);
    switch (status) {
      case 'active':
        return '진행중';
      case 'ended':
        return '종료';
      case 'upcoming':
        return '예정';
      default:
        return '알 수 없음';
    }
  };

  const getStatusColor = (event) => {
    const status = getEventStatus(event);
    switch (status) {
      case 'active':
        return '#079669';
      case 'ended':
        return '#8A8F98';
      case 'upcoming':
        return '#3b82f6';
      default:
        return '#6B7078';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className='event'>
        <LogoBellNav logo={true} />
        
        <div className="event-header-container">
          <div className="header">
            <div className="header-actions">
              <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
                <img src={backIcon} alt="뒤로가기" />
              </button>
              <div className="empty-space"></div>
            </div>
            <div className="header-content">
              <h1 className="text-h2">이벤트</h1>
              <p className="subtitle text-body">다양한 이벤트에 참여하고 혜택을 받아보세요</p>
            </div>
          </div>
        </div>
        
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>이벤트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='event'>
      <LogoBellNav logo={true} />
      
      <div className="event-header-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <div className="empty-space"></div>
          </div>
          <div className="header-content">
            <h1 className="text-h2">이벤트</h1>
            <p className="subtitle text-body">다양한 이벤트에 참여하고 혜택을 받아보세요</p>
          </div>
        </div>
      </div>
      
      <div className='content-container'>
        {/* 필터 탭 */}
        <div className='filter-tabs'>
          <button 
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            전체
          </button>
          <button 
            className={`tab-btn ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => handleFilterChange('active')}
          >
            진행중
          </button>
          <button 
            className={`tab-btn ${statusFilter === 'ended' ? 'active' : ''}`}
            onClick={() => handleFilterChange('ended')}
          >
            종료
          </button>
        </div>

        {events.length === 0 ? (
          <div className='empty-state'>
            <img src={paperIcon} alt='이벤트 없음' className='empty-icon' />
            <h3>진행중인 이벤트가 없습니다</h3>
            <p>새로운 이벤트를 기다려주세요</p>
          </div>
        ) : (
          <div className='event-list'>
            {events.map((event) => (
              <div 
                key={event.content_code} 
                className={`event-item ${getEventStatus(event)}`}
                onClick={() => handleEventClick(event)}
              >
                <div className='event-header'>
                  <div className='event-meta'>
                    <span 
                      className='status-badge'
                      style={{ color: getStatusColor(event) }}
                    >
                      {getStatusText(event)}
                    </span>
                  </div>
                  <div className='event-period'>
                    <span>{formatDate(event.event_start_date)} ~ {formatDate(event.event_end_date)}</span>
                  </div>
                </div>
                
                <h3 className='event-title'>{event.title}</h3>
                
                <div className='event-description'>
                  <p>{event.content?.substring(0, 100) || '내용을 확인하려면 클릭해주세요.'}...</p>
                </div>

                {event.event_reward && (
                  <div className='event-reward'>
                    <img src={bellIcon} alt='보상' className='reward-icon' />
                    {event.event_reward}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <EventDetailModal
        isOpen={showDetailModal && !!selectedEvent}
        event={selectedEvent}
        onClose={handleCloseModal}
        rewardIconSrc={bellIcon}
        linkIconSrc={rightArrowIcon}
      />
    </div>
  );
};

export default Event;
