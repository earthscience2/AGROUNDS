from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count
from django.conf import settings
from datetime import date
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
import logging

logger = logging.getLogger(__name__)
from PIL import Image
from io import BytesIO

# 명시적 모델 임포트
from DB.models import User, UserInfo, Upload, TeamInfo, PlayerTeamCross, TeamMatchCross, TeamMatchQuarterCross, PlayerMatch, TeamMatch, GroundInfo, ContentBoard, ContentComment, ContentEventParticipation, Notification
from .serializers import UserChangeSerializer, TeamSearchSerializer, TeamListSerializer, ContentBoardListSerializer, ContentBoardDetailSerializer, ContentCommentSerializer, InquiryCreateSerializer
from django.db.models import Q
from django.core.paginator import Paginator
from django.utils import timezone

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class Get_UserInfo_Simple(APIView):
    """
    사용자 정보 조회 및 수정 API
    """
    
    @swagger_auto_schema(
        operation_description="사용자 정보를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description="사용자 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="사용자를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """사용자 정보 조회"""
        user_code = request.query_params.get('user_code')
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_info = get_object_or_404(UserInfo, user_code=user_code, deleted_at__isnull=True)
            serializer = UserChangeSerializer(user_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"사용자 정보 조회 실패: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @swagger_auto_schema(
        operation_description="사용자 정보를 수정합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'name': openapi.Schema(type=openapi.TYPE_STRING, description='이름'),
                'birth': openapi.Schema(type=openapi.TYPE_STRING, description='생년월일'),
                'gender': openapi.Schema(type=openapi.TYPE_STRING, description='성별'),
                'height': openapi.Schema(type=openapi.TYPE_NUMBER, description='키'),
                'weight': openapi.Schema(type=openapi.TYPE_NUMBER, description='몸무게'),
                'preferred_position': openapi.Schema(type=openapi.TYPE_STRING, description='선호 포지션'),
                'activity_area': openapi.Schema(type=openapi.TYPE_STRING, description='활동 지역')
            },
            required=['user_code']
        ),
        responses={
            200: openapi.Response(description="수정 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="사용자를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def patch(self, request):
        """사용자 정보 수정"""
        user_code = request.data.get('user_code')
        copied_data = request.data.copy()
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 빈 값들을 제거 (user_code는 제외)
        for field_name in request.data:
            if field_name != 'user_code':
                value = request.data.get(field_name)
                if not value or value == '':
                    copied_data.pop(field_name, None)

        user_info = get_object_or_404(UserInfo, user_code=user_code, deleted_at__isnull=True)
        
        serializer = UserChangeSerializer(user_info, data=copied_data, partial=True, user_code=user_code)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class UserDelete(APIView):
    """
    회원 탈퇴 API (소프트 삭제)
    헤더에 JWT 토큰 필요
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="회원 탈퇴를 처리합니다. (소프트 삭제)",
        responses={
            200: openapi.Response(description="회원 탈퇴 성공"),
            404: openapi.Response(description="사용자를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def delete(self, request):
        """회원 탈퇴 (소프트 삭제)"""
        user = request.user
        try:
            user_info = UserInfo.objects.get(user_code=user.user_code)
            # 소프트 삭제: deleted_at 필드에 현재 시간 설정
            user_info.deleted_at = timezone.now()
            user_info.save()
            
            return Response(
                {"message": "회원 탈퇴가 완료되었습니다."}, 
                status=status.HTTP_200_OK
            )
        except UserInfo.DoesNotExist:
            return Response(
                {"error": "해당 사용자가 존재하지 않습니다."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# 사용자 이름 중복 개수 확인
class CheckNameDuplicate(APIView):
    """
    사용자 이름 중복 개수 확인 API (GET)
    """
    
    @swagger_auto_schema(
        operation_description="입력된 이름의 중복 개수를 확인합니다.",
        manual_parameters=[
            openapi.Parameter(
                'name',
                openapi.IN_QUERY,
                description="확인할 사용자 이름",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="조회 성공",
                examples={
                    "application/json": {
                        "name": "홍길동",
                        "duplicate_count": 3,
                        "message": "이 이름을 사용하는 사용자가 3명입니다."
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """사용자 이름 중복 개수 확인"""
        name = request.query_params.get('name')
        
        if not name:
            return Response(
                {"error": "name parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 삭제되지 않은 사용자 중에서 해당 이름을 가진 사용자 수 조회
            duplicate_count = UserInfo.objects.filter(
                name=name,
                deleted_at__isnull=True
            ).count()
            
            return Response({
                "name": name,
                "duplicate_count": duplicate_count,
                "message": f"이 이름을 사용하는 사용자가 {duplicate_count}명입니다."
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"이름 중복 확인 실패: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProfileImageUpload(APIView):
    """
    프로필 이미지 업로드 API
    이미지 파일을 받아 S3에 업로드하고 URL을 반환합니다.
    """
    parser_classes = [MultiPartParser, FormParser]
    
    @swagger_auto_schema(
        operation_description="프로필 이미지를 업로드합니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code',
                openapi.IN_FORM,
                description="사용자 코드",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'image',
                openapi.IN_FORM,
                description="업로드할 이미지 파일",
                type=openapi.TYPE_FILE,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="업로드 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """프로필 이미지 업로드"""
        try:
            user_code = request.data.get('user_code')
            image_file = request.FILES.get('image')
            
            if not user_code:
                return Response(
                    {"error": "user_code is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not image_file:
                return Response(
                    {"error": "image file is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
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
            
            # 이미지 압축 (1MB 이상인 경우)
            if image_file.size > 1 * 1024 * 1024:
                try:
                    image = Image.open(image_file)
                    # 이미지를 RGB로 변환 (JPEG는 RGB만 지원)
                    if image.mode != 'RGB':
                        image = image.convert('RGB')
                    
                    # 이미지 크기 조정 (최대 800x800)
                    image.thumbnail((800, 800), Image.Resampling.LANCZOS)
                    
                    # BytesIO로 변환
                    output = BytesIO()
                    image.save(output, format='JPEG', quality=85, optimize=True)
                    output.seek(0)
                    
                    # 파일 객체 교체
                    image_file.file = output
                    image_file.size = output.getbuffer().nbytes
                    image_file.content_type = 'image/jpeg'
                except Exception as e:
                    return Response(
                        {"error": f"이미지 압축 실패: {str(e)}"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # S3에 업로드할 파일명 생성 (타임스탬프 포함하여 캐시 문제 해결)
            import time
            timestamp = int(time.time() * 1000)  # 밀리초 단위 타임스탬프
            s3_key = f"profile/player/{user_code}_{timestamp}.jpg"
            
            # 파일 포인터를 처음 위치로 초기화
            image_file.seek(0)
            
            # 이전 이미지 삭제 (선택적 - 스토리지 비용 절감)
            try:
                # 이전 이미지 목록 조회
                response = s3_client.list_objects_v2(
                    Bucket=settings.AWS_PROFILE_BUCKET_NAME,
                    Prefix=f"profile/player/{user_code}_"
                )
                
                # 이전 이미지 삭제 (최신 5개만 유지)
                if 'Contents' in response:
                    old_images = sorted(response['Contents'], key=lambda x: x['LastModified'], reverse=True)
                    # 5개 이상이면 오래된 것 삭제
                    if len(old_images) >= 5:
                        for old_image in old_images[4:]:  # 5번째 이후 삭제
                            s3_client.delete_object(
                                Bucket=settings.AWS_PROFILE_BUCKET_NAME,
                                Key=old_image['Key']
                            )
                            print(f"이전 이미지 삭제: {old_image['Key']}")
            except Exception as e:
                print(f"이전 이미지 삭제 실패 (무시): {str(e)}")
            
            # S3에 업로드 (프로필 이미지용 버킷 사용)
            try:
                s3_client.upload_fileobj(
                    image_file,
                    settings.AWS_PROFILE_BUCKET_NAME,
                    s3_key,
                    ExtraArgs={
                        'ContentType': image_file.content_type or 'image/jpeg',
                        'CacheControl': 'no-cache, no-store, must-revalidate',  # 캐시 방지
                        'Metadata': {
                            'user_code': user_code,
                            'uploaded_at': str(timestamp)
                        }
                    }
                )
                
                # 업로드된 이미지 URL 생성 (CloudFront 도메인 사용)
                image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{s3_key}"
                
                # S3 직접 URL도 생성 (CloudFront 캐싱 우회용)
                s3_direct_url = f"https://{settings.AWS_PROFILE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{s3_key}"
                
                return Response({
                    "message": "프로필 이미지가 성공적으로 업로드되었습니다.",
                    "image_url": image_url,
                    "s3_direct_url": s3_direct_url,
                    "s3_key": s3_key,
                    "timestamp": timestamp  # 프론트엔드에서 참조 가능
                }, status=status.HTTP_200_OK)
                
            except ClientError as e:
                error_code = e.response['Error']['Code']
                if error_code == 'NoSuchBucket':
                    return Response(
                        {"error": "이미지 저장소에 접근할 수 없습니다. 관리자에게 문의해주세요."}, 
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
                elif error_code == 'AccessDenied':
                    return Response(
                        {"error": "이미지 업로드 권한이 없습니다. 관리자에게 문의해주세요."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
                else:
                    return Response(
                        {"error": "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요."}, 
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
            
        except NoCredentialsError:
            return Response(
                {"error": "이미지 업로드 서비스를 사용할 수 없습니다. 관리자에게 문의해주세요."}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            return Response(
                {"error": "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProfileImageGet(APIView):
    """
    프로필 이미지 조회 API
    사용자 코드로 프로필 이미지 URL을 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_description="프로필 이미지를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description="사용자 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """프로필 이미지 조회"""
        try:
            user_code = request.query_params.get('user_code')
            
            if not user_code:
                return Response(
                    {"error": "user_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # S3 클라이언트 생성
            try:
                s3_client = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_S3_REGION_NAME
                )
                print(f"S3 클라이언트 생성 성공 - 버킷: {settings.AWS_PROFILE_BUCKET_NAME}")
                print(f"AWS_ACCESS_KEY_ID: {settings.AWS_ACCESS_KEY_ID[:10]}...")
                print(f"AWS_S3_REGION_NAME: {settings.AWS_S3_REGION_NAME}")
            except Exception as e:
                print(f"S3 클라이언트 생성 실패: {str(e)}")
                # S3 클라이언트 생성 실패 시 기본적으로 이미지 없음으로 처리
                return Response({
                    "image_url": None,
                    "exists": False,
                    "error": f"S3 클라이언트 생성 실패: {str(e)}"
                }, status=status.HTTP_200_OK)
            
            # S3에서 최신 이미지 찾기 (타임스탬프 포함된 파일명)
            print(f"이미지 조회 - user_code: {user_code}")
            
            try:
                # 해당 user_code로 시작하는 모든 이미지 조회
                response = s3_client.list_objects_v2(
                    Bucket=settings.AWS_PROFILE_BUCKET_NAME,
                    Prefix=f"profile/player/{user_code}_"
                )
                
                # 최신 이미지 찾기 (타임스탬프 기준)
                if 'Contents' in response and len(response['Contents']) > 0:
                    # LastModified 기준으로 정렬하여 최신 이미지 선택
                    latest_image = sorted(response['Contents'], key=lambda x: x['LastModified'], reverse=True)[0]
                    s3_key = latest_image['Key']
                    print(f"최신 이미지 발견: {s3_key}")
                else:
                    # 타임스탬프 없는 구버전 파일명 확인
                    s3_key = f"profile/player/{user_code}.jpg"
                    print(f"구버전 파일명 확인: {s3_key}")
                
                # 이미지 존재 여부 확인 (프로필 이미지용 버킷 사용)
                print(f"head_object 호출 - Bucket: {settings.AWS_PROFILE_BUCKET_NAME}, Key: {s3_key}")
                
                # 먼저 버킷에 접근 가능한지 확인
                try:
                    s3_client.head_bucket(Bucket=settings.AWS_PROFILE_BUCKET_NAME)
                    print(f"버킷 접근 성공: {settings.AWS_PROFILE_BUCKET_NAME}")
                except ClientError as bucket_error:
                    error_code = bucket_error.response['Error']['Code']
                    error_message = bucket_error.response['Error']['Message']
                    print(f"버킷 접근 실패 - Code: {error_code}, Message: {error_message}")
                    return Response({
                        "image_url": None,
                        "exists": False,
                        "error": f"버킷 접근 실패 ({error_code}): {error_message}"
                    }, status=status.HTTP_200_OK)
                except Exception as bucket_error:
                    print(f"버킷 접근 실패 (기타): {str(bucket_error)}")
                    return Response({
                        "image_url": None,
                        "exists": False,
                        "error": f"버킷 접근 실패: {str(bucket_error)}"
                    }, status=status.HTTP_200_OK)
                
                s3_client.head_object(
                    Bucket=settings.AWS_PROFILE_BUCKET_NAME,
                    Key=s3_key
                )
                
                # 이미지가 존재하는 경우 URL 반환 (CloudFront 도메인 사용)
                image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{s3_key}"
                print(f"이미지 존재 - URL: {image_url}")
                
                return Response({
                    "image_url": image_url,
                    "exists": True
                }, status=status.HTTP_200_OK)
                
            except ClientError as e:
                error_code = e.response['Error']['Code']
                print(f"ClientError 발생 - Code: {error_code}, Message: {e.response['Error']['Message']}")
                if error_code == '404':
                    # 이미지가 존재하지 않는 경우
                    print("이미지가 존재하지 않음 (404)")
                    return Response({
                        "image_url": None,
                        "exists": False
                    }, status=status.HTTP_200_OK)
                else:
                    # 다른 S3 에러 (권한 문제 등)의 경우도 이미지 없음으로 처리
                    print(f"기타 S3 에러: {error_code}")
                    return Response({
                        "image_url": None,
                        "exists": False
                    }, status=status.HTTP_200_OK)
                    
        except Exception as e:
            # 모든 에러를 이미지 없음으로 처리
            print(f"전체 예외 발생: {str(e)}")
            return Response({
                "image_url": None,
                "exists": False,
                "error": str(e)
            }, status=status.HTTP_200_OK)


class UserUploadList(APIView):
    """
    사용자별 업로드 파일 목록 조회 API
    특정 사용자가 업로드한 모든 파일 목록을 반환합니다.
    """
    
    @swagger_auto_schema(
        operation_description="사용자의 업로드 파일 목록을 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description="사용자 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="조회 성공",
                examples={
                    "application/json": {
                        "files": [
                            {
                                "upload_code": "upload_123",
                                "name": "test_file.txt",
                                "hz": 10,
                                "created_at": "2024-01-01T00:00:00Z"
                            }
                        ],
                        "count": 1
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """사용자 업로드 파일 목록 조회"""
        try:
            user_code = request.query_params.get('user_code')
            
            if not user_code:
                return Response(
                    {"error": "user_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 업로드 파일 목록 조회
            try:
                # deleted_at 필드가 있는지 확인하고 필터링
                uploads = Upload.objects.filter(
                    user_code=user_code,
                    deleted_at__isnull=True
                ).order_by('-created_at')
            except Exception:
                # deleted_at 필드가 없으면 모든 파일 조회
                uploads = Upload.objects.filter(
                    user_code=user_code
                ).order_by('-created_at')
            
            # 결과를 리스트로 변환
            files = []
            for upload in uploads:
                files.append({
                    "upload_code": upload.upload_code,
                    "name": upload.name,
                    "hz": upload.hz,
                    "created_at": upload.created_at.isoformat()
                })
            
            return Response({
                "files": files,
                "count": len(files)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"업로드 파일 목록 조회 실패: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamUploadList(APIView):
    """
    팀 업로드 파일 목록 조회 API
    team_code로 Upload.user_code를 조회하여 팀의 업로드 파일을 반환합니다.
    """
    
    @swagger_auto_schema(
        operation_description="팀의 업로드 파일 목록을 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'team_code',
                openapi.IN_QUERY,
                description="팀 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="조회 성공",
                examples={
                    "application/json": {
                        "files": [
                            {
                                "upload_code": "upload_123",
                                "name": "test_file.txt",
                                "hz": 10,
                                "created_at": "2024-01-01T00:00:00Z"
                            }
                        ],
                        "count": 1
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """팀 업로드 파일 목록 조회 (team_code로 Upload.user_code 직접 조회)"""
        try:
            team_code = request.query_params.get('team_code')
            
            if not team_code:
                return Response(
                    {"error": "team_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Upload 테이블에서 user_code가 team_code인 파일 조회
            uploads = Upload.objects.filter(
                user_code=team_code,
                deleted_at__isnull=True
            ).order_by('-created_at')
            
            # 결과를 리스트로 변환
            files = []
            for upload in uploads:
                files.append({
                    "upload_code": upload.upload_code,
                    "name": upload.name,
                    "hz": upload.hz,
                    "created_at": upload.created_at.isoformat()
                })
            
            return Response({
                "files": files,
                "count": len(files)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"팀 업로드 파일 목록 조회 오류: {str(e)}")
            return Response(
                {"error": f"팀 업로드 파일 목록 조회 실패: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class S3FileDownload(APIView):
    """
    S3 파일 다운로드 API
    업로드 코드로 파일을 조회하고 다운로드 URL을 생성합니다.
    """
    
    @swagger_auto_schema(
        operation_description="S3에서 업로드된 파일을 다운로드합니다.",
        manual_parameters=[
            openapi.Parameter(
                'upload_code',
                openapi.IN_QUERY,
                description="업로드 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="다운로드 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="파일을 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """S3 파일 다운로드"""
        try:
            upload_code = request.query_params.get('upload_code')
            
            if not upload_code:
                return Response(
                    {"error": "upload_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 업로드 정보 조회
            try:
                # deleted_at 필드가 있는지 확인하고 필터링
                upload = Upload.objects.get(
                    upload_code=upload_code,
                    deleted_at__isnull=True
                )
                print(f"업로드 파일 찾음: {upload_code}")
            except Exception as e:
                print(f"deleted_at 필터링 실패: {e}")
                # deleted_at 필드가 없으면 모든 파일 조회
                try:
                    upload = Upload.objects.get(
                        upload_code=upload_code
                    )
                    print(f"업로드 파일 찾음 (deleted_at 없음): {upload_code}")
                except Upload.DoesNotExist:
                    print(f"업로드 파일 없음: {upload_code}")
                    # 디버깅: 존재하는 업로드 코드들 확인
                    existing_codes = Upload.objects.values_list('upload_code', flat=True)[:10]
                    print(f"존재하는 업로드 코드들 (최대 10개): {list(existing_codes)}")
                    return Response(
                        {"error": f"해당 업로드 파일을 찾을 수 없습니다. 업로드 코드: {upload_code}"}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
            
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
            
            # S3 파일 경로 생성
            # data/player/edit/ 경로 사용
            possible_paths = [
                f"data/player/edit/{upload_code}.csv",
                f"data/player/edit/{upload_code}.txt",
            ]
            bucket_name = "aground-gps"
            
            print(f"업로드 정보: {upload.upload_code}, 이름: {upload.name}, 사용자: {upload.user_code}")
            
            # 여러 경로 시도
            s3_key = None
            for path in possible_paths:
                try:
                    print(f"경로 시도: {path}")
                    s3_client.head_object(Bucket=bucket_name, Key=path)
                    s3_key = path
                    print(f"파일 찾음: {path}")
                    break
                except ClientError as e:
                    if e.response['Error']['Code'] == '404':
                        continue
                    else:
                        raise
            
            if not s3_key:
                print(f"모든 경로에서 파일을 찾을 수 없음: {possible_paths}")
                return Response(
                    {"error": f"S3에서 해당 파일을 찾을 수 없습니다. 업로드 코드: {upload_code}"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            try:
                # 파일 다운로드 URL 생성 (1시간 유효)
                download_url = s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': bucket_name, 'Key': s3_key},
                    ExpiresIn=3600  # 1시간
                )
                
                return Response({
                    "download_url": download_url,
                    "upload_code": upload_code,
                    "file_name": s3_key.split('/')[-1],
                    "s3_key": s3_key,
                    "expires_in": 3600
                }, status=status.HTTP_200_OK)
                
            except ClientError as e:
                error_code = e.response['Error']['Code']
                print(f"S3 오류: {error_code}, {str(e)}")
                if error_code == 'AccessDenied':
                    return Response(
                        {"error": "파일 다운로드 권한이 없습니다."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
                else:
                    return Response(
                        {"error": f"파일 다운로드에 실패했습니다: {str(e)}"}, 
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
            
        except NoCredentialsError:
            return Response(
                {"error": "파일 다운로드 서비스를 사용할 수 없습니다. 관리자에게 문의해주세요."}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            return Response(
                {"error": f"파일 다운로드에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamSearch(APIView):
    """
    팀 검색 API
    팀 이름 또는 지역으로 검색하며 페이지네이션을 지원합니다.
    """
    
    @swagger_auto_schema(
        operation_description="팀을 검색합니다. 팀 이름이나 지역으로 검색할 수 있습니다.",
        manual_parameters=[
            openapi.Parameter('search', openapi.IN_QUERY, description="검색어 (팀 이름 또는 지역)", type=openapi.TYPE_STRING),
            openapi.Parameter('page', openapi.IN_QUERY, description="페이지 번호 (기본값: 1)", type=openapi.TYPE_INTEGER),
            openapi.Parameter('page_size', openapi.IN_QUERY, description="페이지당 결과 수 (기본값: 20, 최대: 50)", type=openapi.TYPE_INTEGER),
        ],
        responses={
            200: openapi.Response(
                description="검색 성공",
                examples={
                    "application/json": {
                        "teams": [
                            {
                                "team_code": "t_001",
                                "name": "FC 서울",
                                "local": "서울",
                                "members_count": 15,
                                "formatted_date": "2024.01.15",
                                "logo_url": "https://agrounds.com/media/team_logo/t_001.png"
                            }
                        ],
                        "total_count": 1,
                        "total_pages": 1,
                        "current_page": 1,
                        "has_next": False,
                        "has_previous": False
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청")
        }
    )
    def get(self, request):
        """팀 검색"""
        try:
            # 쿼리 파라미터 추출
            search_term = request.query_params.get('search', '').strip()
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
            
            # 페이지 크기 제한
            if page_size > 50:
                page_size = 50
            elif page_size < 1:
                page_size = 20
                
            # 페이지 번호 검증
            if page < 1:
                page = 1
            
            # 기본 쿼리셋 (소프트 삭제되지 않은 팀만)
            queryset = TeamInfo.objects.filter(deleted_at__isnull=True)
            
            # 검색어가 있는 경우 필터링
            if search_term:
                queryset = queryset.filter(
                    Q(name__icontains=search_term) |  # 팀 이름으로 검색
                    Q(local__icontains=search_term)   # 지역으로 검색
                )
            
            # 생성일 기준 내림차순 정렬
            queryset = queryset.order_by('-created_at')
            
            # 페이지네이션
            paginator = Paginator(queryset, page_size)
            
            try:
                page_obj = paginator.page(page)
            except:
                return Response(
                    {"error": "유효하지 않은 페이지 번호입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 시리얼라이저로 데이터 변환
            serializer = TeamSearchSerializer(page_obj.object_list, many=True)
            
            return Response({
                "teams": serializer.data,
                "total_count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous()
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response(
                {"error": "페이지 번호나 페이지 크기는 숫자여야 합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"팀 검색 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamRecommendations(APIView):
    """
    추천 팀 목록 조회 API
    최근 생성된 팀들을 추천 목록으로 제공합니다.
    """
    
    @swagger_auto_schema(
        operation_description="추천 팀 목록을 조회합니다. 최근 생성된 팀들을 반환합니다.",
        manual_parameters=[
            openapi.Parameter('limit', openapi.IN_QUERY, description="반환할 팀 수 (기본값: 10, 최대: 20)", type=openapi.TYPE_INTEGER),
        ],
        responses={
            200: openapi.Response(
                description="조회 성공",
                examples={
                    "application/json": {
                        "success": True,
                        "teams": [
                            {
                                "team_code": "t_001",
                                "name": "FC 서울",
                                "local": "서울",
                                "members_count": 15,
                                "formatted_date": "2024.01.15",
                                "logo_url": "https://agrounds.com/media/team_logo/t_001.png"
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
        """추천 팀 목록 조회"""
        try:
            # 쿼리 파라미터 추출
            limit = int(request.query_params.get('limit', 10))
            
            # 제한값 검증
            if limit > 20:
                limit = 20
            elif limit < 1:
                limit = 10
            
            # 최근 생성된 팀들을 추천으로 제공 (소프트 삭제되지 않은 팀만)
            teams = TeamInfo.objects.filter(
                deleted_at__isnull=True
            ).order_by('-created_at')[:limit]
            
            # 시리얼라이저로 데이터 변환
            serializer = TeamSearchSerializer(teams, many=True)
            
            return Response({
                "success": True,
                "teams": serializer.data,
                "count": len(serializer.data)
            }, status=status.HTTP_200_OK)
            
        except ValueError:
            return Response(
                {"error": "limit 값은 숫자여야 합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"추천 팀 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserSearch(APIView):
    """
    유저 검색 API
    유저 이름으로 검색하며 페이지네이션을 지원합니다.
    """
    
    @swagger_auto_schema(
        operation_description="유저를 검색합니다. 유저 이름으로 검색할 수 있습니다.",
        manual_parameters=[
            openapi.Parameter('search', openapi.IN_QUERY, description="검색어 (유저 이름)", type=openapi.TYPE_STRING),
            openapi.Parameter('page', openapi.IN_QUERY, description="페이지 번호 (기본값: 1)", type=openapi.TYPE_INTEGER),
            openapi.Parameter('page_size', openapi.IN_QUERY, description="페이지당 결과 수 (기본값: 20, 최대: 50)", type=openapi.TYPE_INTEGER),
        ],
        responses={
            200: openapi.Response(
                description="검색 성공",
                examples={
                    "application/json": {
                        "users": [
                            {
                                "user_code": "u_001",
                                "name": "홍길동",
                                "age": 25,
                                "preferred_position": "FW",
                                "activity_area": "서울",
                                "gender": "male",
                                "formatted_date": "2024.01.15"
                            }
                        ],
                        "total_count": 1,
                        "total_pages": 1,
                        "current_page": 1,
                        "has_next": False,
                        "has_previous": False
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청")
        }
    )
    def get(self, request):
        """유저 검색"""
        try:
            logger.info(f"UserSearch API 호출됨: {request.query_params}")
            
            # 쿼리 파라미터 추출
            search_term = request.query_params.get('search', '').strip()
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
            
            logger.info(f"검색 조건 - search_term: {search_term}, page: {page}, page_size: {page_size}")
            
            # 페이지 크기 제한
            if page_size > 50:
                page_size = 50
            elif page_size < 1:
                page_size = 20
                
            # 페이지 번호 검증
            if page < 1:
                page = 1
            
            # 기본 쿼리셋 (소프트 삭제되지 않은 유저만)
            queryset = UserInfo.objects.filter(deleted_at__isnull=True)
            logger.info(f"초기 쿼리셋 개수: {queryset.count()}")
            
            # 팀에 소속된 사용자 제외 (팀에 소속되지 않은 사용자만)
            team_member_codes = PlayerTeamCross.objects.filter(
                deleted_at__isnull=True
            ).values_list('user_code', flat=True).distinct()
            queryset = queryset.exclude(user_code__in=team_member_codes)
            logger.info(f"팀 소속 제외 후 쿼리셋 개수: {queryset.count()}")
            
            # 검색어가 있는 경우 필터링 (이름으로만 검색)
            if search_term:
                queryset = queryset.filter(name__icontains=search_term)
                logger.info(f"검색 후 쿼리셋 개수: {queryset.count()}")
            
            # 생성일 기준 내림차순 정렬
            queryset = queryset.order_by('-created_at')
            
            # 페이지네이션
            paginator = Paginator(queryset, page_size)
            
            try:
                page_obj = paginator.page(page)
            except:
                return Response(
                    {"error": "유효하지 않은 페이지 번호입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 데이터 변환
            users_data = []
            for user in page_obj.object_list:
                # 나이 계산
                age = None
                try:
                    if user.birth:
                        today = date.today()
                        birth_value = user.birth
                        # DB 타입이 문자열인 경우 파싱 처리
                        if isinstance(birth_value, str):
                            from datetime import datetime
                            parsed = None
                            # 시도 1: YYYY-MM-DD
                            try:
                                parsed = datetime.strptime(birth_value[:10], "%Y-%m-%d").date()
                            except Exception:
                                # 시도 2: ISO 포맷
                                try:
                                    parsed = datetime.fromisoformat(birth_value).date()
                                except Exception:
                                    parsed = None
                            if parsed:
                                birth_date = parsed
                            else:
                                birth_date = None
                        else:
                            # date/datetime 객체인 경우
                            try:
                                birth_date = birth_value.date() if hasattr(birth_value, 'date') else birth_value
                            except Exception:
                                birth_date = None

                        if birth_date:
                            age = (
                                today.year
                                - birth_date.year
                                - ((today.month, today.day) < (birth_date.month, birth_date.day))
                            )
                except Exception as e:
                    logger.warning(f"UserSearch 나이 계산 실패(user_code={getattr(user, 'user_code', None)}): {e}")
                
                users_data.append({
                    "user_code": user.user_code,
                    "name": user.name,
                    "age": age,
                    "preferred_position": user.preferred_position or "CB",
                    "activity_area": user.activity_area or "지역 미상",
                    "gender": user.gender or "unknown",
                    "formatted_date": user.created_at.strftime('%Y.%m.%d') if user.created_at else "",
                    "created_at": user.created_at.isoformat() if user.created_at else None
                })
            
            return Response({
                "users": users_data,
                "total_count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous()
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response(
                {"error": "페이지 번호나 페이지 크기는 숫자여야 합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"유저 검색 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamLogoUpload(APIView):
    """
    팀 로고 업로드 API
    팀 로고 이미지를 받아 S3에 업로드하고 URL을 반환합니다.
    """
    parser_classes = [MultiPartParser, FormParser]
    
    @swagger_auto_schema(
        operation_description="팀 로고 이미지를 업로드합니다.",
        manual_parameters=[
            openapi.Parameter(
                'team_code',
                openapi.IN_FORM,
                description="팀 코드",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'image',
                openapi.IN_FORM,
                description="업로드할 팀 로고 이미지 파일",
                type=openapi.TYPE_FILE,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="업로드 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """팀 로고 업로드"""
        try:
            team_code = request.data.get('team_code')
            image_file = request.FILES.get('image')
            
            if not team_code:
                return Response(
                    {"error": "team_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not image_file:
                return Response(
                    {"error": "image file is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 팀 존재 여부 확인
            try:
                team = get_object_or_404(TeamInfo, team_code=team_code, deleted_at__isnull=True)
            except:
                return Response(
                    {"error": "팀을 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 이미지 파일 검증
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
            if image_file.content_type not in allowed_types:
                return Response(
                    {"error": "JPG, JPEG, PNG 파일만 업로드 가능합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 파일 크기 제한 (5MB)
            max_size = 5 * 1024 * 1024  # 5MB
            if image_file.size > max_size:
                return Response(
                    {"error": "파일 크기는 5MB 이하여야 합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 이미지 리사이즈 (200x200)
            try:
                img = Image.open(image_file)
                img = img.convert('RGB')
                img = img.resize((200, 200), Image.Resampling.LANCZOS)
                
                # BytesIO로 변환
                img_io = BytesIO()
                img.save(img_io, format='JPEG', quality=85)
                img_io.seek(0)
                
            except Exception as e:
                return Response(
                    {"error": "이미지 처리 중 오류가 발생했습니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # S3 업로드
            try:
                s3_client = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_S3_REGION_NAME
                )
                
                # S3 키 생성 (profile/team/{team_code}.jpg)
                s3_key = f"profile/team/{team_code}.jpg"
                
                # S3에 업로드 (권한 설정 제거하고 버킷 정책에 의존)
                s3_client.upload_fileobj(
                    img_io,
                    settings.AWS_PROFILE_BUCKET_NAME,
                    s3_key,
                    ExtraArgs={
                        'ContentType': 'image/jpeg',
                        'CacheControl': 'max-age=86400',  # 1일 캐시
                        'Metadata': {
                            'team_code': team_code,
                            'uploaded_at': str(timezone.now())
                        }
                    }
                )
                
                # 업로드된 이미지 URL 생성
                image_url = f"https://{settings.AWS_PROFILE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{s3_key}"
                
                return Response({
                    "message": "팀 로고가 성공적으로 업로드되었습니다.",
                    "image_url": image_url,
                    "team_code": team_code
                }, status=status.HTTP_200_OK)
                
            except ClientError as e:
                error_code = e.response['Error']['Code']
                if error_code == 'NoSuchBucket':
                    return Response(
                        {"error": "이미지 저장소에 접근할 수 없습니다. 관리자에게 문의해주세요."}, 
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
                elif error_code == 'AccessDenied':
                    return Response(
                        {"error": "이미지 업로드 권한이 없습니다. 관리자에게 문의해주세요."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
                else:
                    return Response(
                        {"error": "팀 로고 업로드에 실패했습니다. 잠시 후 다시 시도해주세요."}, 
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
            
        except NoCredentialsError:
            return Response(
                {"error": "팀 로고 업로드 서비스를 사용할 수 없습니다. 관리자에게 문의해주세요."}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            return Response(
                {"error": "팀 로고 업로드에 실패했습니다. 잠시 후 다시 시도해주세요."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamLogoGet(APIView):
    """
    팀 로고 조회 API
    팀 코드로 팀 로고 이미지 URL을 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_description="팀 로고 이미지를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'team_code',
                openapi.IN_QUERY,
                description="팀 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """팀 로고 조회"""
        try:
            team_code = request.query_params.get('team_code')
            
            if not team_code:
                return Response(
                    {"error": "team_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # S3 클라이언트 생성
            try:
                s3_client = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_S3_REGION_NAME
                )
            except Exception as e:
                # S3 클라이언트 생성 실패 시 기본적으로 이미지 없음으로 처리
                return Response({
                    "image_url": None,
                    "exists": False,
                    "error": f"S3 클라이언트 생성 실패: {str(e)}"
                }, status=status.HTTP_200_OK)
            
            # S3에서 팀 로고 존재 여부 확인
            s3_key = f"profile/team/{team_code}.jpg"
            
            try:
                # 먼저 버킷에 접근 가능한지 확인
                try:
                    s3_client.head_bucket(Bucket=settings.AWS_PROFILE_BUCKET_NAME)
                except ClientError as bucket_error:
                    error_code = bucket_error.response['Error']['Code']
                    error_message = bucket_error.response['Error']['Message']
                    return Response({
                        "image_url": None,
                        "exists": False,
                        "error": f"버킷 접근 실패 ({error_code}): {error_message}"
                    }, status=status.HTTP_200_OK)
                except Exception as bucket_error:
                    return Response({
                        "image_url": None,
                        "exists": False,
                        "error": f"버킷 접근 실패: {str(bucket_error)}"
                    }, status=status.HTTP_200_OK)
                
                # 팀 로고 파일 존재 여부 확인
                s3_client.head_object(Bucket=settings.AWS_PROFILE_BUCKET_NAME, Key=s3_key)
                
                # 이미지가 존재하는 경우 프록시 URL 반환 (CORS 문제 해결)
                image_url = f"https://agrounds.com/api/user/team/logo/image/{team_code}/"
                print(f"프록시 URL 생성: {image_url}")
                
                return Response({
                    "image_url": image_url,
                    "exists": True,
                    "team_code": team_code
                }, status=status.HTTP_200_OK)
                
            except ClientError as e:
                error_code = e.response['Error']['Code']
                if error_code == '404':
                    # 이미지가 존재하지 않는 경우
                    return Response({
                        "image_url": None,
                        "exists": False,
                        "team_code": team_code,
                        "message": "팀 로고가 등록되지 않았습니다."
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        "image_url": None,
                        "exists": False,
                        "error": f"S3 오류 ({error_code}): {e.response['Error']['Message']}"
                    }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"팀 로고 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamLogoProxy(APIView):
    """
    팀 로고 이미지 프록시 API
    CORS 문제 해결을 위해 S3 이미지를 프록시로 서빙합니다.
    """
    
    @swagger_auto_schema(
        operation_description="팀 로고 이미지를 프록시로 서빙합니다.",
        responses={
            200: openapi.Response(description="이미지 반환 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="이미지를 찾을 수 없음"),
            503: openapi.Response(description="서비스 이용 불가")
        }
    )
    def get(self, request, team_code):
        """팀 로고 이미지 프록시 서빙"""
        try:
            if not team_code:
                return Response(
                    {"error": "team_code is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
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
                    {"error": "S3 connection failed"}, 
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # S3에서 팀 로고 파일 가져오기
            s3_key = f"profile/team/{team_code}.jpg"
            
            try:
                # S3에서 파일 다운로드
                response = s3_client.get_object(
                    Bucket=settings.AWS_PROFILE_BUCKET_NAME, 
                    Key=s3_key
                )
                
                # 이미지 데이터 읽기
                image_data = response['Body'].read()
                
                # HTTP 응답으로 이미지 반환
                from django.http import HttpResponse
                http_response = HttpResponse(image_data, content_type='image/jpeg')
                http_response['Cache-Control'] = 'max-age=3600'  # 1시간 캐시
                http_response['Access-Control-Allow-Origin'] = '*'  # CORS 허용
                return http_response
                
            except ClientError as e:
                error_code = e.response['Error']['Code']
                if error_code == '404' or error_code == 'NoSuchKey':
                    # 기본 이미지 반환
                    return Response(
                        {"error": "Team logo not found"}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                else:
                    return Response(
                        {"error": f"S3 error: {error_code}"}, 
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
            
        except Exception as e:
            return Response(
                {"error": f"팀 로고 프록시 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamCreate(APIView):
    """
    팀 생성 API
    새로운 팀을 생성하고 생성자를 소유자로 등록합니다.
    """
    
    @swagger_auto_schema(
        operation_description="새로운 팀을 생성합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['team_name', 'location', 'description'],
            properties={
                'team_name': openapi.Schema(type=openapi.TYPE_STRING, description='팀 이름'),
                'location': openapi.Schema(type=openapi.TYPE_STRING, description='활동 지역'),
                'description': openapi.Schema(type=openapi.TYPE_STRING, description='팀 소개'),
            }
        ),
        responses={
            201: openapi.Response(description="팀 생성 성공"),
            400: openapi.Response(description="잘못된 요청"),
            401: openapi.Response(description="인증 실패"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """팀 생성"""
        try:
            # 인증된 사용자 확인
            user_code = request.data.get('user_code') or request.query_params.get('user_code')
            if not user_code:
                # 세션에서 user_code 가져오기 시도
                user_code = request.session.get('user_code')
            
            if not user_code:
                return Response(
                    {"error": "로그인이 필요합니다."}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # 사용자 존재 여부 확인
            try:
                user = get_object_or_404(UserInfo, user_code=user_code, deleted_at__isnull=True)
            except:
                return Response(
                    {"error": "사용자를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 요청 데이터 검증
            team_name = request.data.get('team_name', '').strip()
            location = request.data.get('location', '').strip()
            description = request.data.get('description', '').strip()
            
            if not team_name:
                return Response(
                    {"error": "팀 이름을 입력해주세요."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if len(team_name) > 50:
                return Response(
                    {"error": "팀 이름은 50자 이내로 입력해주세요."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not location:
                return Response(
                    {"error": "활동 지역을 선택해주세요."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not description:
                return Response(
                    {"error": "팀 소개를 입력해주세요."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if len(description) > 200:
                return Response(
                    {"error": "팀 소개는 200자 이내로 입력해주세요."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 팀 코드 생성 (t_ + timestamp + random)
            import time
            import random
            import string
            
            timestamp = str(int(time.time()))
            random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
            team_code = f"t_{timestamp}_{random_suffix}"
            
            # 팀 코드 중복 확인
            while TeamInfo.objects.filter(team_code=team_code).exists():
                random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
                team_code = f"t_{timestamp}_{random_suffix}"
            
            # 팀 생성
            team = TeamInfo.objects.create(
                team_code=team_code,
                name=team_name,
                local=location,
                introduce=description
            )
            
            # 팀 생성자를 팀 멤버로 추가 (소유자 역할)
            from DB.models import PlayerTeamCross
            PlayerTeamCross.objects.create(
                user_code=user_code,
                team_code=team_code,
                role='owner'
            )
            
            return Response({
                "message": "팀이 성공적으로 생성되었습니다.",
                "team_code": team_code,
                "team_name": team_name,
                "location": location,
                "description": description
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"팀 생성 오류: {str(e)}")
            return Response(
                {"error": "팀 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MyTeamInfo(APIView):
    """
    내 팀 정보 조회 API
    사용자가 속한 팀의 정보를 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_description="사용자가 속한 팀의 정보를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description='사용자 코드',
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="성공",
                examples={
                    "application/json": {
                        "has_team": True,
                        "team_info": {
                            "team_code": "t_001",
                            "name": "FC 서울",
                            "local": "서울",
                            "introduce": "함께 성장하는 축구팀",
                            "members_count": 15,
                            "user_role": "owner",
                            "created_at": "2024-01-15T10:30:00Z"
                        }
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="사용자를 찾을 수 없음")
        }
    )
    def get(self, request):
        try:
            user_code = request.query_params.get('user_code')
            
            if not user_code:
                return Response(
                    {"error": "user_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 사용자 존재 확인
            user_info = UserInfo.objects.filter(
                user_code=user_code,
                deleted_at__isnull=True
            ).first()
            
            if not user_info:
                return Response(
                    {"error": "사용자를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 사용자가 속한 팀 찾기
            team_membership = PlayerTeamCross.objects.filter(
                user_code=user_code,
                deleted_at__isnull=True
            ).first()
            
            if not team_membership:
                return Response({
                    "has_team": False,
                    "team_info": None
                })
            
            # 팀 정보 조회
            team_info = TeamInfo.objects.filter(
                team_code=team_membership.team_code,
                deleted_at__isnull=True
            ).first()
            
            if not team_info:
                return Response({
                    "has_team": False,
                    "team_info": None
                })
            
            # 팀 멤버 수 계산
            members_count = PlayerTeamCross.objects.filter(
                team_code=team_info.team_code,
                deleted_at__isnull=True
            ).count()
            
            # 팀 로고는 클라이언트에서 별도 API로 가져오므로 URL 생성하지 않음
            
            team_data = {
                "team_code": team_info.team_code,
                "name": team_info.name,
                "local": team_info.local,
                "introduce": team_info.introduce or "",
                "members_count": members_count,
                "user_role": team_membership.role,
                "created_at": team_info.created_at.isoformat() if team_info.created_at else None
            }
            
            return Response({
                "has_team": True,
                "team_info": team_data
            })
            
        except Exception as e:
            print(f"내 팀 정보 조회 오류: {str(e)}")
            return Response(
                {"error": "팀 정보 조회 중 오류가 발생했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamMembersList(APIView):
    """
    팀원 목록 조회 API
    팀의 모든 멤버 정보를 반환합니다 (이름, 만 나이, 포지션, 역할 포함).
    """
    
    @swagger_auto_schema(
        operation_description="팀원 목록을 조회합니다",
        manual_parameters=[
            openapi.Parameter('team_code', openapi.IN_QUERY, description="팀 코드", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('user_code', openapi.IN_QUERY, description="요청자 사용자 코드", type=openapi.TYPE_STRING, required=True)
        ],
        responses={
            200: openapi.Response(
                description="성공",
                examples={
                    "application/json": {
                        "members": [
                            {
                                "user_code": "u_1234567890",
                                "name": "홍길동",
                                "age": 25,
                                "preferred_position": "FW",
                                "role": "owner",
                                "gender": "male",
                                "activity_area": "서울",
                                "joined_at": "2024-01-15T10:30:00Z"
                            }
                        ],
                        "total_count": 1
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="팀을 찾을 수 없음")
        }
    )
    def get(self, request):
        try:
            team_code = request.query_params.get('team_code')
            user_code = request.query_params.get('user_code')
            
            if not team_code:
                return Response(
                    {"error": "team_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not user_code:
                return Response(
                    {"error": "user_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 팀 존재 확인
            team_info = TeamInfo.objects.filter(team_code=team_code, deleted_at__isnull=True).first()
            if not team_info:
                return Response(
                    {"error": "Team not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 요청자가 팀 멤버인지 확인
            requester_membership = PlayerTeamCross.objects.filter(
                user_code=user_code, 
                team_code=team_code, 
                deleted_at__isnull=True
            ).first()
            
            if not requester_membership:
                return Response(
                    {"error": "You are not a member of this team"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 팀원 목록 조회 (PlayerTeamCross와 UserInfo 조인)
            team_members = PlayerTeamCross.objects.filter(
                team_code=team_code, 
                deleted_at__isnull=True
            ).select_related()
            
            members_data = []
            for member in team_members:
                try:
                    # UserInfo에서 상세 정보 가져오기
                    user_info = UserInfo.objects.filter(
                        user_code=member.user_code, 
                        deleted_at__isnull=True
                    ).first()
                    
                    if user_info:
                        # 만 나이 계산
                        try:
                            from datetime import datetime
                            birth_year = int(user_info.birth[:4]) if user_info.birth and len(user_info.birth) >= 4 else None
                            current_year = datetime.now().year
                            age = current_year - birth_year if birth_year else None
                        except (ValueError, TypeError):
                            age = None
                        
                        member_data = {
                            "user_code": member.user_code,
                            "name": user_info.name or "Unknown",
                            "age": age,
                            "preferred_position": user_info.preferred_position or "Unknown",
                            "role": member.role or "member",
                            "gender": user_info.gender or "Unknown",
                            "activity_area": user_info.activity_area or "Unknown",
                            "number": member.number,  # 등번호 추가
                            "joined_at": member.created_at.isoformat() if member.created_at else None
                        }
                        members_data.append(member_data)
                        
                except Exception as member_error:
                    # 개별 멤버 정보 조회 실패 시 기본 정보만 포함
                    member_data = {
                        "user_code": member.user_code,
                        "name": "Unknown",
                        "age": None,
                        "preferred_position": "Unknown",
                        "role": member.role or "member",
                        "gender": "Unknown",
                        "activity_area": "Unknown",
                        "number": member.number,  # 등번호 추가
                        "joined_at": member.created_at.isoformat() if member.created_at else None
                    }
                    members_data.append(member_data)
                    continue
            
            # 역할 순서로 정렬 (owner > manager > member)
            role_priority = {"owner": 0, "manager": 1, "member": 2}
            members_data.sort(key=lambda x: (role_priority.get(x["role"], 3), x["name"]))
            
            return Response({
                "members": members_data,
                "total_count": len(members_data)
            })
            
        except Exception as e:
            print(f"팀원 목록 조회 오류: {str(e)}")
            return Response(
                {"error": f"팀원 목록 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamMatchList(APIView):
    """
    팀 경기 목록 조회 API
    팀의 모든 경기 정보를 반환합니다 (팀 멤버만 접근 가능).
    """
    
    @swagger_auto_schema(
        operation_description="팀의 경기 목록을 조회합니다",
        manual_parameters=[
            openapi.Parameter('team_code', openapi.IN_QUERY, description="팀 코드", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('user_code', openapi.IN_QUERY, description="요청자 사용자 코드", type=openapi.TYPE_STRING, required=True)
        ],
        responses={
            200: openapi.Response(
                description="성공",
                examples={
                    "application/json": {
                        "matches": [
                            {
                                "match_code": "m_001",
                                "match_name": "팀 1경기",
                                "ground_name": "서울월드컵경기장",
                                "match_date": "2025-08-17",
                                "start_time": "09:00:00",
                                "end_time": "11:00:00",
                                "quarter_count": 2,
                                "total_duration_minutes": 120,
                                "created_at": "2025-08-17T09:00:00Z"
                            }
                        ],
                        "total_count": 1,
                        "user_role": "owner"
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="팀 멤버가 아님"),
            404: openapi.Response(description="팀을 찾을 수 없음")
        }
    )
    def get(self, request):
        try:
            team_code = request.query_params.get('team_code')
            user_code = request.query_params.get('user_code')
            
            if not team_code:
                return Response(
                    {"error": "team_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not user_code:
                return Response(
                    {"error": "user_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 사용자의 팀 멤버십 확인
            team_membership = PlayerTeamCross.objects.filter(
                team_code=team_code,
                user_code=user_code,
                deleted_at__isnull=True
            ).first()
            
            if not team_membership:
                return Response(
                    {"error": "해당 팀의 멤버가 아닙니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 팀 멤버라면 경기 목록 조회 가능 (권한 체크 제거)
            # 모든 팀 멤버가 경기 목록을 볼 수 있음
            
            # 팀 정보 확인
            team_info = TeamInfo.objects.filter(
                team_code=team_code,
                deleted_at__isnull=True
            ).first()
            
            if not team_info:
                return Response(
                    {"error": "팀을 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 팀의 경기 목록 조회
            # TeamMatchCross를 통해 팀과 연결된 경기들을 찾고, TeamMatch에서 상세 정보 가져오기
            team_match_crosses = TeamMatchCross.objects.filter(
                team_code=team_code,
                deleted_at__isnull=True
            ).values_list('match_code', flat=True)
            
            # 경기 상세 정보 조회
            matches_data = []
            for match_code in team_match_crosses:
                try:
                    # TeamMatch에서 경기 기본 정보 가져오기
                    team_match = TeamMatch.objects.filter(
                        match_code=match_code
                    ).first()
                    
                    if not team_match:
                        continue
                    
                    # GroundInfo에서 경기장 정보 가져오기 (ground_code가 있는 경우만)
                    ground_info = None
                    if team_match.ground_code:
                        ground_info = GroundInfo.objects.filter(
                            ground_code=team_match.ground_code,
                            deleted_at__isnull=True
                        ).first()
                    
                    # 쿼터 수 계산 (TeamMatchQuarterCross를 통해)
                    quarter_count = TeamMatchQuarterCross.objects.filter(
                        match_code=match_code,
                        deleted_at__isnull=True
                    ).count()
                    
                    # 경기 시간 계산 (분 단위)
                    total_duration_minutes = 0
                    if team_match.start_time and team_match.end_time:
                        try:
                            duration = team_match.end_time - team_match.start_time
                            total_duration_minutes = int(duration.total_seconds() / 60)
                        except (TypeError, AttributeError):
                            total_duration_minutes = 0
                    
                    # 날짜 포맷팅 (안전하게 처리)
                    match_date = None
                    start_time_str = None
                    end_time_str = None
                    if team_match.start_time:
                        try:
                            if hasattr(team_match.start_time, 'strftime'):
                                match_date = team_match.start_time.strftime('%Y-%m-%d')
                                start_time_str = team_match.start_time.strftime('%H:%M:%S')
                        except (AttributeError, ValueError):
                            pass
                    
                    if team_match.end_time:
                        try:
                            if hasattr(team_match.end_time, 'strftime'):
                                end_time_str = team_match.end_time.strftime('%H:%M:%S')
                        except (AttributeError, ValueError):
                            pass
                    
                    # created_at 포맷팅 (안전하게 처리)
                    created_at_str = None
                    if team_match.created_at:
                        try:
                            if hasattr(team_match.created_at, 'isoformat'):
                                created_at_str = team_match.created_at.isoformat()
                            elif hasattr(team_match.created_at, 'strftime'):
                                created_at_str = team_match.created_at.strftime('%Y-%m-%dT%H:%M:%S')
                        except (AttributeError, ValueError):
                            created_at_str = None
                    
                    match_data = {
                        "match_code": team_match.match_code or match_code,
                        "match_name": team_match.name if hasattr(team_match, 'name') and team_match.name else "이름 없음",
                        "ground_name": ground_info.name if ground_info and hasattr(ground_info, 'name') else "알 수 없는 경기장",
                        "match_date": match_date,
                        "start_time": start_time_str,
                        "end_time": end_time_str,
                        "quarter_count": quarter_count,
                        "total_duration_minutes": total_duration_minutes,
                        "created_at": created_at_str
                    }
                    
                    matches_data.append(match_data)
                except Exception as e:
                    # 개별 경기 처리 중 오류 발생 시 로그만 남기고 계속 진행
                    print(f"경기 {match_code} 처리 중 오류: {str(e)}")
                    continue
            
            # 생성일 기준으로 최신순 정렬 (None 값 처리)
            matches_data.sort(key=lambda x: x['created_at'] or '1970-01-01T00:00:00', reverse=True)
            
            return Response({
                "matches": matches_data,
                "total_count": len(matches_data),
                "user_role": team_membership.role
            })
            
        except Exception as e:
            print(f"팀 경기 목록 조회 오류: {str(e)}")
            return Response(
                {"error": "팀 경기 목록 조회 중 오류가 발생했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamUpdate(APIView):
    """
    팀 정보 수정 API
    팀 정보를 수정합니다 (owner/manager만 가능).
    """
    
    @swagger_auto_schema(
        operation_description="팀 정보를 수정합니다. (owner/manager만 가능)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['team_code', 'team_name', 'location', 'description', 'user_code'],
            properties={
                'team_code': openapi.Schema(type=openapi.TYPE_STRING, description='팀 코드'),
                'team_name': openapi.Schema(type=openapi.TYPE_STRING, description='팀 이름'),
                'location': openapi.Schema(type=openapi.TYPE_STRING, description='활동 지역'),
                'description': openapi.Schema(type=openapi.TYPE_STRING, description='팀 소개'),
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
            }
        ),
        responses={
            200: openapi.Response(description="팀 정보 수정 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="팀을 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def put(self, request):
        """팀 정보 수정"""
        try:
            team_code = request.data.get('team_code')
            team_name = request.data.get('team_name')
            location = request.data.get('location')
            description = request.data.get('description')
            user_code = request.data.get('user_code')
            
            # 필수 파라미터 검증
            if not all([team_code, team_name, location, description, user_code]):
                return Response(
                    {"error": "team_code, team_name, location, description, user_code가 모두 필요합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 팀 존재 확인
            team_info = get_object_or_404(TeamInfo, team_code=team_code, deleted_at__isnull=True)
            
            # 사용자 권한 확인 (owner 또는 manager만 가능)
            team_member = PlayerTeamCross.objects.filter(
                user_code=user_code,
                team_code=team_code,
                deleted_at__isnull=True
            ).first()
            
            if not team_member or team_member.role not in ['owner', 'manager']:
                return Response(
                    {"error": "팀 정보 수정 권한이 없습니다. (owner/manager만 가능)"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 입력값 검증
            if len(team_name) > 50:
                return Response(
                    {"error": "팀 이름은 50자 이내로 입력해주세요."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if len(location) > 30:
                return Response(
                    {"error": "활동 지역은 30자 이내로 입력해주세요."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if len(description) > 200:
                return Response(
                    {"error": "팀 소개는 200자 이내로 입력해주세요."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 팀 정보 업데이트
            team_info.name = team_name
            team_info.local = location
            team_info.introduce = description
            team_info.save()
            
            return Response({
                "message": "팀 정보가 성공적으로 수정되었습니다.",
                "team_code": team_code,
                "team_name": team_name,
                "location": location,
                "description": description
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"팀 정보 수정 오류: {str(e)}")
            return Response(
                {"error": "팀 정보 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamMemberNumberUpdate(APIView):
    """
    팀원 등번호 수정 API
    팀원의 등번호를 수정합니다 (owner/manager만 가능).
    """
    
    @swagger_auto_schema(
        operation_description="팀원의 등번호를 수정합니다. (owner/manager만 가능)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['team_code', 'user_code', 'target_user_code'],
            properties={
                'team_code': openapi.Schema(type=openapi.TYPE_STRING, description='팀 코드'),
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='요청자 사용자 코드'),
                'target_user_code': openapi.Schema(type=openapi.TYPE_STRING, description='등번호를 수정할 사용자 코드'),
                'number': openapi.Schema(type=openapi.TYPE_INTEGER, description='등번호 (0-99, null 가능)', nullable=True),
            }
        ),
        responses={
            200: openapi.Response(description="등번호 수정 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="팀 또는 사용자를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def put(self, request):
        """팀원 등번호 수정"""
        try:
            team_code = request.data.get('team_code')
            user_code = request.data.get('user_code')
            target_user_code = request.data.get('target_user_code')
            number = request.data.get('number')
            
            # 필수 파라미터 검증
            if not all([team_code, user_code, target_user_code]):
                return Response(
                    {"error": "team_code, user_code, target_user_code가 필요합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 팀 존재 확인
            team_info = get_object_or_404(TeamInfo, team_code=team_code, deleted_at__isnull=True)
            
            # 요청자 권한 확인 (owner 또는 manager만 가능)
            requester_member = PlayerTeamCross.objects.filter(
                user_code=user_code,
                team_code=team_code,
                deleted_at__isnull=True
            ).first()
            
            if not requester_member or requester_member.role not in ['owner', 'manager']:
                return Response(
                    {"error": "등번호 수정 권한이 없습니다. (owner/manager만 가능)"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 대상 팀원 확인
            target_member = get_object_or_404(
                PlayerTeamCross, 
                user_code=target_user_code, 
                team_code=team_code, 
                deleted_at__isnull=True
            )
            
            # 등번호 검증
            if number is not None:
                if not isinstance(number, int) or number < 0 or number > 99:
                    return Response(
                        {"error": "등번호는 0-99 사이의 숫자여야 합니다."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # 등번호 업데이트
            target_member.number = number
            target_member.save()
            
            return Response({
                "message": "등번호가 성공적으로 수정되었습니다.",
                "team_code": team_code,
                "target_user_code": target_user_code,
                "number": number
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"등번호 수정 오류: {str(e)}")
            return Response(
                {"error": "등번호 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamMemberRoleUpdate(APIView):
    """
    팀원 역할 수정 API
    팀원의 역할을 수정합니다 (owner만 가능).
    """
    
    @swagger_auto_schema(
        operation_description="팀원의 역할을 수정합니다. (owner만 가능)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['team_code', 'user_code', 'target_user_code', 'role'],
            properties={
                'team_code': openapi.Schema(type=openapi.TYPE_STRING, description='팀 코드'),
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='요청자 사용자 코드'),
                'target_user_code': openapi.Schema(type=openapi.TYPE_STRING, description='역할을 수정할 사용자 코드'),
                'role': openapi.Schema(type=openapi.TYPE_STRING, description='새로운 역할 (owner, manager, member)', enum=['owner', 'manager', 'member']),
            }
        ),
        responses={
            200: openapi.Response(description="역할 수정 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="팀 또는 사용자를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def put(self, request):
        """팀원 역할 수정"""
        try:
            team_code = request.data.get('team_code')
            user_code = request.data.get('user_code')
            target_user_code = request.data.get('target_user_code')
            new_role = request.data.get('role')
            
            # 필수 파라미터 검증
            if not all([team_code, user_code, target_user_code, new_role]):
                return Response(
                    {"error": "team_code, user_code, target_user_code, role가 필요합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 역할 유효성 검증
            if new_role not in ['owner', 'manager', 'member']:
                return Response(
                    {"error": "역할은 owner, manager, member 중 하나여야 합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 팀 존재 확인
            team_info = get_object_or_404(TeamInfo, team_code=team_code, deleted_at__isnull=True)
            
            # 요청자 권한 확인 (owner만 가능)
            requester_member = PlayerTeamCross.objects.filter(
                user_code=user_code,
                team_code=team_code,
                deleted_at__isnull=True
            ).first()
            
            if not requester_member or requester_member.role != 'owner':
                return Response(
                    {"error": "역할 수정 권한이 없습니다. (owner만 가능)"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 대상 팀원 확인
            target_member = get_object_or_404(
                PlayerTeamCross, 
                user_code=target_user_code, 
                team_code=team_code, 
                deleted_at__isnull=True
            )
            
            # 팀장으로 변경하는 경우, 기존 팀장을 매니저로 변경
            if new_role == 'owner':
                current_owner = PlayerTeamCross.objects.filter(
                    team_code=team_code,
                    role='owner',
                    deleted_at__isnull=True
                ).exclude(user_code=target_user_code).first()
                
                if current_owner:
                    current_owner.role = 'manager'
                    current_owner.save()
            
            # 팀장을 다른 역할로 변경하는 경우, 다른 멤버 중 하나를 팀장으로 변경
            elif target_member.role == 'owner' and new_role != 'owner':
                other_member = PlayerTeamCross.objects.filter(
                    team_code=team_code,
                    deleted_at__isnull=True
                ).exclude(user_code=target_user_code).exclude(role='owner').first()
                
                if other_member:
                    other_member.role = 'owner'
                    other_member.save()
            
            # 역할 업데이트
            target_member.role = new_role
            target_member.save()
            
            return Response({
                "message": "역할이 성공적으로 수정되었습니다.",
                "team_code": team_code,
                "target_user_code": target_user_code,
                "role": new_role
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"역할 수정 오류: {str(e)}")
            return Response(
                {"error": "역할 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminLogin(APIView):
    """
    관리자 로그인 API
    user_id, password로 로그인하며, login_type이 'messi' 또는 'guest'인 경우만 허용합니다.
    """
    
    @swagger_auto_schema(
        operation_description="관리자 로그인 (login_type이 'messi' 또는 'guest'만 허용)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['user_id', 'password'],
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 아이디'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='비밀번호'),
            }
        ),
        responses={
            200: openapi.Response(description="로그인 성공"),
            400: openapi.Response(description="잘못된 요청"),
            401: openapi.Response(description="인증 실패"),
            403: openapi.Response(description="권한 없음")
        }
    )
    def post(self, request):
        """관리자 로그인 처리"""
        
        user_id = request.data.get('user_id')
        password = request.data.get('password')
        
        # 필수 파라미터 검증
        if not user_id or not password:
            return Response(
                {"error": "user_id와 password는 필수 항목입니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 사용자 조회 (soft delete 고려)
            user = User.objects.filter(
                user_id=user_id,
                deleted_at__isnull=True
            ).first()
            
            if not user:
                return Response(
                    {"error": "존재하지 않는 사용자입니다."}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # login_type 검증 (messi 또는 guest만 허용)
            if user.login_type not in ['messi', 'guest']:
                return Response(
                    {"error": "관리자 권한이 없습니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 비밀번호 검증
            if user.password != password:
                return Response(
                    {"error": "비밀번호가 일치하지 않습니다."}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # 로그인 성공 - 사용자 정보 반환
            return Response({
                "message": "로그인 성공",
                "user_code": user.user_code,
                "user_id": user.user_id,
                "login_type": user.login_type
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"관리자 로그인 오류: {str(e)}")
            return Response(
                {"error": "로그인 처리 중 오류가 발생했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class Get_CustomerType_Users(APIView):
    """
    고객 유형별 테스트 사용자 목록 조회 API
    고객 유형 테스트 페이지에서 사용할 수 있는 테스트 계정들을 반환합니다.
    """
    
    @swagger_auto_schema(
        operation_description="고객 유형별 테스트 사용자 목록을 조회합니다.",
        responses={
            200: openapi.Response(
                description="조회 성공",
                examples={
                    "application/json": {
                        "test_users": [
                            {
                                "user_code": "test_001",
                                "name": "뉴비 사용자",
                                "user_type": "newbie"
                            },
                            {
                                "user_code": "test_002", 
                                "name": "개인 사용자",
                                "user_type": "individual"
                            }
                        ]
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """고객 유형별 테스트 사용자 목록 조회"""
        try:
            from DB.models import UserInfo
            
            # 테스트 사용자 코드와 유형 매핑
            test_user_configs = [
                {
                    "user_code": "test_001",
                    "user_type": "newbie",
                    "description": "초보자를 위한 테스트 계정입니다."
                },
                {
                    "user_code": "test_002", 
                    "user_type": "individual",
                    "description": "개인 사용자를 위한 테스트 계정입니다."
                },
                {
                    "user_code": "test_003",
                    "user_type": "leader", 
                    "description": "팀장 권한을 가진 테스트 계정입니다."
                },
                {
                    "user_code": "test_004",
                    "user_type": "manager",
                    "description": "매니저 권한을 가진 테스트 계정입니다."
                },
                {
                    "user_code": "test_005",
                    "user_type": "member",
                    "description": "일반 팀원을 위한 테스트 계정입니다."
                }
            ]
            
            test_users = []
            
            for config in test_user_configs:
                try:
                    # 실제 DB에서 사용자 정보 조회
                    user_info = UserInfo.objects.get(
                        user_code=config["user_code"],
                        deleted_at__isnull=True
                    )
                    
                    test_users.append({
                        "user_code": config["user_code"],
                        "name": user_info.name,  # 실제 DB의 이름 사용
                        "user_type": config["user_type"],
                        "description": config["description"]
                    })
                    
                except User.DoesNotExist:
                    # DB에 없는 경우 기본값 사용
                    test_users.append({
                        "user_code": config["user_code"],
                        "name": f"테스트 사용자 ({config['user_code']})",
                        "user_type": config["user_type"],
                        "description": config["description"]
                    })
            
            return Response({
                "test_users": test_users
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"테스트 사용자 목록 조회 실패: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class TestUserLogin(APIView):
    """
    테스트 사용자 로그인 API
    고객 유형 테스트를 위한 간단한 로그인을 처리합니다.
    """
    
    @swagger_auto_schema(
        operation_description="테스트 사용자 로그인 처리",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['user_code'],
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='테스트 사용자 코드'),
            }
        ),
        responses={
            200: openapi.Response(
                description="로그인 성공",
                examples={
                    "application/json": {
                        "message": "테스트 로그인 성공",
                        "user_code": "test_001",
                        "user_id": "test_001",
                        "login_type": "test",
                        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="사용자를 찾을 수 없음")
        }
    )
    def post(self, request):
        """테스트 사용자 로그인 처리"""
        user_code = request.data.get('user_code')
        
        if not user_code:
            return Response(
                {"error": "user_code는 필수입니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 테스트 사용자 코드 검증
            valid_test_codes = ['test_001', 'test_002', 'test_003', 'test_004', 'test_005']
            
            if user_code not in valid_test_codes:
                return Response(
                    {"error": "유효하지 않은 테스트 사용자 코드입니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 테스트용 토큰 생성 (실제보다 간단하게)
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken()
            refresh['user_code'] = user_code
            refresh['login_type'] = 'test'
            
            access_token = str(refresh.access_token)
            
            # 실제 데이터베이스에서 사용자 정보 조회
            from DB.models import UserInfo
            
            try:
                user_info = UserInfo.objects.get(
                    user_code=user_code,
                    deleted_at__isnull=True
                )
                
                test_user_info = {
                    'name': user_info.name,
                    'birth': user_info.birth,
                    'level': user_info.level,
                    'preferred_position': user_info.preferred_position,
                    'gender': user_info.gender,
                    'height': user_info.height,
                    'weight': user_info.weight,
                    'activity_area': user_info.activity_area
                }
                
            except User.DoesNotExist:
                return Response(
                    {"error": f"해당 사용자 코드 {user_code}에 대한 정보를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            return Response({
                "message": "테스트 로그인 성공",
                "user_code": user_code,
                "user_id": user_code,
                "login_type": "test",
                "token": access_token,
                "user_info": test_user_info
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"테스트 로그인 처리 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ===========================================
# Content Board APIs
# ===========================================

class NoticeList(APIView):
    """
    공지사항 목록 조회 API
    """
    
    @swagger_auto_schema(
        operation_description="공지사항 목록을 조회합니다.",
        manual_parameters=[
            openapi.Parameter('page', openapi.IN_QUERY, description="페이지 번호", type=openapi.TYPE_INTEGER),
            openapi.Parameter('page_size', openapi.IN_QUERY, description="페이지 크기", type=openapi.TYPE_INTEGER),
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """공지사항 목록 조회"""
        try:
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
            
            # 공지사항 조회 (is_published=True, deleted_at=NULL)
            queryset = ContentBoard.objects.filter(
                category='notice',
                is_published=True,
                deleted_at__isnull=True
            ).order_by('-is_pinned', '-created_at')
            
            paginator = Paginator(queryset, page_size)
            
            try:
                page_obj = paginator.page(page)
            except:
                return Response(
                    {"error": "Invalid page number"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = ContentBoardListSerializer(page_obj, many=True)
            
            return Response({
                "results": serializer.data,
                "total_count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"공지사항 목록 조회 실패: {str(e)}")
            return Response(
                {"error": "공지사항 목록 조회에 실패했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EventList(APIView):
    """
    이벤트 목록 조회 API
    """
    
    @swagger_auto_schema(
        operation_description="이벤트 목록을 조회합니다.",
        manual_parameters=[
            openapi.Parameter('page', openapi.IN_QUERY, description="페이지 번호", type=openapi.TYPE_INTEGER),
            openapi.Parameter('page_size', openapi.IN_QUERY, description="페이지 크기", type=openapi.TYPE_INTEGER),
            openapi.Parameter('status', openapi.IN_QUERY, description="이벤트 상태 (all/active/ended)", type=openapi.TYPE_STRING),
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """이벤트 목록 조회"""
        try:
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
            status_filter = request.query_params.get('status', 'all')
            
            # 이벤트 조회
            queryset = ContentBoard.objects.filter(
                category='event',
                is_published=True,
                deleted_at__isnull=True
            )
            
            # 상태 필터링
            now = timezone.now()
            if status_filter == 'active':
                queryset = queryset.filter(
                    event_start_date__lte=now,
                    event_end_date__gte=now
                )
            elif status_filter == 'ended':
                queryset = queryset.filter(event_end_date__lt=now)
            
            queryset = queryset.order_by('-event_start_date')
            
            paginator = Paginator(queryset, page_size)
            
            try:
                page_obj = paginator.page(page)
            except:
                return Response(
                    {"error": "Invalid page number"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = ContentBoardListSerializer(page_obj, many=True)
            
            return Response({
                "results": serializer.data,
                "total_count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"이벤트 목록 조회 실패: {str(e)}")
            return Response(
                {"error": "이벤트 목록 조회에 실패했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class InquiryList(APIView):
    """
    문의사항 목록 조회 API (본인 문의만)
    """
    
    @swagger_auto_schema(
        operation_description="본인의 문의사항 목록을 조회합니다.",
        manual_parameters=[
            openapi.Parameter('user_code', openapi.IN_QUERY, description="사용자 코드", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('page', openapi.IN_QUERY, description="페이지 번호", type=openapi.TYPE_INTEGER),
            openapi.Parameter('page_size', openapi.IN_QUERY, description="페이지 크기", type=openapi.TYPE_INTEGER),
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """문의사항 목록 조회"""
        try:
            user_code = request.query_params.get('user_code')
            
            if not user_code:
                return Response(
                    {"error": "user_code는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
            
            # 본인의 문의사항만 조회
            queryset = ContentBoard.objects.filter(
                category='inquiry',
                author_code=user_code,
                deleted_at__isnull=True
            ).order_by('-created_at')
            
            paginator = Paginator(queryset, page_size)
            
            try:
                page_obj = paginator.page(page)
            except:
                return Response(
                    {"error": "Invalid page number"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = ContentBoardListSerializer(page_obj, many=True)
            
            return Response({
                "results": serializer.data,
                "total_count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"문의사항 목록 조회 실패: {str(e)}")
            return Response(
                {"error": "문의사항 목록 조회에 실패했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ContentDetail(APIView):
    """
    컨텐츠 상세 조회 API
    """
    
    @swagger_auto_schema(
        operation_description="컨텐츠 상세 정보를 조회합니다.",
        manual_parameters=[
            openapi.Parameter('content_code', openapi.IN_QUERY, description="컨텐츠 코드", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('user_code', openapi.IN_QUERY, description="사용자 코드 (문의사항 조회시 필요)", type=openapi.TYPE_STRING),
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="컨텐츠를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """컨텐츠 상세 조회"""
        try:
            content_code = request.query_params.get('content_code')
            user_code = request.query_params.get('user_code')
            
            if not content_code:
                return Response(
                    {"error": "content_code는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            content = get_object_or_404(ContentBoard, content_code=content_code, deleted_at__isnull=True)
            
            # 문의사항인 경우 본인 또는 관리자만 조회 가능
            if content.category == 'inquiry':
                is_admin = False
                
                # 관리자 권한 확인
                if user_code:
                    try:
                        user = User.objects.get(user_code=user_code, deleted_at__isnull=True)
                        if user.login_type in ['messi', 'guest']:
                            is_admin = True
                    except User.DoesNotExist:
                        pass
                
                # 본인도 아니고 관리자도 아닌 경우 접근 거부
                if not user_code or (content.author_code != user_code and not is_admin):
                    return Response(
                        {"error": "본인의 문의사항만 조회할 수 있습니다."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            
            # 조회수 증가
            content.view_count += 1
            content.save(update_fields=['view_count'])
            
            serializer = ContentBoardDetailSerializer(content)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"컨텐츠 상세 조회 실패: {str(e)}")
            return Response(
                {"error": "컨텐츠 상세 조회에 실패했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class InquiryCreate(APIView):
    """
    문의사항 작성 API
    """
    
    @swagger_auto_schema(
        operation_description="새로운 문의사항을 작성합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['user_code', 'inquiry_type', 'title', 'content'],
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'inquiry_type': openapi.Schema(type=openapi.TYPE_STRING, description='문의 유형'),
                'title': openapi.Schema(type=openapi.TYPE_STRING, description='제목'),
                'content': openapi.Schema(type=openapi.TYPE_STRING, description='내용'),
                'is_private': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='비공개 여부'),
                'related_match_code': openapi.Schema(type=openapi.TYPE_STRING, description='관련 경기 코드'),
                'related_quarter_code': openapi.Schema(type=openapi.TYPE_STRING, description='관련 쿼터 코드'),
                'related_team_code': openapi.Schema(type=openapi.TYPE_STRING, description='관련 팀 코드'),
                'related_ground_code': openapi.Schema(type=openapi.TYPE_STRING, description='관련 그라운드 코드'),
            }
        ),
        responses={
            201: openapi.Response(description="작성 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """문의사항 작성"""
        try:
            user_code = request.data.get('user_code')
            
            if not user_code:
                return Response(
                    {"error": "user_code는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # content_code 생성
            import time
            content_code = f"c_{int(time.time())}_{user_code[-6:]}"
            
            # 문의사항 생성
            inquiry_data = {
                'content_code': content_code,
                'category': 'inquiry',
                'author_code': user_code,
                'inquiry_type': request.data.get('inquiry_type'),
                'title': request.data.get('title'),
                'content': request.data.get('content'),
                'is_private': request.data.get('is_private', True),
                'status': 'pending',
                'is_published': True,
                'related_match_code': request.data.get('related_match_code'),
                'related_quarter_code': request.data.get('related_quarter_code'),
                'related_team_code': request.data.get('related_team_code'),
                'related_ground_code': request.data.get('related_ground_code'),
            }
            
            inquiry = ContentBoard.objects.create(**inquiry_data)
            serializer = ContentBoardDetailSerializer(inquiry)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"문의사항 작성 실패: {str(e)}")
            return Response(
                {"error": f"문의사항 작성에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CommentCreate(APIView):
    """
    댓글 작성 API
    """
    
    @swagger_auto_schema(
        operation_description="컨텐츠에 댓글을 작성합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['content_code', 'user_code', 'comment'],
            properties={
                'content_code': openapi.Schema(type=openapi.TYPE_STRING, description='컨텐츠 코드'),
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'comment': openapi.Schema(type=openapi.TYPE_STRING, description='댓글 내용'),
                'parent_comment_code': openapi.Schema(type=openapi.TYPE_STRING, description='부모 댓글 코드 (대댓글인 경우)'),
            }
        ),
        responses={
            201: openapi.Response(description="작성 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """댓글 작성"""
        try:
            content_code = request.data.get('content_code')
            user_code = request.data.get('user_code')
            comment = request.data.get('comment')
            
            if not all([content_code, user_code, comment]):
                return Response(
                    {"error": "content_code, user_code, comment는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 컨텐츠 존재 확인
            content = get_object_or_404(ContentBoard, content_code=content_code, deleted_at__isnull=True)
            
            # comment_code 생성
            import time
            comment_code = f"cm_{int(time.time())}_{user_code[-6:]}"
            
            # 댓글 생성
            comment_obj = ContentComment.objects.create(
                comment_code=comment_code,
                content_code=content_code,
                user_code=user_code,
                comment=comment,
                parent_comment_code=request.data.get('parent_comment_code')
            )
            
            serializer = ContentCommentSerializer(comment_obj)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"댓글 작성 실패: {str(e)}")
            return Response(
                {"error": f"댓글 작성에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CommentDelete(APIView):
    """
    댓글 삭제 API (소프트 삭제)
    """
    
    @swagger_auto_schema(
        operation_description="댓글을 삭제합니다. (소프트 삭제)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['comment_code', 'user_code'],
            properties={
                'comment_code': openapi.Schema(type=openapi.TYPE_STRING, description='댓글 코드'),
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
            }
        ),
        responses={
            200: openapi.Response(description="삭제 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="댓글을 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def delete(self, request):
        """댓글 삭제 (소프트 삭제)"""
        try:
            comment_code = request.data.get('comment_code')
            user_code = request.data.get('user_code')
            
            if not all([comment_code, user_code]):
                return Response(
                    {"error": "comment_code, user_code는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            comment = get_object_or_404(ContentComment, comment_code=comment_code, deleted_at__isnull=True)
            
            # 본인 댓글만 삭제 가능
            if comment.user_code != user_code:
                return Response(
                    {"error": "본인의 댓글만 삭제할 수 있습니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 소프트 삭제
            comment.deleted_at = timezone.now()
            comment.save(update_fields=['deleted_at'])
            
            return Response({"message": "댓글이 삭제되었습니다."}, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"댓글 삭제 실패: {str(e)}")
            return Response(
                {"error": f"댓글 삭제에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LikeToggle(APIView):
    """
    좋아요 토글 API (컨텐츠 또는 댓글)
    """
    
    @swagger_auto_schema(
        operation_description="컨텐츠 또는 댓글의 좋아요를 토글합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['user_code', 'target_type', 'target_code'],
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'target_type': openapi.Schema(type=openapi.TYPE_STRING, description='대상 유형 (content/comment)'),
                'target_code': openapi.Schema(type=openapi.TYPE_STRING, description='대상 코드'),
                'action': openapi.Schema(type=openapi.TYPE_STRING, description='동작 (like/unlike)'),
            }
        ),
        responses={
            200: openapi.Response(description="처리 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="대상을 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """좋아요 토글"""
        try:
            user_code = request.data.get('user_code')
            target_type = request.data.get('target_type')  # 'content' or 'comment'
            target_code = request.data.get('target_code')
            action = request.data.get('action', 'like')  # 'like' or 'unlike'
            
            if not all([user_code, target_type, target_code]):
                return Response(
                    {"error": "user_code, target_type, target_code는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if target_type == 'content':
                obj = get_object_or_404(ContentBoard, content_code=target_code, deleted_at__isnull=True)
            elif target_type == 'comment':
                obj = get_object_or_404(ContentComment, comment_code=target_code, deleted_at__isnull=True)
            else:
                return Response(
                    {"error": "target_type은 'content' 또는 'comment'여야 합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 좋아요 증감
            if action == 'like':
                obj.like_count += 1
            elif action == 'unlike':
                obj.like_count = max(0, obj.like_count - 1)
            
            obj.save(update_fields=['like_count'])
            
            return Response({
                "message": "좋아요 처리 완료",
                "like_count": obj.like_count
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"좋아요 처리 실패: {str(e)}")
            return Response(
                {"error": f"좋아요 처리에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ===========================================
# Admin APIs for Content Management
# ===========================================

class AdminContentCreate(APIView):
    """
    관리자용 컨텐츠 생성 API (공지사항, 이벤트)
    """
    
    @swagger_auto_schema(
        operation_description="관리자가 공지사항 또는 이벤트를 생성합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['admin_user_code', 'category', 'title', 'content'],
            properties={
                'admin_user_code': openapi.Schema(type=openapi.TYPE_STRING, description='관리자 코드'),
                'category': openapi.Schema(type=openapi.TYPE_STRING, description='카테고리 (notice/event)'),
                'title': openapi.Schema(type=openapi.TYPE_STRING, description='제목'),
                'content': openapi.Schema(type=openapi.TYPE_STRING, description='내용'),
                'priority': openapi.Schema(type=openapi.TYPE_STRING, description='우선순위 (공지사항용: low/normal/high/urgent)'),
                'is_pinned': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='상단 고정 여부'),
                'event_start_date': openapi.Schema(type=openapi.TYPE_STRING, format='date-time', description='이벤트 시작일'),
                'event_end_date': openapi.Schema(type=openapi.TYPE_STRING, format='date-time', description='이벤트 종료일'),
                'event_link': openapi.Schema(type=openapi.TYPE_STRING, description='이벤트 링크'),
                'event_reward': openapi.Schema(type=openapi.TYPE_STRING, description='이벤트 보상'),
                'target_user_type': openapi.Schema(type=openapi.TYPE_STRING, description='대상 사용자 유형'),
                'is_published': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='공개 여부'),
            }
        ),
        responses={
            201: openapi.Response(description="생성 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """관리자용 컨텐츠 생성"""
        try:
            admin_user_code = request.data.get('admin_user_code')
            category = request.data.get('category')
            
            if not admin_user_code:
                return Response(
                    {"error": "admin_user_code는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 관리자 권한 확인
            try:
                admin_user = User.objects.get(user_code=admin_user_code, deleted_at__isnull=True)
                if admin_user.login_type not in ['messi', 'guest']:
                    return Response(
                        {"error": "관리자 권한이 없습니다."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "유효하지 않은 관리자입니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if category not in ['notice', 'event']:
                return Response(
                    {"error": "category는 'notice' 또는 'event'여야 합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # content_code 생성
            import time
            content_code = f"c_{category[:1]}_{int(time.time())}_{admin_user_code[-6:]}"
            
            # 컨텐츠 데이터 준비
            content_data = {
                'content_code': content_code,
                'category': category,
                'author_code': admin_user_code,
                'title': request.data.get('title'),
                'content': request.data.get('content'),
                'is_published': request.data.get('is_published', True),
                'published_at': timezone.now() if request.data.get('is_published', True) else None,
                'target_user_type': request.data.get('target_user_type', 'all'),
            }
            
            # 공지사항 전용 필드
            if category == 'notice':
                content_data['priority'] = request.data.get('priority', 'normal')
                content_data['is_pinned'] = request.data.get('is_pinned', False)
            
            # 이벤트 전용 필드
            if category == 'event':
                content_data['event_start_date'] = request.data.get('event_start_date')
                content_data['event_end_date'] = request.data.get('event_end_date')
                content_data['event_link'] = request.data.get('event_link')
                content_data['event_reward'] = request.data.get('event_reward')
            
            # 컨텐츠 생성
            content = ContentBoard.objects.create(**content_data)
            serializer = ContentBoardDetailSerializer(content)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"관리자 컨텐츠 생성 실패: {str(e)}")
            return Response(
                {"error": f"컨텐츠 생성에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminContentUpdate(APIView):
    """
    관리자용 컨텐츠 수정 API
    """
    
    @swagger_auto_schema(
        operation_description="관리자가 컨텐츠를 수정합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['admin_user_code', 'content_code'],
            properties={
                'admin_user_code': openapi.Schema(type=openapi.TYPE_STRING, description='관리자 코드'),
                'content_code': openapi.Schema(type=openapi.TYPE_STRING, description='컨텐츠 코드'),
                'title': openapi.Schema(type=openapi.TYPE_STRING, description='제목'),
                'content': openapi.Schema(type=openapi.TYPE_STRING, description='내용'),
                'priority': openapi.Schema(type=openapi.TYPE_STRING, description='우선순위'),
                'is_pinned': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='상단 고정 여부'),
                'event_start_date': openapi.Schema(type=openapi.TYPE_STRING, format='date-time', description='이벤트 시작일'),
                'event_end_date': openapi.Schema(type=openapi.TYPE_STRING, format='date-time', description='이벤트 종료일'),
                'event_link': openapi.Schema(type=openapi.TYPE_STRING, description='이벤트 링크'),
                'event_reward': openapi.Schema(type=openapi.TYPE_STRING, description='이벤트 보상'),
                'is_published': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='공개 여부'),
            }
        ),
        responses={
            200: openapi.Response(description="수정 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="컨텐츠를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def put(self, request):
        """관리자용 컨텐츠 수정"""
        try:
            admin_user_code = request.data.get('admin_user_code')
            content_code = request.data.get('content_code')
            
            if not all([admin_user_code, content_code]):
                return Response(
                    {"error": "admin_user_code, content_code는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 관리자 권한 확인
            try:
                admin_user = User.objects.get(user_code=admin_user_code, deleted_at__isnull=True)
                if admin_user.login_type not in ['messi', 'guest']:
                    return Response(
                        {"error": "관리자 권한이 없습니다."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "유효하지 않은 관리자입니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 컨텐츠 조회
            content = get_object_or_404(ContentBoard, content_code=content_code, deleted_at__isnull=True)
            
            # 수정 가능한 필드 업데이트
            update_fields = []
            
            if 'title' in request.data:
                content.title = request.data['title']
                update_fields.append('title')
            
            if 'content' in request.data:
                content.content = request.data['content']
                update_fields.append('content')
            
            if 'priority' in request.data and content.category == 'notice':
                content.priority = request.data['priority']
                update_fields.append('priority')
            
            if 'is_pinned' in request.data and content.category == 'notice':
                content.is_pinned = request.data['is_pinned']
                update_fields.append('is_pinned')
            
            if 'event_start_date' in request.data and content.category == 'event':
                content.event_start_date = request.data['event_start_date']
                update_fields.append('event_start_date')
            
            if 'event_end_date' in request.data and content.category == 'event':
                content.event_end_date = request.data['event_end_date']
                update_fields.append('event_end_date')
            
            if 'event_link' in request.data and content.category == 'event':
                content.event_link = request.data['event_link']
                update_fields.append('event_link')
            
            if 'event_reward' in request.data and content.category == 'event':
                content.event_reward = request.data['event_reward']
                update_fields.append('event_reward')
            
            if 'is_published' in request.data:
                content.is_published = request.data['is_published']
                update_fields.append('is_published')
                if request.data['is_published'] and not content.published_at:
                    content.published_at = timezone.now()
                    update_fields.append('published_at')
            
            if update_fields:
                update_fields.append('updated_at')
                content.save(update_fields=update_fields)
            
            serializer = ContentBoardDetailSerializer(content)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"관리자 컨텐츠 수정 실패: {str(e)}")
            return Response(
                {"error": f"컨텐츠 수정에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminContentDelete(APIView):
    """
    관리자용 컨텐츠 삭제 API (소프트 삭제)
    """
    
    @swagger_auto_schema(
        operation_description="관리자가 컨텐츠를 삭제합니다. (소프트 삭제)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['admin_user_code', 'content_code'],
            properties={
                'admin_user_code': openapi.Schema(type=openapi.TYPE_STRING, description='관리자 코드'),
                'content_code': openapi.Schema(type=openapi.TYPE_STRING, description='컨텐츠 코드'),
            }
        ),
        responses={
            200: openapi.Response(description="삭제 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="컨텐츠를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def delete(self, request):
        """관리자용 컨텐츠 삭제 (소프트 삭제)"""
        try:
            admin_user_code = request.data.get('admin_user_code')
            content_code = request.data.get('content_code')
            
            if not all([admin_user_code, content_code]):
                return Response(
                    {"error": "admin_user_code, content_code는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 관리자 권한 확인
            try:
                admin_user = User.objects.get(user_code=admin_user_code, deleted_at__isnull=True)
                if admin_user.login_type not in ['messi', 'guest']:
                    return Response(
                        {"error": "관리자 권한이 없습니다."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "유효하지 않은 관리자입니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 컨텐츠 조회 및 소프트 삭제
            content = get_object_or_404(ContentBoard, content_code=content_code, deleted_at__isnull=True)
            content.deleted_at = timezone.now()
            content.save(update_fields=['deleted_at'])
            
            return Response({"message": "컨텐츠가 삭제되었습니다."}, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"관리자 컨텐츠 삭제 실패: {str(e)}")
            return Response(
                {"error": f"컨텐츠 삭제에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminInquiryAnswer(APIView):
    """
    관리자용 문의사항 답변 API
    """
    
    @swagger_auto_schema(
        operation_description="관리자가 문의사항에 답변합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['admin_user_code', 'content_code', 'answer'],
            properties={
                'admin_user_code': openapi.Schema(type=openapi.TYPE_STRING, description='관리자 코드'),
                'content_code': openapi.Schema(type=openapi.TYPE_STRING, description='문의사항 코드'),
                'answer': openapi.Schema(type=openapi.TYPE_STRING, description='답변 내용'),
                'status': openapi.Schema(type=openapi.TYPE_STRING, description='상태 (in_progress/completed/rejected)'),
            }
        ),
        responses={
            200: openapi.Response(description="답변 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="문의사항을 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """관리자용 문의사항 답변"""
        try:
            admin_user_code = request.data.get('admin_user_code')
            content_code = request.data.get('content_code')
            answer = request.data.get('answer')
            
            if not all([admin_user_code, content_code, answer]):
                return Response(
                    {"error": "admin_user_code, content_code, answer는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 관리자 권한 확인
            try:
                admin_user = User.objects.get(user_code=admin_user_code, deleted_at__isnull=True)
                if admin_user.login_type not in ['messi', 'guest']:
                    return Response(
                        {"error": "관리자 권한이 없습니다."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "유효하지 않은 관리자입니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 문의사항 조회
            inquiry = get_object_or_404(
                ContentBoard, 
                content_code=content_code, 
                category='inquiry',
                deleted_at__isnull=True
            )
            
            # 답변 업데이트
            inquiry.answer = answer
            inquiry.answered_by = admin_user_code
            inquiry.answered_at = timezone.now()
            inquiry.status = request.data.get('status', 'completed')
            
            inquiry.save(update_fields=['answer', 'answered_by', 'answered_at', 'status', 'updated_at'])
            
            serializer = ContentBoardDetailSerializer(inquiry)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"관리자 문의사항 답변 실패: {str(e)}")
            return Response(
                {"error": f"문의사항 답변에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminInquiryList(APIView):
    """
    관리자용 전체 문의사항 목록 조회 API
    """
    
    @swagger_auto_schema(
        operation_description="관리자가 전체 문의사항 목록을 조회합니다.",
        manual_parameters=[
            openapi.Parameter('admin_user_code', openapi.IN_QUERY, description="관리자 코드", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('page', openapi.IN_QUERY, description="페이지 번호", type=openapi.TYPE_INTEGER),
            openapi.Parameter('page_size', openapi.IN_QUERY, description="페이지 크기", type=openapi.TYPE_INTEGER),
            openapi.Parameter('status', openapi.IN_QUERY, description="상태 필터 (pending/in_progress/completed/rejected)", type=openapi.TYPE_STRING),
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """관리자용 전체 문의사항 목록 조회"""
        try:
            admin_user_code = request.query_params.get('admin_user_code')
            
            if not admin_user_code:
                return Response(
                    {"error": "admin_user_code는 필수입니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 관리자 권한 확인
            try:
                admin_user = User.objects.get(user_code=admin_user_code, deleted_at__isnull=True)
                if admin_user.login_type not in ['messi', 'guest']:
                    return Response(
                        {"error": "관리자 권한이 없습니다."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "유효하지 않은 관리자입니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
            status_filter = request.query_params.get('status')
            
            # 전체 문의사항 조회
            queryset = ContentBoard.objects.filter(
                category='inquiry',
                deleted_at__isnull=True
            )
            
            # 상태 필터링
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            queryset = queryset.order_by('-created_at')
            
            paginator = Paginator(queryset, page_size)
            
            try:
                page_obj = paginator.page(page)
            except:
                return Response(
                    {"error": "Invalid page number"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = ContentBoardListSerializer(page_obj, many=True)
            
            return Response({
                "results": serializer.data,
                "total_count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"관리자 문의사항 목록 조회 실패: {str(e)}")
            return Response(
                {"error": "문의사항 목록 조회에 실패했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminLogsQuery(APIView):
    """
    관리자 로그 조회 API
    CloudWatch Logs에서 API 로그를 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_description="CloudWatch API 로그 조회",
        manual_parameters=[
            openapi.Parameter(
                'admin_user_code',
                openapi.IN_QUERY,
                description="관리자 사용자 코드",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'event_type',
                openapi.IN_QUERY,
                description="이벤트 타입 (request/response/error/all)",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'api_app',
                openapi.IN_QUERY,
                description="API 앱 필터 (user/login/match/anal/video/ground/upload)",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'status_code',
                openapi.IN_QUERY,
                description="상태 코드 필터 (200/400/500 등)",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'time_range',
                openapi.IN_QUERY,
                description="시간 범위 (5m/15m/1h/3h/24h)",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="조회 개수 (기본 50, 최대 200)",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """CloudWatch 로그 조회"""
        admin_user_code = request.query_params.get('admin_user_code')
        
        if not admin_user_code:
            return Response(
                {"error": "admin_user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 관리자 권한 확인
        try:
            admin_user = get_object_or_404(User, user_code=admin_user_code, deleted_at__isnull=True)
            if admin_user.login_type not in ['messi', 'guest']:
                return Response(
                    {"error": "관리자 권한이 없습니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        except Exception as e:
            return Response(
                {"error": "관리자 확인 실패"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # 파라미터 추출
        event_type = request.query_params.get('event_type', 'all')
        api_app = request.query_params.get('api_app')
        status_code = request.query_params.get('status_code')
        time_range = request.query_params.get('time_range', '1h')
        limit = int(request.query_params.get('limit', 50))
        limit = min(limit, 200)  # 최대 200개로 제한
        
        try:
            import boto3
            from datetime import datetime, timedelta
            import json as json_lib
            
            logger.info(f"CloudWatch 로그 조회 시작 - user: {admin_user_code}, event_type: {event_type}, api_app: {api_app}")
            
            # CloudWatch Logs 클라이언트 생성
            try:
                logs_client = boto3.client('logs', region_name='ap-northeast-2')
                logger.info("CloudWatch Logs 클라이언트 생성 성공")
            except Exception as client_error:
                logger.error(f"CloudWatch 클라이언트 생성 실패: {str(client_error)}")
                raise
            
            # 시간 범위 계산
            time_ranges = {
                '5m': 5 * 60,
                '15m': 15 * 60,
                '1h': 60 * 60,
                '3h': 3 * 60 * 60,
                '24h': 24 * 60 * 60
            }
            seconds = time_ranges.get(time_range, 3600)
            start_time = int((datetime.now() - timedelta(seconds=seconds)).timestamp() * 1000)
            end_time = int(datetime.now().timestamp() * 1000)
            
            # 필터 패턴 구성
            filter_patterns = []
            
            if event_type != 'all':
                if event_type == 'error':
                    filter_patterns.append('{ $.event = "api.error" }')
                elif event_type == 'request':
                    filter_patterns.append('{ $.event = "api.request" }')
                elif event_type == 'response':
                    filter_patterns.append('{ $.event = "api.response" }')
            
            if api_app:
                filter_patterns.append(f'{{ $.api_app = "{api_app}" }}')
            
            if status_code:
                try:
                    status_code_int = int(status_code)
                    filter_patterns.append(f'{{ $.status_code = {status_code_int} }}')
                except (ValueError, TypeError):
                    pass  # 잘못된 status_code는 무시
            
            filter_pattern = ' && '.join(filter_patterns) if filter_patterns else ''
            
            # CloudWatch Logs 조회
            query_params = {
                'logGroupName': '/agrounds/backend/api-logs',
                'startTime': start_time,
                'endTime': end_time,
                'limit': limit
            }
            
            if filter_pattern:
                query_params['filterPattern'] = filter_pattern
            
            logger.info(f"CloudWatch 조회 파라미터: {query_params}")
            
            try:
                response = logs_client.filter_log_events(**query_params)
                logger.info(f"CloudWatch 응답 수신: {type(response)}, keys: {response.keys() if response else 'None'}")
            except Exception as filter_error:
                logger.error(f"filter_log_events 호출 실패: {str(filter_error)}")
                raise
            
            # response가 None이거나 비정상인 경우 처리
            if not response:
                return Response({
                    "logs": [],
                    "total_count": 0,
                    "error_count": 0,
                    "request_count": 0,
                    "time_range": time_range,
                    "filters": {
                        "event_type": event_type,
                        "api_app": api_app,
                        "status_code": status_code
                    }
                }, status=status.HTTP_200_OK)
            
            # 로그 파싱
            logs = []
            for event in response.get('events', []):
                message = ''
                try:
                    message = event.get('message', '')
                    # JSON 로그 파싱 시도
                    if message.startswith('{'):
                        log_data = json_lib.loads(message)
                        logs.append({
                            'timestamp': event.get('timestamp'),
                            'message': message,
                            'parsed': log_data
                        })
                    else:
                        logs.append({
                            'timestamp': event.get('timestamp'),
                            'message': message,
                            'parsed': None
                        })
                except Exception as parse_error:
                    logger.warning(f"로그 파싱 실패: {str(parse_error)}, message: {message[:100]}")
                    logs.append({
                        'timestamp': event.get('timestamp'),
                        'message': message,
                        'parsed': None
                    })
            
            # 통계 계산 (None-safe)
            total_count = len(logs)
            error_count = sum(1 for log in logs if log and isinstance(log.get('parsed'), dict) and log.get('parsed', {}).get('event') == 'api.error')
            request_count = sum(1 for log in logs if log and isinstance(log.get('parsed'), dict) and log.get('parsed', {}).get('event') == 'api.request')
            
            return Response({
                "logs": logs,
                "total_count": total_count,
                "error_count": error_count,
                "request_count": request_count,
                "time_range": time_range,
                "filters": {
                    "event_type": event_type,
                    "api_app": api_app,
                    "status_code": status_code
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            logger.error(f"CloudWatch 로그 조회 실패: {str(e)}\n{error_trace}")
            return Response(
                {"error": f"로그 조회에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class NotificationList(APIView):
    """
    사용자 알림 목록 조회 API
    """
    
    @swagger_auto_schema(
        operation_description="사용자의 알림 목록을 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description="사용자 코드",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'page',
                openapi.IN_QUERY,
                description="페이지 번호 (기본값: 1)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'page_size',
                openapi.IN_QUERY,
                description="페이지당 항목 수 (기본값: 20)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'is_read',
                openapi.IN_QUERY,
                description="읽음 상태 필터 (true/false)",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'category',
                openapi.IN_QUERY,
                description="알림 카테고리 필터 (team/analysis/system/event/social/achievement)",
                type=openapi.TYPE_STRING,
                required=False
            )
        ],
        responses={
            200: openapi.Response(
                description="조회 성공",
                examples={
                    "application/json": {
                        "notifications": [
                            {
                                "notification_id": 1,
                                "category": "team",
                                "notification_type": "team_join_accepted",
                                "priority": "normal",
                                "title": "팀 가입 승인",
                                "message": "FC 서울 팀 가입이 승인되었습니다.",
                                "short_message": "팀 가입 승인",
                                "related_data": {"team_code": "t_001"},
                                "is_read": False,
                                "created_at": "2024-11-05T10:30:00Z",
                                "read_at": None
                            }
                        ],
                        "total_count": 10,
                        "unread_count": 5,
                        "page": 1,
                        "page_size": 20,
                        "total_pages": 1
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="사용자를 찾을 수 없음")
        }
    )
    def get(self, request):
        """사용자 알림 목록 조회"""
        try:
            user_code = request.query_params.get('user_code')
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
            is_read_param = request.query_params.get('is_read')
            category = request.query_params.get('category')
            
            if not user_code:
                return Response(
                    {"error": "user_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 사용자 존재 확인
            user_info = UserInfo.objects.filter(
                user_code=user_code,
                deleted_at__isnull=True
            ).first()
            
            if not user_info:
                return Response(
                    {"error": "사용자를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 알림 조회 (소프트 삭제되지 않은 것만)
            queryset = Notification.objects.filter(
                recipient_code=user_code,
                deleted_at__isnull=True,
                is_deleted=False
            )
            
            # 읽음 상태 필터링
            if is_read_param is not None:
                is_read = is_read_param.lower() == 'true'
                queryset = queryset.filter(is_read=is_read)
            
            # 카테고리 필터링
            if category:
                queryset = queryset.filter(category=category)
            
            # 최신순 정렬
            queryset = queryset.order_by('-created_at')
            
            # 읽지 않은 알림 개수
            unread_count = Notification.objects.filter(
                recipient_code=user_code,
                deleted_at__isnull=True,
                is_deleted=False,
                is_read=False
            ).count()
            
            # 페이지네이션
            paginator = Paginator(queryset, page_size)
            
            try:
                page_obj = paginator.page(page)
            except:
                return Response(
                    {"error": "Invalid page number"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 알림 데이터 직렬화
            notifications = []
            for notification in page_obj:
                notifications.append({
                    "notification_id": notification.notification_id,
                    "sender_code": notification.sender_code,
                    "category": notification.category,
                    "notification_type": notification.notification_type,
                    "priority": notification.priority,
                    "title": notification.title,
                    "message": notification.message,
                    "short_message": notification.short_message,
                    "related_data": notification.related_data,
                    "is_read": notification.is_read,
                    "created_at": notification.created_at.isoformat() if notification.created_at else None,
                    "read_at": notification.read_at.isoformat() if notification.read_at else None
                })
            
            return Response({
                "notifications": notifications,
                "total_count": paginator.count,
                "unread_count": unread_count,
                "page": page,
                "page_size": page_size,
                "total_pages": paginator.num_pages
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"알림 목록 조회 실패: {str(e)}")
            return Response(
                {"error": f"알림 목록 조회에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class NotificationMarkAsRead(APIView):
    """
    알림 읽음 처리 API
    """
    
    @swagger_auto_schema(
        operation_description="알림을 읽음 상태로 변경합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'notification_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='알림 ID'),
            },
            required=['user_code', 'notification_id']
        ),
        responses={
            200: openapi.Response(description="읽음 처리 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="알림을 찾을 수 없음")
        }
    )
    def post(self, request):
        """알림 읽음 처리"""
        try:
            user_code = request.data.get('user_code')
            notification_id = request.data.get('notification_id')
            
            if not user_code or not notification_id:
                return Response(
                    {"error": "user_code and notification_id are required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 알림 조회
            notification = Notification.objects.filter(
                notification_id=notification_id,
                recipient_code=user_code,
                deleted_at__isnull=True,
                is_deleted=False
            ).first()
            
            if not notification:
                return Response(
                    {"error": "알림을 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 이미 읽음 상태가 아닌 경우에만 업데이트
            if not notification.is_read:
                notification.is_read = True
                notification.read_at = timezone.now()
                notification.save()
            
            return Response({
                "message": "알림이 읽음 처리되었습니다.",
                "notification_id": notification_id,
                "is_read": True,
                "read_at": notification.read_at.isoformat() if notification.read_at else None
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"알림 읽음 처리 실패: {str(e)}")
            return Response(
                {"error": f"알림 읽음 처리에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class NotificationMarkAllAsRead(APIView):
    """
    모든 알림 읽음 처리 API
    """
    
    @swagger_auto_schema(
        operation_description="사용자의 모든 알림을 읽음 상태로 변경합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
            },
            required=['user_code']
        ),
        responses={
            200: openapi.Response(description="읽음 처리 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="사용자를 찾을 수 없음")
        }
    )
    def post(self, request):
        """모든 알림 읽음 처리"""
        try:
            user_code = request.data.get('user_code')
            
            if not user_code:
                return Response(
                    {"error": "user_code is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 사용자 존재 확인
            user_info = UserInfo.objects.filter(
                user_code=user_code,
                deleted_at__isnull=True
            ).first()
            
            if not user_info:
                return Response(
                    {"error": "사용자를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 읽지 않은 모든 알림 업데이트
            updated_count = Notification.objects.filter(
                recipient_code=user_code,
                deleted_at__isnull=True,
                is_deleted=False,
                is_read=False
            ).update(
                is_read=True,
                read_at=timezone.now()
            )
            
            return Response({
                "message": "모든 알림이 읽음 처리되었습니다.",
                "updated_count": updated_count
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"모든 알림 읽음 처리 실패: {str(e)}")
            return Response(
                {"error": f"모든 알림 읽음 처리에 실패했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
