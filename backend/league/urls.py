# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("make/", views.makeleague.as_view()),
    path("search/", views.searchleague.as_view()),
    path("local/", views.localleague.as_view()),

]
