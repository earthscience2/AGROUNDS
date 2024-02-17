from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import LeagueInfo
from .serializers import League_info_Serializer

class makeleague(APIView):
    """
    json 형식
    {
        'leageu_host' : {String},
        'leageu_name' : {String},
        'leageu_startdate' : {String},
        'leageu_enddate' : {String},
        'leageu_startjoin' : {String},
        'leageu_endjoin' : {String},
        'leageu_team' : [list],
        'leageu_area' : {String},
        'leageu_logo' : {String},
        'leageu_winner' : {String},
        'leage_gametype' : {String},
        'league_official' : {String},
        'league_description' : {String}
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