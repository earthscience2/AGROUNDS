from django.shortcuts import render
from django.shortcuts import redirect
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from DB.models import UserInfo
from .serializers import User_info_Serializer
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework import generics
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


# 로그인 유효성 확인
class login(APIView):
    def get(self, request, format=None):
        id = request.query_params.get("id")
        pw = request.query_params.get("pw")

        user = authenticate(request, user_id=id, user_pw=pw)

        if user is not None:
            # 인증 성공: 사용자가 존재하고 비밀번호가 일치하는 경우
            return Response({"loginSuccess": True})
        else:
            # 인증 실패: 사용자가 존재하지 않거나 비밀번호가 일치하지 않는 경우
            return Response(
                {"loginSuccess": False}, status=status.HTTP_401_UNAUTHORIZED
            )


# 회원가입
class signup(APIView):
    """
    json 형식
    'user_id' : {String}
    'user_pw' : {String}
    'user_birth' : {String}
    'user_name' : {String}
    'user_gender' : {String}
    'user_nickname' : {String}
    """

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            user_pw = data.get("user_pw")
            user_birth = data.get("user_birth")
            user_name = data.get("user_name")
            user_gender = data.get("user_gender")
            user_nickname = data.get("user_nickname")
            marketing_agree = data.get("marketing_agree")

            # 간단한 유효성 검사
            if (
                not user_id
                or not user_pw
                or not user_birth
                or not user_name
                or not user_gender
                or not user_nickname
                or not marketing_agree
            ):
                return JsonResponse({"error": "모든 필드는 필수입니다."}, status=400)

            if UserInfo.objects.filter(user_nickname=user_nickname).exists():
                return JsonResponse(
                    {"message": "이미 존재하는 닉네임입니다."}, status=400
                )

            if UserInfo.objects.filter(user_id=user_id).exists():
                return JsonResponse(
                    {"message": "이미 가입된 이메일입니다."}, status=400
                )

            # password hashing
            user_pw = make_password(user_pw)

            # 사용자 생성
            user = UserInfo.objects.create(
                user_code=0,
                user_id=user_id,
                user_pw=user_pw,
                user_birth=user_birth,
                user_name=user_name,
                user_gender=user_gender,
                user_nickname=user_nickname,
                marketing_agree=marketing_agree,
            )

            return JsonResponse(
                {"message": "회원가입이 성공적으로 완료되었습니다."}, status=201
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "유효한 JSON 형식이 아닙니다."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


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
