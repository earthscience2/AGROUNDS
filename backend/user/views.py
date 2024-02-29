from staticfiles.get_info import get_user_code_by_user_nickname

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema
from .serializers import User_info_Serializer

class test_view(APIView):
    # @swagger_auto_schema(tags=["user_code 조회"], request_body=User_info_Serializer, query_serializer=User_info_Serializer)
    def get(self, request, format=None):
        nickname = request.query_params.get("nickname")
        user_code = get_user_code_by_user_nickname(nickname=nickname)
        return Response({'data' : user_code})