from django.urls import path
from . import views

urlpatterns = [
    path("get-player/", views.get_player_by_user_code.as_view()),
    path("get-all-players/", views.get_players.as_view()),
]
