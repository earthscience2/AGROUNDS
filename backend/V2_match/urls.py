# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("main/",views.V2_MatchMain.as_view()),# 경기 정보
    path("beforematch/", views.V2_Before_makematch.as_view()),# 경기 전 입력 
    path("aftermatch/", views.V2_After_makematch.as_view()),# 경기 후 입력 
    path("searchbymatchcode/", views.MatchSearchByMatchcodeAPI.as_view()),
    path('deletematch/', views.MatchDeletebyMatchcodeAPI.as_view()),
    path('searchbyteamcode/', views.MatchSearchByTeamcodeAPI.as_view()),
    path('searchbyusernickname/', views.MatchSearchBynicknameAPI.as_view()),
]
