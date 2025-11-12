import React, { useState } from 'react';
import DSModal from '../DSModal';

const FolderActionDSModal = ({
  isOpen,
  onClose,
  onRename,
  onDelete,
  folderTitle,
  folderData,
}) => {
  const [name, setName] = useState(folderTitle || '');
  const handleSave = () => {
    onRename?.(name);
    onClose?.();
  };
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="폴더 설정" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__section">
            <h4 className="ds-detail__section-title">폴더 이름 변경</h4>
            <input
              type="text"
              className="form-input"
              placeholder="폴더 이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="ds-detail__section">
            <h4 className="ds-detail__section-title">기타</h4>
            <button className="btn-danger" onClick={() => { onDelete?.(folderData); onClose?.(); }}>
              폴더 삭제
            </button>
          </div>
        </div>
      </DSModal.Body>
      <DSModal.Footer>
        <button className="cancel-btn" onClick={onClose}>취소</button>
        <button className="save-btn" onClick={handleSave} disabled={!name.trim()}>저장</button>
      </DSModal.Footer>
    </DSModal>
  );
};

export default FolderActionDSModal;


