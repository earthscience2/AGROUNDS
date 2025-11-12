import React from 'react';
import './css/VideoActionModal.scss';

// 아이콘 import (디자인 시스템 준수)
import playIcon from '../assets/main_icons/play_black.png';
import chartIcon from '../assets/main_icons/graph_black.png';
import editIcon from '../assets/identify_icon/edit.png';
import deleteIcon from '../assets/identify_icon/delete.png';
import closeIcon from '../assets/main_icons/close_black.png';

const VideoActionModal = ({ isOpen, onClose, onWatchVideo, onViewAnalysis, videoTitle, hasAnalysis }) => {
  if (!isOpen) return null;

  return (
    <div className="video-action-modal-overlay" onClick={onClose}>
      <div className="video-action-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title text-h3">영상 선택</h3>
          <button className="close-btn" onClick={onClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="action-list">
            <button className="action-btn" onClick={() => { onWatchVideo(); onClose(); }}>
              <div className="action-icon">
                <img src={playIcon} alt="재생" />
              </div>
              영상보기
            </button>
            
            {hasAnalysis && (
              <button className="action-btn" onClick={() => { onViewAnalysis(); onClose(); }}>
                <div className="action-icon">
                  <img src={chartIcon} alt="차트" />
                </div>
                분석결과 확인
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoActionModal;