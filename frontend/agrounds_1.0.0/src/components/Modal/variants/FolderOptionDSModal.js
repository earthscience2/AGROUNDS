import React from 'react';
import DSModal from '../DSModal';
import editIcon from '../../../assets/common/ico_edit.png';
import trashIcon from '../../../assets/common/ico_trash.png';

const FolderOptionDSModal = ({
  isOpen,
  onClose,
  onRenameClick,
  onDeleteClick,
  folderTitle,
}) => {
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title={folderTitle || '폴더 옵션'} size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__section">
            <button className="btn-ghost option-btn" onClick={onRenameClick}>
              <img src={editIcon} alt="이름 변경" className="ds-detail__icon" />
              이름 변경
            </button>
          </div>
          <div className="ds-detail__section">
            <button className="btn-ghost btn-ghost-danger option-btn" onClick={onDeleteClick}>
              <img src={trashIcon} alt="폴더 삭제" className="ds-detail__icon" />
              폴더 삭제
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

export default FolderOptionDSModal;


