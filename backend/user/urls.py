
from django.urls import path, include
from . import views

# 기본 URL 패턴 (user/ 경로용)
urlpatterns = [
    path("get-user-info/", views.Get_UserInfo_Simple.as_view()),
    path("delete-user/", views.UserDelete.as_view()),
]