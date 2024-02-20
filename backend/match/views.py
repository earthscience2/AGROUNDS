from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import MatchInfo
from .serializers import Match_info_Serializer

class makematch(APIView):
    """
    json 형식
    {
    "match_host": "test_host",
    "match_home": "test_home",
    "match_away": "test_away",
    "match_home_player": ["t_p1", "t2"],
    "match_away_player": ["a_p1", "p2"],
    "match_home_result": 1,
    "match_away_result": 2,
    "match_starttime" : "test",
    "match_official": "test_official",
    "match_type": {"45min": 2},
    "match_goal": {"tests": 1}
    }

    """
    def post(self, request, *args, **kwargs):
        serializer = Match_info_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)