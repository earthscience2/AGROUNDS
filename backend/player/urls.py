from django.urls import path
from . import views

urlpatterns = [
    path("detail/", views.get_player_detail.as_view()),# 플레이어 상세 조회
    path("search/", views.searh_players.as_view()),# 플레이어 검색
    path("local/",  views.local_players.as_view()),# 플레이어 지역 검색
    path("update/", views.edit_player.as_view()),# 플레이어 업데이트
]
