import client from "../../../client";

// 공지사항 목록 조회 API
const getAnnouncementList = () => {
  return client.get(`/api/user/announcement/list/`);
};

// 공지사항 상세 조회 API
const getAnnouncementDetail = (announcementId) => {
  return client.get(`/api/user/announcement/detail/`, {
    params: { announcement_id: announcementId }
  });
};

// 공지사항 읽음 처리 API
const markAnnouncementAsRead = (announcementId) => {
  return client.post(`/api/user/announcement/read/`, {
    announcement_id: announcementId
  });
};

// 공지사항 전체 읽음 처리 API
const markAllAnnouncementsAsRead = () => {
  return client.post(`/api/user/announcement/read-all/`);
};

// 더미 데이터 반환 함수 (임시)
const announcementApi = () => {
  return [
    {
      id: 1,
      title: '시스템 점검 안내',
      content: '2024년 1월 20일 02:00-04:00 시스템 점검 예정입니다.',
      created_at: '2024-01-15',
      is_read: false,
      priority: 'high'
    },
    {
      id: 2,
      title: '새로운 기능 업데이트',
      content: '경기 분석 기능이 업데이트되었습니다.',
      created_at: '2024-01-10',
      is_read: true,
      priority: 'normal'
    },
    {
      id: 3,
      title: '이벤트 안내',
      content: '신규 가입자 대상 이벤트를 진행합니다.',
      created_at: '2024-01-05',
      is_read: false,
      priority: 'normal'
    }
  ];
};

export {
  getAnnouncementList,
  getAnnouncementDetail,
  markAnnouncementAsRead,
  markAllAnnouncementsAsRead,
  announcementApi
};
