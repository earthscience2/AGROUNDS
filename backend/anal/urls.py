# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    # anal 앱은 분석 결과 관련 기능만 담당
    # 경기 정보 추가는 match 앱에서 처리
    path("get-ovr-last-5-matches/", views.Get_UserOvr_last_5_matches_From_Player.as_view()),
    path("get-point-last-5-matches/", views.Get_UserPoint_last_5_matches_From_Player.as_view()),
    path("get-quarter-data/", views.Get_QuarterData_From_Player.as_view()),
    
    # Lambda 분석 시작 및 결과 저장
    path("start-analysis/", views.Start_PlayerAnalysis_Lambda.as_view()),
    path("save-result/", views.Save_AnalysisResult_From_Lambda.as_view()),
    path("update-match-status/", views.Update_MatchStatus_From_Lambda.as_view()),
    path("save-player-ai/", views.Save_PlayerAi_From_Lambda.as_view()),
    path("create-analysis-notification/", views.Create_AnalysisNotification_From_Lambda.as_view()),
]
