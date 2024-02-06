#필수
from django.urls import path,include
from . import views

urlpatterns = [
    path('nickname/', views.nickname.as_view()),
    path('kakao/', views.kakao.as_view()),
    #닉네임 중복 확인/reverse-word/?word=입력단어
    path('allauth/',include('allauth.urls')),
    path('google/',views.google.as_view()),
]