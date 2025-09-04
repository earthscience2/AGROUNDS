# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path('search/', views.Get_GroundSearch.as_view()),
]
