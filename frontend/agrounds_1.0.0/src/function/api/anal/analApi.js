import client from "../../../client";

// 최근 5경기 OVR 데이터 조회
const GetUserOvrLast5MatchesApi = (userCode) => {
  return client.get(`/api/anal/get-ovr-last-5-matches/`, {
    params: { user_code: userCode }
  });
};

// 최근 5경기 통계 데이터 조회
const GetUserPointLast5MatchesApi = (userCode) => {
  return client.get(`/api/anal/get-point-last-5-matches/`, {
    params: { user_code: userCode }
  });
};

// 쿼터별 분석 데이터 조회 (히트맵, 스프린트, 방향전환 포함)
const GetQuarterDataApi = (userCode, quarterCode) => {
  return client.get(`/api/anal/get-quarter-data/`, {
    params: { 
      user_code: userCode,
      quarter_code: quarterCode
    }
  });
};

export {
  GetUserOvrLast5MatchesApi,
  GetUserPointLast5MatchesApi,
  GetQuarterDataApi
};
