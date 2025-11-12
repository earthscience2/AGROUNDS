import client from "../../../client";

// 관리자 로그인 API
const AdminLoginApi = (userId, password) => {
  return client.post('api/user/admin/login/', {
    user_id: userId,
    password: password
  });
};

// ===========================================
// 관리자 컨텐츠 관리 APIs
// ===========================================

// 공지사항/이벤트 생성 API
const AdminContentCreate = (contentData) => {
  return client.post('api/user/admin/content/create/', contentData);
};

// 공지사항/이벤트 수정 API
const AdminContentUpdate = (contentData) => {
  return client.put('api/user/admin/content/update/', contentData);
};

// 공지사항/이벤트 삭제 API
const AdminContentDelete = (adminUserCode, contentCode) => {
  return client.delete('api/user/admin/content/delete/', {
    data: {
      admin_user_code: adminUserCode,
      content_code: contentCode
    }
  });
};

// ===========================================
// 관리자 문의사항 관리 APIs
// ===========================================

// 전체 문의사항 목록 조회 API
const AdminInquiryList = (adminUserCode, page = 1, pageSize = 20, status = null) => {
  const params = {
    admin_user_code: adminUserCode,
    page,
    page_size: pageSize
  };
  
  if (status) {
    params.status = status;
  }
  
  return client.get('api/user/admin/inquiry/list/', { params });
};

// 문의사항 답변 API
const AdminInquiryAnswer = (answerData) => {
  return client.post('api/user/admin/inquiry/answer/', answerData);
};

// ===========================================
// 관리자 로그 조회 APIs
// ===========================================

// CloudWatch 로그 조회 API
const AdminLogsQuery = (adminUserCode, filters = {}) => {
  const params = {
    admin_user_code: adminUserCode,
    ...filters
  };
  
  return client.get('api/user/admin/logs/query/', { params });
};

export {
  AdminLoginApi,
  // 컨텐츠 관리
  AdminContentCreate,
  AdminContentUpdate,
  AdminContentDelete,
  // 문의사항 관리
  AdminInquiryList,
  AdminInquiryAnswer,
  // 로그 조회
  AdminLogsQuery
};
