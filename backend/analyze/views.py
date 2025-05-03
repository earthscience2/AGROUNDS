from decimal import Decimal
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response
from collections import defaultdict
import json
import os
from django.conf import settings

from staticfiles.s3 import CloudFrontTxtFileReader
from .serializers import *

from staticfiles.get_file_url import get_base_url
from staticfiles.super_user import is_super_user

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

        if is_super_user(user_code):
            user_anal_match = UserAnalMatch.objects.filter(match_code=match_code)
            user_code = user_anal_match.first().user_code

        if not user_anal_match.exists():
            # filename = ['analyze.json', 'analyze2.json', 'analyze3.json']
            # with open(os.path.join(settings.STATIC_ROOT, filename[self.map_string_to_number(match_code)]), encoding='utf-8') as file:
            #     data = json.load(file)
            #     return Response(data)
            return Response({'error':'데이터가 없습니다.'}, status=404)

        user_anal_match = sorted(
            user_anal_match,
            key=lambda x: (0 if x.quarter_name == "전반전" else 1, x.quarter_name),
        )
        
        result = {}

        file_key = makeGptJosnKey(match_code, user_code)

        json_data = {
                "total" : "",
                "attack" : "",
                "defense" : ""
            }
        
        try:
            reader = CloudFrontTxtFileReader(get_base_url())
            file_content = reader.read(file_key)
            if file_content:
                json_data = json.loads(file_content)
        except Exception as e:
            print("gpt.json 파일 가져오기 실패")
    
        result['ai_summation'] = json_data

        serializer = Match_Analyze_Result_Serializer(user_anal_match, many=True)

        result['analyze'] = serializer.data

        return Response(result)
            
    def map_string_to_number(self, input_string):
        if len(input_string) > 45:
            raise ValueError("입력 문자열은 45자 이하여야 합니다.")

        # 문자열 해시값을 계산하고 0, 1, 2 중 하나로 매핑
        mapped_number = hash(input_string) % 3
        return mapped_number

