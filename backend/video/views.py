from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from DB.models import PlayerVideo, PlayerVideoFolder
from .serializers import PlayerVideoSerializer, PlayerVideoFolderSerializer


@api_view(['GET'])
def get_videos_by_quarter(request):
    """
    quarter_code에 해당하는 비디오 정보를 조회하는 API
    """
    try:
        quarter_code = request.GET.get('quarter_code')
        
        if not quarter_code:
            return Response({
                'success': False,
                'message': 'quarter_code 파라미터가 필요합니다.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # quarter_code로 비디오 조회 (soft delete 제외)
        videos = PlayerVideo.objects.filter(
            quarter_code=quarter_code,
            deleted_at__isnull=True
        ).order_by('-created_at')
        
        if not videos.exists():
            return Response({
                'success': True,
                'message': '해당 쿼터에 대한 비디오가 없습니다.',
                'data': []
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
            'success': True,
            'message': f'쿼터 {quarter_code}의 비디오 정보를 성공적으로 조회했습니다.',
            'data': video_data,
            'count': len(video_data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'비디오 조회 중 오류가 발생했습니다: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_video_detail(request, video_code):
    """
    특정 비디오의 상세 정보를 조회하는 API
    """
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
        
        return Response({
            'success': True,
            'message': '비디오 상세 정보를 성공적으로 조회했습니다.',
            'data': video_data
        }, status=status.HTTP_200_OK)
        
    except PlayerVideo.DoesNotExist:
        return Response({
            'success': False,
            'message': '해당 비디오를 찾을 수 없습니다.'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'비디오 조회 중 오류가 발생했습니다: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
