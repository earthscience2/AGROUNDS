from rest_framework.views import APIView
from rest_framework.response import Response
from staticfiles.make_code import make_code
from staticfiles.get_file_url import get_upload_url

from staticfiles.get_file_url import get_file_url

from staticfiles.super_user import is_super_user

from .serializers import *

class getUserMatchList(APIView):
    def post(self, response):
        user_code = response.data.get('user_code')

        if user_code is None:
            return Response({'error': 'Missing required field: user_code'}, status=400)
        
        if not UserInfo.objects.filter(user_code=user_code).exists():
            return Response({'error': f'user_code({user_code})에 해당하는 유저가 존재하지 않습니다.'})
        
        match_codes = UserMatch.objects.filter(user_code=user_code, match_type="player").values_list('match_code', flat=True)
        
        if is_super_user(user_code):
            match_codes = UserMatch.objects.filter(match_type="player").values_list('match_code', flat=True)

        user_matchs = UserMatchInfo.objects.filter(match_code__in=match_codes)

        # if not user_matchs.exists():
        #     return self.returnExampleData()
        
        serializer = User_Match_Info_Serializer(instance=user_matchs, user_code=user_code, many=True)

        return Response({'result' : serializer.data})
        
    def returnExampleData(self):
        default_team_logo = get_file_url('img/teamlogo/default-team-logo.png')
        default_thumbnail = get_file_url('video/thumbnail/thumbnail1.png')
        
        result = [
                    {
                        "match_code" : "m_0001",
                        "match_schedule" : "2024-10-16",
                        "match_location" : "인하대운동장",
                        "thumbnail" : default_thumbnail,
                        "match_title" : "인하대학교 FC",
                        "match_time" : "20",
                        "distance" : "1.89",
                        "top_speed" : "25",
                        "rating" : "7.3",
                        "home_team" : "t_0001",
                        "home_team_logo" : default_team_logo,
                        "away_team" : "t_0002",
                        "away_team_logo" : default_team_logo
                    },
                    {
                        "match_code" : "m_0005",
                        "match_schedule" : "2024-10-14",
                        "match_location" : "부천축구경기장",
                        "thumbnail" : default_thumbnail,
                        "match_title" : "동백 FC",
                        "match_time" : "20",
                        "distance" : "1.89",
                        "top_speed" : "25",
                        "rating" : "7.3",
                        "home_team" : "t_0001",
                        "home_team_logo" : default_team_logo,
                        "away_team" : "t_0003",
                        "away_team_logo" : default_team_logo
                    },
                    {
                        "match_code" : "m_0003",
                        "match_schedule" : "2024-10-12",
                        "match_location" : "대야미월드컵경기장",
                        "thumbnail" : default_thumbnail,
                        "match_title" : "FC 제주",
                        "match_time" : "20",
                        "distance" : "1.89",
                        "top_speed" : "25",
                        "rating" : "7.3",
                        "home_team" : "t_0001",
                        "home_team_logo" : default_team_logo,
                        "away_team" : "t_0004",
                        "away_team_logo" : default_team_logo
                    },
                    {
                        "match_code" : "m_4213",
                        "match_schedule" : "2024-10-10",
                        "match_location" : "인하대운동장",
                        "thumbnail" : default_thumbnail,
                        "match_title" : "인하대학교 FC",
                        "match_time" : "20",
                        "distance" : "1.89",
                        "top_speed" : "25",
                        "rating" : "7.3",
                        "home_team" : "t_0001",
                        "home_team_logo" : default_team_logo,
                        "away_team" : "t_0002",
                        "away_team_logo" : default_team_logo
                    },
                    {
                        "match_code" : "m_5434",
                        "match_schedule" : "2024-09-14",
                        "match_location" : "부천축구경기장",
                        "thumbnail" : default_thumbnail,
                        "match_title" : "동백 FC",
                        "match_time" : "20",
                        "distance" : "1.89",
                        "top_speed" : "25",
                        "rating" : "7.3",
                        "home_team" : "t_0001",
                        "home_team_logo" : default_team_logo,
                        "away_team" : "t_0003",
                        "away_team_logo" : default_team_logo
                    },
                    {
                        "match_code" : "m_5432",
                        "match_schedule" : "2024-08-15",
                        "match_location" : "대야미월드컵경기장",
                        "thumbnail" : default_thumbnail,
                        "match_title" : "FC 제주",
                        "match_time" : "20",
                        "distance" : "1.89",
                        "top_speed" : "25",
                        "rating" : "7.3",
                        "home_team" : "t_0001",
                        "home_team_logo" : default_team_logo,
                        "away_team" : "t_0004",
                        "away_team_logo" : default_team_logo
                    }
                ]

        return Response({'result' : result})

