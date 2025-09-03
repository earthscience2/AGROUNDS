
from django.urls import path, include
from . import views

# 기본 URL 패턴 (user/ 경로용)
urlpatterns = [
    path("edit-user-info/", views.SetUserChange.as_view()),
    path("get-analysis-data/", views.GetUserAnalysisDataView.as_view()),
    path("get-ovr-data/", views.GetUserOvrDataView.as_view()),
    path("get-stats-data/", views.GetUserStatsDataView.as_view()),
    path("get-point-data/", views.GetUserPointDataView.as_view()),
    path("get-player-matches/", views.GetUserPlayerMatchesView.as_view()),
    path("update-match-name/", views.UpdatePlayerMatchNameView.as_view()),
    path("delete-match/", views.DeletePlayerMatchView.as_view()),
    path("get-match-detail/", views.GetMatchDetailView.as_view()),
    path("update-quarter-name/", views.UpdateQuarterNameView.as_view()),
    path("delete-quarter/", views.DeleteQuarterView.as_view()),
]