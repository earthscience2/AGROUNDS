# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    # 개인 경기 관련 API
    path("get-match-detail/", views.Get_Match_Info_From_Player.as_view()),
    path("get-user-matches/", views.Get_User_Matches_From_Player.as_view()),
    path("get-user-quarters/", views.Get_User_Quarters_From_Player.as_view()),
    path("update-match-name/", views.Update_MatchName_From_Player.as_view()),
    path("delete-match/", views.Delete_Match_From_Player.as_view()),
    path("update-quarter-name/", views.Update_QuarterName_From_Player.as_view()),
    path("delete-quarter/", views.Delete_Quarter_From_Player.as_view()),
    
    # 팀 분석 관련 API
    path("get-team-ai-summary/", views.Get_TeamAiSummary.as_view()),
    path("get-team-analysis-data/", views.Get_TeamAnalysisData.as_view()),
    path("get-team-player-analysis-data/", views.Get_TeamPlayerAnalysisData.as_view()),
    path("get-team-quarter-detail/", views.Get_TeamQuarterDetail.as_view()),
    path("get-team-player-quarter-data/", views.Get_TeamPlayerQuarterData.as_view()),
]
