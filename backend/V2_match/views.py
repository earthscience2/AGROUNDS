from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import MatchInfo, LeagueInfo
from rest_framework.generics import get_object_or_404
from .serializers import *

from drf_yasg.utils import swagger_auto_schema
from .swagger_parameters import *

from django.forms.models import model_to_dict

# V2_match 경기 정보 불러오기
class V2_MatchMain(APIView):
    def get(self, request):
        match_info = V2_MatchInfo.objects.all()
        serializer = Match_main_page(match_info, many=True)
        return Response(serializer.data)


class V2_Before_makematch(APIView):
    """
    json 형식
    {
    "v2_match_location":"asdfas",
    "v2_match_home":"asdf",
    "v2_match_away":"asdfasd"
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


class V2_After_makematch(APIView):
    """
{
    "v2_match_code":"m_610tah4aj79tb",
    "v2_match_result":["asdf"]
}
    """
    def post(self, request, *args, **kwargs):
        v2_match_code = request.data.get('v2_match_code')
        match_info = get_object_or_404(V2_MatchInfo, v2_match_code=v2_match_code)
        serializer = After_Match_info_Serializer(match_info, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)