class getTeamAnalyzeResult(APIView):
    def post(self, request):
        data = request.data.copy()

        required_fields = ['match_code', 'user_code']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if field not in data}
        if errors:
            return Response(errors, status=400)
        
        match_code = data['match_code']
        # team_code = data['team_code']
        user_code = request.data.get('user_code')

        result = []

        try:
            team_match_info = TeamMatchInfo.objects.get(match_code=match_code)
        except TeamMatchInfo.DoesNotExist:
            return Response({'error' : '데이터가 없습니다.'}, status=404)
            # return self.returnExampleData()

        match_code_list = team_match_info.match_code_list

        if not match_code_list:
            return Response({'error': '데이터가 없습니다.'}, status=404)
        
        user_anal_matchs = UserAnalMatch.objects.filter(match_code__in=match_code_list)

        if is_super_user(user_code):
            # 슈퍼 유저의 경우 경기에 참여한 임의의 선수의 user_code를 활용
            user_code = user_anal_matchs.first().user_code
        elif not user_anal_matchs.filter(user_code=user_code).exists():
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

            ranking = {}
            point_ranking = []

            anal_match_sorted_by_point = self.sort_by_target(user_anal_matchs_in_quarter, 'point_total')
            for anal_match in anal_match_sorted_by_point:
                point_ranking.append(self.get_player_info(anal_match, 'point_total'))

            activity_ranking = []

            anal_match_sorted_by_activity = self.sort_by_target(user_anal_matchs_in_quarter, 'point_positiveness')
            for anal_match in anal_match_sorted_by_activity:
                activity_ranking.append(self.get_player_info(anal_match, 'point_positiveness'))

            sprint_ranking = []
            anal_match_sorted_by_sprint = self.sort_by_target(user_anal_matchs_in_quarter, 'T_S')
            for anal_match in anal_match_sorted_by_sprint:
                sprint_ranking.append(self.get_player_info(anal_match, 'T_S'))


            speed_ranking = []
            anal_match_sorted_by_speed = self.sort_by_target(user_anal_matchs_in_quarter, 'T_HS')
            for anal_match in anal_match_sorted_by_speed:
                speed_ranking.append(self.get_player_info(anal_match, 'T_HS'))

            ranking['point_ranking'] = point_ranking
            ranking['activity_ranking'] = activity_ranking
            ranking['sprint_ranking'] = sprint_ranking
            ranking['speed_ranking'] = speed_ranking

            quarter_data['ranking'] = ranking

            result.append(quarter_data)

        return Response({"result" : result})
    
    def returnExampleData(self):
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
        result = {
            "profile" : profile,
            "nickname" : nickname,
            "value" : value,
            "position" : position
        }

        if user_anal_match is None:
            return result
        
        user_code = user_anal_match.user_code
        value = self.get_value_by_target(user_anal_match, target)
        position = user_anal_match.position

        try:
            user_info = UserInfo.objects.get(user_code=user_code)
            # result['profile'] = ''
            result['nickname'] = user_info.user_nickname
            if not position:
                result['position'] = user_info.user_position
            result['value'] = value
            
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
        
        user_code = data['user_code']

        records = UserAnalMatch.objects.filter(user_code=user_code)
        if is_super_user(user_code):
            records = UserAnalMatch.objects.all()

        match_groups = defaultdict(list)
        for r in records:
            match_groups[r.match_code].append(r)

        match_summary = []
        for match_code, group in match_groups.items():
            latest_record = max((r for r in group if r.start), key=lambda x: x.start, default=None)
            if latest_record:
                match_summary.append((match_code, latest_record.start, group))

        match_summary.sort(key=lambda x: x[1])
        recent_matches = match_summary[-5:]

        total_point = defaultdict(list)
        attack_trend = []
        defense_trend = []
        point_trend_recent = []

        for match_code, latest_start, match_list in recent_matches:
            a_tpt_list = []
            d_tpt_list = []
            match_points = []

            for record in match_list:
                if record.point:
                    for k, v in record.point.items():
                        total_point[k].append(v)
                        match_points.append(v)  # 전체 합에도 반영
                if record.A_TPT is not None:
                    a_tpt_list.append(record.A_TPT)
                if record.D_TPT is not None:
                    d_tpt_list.append(record.D_TPT)

            # attack/defense trend
            if a_tpt_list:
                attack_trend.append(round(sum(a_tpt_list) / len(a_tpt_list), 2))
            if d_tpt_list:
                defense_trend.append(round(sum(d_tpt_list) / len(d_tpt_list), 2))

            # point trend
            if match_points:
                match_point_avg = round(sum(match_points) / len(match_points), 2)
                point_trend_recent.append({
                    "team_logo": default_team_logo,
                    "match_date": latest_start.strftime("%Y-%m-%d"),
                    "point": match_point_avg
                })

        # point 전체 평균
        all_points = defaultdict(list)
        for r in records:
            if r.point:
                for k, v in r.point.items():
                    all_points[k].append(v)
        avg_point = {k: round(sum(v)/len(v), 2) for k, v in all_points.items()}

        # point_trend 평균
        all_match_points = [entry["point"] for entry in point_trend_recent]
        average_point = round(sum(all_match_points) / len(all_match_points), 2) if all_match_points else 0

        def pad_trend(trend_list):
            return [0] * (5 - len(trend_list)) + trend_list if len(trend_list) < 5 else trend_list

        return Response({
            "point": avg_point,
            "attack_trend": pad_trend(attack_trend),
            "defense_trend": pad_trend(defense_trend),
            "point_trend": {
                "recent_match": point_trend_recent,
                "average_point": average_point
            }
        })
        

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
        
        return Response({"error" : "데이터가 존재하지 않습니다."}, status=404)
    
    
