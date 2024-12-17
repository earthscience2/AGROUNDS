from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from DB.models import MatchInfo
from rest_framework.generics import get_object_or_404

from staticfiles.get_file_url import get_file_url

from .serializers import *

class getMatchList(APIView):
    def post(self, response):
        user_code = response.data.get('user_code')

        if user_code is None:
            return Response({'error': 'Missing required field: user_code'}, status=400)
        
        if not UserInfo.objects.filter(user_code=user_code).exists():
            return Response({'error': f'user_code({user_code})에 해당하는 유저가 존재하지 않습니다.'})
        
        default_team_logo = get_file_url('img/teamlogo/default-team-logo.png')
        
        result = [
                    {
                        "match_code" : "m_0001",
                        "match_schedule" : "2024-10-10",
                        "match_location" : "인하대운동장",
                        "thumbnail" : "https://aws.s3...",
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
                        "match_code" : "m_0002",
                        "match_schedule" : "2024-10-11",
                        "match_location" : "부천축구경기장",
                        "thumbnail" : "https://aws.s3...",
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
                        "thumbnail" : "https://aws.s3...",
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
                        "match_code" : "m_0001",
                        "match_schedule" : "2024-10-10",
                        "match_location" : "인하대운동장",
                        "thumbnail" : "https://aws.s3...",
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
                        "match_code" : "m_0002",
                        "match_schedule" : "2024-10-11",
                        "match_location" : "부천축구경기장",
                        "thumbnail" : "https://aws.s3...",
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
                        "thumbnail" : "https://aws.s3...",
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
        
        default_team_logo = get_file_url('img/teamlogo/default-team-logo.png')
        
        result = [
            {
                "match_code" : "m_0001",
                "match_schedule" : "2024-10-10",
                "match_location" : "인하대운동장",
                "thumbnail" : "https://aws.s3...",
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
                "match_code" : "m_0002",
                "match_schedule" : "2024-10-12",
                "match_location" : "부천축구경기장",
                "thumbnail" : "https://aws.s3...",
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
                "match_code" : "m_0003",
                "match_schedule" : "2024-10-13",
                "match_location" : "대야미월드컵경기장",
                "thumbnail" : "https://aws.s3...",
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
                "match_code" : "m_0001",
                "match_schedule" : "2024-10-10",
                "match_location" : "인하대운동장",
                "thumbnail" : "https://aws.s3...",
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
                "match_code" : "m_0002",
                "match_schedule" : "2024-10-12",
                "match_location" : "부천축구경기장",
                "thumbnail" : "https://aws.s3...",
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
                "match_code" : "m_0003",
                "match_schedule" : "2024-10-13",
                "match_location" : "대야미월드컵경기장",
                "thumbnail" : "https://aws.s3...",
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
    
