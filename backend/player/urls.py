from django.urls import path
from . import views

urlpatterns = [
    path("getplayer/", views.get_player_by_user_code.as_view()),
]
