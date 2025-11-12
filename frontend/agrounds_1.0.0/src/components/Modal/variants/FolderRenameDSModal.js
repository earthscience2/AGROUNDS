import React, { useState, useEffect } from 'react';
import DSModal from '../DSModal';

const FolderRenameDSModal = ({
  isOpen,
  onClose,
  onRename,
  folderTitle,
}) => {
  const [name, setName] = useState(folderTitle || '');
  useEffect(() => {
    if (isOpen) setName(folderTitle || '');
  }, [isOpen, folderTitle]);

  const handleSave = () => {
    onRename?.(name);
    onClose?.();
  };
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="폴더 이름 변경" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__section">
            <input
              type="text"
              className="form-input"
              placeholder="폴더 이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
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

export default FolderRenameDSModal;


