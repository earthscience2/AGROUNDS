# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("league/", views.makeleague.as_view()),
    path("main/",views.TeamMain.as_view()),
]
