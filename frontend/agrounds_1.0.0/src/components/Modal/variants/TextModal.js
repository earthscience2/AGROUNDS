import React from 'react';
import DSModal from '../DSModal';
import LoginInput from '../../Login_input';

const TextModal = ({
  isOpen,
  title,
  value,
  placeholder,
  error,
  onChange,
  onSave,
  onClose,
  size = 'md',
}) => {
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <DSModal.Body>
        <LoginInput
          borderRadius='12px'
          placeholder={placeholder || `${title}을 입력해주세요`}
          type='text'
          value={value}
          onChange={onChange}
        />
        {!!error && <div className='field-error text-caption'>{error}</div>}
      </DSModal.Body>
      <DSModal.Footer>
        <button className='cancel-btn' onClick={onClose}>취소</button>
        <button className='save-btn' onClick={onSave} disabled={!!error}>저장</button>
      </DSModal.Footer>
    </DSModal>
  );
};

export default TextModal;


