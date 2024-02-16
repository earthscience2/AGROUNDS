from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import TeamInfo
from .serializers import Team_info_Serializer
class maketeam(APIView):
    """
    json 형식
    {
        'team_host' : {String},
        'team_name' : {String},
        'team_player' : {String},
        'team_logo' : {String},
        'team_point' : {Int},
        'team_area' : {String},
        'team_description' : {String},
    }
    """
    def post(self,request,*args,**kwargs):
        serializer = Team_info_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors['non_field_errors'])