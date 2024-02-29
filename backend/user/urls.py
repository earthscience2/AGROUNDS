from django.urls import path
from . import views

urlpatterns = [
    path("test/", views.test_view.as_view())
]
