# 필수
from django.urls import path, include
from . import views

urlpatterns = [
    # S3 데이터 파일 목록 조회
    path('s3-data-files/', views.S3DataFilesList.as_view(), name='s3-data-files'),
    
    # 선택된 데이터 파일로 경기 분석 시작
    path('start-analysis/', views.StartAnalysisWithData.as_view(), name='start-analysis'),
    
    # S3 파일 내용 조회
    path('s3-file-content/', views.GetS3FileContent.as_view(), name='s3-file-content'),
    
    # S3 Raw 파일 내용 조회 (CORS 문제 해결용)
    path('s3-raw-file-content/', views.GetS3RawFileContent.as_view(), name='s3-raw-file-content'),
]
