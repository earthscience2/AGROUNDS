from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import LeagueInfo
from .serializers import League_info_Serializer
from .serializers import League_main_page

## main page
class LeagueMain(APIView):
    def get(self, request):
        league_info = LeagueInfo.objects.all()
        serializer = League_main_page(league_info, many=True)
        return Response(serializer.data)


class makeleague(APIView):
    """
    json 형식
    { 
    "league_host": "u_1sa880533r6rc7", 
    "league_name": "u_1sa880533r6rc7",
    "league_startdate": "2024-02-10",
    "league_enddate": "2024-05-10",
    "league_startjoin": "2024-01-01",
    "league_endjoin": "2024-02-01", 
    "league_team": ["m_1sa882t2qlvaam"],
    "league_area": "test_area",
    "league_logo": "test_logo", 
    "league_winner": "test_winner",
    "league_gametype": "test_gametype",
    "league_official": "test_official",
    "league_description": "test_description"
    }

    """
    def post(self, request, *args, **kwargs):
        serializer = League_info_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)