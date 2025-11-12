import client from "../../../client";

// ===========================================
// 공지사항 (Notice) APIs
// ===========================================

// 공지사항 목록 조회 API
const getNoticeList = (page = 1, pageSize = 20) => {
  return client.get('/api/user/content/notice/list/', {
    params: { page, page_size: pageSize }
  });
};

// ===========================================
// 이벤트 (Event) APIs
// ===========================================

// 이벤트 목록 조회 API
const getEventList = (page = 1, pageSize = 20, status = 'all') => {
  return client.get('/api/user/content/event/list/', {
    params: { page, page_size: pageSize, status }
  });
};

// ===========================================
// 문의사항 (Inquiry) APIs
// ===========================================

// 문의사항 목록 조회 API
const getInquiryList = (userCode, page = 1, pageSize = 20) => {
  return client.get('/api/user/content/inquiry/list/', {
    params: { user_code: userCode, page, page_size: pageSize }
  });
};

// 문의사항 작성 API
const createInquiry = (inquiryData) => {
  return client.post('/api/user/content/inquiry/create/', inquiryData);
};

// ===========================================
// 컨텐츠 공통 APIs
// ===========================================

// 컨텐츠 상세 조회 API
const getContentDetail = (contentCode, userCode = null) => {
  const params = { content_code: contentCode };
  if (userCode) {
    params.user_code = userCode;
  }
  return client.get('/api/user/content/detail/', { params });
};

// ===========================================
// 댓글 (Comment) APIs
// ===========================================

// 댓글 작성 API
const createComment = (contentCode, userCode, comment, parentCommentCode = null) => {
  return client.post('/api/user/content/comment/create/', {
    content_code: contentCode,
    user_code: userCode,
    comment: comment,
    parent_comment_code: parentCommentCode
  });
};

// 댓글 삭제 API
const deleteComment = (commentCode, userCode) => {
  return client.delete('/api/user/content/comment/delete/', {
    data: {
      comment_code: commentCode,
      user_code: userCode
    }
  });
};

// ===========================================
// 좋아요 (Like) APIs
// ===========================================

// 좋아요 토글 API
const toggleLike = (userCode, targetType, targetCode, action = 'like') => {
  return client.post('/api/user/content/like/toggle/', {
    user_code: userCode,
    target_type: targetType,
    target_code: targetCode,
    action: action
  });
};

// ===========================================
// 레거시 함수들 (하위 호환성 유지)
// ===========================================

// 더미 데이터 반환 함수 (임시 - 하위 호환성 유지)
const announcementApi = () => {
  return [
    {
      id: 1,
      title: '시스템 점검 안내',
      content: '2024년 1월 20일 02:00-04:00 시스템 점검 예정입니다.',
      date: '2024-01-15',
      category: '점검',
      isImportant: true
    },
    {
      id: 2,
      title: '새로운 기능 업데이트',
      content: '경기 분석 기능이 업데이트되었습니다.',
      date: '2024-01-10',
      category: '업데이트',
      isImportant: false
    },
    {
      id: 3,
      title: '이벤트 안내',
      content: '신규 가입자 대상 이벤트를 진행합니다.',
      date: '2024-01-05',
      category: '이벤트',
      isImportant: false
    }
  ];
};

export {
  // 공지사항
  getNoticeList,
  // 이벤트
  getEventList,
  // 문의사항
  getInquiryList,
  createInquiry,
  // 공통
  getContentDetail,
  // 댓글
  createComment,
  deleteComment,
  // 좋아요
  toggleLike,
  // 레거시
  announcementApi
};
