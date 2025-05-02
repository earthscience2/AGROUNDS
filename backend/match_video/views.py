from rest_framework.views import APIView
from rest_framework.response import Response
from staticfiles.get_file_url import get_file_url
from rest_framework.generics import get_object_or_404
from django.db.models import Min
from staticfiles.make_file_key import get_link, get_download_link
from staticfiles.get_youtube_info import extract_video_id, thumbnail_url

from staticfiles.super_user import is_super_user

from .serializers import *

link = {
    "player" : get_file_url('video/m_0001/1쿼터/player_pc/AAAAAA_20241017_1_pc/AAAAAA_20241017_1_pc.mpd'),
    "team" :  get_file_url('video/m_0001/1쿼터/team/team.mpd'),
    "full" :  get_file_url('video/m_0001/1쿼터/full/full.mpd'),
    "highlight" :  get_file_url('video/m_0001/1쿼터/full/full.mpd')
}

download_link = {
    "player" : get_file_url('video/m_0001/1쿼터/player_pc/AAAAAA_20241017_1_pc.mp4'),
    "team" : get_file_url('video/m_0001/1쿼터/team.mp4'),
    "full" : get_file_url('video/m_0001/1쿼터/full.mp4'),
    "highlight" : get_file_url('video/m_0001/1쿼터/full.mp4')
}

thumnails = [
    get_file_url('video/thumbnail/thumbnail1.png'), 
    get_file_url('video/thumbnail/thumbnail2.png'), 
    get_file_url('video/thumbnail/thumbnail3.png')
]

class getVideoSummation(APIView):
    def post(self, request):
        user_code = request.data.get('user_code')

        if user_code is None:
            return Response({'error': 'Missing required field: user_code'}, status=400)
        
        if not UserInfo.objects.filter(user_code = user_code).exists():
            return Response({'error': f'user_code({user_code})에 해당하는 유저가 존재하지 않습니다.'})
        
        player_videos = VideoInfo.objects.filter(user_code = user_code, type = 'player')
        
        user_matchs = UserMatch.objects.filter(user_code=user_code).values_list('match_code', flat=True)

        team_videos = VideoInfo.objects.filter(match_code__in=user_matchs, type='team')

        full_videos = VideoInfo.objects.filter(match_code__in=user_matchs, type='full')

        if is_super_user(user_code):
            player_videos = VideoInfo.objects.filter(type = 'player')

            team_videos = VideoInfo.objects.filter(type='team')

            full_videos = VideoInfo.objects.filter(type='full')

        player_videos_number = player_videos.count()
        
        team_videos_number = len(team_videos)

        full_videos_number = len(full_videos)
        
        result = {
            "player_cam" : {
                "thumbnail" : thumnails,
                "number_of_videos" : player_videos_number
            },
            "team_cam" : {
                "thumbnail" : thumnails,
                "number_of_videos" : team_videos_number
            },
            "full_cam" : {
                "thumbnail" : thumnails,
                "number_of_videos" : full_videos_number
            },
            "highlight_cam" : {
                "thumbnail" : thumnails,
                "number_of_videos" : 0
            }
        }

        return Response(result)

class getPlayerVideoList(APIView):
    def post(self, request):
        user_code = request.data.get('user_code')

        if user_code is None:
            return Response({'error': 'Missing required field: user_code'}, status=400)
        
        if not UserInfo.objects.filter(user_code=user_code).exists():
            return Response({'error': f'user_code({user_code})에 해당하는 유저가 존재하지 않습니다.'})
        
        video_infos = VideoInfo.objects.filter(user_code=user_code, type='player')

        if is_super_user(user_code):
            video_infos = VideoInfo.objects.filter(type='player')

        # if not video_infos.exists():
        #     return self.returnExampleData()
        
        serializer = Video_List_Serializer(video_infos, many = True)

        return Response({'result' : serializer.data})

    def returnExampleData(self):
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

        return Response({'result':result})

class getTeamVideoList(APIView):
    def post(self, request):
        user_code = request.data.get('user_code')

        if user_code is None:
            return Response({'error': 'Missing required field: user_code'}, status=400)
        
        try:
            user_info = UserInfo.objects.get(user_code=user_code)
        except UserInfo.DoesNotExist:
            return Response({'error': f'user_code({user_code})에 해당하는 유저가 존재하지 않습니다.'})

        user_matches = UserMatch.objects.filter(user_code=user_code).values_list('match_code', flat=True)

        team_videos = VideoInfo.objects.filter(match_code__in=user_matches, type='team')

        if is_super_user(user_code):
            team_videos = VideoInfo.objects.filter(type='team')

        # if not team_videos.exists():
        #     return self.returnExampleData()

        serializer = Video_List_Serializer(team_videos, many=True)

        result = serializer.data

        return Response({"result" : result})
        
    def returnExampleData(self):
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

        return Response({'result':result})

