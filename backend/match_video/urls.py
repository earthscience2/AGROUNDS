# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path('get-video-summation/', views.getVideoSummation.as_view()),
    path('get-player-video-list/', views.getPlayerVideoList.as_view()),
    path('get-team-video-list/', views.getTeamVideoList.as_view()),
    path('get-full-video-list/', views.getFullVideoList.as_view()),
    path('get-match-video-info/', views.getMatchVideoInfo.as_view()),
]
