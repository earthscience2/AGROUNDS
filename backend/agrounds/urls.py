from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# user 앱의 뷰 임포트
from user import views as user_views

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


urlpatterns = [
    # admin
    path("admin/", admin.site.urls),
    # 백엔드 api

    # app
    path("api/user/", include("user.urls")),
    path("api/login/", include("login.urls")),
    path("api/match/", include("match.urls")),
    path("api/anal/", include("anal.urls")),
    
    # analysis 엔드포인트 (user 앱의 뷰를 직접 사용)
    path("api/analysis/", include([
        path("get-ovr-data/", user_views.GetUserOvrDataView.as_view()),
        path("get-stats-data/", user_views.GetUserStatsDataView.as_view()),
        path("get-point-data/", user_views.GetUserPointDataView.as_view()),
    ])),

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