# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("main/",views.V2_TeamMainAPI.as_view()),
    path("create/", views.V2_TeamMakeTeamAPI.as_view()),
    path("update/",views.V2_TeamUpdateTeamAPI.as_view()),
    path("searchbycode/",views.TeamSearchByTeamcodeAPI.as_view()),
    path("searchbyname/",views.TeamSearchByTeamnameAPI.as_view()),
    path("join-team/",views.V2_JoinTeamAPI.as_view()),
]
