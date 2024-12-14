# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("make-team/",views.makeTeam.as_view()),
    path("get-team-info/", views.getTeamInfo.as_view()),
    path("search-team-by-name/", views.searchTeamByName.as_view()),
    path("get-team-player-list/", views.getTeamPlayerList.as_view()),
    path("invite-player/", views.invitePlayer.as_view()),
]
