from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import TeamInfo
from .serializers import Team_info_Serializer
from .serializers import UpdateTeamInfoSerializer
from .serializers import Team_main_page

## main page
class TeamMain(APIView):
    def get(self, request):
        team_info = TeamInfo.objects.all()
        serializer = Team_main_page(team_info, many=True)
        return Response(serializer.data)


class maketeam(APIView):
    """
    json 형식
    {
    "team_host": "u_1sa88lq2mi23fl2", 
    "team_name": "test", 
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

class update_team(APIView):
    """
    json 형식
    {
    "team_code": "t_1sa88m32hn7rb8", 
    "team_player": ["규성98"],
    "team_logo": "test",
    "team_area": "test",
    "team_description": "test"
    }
    """
    def patch(self, request, *args, **kwargs):
        team_code = request.data.get('team_code')
        team_info = TeamInfo.objects.get(team_code=team_code)
        serializer = UpdateTeamInfoSerializer(team_info, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
