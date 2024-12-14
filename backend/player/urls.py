
from django.urls import path, include
from . import views

urlpatterns = [
    path("join-team/", views.joinTeam.as_view()),
    path("search-player-by-nickname/", views.searchPlayerByNickname.as_view()),
    path("withdraw-team/", views.withdrawTeam.as_view())
]