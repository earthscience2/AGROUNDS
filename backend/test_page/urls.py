# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("get-quarter-number/", views.getQuarterNumber.as_view()),
    path("ai-summation/", views.aiSummation.as_view()),
    path("analyze-data/", views.analyzeData.as_view()),
    path("player-replay-video/", views.playerReplayVideo.as_view()),
    path("team-replay-video/", views.teamReplayVideo.as_view()),
    path("full-replay-video/", views.fullReplayVideo.as_view()),
]