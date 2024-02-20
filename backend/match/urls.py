# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("match/", views.makematch.as_view()),

]
