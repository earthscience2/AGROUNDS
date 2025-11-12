import React from 'react';
import DSModal from '../DSModal';

const VideoDeleteDSModal = ({
  isOpen,
  onClose,
  onConfirm,
  videoTitle,
}) => {
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="영상 삭제" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__section ds-detail__center">
            <p>다음 영상을 삭제하시겠습니까?</p>
            <p className="ds-detail__folder-name">{videoTitle || '-'}</p>
          </div>
        </div>
      </DSModal.Body>
      <DSModal.Footer>
        <button className="cancel-btn" onClick={onClose}>취소</button>
        <button className="btn-danger" onClick={onConfirm}>삭제</button>
      </DSModal.Footer>
    </DSModal>
  );
};

export default VideoDeleteDSModal;


