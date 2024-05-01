# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("main/",views.V2TeamMainAPI.as_view()),
    path("create/", views.TeamMakeTeamAPI.as_view()),
    path("update/",views.TeamUpdateTeamAPI.as_view()),
]
