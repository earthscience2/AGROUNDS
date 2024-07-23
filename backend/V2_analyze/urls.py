# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    # 로그인
    path("player_analyze/", views.playerAnalyze.as_view()),
]