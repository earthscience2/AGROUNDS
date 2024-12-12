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

    # # 카카오 회원가입
    path("kakao/", views.kakao.as_view()),
    path("kakao/callback/", views.kakaoCallback.as_view()),
    path("kakao/signup/", views.kakaoSignup.as_view()),
    # path("get-user-info/", views.getUserInfo.as_view()),
]