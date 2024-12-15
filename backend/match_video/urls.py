# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path('get-video-summation/', views.getVideoSummation.as_view()),
    path('get-player-video-list/', views.getPlayerVideoList.as_view()),
    path('get-team-video-list/', views.getTeamVideoList.as_view())
]
