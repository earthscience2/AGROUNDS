#필수
from django.urls import path
from . import views

urlpatterns = [
    path('nickname/', views.nickname.as_view()),
    #/reverse-word/?word=입력단어
]