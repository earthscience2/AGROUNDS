import client from "../../../client";

// 경기 이름 수정
const UpdateMatchNameApi = (userCode, matchCode, newName) => {
  return client.post(`/api/match/update-match-name/`, {
    user_code: userCode,
    match_code: matchCode,
    new_name: newName
  });
};

// 경기 삭제
const DeleteMatchApi = (userCode, matchCode) => {
  return client.post(`/api/match/delete-match/`, {
    user_code: userCode,
    match_code: matchCode
  });
};

// 특정 매치 상세 정보 조회
const GetMatchDetailApi = (userCode, matchCode) => {
  return client.get(`/api/match/get-match-detail/`, {
    params: { 
      user_code: userCode,
      match_code: matchCode 
    }
  });
};

// 쿼터 이름 변경
const UpdateQuarterNameApi = (userCode, matchCode, quarterNumber, newName) => {
  return client.post(`/api/match/update-quarter-name/`, {
    user_code: userCode,
    match_code: matchCode,
    quarter_number: quarterNumber,
    new_name: newName
  });
};

// 쿼터 삭제
const DeleteQuarterApi = (userCode, matchCode, quarterNumber) => {
  return client.post(`/api/match/delete-quarter/`, {
    user_code: userCode,
    match_code: matchCode,
    quarter_number: quarterNumber
  });
};

// 사용자별 경기 목록 조회
const GetUserMatchesApi = (userCode) => {
  return client.get(`/api/match/get-user-matches/`, {
    params: { 
      user_code: userCode
    }
  });
};

export {
  UpdateMatchNameApi,
  DeleteMatchApi,
  GetMatchDetailApi,
  GetUserMatchesApi,
  UpdateQuarterNameApi,
  DeleteQuarterApi
};
