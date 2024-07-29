# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    # 개인분석
    path("team_gps_sse/", views.teamGpsSSE.as_view()),
]