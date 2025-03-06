# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path('search-grounds/', views.searchGrounds.as_view()),
]
