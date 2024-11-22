
from django.urls import path, include
from . import views

urlpatterns = [
    path("main/", views.getPlayerInfo.as_view()),
    path("SearchUsermatchInfoByUsercode/", views.MatchInfoUserAPIView.as_view()),
    path("SearchTeammatchInfoByUsercode/", views.MatchInfoAsTeamAPIView.as_view()),
]