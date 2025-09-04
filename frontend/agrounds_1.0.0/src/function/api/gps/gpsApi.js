import client from "../../../client";

// 경기장 검색 API
const findStadium = (searchTerm) => {
  return client.get(`/api/gps/find-stadium/`, {
    params: { search_term: searchTerm }
  });
};

// 경기장 목록 조회 API
const getStadiumList = () => {
  return client.get(`/api/gps/stadium-list/`);
};

// 경기장 상세 정보 조회 API
const getStadiumDetail = (stadiumId) => {
  return client.get(`/api/gps/stadium-detail/`, {
    params: { stadium_id: stadiumId }
  });
};

// 경기장 위치 정보 조회 API
const getStadiumLocation = (stadiumId) => {
  return client.get(`/api/gps/stadium-location/`, {
    params: { stadium_id: stadiumId }
  });
};

// 경기장 좌표 정보 조회 API
const getCoordinate = (groundCode) => {
  return client.get(`/api/gps/get-coordinate/`, {
    params: { ground_code: groundCode }
  });
};

// 경기 정보 추가 API
const AddMatchInfo = (fieldData) => {
  return client.post(`/api/gps/add-match-info/`, fieldData);
};

export {
  findStadium,
  getStadiumList,
  getStadiumDetail,
  getStadiumLocation,
  getCoordinate,
  AddMatchInfo
};
