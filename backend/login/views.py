import json
import logging
import random
import string
import time
import traceback
from urllib.parse import quote, unquote

import environ
import jwt
import requests
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.forms import model_to_dict
from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect
from jwt.algorithms import RSAAlgorithm
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from DB.models import User, UserInfo, TeamInfo, PlayerTeamCross
from .serializers import User_Info_Serializer
from staticfiles import cryptographysss
from staticfiles.make_code import make_code

logger = logging.getLogger('django')

env = environ.Env(DEBUG=(bool, True)) #환경변수를 불러올 수 있는 상태로 세팅

# 클라이언트 / 서버 주소 (환경변수 미설정 대비 기본값 적용)
try:
    CLIENT_URL = env("CLIENT_URL")
except Exception:
    CLIENT_URL = "https://agrounds.com"
try:
    SERVER_URL = env("SERVER_URL")
except Exception:
    SERVER_URL = "https://agrounds.com"

KAKAO_CALLBACK_URI = SERVER_URL + "/api/login/kakao/callback/"
KAKAO_REDIRECT_URI = SERVER_URL + "/api/login/kakao/"
KAKAO_CLIENT_ID = env("KAKAO_CLIENT_ID")
try:
    KAKAO_CLIENT_SECRET = env("KAKAO_CLIENT_SECRET")
except Exception:
    KAKAO_CLIENT_SECRET = None
APPLE_CLIENT_ID = env("APPLE_CLIENT_ID")
APPLE_TEAM_ID = env("APPLE_TEAM_ID")
APPLE_KEY_ID = env("APPLE_KEY_ID")
APPLE_PRIVATE_KEY_PATH = env("APPLE_PRIVATE_KEY_PATH")
APPLE_REDIRECT_URI = env("APPLE_REDIRECT_URI")
try:
    NAVER_CLIENT_ID = env("NAVER_CLIENT_ID")
except Exception:
    NAVER_CLIENT_ID = None
try:
    NAVER_CLIENT_SECRET = env("NAVER_CLIENT_SECRET")
except Exception:
    NAVER_CLIENT_SECRET = None

# 공통 헬퍼 함수들
def extract_token_from_header(auth_header):
    """Authorization 헤더에서 토큰을 추출하는 헬퍼 함수"""
    if not auth_header:
        return None
    
    # Bearer 토큰이면 두 번째 부분을, 아니면 첫 번째 부분을 사용
    if auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]
    else:
        return auth_header.split(' ')[0]

def decode_jwt_token(token):
    """JWT 토큰을 디코딩하는 헬퍼 함수"""
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")

