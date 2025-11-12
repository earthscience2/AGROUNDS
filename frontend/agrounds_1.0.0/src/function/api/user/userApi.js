import client from "../../../client";

// 사용자 정보 조회 API
const GetUserInfoApi = (userCode) => {
  return client.get('/api/user/get-user-info/', {
    params: { user_code: userCode }
  });
};

// 사용자 정보 수정 API
const EditUserInfoApi = (data) => {
  return client.patch('/api/user/get-user-info/', data);
};

// 사용자 삭제 API (회원 탈퇴)
const DeleteUserApi = () => {
  return client.delete('/api/user/delete-user/');
};

// 프로필 이미지 업로드 API
const UploadProfileImageApi = (userCode, imageFile) => {
  const formData = new FormData();
  formData.append('user_code', userCode);
  formData.append('image', imageFile);
  
  return client.post('/api/user/profile-image/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 프로필 이미지 조회 API
const GetProfileImageApi = (userCode) => {
  return client.get('/api/user/profile-image/get/', {
    params: { user_code: userCode }
  });
};

// 유저 검색 API
const SearchUsersApi = (searchTerm = '', page = 1, pageSize = 20) => {
  const params = {
    page: page,
    page_size: pageSize
  };
  
  if (searchTerm.trim()) {
    params.search = searchTerm.trim();
  }
  
  return client.get('/api/user/search/', {
    params: params
  });
};

// 팀 검색 API
const SearchTeamsApi = (searchTerm = '', page = 1, pageSize = 20) => {
  const params = {
    page: page,
    page_size: pageSize
  };
  
  if (searchTerm.trim()) {
    params.search = searchTerm.trim();
  }
  
  return client.get('/api/user/team/search/', {
    params: params
  });
};

// 추천 팀 목록 API
const GetRecommendedTeamsApi = (limit = 10) => {
  return client.get('/api/user/team/recommendations/', {
    params: { limit: limit }
  });
};

// 팀 로고 업로드 API
const UploadTeamLogoApi = (teamCode, imageFile) => {
  const formData = new FormData();
  formData.append('team_code', teamCode);
  formData.append('image', imageFile);
  
  return client.post('/api/user/team/logo/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 팀 로고 조회 API
const GetTeamLogoApi = (teamCode) => {
  return client.get('/api/user/team/logo/get/', {
    params: { team_code: teamCode }
  });
};

// 팀 생성 API
const CreateTeamApi = (teamData) => {
  return client.post('/api/user/team/create/', {
    team_name: teamData.teamName,
    location: teamData.location,
    description: teamData.description,
    user_code: sessionStorage.getItem('userCode')
  });
};

// 내 팀 정보 조회 API
const GetMyTeamInfoApi = (userCode) => {
  return client.get('/api/user/team/my-team/', {
    params: { user_code: userCode }
  });
};

const GetTeamMembersApi = (teamCode, userCode) => {
  return client.get('/api/user/team/members/', {
    params: { 
      team_code: teamCode,
      user_code: userCode 
    }
  });
};

// 팀 경기 목록 조회 API
const GetTeamMatchesApi = (teamCode, userCode) => {
  return client.get('/api/user/team/matches/', {
    params: { 
      team_code: teamCode,
      user_code: userCode 
    }
  });
};

// 팀 비디오 폴더 목록 조회 API
const GetTeamVideoFoldersApi = (teamCode, userCode) => {
  return client.get('/api/video/team/folders/', {
    params: { 
      team_code: teamCode,
      user_code: userCode 
    }
  });
};

// 팀 비디오 폴더 생성 API
const CreateTeamVideoFolderApi = (teamCode, userCode, folderName) => {
  return client.post('/api/video/team/folders/create/', {
    team_code: teamCode,
    user_code: userCode,
    folder_name: folderName
  });
};

// 팀 비디오 폴더 수정 API
const UpdateTeamVideoFolderApi = (teamCode, userCode, folderCode, folderName) => {
  return client.put('/api/video/team/folders/update/', {
    team_code: teamCode,
    user_code: userCode,
    folder_code: folderCode,
    folder_name: folderName
  });
};

// 팀 비디오 폴더 삭제 API
const DeleteTeamVideoFolderApi = (teamCode, userCode, folderCode) => {
  return client.delete('/api/video/team/folders/delete/', {
    data: {
      team_code: teamCode,
      user_code: userCode,
      folder_code: folderCode
    }
  });
};

// 팀 정보 수정 API
const UpdateTeamInfoApi = (teamData) => {
  return client.put('/api/user/team/update/', {
    team_code: teamData.teamCode,
    team_name: teamData.teamName,
    location: teamData.location,
    description: teamData.description,
    user_code: sessionStorage.getItem('userCode')
  });
};

// 팀원 등번호 수정 API
const UpdateTeamMemberNumberApi = (teamCode, userCode, targetUserCode, number) => {
  return client.put('/api/user/team/member/number/', {
    team_code: teamCode,
    user_code: userCode,
    target_user_code: targetUserCode,
    number: number
  });
};

// 팀원 역할 수정 API
const UpdateTeamMemberRoleApi = (teamCode, userCode, targetUserCode, role) => {
  return client.put('/api/user/team/member/role/', {
    team_code: teamCode,
    user_code: userCode,
    target_user_code: targetUserCode,
    role: role
  });
};

// ===========================================
// 알림 (Notification) APIs
// ===========================================

// 알림 목록 조회 API
const GetNotificationListApi = (userCode, page = 1, pageSize = 20, isRead = null, category = null) => {
  const params = {
    user_code: userCode,
    page: page,
    page_size: pageSize
  };
  
  if (isRead !== null) {
    params.is_read = isRead;
  }
  
  if (category) {
    params.category = category;
  }
  
  return client.get('/api/user/notification/list/', { params });
};

// 알림 읽음 처리 API
const MarkNotificationAsReadApi = (userCode, notificationId) => {
  return client.post('/api/user/notification/mark-read/', {
    user_code: userCode,
    notification_id: notificationId
  });
};

// 모든 알림 읽음 처리 API
const MarkAllNotificationsAsReadApi = (userCode) => {
  return client.post('/api/user/notification/mark-all-read/', {
    user_code: userCode
  });
};

export {
  GetUserInfoApi,
  EditUserInfoApi,
  DeleteUserApi,
  UploadProfileImageApi,
  GetProfileImageApi,
  SearchUsersApi,
  SearchTeamsApi,
  GetRecommendedTeamsApi,
  UploadTeamLogoApi,
  GetTeamLogoApi,
  CreateTeamApi,
  GetMyTeamInfoApi,
  GetTeamMembersApi,
  GetTeamMatchesApi,
  GetTeamVideoFoldersApi,
  CreateTeamVideoFolderApi,
  UpdateTeamVideoFolderApi,
  DeleteTeamVideoFolderApi,
  UpdateTeamInfoApi,
  UpdateTeamMemberNumberApi,
  UpdateTeamMemberRoleApi,
  // 알림
  GetNotificationListApi,
  MarkNotificationAsReadApi,
  MarkAllNotificationsAsReadApi
};
