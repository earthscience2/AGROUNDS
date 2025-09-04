import client from "../../../client";

// 사용자 정보 조회 API
const GetUserInfoApi = (userCode) => {
  return client.get('api/user/get-user-info/', {
    params: { user_code: userCode }
  });
};

// 사용자 정보 수정 API
const EditUserInfoApi = (data) => {
  return client.patch('api/user/get-user-info/', data);
};

// 사용자 삭제 API (회원 탈퇴)
const DeleteUserApi = () => {
  return client.delete('api/user/delete-user/');
};

export {
  GetUserInfoApi,
  EditUserInfoApi,
  DeleteUserApi
};
