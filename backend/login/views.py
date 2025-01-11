from django.forms import model_to_dict
from django.shortcuts import redirect
from django.http import JsonResponse
from urllib.parse import quote, unquote

import jwt
import environ
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from DB.models import UserInfo
from DB.models import UserTeam
from DB.models import TeamInfo
from .serializers import User_Info_Serializer
from django.contrib.auth.hashers import check_password
from types import SimpleNamespace

from rest_framework_simplejwt.tokens import RefreshToken

from staticfiles import cryptographysss

import json
import requests

env = environ.Env(DEBUG=(bool, True)) #환경변수를 불러올 수 있는 상태로 세팅

# 클라이언트 / 서버 주소
CLIENT_URL = env("CLIENT_URL")
SERVER_URL = env("SERVER_URL")

KAKAO_CALLBACK_URI = SERVER_URL + "/api/login/kakao/callback/"
KAKAO_REDIRECT_URI = SERVER_URL + "/api/login/kakao/"
KAKAO_CLIENT_ID = "31b5a921fbd3a1e8f96e06d992364864"

# 닉네임 중복확인
class nickname(APIView):
    def get(self, request, format=None):
        nickname = request.query_params.get("user_nickname")
        try:
            if nickname is None:
                return Response(
                    {"error": "user_nickname 필드는 필수입니다."}, status=status.HTTP_404_NOT_FOUND
                )
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

# 카카오 로그인
class kakao(APIView):
    def get(self, requset):
        return redirect(
            f"https://kauth.kakao.com/oauth/authorize?client_id={KAKAO_CLIENT_ID}&redirect_uri={KAKAO_CALLBACK_URI}&response_type=code"
        )

# 카카오 로그인 - callback view
class kakaoCallback(APIView):
    def get(self, request, format=None):
        try:
            data = {
                "grant_type"    :"authorization_code",
                "client_id"     :KAKAO_CLIENT_ID,
                "redirect_uri"  :KAKAO_CALLBACK_URI,
                "code"          :request.query_params.get("code")
            }
            kakao_token_api = "https://kauth.kakao.com/oauth/token"
            access_token = requests.post(kakao_token_api, data).json()["access_token"]
            
            kakao_user_api = "https://kapi.kakao.com/v2/user/me"
            header = {"Authorization":f"Bearer ${access_token}"}
            user_info_from_kakao = requests.get(kakao_user_api, headers=header).json()
            kakao_email = user_info_from_kakao["kakao_account"]["email"]
        except Exception:
            return JsonResponse({'error' : '카카오로부터 정보를 가져오지 못하였습니다.'}, status=402)

        # 카카오 서버로부터 가져온 유저 이메일이 우리 서비스에 가입되어 있는지 검사 
        try:
            user = UserInfo.objects.get(user_id = kakao_email)
        except UserInfo.DoesNotExist: # 가입되어있지 않은 유저의 경우 프런트 카카오 회원가입 페이지로 이동
            print("회원가입 진행")
            encrypted_email = cryptographysss.encrypt_aes(kakao_email)
            encoded_string = quote(encrypted_email)
            return redirect(CLIENT_URL+"/essencial-info/?type=kakao&id=" + encoded_string)
        
        # 가입되어있는 경우 토큰을 url파라메터로 전송해줌.
        return redirect(CLIENT_URL+"/loading-for-login/?code="+login.getTokensForUser(login, user)['access'])

