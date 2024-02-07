from django.shortcuts import render
from rest_framework import generics

# Create your views here.
import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User_info
from .serializers import User_info_Serializer


class random_number(APIView):
    def get(self, request, format=None):
        try:
            number = random.randint(1, 100)
            return Response({"number": number})
        except ValueError:
            return Response(
                {"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST
            )


class multi(APIView):
    def get(self, request, value, format=None):
        try:
            value = int(value)
            result = value * 50
            return Response({"result": result})
        except ValueError:
            return Response(
                {"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST
            )


class AddNumbersView(APIView):
    def get(self, request, format=None):
        # URL 쿼리 파라미터에서 두 숫자를 받음
        number1 = request.query_params.get("number1")
        number2 = request.query_params.get("number2")
        try:
            # 숫자로 변환 및 덧셈
            sum = int(number1) + int(number2)
            return Response({"sum": sum})
        except (TypeError, ValueError):
            # 유효하지 않은 입력 처리
            return Response(
                {"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST
            )


class ReverseWordView(APIView):
    def get(self, request, format=None):
        word = request.query_params.get("word")
        try:
            reversed_word = word[::-1]  # 단어 뒤집기
            return Response({"reversed_word": reversed_word})
        except (TypeError, ValueError):
            # 유효하지 않은 입력 처리
            return Response(
                {"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST
            )


class find_user(generics.ListAPIView):
    serializer_class = User_info_Serializer

    def get(self, request, format=None):
        user_code = request.query_params.get("user_code")
        try:
            user = User_info.objects.get(user_code=user_code)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        except User_info.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except (TypeError, ValueError):
            # 유효하지 않은 입력 처리
            return Response(
                {"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST
            )
