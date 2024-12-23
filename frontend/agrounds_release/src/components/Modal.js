import React from 'react';
import './Modal.scss';

const Modal = ({ isOpen, onClose, children, common=true}) => {
  if (!isOpen) return null; 
  return (
    <div className="modal-overlay" onClick={onClose}>
      
    
    {common ? (
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    ) : (
      <div className="modal-contentf" onClick={(e) => e.stopPropagation()}>
        <button className="modal-closef" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    )}
    </div>
  );
};

export default Modal;
