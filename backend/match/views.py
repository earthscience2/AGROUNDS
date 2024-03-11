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
from .serializers import *

from drf_yasg.utils import swagger_auto_schema
from .swagger_parameters import *

from django.forms.models import model_to_dict

# 경기 정보 불러오기
class MatchMain(APIView):
    def get(self, request):
        match_info = MatchInfo.objects.all()
        serializer = Match_main_page(match_info, many=True)
        return Response(serializer.data)

# 경기 전 정보 만들기
class Before_makematch(APIView):
    """
    json 형식
{ 
    "match_host": "u_1sa88i8j4kg5q",
    "match_home": "t_610r973000r99",
    "match_away": "t_1sa8gs928g1h3b",
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
        
# 경기 후 정보 만들기
class After_makematch(APIView):
    """
{
    "match_code": "m_1sa8gs932ldl1p",
    "match_home_player": ["u_1sa88fr5gv8kce"],
    "match_away_player": ["u_1sa88i87mgcc4"],
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
        
# 경기 상세 조회
class MatchMoreInfoAPI(APIView):
    """
    {
    "match_code": "m_1sa888s3d1aqm1"
    }
    """
    @swagger_auto_schema(
        operation_summary="return match detail by match_coode",
        operation_description="match_code로 경기 상세 정보 조회",
        request_body=MatchMoreInfoAPI_parameter
    )
    def post(self, request):
        match_code = request.data.get('match_code')
        if match_code is None:
            return Response({"error": "team_code parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        match_info = MatchInfo.objects.filter(match_code=match_code)
        serializer = Match_More_info(match_info, many=True, context={'match_code': match_code})
        return Response(serializer.data)

