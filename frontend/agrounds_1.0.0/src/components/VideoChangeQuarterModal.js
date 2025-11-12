import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 아이콘 import
import closeIcon from '../assets/common/x.png';
import downIcon from '../assets/main_icons/down_gray.png';

// API
import { GetUserQuartersApi } from '../function/api/video/videoApi';

const VideoChangeQuarterModal = ({ isOpen, onClose, onChangeQuarter, currentQuarterCode, videoTitle }) => {
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [matches, setMatches] = useState([]);
  const [allQuarters, setAllQuarters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuarters, setIsLoadingQuarters] = useState(false);
  const [showMatchDropdown, setShowMatchDropdown] = useState(false);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);

  // 쿼터 데이터 가져오기
  useEffect(() => {
    if (isOpen) {
      fetchQuarters();
    }
  }, [isOpen]);

  // 선택한 경기가 변경되면 쿼터 선택 초기화
  useEffect(() => {
    setSelectedQuarter('');
    setShowQuarterDropdown(false);
  }, [selectedMatch]);

  // 드롭다운 외부 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-dropdown')) {
        setShowMatchDropdown(false);
        setShowQuarterDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, showMatchDropdown, showQuarterDropdown]);

  const fetchQuarters = async () => {
    setIsLoadingQuarters(true);
    try {
      const userCode = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || 'u_1sb8j865530lmh';
      const response = await GetUserQuartersApi(userCode);
      
      console.log('쿼터 API 응답:', response.data);
      
      if (response.data.success) {
        const quarters = response.data.data?.quarters || response.data.quarters || [];
        console.log('받아온 쿼터 목록:', quarters);
        setAllQuarters(quarters);
        
        // 경기별로 그룹화
        const matchMap = new Map();
        quarters.forEach(quarter => {
          const matchCode = quarter.match_code;
          if (!matchMap.has(matchCode)) {
            matchMap.set(matchCode, {
              match_code: matchCode,
              match_name: quarter.match_name,
              match_date: quarter.match_date || quarter.quarter_date,
              quarters: []
            });
          }
          matchMap.get(matchCode).quarters.push(quarter);
        });
        
        const matchList = Array.from(matchMap.values());
        console.log('경기별로 그룹화된 목록:', matchList);
        setMatches(matchList);
        
        // 현재 쿼터가 있으면 해당 경기를 자동 선택
        if (currentQuarterCode) {
          const currentQuarter = quarters.find(q => q.quarter_code === currentQuarterCode);
          if (currentQuarter) {
            setSelectedMatch(currentQuarter.match_code);
            setSelectedQuarter(currentQuarterCode);
          }
        }
      }
    } catch (error) {
      console.error('쿼터 데이터 로드 실패:', error);
    }
    setIsLoadingQuarters(false);
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedQuarter) {
      alert('쿼터를 선택해주세요.');
      return;
    }
    
    // 현재 쿼터와 같으면 변경하지 않음
    if (selectedQuarter === currentQuarterCode) {
      alert('동일한 쿼터입니다.');
      return;
    }
    
    setIsLoading(true);
    try {
      await onChangeQuarter(selectedQuarter);
      setSelectedMatch('');
      setSelectedQuarter('');
      onClose();
    } catch (error) {
      console.error('쿼터 변경 실패:', error);
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setSelectedMatch('');
    setSelectedQuarter('');
    onClose();
  };

  // 선택한 경기의 쿼터 목록 가져오기
  const getQuartersForSelectedMatch = () => {
    if (!selectedMatch) return [];
    const match = matches.find(m => m.match_code === selectedMatch);
    return match ? match.quarters : [];
  };

  // 경기 선택 핸들러
  const handleMatchSelect = (matchCode) => {
    setSelectedMatch(matchCode);
    setShowMatchDropdown(false);
  };

  // 쿼터 선택 핸들러
  const handleQuarterSelect = (quarterCode) => {
    setSelectedQuarter(quarterCode);
    setShowQuarterDropdown(false);
  };

  // 선택된 경기 이름 가져오기
  const getSelectedMatchName = () => {
    if (!selectedMatch) return '경기를 선택해주세요';
    const match = matches.find(m => m.match_code === selectedMatch);
    return match ? `${match.match_name} (${match.match_date})` : '경기를 선택해주세요';
  };

  // 선택된 쿼터 이름 가져오기
  const getSelectedQuarterName = () => {
    if (!selectedQuarter) return '쿼터를 선택해주세요';
    const quarters = getQuartersForSelectedMatch();
    const quarter = quarters.find(q => q.quarter_code === selectedQuarter);
    if (quarter) {
      return `${quarter.quarter_name || `쿼터 ${quarter.quarter}`}${quarter.quarter_time ? ` (${quarter.quarter_time})` : ''}`;
    }
    return '쿼터를 선택해주세요';
  };

  // 쿼터 연결 해제 (빈 문자열로 변경)
  const handleRemoveQuarter = async () => {
    if (!currentQuarterCode) {
      alert('연결된 쿼터가 없습니다.');
      return;
    }
    
    setIsLoading(true);
    try {
      await onChangeQuarter(''); // 빈 문자열로 전달하여 연결 해제
      setSelectedMatch('');
      setSelectedQuarter('');
      onClose();
    } catch (error) {
      console.error('쿼터 연결 해제 실패:', error);
    }
    setIsLoading(false);
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3 className="text-h4">쿼터 변경</h3>
          <CloseButton onClick={handleClose}>
            <img src={closeIcon} alt="닫기" />
          </CloseButton>
        </ModalHeader>
        
        <ChangeForm>
          {videoTitle && (
            <VideoInfo>
              <VideoLabel>영상</VideoLabel>
              <VideoName>{videoTitle}</VideoName>
            </VideoInfo>
          )}
          
          {currentQuarterCode && (
            <CurrentQuarterInfo>
              <InfoLabel>현재 연결된 쿼터</InfoLabel>
              <InfoValue>
                {allQuarters.find(q => q.quarter_code === currentQuarterCode)?.match_name || '알 수 없음'} - {' '}
                {allQuarters.find(q => q.quarter_code === currentQuarterCode)?.quarter_name || currentQuarterCode}
              </InfoValue>
            </CurrentQuarterInfo>
          )}
          
          <RelatedMatchSection>
            <h4 className="text-h4">새 쿼터 선택</h4>
            {isLoadingQuarters ? (
              <div className="loading-text">쿼터 목록을 불러오는 중...</div>
            ) : (
              <>
                {/* 1단계: 경기 선택 */}
                <StepLabel>1. 경기를 선택해주세요</StepLabel>
                <CustomDropdown className="custom-dropdown">
                  <DropdownButton
                    onClick={() => !isLoading && matches.length > 0 && setShowMatchDropdown(!showMatchDropdown)}
                    disabled={isLoading || matches.length === 0}
                    $hasValue={!!selectedMatch}
                  >
                    <DropdownText>{getSelectedMatchName()}</DropdownText>
                    <DropdownIcon src={downIcon} alt="선택" $isOpen={showMatchDropdown} />
                  </DropdownButton>
                  {showMatchDropdown && (
                    <DropdownMenu>
                      {matches.map((match) => (
                        <DropdownOption
                          key={match.match_code}
                          onClick={() => handleMatchSelect(match.match_code)}
                          $isActive={selectedMatch === match.match_code}
                        >
                          {match.match_name} ({match.match_date})
                        </DropdownOption>
                      ))}
                    </DropdownMenu>
                  )}
                </CustomDropdown>
                
                {/* 2단계: 쿼터 선택 (경기가 선택된 경우에만 표시) */}
                {selectedMatch && (
                  <>
                    <StepLabel>2. 쿼터를 선택해주세요</StepLabel>
                    <CustomDropdown className="custom-dropdown">
                      <DropdownButton
                        onClick={() => !isLoading && setShowQuarterDropdown(!showQuarterDropdown)}
                        disabled={isLoading}
                        $hasValue={!!selectedQuarter}
                      >
                        <DropdownText>{getSelectedQuarterName()}</DropdownText>
                        <DropdownIcon src={downIcon} alt="선택" $isOpen={showQuarterDropdown} />
                      </DropdownButton>
                      {showQuarterDropdown && (
                        <DropdownMenu>
                          {getQuartersForSelectedMatch().map((quarter) => (
                            <DropdownOption
                              key={quarter.quarter_code}
                              onClick={() => handleQuarterSelect(quarter.quarter_code)}
                              $isActive={selectedQuarter === quarter.quarter_code}
                            >
                              {quarter.quarter_name || `쿼터 ${quarter.quarter}`}
                              {quarter.quarter_time && ` (${quarter.quarter_time})`}
                            </DropdownOption>
                          ))}
                        </DropdownMenu>
                      )}
                    </CustomDropdown>
                  </>
                )}
                
                {/* 쿼터가 없는 경우 안내 메시지 */}
                {!isLoadingQuarters && matches.length === 0 && (
                  <EmptyMessage>
                    아직 분석된 경기가 없습니다.<br />
                    경기 분석 후 쿼터를 연결할 수 있습니다.
                  </EmptyMessage>
                )}
              </>
            )}
          </RelatedMatchSection>
          
          <ButtonGroup>
            {currentQuarterCode && (
              <RemoveButton onClick={handleRemoveQuarter} disabled={isLoading}>
                연결해제
              </RemoveButton>
            )}
            <SecondaryButton onClick={handleClose} disabled={isLoading}>
              취소
            </SecondaryButton>
            <PrimaryButton 
              onClick={handleSubmit}
              disabled={!selectedQuarter || isLoading}
            >
              {isLoading ? '변경 중...' : '변경하기'}
            </PrimaryButton>
          </ButtonGroup>
        </ChangeForm>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: var(--spacing-lg);
  overflow: hidden;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 499px;
  background: var(--bg-surface);
  border-radius: 16px;
  padding: var(--spacing-xl);
  margin: 0;
  animation: fadeIn 0.3s ease-out;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--border);
  position: relative;

  h3 {
    margin: 0;
    color: var(--text-primary);
    font-family: var(--font-text);
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    flex: 1;
    padding-right: 48px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s;
  min-width: 44px;
  min-height: 44px;
  width: 48px;
  height: 48px;
  font-size: 28px;
  color: var(--text-disabled);

  &:hover {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  img {
    width: 24px;
    height: 24px;
    opacity: 0.6;
  }
`;

const ChangeForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const VideoInfo = styled.div`
  padding: var(--spacing-lg);
  background: var(--bg-primary);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const VideoLabel = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-text);
`;

const VideoName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-text);
`;

const CurrentQuarterInfo = styled.div`
  padding: var(--spacing-lg);
  background: rgba(7, 150, 105, 0.08);
  border-radius: 12px;
  border: 1px solid var(--primary);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: var(--primary-hover);
  font-weight: 600;
  font-family: var(--font-text);
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: var(--text-primary);
  font-family: var(--font-text);
`;

const CustomDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 16px;
  font-family: var(--font-text);
  color: ${props => props.$hasValue ? 'var(--text-primary)' : 'var(--text-disabled)'};
  background: var(--bg-surface);
  transition: all 0.2s ease;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;

  &:hover:not(:disabled) {
    border-color: var(--primary);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(7, 150, 105, 0.1);
  }

  &:disabled {
    background-color: var(--bg-primary);
    color: var(--text-disabled);
    cursor: not-allowed;
    border-color: var(--border);
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const DropdownText = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropdownIcon = styled.img`
  width: 16px;
  height: 16px;
  opacity: 0.6;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  flex-shrink: 0;
  margin-left: 12px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--bg-surface);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: var(--spacing-sm);
  max-height: 280px;
  overflow-y: auto;
  z-index: 100;
  border: 1px solid var(--border);

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--bg-primary);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--text-disabled);
    border-radius: 3px;

    &:hover {
      background: var(--text-secondary);
    }
  }
`;

const DropdownOption = styled.button`
  width: 100%;
  padding: var(--spacing-md);
  border: none;
  background: ${props => props.$isActive ? 'var(--primary)' : 'transparent'};
  color: ${props => props.$isActive ? 'var(--bg-surface)' : 'var(--text-primary)'};
  font-family: var(--font-text);
  font-size: 14px;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover {
    background: ${props => props.$isActive ? 'var(--primary)' : 'var(--bg-primary)'};
  }

  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
`;

const RelatedMatchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);

  h4 {
    margin: 0;
    color: var(--text-primary);
    font-size: 18px;
    font-weight: 600;
    font-family: var(--font-text);
  }

  .loading-text {
    padding: var(--spacing-lg);
    text-align: center;
    color: var(--text-disabled);
    font-size: 14px;
    font-family: var(--font-text);
  }
`;

const StepLabel = styled.div`
  margin-top: var(--spacing-sm);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-text);
`;

const EmptyMessage = styled.div`
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  background: var(--bg-primary);
  border-radius: 12px;
  margin-top: var(--spacing-sm);
  font-family: var(--font-text);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border);
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 12px var(--spacing-lg);
  background: var(--primary);
  color: var(--bg-surface);
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-text);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  &:disabled {
    background: var(--text-disabled);
    color: var(--bg-surface);
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 12px var(--spacing-lg);
  background: var(--bg-surface);
  color: var(--text-secondary);
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-text);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary);
    background: #F0FDF4;
  }

  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  &:disabled {
    background: var(--bg-primary);
    color: var(--text-disabled);
    border-color: var(--border);
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  flex: 1;
  padding: 12px var(--spacing-lg);
  background: var(--bg-surface);
  color: var(--error);
  border: 2px solid var(--error);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-text);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover:not(:disabled) {
    background: var(--error);
    color: var(--bg-surface);
  }

  &:focus {
    outline: 2px solid var(--error);
    outline-offset: 2px;
  }

  &:disabled {
    background: var(--bg-primary);
    color: var(--text-disabled);
    border-color: var(--border);
    cursor: not-allowed;
  }
`;

export default VideoChangeQuarterModal;

