import React, { useState } from 'react';
import './css/VideoDeleteModal.scss';

// 아이콘 import (디자인 시스템 준수)
import closeIcon from '../assets/main_icons/close_black.png';

const VideoDeleteModal = ({ isOpen, onClose, onConfirm, videoTitle }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('삭제 실패:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="video-delete-modal-overlay" onClick={onClose}>
      <div className="video-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title text-h3">영상 삭제</h3>
          <button className="close-btn" onClick={onClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="delete-confirm">
            <p className="delete-message text-body">
              <strong>"{videoTitle}"</strong> 영상을 삭제하시겠습니까?
            </p>
            <p className="delete-warning text-caption">
              삭제된 영상은 복구할 수 없습니다.
            </p>
            <div className="button-group">
              <button 
                className="btn-secondary" 
                onClick={onClose} 
                disabled={isDeleting}
              >
                취소
              </button>
              <button 
                className="btn-danger"
                onClick={handleConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDeleteModal;