import React, { useState } from 'react';
import './css/FolderCreateModal.scss';

// 아이콘 import (디자인 시스템 준수)
import closeIcon from '../assets/main_icons/close_black.png';

const FolderCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!folderName.trim()) return;
    
    setIsLoading(true);
    try {
      await onCreate(folderName.trim());
      setFolderName('');
      onClose();
    } catch (error) {
      console.error('폴더 생성 실패:', error);
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setFolderName('');
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && folderName.trim() && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="folder-create-modal-overlay" onClick={handleClose}>
      <div className="folder-create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title text-h3">새 폴더 만들기</h3>
          <button className="close-btn" onClick={handleClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="create-form">
            <input
              type="text"
              className="text-input"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="폴더 이름을 입력하세요"
              maxLength={50}
              disabled={isLoading}
              autoFocus
            />
            <div className="button-group">
              <button 
                className="btn-secondary" 
                onClick={handleClose} 
                disabled={isLoading}
              >
                취소
              </button>
              <button 
                className="btn-primary"
                onClick={handleSubmit}
                disabled={!folderName.trim() || isLoading}
              >
                {isLoading ? '생성 중...' : '생성'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderCreateModal;