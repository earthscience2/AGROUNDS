# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("team/", views.maketeam.as_view()),
    path("update/",views.update_team.as_view()),
    path("main/",views.TeamMain.as_view())
]
