from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from datetime import datetime
import urllib.parse

# ===============================================
# S3 파일 관리 API
# ===============================================

class S3DataFilesList(APIView):
    """
    S3 데이터 파일 목록 조회 API
    S3에서 데이터 파일 목록을 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_description="S3에서 데이터 파일 목록을 조회합니다.",
        responses={
            200: openapi.Response(
                description="조회 성공",
                examples={
                    "application/json": {
                        "files": [
                            {
                                "name": "data_file_001.txt",
                                "size": 1024,
                                "lastModified": "2024-01-01T00:00:00Z",
                                "url": "https://agrounds-gps.s3.ap-northeast-2.amazonaws.com/data/edit/data_file_001.txt"
                            }
                        ],
                        "count": 1
                    }
                }
            ),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """S3 데이터 파일 목록 조회"""
        try:
            # S3 클라이언트 생성
            try:
                s3_client = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_S3_REGION_NAME
                )
            except Exception as e:
                return Response(
                    {"error": "S3 서비스에 접근할 수 없습니다. 잠시 후 다시 시도해주세요."}, 
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # S3 버킷에서 데이터 파일 목록 조회
            bucket_name = "aground-gps"
            prefix = "data/edit/"  # 데이터 파일이 저장된 경로
            
            try:
                response = s3_client.list_objects_v2(
                    Bucket=bucket_name,
                    Prefix=prefix
                )
                
                files = []
                if 'Contents' in response:
                    for obj in response['Contents']:
                        # 파일명만 추출 (경로 제거)
                        file_name = obj['Key'].split('/')[-1]
                        
                        # .txt 파일만 필터링
                        if file_name.endswith('.txt'):
                            files.append({
                                "name": file_name,
                                "size": obj['Size'],
                                "lastModified": obj['LastModified'].isoformat(),
                                "url": f"https://{bucket_name}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{obj['Key']}"
                            })
                
                # 파일명으로 정렬
                files.sort(key=lambda x: x['name'])
                
                return Response({
                    "files": files,
                    "count": len(files)
                }, status=status.HTTP_200_OK)
                
            except ClientError as e:
                return Response(
                    {"error": f"S3에서 파일 목록을 조회할 수 없습니다: {str(e)}"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            return Response(
                {"error": f"데이터 파일 목록 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class StartAnalysisWithData(APIView):
    """
    경기 분석 시작 API
    선택된 데이터 파일로 경기 분석을 시작합니다.
    """
    
    @swagger_auto_schema(
        operation_description="선택된 데이터 파일로 경기 분석을 시작합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'file_name': openapi.Schema(type=openapi.TYPE_STRING, description='파일명')
            },
            required=['user_code', 'file_name']
        ),
        responses={
            200: openapi.Response(description="분석 시작 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """경기 분석 시작"""
        try:
            user_code = request.data.get('user_code')
            file_name = request.data.get('file_name')
            
            if not user_code or not file_name:
                return Response(
                    {"error": "user_code and file_name parameters are required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # TODO: 실제 분석 로직 구현
            return Response({
                "message": "분석이 시작되었습니다.",
                "user_code": user_code,
                "file_name": file_name,
                "status": "processing"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"분석 시작 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetS3FileContent(APIView):
    """
    S3 파일 내용 조회 API
    S3에서 특정 파일의 내용을 가져옵니다.
    """
    
    @swagger_auto_schema(
        operation_description="S3에서 특정 파일의 내용을 가져옵니다.",
        manual_parameters=[
            openapi.Parameter(
                'file_url', 
                openapi.IN_QUERY,
                description="S3 파일 URL",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="파일 내용 조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="파일을 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        file_url = request.query_params.get('file_url')
        
        if not file_url:
            return Response(
                {"error": "file_url parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # S3 클라이언트 생성
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )
            
            # URL에서 버킷과 키 추출
            parsed_url = urllib.parse.urlparse(file_url)
            bucket_name = parsed_url.netloc.split('.')[0]  # aground-gps.s3.ap-northeast-2.amazonaws.com -> aground-gps
            key = parsed_url.path.lstrip('/')  # /data/edit/p_001.txt -> data/edit/p_001.txt
            
            # S3에서 파일 내용 가져오기
            response = s3_client.get_object(Bucket=bucket_name, Key=key)
            file_content = response['Body'].read().decode('utf-8')
            
            return Response({
                "success": True,
                "content": file_content,
                "file_name": key.split('/')[-1]  # 파일명만 추출
            }, status=status.HTTP_200_OK)
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'NoSuchKey':
                return Response(
                    {"error": "파일을 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            else:
                return Response(
                    {"error": f"S3 오류: {str(e)}"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except NoCredentialsError:
            return Response(
                {"error": "AWS 자격 증명을 찾을 수 없습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {"error": f"파일 내용 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetS3RawFileContent(APIView):
    """
    S3 Raw 파일 내용 조회 API
    S3에서 Raw 경로의 파일 내용을 가져옵니다 (CORS 문제 해결용).
    """
    
    @swagger_auto_schema(
        operation_description="S3에서 Raw 경로의 파일 내용을 가져옵니다. CORS 문제를 해결하기 위한 프록시 역할을 합니다.",
        manual_parameters=[
            openapi.Parameter(
                'file_url', 
                openapi.IN_QUERY,
                description="S3 파일 URL (자동으로 raw 경로로 변환됩니다)",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="Raw 파일 내용 조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="파일을 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        file_url = request.query_params.get('file_url')
        
        if not file_url:
            return Response(
                {"error": "file_url parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # S3 클라이언트 생성
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )
            
            # URL 또는 상대 경로 처리
            if file_url.startswith('http://') or file_url.startswith('https://'):
                # 전체 URL인 경우 파싱
                parsed_url = urllib.parse.urlparse(file_url)
                bucket_name = parsed_url.netloc.split('.')[0]  # aground-gps.s3.ap-northeast-2.amazonaws.com -> aground-gps
                key = parsed_url.path.lstrip('/')  # /data/edit/p_001.txt -> data/edit/p_001.txt
            else:
                # 상대 경로인 경우 직접 사용 (예: data/player/edit/p_001.csv)
                bucket_name = "aground-gps"
                key = file_url
            
            # 경로 정규화 - URL인 경우만
            if file_url.startswith('http'):
                # /edit을 /player/edit로 변경
                if '/edit/' in key and '/player/edit/' not in key:
                    key = key.replace('/edit/', '/player/edit/')
                # /raw를 /player/edit로 변경
                elif '/raw/' in key:
                    key = key.replace('/raw/', '/player/edit/')
                # player/edit 경로가 없으면 추가
                elif not '/player/edit/' in key:
                    key_parts = key.split('/')
                    if len(key_parts) >= 2:
                        key_parts.insert(-1, 'player')
                        key_parts.insert(-1, 'edit')
                        key = '/'.join(key_parts)
            
            print(f"Raw API - 원본 file_url: {file_url}")
            print(f"Raw API - 최종 키: {key}")
            print(f"Raw API - 버킷: {bucket_name}")
            
            # S3에서 파일 내용 가져오기
            response = s3_client.get_object(Bucket=bucket_name, Key=key)
            file_content = response['Body'].read().decode('utf-8')
            
            return Response({
                "success": True,
                "content": file_content,
                "file_name": key.split('/')[-1],  # 파일명만 추출
                "raw_key": key  # 디버깅용
            }, status=status.HTTP_200_OK)
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'NoSuchKey':
                return Response(
                    {"error": f"Raw 파일을 찾을 수 없습니다. 키: {key}"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            else:
                return Response(
                    {"error": f"S3 오류: {str(e)}"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except NoCredentialsError:
            return Response(
                {"error": "AWS 자격 증명을 찾을 수 없습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {"error": f"Raw 파일 내용 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )