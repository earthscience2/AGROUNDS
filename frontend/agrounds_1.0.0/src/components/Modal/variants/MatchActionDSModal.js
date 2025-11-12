import React, { useCallback, useState } from 'react';
import DSModal from '../DSModal';
import editIcon from '../../../assets/common/ico_edit.png';
import trashIcon from '../../../assets/common/ico_trash.png';

const MatchActionDSModal = ({
  isOpen,
  onClose,
  onRename,
  onDelete,
  matchTitle,
  matchData,
  hideDelete = false,
}) => {
  const [name, setName] = useState(matchTitle || '');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleOpenRename = useCallback(() => {
    setName(matchTitle || '');
    setShowRenameModal(true);
  }, [matchTitle]);
  const handleCloseRename = useCallback(() => {
    setShowRenameModal(false);
  }, []);
  const handleCloseDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);
  const handleSaveRename = () => {
    const next = (name || '').trim();
    if (!next) return;
    onRename?.(next);
    setShowRenameModal(false);
    onClose?.();
  };
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="경기 설정" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__section">
            <button
              className="btn-ghost option-btn"
              onClick={handleOpenRename}
            >
              <img src={editIcon} alt="이름 변경" className="ds-detail__icon" />
              경기 이름 변경
            </button>
          </div>
          {!hideDelete && (
            <div className="ds-detail__section">
              <button
                className="btn-ghost btn-ghost-danger option-btn"
                onClick={() => { setShowDeleteConfirm(true); }}
              >
                <img src={trashIcon} alt="경기 삭제" className="ds-detail__icon" />
                경기 삭제
              </button>
            </div>
          )}
        </div>
      </DSModal.Body>
      <DSModal.Footer>
        <button className="cancel-btn" onClick={onClose}>닫기</button>
      </DSModal.Footer>
      {showRenameModal && (
        <DSModal isOpen={showRenameModal} onClose={handleCloseRename} title="경기 이름 변경" size="md">
          <DSModal.Body>
            <div className="ds-detail">
              <div className="ds-detail__section">
                <input
                  type="text"
                  className="form-input"
                  placeholder="새 경기 이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          </DSModal.Body>
          <DSModal.Footer>
            <button className="cancel-btn" onClick={handleCloseRename}>취소</button>
            <button className="save-btn" onClick={handleSaveRename} disabled={!name.trim()}>저장</button>
          </DSModal.Footer>
        </DSModal>
      )}
      {showDeleteConfirm && (
        <DSModal isOpen={showDeleteConfirm} onClose={handleCloseDeleteConfirm} title="경기 삭제" size="md">
          <DSModal.Body>
            <div className="ds-detail">
              <div className="ds-detail__section ds-detail__center">
                <p>다음 경기를 삭제하시겠습니까?</p>
                <p className="ds-detail__folder-name">{matchTitle || '-'}</p>
              </div>
            </div>
          </DSModal.Body>
          <DSModal.Footer>
            <button className="cancel-btn" onClick={handleCloseDeleteConfirm}>취소</button>
            <button
              className="btn-danger"
              onClick={() => {
                onDelete?.(matchData);
                handleCloseDeleteConfirm();
                onClose?.();
              }}
            >
              삭제
            </button>
          </DSModal.Footer>
        </DSModal>
      )}
    </DSModal>
  );
};

export default MatchActionDSModal;


