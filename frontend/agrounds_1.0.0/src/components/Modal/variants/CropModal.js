import React from 'react';
import DSModal from '../DSModal';
import Cropper from 'react-easy-crop';

const CropModal = ({
  isOpen,
  title = '이미지 편집',
  imageSrc,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onConfirm,
  loading = false,
  size = 'lg',
}) => {
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <DSModal.Body>
        <div className='crop-modal'>
          <div className='crop-container'>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape='round'
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className='crop-controls'>
            <label className='text-body-sm'>확대/축소</label>
            <input
              type='range'
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => onZoomChange?.(parseFloat(e.target.value))}
              className='zoom-slider'
            />
          </div>
        </div>
      </DSModal.Body>
      <DSModal.Footer>
        <button className='cancel-btn text-body' onClick={onClose}>취소</button>
        <button className='confirm-btn text-body' onClick={onConfirm} disabled={loading}>
          {loading ? '저장 중...' : '저장'}
        </button>
      </DSModal.Footer>
    </DSModal>
  );
};

export default CropModal;


