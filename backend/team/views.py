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
    "team_host": "t_1sa882k1mp4li4",
    "team_name": "test",
    "team_player": ["u_1sa880533r6rc7"],
    "team_logo": "test",
    "team_area": "test",
    "team_description": "test"
    }
    """
    def post(self, request, *args, **kwargs):
        serializer = Team_info_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)