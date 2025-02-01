from decimal import Decimal
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response
import json
import os
from django.conf import settings

from staticfiles.s3 import CloudFrontTxtFileReader
from .serializers import *

from staticfiles.get_file_url import get_base_url
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

        user_anal_match = UserAnalMatch.objects.filter(match_code=match_code, user_code=user_code)

        user_anal_match = sorted(
            user_anal_match,
            key=lambda x: (0 if x.quarter_name == "전반전" else 1, x.quarter_name),
        )
        
        result = {}

        file_key = makeGptJosnKey(match_code, user_code)

        reader = CloudFrontTxtFileReader(get_base_url())
        file_content = reader.read(file_key)
        json_data = {
            "total" : "",
            "attack" : "",
            "defense" : ""
        }
        if file_content:
            json_data = json.loads(file_content)

        result['ai_summation'] = json_data

        serializer = Match_Analyze_Result_Serializer(user_anal_match, many=True)

        result['analyze'] = serializer.data

        return Response(result)

        # filename = ['analyze.json', 'analyze2.json', 'analyze3.json']

        # with open(os.path.join(settings.STATIC_ROOT, filename[self.map_string_to_number(match_code)]), encoding='utf-8') as file:
        #     data = json.load(file)
        #     return Response(data)
        
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
        user_code = request.data.get('user_code')

        result = []

        team_match_info = get_object_or_404(TeamMatchInfo, match_code=match_code)

        user_anal_matchs = UserAnalMatch.objects.filter(match_code=match_code)

        if user_code is not None:
            if not user_anal_matchs.filter(user_code=user_code).exists():
                return Response({"error" : "해당 경기에 참여하지 않았습니다."})

        for quarter in team_match_info.quarter_name_list :
            user_anal_matchs_in_quarter = user_anal_matchs.filter(quarter_name=quarter)

            quarter_data = {}
            quarter_data['quarter'] = quarter

            total = {}
            total['top_players'] = self.get_top_players(user_anal_matchs_in_quarter)
            
            user_anal_match = (
                user_anal_matchs_in_quarter.filter(user_code=user_code).first()
                if user_code is not None
                else None
            )

            total['my_rankings'] = self.get_my_rankings(user_anal_matchs_in_quarter, user_anal_match)

            quarter_data['total'] = total

            point = {}
            point_ranking = []

            anal_match_sorted_by_point = self.sort_by_target(user_anal_matchs_in_quarter, 'point_total')
            for anal_match in anal_match_sorted_by_point:
                point_ranking.append(self.get_player_info(anal_match, 'point_total'))

            point['point_ranking'] = point_ranking

            quarter_data['point'] = point

            result.append(quarter_data)

        

        serializer = Match_Analyze_Result_Serializer(user_anal_matchs, many=True)

        return Response({"result" : result})
        
        filename = 'team_analyze.json'

        with open(os.path.join(settings.STATIC_ROOT, filename), encoding='utf-8') as file:
            data = json.load(file)
            return Response(data)

    def get_value_by_target(self, user_match_result, target):
        return ( user_match_result.point[target.split('_')[1]] if target.startswith('point_')
                else getattr(user_match_result, target, 0))

    def sort_by_target(self, analyze_result, target):
        analyze_result_sorted_by_target = sorted(
            analyze_result,
            key=lambda x: self.get_value_by_target(x, target),
            reverse=True
        )
        return analyze_result_sorted_by_target

    def get_player_info(self, user_anal_match, target):
        profile = default_team_logo
        user_code = nickname = value = position = '-'

        if user_anal_match is not None:
            user_code = user_anal_match.user_code
            value = self.get_value_by_target(user_anal_match, target)
            position = user_anal_match.position

        result = {
            "profile" : profile,
            "nickname" : nickname,
            "value" : value,
            "position" : position
        }
        if user_code == '-':
            return result
        try:
            user_info = UserInfo.objects.get(user_code=user_code)
            # result['profile'] = '-'
            result['nickname'] = user_info.user_nickname
            return result
        except UserInfo.DoesNotExist:
            return result
        
    def get_top_player_info(self, user_anal_matchs_in_quarter, target):
        analyze_result_sorted_by_target = self.sort_by_target(user_anal_matchs_in_quarter, target)
        top_player = analyze_result_sorted_by_target[0] if analyze_result_sorted_by_target else None
        return self.get_player_info(top_player, target)

    def get_top_players(self, user_anal_matchs_in_quarter):
        top_players = {}

        top_players['top_point'] = self.get_top_player_info(user_anal_matchs_in_quarter, 'point_total')
        top_players['top_activity'] = self.get_top_player_info(user_anal_matchs_in_quarter, 'T_D')
        top_players['top_sprint'] = self.get_top_player_info(user_anal_matchs_in_quarter, 'T_S')
        top_players['top_sprint'] = self.get_top_player_info(user_anal_matchs_in_quarter, 'T_S')
        top_players['top_speed'] = self.get_top_player_info(user_anal_matchs_in_quarter, 'T_HS')

        return top_players
    
    def get_my_rankings(self, user_anal_matchs_in_quarter, user_anal_match):
        my_rankings = {}
        attributes = ['point', 'activity', 'sprint', 'speed']
        targets = ['point_total', 'T_D', 'T_S', 'T_HS']

        for attribute in attributes:
            my_rankings[attribute] = {
                "value" : "-",
                "rank" : "-"
            }

        if user_anal_match is None:
           return my_rankings
        
        for attribute, target in zip(attributes, targets):
            value = self.get_value_by_target(user_anal_match, target)
            sorted_data = self.sort_by_target(user_anal_matchs_in_quarter, target)
            rank = next(
                (index + 1 for index, match in enumerate(sorted_data) if match == user_anal_match),
                "-"
            )
            # 결과 저장
            my_rankings[attribute] = {
                "value": value,
                "rank": rank
            }

        return my_rankings

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
