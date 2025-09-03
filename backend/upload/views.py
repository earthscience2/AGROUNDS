from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# upload 앱은 파일 업로드 관련 기능만 담당
# 경기 정보 추가는 match 앱에서 처리