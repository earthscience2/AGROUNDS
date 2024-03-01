from django.urls import path
from . import views

urlpatterns = [
    path("get-player-detail/", views.get_player_detail.as_view()),
    path("get-all-players/", views.get_all_players.as_view()),
]
