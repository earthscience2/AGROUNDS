import React from 'react';
import './css/VideoActionModal.scss';

// 아이콘 import (디자인 시스템 준수)
import editIcon from '../assets/identify_icon/edit.png';
import deleteIcon from '../assets/identify_icon/delete.png';
import closeIcon from '../assets/main_icons/close_black.png';

const VideoOptionModal = ({ isOpen, onClose, onChangeQuarter, onDelete, videoTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="video-action-modal-overlay" onClick={onClose}>
      <div className="video-action-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title text-h3">영상 설정</h3>
          <button className="close-btn" onClick={onClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="action-list">
            <button className="action-btn" onClick={() => { onChangeQuarter(); onClose(); }}>
              <div className="action-icon">
                <img src={editIcon} alt="편집" />
              </div>
              관련 쿼터 변경
            </button>
            
            <button className="action-btn danger" onClick={() => { onDelete(); onClose(); }}>
              <div className="action-icon">
                <img src={deleteIcon} alt="삭제" />
              </div>
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoOptionModal;
