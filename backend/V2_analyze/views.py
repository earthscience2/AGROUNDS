from django.shortcuts import render
from requests import Response
from rest_framework.views import APIView
from rest_framework import status

class playerAnalyze(APIView):
    def post(self, request, *args, **kwargs):
        result = {
            
        }
        Response(result, status=status.HTTP_200_OK)
