import client from "../../../client";

// quarter_code로 비디오 목록 조회
const GetVideosByQuarterApi = (quarterCode) => {
  return client.get(`/api/video/get-videos-by-quarter/`, {
    params: { quarter_code: quarterCode }
  });
};

// 특정 비디오 상세 정보 조회
const GetVideoDetailApi = (videoCode) => {
  return client.get(`/api/video/get-video-detail/${videoCode}/`);
};

export {
  GetVideosByQuarterApi,
  GetVideoDetailApi
};
