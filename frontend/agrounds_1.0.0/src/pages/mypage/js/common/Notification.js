import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/common/Notification.scss';
import LogoBellNav from '../../../../components/Logo_bell_Nav';
import { GetNotificationListApi, MarkNotificationAsReadApi, MarkAllNotificationsAsReadApi } from '../../../../function/api/user/userApi';
import DSModal from '../../../../components/Modal/DSModal';

// 아이콘 import
import bellIcon from '../../../../assets/common/bell.png';
import backIcon from '../../../../assets/main_icons/back_black.png';
import leftArrowIcon from '../../../../assets/common/left.png';
import rightArrowIcon from '../../../../assets/common/right.png';

const Notification = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, unread
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const userCode = sessionStorage.getItem('userCode');
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    getData();
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 리셋
    setExpandedItems(new Set()); // 필터 변경 시 확장 상태 리셋
  }, [selectedFilter]);

  // DSModal이 스크롤락/포커스/ESC 처리

  const getData = async () => {
    setLoading(true);
    try {
      const isRead = selectedFilter === 'unread' ? false : null;
      const response = await GetNotificationListApi(userCode, 1, 50, isRead, null);
      if (response.data) {
        setList(response.data.notifications || []);
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = (e, notification) => {
    e.stopPropagation();
    const notificationId = notification.notification_id;
    const newExpanded = new Set(expandedItems);
    
    if (newExpanded.has(notificationId)) {
      newExpanded.delete(notificationId);
    } else {
      newExpanded.add(notificationId);
    }
    
    setExpandedItems(newExpanded);
    
    // 읽지 않은 알림이면 읽음 처리
    if (!notification.is_read) {
      MarkNotificationAsReadApi(userCode, notification.notification_id)
        .then(() => {
          getData();
        })
        .catch((error) => {
          console.error('알림 읽음 처리 실패:', error);
        });
    }
  };

  const handleNotificationClick = async (notification) => {
    // 모달 열기
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

  const handleModalAction = () => {
    if (selectedNotification && selectedNotification.related_data) {
      const { team_code, match_code, content_code } = selectedNotification.related_data;
      
      if (team_code) {
        navigate('/app/team/info', { state: { teamCode: team_code } });
      } else if (match_code) {
        navigate('/app/player/analysis', { state: { matchCode: match_code } });
      } else if (content_code) {
        navigate('/app/announcement-list');
      }
    }
    handleCloseModal();
  };

  const handleMarkAllAsRead = async () => {
    try {
      await MarkAllNotificationsAsReadApi(userCode);
      getData();
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotifications = list.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className='notification'>
        <LogoBellNav logo={true} />
        
        <div className="notification-container">
          <div className="header">
            <div className="header-actions">
              <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
                <img src={backIcon} alt="뒤로가기" />
              </button>
              <div className="empty-space"></div>
            </div>
          <div className="header-content">
            <h1 className="text-h2">알림</h1>
          </div>
          </div>
        </div>
        
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>알림을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='notification'>
      <LogoBellNav logo={true} />
      
      <div className="notification-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <img src={backIcon} alt="뒤로가기" />
            </button>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-btn" 
                onClick={handleMarkAllAsRead}
                aria-label="모두 읽음 처리"
              >
                모두 읽음
              </button>
            )}
          </div>
          <div className="header-content">
            <h1 className="text-h2">알림</h1>
            {unreadCount > 0 && (
              <span className="unread-count-badge">{unreadCount}</span>
            )}
          </div>
        </div>

        {/* 필터 탭 */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            전체
          </button>
          <button 
            className={`filter-tab ${selectedFilter === 'unread' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('unread')}
          >
            읽지 않음
          </button>
        </div>
      </div>
      
      <div className='content-container'>
        {list.length ? (
          <>
            <div className='notification-list'>
              {currentNotifications.map((notification) => {
                const isExpanded = expandedItems.has(notification.notification_id);
                return (
                  <div 
                    key={notification.notification_id} 
                    className={`notification-item ${!notification.is_read ? 'unread' : ''} ${isExpanded ? 'expanded' : ''}`}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNotificationToggle(e, notification);
                      }
                    }}
                    aria-label={`${notification.title} 알림`}
                    aria-expanded={isExpanded}
                  >
                    <div 
                      className='notification-header'
                      onClick={(e) => handleNotificationToggle(e, notification)}
                    >
                      <div className='notification-title-row'>
                        {!notification.is_read && (
                          <span className='unread-dot'></span>
                        )}
                        <h3 className='notification-title'>{notification.title}</h3>
                        <span className='notification-date'>{formatDate(notification.created_at)}</span>
                        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
                      </div>
                      
                      {isExpanded && (
                        <div className='notification-content'>
                          <p className='notification-message'>{notification.message}</p>
                        </div>
                      )}
                    </div>
                    
                    {isExpanded && (
                      <div className='notification-actions'>
                        <button 
                          className='view-detail-btn'
                          onClick={() => handleNotificationClick(notification)}
                          aria-label="자세히 보기"
                        >
                          자세히 보기
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* 페이지네이션 컨트롤 */}
            {totalPages > 1 && (
              <div className='notification-pagination'>
                <button 
                  className='pagination-btn prev-btn'
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  aria-label="이전 페이지"
                >
                  <img src={leftArrowIcon} alt="이전" />
                </button>
                
                <div className='pagination-indicator'>
                  <span className='current-page'>{currentPage + 1}</span>
                  <span className='separator'>/</span>
                  <span className='total-pages'>{totalPages}</span>
                </div>
                
                <button 
                  className='pagination-btn next-btn'
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  aria-label="다음 페이지"
                >
                  <img src={rightArrowIcon} alt="다음" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className='no-notification'>
            <img src={bellIcon} alt='알림 없음 아이콘' />
            <h3>알림이 없습니다</h3>
            <p>새로운 소식을 기다려주세요</p>
          </div>
        )}
      </div>

      {/* 알림 상세 모달 (DSModal) */}
      <DSModal
        isOpen={showModal && !!selectedNotification}
        onClose={handleCloseModal}
        title={selectedNotification?.title || '알림'}
        size="md"
      >
        {selectedNotification && (
          <>
            <DSModal.Body>
              <div className="modal-meta">
                <span className="modal-date">{formatDate(selectedNotification.created_at)}</span>
              </div>
              <p className="modal-message">{selectedNotification.message}</p>
            </DSModal.Body>
            <DSModal.Footer>
              <button className="confirm-btn" onClick={handleModalAction}>
                {selectedNotification.related_data ? '확인' : '닫기'}
              </button>
            </DSModal.Footer>
          </>
        )}
      </DSModal>
    </div>
  );
};

export default Notification;

