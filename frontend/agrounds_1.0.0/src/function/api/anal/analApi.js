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

// 팀 분석 관련 API 함수들
// 팀 AI 요약 정보 조회
const GetTeamAiSummaryApi = (matchCode) => {
  return client.get(`/api/match/get-team-ai-summary/`, {
    params: { 
      match_code: matchCode
    }
  });
};

// 팀 경기 전체 분석 결과 조회
const GetTeamAnalysisDataApi = (matchCode, userCode = null) => {
  const params = { match_code: matchCode };
  if (userCode) {
    params.user_code = userCode;
  }
  return client.get(`/api/match/get-team-analysis-data/`, {
    params: params
  });
};

// 팀 참여 선수들의 개인 분석 결과 조회
const GetTeamPlayerAnalysisDataApi = (matchCode) => {
  return client.get(`/api/match/get-team-player-analysis-data/`, {
    params: { 
      match_code: matchCode
    }
  });
};

// 팀 쿼터 상세 분석 데이터 조회
const GetTeamQuarterDetailApi = (quarterCode) => {
  return client.get(`/api/match/get-team-quarter-detail/`, {
    params: { 
      quarter_code: quarterCode
    }
  });
};

// 팀 선수 쿼터 분석 데이터 조회 (TeamPlayerAnal 기반)
const GetTeamPlayerQuarterDataApi = (teamQuarterCode, userCode) => {
  return client.get(`/api/match/get-team-player-quarter-data/`, {
    params: { 
      team_quarter_code: teamQuarterCode,
      user_code: userCode
    }
  });
};

export {
  GetUserOvrLast5MatchesApi,
  GetUserPointLast5MatchesApi,
  GetQuarterDataApi,
  GetTeamAiSummaryApi,
  GetTeamAnalysisDataApi,
  GetTeamPlayerAnalysisDataApi,
  GetTeamQuarterDetailApi,
  GetTeamPlayerQuarterDataApi
};
