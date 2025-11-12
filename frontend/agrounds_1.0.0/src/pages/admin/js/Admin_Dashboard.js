import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Admin_Dashboard.scss';
import Admin_DesignSystem from './Admin_DesignSystem';
import logoImage from '../../../assets/big_icons/logo_green.png';
// 아이콘 import
import logsIcon from '../../../assets/color_icons/check_green.png';
import designIcon from '../../../assets/color_icons/info_blue.png';
import supportIcon from '../../../assets/color_icons/question_blue.png';
import announcementIcon from '../../../assets/color_icons/alarm_yellow.png';
import logoutIcon from '../../../assets/color_icons/out_red.png';
import leftArrowIcon from '../../../assets/common/left.png';
import rightArrowIcon from '../../../assets/common/right.png';
import menuIcon from '../../../assets/common/dots.png';
// API import
import { 
  AdminContentCreate, 
  AdminContentUpdate, 
  AdminContentDelete,
  AdminInquiryList,
  AdminInquiryAnswer,
  AdminLogsQuery
} from '../../../function/api/admin/adminApi';
import { getNoticeList, getEventList, getContentDetail } from '../../../function/api/user/announcementApi';

const Admin_Dashboard = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('logs');
  const [adminInfo, setAdminInfo] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);

  // 컨텐츠 관리 상태
  const [contentList, setContentList] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentForm, setContentForm] = useState({
    category: '',
    title: '',
    content: '',
    priority: 'normal',
    is_pinned: false,
    event_start_date: '',
    event_end_date: '',
    event_link: '',
    event_reward: '',
    is_published: true
  });

  // 문의사항 관리 상태
  const [inquiryList, setInquiryList] = useState([]);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [answerForm, setAnswerForm] = useState({
    answer: '',
    status: 'completed'
  });
  const [statusFilter, setStatusFilter] = useState('all');

  // 로그 관리 상태
  const [logsList, setLogsList] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsStats, setLogsStats] = useState({
    total_count: 0,
    error_count: 0,
    request_count: 0,
    avg_response_time: 0,
    success_rate: 0
  });
  const [logsFilters, setLogsFilters] = useState({
    event_type: 'all',
    api_app: '',
    status_code: '',
    time_range: '1h',
    limit: 50,
    search_query: ''
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);

  useEffect(() => {
    // 관리자 로그인 확인
    const adminUserCode = sessionStorage.getItem('adminUserCode');
    const adminUserId = sessionStorage.getItem('adminUserId');
    const adminLoginType = sessionStorage.getItem('adminLoginType');
    const adminLoginTime = sessionStorage.getItem('adminLoginTime');

    if (!adminUserCode || !adminUserId || !adminLoginType || !adminLoginTime) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      alert('관리자 로그인이 필요합니다.');
      navigate('/app/admin/login');
      return;
    }

    // 로그인 시간 유효성 체크 (1시간 = 3600000ms)
    const currentTime = new Date().getTime();
    const loginTime = parseInt(adminLoginTime, 10);
    const oneHour = 60 * 60 * 1000; // 1시간

    if (currentTime - loginTime > oneHour) {
      // 로그인 시간이 1시간 경과
      sessionStorage.removeItem('adminUserCode');
      sessionStorage.removeItem('adminUserId');
      sessionStorage.removeItem('adminLoginType');
      sessionStorage.removeItem('adminLoginTime');
      alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      navigate('/app/admin/login');
      return;
    }

    // 유효하지 않은 login_type인 경우
    if (!['messi', 'guest'].includes(adminLoginType)) {
      alert('유효하지 않은 관리자 권한입니다.');
      navigate('/app/admin/login');
      return;
    }

    setAdminInfo({
      userCode: adminUserCode,
      userId: adminUserId,
      loginType: adminLoginType
    });

    // 모바일 뷰 감지
    const checkMobileView = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileView(isMobile);
      
      if (isMobile) {
        setSidebarOpen(false); // 모바일에서는 사이드바 기본적으로 닫기
      } else {
        setSidebarOpen(true); // PC 환경에서는 항상 개린 상태로 유지
      }
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);

    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, [navigate]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      sessionStorage.removeItem('adminUserCode');
      sessionStorage.removeItem('adminUserId');
      sessionStorage.removeItem('adminLoginType');
      sessionStorage.removeItem('adminLoginTime');
      navigate('/app/admin/login');
    }
  };

  // 사이드바 토글
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // 모바일에서는 탭 선택 시 사이드바 숨기기
    if (isMobileView) {
      setSidebarOpen(false);
    }
    
    // 탭 전환 시 데이터 로드
    if (tabId === 'announcements') {
      fetchNoticeList();
    } else if (tabId === 'events') {
      fetchEventList();
    } else if (tabId === 'customer-support') {
      fetchInquiryList();
    }
  };

  // ===========================================
  // 컨텐츠 관리 함수들
  // ===========================================

  // 공지사항 목록 조회
  const fetchNoticeList = async () => {
    setContentLoading(true);
    try {
      const response = await getNoticeList(1, 50);
      if (response.data && response.data.results) {
        setContentList(response.data.results);
      }
    } catch (error) {
      console.error('공지사항 목록 조회 실패:', error);
      alert('공지사항 목록 조회에 실패했습니다.');
    } finally {
      setContentLoading(false);
    }
  };

  // 이벤트 목록 조회
  const fetchEventList = async () => {
    setContentLoading(true);
    try {
      const response = await getEventList(1, 50, 'all');
      if (response.data && response.data.results) {
        setContentList(response.data.results);
      }
    } catch (error) {
      console.error('이벤트 목록 조회 실패:', error);
      alert('이벤트 목록 조회에 실패했습니다.');
    } finally {
      setContentLoading(false);
    }
  };

  // 컨텐츠 생성/수정 모달 열기
  const handleOpenContentModal = (mode, content = null) => {
    setModalMode(mode);
    if (mode === 'create') {
      setContentForm({
        category: activeTab === 'announcements' ? 'notice' : 'event',
        title: '',
        content: '',
        priority: 'normal',
        is_pinned: false,
        event_start_date: '',
        event_end_date: '',
        event_link: '',
        event_reward: '',
        is_published: true
      });
    } else {
      setSelectedContent(content);
      setContentForm({
        category: content.category,
        title: content.title || '',
        content: content.content || '',
        priority: content.priority || 'normal',
        is_pinned: content.is_pinned || false,
        event_start_date: content.event_start_date || '',
        event_end_date: content.event_end_date || '',
        event_link: content.event_link || '',
        event_reward: content.event_reward || '',
        is_published: content.is_published
      });
    }
    setShowContentModal(true);
  };

  // 컨텐츠 모달 닫기
  const handleCloseContentModal = () => {
    setShowContentModal(false);
    setSelectedContent(null);
    setContentForm({
      category: '',
      title: '',
      content: '',
      priority: 'normal',
      is_pinned: false,
      event_start_date: '',
      event_end_date: '',
      event_link: '',
      event_reward: '',
      is_published: true
    });
  };

  // 컨텐츠 폼 입력 핸들러
  const handleContentFormChange = (field, value) => {
    setContentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 컨텐츠 저장
  const handleSaveContent = async () => {
    if (!contentForm.title.trim() || !contentForm.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setContentLoading(true);
    try {
      const adminUserCode = sessionStorage.getItem('adminUserCode');
      if (!adminUserCode) {
        alert('관리자 로그인이 필요합니다.');
        navigate('/app/admin/login');
        return;
      }

      const contentData = {
        admin_user_code: adminUserCode,
        ...contentForm
      };

      if (modalMode === 'create') {
        await AdminContentCreate(contentData);
        alert('작성이 완료되었습니다.');
      } else {
        contentData.content_code = selectedContent.content_code;
        await AdminContentUpdate(contentData);
        alert('수정이 완료되었습니다.');
      }

      handleCloseContentModal();
      
      // 목록 새로고침
      if (activeTab === 'announcements') {
        fetchNoticeList();
      } else {
        fetchEventList();
      }
    } catch (error) {
      console.error('컨텐츠 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setContentLoading(false);
    }
  };

  // 컨텐츠 삭제
  const handleDeleteContent = async (contentCode) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    setContentLoading(true);
    try {
      const adminUserCode = sessionStorage.getItem('adminUserCode');
      if (!adminUserCode) {
        alert('관리자 로그인이 필요합니다.');
        navigate('/app/admin/login');
        return;
      }

      await AdminContentDelete(adminUserCode, contentCode);
      alert('삭제가 완료되었습니다.');
      
      // 목록 새로고침
      if (activeTab === 'announcements') {
        fetchNoticeList();
      } else {
        fetchEventList();
      }
    } catch (error) {
      console.error('컨텐츠 삭제 실패:', error);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setContentLoading(false);
    }
  };

  // ===========================================
  // 문의사항 관리 함수들
  // ===========================================

  // 문의사항 목록 조회
  const fetchInquiryList = async (status = null) => {
    setInquiryLoading(true);
    try {
      // 세션 스토리지에서 직접 가져오기 (adminInfo가 아직 설정되지 않을 수 있음)
      const adminUserCode = sessionStorage.getItem('adminUserCode');
      if (!adminUserCode) {
        alert('관리자 로그인이 필요합니다.');
        navigate('/app/admin/login');
        return;
      }
      
      const response = await AdminInquiryList(adminUserCode, 1, 50, status);
      if (response.data && response.data.results) {
        setInquiryList(response.data.results);
      }
    } catch (error) {
      console.error('문의사항 목록 조회 실패:', error);
      alert('문의사항 목록 조회에 실패했습니다.');
    } finally {
      setInquiryLoading(false);
    }
  };

  // 문의사항 상세 모달 열기
  const handleOpenInquiryModal = async (inquiry) => {
    try {
      const adminUserCode = sessionStorage.getItem('adminUserCode');
      const response = await getContentDetail(inquiry.content_code, adminUserCode);
      if (response.data) {
        setSelectedInquiry(response.data);
        setAnswerForm({
          answer: response.data.answer || '',
          status: response.data.status || 'pending'
        });
        setShowInquiryModal(true);
      }
    } catch (error) {
      console.error('문의사항 상세 조회 실패:', error);
      alert('문의사항 조회에 실패했습니다.');
    }
  };

  // 문의사항 모달 닫기
  const handleCloseInquiryModal = () => {
    setShowInquiryModal(false);
    setSelectedInquiry(null);
    setAnswerForm({
      answer: '',
      status: 'completed'
    });
  };

  // 문의사항 답변 저장
  const handleSaveAnswer = async () => {
    if (!answerForm.answer.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    setInquiryLoading(true);
    try {
      const adminUserCode = sessionStorage.getItem('adminUserCode');
      if (!adminUserCode) {
        alert('관리자 로그인이 필요합니다.');
        navigate('/app/admin/login');
        return;
      }

      const answerData = {
        admin_user_code: adminUserCode,
        content_code: selectedInquiry.content_code,
        answer: answerForm.answer,
        status: answerForm.status
      };

      await AdminInquiryAnswer(answerData);
      alert('답변이 등록되었습니다.');
      
      handleCloseInquiryModal();
      fetchInquiryList(statusFilter === 'all' ? null : statusFilter);
    } catch (error) {
      console.error('답변 저장 실패:', error);
      alert('답변 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setInquiryLoading(false);
    }
  };

  // 상태 필터 변경
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    fetchInquiryList(status === 'all' ? null : status);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 우선순위 텍스트
  const getPriorityText = (priority) => {
    const priorities = {
      'low': '낮음',
      'normal': '일반',
      'high': '높음',
      'urgent': '긴급'
    };
    return priorities[priority] || '일반';
  };

  // 상태 텍스트
  const getStatusText = (status) => {
    const statuses = {
      'pending': '답변 대기',
      'in_progress': '처리 중',
      'completed': '답변 완료',
      'rejected': '반려'
    };
    return statuses[status] || '처리중';
  };

  // 문의 유형 텍스트
  const getInquiryTypeText = (type) => {
    const types = {
      'app_feature': '기능 문의',
      'bug_report': '오류 신고',
      'account': '계정 문의',
      'payment': '결제 문의',
      'match_analysis': '경기 분석 문의',
      'team': '팀 관련 문의',
      'suggestion': '제안/건의',
      'other': '기타'
    };
    return types[type] || type;
  };

  // ===== 로그 관리 함수들 =====
  
  // 로그 조회
  const fetchLogs = async () => {
    const adminUserCode = sessionStorage.getItem('adminUserCode');
    if (!adminUserCode) return;

    try {
      setLogsLoading(true);
      const response = await AdminLogsQuery(adminUserCode, logsFilters);
      
      if (response.data) {
        setLogsList(response.data.logs || []);
        setLogsStats({
          total_count: response.data.total_count || 0,
          error_count: response.data.error_count || 0,
          request_count: response.data.request_count || 0,
          avg_response_time: response.data.avg_response_time || 0,
          success_rate: response.data.success_rate || 0
        });
      }
    } catch (error) {
      console.error('로그 조회 실패:', error);
      alert('로그 조회에 실패했습니다.');
    } finally {
      setLogsLoading(false);
    }
  };

  // 로그 필터 변경
  const handleLogsFilterChange = (field, value) => {
    setLogsFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 로그 상세 보기
  const handleLogDetailClick = (log) => {
    setSelectedLog(log);
    setShowLogDetailModal(true);
  };

  // 로그 상세 모달 닫기
  const handleCloseLogDetailModal = () => {
    setShowLogDetailModal(false);
    setSelectedLog(null);
  };

  // 로그 이벤트 타입 텍스트
  const getEventTypeText = (eventType) => {
    const types = {
      'api.request': '요청',
      'api.response': '응답',
      'api.error': '에러'
    };
    return types[eventType] || eventType;
  };

  // 로그 이벤트 타입 색상
  const getEventTypeColor = (eventType) => {
    const colors = {
      'api.request': 'blue',
      'api.response': 'green',
      'api.error': 'red'
    };
    return colors[eventType] || 'gray';
  };

  // 상태 코드 색상
  const getStatusCodeColor = (statusCode) => {
    if (!statusCode) return 'gray';
    if (statusCode >= 200 && statusCode < 300) return 'green';
    if (statusCode >= 400 && statusCode < 500) return 'orange';
    if (statusCode >= 500) return 'red';
    return 'gray';
  };

  // 타임스탬프 포맷
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 사이드바 크기 조절 함수들
  const handleMouseDown = (e) => {
    if (!isMobileView) {
      setIsResizing(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isResizing && !isMobileView) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
        // 메인 콘텐츠 넓이도 동적으로 조정
        const mainContent = document.querySelector('.admin-main-content');
        if (mainContent) {
          mainContent.style.marginLeft = `${newWidth}px`;
          mainContent.style.width = `calc(100vw - ${newWidth}px)`;
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  // 탭 콘텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'logs':
        return (
          <div className='tab-content-section logs-section'>
            <div className='section-header'>
              <h2 className='text-h2'>API 로그 모니터링</h2>
              <button className='btn-icon-refresh' onClick={fetchLogs} title='새로고침'>
                ⟳
              </button>
            </div>

            {/* 통계 카드 - PC 환경 최적화 */}
            <div className='logs-stats'>
              <div className='stat-card'>
                <div className='stat-label'>전체 로그</div>
                <div className='stat-value'>{logsStats.total_count}</div>
              </div>
              <div className='stat-card'>
                <div className='stat-label'>요청 수</div>
                <div className='stat-value'>{logsStats.request_count}</div>
              </div>
              <div className='stat-card error'>
                <div className='stat-label'>에러 수</div>
                <div className='stat-value'>{logsStats.error_count}</div>
              </div>
              <div className='stat-card'>
                <div className='stat-label'>성공률</div>
                <div className='stat-value'>
                  {logsStats.total_count > 0 
                    ? Math.round(((logsStats.total_count - logsStats.error_count) / logsStats.total_count) * 100)
                    : 0
                  }%
                </div>
              </div>
              <div className='stat-card'>
                <div className='stat-label'>평균 응답시간</div>
                <div className='stat-value'>{logsStats.avg_response_time || 0}ms</div>
              </div>
            </div>

            {/* 필터 영역 - 개선된 검색 기능 */}
            <div className='logs-filters'>
              <div className='filter-row'>
                <div className='filter-group search-group'>
                  <label>로그 검색</label>
                  <input 
                    type='text' 
                    placeholder='로그 내용, API 이름, 사용자 코드 검색...'
                    value={logsFilters.search_query || ''}
                    onChange={(e) => handleLogsFilterChange('search_query', e.target.value)}
                  />
                </div>
                
                <div className='filter-group'>
                  <label>시간 범위</label>
                  <select 
                    value={logsFilters.time_range} 
                    onChange={(e) => handleLogsFilterChange('time_range', e.target.value)}
                  >
                    <option value='5m'>최근 5분</option>
                    <option value='15m'>최근 15분</option>
                    <option value='1h'>최근 1시간</option>
                    <option value='3h'>최근 3시간</option>
                    <option value='6h'>최근 6시간</option>
                    <option value='12h'>최근 12시간</option>
                    <option value='24h'>최근 24시간</option>
                  </select>
                </div>

                <div className='filter-group'>
                  <label>이벤트 타입</label>
                  <select 
                    value={logsFilters.event_type} 
                    onChange={(e) => handleLogsFilterChange('event_type', e.target.value)}
                  >
                    <option value='all'>전체</option>
                    <option value='request'>요청</option>
                    <option value='response'>응답</option>
                    <option value='error'>에러</option>
                  </select>
                </div>

                <div className='filter-group'>
                  <label>API 앱</label>
                  <select 
                    value={logsFilters.api_app} 
                    onChange={(e) => handleLogsFilterChange('api_app', e.target.value)}
                  >
                    <option value=''>전체</option>
                    <option value='user'>user</option>
                    <option value='login'>login</option>
                    <option value='match'>match</option>
                    <option value='anal'>anal</option>
                    <option value='video'>video</option>
                    <option value='ground'>ground</option>
                    <option value='upload'>upload</option>
                    <option value='admin'>admin</option>
                  </select>
                </div>

                <div className='filter-group'>
                  <label>상태 코드</label>
                  <select 
                    value={logsFilters.status_code}
                    onChange={(e) => handleLogsFilterChange('status_code', e.target.value)}
                  >
                    <option value=''>전체</option>
                    <option value='200'>200 (OK)</option>
                    <option value='201'>201 (Created)</option>
                    <option value='400'>400 (Bad Request)</option>
                    <option value='401'>401 (Unauthorized)</option>
                    <option value='403'>403 (Forbidden)</option>
                    <option value='404'>404 (Not Found)</option>
                    <option value='500'>500 (Server Error)</option>
                  </select>
                </div>

                <div className='filter-group'>
                  <label>조회 개수</label>
                  <select 
                    value={logsFilters.limit} 
                    onChange={(e) => handleLogsFilterChange('limit', parseInt(e.target.value))}
                  >
                    <option value='25'>25개</option>
                    <option value='50'>50개</option>
                    <option value='100'>100개</option>
                    <option value='200'>200개</option>
                    <option value='500'>500개</option>
                  </select>
                </div>
              </div>

              <div className='filter-actions'>
                <button className='btn-secondary' onClick={fetchLogs}>
                  필터 적용
                </button>
                <button 
                  className='btn-clear' 
                  onClick={() => {
                    setLogsFilters({
                      event_type: 'all',
                      api_app: '',
                      status_code: '',
                      time_range: '1h',
                      limit: 50,
                      search_query: ''
                    });
                  }}
                >
                  필터 초기화
                </button>
              </div>
            </div>

            {/* 로그 목록 */}
            {logsLoading ? (
              <div className='loading-container'>
                <div className='loading-spinner'></div>
                <p>로그 조회 중...</p>
              </div>
            ) : logsList.length === 0 ? (
              <div className='empty-state'>
                <p className='text-body'>조회된 로그가 없습니다.</p>
              </div>
            ) : (
              <div className='logs-list'>
                {logsList.map((log, index) => {
                  const parsed = log.parsed || {};
                  const eventType = parsed.event || '-';
                  const statusCode = parsed.status_code;
                  
                  return (
                    <div 
                      key={index} 
                      className='log-item'
                      onClick={() => handleLogDetailClick(log)}
                    >
                      <div className='log-header'>
                        <span className={`event-badge ${getEventTypeColor(eventType)}`}>
                          {getEventTypeText(eventType)}
                        </span>
                        {statusCode && (
                          <span className={`status-badge ${getStatusCodeColor(statusCode)}`}>
                            {statusCode}
                          </span>
                        )}
                        <span className='log-time'>{formatTimestamp(log.timestamp)}</span>
                      </div>
                      <div className='log-content'>
                        <div className='log-field'>
                          <span className='field-label'>API:</span>
                          <span className='field-value'>{parsed.api_name || parsed.path || '-'}</span>
                        </div>
                        {parsed.method && (
                          <div className='log-field'>
                            <span className='field-label'>Method:</span>
                            <span className='field-value'>{parsed.method}</span>
                          </div>
                        )}
                        {parsed.duration_ms && (
                          <div className='log-field'>
                            <span className='field-label'>Duration:</span>
                            <span className='field-value'>{parsed.duration_ms}ms</span>
                          </div>
                        )}
                        {parsed.user_code && (
                          <div className='log-field'>
                            <span className='field-label'>User:</span>
                            <span className='field-value'>{parsed.user_code}</span>
                          </div>
                        )}
                        {parsed.error_message && (
                          <div className='log-field error'>
                            <span className='field-label'>Error:</span>
                            <span className='field-value'>{parsed.error_message}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      
      case 'design-system':
        return <Admin_DesignSystem />;
      
      case 'customer-support':
        return (
          <div className='tab-content-section'>
            <div className='section-header'>
              <h2 className='text-h2 inquiry-title'>문의사항 관리</h2>
              <div className='filter-buttons'>
                <button 
                  className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('all')}
                >
                  전체
                </button>
                <button 
                  className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('pending')}
                >
                  답변 대기
                </button>
                <button 
                  className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('completed')}
                >
                  답변 완료
                </button>
              </div>
            </div>

            {inquiryLoading ? (
              <div className='loading-container'>
                <div className='loading-spinner'></div>
                <p>로딩 중...</p>
              </div>
            ) : inquiryList.length === 0 ? (
              <div className='empty-state'>
                <p className='text-body'>문의사항이 없습니다.</p>
              </div>
            ) : (
              <div className='content-list'>
                {inquiryList.map((inquiry) => (
                  <div 
                    key={inquiry.content_code} 
                    className='content-item inquiry-item'
                    onClick={() => handleOpenInquiryModal(inquiry)}
                  >
                    <div className='item-header'>
                      <div className='item-badges'>
                        <span className='badge type-badge'>{getInquiryTypeText(inquiry.inquiry_type)}</span>
                        <span className={`badge status-badge status-${inquiry.status}`}>
                          {getStatusText(inquiry.status)}
                        </span>
                      </div>
                      <span className='item-date'>{formatDate(inquiry.created_at)}</span>
                    </div>
                    <h3 className='item-title'>{inquiry.title}</h3>
                    <p className='item-preview'>{inquiry.content?.substring(0, 100)}...</p>
                    <div className='item-footer'>
                      <span className='item-author'>작성자: {inquiry.author_name || '사용자'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'announcements':
        return (
          <div className='tab-content-section'>
            <div className='section-header'>
              <h2 className='text-h2 announcements-title'>공지사항 관리</h2>
              <button 
                className='btn-primary create-btn'
                onClick={() => handleOpenContentModal('create')}
              >
                새 공지사항
              </button>
            </div>

            {contentLoading ? (
              <div className='loading-container'>
                <div className='loading-spinner'></div>
                <p>로딩 중...</p>
              </div>
            ) : contentList.length === 0 ? (
              <div className='empty-state'>
                <p className='text-body'>공지사항이 없습니다.</p>
              </div>
            ) : (
              <div className='content-list'>
                {contentList.map((notice) => (
                  <div key={notice.content_code} className='content-item'>
                    <div className='item-header'>
                      <div className='item-badges'>
                        <span className={`badge priority-badge priority-${notice.priority}`}>
                          {getPriorityText(notice.priority)}
                        </span>
                        {notice.is_pinned && <span className='badge pinned-badge'>고정</span>}
                        <span className={`badge status-badge ${notice.is_published ? 'published' : 'draft'}`}>
                          {notice.is_published ? '공개' : '비공개'}
                        </span>
                      </div>
                      <span className='item-date'>{formatDate(notice.created_at)}</span>
                    </div>
                    <h3 className='item-title'>{notice.title}</h3>
                    <p className='item-preview'>{notice.content?.substring(0, 100)}...</p>
                    <div className='item-footer'>
                      <div className='item-stats'>
                        <span>조회 {notice.view_count || 0}</span>
                        <span>댓글 {notice.comment_count || 0}</span>
                        <span>좋아요 {notice.like_count || 0}</span>
                      </div>
                      <div className='item-actions'>
                        <button 
                          className='btn-edit'
                          onClick={() => handleOpenContentModal('edit', notice)}
                        >
                          수정
                        </button>
                        <button 
                          className='btn-delete'
                          onClick={() => handleDeleteContent(notice.content_code)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'events':
        return (
          <div className='tab-content-section'>
            <div className='section-header'>
              <h2 className='text-h2 events-title'>이벤트 관리</h2>
              <button 
                className='btn-primary create-btn'
                onClick={() => handleOpenContentModal('create')}
              >
                새 이벤트
              </button>
            </div>

            {contentLoading ? (
              <div className='loading-container'>
                <div className='loading-spinner'></div>
                <p>로딩 중...</p>
              </div>
            ) : contentList.length === 0 ? (
              <div className='empty-state'>
                <p className='text-body'>이벤트가 없습니다.</p>
              </div>
            ) : (
              <div className='content-list'>
                {contentList.map((event) => (
                  <div key={event.content_code} className='content-item event-item'>
                    <div className='item-header'>
                      <div className='item-badges'>
                        <span className={`badge status-badge ${event.is_published ? 'published' : 'draft'}`}>
                          {event.is_published ? '공개' : '비공개'}
                        </span>
                      </div>
                      <span className='item-date'>
                        {formatDate(event.event_start_date)} ~ {formatDate(event.event_end_date)}
                      </span>
                    </div>
                    <h3 className='item-title'>{event.title}</h3>
                    <p className='item-preview'>{event.content?.substring(0, 100)}...</p>
                    {event.event_reward && (
                      <div className='event-reward'>
                        <span className='reward-label'>보상:</span> {event.event_reward}
                      </div>
                    )}
                    <div className='item-footer'>
                      <div className='item-stats'>
                        <span>조회 {event.view_count || 0}</span>
                        <span>댓글 {event.comment_count || 0}</span>
                        <span>좋아요 {event.like_count || 0}</span>
                      </div>
                      <div className='item-actions'>
                        <button 
                          className='btn-edit'
                          onClick={() => handleOpenContentModal('edit', event)}
                        >
                          수정
                        </button>
                        <button 
                          className='btn-delete'
                          onClick={() => handleDeleteContent(event.content_code)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // 메뉴 아이템
  const menuItems = [
    { id: 'logs', label: '로그', icon: logsIcon },
    { id: 'design-system', label: '디자인 시스템', icon: designIcon },
    { id: 'customer-support', label: '고객대응', icon: supportIcon },
    { id: 'announcements', label: '공지사항', icon: announcementIcon },
    { id: 'events', label: '이벤트', icon: announcementIcon }
  ];

  return (
    <div className='admin-dashboard'>
      {/* 사이드바 */}
      <aside 
        className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        style={{ width: sidebarOpen && !isMobileView ? `${sidebarWidth}px` : undefined }}
      >
        <div className='sidebar-header'>
          <div className='logo-section'>
            <img src={logoImage} alt='AGROUNDS' className='sidebar-logo' />
            {sidebarOpen && <span className='text-h3'>AGROUNDS</span>}
          </div>
{isMobileView && (
        <button 
          className='sidebar-toggle'
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
        >
          <img 
            src={sidebarOpen ? leftArrowIcon : rightArrowIcon} 
            alt={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'} 
            className="toggle-icon"
          />
        </button>
      )}
        </div>

        <nav className='sidebar-nav'>
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabChange(item.id)}
              aria-label={item.label}
            >
              <img src={item.icon} alt={item.label} className='nav-icon' />
              {sidebarOpen && <span className='nav-label text-body'>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className='sidebar-footer'>
          <div className='admin-info'>
            {sidebarOpen && (
              <>
                <p className='text-caption admin-id'>관리자: {adminInfo.userId}</p>
                <p className='text-caption admin-type'>유형: {adminInfo.loginType}</p>
              </>
            )}
          </div>
          <button 
            className='logout-btn'
            onClick={handleLogout}
            aria-label='로그아웃'
          >
            {sidebarOpen ? (
              <span className='logout-text'>로그아웃</span>
            ) : (
              <img src={logoutIcon} alt='로그아웃' className='logout-icon' />
            )}
          </button>
        </div>
        
        {/* 사이드바 크기 조절 핸들 */}
        {sidebarOpen && !isMobileView && (
          <div 
            className="sidebar-resize-handle"
            onMouseDown={handleMouseDown}
          />
        )}
      </aside>

      {/* 모바일 오버레이 */}
      {isMobileView && sidebarOpen && (
        <div className='mobile-overlay' onClick={toggleMobileMenu}></div>
      )}

      {/* 메인 콘텐츠 */}
      <main 
        className={`admin-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{ 
          marginLeft: sidebarOpen && !isMobileView ? `${sidebarWidth}px` : undefined,
          width: sidebarOpen && !isMobileView ? `calc(100vw - ${sidebarWidth}px)` : undefined
        }}
      >
        <header className='content-header'>
          {isMobileView && (
            <button className='mobile-menu-btn' onClick={toggleMobileMenu}>
              <img src={menuIcon} alt="메뉴" className="menu-icon" />
            </button>
          )}
          <div className='header-title-section'>
            <h1 className='text-h1'>관리자 대시보드</h1>
          </div>
          <div className='header-actions'>
            <span className='text-body'>환영합니다, {adminInfo.userId}님</span>
          </div>
        </header>

        <div className='content-body'>
          {renderTabContent()}
        </div>
      </main>

      {/* 컨텐츠 작성/수정 모달 */}
      {showContentModal && (
        <div className='dashboard-modal-overlay' onClick={handleCloseContentModal}>
          <div className='dashboard-admin-modal' onClick={(e) => e.stopPropagation()}>
            <div className='dashboard-modal-header'>
              <h3 className='text-h2'>
                {modalMode === 'create' 
                  ? (activeTab === 'announcements' ? '새 공지사항' : '새 이벤트')
                  : (activeTab === 'announcements' ? '공지사항 수정' : '이벤트 수정')
                }
              </h3>
              <button className='dashboard-modal-close' onClick={handleCloseContentModal}>×</button>
            </div>
            
            <div className='dashboard-modal-body'>
              <div className='dashboard-form-group'>
                <label className='dashboard-form-label'>제목 *</label>
                <input
                  type='text'
                  className='dashboard-form-input'
                  placeholder='제목을 입력하세요'
                  value={contentForm.title}
                  onChange={(e) => handleContentFormChange('title', e.target.value)}
                />
              </div>

              <div className='dashboard-form-group'>
                <label className='dashboard-form-label'>내용 *</label>
                <textarea
                  className='dashboard-form-textarea'
                  placeholder='내용을 입력하세요'
                  value={contentForm.content}
                  onChange={(e) => handleContentFormChange('content', e.target.value)}
                  rows={8}
                />
              </div>

              {activeTab === 'announcements' && (
                <>
                  <div className='dashboard-form-row'>
                    <div className='dashboard-form-group'>
                      <label className='dashboard-form-label'>우선순위</label>
                      <select
                        className='dashboard-form-select'
                        value={contentForm.priority}
                        onChange={(e) => handleContentFormChange('priority', e.target.value)}
                      >
                        <option value='low'>낮음</option>
                        <option value='normal'>일반</option>
                        <option value='high'>높음</option>
                        <option value='urgent'>긴급</option>
                      </select>
                    </div>
                    
                    <div className='dashboard-form-group'>
                      <label className='dashboard-form-checkbox'>
                        <input
                          type='checkbox'
                          checked={contentForm.is_pinned}
                          onChange={(e) => handleContentFormChange('is_pinned', e.target.checked)}
                        />
                        <span>상단 고정</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'events' && (
                <>
                  <div className='dashboard-form-row'>
                    <div className='dashboard-form-group'>
                      <label className='dashboard-form-label'>시작일</label>
                      <input
                        type='datetime-local'
                        className='dashboard-form-input'
                        value={contentForm.event_start_date ? contentForm.event_start_date.slice(0, 16) : ''}
                        onChange={(e) => handleContentFormChange('event_start_date', e.target.value)}
                      />
                    </div>
                    
                    <div className='dashboard-form-group'>
                      <label className='dashboard-form-label'>종료일</label>
                      <input
                        type='datetime-local'
                        className='dashboard-form-input'
                        value={contentForm.event_end_date ? contentForm.event_end_date.slice(0, 16) : ''}
                        onChange={(e) => handleContentFormChange('event_end_date', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className='dashboard-form-group'>
                    <label className='dashboard-form-label'>이벤트 링크</label>
                    <input
                      type='text'
                      className='dashboard-form-input'
                      placeholder='https://...'
                      value={contentForm.event_link}
                      onChange={(e) => handleContentFormChange('event_link', e.target.value)}
                    />
                  </div>

                  <div className='dashboard-form-group'>
                    <label className='dashboard-form-label'>보상</label>
                    <input
                      type='text'
                      className='dashboard-form-input'
                      placeholder='이벤트 보상을 입력하세요'
                      value={contentForm.event_reward}
                      onChange={(e) => handleContentFormChange('event_reward', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className='dashboard-form-group'>
                <label className='dashboard-form-checkbox'>
                  <input
                    type='checkbox'
                    checked={contentForm.is_published}
                    onChange={(e) => handleContentFormChange('is_published', e.target.checked)}
                  />
                  <span>즉시 공개</span>
                </label>
              </div>
            </div>
            
            <div className='dashboard-modal-footer'>
              <button className='dashboard-btn-secondary' onClick={handleCloseContentModal}>
                취소
              </button>
              <button 
                className='dashboard-btn-primary' 
                onClick={handleSaveContent}
                disabled={contentLoading}
              >
                {contentLoading ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 문의사항 답변 모달 */}
      {showInquiryModal && selectedInquiry && (
        <div className='dashboard-modal-overlay' onClick={handleCloseInquiryModal}>
          <div className='dashboard-admin-modal inquiry-modal' onClick={(e) => e.stopPropagation()}>
            <div className='dashboard-modal-header'>
              <h3 className='text-h2'>문의사항 답변</h3>
              <button className='dashboard-modal-close' onClick={handleCloseInquiryModal}>×</button>
            </div>
            
            <div className='dashboard-modal-body'>
              <div className='dashboard-inquiry-info'>
                <div className='dashboard-info-row'>
                  <span className='dashboard-info-label'>문의 유형:</span>
                  <span className='badge type-badge'>{getInquiryTypeText(selectedInquiry.inquiry_type)}</span>
                </div>
                <div className='dashboard-info-row'>
                  <span className='dashboard-info-label'>작성일:</span>
                  <span className='dashboard-info-value'>{formatDate(selectedInquiry.created_at)}</span>
                </div>
                <div className='dashboard-info-row'>
                  <span className='dashboard-info-label'>작성자:</span>
                  <span className='dashboard-info-value'>{selectedInquiry.author_name || '사용자'}</span>
                </div>
              </div>

              <div className='dashboard-inquiry-content-section'>
                <h4 className='dashboard-section-title'>문의 제목</h4>
                <p className='dashboard-inquiry-title'>{selectedInquiry.title}</p>
                
                <h4 className='dashboard-section-title'>문의 내용</h4>
                <div className='dashboard-inquiry-content'>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedInquiry.content}</p>
                </div>
              </div>

              <div className='dashboard-answer-section'>
                <h4 className='dashboard-section-title'>답변 내용</h4>
                <textarea
                  className='dashboard-form-textarea answer-textarea'
                  placeholder='답변 내용을 입력하세요...'
                  value={answerForm.answer}
                  onChange={(e) => setAnswerForm({ ...answerForm, answer: e.target.value })}
                  rows={6}
                />
                
                <div className='dashboard-form-group'>
                  <label className='dashboard-form-label'>처리 상태</label>
                  <select
                    className='dashboard-form-select'
                    value={answerForm.status}
                    onChange={(e) => setAnswerForm({ ...answerForm, status: e.target.value })}
                  >
                    <option value='in_progress'>처리 중</option>
                    <option value='completed'>답변 완료</option>
                    <option value='rejected'>반려</option>
                  </select>
                </div>
              </div>

              {selectedInquiry.answer && (
                <div className='dashboard-existing-answer'>
                  <h4 className='dashboard-section-title'>기존 답변</h4>
                  <div className='dashboard-answer-content'>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedInquiry.answer}</p>
                  </div>
                  <div className='dashboard-answer-info'>
                    <span>답변일: {formatDate(selectedInquiry.answered_at)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className='dashboard-modal-footer'>
              <button className='dashboard-btn-secondary' onClick={handleCloseInquiryModal}>
                취소
              </button>
              <button 
                className='dashboard-btn-primary' 
                onClick={handleSaveAnswer}
                disabled={inquiryLoading}
              >
                {inquiryLoading ? '저장 중...' : '답변 등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로그 상세 모달 */}
      {showLogDetailModal && selectedLog && (
        <div className='dashboard-modal-overlay' onClick={handleCloseLogDetailModal}>
          <div className='dashboard-admin-modal log-detail-modal' onClick={(e) => e.stopPropagation()}>
            <div className='dashboard-modal-header'>
              <h3 className='text-h3'>로그 상세 정보</h3>
              <button className='dashboard-modal-close' onClick={handleCloseLogDetailModal}>×</button>
            </div>
            
            <div className='dashboard-modal-body'>
              <div className='log-detail-section'>
                <h4>기본 정보</h4>
                <div className='detail-grid'>
                  <div className='detail-item'>
                    <span className='detail-label'>타임스탬프:</span>
                    <span className='detail-value'>{formatTimestamp(selectedLog.timestamp)}</span>
                  </div>
                  {selectedLog.parsed && (
                    <>
                      <div className='detail-item'>
                        <span className='detail-label'>이벤트:</span>
                        <span className={`detail-value badge ${getEventTypeColor(selectedLog.parsed.event)}`}>
                          {getEventTypeText(selectedLog.parsed.event)}
                        </span>
                      </div>
                      <div className='detail-item'>
                        <span className='detail-label'>API 경로:</span>
                        <span className='detail-value'>{selectedLog.parsed.path || '-'}</span>
                      </div>
                      <div className='detail-item'>
                        <span className='detail-label'>API 이름:</span>
                        <span className='detail-value'>{selectedLog.parsed.api_name || '-'}</span>
                      </div>
                      <div className='detail-item'>
                        <span className='detail-label'>API 앱:</span>
                        <span className='detail-value'>{selectedLog.parsed.api_app || '-'}</span>
                      </div>
                      <div className='detail-item'>
                        <span className='detail-label'>메소드:</span>
                        <span className='detail-value'>{selectedLog.parsed.method || '-'}</span>
                      </div>
                      {selectedLog.parsed.status_code && (
                        <div className='detail-item'>
                          <span className='detail-label'>상태 코드:</span>
                          <span className={`detail-value badge ${getStatusCodeColor(selectedLog.parsed.status_code)}`}>
                            {selectedLog.parsed.status_code}
                          </span>
                        </div>
                      )}
                      {selectedLog.parsed.duration_ms && (
                        <div className='detail-item'>
                          <span className='detail-label'>응답 시간:</span>
                          <span className='detail-value'>{selectedLog.parsed.duration_ms}ms</span>
                        </div>
                      )}
                      <div className='detail-item'>
                        <span className='detail-label'>Request ID:</span>
                        <span className='detail-value mono'>{selectedLog.parsed.request_id || '-'}</span>
                      </div>
                      {selectedLog.parsed.client_ip && (
                        <div className='detail-item'>
                          <span className='detail-label'>클라이언트 IP:</span>
                          <span className='detail-value'>{selectedLog.parsed.client_ip}</span>
                        </div>
                      )}
                      {selectedLog.parsed.user_code && (
                        <div className='detail-item'>
                          <span className='detail-label'>사용자 코드:</span>
                          <span className='detail-value'>{selectedLog.parsed.user_code}</span>
                        </div>
                      )}
                      {selectedLog.parsed.team_code && (
                        <div className='detail-item'>
                          <span className='detail-label'>팀 코드:</span>
                          <span className='detail-value'>{selectedLog.parsed.team_code}</span>
                        </div>
                      )}
                      {selectedLog.parsed.user_agent && (
                        <div className='detail-item full-width'>
                          <span className='detail-label'>User Agent:</span>
                          <span className='detail-value'>{selectedLog.parsed.user_agent}</span>
                        </div>
                      )}
                      {selectedLog.parsed.error_message && (
                        <div className='detail-item full-width error'>
                          <span className='detail-label'>에러 메시지:</span>
                          <span className='detail-value'>{selectedLog.parsed.error_message}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className='log-detail-section'>
                <h4>원본 JSON</h4>
                <pre className='json-viewer'>
                  {JSON.stringify(selectedLog.parsed || JSON.parse(selectedLog.message || '{}'), null, 2)}
                </pre>
              </div>
            </div>
            
            <div className='dashboard-modal-footer'>
              <button className='dashboard-btn-secondary' onClick={handleCloseLogDetailModal}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_Dashboard;
