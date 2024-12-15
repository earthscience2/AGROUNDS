# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path('get-match-list/', views.getMatchList.as_view()),
    path('get-team-match-list/', views.getTeamMatchList.as_view()),
]
