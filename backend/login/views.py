from django.shortcuts import render
from django.shortcuts import redirect
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import UserInfo
from .serializers import User_info_Serializer
from django.contrib.auth.hashers import check_password

from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

import json

# 닉네임 중복확인
class nickname(APIView):
    def get(self, request, format=None):
        nickname = request.query_params.get("nickname")
        try:
            if nickname is None:
                return Response({"isAvailable": False})
            if UserInfo.objects.filter(user_nickname=nickname).exists():
                # 닉네임이 이미 존재하는 경우
                return Response({"isAvailable": False})
            else:
                # 사용 가능한 닉네임인 경우
                return Response({"isAvailable": True})
        except UserInfo.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except (TypeError, ValueError):
            # 유효하지 않은 입력 처리
            return Response(
                {"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST
            )

# 아이디 중복확인
class id(APIView):
    def get(self, request, format=None):
        id = request.query_params.get("id")
        try:
            if id is None:
                return Response({"isAvailable": False})
            if UserInfo.objects.filter(user_id=id).exists():
                # 아이디가 이미 존재하는 경우
                return Response({"isAvailable": False})
            else:
                # 사용 가능한 아이디인 경우
                return Response({"isAvailable": True})
        except UserInfo.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except (TypeError, ValueError):
            # 유효하지 않은 입력 처리
            return Response(
                {"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST
            )

# 회원가입
class signup(APIView):
    """
    json 형식
    {
        "user_id": "jayou1223@gmail.com",
        "password": "1q2w3e4r!",
        "user_birth": "20011223",
        "user_name": "구자유",
        "user_gender": "male",
        "user_nickname": "jayou",
        "marketing_agree": false
    }
    """
    #permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = User_info_Serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message" : serializer.data}, status=status.HTTP_200_OK)
        
# 로그인
class login(APIView):
    """
    {
        'user_id' : {String},
        'password' : {String}
    }
    """
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            password = data.get('password')

            # 간단한 유효성 검사
            if not user_id or not password:
                return JsonResponse({'error': '모든 필드는 필수입니다.'}, status=400)

            # 사용자 찾기
            try:
                user = UserInfo.objects.get(user_id = user_id)
            except UserInfo.DoesNotExist:
                return JsonResponse({'error': '해당 사용자가 존재하지 않습니다.'}, status=401)

            # 비밀번호 확인
            if not check_password(password, user.password):
                return JsonResponse({'error': '비밀번호가 일치하지 않습니다.'}, status=401)

            # 로그인 성공
            token = self.get_tokens_for_user(user)
            return JsonResponse({'message': '로그인이 성공적으로 완료되었습니다.',
                                 'user_id' : user.user_id,
                                 'user_nickname' : user.user_nickname,
                                 'token' : token
                                 }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "유효한 JSON 형식이 아닙니다."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    def get_tokens_for_user(self, user):
        """
        token 생성 함수
        """
        refresh = RefreshToken.for_user(user)
        refresh['user_code'] = user.user_code

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

class kakao(APIView):
    def get(self, request):
        redirect_uri = "http://localhost:3000/kakao"
        client_id = "31b5a921fbd3a1e8f96e06d992364864"

        return redirect(
            f"https://kauth.kakao.com/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
        )

class kakaoView(APIView):
    def get(self, request):
        0

class google(APIView):
    def get(self, request):
        return redirect("http://127.0.0.1:8000/api/login/allauth/google/login/")
