# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("get-match-detail/", views.Get_Match_Info_From_Player.as_view()),
    path("get-user-matches/", views.Get_User_Matches_From_Player.as_view()),
    path("update-match-name/", views.Update_MatchName_From_Player.as_view()),
    path("delete-match/", views.Delete_Match_From_Player.as_view()),
    path("update-quarter-name/", views.Update_QuarterName_From_Player.as_view()),
    path("delete-quarter/", views.Delete_Quarter_From_Player.as_view()),
]
