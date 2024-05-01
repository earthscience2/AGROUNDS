from django.shortcuts import render
# 함수추가 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import V2_TeamInfo
from .serializers import *

## V2_team 전체 DB정보
class V2_TeamMainAPI(APIView):
    def get(self, request):
        team_info = V2_TeamInfo.objects.all()
        serializer = Team_main_page(team_info, many=True)
        return Response(serializer.data)

## V2_team 팀 생성 
class V2_TeamMakeTeamAPI(APIView):
    """
    json 형식
    {
    "v2_team_logo": "asdfasfd",
    "v2_team_name": "test"
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


## V2_team 업데이트 
class V2_TeamUpdateTeamAPI(APIView):
    """
    json 형식
    {
    "v2_team_code":"t_610t7o2eh77eu",
    "v2_team_logo": "asdfasfd",
    "v2_team_name": "test",
    "v2_team_players": ["규성", "니니니"]
    }
    """
    # 여기서 v2_team_code는 user_code를 타고 가서 그때의 tema_code를 불러와서 팀 수정
    def patch(self, request, *args, **kwargs):
        v2_team_code = request.data.get('v2_team_code')
        try:
            v2_team_info = V2_TeamInfo.objects.get(v2_team_code=v2_team_code)
        except TeamInfo.DoesNotExist:
            return Response({'error' : '해당 팀이 존재하지 않습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UpdateTeamInfoSerializer(v2_team_info, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
