from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from DB.models import MatchInfo
from rest_framework.generics import get_object_or_404

from staticfiles.get_file_url import get_file_url

from .serializers import *

class getVideoSummation(APIView):
    def post(self, response):
        user_code = response.data.get('user_code')

        if user_code is None:
            return Response({'error': 'Missing required field: user_code'}, status=400)
        
        if not UserInfo.objects.filter(user_code=user_code).exists():
            return Response({'error': f'user_code({user_code})에 해당하는 유저가 존재하지 않습니다.'})
        
        thumnails = [get_file_url('video/thumbnail/thumbnail1.png'), 
                     get_file_url('video/thumbnail/thumbnail2.png'), 
                     get_file_url('video/thumbnail/thumbnail3.png')]
        
        
        result = {
            "player_cam" : {
                "thumbnail" : thumnails,
                "number_of_videos" : 8
            },
            "team_cam" : {
                "thumbnail" : thumnails,
                "number_of_videos" : 9
            },
            "full_cam" : {
                "thumbnail" : thumnails,
                "number_of_videos" : 10
            },
            "highlight_cam" : {
                "thumbnail" : [],
                "number_of_videos" : 0
            }
        }

        return Response(result)

class getPlayerVideoList(APIView):
    def post(self, response):
        user_code = response.data.get('user_code')

        if user_code is None:
            return Response({'error': 'Missing required field: user_code'}, status=400)
        
        if not UserInfo.objects.filter(user_code=user_code).exists():
            return Response({'error': f'user_code({user_code})에 해당하는 유저가 존재하지 않습니다.'})
        
        thumnails = [get_file_url('video/thumbnail/thumbnail1.png'), 
                     get_file_url('video/thumbnail/thumbnail2.png'), 
                     get_file_url('video/thumbnail/thumbnail3.png')]
        
        link = get_file_url('video/m_0001/1쿼터/player_pc/AAAAAA_20241017_1_pc/AAAAAA_20241017_1_pc.mpd')
        download_link = get_file_url('video/m_0001/1쿼터/player_pc/AAAAAA_20241017_1_pc.mp4')
        
        result = [
            {
                "match_code" : "m_0001",
                "title" : "인하대학교 FC",
                "date" : "2024-11-20",
                "thumbnail" : thumnails[0]
            },
            {
                "match_code" : "m_0002",
                "title" : "FC 호빵",
                "date" : "2024-11-21",
                "thumbnail" : thumnails[1]
            },
            {
                "match_code" : "m_0003",
                "title" : "동백 FC",
                "date" : "2024-11-22",
                "thumbnail" : thumnails[2]
            },
            {
                "match_code" : "m_0004",
                "title" : "토트넘",
                "date" : "2024-11-23",
                "thumbnail" : thumnails[0]
            },
            {
                "match_code" : "m_0005",
                "title" : "바이에른 뮌헨",
                "date" : "2024-11-24",
                "thumbnail" : thumnails[1]
            },
            {
                "match_code" : "m_0006",
                "title" : "인하대학교 FC",
                "date" : "2024-11-25",
                "thumbnail" : thumnails[2]
            },
            {
                "match_code" : "m_0007",
                "title" : "인하대학교 FC",
                "date" : "2024-11-26",
                "thumbnail" : thumnails[0]
            },
            {
                "match_code" : "m_0008",
                "title" : "인하대학교 FC",
                "date" : "2024-11-27",
                "thumbnail" : thumnails[1]
            },
        ]

        return Response(result)
    