def get_user_from_token(request):
    """요청에서 토큰을 추출하고 사용자 정보를 반환하는 헬퍼 함수"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, Response({'detail': 'Authorization header missing or invalid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    token = extract_token_from_header(auth_header)
    if not token:
        return None, Response({'detail': 'Invalid token format'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        decoded_token = decode_jwt_token(token)
        user_code = decoded_token.get('user_code')
        if not user_code:
            return None, Response({'detail': 'Invalid token payload'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = User.objects.get(user_code=user_code)
        return user, None
    except ValueError as e:
        return None, Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return None, Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return None, Response({'detail': 'Token validation failed'}, status=status.HTTP_401_UNAUTHORIZED)

def create_user_and_info(user_email, login_type, user_name, user_birth, user_gender, 
                        preferred_position=None, activity_area=None, ai_type=None):
    """사용자와 사용자 정보를 생성하는 공통 함수"""
    user_code = generate_unique_user_code('u')
    
    # User 생성
    user = User.objects.create(
        user_code=user_code,
        user_id=user_email,
        password="0",
        login_type=login_type
    )
    
    # UserInfo 생성
    user_info = UserInfo.objects.create(
        user_code=user_code,
        name=user_name,
        birth=user_birth,
        gender=user_gender,
        preferred_position=preferred_position,
        activity_area=activity_area,
        ai_type=ai_type
    )
    
    return user, user_info, user_code

def handle_api_error(error_message, status_code=500, exception=None):
    """API 에러 처리를 위한 공통 함수"""
    if exception:
        logger.error(f"{error_message}: {str(exception)}\n{traceback.format_exc()}")
    return JsonResponse({"error": error_message}, status=status_code)

def generate_unique_user_code(prefix: str = 'u', max_attempts: int = 20) -> str:
    """고유한 user_code를 생성합니다. DB에 존재 여부를 검사하며, 충돌 시 재시도합니다."""
    for attempt in range(max_attempts):
        candidate = make_code(prefix)
        # 두 테이블 모두에서 충돌 검사를 수행
        if not User.objects.filter(user_code=candidate).exists() and not UserInfo.objects.filter(user_code=candidate).exists():
            return candidate
        time.sleep(0.001)
    # 극히 드문 경우를 대비해 랜덤 접미사를 부여
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=3))
    fallback = make_code(prefix) + random_suffix
    return fallback

# =============================== 카카오  ===============================
# 카카오 회원가입
class kakaoSignup(APIView):
    def post(self, request, *args, **kwargs):
        try:
            logger.info(f"[카카오 회원가입] 수신된 데이터: {request.data}")
            
            data = request.data
            decoded_string = unquote(data.get("user_id", ""))
            if not decoded_string:
                return JsonResponse({"error": "user_id is required"}, status=400)

            user_email = cryptographysss.decrypt_aes(decoded_string)
            logger.info(f"[카카오 회원가입] 복호화된 user_id(email): {user_email}")

            # 이미 존재하는 경우 방어 (login_type 포함)
            if User.objects.filter(user_id=user_email, login_type="kakao").exists():
                return JsonResponse({"error": "이미 가입된 이메일입니다."}, status=409)

            # 공통 키 생성 (중복 방지)
            user_code = generate_unique_user_code('u')

            # user 생성
            User.objects.create(
                user_code=user_code,
                user_id=user_email,
                password="0",
                login_type="kakao",
            )

            # 키 매핑 보완: 프런트에서 들어오는 다양한 키명을 모두 수용
            birth = data.get('birth') or data.get('user_birth') or ''
            name = data.get('name') or data.get('user_name') or ''
            gender = data.get('gender') or data.get('user_gender') or ''
            height = data.get('height') or data.get('user_height') or 0
            weight = data.get('weight') or data.get('user_weight') or 0
            preferred_position = data.get('preferred_position') or data.get('user_position') or ''
            user_type_val = data.get('user_type') or data.get('userType') or ''
            level_val = data.get('level') or data.get('userLevel') or ''
            ai_type_val = data.get('ai_type') or data.get('aiPersonality') or ''
            activity_area_val = data.get('activity_area') or data.get('activityArea') or ''
            marketing_agree_raw = data.get('marketing_agree', '{}')
            # marketing_agree: 모델 필드 타입에 맞춰 값 변환 (BooleanField 또는 CharField)
            agree_obj = None
            agree_str = None
            try:
                if isinstance(marketing_agree_raw, str):
                    # 문자열인 경우 JSON 시도
                    agree_obj = json.loads(marketing_agree_raw)
                elif isinstance(marketing_agree_raw, dict):
                    agree_obj = marketing_agree_raw
            except Exception:
                agree_obj = None

            def str_to_bool(v):
                if isinstance(v, bool):
                    return v
                if isinstance(v, (int, float)):
                    return bool(v)
                if isinstance(v, str):
                    return v.strip().lower() in ['yes', 'true', 'y', '1', 'on']
                return False

            # 항목별 yes/no 표준화
            def to_yes_no(v):
                return 'yes' if str_to_bool(v) else 'no'

            if not isinstance(agree_obj, dict):
                agree_obj = {}

            normalized_agree = {
                'terms_agree': to_yes_no(agree_obj.get('terms_agree', 'no')),
                'privacy_agree': to_yes_no(agree_obj.get('privacy_agree', 'no')),
                'marketing_use_agree': to_yes_no(agree_obj.get('marketing_use_agree', 'no')),
                'marketing_receive_agree': to_yes_no(agree_obj.get('marketing_receive_agree', 'no')),
            }

            # 요약 동의값(과거 Boolean 필드 호환용)
            agree_bool = normalized_agree['marketing_use_agree'] == 'yes'
            agree_str = 'yes' if agree_bool else 'no'

            # 대상 모델 필드 타입 확인: UserInfo.marketing_agree
            try:
                field = UserInfo._meta.get_field('marketing_agree')
                if isinstance(field, dj_models.BooleanField):
                    marketing_agree_val = agree_bool
                else:
                    # CharField 등 문자열 저장: 항목별 JSON 문자열
                    marketing_agree_val = json.dumps(normalized_agree, ensure_ascii=False)
            except Exception:
                # 안전장치: 실패 시 문자열로 저장
                marketing_agree_val = json.dumps(normalized_agree, ensure_ascii=False)

            # user_info 생성
            UserInfo.objects.create(
                user_code=user_code,
                birth=birth,
                name=name,
                gender=gender,
                marketing_agree=marketing_agree_val,
                user_type=user_type_val,
                level=level_val,
                height=float(height or 0),
                weight=float(weight or 0),
                preferred_position=preferred_position,
                activity_area=activity_area_val,
                ai_type=ai_type_val,
            )

            return Response({"ok": True, "user_code": user_code}, status=status.HTTP_200_OK)

        except KeyError as e:
            logger.warning(f"[카카오 회원가입] 필수 필드 누락: {str(e)}")
            return JsonResponse({"error": f"Missing required field: {str(e)}"}, status=400)

        except Exception as e:
            logger.error(f"[카카오 회원가입] 예기치 못한 에러: {str(e)}\n{traceback.format_exc()}")
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)


# 카카오 로그인
class kakao(APIView):
    def get(self, request):
        hostname = request.query_params.get('hostname')
        client = request.query_params.get('client')
        # 실제 카카오가 호출할 콜백 주소 (동작 가능한 서버)
        if hostname == "localhost":
            callback_uri = "http://localhost:8000/api/login/kakao/callback/"
        else:
            callback_uri = "https://agrounds.com/api/login/kakao/callback/"

        # 최종 리다이렉트 타겟(client_url)을 state로 전달 (콜백 서버와 분리 가능)
        if client in ["localhost", "agrounds.com"]:
            state = client
        else:
            state = hostname if hostname in ["localhost", "agrounds.com"] else "agrounds.com"

        return redirect(
            f"https://kauth.kakao.com/oauth/authorize?client_id={KAKAO_CLIENT_ID}&redirect_uri={callback_uri}&response_type=code&state={state}&theme=light"
        )


# 카카오 로그인 - callback view
class kakaoCallback(APIView):
    def get(self, request, format=None):
        client_url = CLIENT_URL or "https://agrounds.com"
        # state는 최종 리다이렉트 대상(클라이언트) 구분 용도만 사용
        state = request.query_params.get('state')
        if state == "localhost":
            client_url = "http://localhost:3000"
        else:
            client_url = "https://agrounds.com"

        # 실제 토큰 교환에 사용할 redirect_uri는 현재 호출된 콜백 주소와 동일해야 함
        scheme = "https" if request.is_secure() else "http"
        host = request.get_host()
        callback_uri = f"{scheme}://{host}/api/login/kakao/callback/"
            
        try:
            # 최초 authorize에 사용한 redirect_uri와 정확히 동일해야 함
            dynamic_callback = callback_uri
            logger.info(f"[Kakao] Callback URL: {dynamic_callback}")
            data = {
                "grant_type"    :"authorization_code",
                "client_id"     :KAKAO_CLIENT_ID,
                "redirect_uri"  : dynamic_callback,
                "code"          :request.query_params.get("code"),
                "state"         : state,
            }
            if KAKAO_CLIENT_SECRET:
                data["client_secret"] = KAKAO_CLIENT_SECRET
            logger.info(f"[Kakao] Token request data: {data}")
            kakao_token_api = "https://kauth.kakao.com/oauth/token"
            token_resp = requests.post(kakao_token_api, data)
            logger.info(f"[Kakao] Token response status: {token_resp.status_code}")
            if token_resp.status_code != 200:
                logger.error(f"[Kakao] Token API error {token_resp.status_code}: {token_resp.text}")
                return JsonResponse({'error': '카카오 토큰 발급 실패', 'detail': token_resp.text}, status=502)

            token_json = token_resp.json()
            logger.info(f"[Kakao] Token response: {token_json}")
            if "access_token" not in token_json:
                logger.error(f"[Kakao] access_token 누락: {token_json}")
                return JsonResponse({'error': '카카오 토큰 응답에 access_token이 없습니다.', 'detail': token_json}, status=502)

            access_token = token_json["access_token"]

            kakao_user_api = "https://kapi.kakao.com/v2/user/me"
            header = {"Authorization":f"Bearer {access_token}"}
            logger.info(f"[Kakao] User API request header: {header}")
            user_resp = requests.get(kakao_user_api, headers=header)
            logger.info(f"[Kakao] User response status: {user_resp.status_code}")
            if user_resp.status_code != 200:
                logger.error(f"[Kakao] User API error {user_resp.status_code}: {user_resp.text}")
                return JsonResponse({'error': '카카오 사용자 정보 조회 실패', 'detail': user_resp.text}, status=502)

            user_info_from_kakao = user_resp.json()
            logger.info(f"[Kakao] User info: {user_info_from_kakao}")

            kakao_email = user_info_from_kakao.get("kakao_account", {}).get("email")
            if kakao_email is None:
                logger.warning(f"[Kakao] 이메일 미제공: {user_info_from_kakao}")
                return JsonResponse({'error': '카카오에서 이메일 제공에 동의하지 않았습니다. 이메일 제공 동의를 해주세요.'}, status=400)
        except requests.exceptions.RequestException as e:
            logger.error(f"[Kakao] Network error: {str(e)}")
            return JsonResponse({'error': '카카오 API 네트워크 오류', 'detail': str(e)}, status=502)
        except Exception as e:
            logger.error(f"[Kakao] Unexpected error: {str(e)}")
            return JsonResponse({'error': '카카오 처리 중 예상치 못한 오류', 'detail': str(e)}, status=500)

        try:
            # 카카오 서버로부터 가져온 이메일이 user에 존재하는지 검사 (login_type 포함)
            exists = User.objects.filter(user_id=kakao_email, login_type="kakao").exists()

            # 미가입자는 로그인 페이지로 보내 확인 문구를 띄운 뒤 회원가입으로 안내
            if not exists:
                try:
                    encrypted_email = cryptographysss.encrypt_aes(kakao_email)
                    id_param = quote(encrypted_email)
                except Exception:
                    id_param = ''
                # 로컬에서 시작한 경우에는 로컬 절대주소로, 그 외에는 상대경로로 반환
                target_base = "http://localhost:3000" if state == "localhost" else ""
                return redirect(f"{target_base}/app/login?signupPrompt=1&id={id_param}")

            # 가입되어있는 경우 토큰 생성하여 로딩 페이지로 리다이렉트
            user = User.objects.get(user_id=kakao_email, login_type="kakao")
            
            # JWT 토큰 생성
            refresh = RefreshToken()
            refresh['user_code'] = user.user_code
            access_token = str(refresh.access_token)
            
            # 로딩 페이지로 리다이렉트 (토큰을 파라미터로 전달)
            target_base = "http://localhost:3000" if state == "localhost" else ""
            target = f"{target_base}/app/loading?code={access_token}"
            html = f"""<!doctype html><html><head><meta http-equiv='refresh' content='0;url={target}'/></head><body><script>window.location.replace('{target}');</script></body></html>"""
            return HttpResponse(html)
        except Exception as e:
            logger.error(f"[Kakao] 가입자 분기 처리 중 오류: {str(e)}\n{traceback.format_exc()}")
            return JsonResponse({'error': '가입자 처리 중 서버 오류', 'detail': str(e)}, status=500)

# =============================== 네이버  ===============================
# 네이버 회원가입
class naverSignup(APIView):
    def post(self, request, *args, **kwargs):
        try:
            logger.info(f"[네이버 회원가입] 수신된 데이터: {request.data}")

            data = request.data
            decoded_string = unquote(data.get("user_id", ""))
            if not decoded_string:
                return JsonResponse({"error": "user_id is required"}, status=400)

            user_email = cryptographysss.decrypt_aes(decoded_string)
            logger.info(f"[네이버 회원가입] 복호화된 user_id(email): {user_email}")

            # 이미 존재하는 경우 방어 (login_type 포함)
            if User.objects.filter(user_id=user_email, login_type="naver").exists():
                return JsonResponse({"error": "이미 가입된 이메일입니다."}, status=409)

            # 공통 키 생성 (중복 방지)
            user_code = generate_unique_user_code('u')

            # user 생성
            User.objects.create(
                user_code=user_code,
                user_id=user_email,
                password="0",
                login_type="naver",
            )

            # 키 매핑 보완: 프런트에서 들어오는 다양한 키명을 모두 수용
            birth = data.get('birth') or data.get('user_birth') or ''
            name = data.get('name') or data.get('user_name') or ''
            gender = data.get('gender') or data.get('user_gender') or ''
            height = data.get('height') or data.get('user_height') or 0
            weight = data.get('weight') or data.get('user_weight') or 0
            preferred_position = data.get('preferred_position') or data.get('user_position') or ''
            user_type_val = data.get('user_type') or data.get('userType') or ''
            level_val = data.get('level') or data.get('userLevel') or ''
            ai_type_val = data.get('ai_type') or data.get('aiPersonality') or ''
            activity_area_val = data.get('activity_area') or data.get('activityArea') or ''
            marketing_agree_raw = data.get('marketing_agree', '{}')

            # marketing_agree: 모델 필드 타입에 맞춰 값 변환 (BooleanField 또는 CharField)
            agree_obj = None
            agree_str = None
            try:
                if isinstance(marketing_agree_raw, str):
                    agree_obj = json.loads(marketing_agree_raw)
                elif isinstance(marketing_agree_raw, dict):
                    agree_obj = marketing_agree_raw
            except Exception:
                agree_obj = None

            def str_to_bool(v):
                if isinstance(v, bool):
                    return v
                if isinstance(v, (int, float)):
                    return bool(v)
                if isinstance(v, str):
                    return v.strip().lower() in ['yes', 'true', 'y', '1', 'on']
                return False

            def to_yes_no(v):
                return 'yes' if str_to_bool(v) else 'no'

            if not isinstance(agree_obj, dict):
                agree_obj = {}

            normalized_agree = {
                'terms_agree': to_yes_no(agree_obj.get('terms_agree', 'no')),
                'privacy_agree': to_yes_no(agree_obj.get('privacy_agree', 'no')),
                'marketing_use_agree': to_yes_no(agree_obj.get('marketing_use_agree', 'no')),
                'marketing_receive_agree': to_yes_no(agree_obj.get('marketing_receive_agree', 'no')),
            }

            agree_bool = normalized_agree['marketing_use_agree'] == 'yes'
            try:
                field = UserInfo._meta.get_field('marketing_agree')
                if isinstance(field, dj_models.BooleanField):
                    marketing_agree_val = agree_bool
                else:
                    marketing_agree_val = json.dumps(normalized_agree, ensure_ascii=False)
            except Exception:
                marketing_agree_val = json.dumps(normalized_agree, ensure_ascii=False)

            UserInfo.objects.create(
                user_code=user_code,
                birth=birth,
                name=name,
                gender=gender,
                marketing_agree=marketing_agree_val,
                user_type=user_type_val,
                level=level_val,
                height=float(height or 0),
                weight=float(weight or 0),
                preferred_position=preferred_position,
                activity_area=activity_area_val,
                ai_type=ai_type_val,
            )

            return Response({"ok": True, "user_code": user_code}, status=status.HTTP_200_OK)

        except KeyError as e:
            logger.warning(f"[네이버 회원가입] 필수 필드 누락: {str(e)}")
            return JsonResponse({"error": f"Missing required field: {str(e)}"}, status=400)
        except Exception as e:
            logger.error(f"[네이버 회원가입] 예기치 못한 에러: {str(e)}\n{traceback.format_exc()}")
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)


# 네이버 로그인
class naver(APIView):
    def get(self, request):
        hostname = request.query_params.get('hostname')
        client = request.query_params.get('client')
        # 실제 네이버가 호출할 콜백 주소 (동작 가능한 서버)
        if hostname == "localhost":
            callback_uri = "http://localhost:8000/api/login/naver/callback/"
        else:
            callback_uri = "https://agrounds.com/api/login/naver/callback/"

        # 최종 리다이렉트 타겟(client_url)을 state로 전달 (카카오와 동일 패턴)
        if client in ["localhost", "agrounds.com"]:
            state = client
        else:
            state = hostname if hostname in ["localhost", "agrounds.com"] else "agrounds.com"

        if not NAVER_CLIENT_ID:
            return JsonResponse({'error': 'NAVER_CLIENT_ID 미설정'}, status=500)

        return redirect(
            f"https://nid.naver.com/oauth2.0/authorize?client_id={NAVER_CLIENT_ID}&redirect_uri={callback_uri}&response_type=code&state={state}&scope=email"
        )


# 네이버 로그인 - callback view
class naverCallback(APIView):
    def get(self, request, format=None):
        client_url = CLIENT_URL or "https://agrounds.com"
        # state는 최종 리다이렉트 대상(클라이언트) 구분 용도만 사용
        state = request.query_params.get('state')
        if state == "localhost":
            client_url = "http://localhost:3000"
        else:
            client_url = "https://agrounds.com"

        # 실제 토큰 교환에 사용할 redirect_uri는 현재 호출된 콜백 주소와 동일해야 함
        scheme = "https" if request.is_secure() else "http"
        host = request.get_host()
        callback_uri = f"{scheme}://{host}/api/login/naver/callback/"

        try:
            if not NAVER_CLIENT_ID or not NAVER_CLIENT_SECRET:
                return JsonResponse({'error': '네이버 클라이언트 환경변수 미설정'}, status=500)

            data = {
                "grant_type": "authorization_code",
                "client_id": NAVER_CLIENT_ID,
                "client_secret": NAVER_CLIENT_SECRET,
                "code": request.query_params.get("code"),
                "state": state,
                "redirect_uri": callback_uri,
            }
            naver_token_api = "https://nid.naver.com/oauth2.0/token"
            token_resp = requests.post(naver_token_api, data)
            logger.info(f"[Naver] Token response status: {token_resp.status_code}")
            if token_resp.status_code != 200:
                logger.error(f"[Naver] Token API error {token_resp.status_code}: {token_resp.text}")
                return JsonResponse({'error': '네이버 토큰 발급 실패', 'detail': token_resp.text}, status=502)

            token_json = token_resp.json()
            logger.info(f"[Naver] Token response: {token_json}")
            access_token = token_json.get("access_token")
            if not access_token:
                return JsonResponse({'error': '네이버 토큰 응답에 access_token이 없습니다.', 'detail': token_json}, status=502)

            # 유저 정보 조회
            naver_user_api = "https://openapi.naver.com/v1/nid/me"
            header = {"Authorization": f"Bearer {access_token}"}
            user_resp = requests.get(naver_user_api, headers=header)
            logger.info(f"[Naver] User response status: {user_resp.status_code}")
            if user_resp.status_code != 200:
                logger.error(f"[Naver] User API error {user_resp.status_code}: {user_resp.text}")
                return JsonResponse({'error': '네이버 사용자 정보 조회 실패', 'detail': user_resp.text}, status=502)

            user_info_from_naver = user_resp.json()
            logger.info(f"[Naver] User info: {user_info_from_naver}")

            # Naver 응답 구조: { resultcode: "00", message: "success", response: { email: "...", ... } }
            naver_email = (user_info_from_naver.get("response") or {}).get("email")
            if naver_email is None:
                return JsonResponse({'error': '네이버에서 이메일 제공에 동의하지 않았습니다. 이메일 제공 동의를 해주세요.'}, status=400)
        except requests.exceptions.RequestException as e:
            logger.error(f"[Naver] Network error: {str(e)}")
            return JsonResponse({'error': '네이버 API 네트워크 오류', 'detail': str(e)}, status=502)
        except Exception as e:
            logger.error(f"[Naver] Unexpected error: {str(e)}")
            return JsonResponse({'error': '네이버 처리 중 예상치 못한 오류', 'detail': str(e)}, status=500)

        try:
            # 가입 여부 확인 (user 기준, login_type 포함)
            exists = User.objects.filter(user_id=naver_email, login_type="naver").exists()

            # 미가입자는 로그인 페이지로 보내 확인 문구를 띄운 뒤 회원가입으로 안내
            if not exists:
                try:
                    encrypted_email = cryptographysss.encrypt_aes(naver_email)
                    id_param = quote(encrypted_email)
                except Exception:
                    id_param = ''
                target_base = "http://localhost:3000" if state == "localhost" else ""
                return redirect(f"{target_base}/app/login?signupPrompt=1&id={id_param}")

            # 가입되어있는 경우 토큰 생성하여 로딩 페이지로 리다이렉트
            user = User.objects.get(user_id=naver_email, login_type="naver")
            
            # JWT 토큰 생성
            refresh = RefreshToken()
            refresh['user_code'] = user.user_code
            access_token = str(refresh.access_token)
            
            # 로딩 페이지로 리다이렉트 (토큰을 파라미터로 전달)
            target_base = "http://localhost:3000" if state == "localhost" else ""
            target = f"{target_base}/app/loading?code={access_token}"
            html = f"""<!doctype html><html><head><meta http-equiv='refresh' content='0;url={target}'/></head><body><script>window.location.replace('{target}');</script></body></html>"""
            return HttpResponse(html)
        except Exception as e:
            logger.error(f"[Naver] 가입자 분기 처리 중 오류: {str(e)}\n{traceback.format_exc()}")
            return JsonResponse({'error': '가입자 처리 중 서버 오류', 'detail': str(e)}, status=500)

# =============================== 애플  ===============================
# 애플 로그인 시작 (카카오/네이버와 동일 패턴)
# 애플 로그인 - 회원가입
class AppleSignup(APIView):
    def post(self, request, *args, **kwargs):
        try:
            logger.info(f"[애플 회원가입] 수신된 데이터: {request.data}")

            data = request.data
            decoded_string = unquote(data.get("user_id", ""))
            if not decoded_string:
                return JsonResponse({"error": "user_id is required"}, status=400)

            user_email = cryptographysss.decrypt_aes(decoded_string)
            logger.info(f"[애플 회원가입] 복호화된 user_id(email): {user_email}")

            # 이미 존재하는 경우 방어 (login_type 포함)
            if User.objects.filter(user_id=user_email, login_type="apple").exists():
                return JsonResponse({"error": "이미 가입된 이메일입니다."}, status=409)

            # 공통 키 생성 (중복 방지)
            user_code = generate_unique_user_code('u')

            # user 생성
            User.objects.create(
                user_code=user_code,
                user_id=user_email,
                password="0",
                login_type="apple",
            )

            # 키 매핑 보완: 프런트에서 들어오는 다양한 키명을 모두 수용
            birth = data.get('birth') or data.get('user_birth') or ''
            name = data.get('name') or data.get('user_name') or ''
            gender = data.get('gender') or data.get('user_gender') or ''
            height = data.get('height') or data.get('user_height') or 0
            weight = data.get('weight') or data.get('user_weight') or 0
            preferred_position = data.get('preferred_position') or data.get('user_position') or ''
            user_type_val = data.get('user_type') or data.get('userType') or ''
            level_val = data.get('level') or data.get('userLevel') or ''
            ai_type_val = data.get('ai_type') or data.get('aiPersonality') or ''
            activity_area_val = data.get('activity_area') or data.get('activityArea') or ''
            marketing_agree_raw = data.get('marketing_agree', '{}')

            # marketing_agree: 모델 필드 타입에 맞춰 값 변환 (BooleanField 또는 CharField)
            agree_obj = None
            try:
                if isinstance(marketing_agree_raw, str):
                    agree_obj = json.loads(marketing_agree_raw)
                elif isinstance(marketing_agree_raw, dict):
                    agree_obj = marketing_agree_raw
            except Exception:
                agree_obj = None

            def str_to_bool(v):
                if isinstance(v, bool):
                    return v
                if isinstance(v, (int, float)):
                    return bool(v)
                if isinstance(v, str):
                    return v.strip().lower() in ['yes', 'true', 'y', '1', 'on']
                return False

            def to_yes_no(v):
                return 'yes' if str_to_bool(v) else 'no'

            if not isinstance(agree_obj, dict):
                agree_obj = {}

            normalized_agree = {
                'terms_agree': to_yes_no(agree_obj.get('terms_agree', 'no')),
                'privacy_agree': to_yes_no(agree_obj.get('privacy_agree', 'no')),
                'marketing_use_agree': to_yes_no(agree_obj.get('marketing_use_agree', 'no')),
                'marketing_receive_agree': to_yes_no(agree_obj.get('marketing_receive_agree', 'no')),
            }

            # 대상 모델 필드 타입 확인: UserInfo.marketing_agree
            try:
                field = UserInfo._meta.get_field('marketing_agree')
                if isinstance(field, dj_models.BooleanField):
                    marketing_agree_val = normalized_agree['marketing_use_agree'] == 'yes'
                else:
                    marketing_agree_val = json.dumps(normalized_agree, ensure_ascii=False)
            except Exception:
                marketing_agree_val = json.dumps(normalized_agree, ensure_ascii=False)

            # user_info 생성
            UserInfo.objects.create(
                user_code=user_code,
                birth=birth,
                name=name,
                gender=gender,
                marketing_agree=marketing_agree_val,
                user_type=user_type_val,
                level=level_val,
                height=float(height or 0),
                weight=float(weight or 0),
                preferred_position=preferred_position,
                activity_area=activity_area_val,
                ai_type=ai_type_val,
            )

            return Response({"ok": True, "user_code": user_code}, status=status.HTTP_200_OK)

        except KeyError as e:
            return JsonResponse({"error": f"Missing required field: {str(e)}"}, status=400)
        except Exception as e:
            logger.error(f"[애플 회원가입] 예기치 못한 에러: {str(e)}\n{traceback.format_exc()}")
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)


class apple(APIView):
    def get(self, request):
        hostname = request.query_params.get('hostname')
        client = request.query_params.get('client')
        if hostname == "localhost":
            callback_uri = "http://localhost:8000/api/login/apple/callback/"
        else:
            callback_uri = "https://agrounds.com/api/login/apple/callback/"

        if client in ["localhost", "agrounds.com"]:
            state = client
        else:
            state = hostname if hostname in ["localhost", "agrounds.com"] else "agrounds.com"

        # Apple 권고: response_mode=form_post 로 POST로 전달받도록 설정
        authorize_url = (
            "https://appleid.apple.com/auth/authorize"
            f"?client_id={APPLE_CLIENT_ID}"
            f"&redirect_uri={callback_uri}"
            f"&response_type=code%20id_token"
            f"&response_mode=form_post"
            f"&scope=name%20email"
            f"&state={state}"
        )
        return redirect(authorize_url)


# 애플 로그인 - callback view
class AppleLoginCallback(APIView):
    def get(self, request):
        client_url = CLIENT_URL or "https://agrounds.com"
        if request.query_params.get('hostname') == 'localhost' :
            client_url = "http://localhost:3000"

        id_token = request.query_params.get("id_token")
        code = request.query_params.get("code")
        state = request.query_params.get('state')
        if not id_token and not code:
            return Response({"error":"토큰이 없습니다."},status=400)

        try:
            email = None
            if id_token:
                # Apple 공개키 가져오기 및 id_token 검증
                res = requests.get("https://appleid.apple.com/auth/keys")
                apple_keys = res.json()["keys"]
                header = jwt.get_unverified_header(id_token)
                key = next(k for k in apple_keys if k["kid"] == header["kid"])
                public_key = RSAAlgorithm.from_jwk(key)
                payload = jwt.decode(id_token, public_key, algorithms=["RS256"], audience=env("APPLE_CLIENT_ID"))
                email = payload.get("email")

            # 동일 분기: 이메일만으로 가입 여부 확인
            if not email:
                return Response({"error":"이메일을 확인할 수 없습니다."}, status=400)

            exists = User.objects.filter(user_id=email, login_type="apple").exists()
            if not exists:
                try:
                    encrypted_email = cryptographysss.encrypt_aes(email)
                    id_param = quote(encrypted_email)
                except Exception:
                    id_param = ''
                target_base = "http://localhost:3000" if state == "localhost" else ""
                return redirect(f"{target_base}/app/login?signupPrompt=1&id={id_param}")

            # 가입되어있는 경우 토큰 생성하여 로딩 페이지로 리다이렉트
            user = User.objects.get(user_id=email, login_type="apple")
            
            # JWT 토큰 생성
            refresh = RefreshToken()
            refresh['user_code'] = user.user_code
            access_token = str(refresh.access_token)
            
            # 로딩 페이지로 리다이렉트 (토큰을 파라미터로 전달)
            target_base = "http://localhost:3000" if state == "localhost" else ""
            target = f"{target_base}/app/loading?code={access_token}"
            html = f"""<!doctype html><html><head><meta http-equiv='refresh' content='0;url={target}'/></head><body><script>window.location.replace('{target}');</script></body></html>"""
            return HttpResponse(html)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def post(self, request):
        # Apple은 response_mode=form_post로 전달하는 경우 POST로 콜백 호출
        client_url = CLIENT_URL or "https://agrounds.com"
        if request.data.get('hostname') == 'localhost' :
            client_url = "http://localhost:3000"

        id_token = request.data.get("id_token")
        code = request.data.get("code")
        state = request.data.get('state')
        if not id_token and not code:
            return Response({"error":"토큰이 없습니다."},status=400)

        try:
            email = None
            if id_token:
                res = requests.get("https://appleid.apple.com/auth/keys")
                apple_keys = res.json()["keys"]
                header = jwt.get_unverified_header(id_token)
                key = next(k for k in apple_keys if k["kid"] == header["kid"])
                public_key = RSAAlgorithm.from_jwk(key)
                payload = jwt.decode(id_token, public_key, algorithms=["RS256"], audience=env("APPLE_CLIENT_ID"))
                email = payload.get("email")

            if not email:
                return Response({"error":"이메일을 확인할 수 없습니다."}, status=400)

            exists = User.objects.filter(user_id=email, login_type="apple").exists()
            if not exists:
                try:
                    encrypted_email = cryptographysss.encrypt_aes(email)
                    id_param = quote(encrypted_email)
                except Exception:
                    id_param = ''
                target_base = "http://localhost:3000" if state == "localhost" else ""
                return redirect(f"{target_base}/app/login?signupPrompt=1&id={id_param}")

            # 가입되어있는 경우 토큰 생성하여 로딩 페이지로 리다이렉트
            user = User.objects.get(user_id=email, login_type="apple")
            
            # JWT 토큰 생성
            refresh = RefreshToken()
            refresh['user_code'] = user.user_code
            access_token = str(refresh.access_token)
            
            # 로딩 페이지로 리다이렉트 (토큰을 파라미터로 전달)
            target_base = "http://localhost:3000" if state == "localhost" else ""
            target = f"{target_base}/app/loading?code={access_token}"
            html = f"""<!doctype html><html><head><meta http-equiv='refresh' content='0;url={target}'/></head><body><script>window.location.replace('{target}');</script></body></html>"""
            return HttpResponse(html)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


# 이메일 존재 여부 확인 (user 기준)
class check_user_exists(APIView):
    def get(self, request):
        email = request.query_params.get('email')
        enc_id = request.query_params.get('id')
        login_type_param = request.query_params.get('login_type')
        if not email and enc_id:
            try:
                decoded = unquote(enc_id)
                email = cryptographysss.decrypt_aes(decoded)
            except Exception as e:
                return JsonResponse({"error":"invalid id"}, status=400)
        if not email:
            return JsonResponse({"error":"email 또는 id 파라미터가 필요합니다."}, status=400)
        if login_type_param:
            exists = User.objects.filter(user_id=email, login_type=login_type_param).exists()
        else:
            exists = User.objects.filter(user_id=email).exists()
        return JsonResponse({"exists": exists}, status=200)


# 로그인
class Login(APIView):
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


# 토큰으로 사용자 정보 받아오기
class Get_UserInfo_For_Token(APIView):
    def get(self, request):
        # 헬퍼 함수를 사용하여 사용자 정보 가져오기
        user, error_response = get_user_from_token(request)
        if error_response:
            return error_response
        
        try:
            # UserInfo에서 정보 가져오기
            user_info = UserInfo.objects.get(user_code=user.user_code)
            
            # 새로운 토큰 생성
            refresh = RefreshToken()
            refresh['user_code'] = user.user_code
            new_token = str(refresh.access_token)
            
            # 응답 데이터 구성
            user_dict = {
                'user_code': user.user_code,
                'user_id': user.user_id,
                'user_name': user_info.name,
                'user_birth': user_info.birth,
                'user_gender': user_info.gender,
                'user_nickname': user_info.name,  # V3에서는 nickname이 따로 없으므로 name 사용
                'marketing_agree': user_info.marketing_agree,
                'login_type': user.login_type,
                'user_type': user_info.user_type,
                'user_height': user_info.height,
                'user_weight': user_info.weight,
                'user_position': user_info.preferred_position,
                'team_code': '',  # V3에서는 아직 팀 기능이 없으므로 빈 문자열
                'token': new_token
            }

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except UserInfo.DoesNotExist:
            return Response(
                {"error": "User info not found"}, status=status.HTTP_404_NOT_FOUND
            )
        return JsonResponse(user_dict, status=200)