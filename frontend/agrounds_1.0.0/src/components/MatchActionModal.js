import React, { useState } from 'react';
import styled from 'styled-components';

// 아이콘 import
import editIcon from '../assets/common/ico_edit.png';
import trashIcon from '../assets/common/ico_trash.png';
import closeIcon from '../assets/common/x.png';

const MatchActionModal = ({ isOpen, onClose, onRename, onDelete, matchTitle, matchData }) => {
  const [modalStep, setModalStep] = useState('menu'); // 'menu', 'rename', 'delete'
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRenameClick = () => {
    setNewName(matchData?.title || matchData?.name || matchTitle || '');
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
      console.error('이름 변경 실패:', error);
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
      console.error('삭제 실패:', error);
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
            <ModalHeader>
              <h3 className="text-h4">이름 변경</h3>
              <CloseButton onClick={handleClose}>
                <img src={closeIcon} alt="닫기" />
              </CloseButton>
            </ModalHeader>
            <RenameForm>
              <InputField
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="새로운 경기 이름을 입력하세요"
                maxLength={50}
                disabled={isLoading}
              />
              <ButtonGroup>
                <SecondaryButton onClick={() => setModalStep('menu')} disabled={isLoading}>
                  취소
                </SecondaryButton>
                <PrimaryButton 
                  onClick={handleRenameSubmit}
                  disabled={!newName.trim() || isLoading}
                >
                  {isLoading ? '변경 중...' : '변경'}
                </PrimaryButton>
              </ButtonGroup>
            </RenameForm>
          </>
        );
      
      case 'delete':
        return (
          <>
            <ModalHeader>
              <h3 className="text-h4">경기 삭제</h3>
              <CloseButton onClick={handleClose}>
                <img src={closeIcon} alt="닫기" />
              </CloseButton>
            </ModalHeader>
            <DeleteConfirm>
              <p className="text-body">
                정말로 "<strong>{matchTitle}</strong>" 경기를 삭제하시겠습니까?
              </p>
              <p className="text-caption warning">
                삭제된 경기는 복구할 수 없습니다.
              </p>
              <ButtonGroup>
                <SecondaryButton onClick={() => setModalStep('menu')} disabled={isLoading}>
                  취소
                </SecondaryButton>
                <DeleteButton 
                  onClick={handleDeleteConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? '삭제 중...' : '삭제'}
                </DeleteButton>
              </ButtonGroup>
            </DeleteConfirm>
          </>
        );
      
      default:
        return (
          <>
            <ModalHeader>
              <h3 className="text-h4">{matchTitle || '경기 설정'}</h3>
              <CloseButton onClick={handleClose}>
                <img src={closeIcon} alt="닫기" />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <ActionButton onClick={handleRenameClick}>
                <ActionIcon>
                  <img src={editIcon} alt="이름 변경" />
                </ActionIcon>
                <ActionText>이름 변경</ActionText>
              </ActionButton>
              
              <ActionButton onClick={handleDeleteClick} className="danger">
                <ActionIcon>
                  <img src={trashIcon} alt="삭제" />
                </ActionIcon>
                <ActionText>삭제</ActionText>
              </ActionButton>
            </ModalBody>
          </>
        );
    }
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 499px;
  background: #FFFFFF;
  border-radius: 24px;
  padding: 24px 20px;
  margin: 20px;
  animation: fadeIn 0.3s ease-out;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* iOS Safari에서 입력창 포커스 시 화면 확대 방지 */
  @supports (-webkit-overflow-scrolling: touch) {
    input {
      font-size: 16px !important;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h3 {
    margin: 0;
    color: #262626;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #F2F4F6;
  }

  img {
    width: 24px;
    height: 24px;
    opacity: 0.6;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: none;
  background: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #F2F4F6;
  }

  &.danger {
    color: #EF4444;
  }
`;

const ActionIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
    opacity: 0.7;
  }
`;

const ActionText = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: inherit;
`;

const RenameForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Pretendard', sans-serif;
  color: #262626;
  background: #FFFFFF;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #079669;
    box-shadow: 0 0 0 3px rgba(7, 150, 105, 0.1);
  }

  &:disabled {
    background-color: #F2F4F6;
    color: #8A8F98;
  }

  &::placeholder {
    color: #8A8F98;
  }

  /* 모바일에서 줌 방지 */
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  background: #079669;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #068A5B;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #E2E8F0;
    color: #8A8F98;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  background: #FFFFFF;
  color: #6B7078;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #079669;
    color: #079669;
  }

  &:disabled {
    background: #F2F4F6;
    color: #8A8F98;
    border-color: #E2E8F0;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  background: #EF4444;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #DC2626;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #E2E8F0;
    color: #8A8F98;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeleteConfirm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  p {
    margin: 0;
    text-align: center;
    
    &.text-body {
      color: #262626;
      line-height: 1.5;
    }
    
    &.warning {
      color: #EF4444;
      font-size: 14px;
    }

    strong {
      color: #EF4444;
    }
  }
`;

export default MatchActionModal;