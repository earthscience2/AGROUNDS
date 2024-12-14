
from django.urls import path, include
from . import views

urlpatterns = [
    path("join-team/", views.joinTeam.as_view()),
]