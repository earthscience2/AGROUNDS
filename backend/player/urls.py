
from django.urls import path, include
from . import views

urlpatterns = [
    path("main/", views.getPlayerInfo.as_view()),
    path("test/", views.MatchInfoAPIView.as_view()),
]