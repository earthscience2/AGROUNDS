# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path('search/', views.Get_GroundSearch.as_view()),
    path('list/', views.Get_GroundList.as_view()),
    path('user-analysis/', views.GetUserAnalysisGrounds.as_view()),
    path('kakao-map-key/', views.GetKakaoMapKey.as_view()),
    path('find-from-gps/', views.FindGroundFromGPSFile.as_view()),
    path('create/', views.CreateGround.as_view()),
]
