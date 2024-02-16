from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
import assist.views
import DB.views
import login.views

from django.conf import settings
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
    path("api/assist/", include("assist.urls")),
    path("api/login/", include("login.urls")),
    path("api/team/", include('team.urls'),),
]

urlpatterns += [
   path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]