from django.urls import path
from . import views

urlpatterns = [
    # quarter_code로 비디오 목록 조회
    path('get-videos-by-quarter/', views.get_videos_by_quarter, name='get_videos_by_quarter'),
    
    # 특정 비디오 상세 정보 조회
    path('get-video-detail/<str:video_code>/', views.get_video_detail, name='get_video_detail'),
    
    # 영상 추가
    path('create/', views.create_video, name='create_video'),
    
    # 영상 삭제
    path('delete/<str:video_code>/', views.delete_video, name='delete_video'),
    
    # 영상 쿼터 변경
    path('<str:video_code>/update/', views.update_video_quarter, name='update_video_quarter'),
    
    # YouTube 업로드 날짜 조회
    path('youtube-upload-date/', views.get_youtube_upload_date, name='get_youtube_upload_date'),
    
    # 비디오 폴더 관련 API
    path('folders/', views.get_user_video_folders, name='get_user_video_folders'),
    path('folders/create/', views.create_video_folder, name='create_video_folder'),
    path('folders/<str:folder_code>/update/', views.update_video_folder, name='update_video_folder'),
    path('folders/<str:folder_code>/delete/', views.delete_video_folder, name='delete_video_folder'),
    path('folders/<str:folder_code>/video-count/', views.get_folder_video_count, name='get_folder_video_count'),
    path('folders/<str:folder_code>/videos/', views.get_folder_videos, name='get_folder_videos'),
    
    # 팀 비디오 폴더 관련 API
    path('team/folders/', views.TeamVideoFolderList.as_view(), name='team_video_folders'),
    path('team/folders/create/', views.TeamVideoFolderCreate.as_view(), name='team_video_folder_create'),
    path('team/folders/update/', views.TeamVideoFolderUpdate.as_view(), name='team_video_folder_update'),
    path('team/folders/delete/', views.TeamVideoFolderDelete.as_view(), name='team_video_folder_delete'),
    
    # 팀 비디오 관련 API
    path('team/folders/<str:folder_code>/videos/', views.get_team_folder_videos, name='get_team_folder_videos'),
    path('team/create/', views.create_team_video, name='create_team_video'),
    path('team/delete/<str:video_code>/', views.delete_team_video, name='delete_team_video'),
]
