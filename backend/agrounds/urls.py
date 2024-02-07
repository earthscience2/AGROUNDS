from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
import assist.views
import DB.views
import login.views


urlpatterns = [
    # admin
    path("admin/", admin.site.urls),
    # 백엔드 api
    path("api/assist/", include("assist.urls")),
    path("api/login/", include("login.urls")),
]
