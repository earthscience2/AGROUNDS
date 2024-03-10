# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("main/",views.TestMain.as_view()), # 리그 전체 불러오기
    path("make/", views.makeleague.as_view()), # 리그 생성하기
    path("search/", views.searchleague.as_view()), # 리그 검색하기
    path("local/", views.localleague.as_view()), # 리그 지역정보 불러오기(수정필요)
    path("detail/", views.detailleague.as_view()), # 리그 상세정보 불러오기
    
    path("match/", views.localleague.as_view()), # 리그 경기 상세정보 불러오기
    path("team/", views.localleague.as_view()), # 리그 팀 상세정보 불러오기
    path("player/", views.localleague.as_view()), # 리그 선수 상세정보 불러오기

]