class getFullVideoList(APIView):
    def post(self, request):
        user_code = request.data.get('user_code')

        if user_code is None:
            return Response({'error': 'Missing required field: user_code'}, status=400)
        
        try:
            user_info = UserInfo.objects.get(user_code=user_code)
        except UserInfo.DoesNotExist:
            return Response({'error': f'user_code({user_code})에 해당하는 유저가 존재하지 않습니다.'})

        user_matches = UserMatch.objects.filter(user_code=user_code).values_list('match_code', flat=True)

        full_videos = VideoInfo.objects.filter(match_code__in=user_matches, type='full')

        if is_super_user(user_code):
            full_videos = VideoInfo.objects.filter(type='full')

        # if not full_videos.exists():
        #     return self.returnExampleData()
        
        serializer = Video_List_Serializer(full_videos, many=True)

        result = serializer.data

        return Response({"result" : result})
        
    
    def returnExampleData(self):
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

        return Response({'result':result})

class getHighlightVideoList(APIView):
    def post(self, request):
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

        return Response({'result':[]})

class getMatchVideoInfo(APIView):
    def post(self, request):
        data = request.data.copy()

        required_fields = ['match_code', 'type']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if field not in data}
        if errors:
            return Response(errors, status=400)
        
        type = data['type']
        types = ['player', 'team', 'full', 'highlight']

        if type not in types :
            return Response({'error':'type이 올바르지 않습니다.'}, status=400)        
        
        match_code = data['match_code']
        user_code = data.get('user_code')
            
        video_info = VideoInfo.objects.filter(match_code=match_code, type=type)

        if type == 'player':
            if user_code is None:
                return Response({"error" : f"type이 {type}인 경우 user_code는 필수입니다."}, status=400)
            if not is_super_user(user_code):
                video_info = video_info.filter(user_code=user_code)

        if not video_info.exists():
            return Response({'error':'해당 영상이 존재하지 않습니다.'}, status=400)
            # return self.returnExampleData(type=type)

        video_info = video_info.first()
        match_location = ""

        match_info = TeamMatchInfo.objects.get(match_code=match_code)
        if not match_info:
            match_info = get_object_or_404(UserMatchInfo, match_code=match_code)
            
        video_title = video_info.title
        
        match_date = video_info.date

        result = []

        for quarter in video_info.quarter_name_list:
            url = video_info.path.get(quarter)
            thumnail = thumbnail_url(extract_video_id(url))
            if thumnail is None:
                thumnail = thumnails[0]
            video_json = {
                "quarter" : quarter,
                "title" : video_title,
                "match_location" : match_location,
                "date" : match_date,
                "thumbnail" : thumnail,
                # "link" : get_link(video_info, quarter),
                # "download_link" : get_download_link(video_info, quarter)
                "link" : video_info.path.get(quarter),
                "download_link" : ""
            }
            result.append(video_json)
            
        # serializer = Video_Info_Serializer(video_info)

        return Response({'result':result})
    
    def returnExampleData(self, type):
        result = [
                {
                    "quarter" : "1쿼터",
                    "video_code" : "v_0001",
                    "title" : "인하대학교 FC",
                    "match_location" : "인하대운동장",
                    "date" : "2024-11-20",
                    "thumbnail" : thumnails[0],
                    "link" : link[type],
                    "download_link" : download_link[type]
                },
                {
                    "quarter" : "2쿼터",
                    "video_code" : "v_0002",
                    "title" : "인하대학교 FC",
                    "match_location" : "인하대운동장",
                    "date" : "2024-11-20",
                    "thumbnail" : thumnails[1],
                    "link" : link[type],
                    "download_link" : download_link[type]
                },
                {
                    "quarter" : "3쿼터",
                    "video_code" : "v_0003",
                    "title" : "인하대학교 FC",
                    "match_location" : "인하대운동장",
                    "date" : "2024-11-20",
                    "thumbnail" : thumnails[2],
                    "link" : link[type],
                    "download_link" : download_link[type]
                },
	        ]
        
        return Response({'result' : result})
