from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import MatchInfo
from .serializers import Before_Match_info_Serializer
from .serializers import After_Match_info_Serializer
from rest_framework.generics import get_object_or_404
from .serializers import Match_main_page


## main page
class TeamMain(APIView):
    def get(self, request):
        match_info = MatchInfo.objects.all()
        serializer = Match_main_page(match_info, many=True)
        return Response(serializer.data)


class Before_makematch(APIView):
    """
    json 형식
    {
    "match_host": "u_1sa886fuu8678",
    "match_home": "t_1sa888s33li50r",
    "match_away": "t_1sa888s3bheta6",
    "match_starttime" : "test",
    "match_official": "test_official",
    "match_type": {"45min": 2}
}
    """
    def post(self, request, *args, **kwargs):
        serializer = Before_Match_info_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class After_makematch(APIView):
    """
{
    "match_code": "m_1sa888s3d1aqm1",
    "match_home_player": ["u_1sa886fuu8678"],
    "match_away_player": ["u_1sa888s39k4cpf"],
    "match_home_result": 1,
    "match_away_result": 2,
    "match_total_result": {"test_home": "승"},
    "match_goal": {"tests": 1}
}

    """
    def post(self, request, *args, **kwargs):
        match_code = request.data.get('match_code')
        print(match_code)
        match_info = get_object_or_404(MatchInfo, match_code=match_code)
        serializer = After_Match_info_Serializer(match_info, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
