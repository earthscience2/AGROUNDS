# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path('get-video-summation/', views.getVideoSummation.as_view()),
]
