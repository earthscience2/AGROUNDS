# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("make-team",views.makeTeam.as_view()),
    path("get-team-info/", views.getTeamInfo.as_view()),
]
