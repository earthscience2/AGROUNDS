import React, { useEffect, useMemo, useRef, useState } from 'react';
import DSModal from '../DSModal';
import { MatchSelectDSModal, QuarterSelectDSModal } from './index';
import { GetUserQuartersApi } from '../../../function/api/video/videoApi';

const VideoAddDSModal = ({
  isOpen,
  onClose,
  onAdd,
  folderCode,
}) => {
  const [url, setUrl] = useState('');
  const [quarterCode, setQuarterCode] = useState('');
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [loadingQuarters, setLoadingQuarters] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchQuarters = async () => {
      setLoadingQuarters(true);
      try {
        const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code');
        if (!userCode) {
          setMatches([]);
          return;
        }
        const response = await GetUserQuartersApi(userCode);
        const quarters = response?.data?.data?.quarters || response?.data?.quarters || [];
        const matchMap = new Map();
        quarters.forEach((q) => {
          const matchCode = q.match_code;
          if (!matchMap.has(matchCode)) {
            matchMap.set(matchCode, {
              match_code: matchCode,
              match_name: q.match_name,
              match_date: q.match_date || q.quarter_date,
              quarters: [],
            });
          }
          matchMap.get(matchCode).quarters.push(q);
        });
        setMatches(Array.from(matchMap.values()));
      } catch (e) {
        setMatches([]);
      } finally {
        setLoadingQuarters(false);
      }
    };
    fetchQuarters();
  }, [isOpen]);

  useEffect(() => {
    // 모달 닫힐 때 상태 초기화
    if (!isOpen) {
      setUrl('');
      setQuarterCode('');
      setSelectedMatch('');
      setIsMatchModalOpen(false);
      setIsQuarterModalOpen(false);
    }
  }, [isOpen]);

  const quartersForSelectedMatch = useMemo(() => {
    if (!selectedMatch) return [];
    const m = matches.find((m) => m.match_code === selectedMatch);
    return m ? m.quarters : [];
  }, [matches, selectedMatch]);

  // 옵션 선택은 별도 모달로 처리하므로 외부 클릭 로직 불필요

  const handleAdd = () => {
    onAdd?.({
      url,
      folderCode,
      quarterCode,
    });
  };
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="영상 추가" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__section">
            <h4 className="ds-detail__section-title">YouTube URL</h4>
            <input
              type="text"
              className="form-input"
              placeholder="https://youtu.be/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="ds-detail__section">
            <h4 className="ds-detail__section-title">관련 쿼터 (선택)</h4>
            {loadingQuarters ? (
              <div className="text-caption" style={{ color: 'var(--text-disabled)' }}>
                쿼터 목록을 불러오는 중...
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="ds-select__button"
                  onClick={() => setIsMatchModalOpen(true)}
                >
                  <span className="ds-select__text">
                    {selectedMatch
                      ? `${matches.find((m) => m.match_code === selectedMatch)?.match_name || ''} ${
                          matches.find((m) => m.match_code === selectedMatch)?.match_date
                            ? `(${matches.find((m) => m.match_code === selectedMatch)?.match_date})`
                            : ''
                        }`
                      : '경기 선택 안함'}
                  </span>
                  <span className="ds-select__icon">›</span>
                </button>

                {selectedMatch && (
                  <>
                    <button
                      type="button"
                      className="ds-select__button"
                      onClick={() => setIsQuarterModalOpen(true)}
                      disabled={!selectedMatch}
                    >
                      <span className="ds-select__text">
                        {quarterCode
                          ? (() => {
                              const q = quartersForSelectedMatch.find((x) => x.quarter_code === quarterCode);
                              return (q?.quarter_name || `쿼터 ${q?.quarter}`) + (q?.quarter_time ? ` (${q.quarter_time})` : '');
                            })()
                          : '쿼터 선택 안함'}
                      </span>
                      <span className="ds-select__icon">›</span>
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </DSModal.Body>
      <DSModal.Footer>
        <button className="cancel-btn" onClick={onClose}>취소</button>
        <button className="save-btn" onClick={handleAdd} disabled={!url.trim()}>추가</button>
      </DSModal.Footer>
      <MatchSelectDSModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        matches={matches}
        selectedMatch={selectedMatch}
        onSelect={(code) => {
          setSelectedMatch(code);
          if (!code) setQuarterCode('');
        }}
      />
      <QuarterSelectDSModal
        isOpen={isQuarterModalOpen}
        onClose={() => setIsQuarterModalOpen(false)}
        quarters={quartersForSelectedMatch}
        selectedQuarterCode={quarterCode}
        onSelect={(code) => setQuarterCode(code)}
      />
    </DSModal>
  );
};

export default VideoAddDSModal;


