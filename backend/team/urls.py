# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("team/", views.TeamMakeTeamAPI.as_view()),
    path("update/",views.TeamUpdateTeamAPI.as_view()),
    path("main/",views.TeamMainAPI.as_view()),
    path("search/",views.TeamSearchAPIView.as_view()),
    path("more/",views.TeamMoreInfoAPI.as_view()),
    path("moremore/",views.TeamPlayerMoreInfoView.as_view()),
]
