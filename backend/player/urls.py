from django.urls import path
from . import views

urlpatterns = [
    path("detail/", views.get_player_detail.as_view()),
    path("search/", views.searh_players.as_view()),
    path("update/", views.edit_player.as_view()),
]
