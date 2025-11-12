import React from 'react';
import styled from 'styled-components';

const Modal = ({ isOpen, onClose, children, common=true}) => {
  if (!isOpen) return null; 
  return (
    <ModalStyle className="modal-overlay" onClick={onClose}>
      
    
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
    </ModalStyle>
  );
};

export default Modal;


const ModalStyle = styled.div`

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);;
  width: 100%;
  max-width: 500px;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: last baseline;
  z-index: 1990;


  .modal-content {
    background: white;
    border-radius: 4vh;
    margin-bottom: 10vh;
    width: 90%;
    min-height: 25vh;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .modal-close {
    position: absolute;
    top: 2vh;
    right: 2vh;
    background: none;
    border: none;
    font-size: 4vh;
    cursor: pointer;
  }

.modal-contentf {
  background: white;
  height: 100vh;
  width: 100%;
  font-family: var(--font-text);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal-closef {
  position: absolute;
  top: 2vh;
  right: 2vh;
  background: none;
  border: none;
  font-size: 4vh;
  cursor: pointer;
}


`