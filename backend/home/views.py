from django.shortcuts import render

from rest_framework import generics
from django.http import HttpResponse

from .models import Post
from .serializers import PostSerializer
# Create your views here.

class ListPost(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class DetailPost(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
def main(request):
    message = request.GET.get('abc')
    print(message)

    return HttpResponse("안녕?")