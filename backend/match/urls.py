# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("beforematch/", views.Before_makematch.as_view()),# 경기 전 입력 
    path("aftermatch/", views.After_makematch.as_view()),# 경기 후 입력 
    path("main/",views.MatchMain.as_view()),# 경기 정보
    path("more/",views.MatchMoreInfoAPI.as_view()),# 경기 상세 정보
    path("local/",views.MatchLocalInfoAPI.as_view()) # 경기 요약 정보
]
