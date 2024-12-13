# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    path("main/",views.V2_TeamMainAPI.as_view()),

]