# 카카오 로그인 - 회원가입
class kakaoSignup(APIView):
    """
    json 형식
    {
        "user_id": decrypted string,
        "user_birth": "2001-12-23",
        "user_name": "구자유",
        "user_gender": "male",
        "user_nickname": "jayou",
        "marketing_agree": false,
        "user_height" : 175,
        "user_weight" : 75,
        "user_position" : "CM"
    }
    """
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            print(data)
            decoded_string = unquote(data["user_id"])
            user_id = cryptographysss.decrypt_aes(decoded_string)
            print(user_id)
            data["user_id"] = user_id
            data["password"] = "0"
            data["login_type"] = "kakao"
            serializer = User_Info_Serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            new_user = serializer.data
            return Response({"code" : login.getTokensForUser(login, SimpleNamespace(**new_user))['access']}, status=status.HTTP_200_OK)
        except KeyError as e:
            return JsonResponse({"error": f"Missing required field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

# 토큰으로 사용자 정보 받아오기
class getUserInfo(APIView):
    """
    헤더에 토큰을 넣고 get요청을 보내면 유저 정보를 리턴해줍니다.
    client.defaults.headers.common['Authorization'] = token;
    """
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if auth_header is None:
            return Response({'detail': 'Authorization header missing or invalid'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[0]

        # 토큰 decoding
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return Response({'detail': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user_code = decoded_token.get('user_code')
        try:
            user = UserInfo.objects.get(user_code = user_code)
            user_dict = model_to_dict(user)
            new_token = login.getTokensForUser(login, user)
            user_dict.pop('password')
            user_dict['token'] = new_token['access']

            user_team = None

            if user.user_type == 'coach' : 
                user_team = TeamInfo.objects.filter(team_host = user_code).first()
            elif user.user_type == 'player' :
                user_team = UserTeam.objects.filter(user_code = user_code).first()
            
            if user_team is None:
                user_dict['team_code'] = ''
            else:
                user_dict['team_code'] = user_team.team_code

            # 가입 후 첫 로그인 시 uesr_type을 individual로 변경
            if user.user_type == '-1':
                user.user_type = 'individual'
                user.save()

        except UserInfo.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        return JsonResponse(user_dict, status=200)
    
# 로그인
class login(APIView):
    """
    {
        'user_id' : {String},
        'password' : {String}
    }

    user_type
    -1 : 가입 후 첫 로그인
    coach : 감  독
    player : 선수
    individual : 개인 회원 

    login_type
    0 : 일반 로그인
    1 : 카카오 로그인
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
            # 로그인 response return
            return self.getLogin(user)

        except json.JSONDecodeError:
            return JsonResponse({"error": "유효한 JSON 형식이 아닙니다."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def getTokensForUser(self, user):
        """
        token 생성 함수
        """
        refresh = RefreshToken.for_user(user)
        refresh['user_code'] = user.user_code

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def getLogin(self, user):
        token = self.getTokensForUser(user)
        team_name = ""
        if user.user_type == 0 or user.user_type == 1:
            try:
                team_name = V2_TeamInfo.objects.get(v2_team_code = user.team_code).v2_team_name
            except V2_TeamInfo.DoesNotExist:
                return JsonResponse({'error':'팀코드에 해당하는 팀이 존재하지 않습니다.'}, status=400)
            
        return JsonResponse({'message': '로그인이 성공적으로 완료되었습니다.',
                                'user_code' : user.user_code,
                                'user_id' : user.user_id,
                                'user_name' : user.user_name,
                                'user_nickname' : user.user_nickname,
                                'token' : token,
                                'login_type' : user.login_type,
                                'team_code' : user.team_code,
                                'user_type' : user.user_type,
                                'team_name' : team_name,
                                }, status=200)

# # 회원가입
# class signup(APIView):
#     """
#     json 형식
#     {
#         "user_id": "jayou1223@gmail.com",
#         "password": "1q2w3e4r!",
#         "user_birth": "20011223",
#         "user_name": "구자유",
#         "user_gender": "male",
#         "user_nickname": "jayou",
#         "marketing_agree": false
#     }
#     """
#     def post(self, request, *args, **kwargs):
#         data = request.data
#         data['login_type'] = 0
#         user_info_serializer = User_info_Serializer(data=data)
        
#         user_info_serializer.is_valid(raise_exception=True)
#         user_info_serializer.save()
#         return Response(user_info_serializer.data, status=status.HTTP_200_OK)
        
