import client from "../../../client";

// 경기장 코드로 경기장 정보 조회
const GetGroundSearchApi = (groundCode) => {
  return client.get(`/api/ground/search/`, {
    params: { ground_code: groundCode }
  });
};

export {
  GetGroundSearchApi
};
