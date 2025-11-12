import client from "../../../client";

// S3에서 데이터 파일 목록 조회
const GetS3DataFilesApi = () => {
  return client.get(`/api/upload/s3-data-files/`);
};

// 사용자 업로드 파일 목록 조회 (Upload 모델 사용)
const GetUserUploadFilesApi = (userCode) => {
  return client.get(`/api/user/upload-list/`, {
    params: { user_code: userCode }
  });
};

// 팀 업로드 파일 목록 조회 (team_code로 Upload.user_code 조회)
const GetTeamUploadFilesApi = (teamCode) => {
  return client.get(`/api/user/team-upload-list/`, {
    params: { team_code: teamCode }
  });
};

// 선택된 데이터 파일로 경기 분석 시작
const StartAnalysisWithDataApi = (userCode, fileName) => {
  return client.post(`/api/upload/start-analysis/`, {
    user_code: userCode,
    file_name: fileName
  });
};

// S3에서 파일 내용 조회
const GetS3FileContentApi = (fileUrl) => {
  return client.get(`/api/upload/s3-file-content/`, {
    params: { file_url: fileUrl }
  });
};

// S3에서 Raw 파일 내용 조회 (CORS 문제 해결용)
const GetS3RawFileContentApi = (fileUrl) => {
  return client.get(`/api/upload/s3-raw-file-content/`, {
    params: { file_url: fileUrl }
  });
};

export {
  GetS3DataFilesApi,
  GetUserUploadFilesApi,
  GetTeamUploadFilesApi,
  StartAnalysisWithDataApi,
  GetS3FileContentApi,
  GetS3RawFileContentApi
};
