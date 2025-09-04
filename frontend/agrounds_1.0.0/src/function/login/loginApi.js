import client from "../../client";

// 카카오 로그인
const KakaoLoginApi = (hostname, client) => {
  return client.get(`/api/login/kakao/`, {
    params: { hostname, client }
  });
};

// 카카오 회원가입
const KakaoSignupApi = (data) => {
  return client.post(`/api/login/kakao/signup/`, data);
};

// 네이버 로그인
const NaverLoginApi = (hostname, client) => {
  return client.get(`/api/login/naver/`, {
    params: { hostname, client }
  });
};

// 네이버 회원가입
const NaverSignupApi = (data) => {
  return client.post(`/api/login/naver/signup/`, data);
};

// 애플 로그인
const AppleLoginApi = (hostname, client) => {
  return client.get(`/api/login/apple/`, {
    params: { hostname, client }
  });
};

// 애플 회원가입
const AppleSignupApi = (data) => {
  return client.post(`/api/login/apple/signup/`, data);
};

// 이메일 존재 여부 확인
const CheckUserExistsApi = (email, id, loginType) => {
  return client.get(`/api/login/check-user-exists/`, {
    params: { email, id, login_type: loginType }
  });
};

// 토큰으로 사용자 정보 조회
const GetUserInfoForTokenApi = () => {
  return client.get(`/api/login/get-user-info/`);
};

export {
  KakaoLoginApi,
  KakaoSignupApi,
  NaverLoginApi,
  NaverSignupApi,
  AppleLoginApi,
  AppleSignupApi,
  CheckUserExistsApi,
  GetUserInfoForTokenApi
};
