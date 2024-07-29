# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    # 개인분석
    path("player_analyze/", views.playerAnalyze.as_view()),
]