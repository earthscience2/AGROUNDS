import React from 'react';
import DSModal from '../DSModal';
import editIcon from '../../../assets/common/ico_edit.png';
import trashIcon from '../../../assets/common/ico_trash.png';

const VideoOptionDSModal = ({
  isOpen,
  onClose,
  onChangeQuarter,
  onDelete,
  videoTitle,
}) => {
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title={videoTitle || '영상 옵션'} size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__section">
            <button className="btn-ghost option-btn" onClick={onChangeQuarter}>
              <img src={editIcon} alt="관련 쿼터 변경" className="ds-detail__icon" />
              관련 경기 변경
            </button>
          </div>
          <div className="ds-detail__section">
            <button className="btn-ghost btn-ghost-danger option-btn" onClick={onDelete}>
              <img src={trashIcon} alt="영상 삭제" className="ds-detail__icon" />
              영상 삭제
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

export default VideoOptionDSModal;


