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
        'match_host' : {String},
        'match_home' : {String},
        'match_away' : {String},
        'match_home_player' : {list},
        'match_away_player' : {list},
        'match_home_result' : {Int},
        'match_away_result' : {Int},
        'match_official' : {String},
        'match_starttime' : {String},
        'match_type' : {Dict},
        'match_goal' : {Dict},

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