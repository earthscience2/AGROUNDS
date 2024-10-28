# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("ai-summation/", views.aiSummation.as_view()),
    path("analyze-data/", views.analyzeData.as_view()),
]