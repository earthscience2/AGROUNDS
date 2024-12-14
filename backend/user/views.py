from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import UserInfo
from rest_framework.generics import get_object_or_404

from .serializers import *

from drf_yasg.utils import swagger_auto_schema

class SetUserChange(APIView):
    def patch(self, request):
        user_code = request.data.get('user_code')
        
        if not user_code:
            return Response({"error": "user_code parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        user_info = get_object_or_404(UserInfo, user_code=user_code)
        
        serializer = UserChangeSerializer(user_info, data=request.data, partial=True, user_code=user_code)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
