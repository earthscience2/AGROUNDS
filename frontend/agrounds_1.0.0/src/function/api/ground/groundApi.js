import client from "../../../client";

// 경기장 코드로 경기장 정보 조회
const GetGroundSearchApi = (groundCode) => {
  return client.get(`/api/ground/search/`, {
    params: { ground_code: groundCode }
  });
};

// 경기장 목록 조회 (검색 기능 포함)
const GetGroundListApi = (params = {}) => {
  const { search, page = 1, page_size = 20 } = params;
  
  const queryParams = {
    page,
    page_size
  };
  
  if (search && search.trim()) {
    queryParams.search = search.trim();
  }
  
  return client.get(`/api/ground/list/`, {
    params: queryParams
  });
};

// 사용자가 분석을 진행한 경기장 목록 조회
const GetUserAnalysisGroundsApi = (userCode, limit = 10) => {
  return client.get(`/api/ground/user-analysis/`, { 
    params: { user_code: userCode, limit } 
  });
};

// 카카오맵 API 키 조회
const GetKakaoMapKeyApi = () => {
  return client.get(`/api/ground/kakao-map-key/`);
};

// 경기장 생성
const CreateGroundApi = (groundData) => {
  return client.post(`/api/ground/create/`, groundData);
};

export {
  GetGroundSearchApi,
  GetGroundListApi,
  GetUserAnalysisGroundsApi,
  GetKakaoMapKeyApi,
  CreateGroundApi
};
