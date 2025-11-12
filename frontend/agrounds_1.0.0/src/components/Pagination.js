import React from 'react';
import leftIcon from '../assets/common/left.png';
import rightIcon from '../assets/common/right.png';
import './css/Pagination.scss';

/**
 * 재사용 가능한 페이지네이션 컴포넌트
 * 좌우 화살표 버튼과 페이지 인디케이터(숫자 + 도트)를 포함한 슬라이더 스타일 페이지네이션
 * 
 * @param {number} currentPage - 현재 페이지 (0부터 시작)
 * @param {number} totalPages - 전체 페이지 수
 * @param {function} onPageChange - 페이지 변경 핸들러 (pageNumber) => void
 * @param {string} className - 추가 CSS 클래스명 (optional)
 */
const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  const handlePrev = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handleDotClick = (pageIndex) => {
    onPageChange(pageIndex);
  };

  // 페이지가 1개 이하면 표시하지 않음
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`pagination ${className}`}>
      <button 
        className="pagination-btn prev"
        onClick={handlePrev}
        disabled={currentPage === 0}
        aria-label="이전 페이지"
      >
        <img src={leftIcon} alt="이전" />
      </button>
      
      <div className="pagination-info">
        <span className="page-indicator text-body">
          {currentPage + 1} / {totalPages}
        </span>
        <span className="page-dots">
          {Array.from({ length: totalPages }, (_, i) => (
            <span 
              key={i} 
              className={`dot ${i === currentPage ? 'active' : ''}`}
              onClick={() => handleDotClick(i)}
              aria-label={`${i + 1}페이지로 이동`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDotClick(i);
                }
              }}
            />
          ))}
        </span>
      </div>
      
      <button 
        className="pagination-btn next"
        onClick={handleNext}
        disabled={currentPage >= totalPages - 1}
        aria-label="다음 페이지"
      >
        <img src={rightIcon} alt="다음" />
      </button>
    </div>
  );
};

export default Pagination;

