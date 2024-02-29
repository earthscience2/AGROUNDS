from django.shortcuts import render

from staticfiles.get_info import get_user_code_by_user_nickname

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class test_view(APIView):
    def get(self, request, format=None):
        nickname = request.query_params.get("nickname")
        user_code = get_user_code_by_user_nickname(nickname=nickname)
        return Response({'data' : user_code})