# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("beforematch/", views.Before_makematch.as_view()),
    path("aftermatch/", views.After_makematch.as_view()),
    path("main/",views.MatchMain.as_view()),
]
