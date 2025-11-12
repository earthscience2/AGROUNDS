import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoBellNav from '../../../../components/Logo_bell_Nav';
import '../../css/common/Inquiry.scss';
import { getInquiryList, createInquiry, getContentDetail } from '../../../../function/api/user/announcementApi';
import { InquiryDetailModal } from '../../../../components/Modal/variants';

// 아이콘 import (디자인 시스템 승인 아이콘)
import paperIcon from '../../../../assets/common/ico_paper.png';
import backIcon from '../../../../assets/main_icons/back_black.png';
import downArrowIcon from '../../../../assets/main_icons/down_gray.png';

const Inquiry = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'list'
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [userCode, setUserCode] = useState('');

  // 문의 작성 폼 상태
  const [inquiryForm, setInquiryForm] = useState({
    category: '',
    title: '',
    content: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const categoryOptions = [
    { value: '', label: '문의 유형을 선택해주세요' },
    { value: 'app_feature', label: '기능 문의' },
    { value: 'bug_report', label: '오류 신고' },
    { value: 'account', label: '계정 문의' },
    { value: 'payment', label: '결제 문의' },
    { value: 'match_analysis', label: '경기 분석 문의' },
    { value: 'team', label: '팀 관련 문의' },
    { value: 'suggestion', label: '제안/건의' },
    { value: 'other', label: '기타' }
  ];

  useEffect(() => {
    // 사용자 코드 가져오기
    const storedUserCode = sessionStorage.getItem('userCode');
    if (storedUserCode) {
      setUserCode(storedUserCode);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'list' && userCode) {
      fetchInquiries();
    }
  }, [activeTab, userCode]);

  // 카테고리 메뉴 외부 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategoryMenu && !event.target.closest('.category-dropdown')) {
        setShowCategoryMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryMenu]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await getInquiryList(userCode, 1, 20);
      if (response.data && response.data.results) {
        setInquiries(response.data.results);
      }
    } catch (error) {
      console.error('문의사항 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setInquiryForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 초기화
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCategoryChange = (value) => {
    handleInputChange('category', value);
    setShowCategoryMenu(false);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!inquiryForm.category) {
      errors.category = '문의 유형을 선택해주세요';
    }
    if (!inquiryForm.title.trim()) {
      errors.title = '제목을 입력해주세요';
    }
    if (!inquiryForm.content.trim()) {
      errors.content = '문의 내용을 입력해주세요';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !userCode) {
      return;
    }
    
    setLoading(true);
    
    try {
      const inquiryData = {
        user_code: userCode,
        inquiry_type: inquiryForm.category,
        title: inquiryForm.title,
        content: inquiryForm.content,
        is_private: true
      };

      await createInquiry(inquiryData);
      alert('문의가 성공적으로 접수되었습니다.\n빠른 시일 내에 답변드리겠습니다.');
      
      setInquiryForm({
        category: '',
        title: '',
        content: ''
      });
      
      // 문의 내역 탭으로 이동
      setActiveTab('list');
    } catch (error) {
      console.error('문의사항 작성 실패:', error);
      alert('문의 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleInquiryClick = async (inquiry) => {
    try {
      const response = await getContentDetail(inquiry.content_code, userCode);
      if (response.data) {
        setSelectedInquiry(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('문의사항 상세 조회 실패:', error);
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedInquiry(null);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '답변 대기';
      case 'in_progress':
        return '처리 중';
      case 'completed':
        return '답변 완료';
      case 'rejected':
        return '반려';
      default:
        return '처리중';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'in_progress':
        return '#3b82f6';
      case 'completed':
        return '#079669';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6B7078';
    }
  };

  const getInquiryTypeText = (type) => {
    const option = categoryOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className='inquiry'>
      <LogoBellNav logo={true} />
      
      <div className="inquiry-header-container">
        <div className="header">
          <div className="header-actions">
            <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <img src={backIcon} alt="뒤로가기" />
            </button>
            <div className="empty-space"></div>
          </div>
          <div className="header-content">
            <h1 className="text-h2">문의사항</h1>
            <p className="subtitle text-body">궁금한 점을 문의해주세요</p>
          </div>
        </div>
      </div>
      
      <div className='content-container'>
        <div className='tab-navigation'>
          <button 
            className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            문의하기
          </button>
          <button 
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            문의 내역
          </button>
        </div>

        {activeTab === 'new' ? (
          <div className='inquiry-form'>
            <div className='form-section'>
              <h3>문의사항을 작성해주세요</h3>
              <p>친절하고 신속하게 답변드리겠습니다</p>
            </div>

            <div className='form-group'>
              <label className='form-label'>문의 유형 *</label>
              <div className='category-dropdown'>
                <button 
                  type='button'
                  className={`category-btn ${formErrors.category ? 'error' : ''} ${inquiryForm.category ? 'selected' : ''}`}
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  aria-label='문의 유형 선택'
                >
                  <span>{categoryOptions.find(opt => opt.value === inquiryForm.category)?.label || '문의 유형을 선택해주세요'}</span>
                  <img src={downArrowIcon} alt='선택' className='dropdown-icon' />
                </button>
                {showCategoryMenu && (
                  <div className='category-menu'>
                    {categoryOptions.filter(opt => opt.value !== '').map((option) => (
                      <button 
                        key={option.value}
                        type='button'
                        className={`category-option ${inquiryForm.category === option.value ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.category && (
                <span className='error-text'>{formErrors.category}</span>
              )}
            </div>

            <div className='form-group'>
              <label className='form-label'>제목 *</label>
              <input
                className={`form-input ${formErrors.title ? 'error' : ''}`}
                placeholder='문의 제목을 입력해주세요'
                type='text'
                value={inquiryForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
              {formErrors.title && (
                <span className='error-text'>{formErrors.title}</span>
              )}
            </div>

            <div className='form-group'>
              <label className='form-label'>문의 내용 *</label>
              <textarea
                className={`form-textarea ${formErrors.content ? 'error' : ''}`}
                placeholder='문의하실 내용을 자세히 작성해주세요'
                value={inquiryForm.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={6}
              />
              {formErrors.content && (
                <span className='error-text'>{formErrors.content}</span>
              )}
            </div>

            <div className='submit-section'>
              <button
                className='submit-btn'
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? '접수 중...' : '문의하기'}
              </button>
            </div>
          </div>
        ) : (
          <div className='inquiry-list'>
            {loading ? (
              <div className='loading-container'>
                <div className='loading-spinner'></div>
                <p>문의 내역을 불러오는 중...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className='empty-state'>
                <img src={paperIcon} alt='문의 내역 없음' className='empty-icon' />
                <h3>문의 내역이 없습니다</h3>
                <p>궁금한 것이 있으시면 언제든 문의해주세요</p>
              </div>
            ) : (
              <div className='inquiry-items'>
                {inquiries.map((inquiry) => (
                  <div 
                    key={inquiry.content_code} 
                    className='inquiry-item'
                    onClick={() => handleInquiryClick(inquiry)}
                  >
                    <div className='inquiry-header'>
                      <div className='inquiry-meta'>
                        <span className='category-badge'>{getInquiryTypeText(inquiry.inquiry_type)}</span>
                        <span 
                          className='status-badge'
                          style={{ color: getStatusColor(inquiry.status) }}
                        >
                          {getStatusText(inquiry.status)}
                        </span>
                      </div>
                      <span className='inquiry-date'>{formatDate(inquiry.created_at)}</span>
                    </div>
                    
                    <h3 className='inquiry-title'>{inquiry.title}</h3>
                    
                    <div className='inquiry-preview'>
                      <p>{inquiry.content?.substring(0, 100)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <InquiryDetailModal
        isOpen={showDetailModal && !!selectedInquiry}
        inquiry={selectedInquiry}
        typeText={getInquiryTypeText(selectedInquiry?.inquiry_type)}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Inquiry;
