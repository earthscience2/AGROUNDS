#필수
from django.urls import path
from . import views

urlpatterns = [
    path('random-number/', views.random_number.as_view()),
    path('multi/<int:value>/', views.multi.as_view()),
    path('add-numbers/', views.AddNumbersView.as_view()),
    #/add-numbers/?number1=<숫자1>&number2=<숫자2>
    path('reverse-word/', views.ReverseWordView.as_view()),
    #/reverse-word/?word=<입력단어>
    path('user_info/', views.find_user.as_view()),
    #/user_info/?user_code=<user_code>
]