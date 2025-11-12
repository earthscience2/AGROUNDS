import React, { useState } from 'react';
import './css/FolderActionModal.scss';

// 아이콘 import (디자인 시스템 준수)
import editIcon from '../assets/identify_icon/edit.png';
import deleteIcon from '../assets/identify_icon/delete.png';
import closeIcon from '../assets/main_icons/close_black.png';

const FolderActionModal = ({ isOpen, onClose, onRename, onDelete, folderTitle, folderData }) => {
  const [modalStep, setModalStep] = useState('menu'); // 'menu', 'rename', 'delete'
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRenameClick = () => {
    setNewName(folderData?.title || folderData?.name || folderTitle || '');
    setModalStep('rename');
  };

  const handleDeleteClick = () => {
    setModalStep('delete');
  };

  const handleRenameSubmit = async () => {
    if (!newName.trim()) return;
    
    setIsLoading(true);
    try {
      await onRename(newName.trim());
      setModalStep('menu');
      onClose();
    } catch (error) {
      // 에러는 부모 컴포넌트에서 처리
    }
    setIsLoading(false);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      await onDelete();
      setModalStep('menu');
      onClose();
    } catch (error) {
      // 에러는 부모 컴포넌트에서 처리
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setModalStep('menu');
    setNewName('');
    onClose();
  };

  const renderContent = () => {
    switch (modalStep) {
      case 'rename':
        return (
          <>
            <div className="modal-header">
              <h3 className="modal-title text-h3">폴더 이름 변경</h3>
              <button className="close-btn" onClick={handleClose}>
                <img src={closeIcon} alt="닫기" />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="rename-form">
                <input
                  type="text"
                  className="text-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="새로운 폴더 이름을 입력하세요"
                  maxLength={50}
                  disabled={isLoading}
                />
                <div className="button-group">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setModalStep('menu')} 
                    disabled={isLoading}
                  >
                    취소
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleRenameSubmit}
                    disabled={!newName.trim() || isLoading}
                  >
                    {isLoading ? '변경 중...' : '변경'}
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'delete':
        return (
          <>
            <div className="modal-header">
              <h3 className="modal-title text-h3">폴더 삭제</h3>
              <button className="close-btn" onClick={handleClose}>
                <img src={closeIcon} alt="닫기" />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="delete-confirm">
                <p className="delete-message text-body">
                  <strong>"{folderTitle}"</strong> 폴더를 삭제하시겠습니까?
                </p>
                <p className="delete-warning text-caption">
                  폴더 내의 모든 영상이 함께 삭제되며, 이 작업은 되돌릴 수 없습니다.
                </p>
                <div className="button-group">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setModalStep('menu')} 
                    disabled={isLoading}
                  >
                    취소
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={handleDeleteConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      
      default:
        return (
          <>
            <div className="modal-header">
              <h3 className="modal-title text-h3">폴더 설정</h3>
              <button className="close-btn" onClick={handleClose}>
                <img src={closeIcon} alt="닫기" />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="action-list">
                <button className="action-btn" onClick={handleRenameClick}>
                  <div className="action-icon">
                    <img src={editIcon} alt="편집" />
                  </div>
                  이름 변경
                </button>
                
                <button className="action-btn danger" onClick={handleDeleteClick}>
                  <div className="action-icon">
                    <img src={deleteIcon} alt="삭제" />
                  </div>
                  삭제
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="folder-action-modal-overlay" onClick={handleClose}>
      <div className="folder-action-modal" onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>
  );
};

export default FolderActionModal;