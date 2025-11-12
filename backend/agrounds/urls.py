from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
import logging
import time
import uuid
from django.utils.deprecation import MiddlewareMixin

from rest_framework import routers
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.views import exception_handler as drf_exception_handler


router = routers.DefaultRouter()

schema_view = get_schema_view(
    openapi.Info(
        title="Aground 서비스 api",
        default_version='v1',
        description="Aground 웹 서비스 api 목록입니다.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


# -------- API Logging Helpers & Middleware --------
api_logger = logging.getLogger('api')


def _parse_api(path: str):
    try:
        parts = [p for p in (path or '').split('/') if p]
        if len(parts) >= 3 and parts[0] == 'api':
            api_app = parts[1]
            api_name = f"{api_app}/{parts[2]}"
            return api_app, api_name
        return None, None
    except Exception:
        return None, None


def _client_ip(request):
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def _extract_business_keys(request, view_kwargs=None):
    keys = {}
    try:
        # URL kwargs 우선
        if view_kwargs:
            for k in ['user_code', 'team_code', 'match_code', 'quarter_code', 'video_code', 'folder_code', 'ground_code', 'content_code']:
                v = view_kwargs.get(k)
                if v:
                    keys[k] = v

        # Query string 병합
        if hasattr(request, 'GET'):
            for k in ['user_code', 'team_code', 'match_code', 'quarter_code', 'video_code', 'folder_code', 'ground_code', 'content_code']:
                if k not in keys:
                    v = request.GET.get(k)
                    if v:
                        keys[k] = v

        # 인증 사용자 ID
        user = getattr(request, 'user', None)
        if getattr(user, 'is_authenticated', False):
            auth_user_id = getattr(user, 'user_id', None) or getattr(user, 'id', None)
            if auth_user_id is not None:
                keys['auth_user_id'] = str(auth_user_id)
    except Exception:
        pass
    return keys


class ApiLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request._start_time = time.time()
        request._request_id = str(uuid.uuid4())
        try:
            api_app, api_name = _parse_api(getattr(request, 'path', ''))
            # 쿼리스트링 기반으로 1차 비즈키 추출
            request._biz_keys = _extract_business_keys(request)
            payload = {
                "event": "api.request",
                "request_id": request._request_id,
                "method": getattr(request, 'method', None),
                "path": getattr(request, 'path', None),
                "api_app": api_app,
                "api_name": api_name,
                "client_ip": _client_ip(request),
                "user_agent": request.META.get('HTTP_USER_AGENT'),
            }
            if getattr(request, '_biz_keys', None):
                payload.update(request._biz_keys)
            api_logger.info(payload)
        except Exception:
            # 로깅 실패는 요청 흐름에 영향 주지 않음
            pass

    def process_view(self, request, view_func, view_args, view_kwargs):
        # URL kwargs 및 인증 사용자 기반으로 비즈키를 보강
        try:
            enriched = _extract_business_keys(request, view_kwargs or {})
            base = getattr(request, '_biz_keys', {}) or {}
            base.update(enriched)
            request._biz_keys = base
        except Exception:
            pass
        return None

    def process_response(self, request, response):
        try:
            duration_ms = None
            if hasattr(request, '_start_time'):
                duration_ms = int((time.time() - request._start_time) * 1000)
            api_app, api_name = _parse_api(getattr(request, 'path', ''))
            payload = {
                "event": "api.response",
                "request_id": getattr(request, '_request_id', None),
                "method": getattr(request, 'method', None),
                "path": getattr(request, 'path', None),
                "api_app": api_app,
                "api_name": api_name,
                "status_code": getattr(response, 'status_code', None),
                "duration_ms": duration_ms,
            }
            if getattr(request, '_biz_keys', None):
                payload.update(request._biz_keys)
            api_logger.info(payload)
            # Response 헤더에 Request-ID 부착
            if getattr(request, '_request_id', None):
                response['X-Request-ID'] = request._request_id
        finally:
            return response


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    try:
        request = context.get('request')
        api_app, api_name = _parse_api(getattr(request, 'path', ''))
        status_code = getattr(response, 'status_code', 500) if response else 500
        payload = {
            "event": "api.error",
            "request_id": getattr(request, '_request_id', None),
            "path": getattr(request, 'path', None),
            "api_app": api_app,
            "api_name": api_name,
            "status_code": status_code,
            "error_message": str(exc)[:500],
        }
        if getattr(request, '_biz_keys', None):
            payload.update(request._biz_keys)
        api_logger.error(payload)
    except Exception:
        pass
    return response


urlpatterns = [
    # admin
    path("admin/", admin.site.urls),
    # 백엔드 api

    # app
    path("api/user/", include("user.urls")),
    path("api/login/", include("login.urls")),
    path("api/match/", include("match.urls")),
    path("api/anal/", include("anal.urls")),
    path("api/video/", include("video.urls")),

    path("api/ground/", include("ground.urls")),
    path("api/upload/", include("upload.urls")),
]

urlpatterns += [
   path('api/swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# 개발 환경에서 로컬 미디어 파일 서빙
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)