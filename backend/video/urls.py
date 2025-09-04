from django.urls import path
from . import views

urlpatterns = [
    # quarter_code로 비디오 목록 조회
    path('get-videos-by-quarter/', views.get_videos_by_quarter, name='get_videos_by_quarter'),
    
    # 특정 비디오 상세 정보 조회
    path('get-video-detail/<str:video_code>/', views.get_video_detail, name='get_video_detail'),
]
