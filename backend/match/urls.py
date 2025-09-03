# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("add-match-info/", views.addMatchInfo.as_view()),
    path("get-match-detail/", views.GetMatchDetailView.as_view()),
]
