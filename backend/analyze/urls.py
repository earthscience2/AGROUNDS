# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path('get-analyze-result/', views.getAnalyzeResult.as_view()),
]
