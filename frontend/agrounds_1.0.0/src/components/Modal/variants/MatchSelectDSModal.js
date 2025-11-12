import React, { useMemo, useState } from 'react';
import DSModal from '../DSModal';
import sortIcon from '../../../assets/main_icons/sort_black.png';
import leftIcon from '../../../assets/common/left.png';
import rightIcon from '../../../assets/common/right.png';

const MatchSelectDSModal = ({
  isOpen,
  onClose,
  matches = [],
  selectedMatch,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('latest'); // latest | oldest | name
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const filteredSortedMatches = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    let list = Array.isArray(matches) ? matches : [];
    if (q) {
      list = list.filter((m) => {
        const name = (m.match_name || '').toLowerCase();
        const date = (m.match_date || '').toLowerCase();
        return name.includes(q) || date.includes(q);
      });
    }
    const parseDate = (d) => {
      if (!d) return 0;
      const t = new Date(d).getTime();
      return Number.isNaN(t) ? 0 : t;
    };
    list = [...list].sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return parseDate(b.match_date) - parseDate(a.match_date);
        case 'oldest':
          return parseDate(a.match_date) - parseDate(b.match_date);
        case 'name':
          return (a.match_name || '').localeCompare(b.match_name || '');
        default:
          return 0;
      }
    });
    return list;
  }, [matches, searchQuery, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredSortedMatches.length / 5));
  const startIndex = currentPage * 5;
  const pageMatches = filteredSortedMatches.slice(startIndex, startIndex + 5);

  const goPrev = () => {
    setCurrentPage((p) => Math.max(0, p - 1));
  };
  const goNext = () => {
    setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  };

  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="경기 선택" size="md">
      <DSModal.Body>
        <div className="ds-detail" style={{ paddingBottom: '0' }}>
          <div className="ds-detail__section ds-inline-section" style={{ justifyContent: 'space-between' }}>
            <input
              type="text"
              className="form-input ds-grow"
              placeholder="경기명 또는 날짜로 검색"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
            />
            <div className="ds-row ds-nowrap" style={{ gap: '8px', flexShrink: 0 }}>
              <div className="ds-dropdown" style={{ position: 'relative' }}>
                <button className="icon-square-btn" onClick={() => setShowSortMenu((v) => !v)} aria-label="정렬">
                  <img src={sortIcon} alt="정렬" />
                </button>
                {showSortMenu && (
                  <div className="ds-dropdown__menu">
                    <button className={`ds-dropdown__option ${sortOption === 'latest' ? 'active' : ''}`} onClick={() => { setSortOption('latest'); setShowSortMenu(false); setCurrentPage(0); }}>
                      최신순
                    </button>
                    <button className={`ds-dropdown__option ${sortOption === 'oldest' ? 'active' : ''}`} onClick={() => { setSortOption('oldest'); setShowSortMenu(false); setCurrentPage(0); }}>
                      오래된순
                    </button>
                    <button className={`ds-dropdown__option ${sortOption === 'name' ? 'active' : ''}`} onClick={() => { setSortOption('name'); setShowSortMenu(false); setCurrentPage(0); }}>
                      이름순
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="option-list">
          <div
            className={`option-item ${!selectedMatch ? 'is-active' : ''}`}
            onClick={() => {
              onSelect?.('');
              onClose?.();
            }}
          >
            <div className="option-content">
              <span className="option-label">경기 선택 안함</span>
            </div>
          </div>
          {pageMatches.map((m) => (
            <div
              key={m.match_code}
              className={`option-item ${selectedMatch === m.match_code ? 'is-active' : ''}`}
              onClick={() => {
                onSelect?.(m.match_code);
                onClose?.();
              }}
            >
              <div className="option-content">
                <span className="option-label">
                  {m.match_name} {m.match_date ? `(${m.match_date})` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="ds-detail__section ds-row ds-nowrap" style={{ justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
          <button className="icon-square-btn" onClick={goPrev} aria-label="이전" disabled={currentPage === 0}>
            <img src={leftIcon} alt="이전" />
          </button>
          <div className="text-caption" style={{ color: 'var(--text-secondary)', minWidth: '60px', textAlign: 'center' }}>
            {Math.min(currentPage + 1, totalPages)} / {totalPages}
          </div>
          <button className="icon-square-btn" onClick={goNext} aria-label="다음" disabled={currentPage >= totalPages - 1}>
            <img src={rightIcon} alt="다음" />
          </button>
        </div>
      </DSModal.Body>
    </DSModal>
  );
};

export default MatchSelectDSModal;


