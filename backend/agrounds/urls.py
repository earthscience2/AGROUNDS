from django.contrib import admin
from django.urls import include, path

from rest_framework import routers
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

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

    # test page
    path("api/test_page/", include("test_page.urls")),

    # app
    path("api/user/", include("user.urls")),
    path("api/login/", include("login.urls")),
    path("api/team/", include("team.urls")),
    path("api/player/", include("player.urls")),
    path("api/match/", include("match.urls")),
    path("api/video/", include("match_video.urls")),
    path("api/analyze/", include("analyze.urls")),
    path("api/ground/", include("ground.urls")),
]

urlpatterns += [
   path('api/swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]