# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    # anal 앱은 분석 결과 관련 기능만 담당
    # 경기 정보 추가는 match 앱에서 처리
    path("get-ovr-last-5-matches/", views.Get_UserOvr_last_5_matches_From_Player.as_view()),
    path("get-point-last-5-matches/", views.Get_UserPoint_last_5_matches_From_Player.as_view()),
    path("get-quarter-data/", views.Get_QuarterData_From_Player.as_view()),
]
