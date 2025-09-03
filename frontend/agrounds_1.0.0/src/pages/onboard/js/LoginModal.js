import React from 'react';
import '../css/LoginModal.scss';

const LoginModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; 
  return (
    <div className="modal-overlayl" onClick={onClose}>
      <div className="modal-contentl" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default LoginModal;