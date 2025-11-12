import React from 'react';
import DSModal from '../DSModal';
import playIcon from '../../../assets/main_icons/play_black.png';
import graphIcon from '../../../assets/main_icons/graph_black.png';

const VideoActionDSModal = ({
  isOpen,
  onClose,
  onWatchVideo,
  onViewAnalysis,
  videoTitle,
  hasAnalysis,
}) => {
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="경기 영상" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__section">
            <button className="btn-ghost option-btn" onClick={onWatchVideo}>
              <img src={playIcon} alt="영상 보기" className="ds-detail__icon" />
              영상 보기
            </button>
          </div>
          <div className="ds-detail__section">
            <button 
              className={`btn-ghost option-btn ${!hasAnalysis ? 'disabled' : ''}`} 
              onClick={onViewAnalysis} 
              disabled={!hasAnalysis}
            >
              <img src={graphIcon} alt="분석 결과 보러가기" className="ds-detail__icon" />
              분석 결과 보러가기
            </button>
          </div>
        </div>
      </DSModal.Body>
      <DSModal.Footer>
        <button className="cancel-btn" onClick={onClose}>닫기</button>
      </DSModal.Footer>
    </DSModal>
  );
};

export default VideoActionDSModal;


