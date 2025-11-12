import React, { useState } from 'react';
import DSModal from '../DSModal';

const FolderCreateDSModal = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const handleCreate = () => {
    onCreate?.(name);
  };
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="새 폴더 만들기" size="md">
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
        <button className="save-btn" onClick={handleCreate} disabled={!name.trim()}>생성</button>
      </DSModal.Footer>
    </DSModal>
  );
};

export default FolderCreateDSModal;


