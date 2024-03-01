from staticfiles.get_info import get_user_code_by_user_nickname

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema
from .swagger_parameters import *

class test_view(APIView):
    @swagger_auto_schema(
        operation_summary="return user_code by uesr_nickname",
        operation_description="유저 nickname을 입력하면 user_code를 반환해요",
        manual_parameters=[
             test_view_parameter
        ],
        responses={
            200: "success",
            401: "닉네임을 입력하지 않았을 경우",
            404: "해당 유저가 존재하지 않는 경우",
        },
    )
    def get(self, request, format=None):
        nickname = request.query_params.get("nickname")
        if(nickname is None):
            return Response({'error' : 'nickname을 입력해주세요.'}, status = 401)
        user_code = get_user_code_by_user_nickname(nickname=nickname)
        if(user_code is None):
            return Response({'error' : '해당 유저가 존재하지 않습니다.'}, status = 404)
        return Response({'data' : user_code})