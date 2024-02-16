# 필수
from django.urls import path, include
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # 로그인
    path("login/", views.login.as_view()),
    # 일반 회원가입
    path("signup/", views.signup.as_view()),
    # 회원가입/닉네임 중복 확인
    path("nickname/", views.nickname.as_view()),
    # 카카오 회원가입
    path("kakao/", views.kakao.as_view()),
    # 구글 회원가입
    path("google/", views.google.as_view()),
    # 카카오, 구글 인증
    path("allauth/", include("allauth.urls")),
    # 카카오, 구글 회원가입(추가입력사항)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
