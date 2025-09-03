# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    # 닉네임 중복 확인
    path("nickname/", views.nickname.as_view()),

    # 로그인
    # path("login/", views.login.as_view()),
    # # 일반 회원가입
    # path("signup/", views.signup.as_view()),

    # # 카카오 로그인/회원가입
    path("kakao/", views.kakao.as_view()),
    path("kakao/callback/", views.kakaoCallback.as_view()),
    path("kakao/signup/", views.kakaoSignup.as_view()),
    # 네이버 로그인/회원가입
    path("naver/", views.naver.as_view()),
    path("naver/callback/", views.naverCallback.as_view()),
    path("naver/signup/", views.naverSignup.as_view()),
    # 애플 로그인/회원가입
    path("apple/", views.apple.as_view()),
    path("apple/callback/", views.AppleLoginCallback.as_view()),
    path("apple/signup/", views.AppleSignup.as_view()),
    # 이메일 존재 여부 확인 (v3_user 기준)
    path("check-user-exists/", views.check_user_exists.as_view()),
    path("get-user-info/", views.getUserInfo.as_view()),
    path("get-v3-user-info/", views.getV3UserInfo.as_view()),
]