import client from "../../../client";

// quarter_code로 비디오 목록 조회
const GetVideosByQuarterApi = (quarterCode) => {
  return client.get(`/api/video/get-videos-by-quarter/`, {
    params: { quarter_code: quarterCode }
  });
};

// 특정 비디오 상세 정보 조회
const GetVideoDetailApi = (videoCode) => {
  return client.get(`/api/video/get-video-detail/${videoCode}/`);
};

// 사용자의 비디오 폴더 목록 조회
const GetUserVideoFoldersApi = (userCode) => {
  return client.get(`/api/video/folders/`, {
    params: { user_code: userCode }
  });
};

// 비디오 폴더 생성
const CreateVideoFolderApi = (userCode, folderName) => {
  return client.post(`/api/video/folders/create/`, {
    user_code: userCode,
    name: folderName
  });
};

// 비디오 폴더 이름 수정
const UpdateVideoFolderApi = (userCode, folderCode, newName) => {
  return client.put(`/api/video/folders/${folderCode}/update/`, {
    user_code: userCode,
    name: newName
  });
};

// 비디오 폴더 삭제
const DeleteVideoFolderApi = (userCode, folderCode) => {
  return client.delete(`/api/video/folders/${folderCode}/delete/`, {
    data: { user_code: userCode }
  });
};

// 폴더별 영상 개수 조회
const GetFolderVideoCountApi = (userCode, folderCode) => {
  return client.get(`/api/video/folders/${folderCode}/video-count/`, {
    params: { user_code: userCode }
  });
};

// 폴더별 영상 목록 조회
const GetFolderVideosApi = (userCode, folderCode) => {
  return client.get(`/api/video/folders/${folderCode}/videos/`, {
    params: { user_code: userCode }
  });
};

// 사용자 참여 쿼터 목록 조회
const GetUserQuartersApi = (userCode) => {
  return client.get(`/api/match/get-user-quarters/`, {
    params: { user_code: userCode }
  });
};

// 영상 추가
const CreateVideoApi = (userCode, folderCode, quarterCode, url) => {
  return client.post(`/api/video/create/`, {
    user_code: userCode,
    folder_code: folderCode,
    quarter_code: quarterCode,
    url: url
  });
};

// 영상 삭제
const DeleteVideoApi = (userCode, videoCode) => {
  return client.post(`/api/video/delete/${videoCode}/`, {
    user_code: userCode
  });
};

// 영상 쿼터 변경
const UpdateVideoQuarterApi = (userCode, videoCode, quarterCode) => {
  return client.put(`/api/video/${videoCode}/update/`, {
    user_code: userCode,
    quarter_code: quarterCode
  });
};

// YouTube 업로드 날짜 조회
const GetYouTubeUploadDateApi = (url) => {
  return client.get(`/api/video/youtube-upload-date/`, {
    params: { url }
  });
};

// === 팀 비디오 관련 API ===

// 팀 폴더별 영상 목록 조회
const GetTeamFolderVideosApi = (teamCode, userCode, folderCode) => {
  return client.get(`/api/video/team/folders/${folderCode}/videos/`, {
    params: { 
      team_code: teamCode,
      user_code: userCode 
    }
  });
};

// 팀 영상 추가
const CreateTeamVideoApi = (teamCode, userCode, folderCode, quarterCode, url) => {
  return client.post(`/api/video/team/create/`, {
    team_code: teamCode,
    user_code: userCode,
    folder_code: folderCode,
    quarter_code: quarterCode,
    url: url
  });
};

// 팀 영상 삭제
const DeleteTeamVideoApi = (teamCode, userCode, videoCode) => {
  return client.post(`/api/video/team/delete/${videoCode}/`, {
    team_code: teamCode,
    user_code: userCode
  });
};

export {
  GetVideosByQuarterApi,
  GetVideoDetailApi,
  GetUserVideoFoldersApi,
  CreateVideoFolderApi,
  UpdateVideoFolderApi,
  DeleteVideoFolderApi,
  GetFolderVideoCountApi,
  GetFolderVideosApi,
  GetUserQuartersApi,
  CreateVideoApi,
  DeleteVideoApi,
  UpdateVideoQuarterApi,
  GetYouTubeUploadDateApi,
  // 팀 비디오 관련 API
  GetTeamFolderVideosApi,
  CreateTeamVideoApi,
  DeleteTeamVideoApi
};
