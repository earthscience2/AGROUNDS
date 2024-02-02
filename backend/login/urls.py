#필수
from django.urls import path
from . import views

urlpatterns = [
    path('nickname/', views.nickname.as_view()),
    path('kakao/', views.kakao.as_view()),
    #닉네임 중복 확인/reverse-word/?word=입력단어
]