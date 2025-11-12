import React from 'react';
import DSModal from '../DSModal';

const FolderDeleteDSModal = ({
  isOpen,
  onClose,
  onConfirm,
  folderTitle,
}) => {
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="폴더 삭제" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__section ds-detail__center">
            <p>다음 폴더를 삭제하시겠습니까?</p>
            <p className="ds-detail__folder-name">{folderTitle || '-'}</p>
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

export default FolderDeleteDSModal;


