from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from DB.models import PlayerVideo, PlayerVideoFolder, TeamVideoFolder, TeamVideo, TeamInfo, PlayerTeamCross
from .serializers import PlayerVideoSerializer, PlayerVideoFolderSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import uuid
import re
import requests


@swagger_auto_schema(
    method='get',
    operation_description="쿼터 코드로 비디오 정보를 조회합니다.",
    manual_parameters=[
        openapi.Parameter(
            'quarter_code',
            openapi.IN_QUERY,
            description='쿼터 코드',
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
@api_view(['GET'])
def get_videos_by_quarter(request):
    """쿼터 비디오 조회"""
    try:
        quarter_code = request.GET.get('quarter_code')
        
        if not quarter_code:
            return Response(
                {"error": "quarter_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # quarter_code로 비디오 조회 (soft delete 제외)
        videos = PlayerVideo.objects.filter(
            quarter_code=quarter_code,
            deleted_at__isnull=True
        ).order_by('-created_at')
        
        if not videos.exists():
            return Response({
                "data": [],
                "count": 0,
                "message": "해당 쿼터에 대한 비디오가 없습니다."
            }, status=status.HTTP_200_OK)
        
        # 시리얼라이저로 데이터 변환
        serializer = PlayerVideoSerializer(videos, many=True)
        
        # 각 비디오에 폴더 정보도 포함
        video_data = []
        for index, video in enumerate(videos):
            video_info = serializer.data[index]
            
            # 폴더 정보 조회
            try:
                folder = PlayerVideoFolder.objects.get(
                    folder_code=video.folder_code,
                    deleted_at__isnull=True
                )
                folder_serializer = PlayerVideoFolderSerializer(folder)
                video_info['folder_info'] = folder_serializer.data
            except PlayerVideoFolder.DoesNotExist:
                video_info['folder_info'] = None
            
            video_data.append(video_info)
        
        return Response({
            "data": video_data,
            "count": len(video_data),
            "message": f"쿼터 {quarter_code}의 비디오 정보를 성공적으로 조회했습니다."
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"비디오 조회 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='get',
    operation_description="비디오 코드로 비디오의 상세 정보를 조회합니다.",
    responses={
        200: openapi.Response(description="조회 성공"),
        404: openapi.Response(description="비디오를 찾을 수 없음"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['GET'])
def get_video_detail(request, video_code):
    """비디오 상세 정보 조회"""
    try:
        video = PlayerVideo.objects.get(
            video_code=video_code,
            deleted_at__isnull=True
        )
        
        serializer = PlayerVideoSerializer(video)
        
        # 폴더 정보도 포함
        try:
            folder = PlayerVideoFolder.objects.get(
                folder_code=video.folder_code,
                deleted_at__isnull=True
            )
            folder_serializer = PlayerVideoFolderSerializer(folder)
            video_data = serializer.data
            video_data['folder_info'] = folder_serializer.data
        except PlayerVideoFolder.DoesNotExist:
            video_data = serializer.data
            video_data['folder_info'] = None
        
        return Response(video_data, status=status.HTTP_200_OK)
        
    except PlayerVideo.DoesNotExist:
        return Response(
            {"error": "해당 비디오를 찾을 수 없습니다."}, 
            status=status.HTTP_404_NOT_FOUND
        )
        
    except Exception as e:
        return Response(
            {"error": f"비디오 조회 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='get',
    operation_description="사용자의 비디오 폴더 목록을 조회합니다.",
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
        200: openapi.Response(description="조회 성공"),
        400: openapi.Response(description="잘못된 요청"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['GET'])
def get_user_video_folders(request):
    """사용자 비디오 폴더 목록 조회"""
    try:
        user_code = request.GET.get('user_code')
        
        if not user_code:
            return Response({
                'success': False,
                'message': 'user_code 파라미터가 필요합니다.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 사용자의 비디오 폴더 조회 (soft delete 제외)
        folders = PlayerVideoFolder.objects.filter(
            user_code=user_code,
            deleted_at__isnull=True
        ).order_by('-created_at')
        
        serializer = PlayerVideoFolderSerializer(folders, many=True)
        
        return Response({
            "folders": serializer.data,
            "total_count": len(serializer.data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"폴더 조회 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='post',
    operation_description="비디오 폴더를 생성합니다.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
            'name': openapi.Schema(type=openapi.TYPE_STRING, description='폴더 이름')
        },
        required=['user_code', 'name']
    ),
    responses={
        201: openapi.Response(description="생성 성공"),
        400: openapi.Response(description="잘못된 요청"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['POST'])
def create_video_folder(request):
    """비디오 폴더 생성"""
    try:
        user_code = request.data.get('user_code')
        folder_name = request.data.get('name')
        
        if not user_code or not folder_name:
            return Response(
                {"error": "user_code와 name 파라미터가 필요합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 폴더 이름 중복 확인
        existing_folder = PlayerVideoFolder.objects.filter(
            user_code=user_code,
            name=folder_name,
            deleted_at__isnull=True
        ).exists()
        
        if existing_folder:
            return Response({
                'success': False,
                'message': '같은 이름의 폴더가 이미 존재합니다.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 새 폴더 생성
        folder_code = f"vf_{str(uuid.uuid4()).replace('-', '')[:12]}"
        new_folder = PlayerVideoFolder.objects.create(
            folder_code=folder_code,
            user_code=user_code,
            name=folder_name
        )
        
        serializer = PlayerVideoFolderSerializer(new_folder)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": f"폴더 생성 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='put',
    operation_description="비디오 폴더 이름을 수정합니다.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
            'name': openapi.Schema(type=openapi.TYPE_STRING, description='새로운 폴더 이름')
        },
        required=['user_code', 'name']
    ),
    responses={
        200: openapi.Response(description="수정 성공"),
        400: openapi.Response(description="잘못된 요청"),
        404: openapi.Response(description="폴더를 찾을 수 없음"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['PUT'])
def update_video_folder(request, folder_code):
    """비디오 폴더 이름 수정"""
    try:
        user_code = request.data.get('user_code')
        new_name = request.data.get('name')
        
        if not user_code or not new_name:
            return Response(
                {"error": "user_code와 name 파라미터가 필요합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        folder = get_object_or_404(
            PlayerVideoFolder,
            folder_code=folder_code,
            user_code=user_code,
            deleted_at__isnull=True
        )
        
        # 동일한 이름의 다른 폴더가 있는지 확인
        existing_folder = PlayerVideoFolder.objects.filter(
            user_code=user_code,
            name=new_name,
            deleted_at__isnull=True
        ).exclude(folder_code=folder_code).exists()
        
        if existing_folder:
            return Response(
                {"error": "같은 이름의 폴더가 이미 존재합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 폴더 이름 업데이트
        folder.name = new_name
        folder.updated_at = timezone.now()
        folder.save()
        
        serializer = PlayerVideoFolderSerializer(folder)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"폴더 수정 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='delete',
    operation_description="비디오 폴더를 삭제합니다 (소프트 삭제).",
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
        200: openapi.Response(description="삭제 성공"),
        400: openapi.Response(description="잘못된 요청"),
        404: openapi.Response(description="폴더를 찾을 수 없음"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['DELETE'])
def delete_video_folder(request, folder_code):
    """비디오 폴더 삭제 (소프트 삭제)"""
    try:
        user_code = request.data.get('user_code') or request.GET.get('user_code')
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        folder = get_object_or_404(
            PlayerVideoFolder,
            folder_code=folder_code,
            user_code=user_code,
            deleted_at__isnull=True
        )
        
        # 폴더 내 비디오들도 함께 소프트 삭제
        PlayerVideo.objects.filter(
            folder_code=folder_code,
            deleted_at__isnull=True
        ).update(deleted_at=timezone.now())
        
        # 폴더 소프트 삭제
        folder.deleted_at = timezone.now()
        folder.save()
        
        return Response(
            {"message": "폴더가 성공적으로 삭제되었습니다."}, 
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        return Response(
            {"error": f"폴더 삭제 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='get',
    operation_description="특정 폴더의 영상 개수를 조회합니다.",
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
        200: openapi.Response(description="조회 성공"),
        400: openapi.Response(description="잘못된 요청"),
        404: openapi.Response(description="폴더를 찾을 수 없음"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['GET'])
def get_folder_video_count(request, folder_code):
    """폴더 영상 개수 조회"""
    try:
        user_code = request.GET.get('user_code')
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        folder = get_object_or_404(
            PlayerVideoFolder,
            folder_code=folder_code,
            user_code=user_code,
            deleted_at__isnull=True
        )
        
        video_count = PlayerVideo.objects.filter(
            folder_code=folder_code,
            deleted_at__isnull=True
        ).count()
        
        return Response({
            "folder_code": folder_code,
            "video_count": video_count
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"영상 개수 조회 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='get',
    operation_description="특정 폴더의 영상 목록을 조회합니다.",
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
        200: openapi.Response(description="조회 성공"),
        400: openapi.Response(description="잘못된 요청"),
        404: openapi.Response(description="폴더를 찾을 수 없음"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['GET'])
def get_folder_videos(request, folder_code):
    """폴더 영상 목록 조회"""
    try:
        user_code = request.GET.get('user_code')
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        folder = get_object_or_404(
            PlayerVideoFolder,
            folder_code=folder_code,
            user_code=user_code,
            deleted_at__isnull=True
        )
        
        videos = PlayerVideo.objects.filter(
            folder_code=folder_code,
            deleted_at__isnull=True
        ).order_by('-created_at')
        
        serializer = PlayerVideoSerializer(videos, many=True)
        
        return Response({
            "folder_info": {
                "folder_code": folder.folder_code,
                "folder_name": folder.name,
                "user_code": folder.user_code
            },
            "videos": serializer.data,
            "total_count": len(serializer.data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"영상 목록 조회 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='post',
    operation_description="새로운 영상을 폴더에 추가합니다.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
            'folder_code': openapi.Schema(type=openapi.TYPE_STRING, description='폴더 코드'),
            'quarter_code': openapi.Schema(type=openapi.TYPE_STRING, description='쿼터 코드 (선택사항)'),
            'url': openapi.Schema(type=openapi.TYPE_STRING, description='YouTube URL')
        },
        required=['user_code', 'folder_code', 'url']
    ),
    responses={
        201: openapi.Response(description="영상 추가 성공"),
        400: openapi.Response(description="잘못된 요청"),
        404: openapi.Response(description="폴더 또는 쿼터를 찾을 수 없음"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['POST'])
def create_video(request):
    """영상 추가"""
    try:
        user_code = request.data.get('user_code')
        folder_code = request.data.get('folder_code')
        quarter_code = request.data.get('quarter_code')
        url = request.data.get('url')
        
        if not all([user_code, folder_code, url]):
            return Response(
                {"error": "user_code, folder_code, url 파라미터가 필요합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        folder = get_object_or_404(
            PlayerVideoFolder,
            folder_code=folder_code,
            user_code=user_code,
            deleted_at__isnull=True
        )
        
        # 쿼터 존재 확인 (quarter_code가 제공된 경우에만)
        if quarter_code:
            from DB.models import PlayerQuarter
            get_object_or_404(
                PlayerQuarter,
                quarter_code=quarter_code
            )
        
        # 비디오 코드 생성
        video_code = f"v_{str(uuid.uuid4()).replace('-', '')[:12]}"
        
        # 영상 생성
        video = PlayerVideo.objects.create(
            video_code=video_code,
            folder_code=folder_code,
            quarter_code=quarter_code if quarter_code else None,
            url=url
        )
        
        serializer = PlayerVideoSerializer(video)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": f"영상 추가 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='post',
    operation_description="영상을 삭제합니다 (소프트 삭제).",
    manual_parameters=[
        openapi.Parameter(
            'video_code',
            openapi.IN_PATH,
            description='영상 코드',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드')
        },
        required=['user_code']
    ),
    responses={
        200: openapi.Response(description="영상 삭제 성공"),
        400: openapi.Response(description="잘못된 요청"),
        404: openapi.Response(description="영상을 찾을 수 없음"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['POST'])
def delete_video(request, video_code):
    """영상 삭제 (소프트 삭제)"""
    try:
        user_code = request.data.get('user_code')
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        video = get_object_or_404(
            PlayerVideo,
            video_code=video_code,
            deleted_at__isnull=True
        )
        
        # 폴더를 통해 사용자 소유권 확인
        get_object_or_404(
            PlayerVideoFolder,
            folder_code=video.folder_code,
            user_code=user_code,
            deleted_at__isnull=True
        )
        
        # 소프트 삭제
        video.deleted_at = timezone.now()
        video.save()
        
        return Response(
            {"message": "영상이 성공적으로 삭제되었습니다.", "video_code": video_code}, 
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        return Response(
            {"error": f"영상 삭제 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='put',
    operation_description="영상의 연결된 쿼터를 변경합니다. quarter_code를 빈 문자열로 전달하면 쿼터 연결이 해제됩니다.",
    manual_parameters=[
        openapi.Parameter(
            'video_code',
            openapi.IN_PATH,
            description='영상 코드',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
            'quarter_code': openapi.Schema(type=openapi.TYPE_STRING, description='새 쿼터 코드 (빈 문자열이면 연결 해제)')
        },
        required=['user_code']
    ),
    responses={
        200: openapi.Response(description="쿼터 변경 성공"),
        400: openapi.Response(description="잘못된 요청"),
        404: openapi.Response(description="영상 또는 쿼터를 찾을 수 없음"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['PUT'])
def update_video_quarter(request, video_code):
    """영상 쿼터 변경"""
    try:
        user_code = request.data.get('user_code')
        quarter_code = request.data.get('quarter_code', '')
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        video = get_object_or_404(
            PlayerVideo,
            video_code=video_code,
            deleted_at__isnull=True
        )
        
        # 폴더를 통해 사용자 소유권 확인
        get_object_or_404(
            PlayerVideoFolder,
            folder_code=video.folder_code,
            user_code=user_code,
            deleted_at__isnull=True
        )
        
        # quarter_code 검증 (빈 문자열이 아닌 경우에만)
        if quarter_code:
            from DB.models import PlayerQuarter
            get_object_or_404(
                PlayerQuarter,
                quarter_code=quarter_code,
                deleted_at__isnull=True
            )
        
        # 쿼터 변경
        video.quarter_code = quarter_code if quarter_code else None
        video.updated_at = timezone.now()
        video.save()
        
        serializer = PlayerVideoSerializer(video)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"쿼터 변경 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='get',
    operation_description="YouTube URL에서 영상의 실제 업로드 날짜를 가져옵니다.",
    manual_parameters=[
        openapi.Parameter(
            'url',
            openapi.IN_QUERY,
            description='YouTube URL',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    responses={
        200: openapi.Response(description="업로드 날짜 조회 성공"),
        400: openapi.Response(description="잘못된 요청"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['GET'])
def get_youtube_upload_date(request):
    """YouTube 영상 업로드 날짜 조회"""
    try:
        url = request.GET.get('url')
        if not url:
            return Response(
                {"error": "url parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # YouTube URL에서 video ID 추출
        video_id_match = re.search(r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)', url)
        if not video_id_match:
            return Response(
                {"error": "유효한 YouTube URL이 아닙니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        video_id = video_id_match.group(1)
        
        # YouTube Data API v3 사용 (API 키 필요)
        # 실제 사용 시에는 Django 설정에서 API 키를 가져와야 합니다
        API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE'  # 실제 API 키로 교체 필요
        
        if API_KEY == 'YOUR_YOUTUBE_API_KEY_HERE':
            return Response(
                {"error": "YouTube API 키가 설정되지 않았습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # YouTube Data API v3 호출
        api_url = f'https://www.googleapis.com/youtube/v3/videos?id={video_id}&part=snippet&key={API_KEY}'
        response = requests.get(api_url)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('items') and len(data['items']) > 0:
                published_at = data['items'][0]['snippet']['publishedAt']
                return Response({
                    "video_id": video_id,
                    "upload_date": published_at,
                    "title": data['items'][0]['snippet']['title']
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "영상을 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": f"YouTube API 호출 실패: {response.status_code}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {"error": f"YouTube 업로드 날짜 조회 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class TeamVideoFolderList(APIView):
    """
    팀 비디오 폴더 목록 조회 API
    팀의 비디오 폴더 목록을 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_description="팀의 비디오 폴더 목록을 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'team_code',
                openapi.IN_QUERY,
                description='팀 코드',
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description='사용자 코드 (권한 확인용)',
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="성공",
                examples={
                    "application/json": {
                        "folders": [
                            {
                                "folder_code": "tvf_001",
                                "team_code": "t_001",
                                "name": "2025년 1월 경기",
                                "video_count": 3,
                                "created_at": "2025-01-15T14:00:00Z",
                                "updated_at": "2025-01-15T14:00:00Z"
                            }
                        ]
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="팀을 찾을 수 없음")
        }
    )
    def get(self, request):
        """팀 비디오 폴더 목록 조회"""
        try:
            team_code = request.query_params.get('team_code')
            user_code = request.query_params.get('user_code')
            
            if not team_code or not user_code:
                return Response(
                    {"error": "team_code와 user_code 파라미터가 필요합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 팀 존재 확인
            team_info = get_object_or_404(TeamInfo, team_code=team_code, deleted_at__isnull=True)
            
            # 사용자가 팀 멤버인지 확인
            team_member = PlayerTeamCross.objects.filter(
                user_code=user_code,
                team_code=team_code,
                deleted_at__isnull=True
            ).first()
            
            if not team_member:
                return Response(
                    {"error": "팀 멤버가 아닙니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 팀 비디오 폴더 목록 조회
            folders = TeamVideoFolder.objects.filter(
                team_code=team_code,
                deleted_at__isnull=True
            ).order_by('-created_at')
            
            # 각 폴더의 비디오 개수 계산
            folder_list = []
            for folder in folders:
                video_count = TeamVideo.objects.filter(
                    folder_code=folder.folder_code,
                    deleted_at__isnull=True
                ).count()
                
                folder_list.append({
                    "folder_code": folder.folder_code,
                    "team_code": folder.team_code,
                    "name": folder.name,
                    "video_count": video_count,
                    "created_at": folder.created_at.isoformat() if folder.created_at else None,
                    "updated_at": folder.updated_at.isoformat() if folder.updated_at else None
                })
            
            return Response({
                "folders": folder_list
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"팀 비디오 폴더 목록 조회 오류: {str(e)}")
            return Response(
                {"error": "팀 비디오 폴더 목록 조회 중 오류가 발생했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamVideoFolderCreate(APIView):
    """
    팀 비디오 폴더 생성 API
    팀 비디오 폴더를 생성합니다 (owner/manager만 가능).
    """
    
    @swagger_auto_schema(
        operation_description="팀 비디오 폴더를 생성합니다. (owner/manager만 가능)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'team_code': openapi.Schema(type=openapi.TYPE_STRING, description='팀 코드'),
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'folder_name': openapi.Schema(type=openapi.TYPE_STRING, description='폴더 이름')
            },
            required=['team_code', 'user_code', 'folder_name']
        ),
        responses={
            201: openapi.Response(
                description="성공",
                examples={
                    "application/json": {
                        "success": True,
                        "folder_code": "tvf_002",
                        "message": "비디오 폴더가 생성되었습니다."
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음")
        }
    )
    def post(self, request):
        """팀 비디오 폴더 생성"""
        try:
            team_code = request.data.get('team_code')
            user_code = request.data.get('user_code')
            folder_name = request.data.get('folder_name')
            
            if not team_code or not user_code or not folder_name:
                return Response(
                    {"error": "team_code, user_code, folder_name이 필요합니다."}, 
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
                    {"error": "폴더 생성 권한이 없습니다. (owner/manager만 가능)"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 폴더 코드 생성
            import time
            import random
            folder_code = f"tvf_{int(time.time())}_{random.randint(1000, 9999)}"
            
            # 폴더 생성
            folder = TeamVideoFolder.objects.create(
                folder_code=folder_code,
                team_code=team_code,
                name=folder_name
            )
            
            return Response({
                "success": True,
                "folder_code": folder_code,
                "message": "비디오 폴더가 생성되었습니다."
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"팀 비디오 폴더 생성 오류: {str(e)}")
            return Response(
                {"error": "팀 비디오 폴더 생성 중 오류가 발생했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamVideoFolderUpdate(APIView):
    """
    팀 비디오 폴더 수정 API
    팀 비디오 폴더 이름을 수정합니다 (owner/manager만 가능).
    """
    
    @swagger_auto_schema(
        operation_description="팀 비디오 폴더 이름을 수정합니다. (owner/manager만 가능)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'team_code': openapi.Schema(type=openapi.TYPE_STRING, description='팀 코드'),
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'folder_code': openapi.Schema(type=openapi.TYPE_STRING, description='폴더 코드'),
                'folder_name': openapi.Schema(type=openapi.TYPE_STRING, description='새 폴더 이름')
            },
            required=['team_code', 'user_code', 'folder_code', 'folder_name']
        ),
        responses={
            200: openapi.Response(
                description="성공",
                examples={
                    "application/json": {
                        "success": True,
                        "message": "비디오 폴더가 수정되었습니다."
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="폴더를 찾을 수 없음")
        }
    )
    def put(self, request):
        """팀 비디오 폴더 수정"""
        try:
            team_code = request.data.get('team_code')
            user_code = request.data.get('user_code')
            folder_code = request.data.get('folder_code')
            folder_name = request.data.get('folder_name')
            
            if not team_code or not user_code or not folder_code or not folder_name:
                return Response(
                    {"error": "team_code, user_code, folder_code, folder_name이 필요합니다."}, 
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
                    {"error": "폴더 수정 권한이 없습니다. (owner/manager만 가능)"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 폴더 존재 확인 및 수정
            folder = get_object_or_404(
                TeamVideoFolder, 
                folder_code=folder_code, 
                team_code=team_code,
                deleted_at__isnull=True
            )
            
            folder.name = folder_name
            folder.save()
            
            return Response({
                "success": True,
                "message": "비디오 폴더가 수정되었습니다."
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"팀 비디오 폴더 수정 오류: {str(e)}")
            return Response(
                {"error": "팀 비디오 폴더 수정 중 오류가 발생했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamVideoFolderDelete(APIView):
    """
    팀 비디오 폴더 삭제 API
    팀 비디오 폴더를 삭제합니다 (owner/manager만 가능, 소프트 삭제).
    """
    
    @swagger_auto_schema(
        operation_description="팀 비디오 폴더를 삭제합니다. (owner/manager만 가능)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'team_code': openapi.Schema(type=openapi.TYPE_STRING, description='팀 코드'),
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'folder_code': openapi.Schema(type=openapi.TYPE_STRING, description='폴더 코드')
            },
            required=['team_code', 'user_code', 'folder_code']
        ),
        responses={
            200: openapi.Response(
                description="성공",
                examples={
                    "application/json": {
                        "success": True,
                        "message": "비디오 폴더가 삭제되었습니다."
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            403: openapi.Response(description="권한 없음"),
            404: openapi.Response(description="폴더를 찾을 수 없음")
        }
    )
    def delete(self, request):
        """팀 비디오 폴더 삭제 (소프트 삭제)"""
        try:
            team_code = request.data.get('team_code')
            user_code = request.data.get('user_code')
            folder_code = request.data.get('folder_code')
            
            if not team_code or not user_code or not folder_code:
                return Response(
                    {"error": "team_code, user_code, folder_code가 필요합니다."}, 
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
                    {"error": "폴더 삭제 권한이 없습니다. (owner/manager만 가능)"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 폴더 존재 확인 및 소프트 삭제
            folder = get_object_or_404(
                TeamVideoFolder, 
                folder_code=folder_code, 
                team_code=team_code,
                deleted_at__isnull=True
            )
            
            from django.utils import timezone
            folder.deleted_at = timezone.now()
            folder.save()
            
            # 폴더 내 비디오들도 소프트 삭제
            TeamVideo.objects.filter(
                folder_code=folder_code,
                deleted_at__isnull=True
            ).update(deleted_at=timezone.now())
            
            return Response({
                "success": True,
                "message": "비디오 폴더가 삭제되었습니다."
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"팀 비디오 폴더 삭제 오류: {str(e)}")
            return Response(
                {"error": "팀 비디오 폴더 삭제 중 오류가 발생했습니다."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@swagger_auto_schema(
    method='get',
    operation_description="특정 팀 폴더의 영상 목록을 조회합니다.",
    manual_parameters=[
        openapi.Parameter(
            'team_code',
            openapi.IN_QUERY,
            description='팀 코드',
            type=openapi.TYPE_STRING,
            required=True
        ),
        openapi.Parameter(
            'user_code',
            openapi.IN_QUERY,
            description='사용자 코드 (권한 확인용)',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="성공",
            examples={
                "application/json": {
                    "success": True,
                    "message": "팀 폴더 영상 목록을 성공적으로 조회했습니다.",
                    "data": {
                        "folder_info": {
                            "folder_code": "tvf_001",
                            "folder_name": "2025년 1월 경기",
                            "team_code": "t_001"
                        },
                        "videos": [
                            {
                                "video_code": "tv_001",
                                "folder_code": "tvf_001",
                                "quarter_code": "tq_001",
                                "url": "https://youtube.com/watch?v=example",
                                "created_at": "2025-01-15T14:00:00Z",
                                "updated_at": "2025-01-15T14:00:00Z"
                            }
                        ],
                        "total_count": 1
                    }
                }
            }
        ),
        400: openapi.Response(description="잘못된 요청"),
        403: openapi.Response(description="권한 없음"),
        404: openapi.Response(description="폴더를 찾을 수 없음")
    }
)
@api_view(['GET'])
def get_team_folder_videos(request, folder_code):
    """팀 폴더 영상 목록 조회"""
    try:
        team_code = request.GET.get('team_code')
        user_code = request.GET.get('user_code')
        
        if not team_code or not user_code:
            return Response(
                {"error": "team_code와 user_code 파라미터가 필요합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        team_info = get_object_or_404(TeamInfo, team_code=team_code, deleted_at__isnull=True)
        
        team_member = PlayerTeamCross.objects.filter(
            user_code=user_code,
            team_code=team_code,
            deleted_at__isnull=True
        ).first()
        
        if not team_member:
            return Response(
                {"error": "팀 멤버가 아닙니다."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        folder = get_object_or_404(
            TeamVideoFolder,
            folder_code=folder_code,
            team_code=team_code,
            deleted_at__isnull=True
        )
        
        videos = TeamVideo.objects.filter(
            folder_code=folder_code,
            deleted_at__isnull=True
        ).order_by('-created_at')
        
        # 영상 데이터 구성
        video_list = []
        for video in videos:
            video_list.append({
                "video_code": video.video_code,
                "folder_code": video.folder_code,
                "quarter_code": video.quarter_code,
                "url": video.url,
                "created_at": video.created_at.isoformat() if video.created_at else None,
                "updated_at": video.updated_at.isoformat() if video.updated_at else None
            })
        
        return Response({
            "folder_info": {
                "folder_code": folder.folder_code,
                "folder_name": folder.name,
                "team_code": folder.team_code
            },
            "videos": video_list,
            "total_count": len(video_list)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"팀 폴더 영상 목록 조회 오류: {str(e)}")
        return Response(
            {"error": f"영상 목록 조회 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='post',
    operation_description="팀 폴더에 새로운 영상을 추가합니다.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'team_code': openapi.Schema(type=openapi.TYPE_STRING, description='팀 코드'),
            'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
            'folder_code': openapi.Schema(type=openapi.TYPE_STRING, description='폴더 코드'),
            'quarter_code': openapi.Schema(type=openapi.TYPE_STRING, description='쿼터 코드 (선택사항)'),
            'url': openapi.Schema(type=openapi.TYPE_STRING, description='YouTube URL')
        },
        required=['team_code', 'user_code', 'folder_code', 'url']
    ),
    responses={
        201: openapi.Response(description="영상 추가 성공"),
        400: openapi.Response(description="잘못된 요청"),
        403: openapi.Response(description="권한 없음"),
        404: openapi.Response(description="폴더 또는 쿼터를 찾을 수 없음"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['POST'])
def create_team_video(request):
    """팀 폴더에 영상 추가"""
    try:
        team_code = request.data.get('team_code')
        user_code = request.data.get('user_code')
        folder_code = request.data.get('folder_code')
        quarter_code = request.data.get('quarter_code')  # 선택사항
        url = request.data.get('url')
        
        if not all([team_code, user_code, folder_code, url]):
            return Response(
                {"error": "team_code, user_code, folder_code, url 파라미터가 필요합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        team_info = get_object_or_404(TeamInfo, team_code=team_code, deleted_at__isnull=True)
        
        team_member = PlayerTeamCross.objects.filter(
            user_code=user_code,
            team_code=team_code,
            deleted_at__isnull=True
        ).first()
        
        if not team_member:
            return Response(
                {"error": "팀 멤버가 아닙니다."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        folder = get_object_or_404(
            TeamVideoFolder,
            folder_code=folder_code,
            team_code=team_code,
            deleted_at__isnull=True
        )
        
        # quarter_code가 제공된 경우 검증
        if quarter_code:
            from DB.models import TeamQuarter
            get_object_or_404(
                TeamQuarter,
                quarter_code=quarter_code,
                deleted_at__isnull=True
            )
        
        # 팀 영상 생성
        video_code = f"tv_{uuid.uuid4().hex[:12]}"
        team_video = TeamVideo.objects.create(
            video_code=video_code,
            folder_code=folder_code,
            quarter_code=quarter_code,
            url=url
        )
        
        return Response({
            "success": True,
            "video_code": team_video.video_code,
            "folder_code": team_video.folder_code,
            "quarter_code": team_video.quarter_code,
            "url": team_video.url,
            "created_at": team_video.created_at.isoformat() if team_video.created_at else None
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"팀 영상 추가 오류: {str(e)}")
        return Response(
            {"error": f"영상 추가 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@swagger_auto_schema(
    method='post',
    operation_description="팀 영상을 삭제합니다 (소프트 삭제).",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'team_code': openapi.Schema(type=openapi.TYPE_STRING, description='팀 코드'),
            'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드')
        },
        required=['team_code', 'user_code']
    ),
    responses={
        200: openapi.Response(description="영상 삭제 성공"),
        400: openapi.Response(description="잘못된 요청"),
        403: openapi.Response(description="권한 없음"),
        404: openapi.Response(description="영상을 찾을 수 없음"),
        500: openapi.Response(description="서버 오류")
    }
)
@api_view(['POST'])
def delete_team_video(request, video_code):
    """팀 영상 삭제 (소프트 삭제)"""
    try:
        team_code = request.data.get('team_code')
        user_code = request.data.get('user_code')
        
        if not team_code or not user_code:
            return Response(
                {"error": "team_code와 user_code 파라미터가 필요합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        team_info = get_object_or_404(TeamInfo, team_code=team_code, deleted_at__isnull=True)
        
        team_member = PlayerTeamCross.objects.filter(
            user_code=user_code,
            team_code=team_code,
            deleted_at__isnull=True
        ).first()
        
        if not team_member:
            return Response(
                {"error": "팀 멤버가 아닙니다."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        team_video = get_object_or_404(
            TeamVideo,
            video_code=video_code,
            deleted_at__isnull=True
        )
        
        # 영상이 해당 팀의 폴더에 속하는지 확인
        folder = TeamVideoFolder.objects.filter(
            folder_code=team_video.folder_code,
            team_code=team_code,
            deleted_at__isnull=True
        ).first()
        
        if not folder:
            return Response(
                {"error": "해당 팀의 영상이 아닙니다."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # 소프트 삭제
        team_video.deleted_at = timezone.now()
        team_video.save()
        
        return Response(
            {"message": "영상이 성공적으로 삭제되었습니다."}, 
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        print(f"팀 영상 삭제 오류: {str(e)}")
        return Response(
            {"error": f"영상 삭제 중 오류가 발생했습니다: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
