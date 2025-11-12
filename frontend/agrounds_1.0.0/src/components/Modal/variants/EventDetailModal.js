import React from 'react';
import DSModal from '../DSModal';

const getEventStatus = (event) => {
  if (!event?.event_start_date || !event?.event_end_date) return 'unknown';
  const now = new Date();
  const startDate = new Date(event.event_start_date);
  const endDate = new Date(event.event_end_date);
  if (now < startDate) return 'upcoming';
  if (now > endDate) return 'ended';
  return 'active';
};

const getStatusText = (event) => {
  switch (getEventStatus(event)) {
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

const getStatusClass = (event) => {
  switch (getEventStatus(event)) {
    case 'active':
      return 'badge badge--success';
    case 'ended':
      return 'badge';
    case 'upcoming':
      return 'badge badge--info';
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

const EventDetailModal = ({ isOpen, event, onClose, rewardIconSrc, linkIconSrc }) => {
  if (!event) return null;
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="이벤트 상세" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__header">
            <div className="ds-detail__badges">
              <span className={getStatusClass(event)}>{getStatusText(event)}</span>
            </div>
            <div className="ds-detail__date">
              {formatDate(event.event_start_date)} ~ {formatDate(event.event_end_date)}
            </div>
          </div>
          <h2 className="ds-detail__title">{event.title}</h2>
          <div className="ds-detail__content">
            <p style={{ whiteSpace: 'pre-wrap' }}>{event.content}</p>
          </div>
          {event.event_reward && (
            <div className="ds-detail__section">
              <h4 className="ds-detail__section-title">
                {rewardIconSrc && <img src={rewardIconSrc} alt="보상" className="ds-detail__icon" />}
                보상
              </h4>
              <p>{event.event_reward}</p>
            </div>
          )}
          {event.event_link && (
            <div className="ds-detail__section">
              <a href={event.event_link} target="_blank" rel="noopener noreferrer" className="ds-detail__link">
                자세히 보기
                {linkIconSrc && <img src={linkIconSrc} alt="이동" className="ds-detail__icon" />}
              </a>
            </div>
          )}
        </div>
      </DSModal.Body>
    </DSModal>
  );
};

export default EventDetailModal;


