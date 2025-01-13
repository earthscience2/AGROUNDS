from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import json
import os
from django.conf import settings

from staticfiles.get_file_url import get_file_url
# Create your views here.

default_team_logo = get_file_url('img/teamlogo/default-team-logo.png')

class getAnalyzeResult(APIView):
    def post(self, request):
        data = request.data.copy()

        required_fields = ['match_code', 'user_code']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if field not in data}
        if errors:
            return Response(errors, status=400)
        
        match_code = data['match_code']
        user_code = data['user_code']

        filename = ['analyze.json', 'analyze2.json', 'analyze3.json']

        with open(os.path.join(settings.STATIC_ROOT, filename[self.map_string_to_number(match_code)]), encoding='utf-8') as file:
            data = json.load(file)
            return Response(data)
        
    def map_string_to_number(self, input_string):
        if len(input_string) > 45:
            raise ValueError("입력 문자열은 45자 이하여야 합니다.")

        # 문자열 해시값을 계산하고 0, 1, 2 중 하나로 매핑
        mapped_number = hash(input_string) % 3
        return mapped_number

class getTeamAnalyzeResult(APIView):
    def post(self, request):
        data = request.data.copy()

        required_fields = ['match_code', 'team_code']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if field not in data}
        if errors:
            return Response(errors, status=400)
        
        match_code = data['match_code']
        team_code = data['team_code']
        
        filename = 'team_analyze.json'

        with open(os.path.join(settings.STATIC_ROOT, filename), encoding='utf-8') as file:
            data = json.load(file)
            return Response(data)

class getOverall(APIView):
    def post(self, request):
        data = request.data.copy()

        required_fields = ['user_code']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if field not in data}
        if errors:
            return Response(errors, status=400)
        
        result = {
            "point": {
                "total": 6.7,
                "sprint": 6.1,
                "acceleration": 4.7,
                "speed": 7.9,
                "positiveness": 8.4,
                "stamina": 5.8,
            },
            "attack_trend": [4.5, 6.2, 4.9, 4.2, 7.3],
            "defense_trend": [3.1, 4.5, 5.5, 5.1, 4.7],
            "point_trend" : {
                "recent_match": [
                    {
                        "team_logo" : default_team_logo,
                        "match_date" : "2024-09-22",
                        "point" : 6.8
                    },
                    {
                        "team_logo" : default_team_logo,
                        "match_date" : "2024-09-10",
                        "point" : 8.7
                    },
                    {
                        "team_logo" : default_team_logo,
                        "match_date" : "2024-08-26",
                        "point" : 5.1
                    },
                ],
                "average_point" : 7.2
            }
        }

        return Response(result)
	
        
        