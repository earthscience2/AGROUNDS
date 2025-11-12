import React from 'react';
import DSModal from '../DSModal';

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

const getCategoryClass = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'badge badge--urgent';
    case 'high':
      return 'badge badge--high';
    case 'normal':
      return 'badge badge--normal';
    default:
      return 'badge';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const AnnouncementDetailModal = ({ isOpen, notice, onClose }) => {
  if (!notice) return null;
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="공지사항" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__header">
            <div className="ds-detail__badges">
              <span className={getCategoryClass(notice.priority)}>
                {getCategoryText(notice.priority)}
              </span>
              {notice.is_pinned && <span className="badge badge--important">중요</span>}
            </div>
            <span className="ds-detail__date">{formatDate(notice.created_at)}</span>
          </div>
          <h2 className="ds-detail__title">{notice.title}</h2>
          <div className="ds-detail__content">
            <p style={{ whiteSpace: 'pre-wrap' }}>{notice.content || '내용이 없습니다.'}</p>
          </div>
        </div>
      </DSModal.Body>
    </DSModal>
  );
};

export default AnnouncementDetailModal;


