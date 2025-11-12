import React, { useEffect, useMemo, useState } from 'react';
import DSModal from '../DSModal';
import { MatchSelectDSModal, QuarterSelectDSModal } from './index';
import { GetUserQuartersApi } from '../../../function/api/video/videoApi';

const VideoChangeQuarterDSModal = ({
  isOpen,
  onClose,
  onChangeQuarter,
  currentQuarterCode,
  videoTitle,
}) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);
  const [selectedQuarterCode, setSelectedQuarterCode] = useState(currentQuarterCode || '');
  const [selectedMatch, setSelectedMatch] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const fetchQuarters = async () => {
      try {
        setIsLoading(true);
        const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code');
        if (!userCode) {
          setMatches([]);
          setIsLoading(false);
          return;
        }
        const response = await GetUserQuartersApi(userCode);
        const quarters = response?.data?.data?.quarters || response?.data?.quarters || [];
        const matchMap = new Map();
        (quarters || []).forEach((q) => {
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
        const matchList = Array.from(matchMap.values());
        setMatches(matchList);

        // 현재 쿼터 기준으로 초기 선택값 세팅
        if (currentQuarterCode) {
          for (const m of matchList) {
            if ((m.quarters || []).some((qq) => qq.quarter_code === currentQuarterCode)) {
              setSelectedMatch(m.match_code);
              break;
            }
          }
        }
      } catch (e) {
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuarters();
  }, [isOpen]);

  useEffect(() => {
    // 열릴 때 현재 값 반영
    if (isOpen) setSelectedQuarterCode(currentQuarterCode || '');
  }, [isOpen, currentQuarterCode]);

  const currentQuarterLabel = useMemo(() => {
    if (isLoading) return '-';
    for (const m of matches) {
      const q = (m.quarters || []).find((x) => x.quarter_code === currentQuarterCode);
      if (q) {
        const name = q.quarter_name || `쿼터 ${q.quarter}`;
        return q.quarter_time ? `${name} (${q.quarter_time})` : name;
      }
    }
    return '-';
  }, [matches, currentQuarterCode, isLoading]);

  const selectedQuarterLabel = useMemo(() => {
    if (isLoading) return '쿼터 선택 안함';
    const q = matches.flatMap((m) => m.quarters || []).find((x) => x.quarter_code === selectedQuarterCode);
    if (q) {
      const name = q.quarter_name || `쿼터 ${q.quarter}`;
      return q.quarter_time ? `${name} (${q.quarter_time})` : name;
    }
    return '쿼터 선택 안함';
  }, [matches, selectedQuarterCode, isLoading]);

  const currentMatchLabel = useMemo(() => {
    if (isLoading) return '-';
    for (const m of matches) {
      if ((m.quarters || []).some((qq) => qq.quarter_code === currentQuarterCode)) {
        const dateText = m.match_date ? ` (${m.match_date})` : '';
        return `${m.match_name || ''}${dateText}`;
      }
    }
    return '-';
  }, [matches, currentQuarterCode, isLoading]);

  const selectedMatchLabel = useMemo(() => {
    const m = matches.find((x) => x.match_code === selectedMatch);
    if (!m) return '경기 선택 안함';
    const dateText = m.match_date ? ` (${m.match_date})` : '';
    return `${m.match_name || ''}${dateText}`;
  }, [matches, selectedMatch]);

  const quartersForSelectedMatch = useMemo(() => {
    if (!selectedMatch) return [];
    const m = matches.find((mm) => mm.match_code === selectedMatch);
    return m ? (m.quarters || []) : [];
  }, [matches, selectedMatch]);

  const handleConfirm = () => {
    if (!selectedQuarterCode) return;
    onChangeQuarter?.(selectedQuarterCode);
  };
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title="관련 경기 수정" size="md">
      <DSModal.Body>
        <div className="ds-detail">
          <div className="ds-detail__section">
            <h4 className="ds-detail__section-title">현재 연결</h4>
            <p className="text-body" style={{ marginBottom: '4px' }}>경기: {currentMatchLabel}</p>
            <p className="text-body">{currentQuarterLabel}</p>
          </div>
          <div className="ds-detail__section">
            <h4 className="ds-detail__section-title">경기 선택</h4>
            <button
              type="button"
              className="ds-select__button"
              onClick={() => setIsMatchModalOpen(true)}
            >
              <span className="ds-select__text">{selectedMatchLabel}</span>
              <span className="ds-select__icon">›</span>
            </button>
          </div>
          <div className="ds-detail__section">
            <h4 className="ds-detail__section-title">쿼터 선택</h4>
            <button
              type="button"
              className="ds-select__button"
              onClick={() => setIsQuarterModalOpen(true)}
              disabled={!selectedMatch}
            >
              <span className="ds-select__text">{selectedQuarterLabel}</span>
              <span className="ds-select__icon">›</span>
            </button>
          </div>
        </div>
      </DSModal.Body>
      <DSModal.Footer>
        <button className="cancel-btn" onClick={onClose}>취소</button>
        <button className="save-btn" onClick={handleConfirm} disabled={!selectedQuarterCode}>변경</button>
      </DSModal.Footer>
      <MatchSelectDSModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        matches={matches}
        selectedMatch={selectedMatch}
        onSelect={(code) => {
          setSelectedMatch(code);
          setSelectedQuarterCode('');
          setIsMatchModalOpen(false);
        }}
      />
      <QuarterSelectDSModal
        isOpen={isQuarterModalOpen}
        onClose={() => setIsQuarterModalOpen(false)}
        quarters={quartersForSelectedMatch}
        selectedQuarterCode={selectedQuarterCode}
        onSelect={(code) => {
          setSelectedQuarterCode(code);
          setIsQuarterModalOpen(false);
        }}
      />
    </DSModal>
  );
};

export default VideoChangeQuarterDSModal;


