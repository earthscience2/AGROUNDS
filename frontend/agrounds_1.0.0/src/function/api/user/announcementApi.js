import client from "../../../client";

// 공지사항 조회
const announcementApi = () => {
  return client.get('/api/manage/announcement/')
    .then((response) => {
      return response.data.result;
    })
    .catch(() => {
      return 'error 발생';
    });
};

export {
  announcementApi
};
