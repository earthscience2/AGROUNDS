import React, { useEffect, useRef } from 'react';
import DSModal from '../DSModal';

const RegionModal = ({
  isOpen,
  title = '활동지역 선택',
  sidoList = [],
  sigunguMap = {},
  selectedSido,
  selectedSigungu,
  onSelectSido,
  onSelectSigungu,
  onReset,
  onConfirm,
  onClose,
  disabledConfirm = false,
  size = 'md',
}) => {
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const savedRightScrollTopRef = useRef(null);
  const savedLeftScrollTopRef = useRef(null);

  useEffect(() => {
    if (savedRightScrollTopRef.current != null && rightColumnRef.current) {
      rightColumnRef.current.scrollTop = savedRightScrollTopRef.current;
      savedRightScrollTopRef.current = null;
    }
  }, [selectedSigungu]);

  // 구 선택으로 리렌더될 때도 왼쪽 스크롤 위치 유지
  useEffect(() => {
    if (savedLeftScrollTopRef.current != null && leftColumnRef.current) {
      leftColumnRef.current.scrollTop = savedLeftScrollTopRef.current;
      // 유지가 목적이므로 비우지 않고 재사용 가능하게 둔다
    }
  }, [selectedSigungu]);

  useEffect(() => {
    if (savedLeftScrollTopRef.current != null && leftColumnRef.current) {
      leftColumnRef.current.scrollTop = savedLeftScrollTopRef.current;
      savedLeftScrollTopRef.current = null;
    }
  }, [selectedSido]);

  return (
    <DSModal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <DSModal.Body>
        <div className='region-body'>
          <div className='region-columns'>
            <div className='region-column' ref={leftColumnRef}>
              {sidoList.map((sido) => (
                <div
                  key={sido}
                  className={`region-item ${selectedSido === sido ? 'selected' : ''}`}
                  onClick={() => {
                    if (leftColumnRef.current) {
                      savedLeftScrollTopRef.current = leftColumnRef.current.scrollTop;
                    }
                    onSelectSido?.(sido);
                  }}
                >
                  {sido}
                </div>
              ))}
            </div>
            <div className='region-column' ref={rightColumnRef}>
              {(sigunguMap[selectedSido] || []).map((sigungu) => (
                <div
                  key={sigungu}
                  className={`region-item ${selectedSigungu === sigungu ? 'selected' : ''}`}
                  onClick={() => {
                    if (rightColumnRef.current) {
                      savedRightScrollTopRef.current = rightColumnRef.current.scrollTop;
                    }
                      if (leftColumnRef.current) {
                        savedLeftScrollTopRef.current = leftColumnRef.current.scrollTop;
                      }
                    onSelectSigungu?.(sigungu);
                  }}
                >
                  {sigungu}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DSModal.Body>
      <DSModal.Footer>
        <button className='cancel-btn' onClick={onReset}>초기화</button>
        <button className='save-btn' onClick={onConfirm} disabled={disabledConfirm}>선택 완료</button>
      </DSModal.Footer>
    </DSModal>
  );
};

export default RegionModal;


