from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import UserInfo
from rest_framework.generics import get_object_or_404

from .serializers import *

from drf_yasg.utils import swagger_auto_schema


class getPlayerInfo(APIView):
    def post(self, request):
        # 사용자로부터 user_code 파라미터를 입력받음
        user_code = request.data.get('user_code')
        
        if not user_code:
            return Response({"error": "user_code parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # user_code를 이용해 UserInfo 테이블에서 필터링
        user_info = UserInfo.objects.filter(user_code=user_code)
        
        if not user_info.exists():
            return Response({"error": "No user found with this user_code."}, status=status.HTTP_404_NOT_FOUND)
        
        # 필터링된 데이터를 직렬화
        serializers = UserMainPageSerializer(user_info, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class MatchInfoUserAPIView(APIView):
    def post(self, request):
        # MatchProcessSerializer에 데이터 전달
        serializer = MatchProcessSerializer(data=request.data)

        # 데이터 검증
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 처리된 데이터 가져오기
        result = serializer.process()

        # 결과 반환
        return Response(result, status=status.HTTP_200_OK)

class MatchInfoAsTeamAPIView(APIView):
    def post(self, request):
        # 요청 데이터 처리
        serializer = MatchProcessTeamSerializer(data=request.data)

        # 데이터 검증
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 데이터 처리 및 결과 생성
        result = serializer.process()

        # 결과 반환
        return Response(result, status=status.HTTP_200_OK)