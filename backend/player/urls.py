
from django.urls import path, include
from . import views

urlpatterns = [
    path("get-player-info/", views.getPlayerInfo.as_view()),
    path("join-team/", views.joinTeam.as_view()),
    path("search-individual-player-by-nickname/", views.searchIndividualPlayerByNickname.as_view()),
    path("withdraw-team/", views.withdrawTeam.as_view()),
]