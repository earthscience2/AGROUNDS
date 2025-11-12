import React from 'react';
import DSModal from '../DSModal';

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return '답변 대기';
    case 'in_progress':
      return '처리 중';
    case 'completed':
      return '답변 완료';
    case 'rejected':
      return '반려';
    default:
      return '처리중';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'badge badge--warning';
    case 'in_progress':
      return 'badge badge--info';
    case 'completed':
      return 'badge badge--success';
    case 'rejected':
      return 'badge badge--error';
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

const InquiryDetailModal = ({ isOpen, inquiry, onClose, typeText }) => {
  if (!inquiry) return null;
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="문의 상세" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__header">
            <div className="ds-detail__badges">
              <span className="badge">{typeText}</span>
              <span className={getStatusClass(inquiry.status)}>{getStatusText(inquiry.status)}</span>
            </div>
            <span className="ds-detail__date">{formatDate(inquiry.created_at)}</span>
          </div>
          <h2 className="ds-detail__title">{inquiry.title}</h2>
          <div className="ds-detail__content">
            <h4>문의 내용</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{inquiry.content}</p>
          </div>
          {inquiry.answer ? (
            <div className="ds-detail__section">
              <h4 className="ds-detail__section-title">답변</h4>
              <div className="ds-detail__answer">
                <p style={{ whiteSpace: 'pre-wrap' }}>{inquiry.answer}</p>
              </div>
              {inquiry.answered_at && (
                <div className="ds-detail__meta">
                  <span>답변일: {formatDate(inquiry.answered_at)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="ds-detail__section">
              <p>답변 대기 중입니다. 빠른 시일 내에 답변드리겠습니다.</p>
            </div>
          )}
        </div>
      </DSModal.Body>
      <DSModal.Footer>
        <button className="cancel-btn" onClick={onClose}>닫기</button>
      </DSModal.Footer>
    </DSModal>
  );
};

export default InquiryDetailModal;


