import client from "../../../client";

// 경기장 검색
const findStadium = (data) => {
  return client.post('/api/ground/search-grounds/', data);
};

// 좌표 정보 조회
const getCoordinate = (data) => {
  return client.post('/api/ground/get-coordinate/', data);
};

// 매치 정보 추가
const AddMatchInfo = (data) => {
  return client.post('/api/upload/add-match-info/', data);
};

export {
  findStadium,
  getCoordinate,
  AddMatchInfo
};
