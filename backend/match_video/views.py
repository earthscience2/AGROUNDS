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