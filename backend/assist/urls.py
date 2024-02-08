from django.urls import path
from . import views

urlpatterns = [
    path("random-number/", views.random_number.as_view()),
    path("multi/<int:value>/", views.multi.as_view()),
    path("add-numbers/", views.AddNumbersView.as_view()),
    path("reverse-word/", views.ReverseWordView.as_view()),
    path("user_info/", views.find_user.as_view()),
]
