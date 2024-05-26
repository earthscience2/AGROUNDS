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
    "v2_match_host":"sdfsdf",
    "v2_match_home":"아스키",
    "v2_match_away":"땅울림",
    "v2_match_schedule":"2024-03-24"
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
    "v2_match_code": "m_610tah54nchjd",
    "v2_match_result": ["asdf"],
    "v2_match_players": ["asdfas", "asdfas"],
    "v2_match_goalplayers": ["asdf"], #선택
    "v2_match_GPSplayers": ["asdf"]
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


class MatchSearchByMatchcodeAPI(APIView):
    '''
    {
    "v2_match_code": "m_1sa95c543pabii"
    }
    '''
    def post(self, request):
        v2_match_code = request.data.get('v2_match_code')
        if not v2_match_code:
            return Response({'error': 'v2_match_code is required.'}, status=status.HTTP_400_BAD_REQUEST)

        match = V2_MatchInfo.objects.filter(v2_match_code=v2_match_code)
        if not match.exists():
            return Response({'error': 'No match found with the provided code.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MatchSearchByMatchcode(match, many=True)
        return Response(serializer.data)

# v2_match_code로 match삭제하기 
class MatchDeletebyMatchcodeAPI(APIView):
    '''
    {
        "v2_match_code": "m_610tcd8peuv2mg"
    }
    '''
    def post(self, request):
        v2_match_code = request.data.get('v2_match_code')
        if not v2_match_code:
            return Response({'error': 'v2_match_code is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            match = V2_MatchInfo.objects.get(v2_match_code=v2_match_code)
            match.delete()
            return Response({'success': 'Match deleted successfully.'}, status=status.HTTP_200_OK)
        except V2_MatchInfo.DoesNotExist:
            return Response({'error': 'Match not found.'}, status=status.HTTP_404_NOT_FOUND)