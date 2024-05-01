# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("main/",views.V2_TeamMainAPI.as_view()),
    path("create/", views.V2_TeamMakeTeamAPI.as_view()),
    path("update/",views.V2_TeamUpdateTeamAPI.as_view()),
]
