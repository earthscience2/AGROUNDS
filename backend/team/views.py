from django.shortcuts import render
# 함수추가 
from staticfiles.get_info import get_user_code_by_user_nickname 
# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import TeamInfo
from .serializers import Team_info_Serializer
from .serializers import UpdateTeamInfoSerializer
from .serializers import Team_main_page
from .serializers import Team_Search
from .serializers import Team_More_info
from .serializers import *

## main page
class TeamMainAPI(APIView):
    def get(self, request):
        team_info = TeamInfo.objects.all()
        serializer = Team_main_page(team_info, many=True)
        return Response(serializer.data)


class TeamMakeTeamAPI(APIView):
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

class TeamUpdateTeamAPI(APIView):
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
        try:
            team_info = TeamInfo.objects.get(team_code=team_code)
        except TeamInfo.DoesNotExist:
            return Response({'error' : '해당 팀이 존재하지 않습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UpdateTeamInfoSerializer(team_info, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 티어로 search
class TeamSearchAPIView(APIView):
    """
    {
        "tier" : "bronze"
    }
    """
    def post(self, request):
        team_tier = request.data.get('team_tier')
        if team_tier is None:
            return Response({"error": "team_tier parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        team_info = TeamInfo.objects.filter(team_tier=team_tier)
        serializer = Team_Search(team_info, many=True, context={'tier': team_tier})
        return Response(serializer.data)


class TeamMoreInfoAPI(APIView):
    """
    {
    "team_code": "t_1sa88og1lrrmvq",
    "team_player": "진섭95"
    }
    """
    def post(self, request):
        team_code = request.data.get('team_code')
        if team_code is None:
            return Response({"error": "team_code parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        team_info = TeamInfo.objects.filter(team_code=team_code)
        serializer = Team_More_info(team_info, many=True, context={'team_code': team_code})
        return Response(serializer.data)



class TeamPlayerMoreInfoView(APIView):
    """
    { 
        "user_code": "강인01"
    }
    """
    def post(self, request):
        user_code = get_user_code_by_user_nickname(request.data.get('user_code'))
        if user_code is None:
            return Response({"error": "user_code parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        team_info = PlayerInfo.objects.filter(user_code=user_code)
        serializer = Team_Player_More_info(team_info, many=True, context={'user_code': user_code})
        return Response(serializer.data)
