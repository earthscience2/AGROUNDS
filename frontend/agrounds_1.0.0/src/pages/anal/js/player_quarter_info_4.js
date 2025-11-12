import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoBellNav from '../../../components/Logo_bell_Nav';
import '../css/player_quarter_info_4.scss';
import { GetS3RawFileContentApi } from '../../../function/api/upload/uploadApi';
import client from '../../../client';
import Delete from '../../../assets/identify_icon/delete.png';
import DownIcon from '../../../assets/main_icons/down_gray.png';
import ClockBlack from '../../../assets/main_icons/clock_black.png';

const PlayerQuarterInfo4 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 이전 페이지에서 전달받은 데이터
  const selectedFile = location.state?.selectedFile;
  const selectedGround = location.state?.selectedGround;
  const selectedRestArea = location.state?.selectedRestArea;
  
  // 쿼터 목록 상태
  const [quarters, setQuarters] = useState([]);
  
  // 쿼터 입력 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuarter, setEditingQuarter] = useState(null);
  
  // 모달 내 입력 상태
  const [quarterName, setQuarterName] = useState('');
  const [gameDate, setGameDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD 형식
  const [gameStartTime, setGameStartTime] = useState('11:00');
  const [gameEndTime, setGameEndTime] = useState('12:30');
  const [isPlaying, setIsPlaying] = useState(true);
  const [homePosition, setHomePosition] = useState('미선택'); // '왼쪽', '오른쪽', '미선택'
  const [showDateEdit, setShowDateEdit] = useState(false); // 날짜 편집 모드
  
  // 시간 선택 팝업 상태
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [activeTimePicker, setActiveTimePicker] = useState(null);
  const [selectedHour, setSelectedHour] = useState(11);
  const [selectedMinute, setSelectedMinute] = useState(0);
  
  // 경기 이름 입력 모달 상태
  const [matchNameModalOpen, setMatchNameModalOpen] = useState(false);
  const [matchName, setMatchName] = useState('');
  
  // 자동입력 관련 상태
  const [autoFillModalOpen, setAutoFillModalOpen] = useState(false);
  const [numQuarters, setNumQuarters] = useState(4);
  const [autoFilling, setAutoFilling] = useState(false);
  
  // 데이터의 실제 시작/종료 시간 (검증용)
  const [dataStartTime, setDataStartTime] = useState(null);
  const [dataEndTime, setDataEndTime] = useState(null);
  
  const getMinuteBoundary = (date, mode = 'floor') => {
    if (!date) return null;
    const boundary = new Date(date.getTime());
    boundary.setSeconds(0, 0);
    
    if (
      mode === 'ceil' && 
      (date.getSeconds() > 0 || date.getMilliseconds() > 0)
    ) {
      boundary.setMinutes(boundary.getMinutes() + 1);
    }
    
    return boundary;
  };
  
  // 뒤로가기
  const handleBack = () => {
    navigate('/app/anal/rest-area-selection', {
      state: { selectedFile, selectedGround, selectedRestArea }
    });
  };
  
  // 모달 열기 (새 쿼터 추가)
  const openAddModal = () => {
    resetModalForm();
    setEditingQuarter(null);
    setModalOpen(true);
  };
  
  // 모달 열기 (쿼터 수정)
  const openEditModal = (quarter) => {
    setQuarterName(quarter.name);
    setGameDate(quarter.gameDate || new Date().toISOString().split('T')[0]);
    setGameStartTime(quarter.gameStartTime);
    setGameEndTime(quarter.gameEndTime);
    setIsPlaying(quarter.isPlaying);
    setHomePosition(quarter.homePosition);
    setEditingQuarter(quarter);
    setShowDateEdit(false);
    setModalOpen(true);
  };
  
  // 모달 닫기
  const closeModal = () => {
    setModalOpen(false);
    setEditingQuarter(null);
    resetModalForm();
  };
  
  // 모달 폼 초기화
  const resetModalForm = () => {
    setQuarterName(`${quarters.length + 1}쿼터`);
    setGameDate(new Date().toISOString().split('T')[0]);
    setGameStartTime('11:00');
    setGameEndTime('12:30');
    setIsPlaying(true);
    setHomePosition('미선택');
    setShowDateEdit(false);
  };
  
  // 시간 배열 생성 (무한 루프 효과를 위해 3번 반복)
  const baseHours = Array.from({length: 24}, (_, i) => i);
  const baseMinutes = Array.from({length: 60}, (_, i) => i);
  
  // 3번 반복하여 순환 효과
  const hours = [...baseHours, ...baseHours, ...baseHours];
  const minutes = [...baseMinutes, ...baseMinutes, ...baseMinutes];
  
  // 디바운싱을 위한 ref
  const hourScrollRef = useRef(null);
  const minuteScrollRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  
  // 쿼터 삭제
  const deleteQuarter = (quarterId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setQuarters(quarters.filter(q => q.id !== quarterId));
    }
  };
  
  // 출전 여부 토글
  const togglePlayingStatus = (status) => {
    setIsPlaying(status);
    // 미출전으로 변경하면 홈 진영과 날짜/시간 입력을 초기화/비활성화
    if (!status) {
      setHomePosition('미선택');
      setShowDateEdit(false);
      setTimePickerOpen(false);
      setActiveTimePicker(null);
    }
  };
  
  // 홈 진영 선택
  const selectHomePosition = (position) => {
    setHomePosition(position);
  };
  
  // 시간 선택 팝업 열기
  const openTimePicker = (timeType) => {
    if (!isPlaying) {
      return;
    }

    let currentTime;
    if (timeType === 'gameStartTime') {
      currentTime = gameStartTime;
    } else if (timeType === 'gameEndTime') {
      currentTime = gameEndTime;
    }
    
    const [hour, minute] = currentTime.split(':').map(Number);
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setActiveTimePicker(timeType);
    setTimePickerOpen(true);
  };
  
  // 스크롤 이벤트 핸들러 (디바운싱 적용)
  const handleHourScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const itemHeight = 40;
    const selectedIndex = Math.round(scrollTop / itemHeight);
    const newHour = selectedIndex % 24; // 0-23 범위로 순환
    
    // 실제 값이 변경될 때만 업데이트
    if (newHour !== selectedHour) {
      setSelectedHour(newHour);
    }
    
    // 아이템에 스타일 클래스 적용
    updateWheelItemStyles(e.target, selectedIndex);
  };
  
  const handleMinuteScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const itemHeight = 40;
    const selectedIndex = Math.round(scrollTop / itemHeight);
    const newMinute = selectedIndex % 60; // 0-59 범위로 순환
    
    // 실제 값이 변경될 때만 업데이트
    if (newMinute !== selectedMinute) {
      setSelectedMinute(newMinute);
    }
    
    // 아이템에 스타일 클래스 적용
    updateWheelItemStyles(e.target, selectedIndex);
  };
  
  // 휠 아이템 스타일 업데이트
  const updateWheelItemStyles = (scrollElement, selectedIndex) => {
    const items = scrollElement.querySelectorAll('.wheel-item');
    
    items.forEach((item, index) => {
      // 모든 클래스 제거
      item.classList.remove('selected', 'adjacent-selected', 'near-selected');
      
      const distance = Math.abs(index - selectedIndex);
      
      if (distance === 0) {
        // 선택된 아이템
        item.classList.add('selected');
      } else if (distance === 1) {
        // 바로 위아래 아이템
        item.classList.add('adjacent-selected');
      } else if (distance === 2) {
        // 그 다음 아이템
        item.classList.add('near-selected');
      }
    });
  };
  
  // 스크롤 위치 설정 (중간 세트로 시작하여 위아래 스크롤 가능)
  const setScrollPosition = () => {
    if (hourScrollRef.current && timePickerOpen) {
      // 두 번째 세트의 해당 시간으로 스크롤 (24개 + selectedHour)
      const hourIndex = 24 + selectedHour;
      const hourScrollTop = hourIndex * 40;
      hourScrollRef.current.scrollTop = hourScrollTop;
      // 초기 스타일 적용
      updateWheelItemStyles(hourScrollRef.current, hourIndex);
    }
    if (minuteScrollRef.current && timePickerOpen) {
      // 두 번째 세트의 해당 분으로 스크롤 (60개 + selectedMinute)
      const minuteIndex = 60 + selectedMinute;
      const minuteScrollTop = minuteIndex * 40;
      minuteScrollRef.current.scrollTop = minuteScrollTop;
      // 초기 스타일 적용
      updateWheelItemStyles(minuteScrollRef.current, minuteIndex);
    }
  };
  
  // 모달이 열릴 때 스크롤 위치 설정
  useEffect(() => {
    if (timePickerOpen) {
      // 애니메이션 없이 즉시 스크롤 위치 설정
      requestAnimationFrame(() => {
        setScrollPosition();
      });
    }
  }, [timePickerOpen]);
  
  // 시간 선택 확인
  const handleTimeConfirm = () => {
    const selectedMinutes = selectedHour * 60 + selectedMinute;
    const timeString = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    
    if (activeTimePicker === 'gameStartTime') {
      // 시작 시간 변경: 종료 시간과 비교
      const [endHour, endMinute] = gameEndTime.split(':').map(Number);
      const endMinutes = endHour * 60 + endMinute;
      
      // 같은 시간은 불가
      if (selectedMinutes === endMinutes) {
        alert('시작 시간과 종료 시간이 같을 수 없습니다.');
        return;
      }
      
      // 종료가 시작보다 작은 경우 (다음날로 넘어감)
      if (endMinutes < selectedMinutes) {
        // 시작 시간이 저녁(18:00 이후)이고 종료 시간이 새벽(06:00 이전)일 때만 허용
        if (selectedHour >= 18 && endHour < 6) {
          // 다음날로 넘어가는 정상 케이스
          setGameStartTime(timeString);
        } else {
          alert('시작 시간이 종료 시간보다 늦습니다.\n다음날로 넘어가려면 시작은 18:00 이후, 종료는 06:00 이전이어야 합니다.');
          return;
        }
      } else {
        // 같은 날: 시작 < 종료 (정상)
        setGameStartTime(timeString);
      }
      
    } else if (activeTimePicker === 'gameEndTime') {
      // 종료 시간 변경: 시작 시간과 비교
      const [startHour, startMinute] = gameStartTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;
      
      // 같은 시간은 불가
      if (selectedMinutes === startMinutes) {
        alert('종료 시간과 시작 시간이 같을 수 없습니다.');
        return;
      }
      
      // 종료가 시작보다 작은 경우 (다음날로 넘어감)
      if (selectedMinutes < startMinutes) {
        // 시작 시간이 저녁(18:00 이후)이고 종료 시간이 새벽(06:00 이전)일 때만 허용
        if (startHour >= 18 && selectedHour < 6) {
          // 다음날로 넘어가는 정상 케이스
          setGameEndTime(timeString);
        } else {
          alert('종료 시간이 시작 시간보다 빠릅니다.\n다음날로 넘어가려면 시작은 18:00 이후, 종료는 06:00 이전이어야 합니다.');
          return;
        }
      } else {
        // 같은 날: 시작 < 종료 (정상)
        setGameEndTime(timeString);
      }
    }
    
    setTimePickerOpen(false);
    setActiveTimePicker(null);
  };
  
  // 시간 선택 취소
  const handleTimeCancel = () => {
    setTimePickerOpen(false);
    setActiveTimePicker(null);
  };
  
  // 쿼터 저장
  const saveQuarter = () => {
    // 유효성 검사
    if (!quarterName.trim()) {
      alert('쿼터 이름을 입력해주세요.');
      return;
    }
    
    // 출전인데 홈 진영 미선택인 경우
    if (isPlaying && homePosition === '미선택') {
      alert('출전 상태에서는 홈 진영을 선택해주세요.');
      return;
    }
    
    // 시간 유효성 검사 (다음날로 넘어가는 경우 고려)
    if (isPlaying) {
      const [startHour, startMinute] = gameStartTime.split(':').map(Number);
      const [endHour, endMinute] = gameEndTime.split(':').map(Number);
      const gameStartMinutes = startHour * 60 + startMinute;
      const gameEndMinutes = endHour * 60 + endMinute;
      
      if (gameStartMinutes === gameEndMinutes) {
        alert('경기 시작 시간과 종료 시간이 같을 수 없습니다.');
        return;
      }
      
      const timeDiff = gameEndMinutes - gameStartMinutes;
      
      if (timeDiff < 0 && timeDiff < -720) {
        alert('경기 시간을 확인해주세요. 종료 시간이 시작 시간보다 12시간 이상 이전일 수 없습니다.');
        return;
      }
    }
    
    // 저장 시에는 기본 검증만 수행 (쿼터 간 겹침은 분석 시작 시 검증)
    
    const quarterData = {
      id: editingQuarter ? editingQuarter.id : Date.now(),
      name: quarterName,
      gameDate,
      gameStartTime,
      gameEndTime,
      isPlaying,
      homePosition
    };
    
    if (editingQuarter) {
      // 수정
      setQuarters(quarters.map(q => q.id === editingQuarter.id ? quarterData : q));
    } else {
      // 추가
      setQuarters([...quarters, quarterData]);
    }
    
    closeModal();
  };
  
  // 다음 단계로
  const handleNext = () => {
    if (quarters.length === 0) {
      alert('최소 1개의 쿼터를 추가해주세요.');
      return;
    }
    
    navigate('/app/anal/player-lineup', {
      state: {
        selectedFile,
        selectedGround,
        selectedRestArea,
        quarterInfo: quarters
      }
    });
  };
  
  // 분석 시작 버튼 클릭
  const handleStartAnalysis = () => {
    if (quarters.length === 0) {
      alert('최소 1개의 쿼터를 추가해주세요.');
      return;
    }
    
    // 출전하면서 홈 진영 미선택인 쿼터 확인
    const invalidQuarter = quarters.find(q => q.isPlaying && q.homePosition === '미선택');
    if (invalidQuarter) {
      alert(`${invalidQuarter.name}의 홈 진영을 선택해주세요.\n출전 상태에서는 홈 진영 선택이 필수입니다.`);
      return;
    }
    
    const playingQuarters = quarters.filter(q => q.isPlaying);
    if (playingQuarters.length === 0) {
      alert('최소 1개의 출전 쿼터가 필요합니다.');
      return;
    }
    
    const firstPlayingIndex = quarters.findIndex(q => q.isPlaying);
    const lastPlayingIndex = quarters.reduce((lastIndex, q, idx) => (q.isPlaying ? idx : lastIndex), -1);
    let previousPlayingQuarter = null;
    
    // 쿼터 시간 겹침 검증 (목록 순서대로)
    for (let i = 0; i < quarters.length; i++) {
      const currentQuarter = quarters[i];
      
      if (!currentQuarter.isPlaying) {
        continue;
      }
      
      if (previousPlayingQuarter) {
        const prevEndDateTime = new Date(`${previousPlayingQuarter.gameDate}T${previousPlayingQuarter.gameEndTime}`);
        const currentStartDateTime = new Date(`${currentQuarter.gameDate}T${currentQuarter.gameStartTime}`);
        
        if (currentStartDateTime < prevEndDateTime) {
          alert(`${currentQuarter.name}의 시작 시간(${currentQuarter.gameStartTime})이 ${previousPlayingQuarter.name}의 종료 시간(${previousPlayingQuarter.gameEndTime})보다 빠릅니다.\n쿼터 시간을 확인해주세요.`);
          return;
        }
      }
      
      if (i === firstPlayingIndex && dataStartTime) {
        const currentStartDateTime = new Date(`${currentQuarter.gameDate}T${currentQuarter.gameStartTime}`);
        const dataStartBoundary = getMinuteBoundary(dataStartTime, 'floor');
        
        if (dataStartBoundary && currentStartDateTime < dataStartBoundary) {
          alert(`첫 번째 출전 쿼터(${currentQuarter.name})의 시작 시간은 데이터의 시작 시간(${dataStartBoundary.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })})보다 빠를 수 없습니다.`);
          return;
        }
      }
      
      if (i === lastPlayingIndex && dataEndTime) {
        const currentEndDateTime = new Date(`${currentQuarter.gameDate}T${currentQuarter.gameEndTime}`);
        const dataEndBoundary = getMinuteBoundary(dataEndTime, 'ceil');
        
        if (dataEndBoundary && currentEndDateTime > dataEndBoundary) {
          alert(`마지막 출전 쿼터(${currentQuarter.name})의 종료 시간은 데이터의 종료 시간(${dataEndBoundary.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })})보다 늦을 수 없습니다.`);
          return;
        }
      }
      
      previousPlayingQuarter = currentQuarter;
    }
    
    // 경기 이름 기본값 설정: 첫 번째 출전 쿼터 기준
    const firstPlayingQuarter = playingQuarters.find(q => q.gameDate);
    if (firstPlayingQuarter) {
      const date = new Date(firstPlayingQuarter.gameDate);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      setMatchName(`${month}월 ${day}일 경기`);
    } else {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      setMatchName(`${month}월 ${day}일 경기`);
    }
    
    // 경기 이름 입력 모달 열기
    setMatchNameModalOpen(true);
  };
  
  // 경기 이름 입력 모달 닫기
  const closeMatchNameModal = () => {
    setMatchNameModalOpen(false);
  };
  
  // 자동입력 모달 열기
  const openAutoFillModal = () => {
    setAutoFillModalOpen(true);
  };
  
  // 자동입력 모달 닫기
  const closeAutoFillModal = () => {
    setAutoFillModalOpen(false);
    setNumQuarters(4);
  };
  
  // 쿼터 수 증가
  const increaseQuarters = () => {
    if (numQuarters < 10) {
      setNumQuarters(numQuarters + 1);
    }
  };
  
  // 쿼터 수 감소
  const decreaseQuarters = () => {
    if (numQuarters > 1) {
      setNumQuarters(numQuarters - 1);
    }
  };
  
  // 자동입력 실행
  const handleAutoFill = async () => {
    if (!selectedFile) {
      alert('파일 정보가 없습니다.');
      return;
    }
    
    if (numQuarters < 1 || numQuarters > 10) {
      alert('쿼터 수는 1~10 사이로 입력해주세요.');
      return;
    }
    
    try {
      setAutoFilling(true);
      
      // 1. GPS 파일 내용 읽기
      const uploadCode = selectedFile.upload_code || selectedFile.rawData?.upload_code;
      if (!uploadCode) {
        throw new Error('업로드 코드를 찾을 수 없습니다.');
      }

      // 파일 다운로드 URL 가져오기
      const urlResponse = await client.get('/api/user/file-download/', {
        params: { upload_code: uploadCode }
      });

      if (!urlResponse.data || !urlResponse.data.s3_key) {
        throw new Error('파일 경로를 가져올 수 없습니다.');
      }

      let s3Key = urlResponse.data.s3_key;

      // player/edit 경로 확보 (CSV 파일용)
      if (!s3Key.includes('player/edit')) {
        if (s3Key.includes('player/raw')) {
          s3Key = s3Key.replace('player/raw', 'player/edit');
        } else {
          s3Key = s3Key.replace(/\/([^\/]+)$/, '/player/edit/$1');
        }
      }
      
      // 파일 내용 가져오기
      const response = await GetS3RawFileContentApi(s3Key);
      const fileContentString = response.data.content;

      if (!fileContentString) {
        throw new Error('파일 내용을 읽을 수 없습니다.');
      }

      // 2. CSV 파일 파싱 - 시간 정보 추출 (최적화: 첫/마지막 timestamp만 필요)
      const lines = fileContentString.split('\n').filter(line => line.trim());
      
      // timestamp 파싱 헬퍼 함수
      const parseTimestamp = (timestampStr) => {
        const timeParts = timestampStr.split('.');
        if (timeParts.length < 6) return null;
        
        const year = parseInt(timeParts[0]);
        const month = parseInt(timeParts[1]) - 1;
        const day = parseInt(timeParts[2]);
        const hour = parseInt(timeParts[3]);
        const minute = parseInt(timeParts[4]);
        const second = parseInt(timeParts[5]);
        const millisecond = timeParts.length > 6 ? parseInt(timeParts[6]) : 0;
        
        const dt = new Date(year, month, day, hour, minute, second, millisecond);
        return !isNaN(dt.getTime()) ? dt : null;
      };

      // 첫 번째 유효한 timestamp 찾기
      let startTime = null;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
          const parts = line.trim().split(',');
          
          // 헤더 줄 건너뛰기
          if (i === 0 && parts[0] === 'device_id') continue;
          if (parts.length < 2) continue;

          const dt = parseTimestamp(parts[1]);
          if (dt) {
            startTime = dt;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      // 마지막 유효한 timestamp 찾기 (역순으로 검색)
      let endTime = null;
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
          const parts = line.trim().split(',');
          if (parts.length < 2) continue;

          const dt = parseTimestamp(parts[1]);
          if (dt) {
            endTime = dt;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      if (!startTime || !endTime) {
        throw new Error('유효한 시간 데이터가 없습니다.');
      }
      
      // 데이터의 시작/종료 시간 저장 (검증용)
      setDataStartTime(startTime);
      setDataEndTime(endTime);

      const totalDuration = endTime - startTime;

      // 5분 버퍼(시작/종료) 및 쿼터 간 휴식 시간 적용
      const bufferMinutes = 5;
      const bufferMs = bufferMinutes * 60 * 1000;
      const requiredGap = bufferMs * (numQuarters + 1); // 시작 5분, 종료 5분, 쿼터 사이 5분씩

      if (totalDuration <= requiredGap) {
        throw new Error('경기 시간이 충분하지 않습니다. 쿼터 수를 줄이거나 데이터를 확인해주세요.');
      }

      const effectiveDuration = totalDuration - requiredGap;

      // 3. 쿼터별 시간 계산 (버퍼를 제외한 시간만 균등 분할)
      const quarterDuration = effectiveDuration / numQuarters;
      const newQuarters = [];

      let currentQuarterStart = new Date(startTime.getTime() + bufferMs);

      for (let i = 0; i < numQuarters; i++) {
        const quarterStart = new Date(currentQuarterStart.getTime());
        const quarterEnd = new Date(currentQuarterStart.getTime() + quarterDuration);

        // 다음 쿼터 시작 시간(휴식 포함) 계산
        currentQuarterStart = new Date(quarterEnd.getTime() + bufferMs);

        const formatTime = (date) => {
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${hours}:${minutes}`;
        };
        
        // 로컬 날짜 사용 (UTC 변환 없이)
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        newQuarters.push({
          id: Date.now() + i,
          name: `${i + 1}쿼터`,
          gameDate: formatDate(quarterStart), // 로컬 날짜 사용 (타임존 변환 없음)
          gameStartTime: formatTime(quarterStart),
          gameEndTime: formatTime(quarterEnd),
          isPlaying: true,
          homePosition: '미선택'
        });
      }

      // 4. 쿼터 목록 업데이트
      setQuarters(newQuarters);
      
      closeAutoFillModal();

    } catch (error) {
      alert(`자동입력 실패: ${error.message}`);
    } finally {
      setAutoFilling(false);
    }
  };
  
  // 실제 분석 시작
  const startAnalysis = () => {
    // 경기 이름 유효성 검사
    if (!matchName.trim()) {
      alert('경기 이름을 입력해주세요.');
      return;
    }
    
    // 파일 코드 (Upload 모델의 upload_code 기준)
    const fileKey = selectedFile?.upload_code || selectedFile?.rawData?.upload_code || null;
    
    // 경기장 정보
    const groundKey = selectedGround?.ground_code || null;
    const groundName = selectedGround?.name || '미선택';
    
    // 휴식 위치
    const restArea = selectedRestArea || null;
    
    // 유저 코드 (로그인한 유저)
    const userKey = sessionStorage.getItem('userCode') || localStorage.getItem('user_code') || null;
    
    // 쿼터 정보
    const quartersInfo = quarters.map(quarter => ({
      name: quarter.name,
      game_date: quarter.gameDate,
      start_time: quarter.gameStartTime,
      end_time: quarter.gameEndTime,
      is_playing: quarter.isPlaying,
      home_position: quarter.homePosition
    }));

    // Lambda 분석용 JSON 구조
    const analysisPayload = {
      user_code: userKey,
      upload_code: fileKey,
      ground_code: groundKey,
      rest_area_position: restArea,
      match_name: matchName, // 경기 이름 추가
      quarters: quartersInfo.map((quarter, index) => ({
        quarter_number: index + 1,
        quarter_name: quarter.name,
        game_date: quarter.game_date, // 경기 날짜 추가
        start_time: quarter.start_time, // 시간만 전송 (HH:MM 형식)
        end_time: quarter.end_time,
        is_playing: quarter.is_playing,
        home_position: quarter.home_position // 백엔드 API 스펙에 맞춰 한글 그대로 전송
      })),
      metadata: {
        ground_name: groundName,
        file_name: selectedFile?.name || null,
        created_at: new Date().toISOString(),
        total_quarters: quartersInfo.length
      }
    };

    // 모달 닫기
    closeMatchNameModal();

    // 임시 matchCode 생성 (페이지 이동용)
    const tempMatchCode = `pending_${Date.now()}`;

    // 바로 분석 진행 페이지로 이동 (API 응답 기다리지 않음)
    navigate('/app/anal/progress', {
      state: {
        analysisResult: {
          success: true,
          message: '분석이 시작되었습니다.',
          pending: true
        },
        matchCode: tempMatchCode,
        matchName: matchName,
        lambdaStatus: 'invoked',
        analysisPayload: analysisPayload,
        selectedFile: selectedFile,
        selectedGround: selectedGround,
        quarterInfo: quarters
      }
    });

    // 백그라운드에서 API 호출 (fire and forget)
    client.post('/api/anal/start-analysis/', analysisPayload)
      .then(response => {
        // 실제 matchCode를 받으면 sessionStorage에 저장 (나중에 활용 가능)
        if (response.data.match_code) {
          sessionStorage.setItem('latest_match_code', response.data.match_code);
        }
      })
      .catch(error => {
        // 분석 시작 오류
      });
  };
  
  // 시간 포맷팅 (문자열이므로 그대로 반환)
  const formatTime = (timeString) => {
    return timeString;
  };
  
  // 필수 데이터 검증
  useEffect(() => {
    if (!selectedFile || !selectedGround || !selectedRestArea) {
      navigate('/app/anal/rest-area-selection');
      return;
    }
    
    // 데이터의 시작/종료 시간 로드
    loadDataTimeRange();
  }, [selectedFile, selectedGround, selectedRestArea, navigate]);
  
  // 데이터의 시작/종료 시간 범위 가져오기
  const loadDataTimeRange = async () => {
    try {
      const uploadCode = selectedFile.upload_code || selectedFile.rawData?.upload_code;
      if (!uploadCode) return;

      // 파일 다운로드 URL 가져오기
      const urlResponse = await client.get('/api/user/file-download/', {
        params: { upload_code: uploadCode }
      });

      if (!urlResponse.data || !urlResponse.data.s3_key) return;

      let s3Key = urlResponse.data.s3_key;

      // player/edit 경로 확보 (CSV 파일용)
      if (!s3Key.includes('player/edit')) {
        if (s3Key.includes('player/raw')) {
          s3Key = s3Key.replace('player/raw', 'player/edit');
        } else {
          s3Key = s3Key.replace(/\/([^\/]+)$/, '/player/edit/$1');
        }
      }
      
      // 파일 내용 가져오기
      const response = await GetS3RawFileContentApi(s3Key);
      const fileContentString = response.data.content;

      if (!fileContentString) return;

      // CSV 파일 파싱 - 시간 정보 추출
      const lines = fileContentString.split('\n').filter(line => line.trim());
      
      // timestamp 파싱 헬퍼 함수
      const parseTimestamp = (timestampStr) => {
        const timeParts = timestampStr.split('.');
        if (timeParts.length < 6) return null;
        
        const year = parseInt(timeParts[0]);
        const month = parseInt(timeParts[1]) - 1;
        const day = parseInt(timeParts[2]);
        const hour = parseInt(timeParts[3]);
        const minute = parseInt(timeParts[4]);
        const second = parseInt(timeParts[5]);
        const millisecond = timeParts.length > 6 ? parseInt(timeParts[6]) : 0;
        
        const dt = new Date(year, month, day, hour, minute, second, millisecond);
        return !isNaN(dt.getTime()) ? dt : null;
      };

      // 첫 번째 유효한 timestamp 찾기
      let startTime = null;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
          const parts = line.trim().split(',');
          
          // 헤더 줄 건너뛰기
          if (i === 0 && parts[0] === 'device_id') continue;
          if (parts.length < 2) continue;

          const dt = parseTimestamp(parts[1]);
          if (dt) {
            startTime = dt;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      // 마지막 유효한 timestamp 찾기
      let endTime = null;
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
          const parts = line.trim().split(',');
          if (parts.length < 2) continue;

          const dt = parseTimestamp(parts[1]);
          if (dt) {
            endTime = dt;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      if (startTime && endTime) {
        setDataStartTime(startTime);
        setDataEndTime(endTime);
      }
    } catch (error) {
      // 데이터 시간 범위 로드 실패
    }
  };
  
  // 첫 번째 쿼터 기본값 설정
  useEffect(() => {
    if (quarters.length === 0) {
      setQuarterName('1쿼터');
    } else {
      setQuarterName(`${quarters.length + 1}쿼터`);
    }
  }, [quarters.length]);
  
  return (
    <div className='player-quarter-info-4-page'>
      <LogoBellNav logo={true} />
      
      {/* 표준 헤더 구조 - player_data_select_1과 동일한 스타일 */}
      <div className="quarter-info-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack}>
              <img src={require('../../../assets/main_icons/back_black.png')} alt="뒤로가기" />
            </button>
            <button className="auto-fill-btn" onClick={openAutoFillModal} disabled={autoFilling}>
              자동입력
            </button>
          </div>
          <div className="header-content">
            <h1 className="text-h2">쿼터정보 입력</h1>
            <p className="subtitle text-body">쿼터별 정보를 입력해주세요</p>
          </div>
        </div>
      </div>
      
      {/* 쿼터 목록 섹션 */}
      <div className="quarters-section">
        {quarters.length > 0 ? (
          <div className="quarters-list">
            {quarters.map((quarter) => (
              <div 
                key={quarter.id} 
                className="quarter-card"
                onClick={() => openEditModal(quarter)}
                style={{ cursor: 'pointer' }}
              >
                <div className="quarter-header">
                  <div className="header-left">
                    <h3 className="quarter-title text-h3">{quarter.name}</h3>
                    <div className="status-badges">
                      <span className={`status-badge ${quarter.isPlaying ? 'playing' : 'not-playing'}`}>
                        {quarter.isPlaying ? '출전' : '미출전'}
                      </span>
                      {quarter.isPlaying && quarter.homePosition !== '미선택' && (
                        <span className="position-badge">
                          {quarter.homePosition}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuarter(quarter.id);
                    }}
                    aria-label="쿼터 삭제"
                  >
                    <img src={Delete} alt="삭제" className="action-icon" />
                  </button>
                </div>
                
                <div className="quarter-info">
                <div className={`date-time-display ${quarter.isPlaying ? '' : 'disabled'}`}>
                    <img src={ClockBlack} alt="시간" className="clock-icon" />
                    <span className="date-text">
                      {quarter.isPlaying && quarter.gameDate
                        ? new Date(quarter.gameDate).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric'
                          })
                        : '-'}
                    </span>
                    <span className="separator">•</span>
                    <span className="time-text">
                      {quarter.isPlaying
                        ? `${formatTime(quarter.gameStartTime)} - ${formatTime(quarter.gameEndTime)}`
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-body">추가된 쿼터가 없습니다.</p>
            <p className="text-caption">아래 + 버튼을 눌러 쿼터를 추가해주세요.</p>
          </div>
        )}
        
        {/* 쿼터 추가 버튼 */}
        <button 
          className="add-quarter-btn"
          onClick={openAddModal}
          aria-label="쿼터 추가"
        >
          <span className="add-icon">+</span>
        </button>
      </div>
      
      {/* 분석 시작 버튼 */}
      <div className="analysis-section">
        <button 
          className="start-analysis-btn"
          onClick={handleStartAnalysis}
          disabled={quarters.length === 0}
        >
          분석 시작
        </button>
      </div>
      
      {/* 쿼터 입력 모달 */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title text-h2">
                {editingQuarter ? '쿼터 수정' : '쿼터 추가'}
              </h2>
              <button 
                className="close-btn"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              {/* 쿼터 이름 */}
              <div className="input-group">
                <label className="input-label text-h4">쿼터 이름</label>
                <input
                  type="text"
                  className="text-input"
                  value={quarterName}
                  onChange={(e) => setQuarterName(e.target.value)}
                  placeholder="쿼터 이름을 입력하세요"
                />
              </div>
              
              {/* 경기 날짜 */}
              <div className="input-group date-input-group">
                <label className="input-label text-caption">경기 날짜</label>
                <div className="date-content">
                  {isPlaying && showDateEdit ? (
                    <input
                      type="date"
                      className="date-input"
                      value={gameDate}
                      onChange={(e) => setGameDate(e.target.value)}
                      disabled={!isPlaying}
                    />
                  ) : (
                    <div className={`date-display ${!isPlaying ? 'disabled' : ''}`}>
                      {isPlaying && gameDate ? new Date(gameDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : '미출전'}
                    </div>
                  )}
                  <button 
                    type="button"
                    className={`date-edit-btn ${!isPlaying ? 'disabled' : ''}`}
                    onClick={() => {
                      if (isPlaying) {
                        setShowDateEdit(!showDateEdit);
                      }
                    }}
                    disabled={!isPlaying}
                  >
                    {showDateEdit ? '완료' : '수정'}
                  </button>
                </div>
              </div>
              
              {/* 경기 시간 */}
              <div className="input-group">
                <label className="input-label text-h4">경기시간</label>
                <div className={`time-inputs-scroll ${!isPlaying ? 'disabled' : ''}`}>
                  <div className="time-input-wrapper">
                    <label className="time-label">시작 시간</label>
                    <button
                      type="button"
                      className={`time-scroll-btn ${!isPlaying ? 'disabled' : ''}`}
                      onClick={() => isPlaying && openTimePicker('gameStartTime')}
                      disabled={!isPlaying}
                    >
                      <span className="time-text">{isPlaying ? gameStartTime : '--:--'}</span>
                      <img src={DownIcon} alt="선택" className="dropdown-icon" />
                    </button>
                  </div>
                  <div className="time-input-wrapper">
                    <label className="time-label">종료 시간</label>
                    <button
                      type="button"
                      className={`time-scroll-btn ${!isPlaying ? 'disabled' : ''}`}
                      onClick={() => isPlaying && openTimePicker('gameEndTime')}
                      disabled={!isPlaying}
                    >
                      <span className="time-text">{isPlaying ? gameEndTime : '--:--'}</span>
                      <img src={DownIcon} alt="선택" className="dropdown-icon" />
                    </button>
                  </div>
                </div>
                {!isPlaying && (
                  <p className="text-caption rest-hint">미출전 쿼터는 시간 입력이 필요 없습니다.</p>
                )}
              </div>
              
              {/* 출전 여부 */}
              <div className="input-group">
                <label className="input-label text-h4">출전여부</label>
                <div className="playing-status-buttons">
                  <button
                    className={`status-btn ${isPlaying ? 'active' : ''}`}
                    onClick={() => togglePlayingStatus(true)}
                  >
                    <span className="check-icon">{isPlaying ? '✓' : ''}</span>
                    출전
                  </button>
                  <button
                    className={`status-btn ${!isPlaying ? 'active' : ''}`}
                    onClick={() => togglePlayingStatus(false)}
                  >
                    <span className="check-icon">{!isPlaying ? '✓' : ''}</span>
                    미출전
                  </button>
                </div>
              </div>
              
              {/* 홈 진영 선택 */}
              <div className="input-group">
                <label className="input-label text-h4">
                  홈 진영
                  {!isPlaying && <span className="disabled-hint"> (출전 시에만 선택 가능)</span>}
                </label>
                <div className={`home-position-selection ${!isPlaying ? 'disabled' : ''}`}>
                  <button
                    className={`ground-select-btn ${homePosition === '왼쪽' ? 'selected' : ''}`}
                    onClick={() => selectHomePosition('왼쪽')}
                    disabled={!isPlaying}
                    aria-label="왼쪽 진영 선택"
                  >
                    <span className="position-label-top">왼쪽</span>
                    <img 
                      src={require('../../../assets/big_icons/ground_left_small.png')} 
                      alt="왼쪽 진영" 
                      className="ground-image"
                    />
                    <span className="position-label-bottom">휴식공간</span>
                  </button>
                  <button
                    className={`ground-select-btn ${homePosition === '오른쪽' ? 'selected' : ''}`}
                    onClick={() => selectHomePosition('오른쪽')}
                    disabled={!isPlaying}
                    aria-label="오른쪽 진영 선택"
                  >
                    <span className="position-label-top">오른쪽</span>
                    <img 
                      src={require('../../../assets/big_icons/ground_right_small.png')} 
                      alt="오른쪽 진영" 
                      className="ground-image"
                    />
                    <span className="position-label-bottom">휴식공간</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary cancel-btn" onClick={closeModal}>
                취소
              </button>
              <button className="btn-primary save-btn" onClick={saveQuarter}>
                {editingQuarter ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 시간 선택 스크롤 팝업 */}
      {timePickerOpen && (
        <div className="time-scroll-overlay" onClick={handleTimeCancel}>
          <div className="time-scroll-modal" onClick={(e) => e.stopPropagation()}>
            <div className="time-scroll-header">
              <h3 className="time-scroll-title">시간 선택</h3>
              <button className="close-btn" onClick={handleTimeCancel}>×</button>
            </div>
            
            <div className="time-scroll-content">
              <div className="time-scroll-wheels">
                {/* 시간 스크롤 */}
                <div className="time-wheel">
                  <div className="wheel-label">시</div>
                  <div className="wheel-container">
                    <div className="wheel-selection-indicator"></div>
                    <div 
                      className="wheel-scroll" 
                      onScroll={handleHourScroll}
                      ref={hourScrollRef}
                    >
                      {hours.map((hour, index) => (
                        <div key={index} className="wheel-item">
                          {String(hour).padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 분 스크롤 */}
                <div className="time-wheel">
                  <div className="wheel-label">분</div>
                  <div className="wheel-container">
                    <div className="wheel-selection-indicator"></div>
                    <div 
                      className="wheel-scroll"
                      onScroll={handleMinuteScroll}
                      ref={minuteScrollRef}
                    >
                      {minutes.map((minute, index) => (
                        <div key={index} className="wheel-item">
                          {String(minute).padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="selected-time-display">
                {String(selectedHour).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')}
              </div>
            </div>
            
            <div className="time-scroll-footer">
              <button className="btn-secondary cancel-btn" onClick={handleTimeCancel}>취소</button>
              <button className="btn-primary confirm-btn" onClick={handleTimeConfirm}>확인</button>
            </div>
          </div>
        </div>
      )}
      
      {/* 자동입력 모달 - 쿼터 수 입력 */}
      {autoFillModalOpen && (
        <div className="auto-fill-modal-overlay" onClick={closeAutoFillModal}>
          <div className="auto-fill-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auto-fill-modal-header">
              <h2 className="modal-title text-h2">쿼터 수 입력</h2>
              <button className="close-btn" onClick={closeAutoFillModal}>×</button>
            </div>
            
            <div className="auto-fill-modal-content">
              <div className="quarter-count-input">
                <p className="modal-description text-body">
                  총 몇 개의 쿼터로 나눌지 입력해주세요.
                </p>
                <div className="quarter-count-controls">
                  <button 
                    className="count-btn decrease-btn" 
                    onClick={decreaseQuarters}
                    disabled={numQuarters <= 1}
                    aria-label="쿼터 수 감소"
                  >
                    −
                  </button>
                  <input
                    id="numQuarters"
                    type="number"
                    min="1"
                    max="10"
                    value={numQuarters}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 10) {
                        setNumQuarters(value);
                      }
                    }}
                    className="number-input"
                    placeholder="4"
                  />
                  <button 
                    className="count-btn increase-btn" 
                    onClick={increaseQuarters}
                    disabled={numQuarters >= 10}
                    aria-label="쿼터 수 증가"
                  >
                    +
                  </button>
                </div>
                <span className="input-hint">1~10 사이의 숫자를 입력하세요</span>
              </div>
            </div>
            
            <div className="auto-fill-modal-footer">
              <button className="btn-secondary cancel-btn" onClick={closeAutoFillModal}>
                취소
              </button>
              <button 
                className="btn-primary confirm-btn" 
                onClick={handleAutoFill}
                disabled={autoFilling}
              >
                {autoFilling ? '분석중...' : '자동입력 시작'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 경기 이름 입력 모달 */}
      {matchNameModalOpen && (
        <div className="match-name-modal-overlay" onClick={closeMatchNameModal}>
          <div className="match-name-modal" onClick={(e) => e.stopPropagation()}>
            <div className="match-name-modal-header">
              <h2 className="modal-title text-h2">경기 이름 입력</h2>
              <button className="close-btn" onClick={closeMatchNameModal}>×</button>
            </div>
            
            <div className="match-name-modal-content">
              <div className="input-group">
                <label className="input-label text-h4">경기 이름</label>
                <input
                  type="text"
                  className="text-input"
                  value={matchName}
                  onChange={(e) => setMatchName(e.target.value)}
                  placeholder="예: 3월 16일 경기"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="match-name-modal-footer">
              <button className="btn-secondary cancel-btn" onClick={closeMatchNameModal}>
                취소
              </button>
              <button className="btn-primary confirm-btn" onClick={startAnalysis}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerQuarterInfo4;
