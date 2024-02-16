# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("a/", views.maketeam.as_view()),

]
