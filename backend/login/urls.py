# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    # 로그인
    # path("login/", views.Login.as_view()),
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
    # 이메일 존재 여부 확인
    path("check-user-exists/", views.check_user_exists.as_view()),
    # 사용자 정보 조회
    path("get-user-info/", views.Get_UserInfo_For_Token.as_view()),
]