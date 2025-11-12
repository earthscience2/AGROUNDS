import React from 'react';
import DSModal from '../DSModal';

const OptionModal = ({
  isOpen,
  title,
  options = [],
  selectedValue,
  onSelect,
  onClose,
  size = 'md',
  checkIconSrc, // optional
}) => {
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <DSModal.Body>
        <div className='option-list'>
          {options.map((option) => (
            <div
              key={option.value}
              className='option-item'
              onClick={() => onSelect?.(option.value)}
            >
              <div className='option-content'>
                {option.color && (
                  <div className='option-color' style={{ backgroundColor: option.color }} />
                )}
                <span className='option-label'>{option.label}</span>
              </div>
              {selectedValue === option.value && (
                checkIconSrc ? (
                  <img src={checkIconSrc} alt='선택됨' className='check-icon' />
                ) : (
                  <span className='check-icon' aria-hidden>✓</span>
                )
              )}
            </div>
          ))}
        </div>
      </DSModal.Body>
    </DSModal>
  );
};

export default OptionModal;


