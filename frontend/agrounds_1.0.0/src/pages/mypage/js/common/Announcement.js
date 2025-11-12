import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/common/Announcement.scss';
import LogoBellNav from '../../../../components/Logo_bell_Nav';
import { getNoticeList, getContentDetail } from '../../../../function/api/user/announcementApi';
import { AnnouncementDetailModal } from '../../../../components/Modal/variants';

// 아이콘 import (디자인 시스템 승인 아이콘)
import paper from '../../../../assets/common/ico_paper.png';
import backIcon from '../../../../assets/main_icons/back_black.png';

const Announcement = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await getNoticeList(1, 20);
        if (response.data && response.data.results) {
          setList(response.data.results);
        }
      } catch (error) {
        console.error('공지사항 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // DSModal이 ESC/포커스/스크롤락 처리

  const handleNoticeClick = async (announce) => {
    try {
      const response = await getContentDetail(announce.content_code);
      if (response.data) {
        setSelectedNotice(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('공지사항 상세 조회 실패:', error);
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedNotice(null);
  };

  const getCategoryClass = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'category-maintenance';
      case 'high':
        return 'category-notice';
      case 'normal':
        return 'category-update';
      default:
        return 'category-default';
    }
  };

  const getCategoryText = (priority) => {
    switch (priority) {
      case 'urgent':
        return '긴급';
      case 'high':
        return '중요';
      case 'normal':
        return '일반';
      default:
        return '공지';
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
      <div className='announcement'>
        <LogoBellNav logo={true} />
        
        <div className="announcement-container">
          <div className="header">
            <div className="header-actions">
              <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
                <img src={backIcon} alt="뒤로가기" />
              </button>
              <div className="empty-space"></div>
            </div>
            <div className="header-content">
              <h1 className="text-h2">공지사항</h1>
              <p className="subtitle text-body">최신 공지사항을 확인하세요</p>
            </div>
          </div>
        </div>
        
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>공지사항을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='announcement'>
      <LogoBellNav logo={true} />
      
      <div className="announcement-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <div className="empty-space"></div>
          </div>
          <div className="header-content">
            <h1 className="text-h2">공지사항</h1>
            <p className="subtitle text-body">최신 공지사항을 확인하세요</p>
          </div>
        </div>
      </div>
      
      <div className='content-container'>
        {list.length ? (
          <div className='notice-list'>
            {list.map((announce) => (
              <div 
                key={announce.content_code} 
                className={`notice-item ${announce.is_pinned ? 'important' : ''}`}
                onClick={() => handleNoticeClick(announce)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNoticeClick(announce);
                  }
                }}
                aria-label={`${announce.title} 공지사항 자세히 보기`}
              >
                <div className='notice-header'>
                  <div className='notice-meta'>
                    <span className={`category-badge ${getCategoryClass(announce.priority)}`}>
                      {getCategoryText(announce.priority)}
                    </span>
                    {announce.is_pinned && (
                      <span className='important-badge'>중요</span>
                    )}
                  </div>
                  <span className='notice-date'>{formatDate(announce.created_at)}</span>
                </div>
                
                <h3 className='notice-title'>{announce.title}</h3>
                
                <div className='notice-preview'>
                  <p>{announce.content?.substring(0, 100) || '내용을 확인하려면 클릭해주세요.'}...</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='noannounce'>
            <img src={paper} alt='공지사항 없음 아이콘' />
            <h3>공지사항이 없습니다</h3>
            <p>새로운 소식을 기다려주세요</p>
          </div>
        )}
      </div>

      <AnnouncementDetailModal
        isOpen={showDetailModal && !!selectedNotice}
        notice={selectedNotice}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Announcement;
