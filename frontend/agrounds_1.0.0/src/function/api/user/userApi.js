import client from "../../../client";

// 사용자 정보 수정 (활성화된 API)
const EditUserInfoApi = (data) => {
  return client.patch('api/user/edit-user-info/', data);
};

// 사용자 통합 데이터 조회 (OVR, 통계, 레이더 데이터 포함)
const GetUserAnalysisDataApi = (userCode) => {
  return client.get(`/api/user/get-analysis-data/`, {
    params: { user_code: userCode }
  });
};

// 사용자 데이터 API 엔드포인트들 (백엔드 user 엔드포인트 사용)
const GetUserOvrDataApi = (userCode) => {
  return client.get(`/api/user/get-ovr-data/`, {
    params: { user_code: userCode }
  });
};

const GetUserStatsDataApi = (userCode) => {
  return client.get(`/api/user/get-stats-data/`, {
    params: { user_code: userCode }
  });
};

const GetUserPointDataApi = (userCode) => {
  return client.get(`/api/user/get-point-data/`, {
    params: { user_code: userCode }
  });
};

// 중복 제거: GetUserOvrApi는 GetUserOvrDataApi와 동일하므로 제거
// 중복 제거: GetUserStatsApi는 GetUserStatsDataApi와 동일하므로 제거
// GetUserRadarDataApi는 현재 백엔드에 없으므로 제거

// 사용자 개인 경기 목록 조회
const GetUserPlayerMatchesApi = (userCode, limit = 20) => {
  return client.get(`/api/user/get-player-matches/`, {
    params: { user_code: userCode, limit }
  });
};

// 경기 이름 수정
const UpdateMatchNameApi = (userCode, matchCode, newName) => {
  return client.post(`/api/user/update-match-name/`, {
    user_code: userCode,
    match_code: matchCode,
    new_name: newName
  });
};

// 경기 삭제
const DeleteMatchApi = (userCode, matchCode) => {
  return client.post(`/api/user/delete-match/`, {
    user_code: userCode,
    match_code: matchCode
  });
};

// 특정 매치 상세 정보 조회
const GetMatchDetailApi = (userCode, matchCode) => {
  return client.get(`/api/user/get-match-detail/`, {
    params: { 
      user_code: userCode,
      match_code: matchCode 
    }
  });
};

// 쿼터 이름 변경
const UpdateQuarterNameApi = (userCode, matchCode, quarterNumber, newName) => {
  return client.post(`/api/user/update-quarter-name/`, {
    user_code: userCode,
    match_code: matchCode,
    quarter_number: quarterNumber,
    new_name: newName
  });
};

// 쿼터 삭제
const DeleteQuarterApi = (userCode, matchCode, quarterNumber) => {
  return client.post(`/api/user/delete-quarter/`, {
    user_code: userCode,
    match_code: matchCode,
    quarter_number: quarterNumber
  });
};

export {
  EditUserInfoApi,
  GetUserAnalysisDataApi,
  GetUserOvrDataApi,
  GetUserStatsDataApi,
  GetUserPointDataApi,
  GetUserPlayerMatchesApi,
  UpdateMatchNameApi,
  DeleteMatchApi,
  GetMatchDetailApi,
  UpdateQuarterNameApi,
  DeleteQuarterApi
};