class getTeamMatchList(APIView):
    def post(self, response):
        team_code = response.data.get('team_code')
        
        if team_code is None:
            return Response({'error': 'Missing required field: team_code'}, status=400)
        
        if not TeamInfo.objects.filter(team_code=team_code).exists():
            return Response({'error': f'team_code({team_code})에 해당하는 팀이 존재하지 않습니다.'})
        
        match_codes = TeamMatch.objects.filter(team_code = team_code).values_list('match_code', flat=True)
        team_matchs = TeamMatchInfo.objects.filter(match_code__in = match_codes)

        # if not team_matchs.exists():
        #     return self.returnExampleData()

        serializer = Team_Match_Info_Serializer(team_matchs, many = True)

        return Response({'result' : serializer.data})
        
    def returnExampleData(self):
        default_team_logo = get_file_url('img/teamlogo/default-team-logo.png')
        default_thumbnail = get_file_url('video/thumbnail/thumbnail1.png')
        
        result = [
            {
                "match_code" : "m_0001",
                "match_schedule" : "2025-01-01",
                "match_location" : "인하대운동장",
                "thumbnail" : default_thumbnail,
                "match_title" : "인하대학교 FC",
                "match_time" : 20,
                "match_mom" : "김민재",
                "match_result" : "승",
                "participation" : 13,
                "home_team" : "t_0001",
                "home_team_logo" : default_team_logo,
                "away_team" : "t_0002",
                "away_team_logo" : default_team_logo
            },
            {
                "match_code" : "m_0005",
                "match_schedule" : "2024-12-12",
                "match_location" : "부천축구경기장",
                "thumbnail" : default_thumbnail,
                "match_title" : "동백 FC",
                "match_time" : 19,
                "match_mom" : "손흥민",
                "match_result" : "승",
                "participation" : 13,
                "home_team" : "t_0001",
                "home_team_logo" : default_team_logo,
                "away_team" : "t_0002",
                "away_team_logo" : default_team_logo
            },
            {
                "match_code" : "m_4213",
                "match_schedule" : "2024-12-01",
                "match_location" : "대야미월드컵경기장",
                "thumbnail" : default_thumbnail,
                "match_title" : "FC 제주",
                "match_time" : 40,
                "match_mom" : "문소영",
                "match_result" : "패",
                "participation" : 3,
                "home_team" : "t_0001",
                "home_team_logo" : default_team_logo,
                "away_team" : "t_0002",
                "away_team_logo" : default_team_logo
            },
            {
                "match_code" : "m_6414",
                "match_schedule" : "2024-11-10",
                "match_location" : "인하대운동장",
                "thumbnail" : default_thumbnail,
                "match_title" : "인하대학교 FC",
                "match_time" : 20,
                "match_mom" : "김민재",
                "match_result" : "승",
                "participation" : 13,
                "home_team" : "t_0001",
                "home_team_logo" : default_team_logo,
                "away_team" : "t_0002",
                "away_team_logo" : default_team_logo
            },
            {
                "match_code" : "m_3214",
                "match_schedule" : "2024-10-01",
                "match_location" : "부천축구경기장",
                "thumbnail" : default_thumbnail,
                "match_title" : "동백 FC",
                "match_time" : 19,
                "match_mom" : "손흥민",
                "match_result" : "승",
                "participation" : 13,
                "home_team" : "t_0001",
                "home_team_logo" : default_team_logo,
                "away_team" : "t_0002",
                "away_team_logo" : default_team_logo
            },
            {
                "match_code" : "m_6943",
                "match_schedule" : "2024-09-01",
                "match_location" : "대야미월드컵경기장",
                "thumbnail" : default_thumbnail,
                "match_title" : "FC 제주",
                "match_time" : 40,
                "match_mom" : "문소영",
                "match_result" : "패",
                "participation" : 3,
                "home_team" : "t_0001",
                "home_team_logo" : default_team_logo,
                "away_team" : "t_0002",
                "away_team_logo" : default_team_logo
            }
	    ]

        return Response({'result' : result})

class getUploadUrl(APIView):
    def post(self, request):
        user_code = request.data.get('user_code')
        
        if user_code is None:
            return Response({'error': 'Missing required field: user_code'}, status=400)
        
        match_code = make_code('m')
        url = get_upload_url(f'gps/{match_code}/{user_code}/')

        return Response({'match_code' : match_code, 'url' : url})