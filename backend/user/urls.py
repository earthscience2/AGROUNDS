
from django.urls import path, include
from . import views

urlpatterns = [
    path("userchange/", views.SetUserChange.as_view()),
]