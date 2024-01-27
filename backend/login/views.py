from django.shortcuts import render
from rest_framework import generics
# Create your views here.
import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User_info
from .serializers import User_info_Serializer
        
# Create your views here.
class nickname(APIView):
    def get(self, request, format=None):
        nickname = request.query_params.get('nickname')
        print(nickname)
        try:
            if nickname is None:
                 return Response({'isAvailable': False})
            if User_info.objects.filter(user_nickname=nickname).exists():
                # 닉네임이 이미 존재하는 경우
                return Response({'isAvailable': False})
            else:
                # 사용 가능한 닉네임인 경우
                return Response({'isAvailable': True})
        except User_info.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except (TypeError, ValueError):
            # 유효하지 않은 입력 처리
            return Response({'error': 'Invalid input'}, status=status.HTTP_400_BAD_REQUEST)
    