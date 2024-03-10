from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.forms.models import model_to_dict


# DB 불러오기
from DB.models import LeagueInfo
from .serializers import League_main_page
from DB.models import TeamInfo
from team.serializers import Team_main_page
from DB.models import PlayerInfo
from player.serializers import Player_main_page
from DB.models import MatchInfo
from match.serializers import Match_main_page
from DB.models import UserInfo
from user.serializers import User_main_page

# 기타 함수
from datetime import datetime

# 초기변수
status_priority = {
            "모집전": 1,
            "모집중": 2,
            "진행전": 3,
            "진행중": 4,
            "종료": 5,
            "상태 미정": 6
            }

# 주요함수
def determine_league_status(league):
    today = datetime.now().date()
    league_startjoin = datetime.strptime(league.league_startjoin, '%Y-%m-%d').date()
    league_endjoin = datetime.strptime(league.league_endjoin, '%Y-%m-%d').date()
    league_startdate = datetime.strptime(league.league_startdate, '%Y-%m-%d').date()
    league_enddate = datetime.strptime(league.league_enddate, '%Y-%m-%d').date()
    
    if league_startjoin <= today <= league_endjoin:
        return "모집중"
    elif today < league_startjoin:
        return "모집전"
    elif league_endjoin <= today <= league_startdate:
        return "진행전"
    elif league_startdate <= today <= league_enddate:
        return "진행중"
    elif today > league_enddate:
        return "종료"

    return "상태 미정"


# API 코드 ====================================

# 리그 전체 불러오기
class LeagueMain(APIView):
    def get(self, request):
        league_info = LeagueInfo.objects.all()
        return_value = []
        for league in league_info:
            league_data = League_main_page(league).data
            return_value.append(league_data)
        return Response(return_value)

# 리그 전체 불러오기
class TestMain(APIView):
    def get(self, request):
        league_info = UserInfo.objects.all()
        return_value = []
        for league in league_info:
            league_data = User_main_page(league).data
            return_value.append(league_data)
        return Response(return_value)
    
# 리그 생성하기
class makeleague(APIView):
    def post(self, request, *args, **kwargs):
        serializer = League_main_page(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 리그 검색하기
class searchleague(APIView):
    def get(self, request, format=None):
        
        word = request.query_params.get("word", "")
        local = request.query_params.get("local", "")
        requested_status = request.query_params.get("type", "").lower()

        query = Q()
        if word:
            query &= Q(league_name__icontains=word)
        if local:
            query &= Q(league_area__icontains=local)

        leagues = LeagueInfo.objects.filter(query)
        filtered_leagues = []
        for league in leagues:
            league_status = determine_league_status(league).lower()  # 상태 결정 함수 사용
            league_data = League_main_page(league).data
            league_data['status'] = league_status  # 상태 정보 추가
            league_data['team_count'] = len(league.league_team) if league.league_team else 0  # 팀 수 추가
            league_data['status_priority'] = status_priority.get(league_status, 5)
            
            # 요청된 상태가 있으면 해당 상태에 맞는 리그만 추가
            if requested_status:
                if league_status == requested_status:
                    filtered_leagues.append(league_data)
            else:
                filtered_leagues.append(league_data)
                
        filtered_leagues.sort(key=lambda x: x['status_priority'])
        for league in filtered_leagues:
            league.pop('status_priority', None)
        return Response(filtered_leagues, status=status.HTTP_200_OK)
    
# 리그 지역정보 불러오기
# daily DB정보에서 불러오기
class localleague(APIView):
    def get(self, request, format=None):
        areas = ["전국", "서울특별시", "인천광역시", "대전광역시", "대구광역시",
                 "울산광역시","부산광역시","광주광역시","경기도","강원도","충청북도",
                 "충청남도","경상북도","전라북도","전라남도","세종특별자치시","제주특별자치도"]
        results = []

        for area in areas:
            leagues = LeagueInfo.objects.filter(league_area__iexact=area)
            area_stats = {
                "area": area,
                "total_teams": 0,
                "join_leagues": 0,
                "live_leagues": 0
            }

            for league in leagues:
                status1 = determine_league_status(league)
                if status1 == "모집중":
                    area_stats["join_leagues"] += 1
                elif status1 == "진행중":
                    area_stats["live_leagues"] += 1
                
                # 참가 팀 수를 계산합니다.
                if league.league_team:
                    area_stats["total_teams"] += len(league.league_team)

            results.append(area_stats)

        return Response(results, status=status.HTTP_200_OK)
    
# 리그 상세정보 불러오기
class detailleague(APIView):
    def get(self, request, format=None):
        code = request.query_params.get("code", "")
        try:
            league = LeagueInfo.objects.get(league_code=code)
            serializer = League_main_page(league)
            league_data = serializer.data
            league_data.pop('league_host', None)
            league_data.pop('league_startdate', None)
            league_data.pop('league_enddate', None)
            league_data.pop('league_startjoin', None)
            league_data.pop('league_endjoin', None)
            league_data.pop('league_team', None)
            league_data.pop('league_endjoin', None)
            league_data.pop('league_endjoin', None)
            
            if league_data.get('league_gametype', 'Not specified') == 'league_p':
                league_data['league_gametype_kr'] = '포인트리그'
                
            if league_data.get('league_gametype', 'Not specified') == 'league':
                league_data['league_gametype_kr'] = '일반리그'
                
            league_data['teams'] = []
            for team_code in league.league_code or []:
                try:
                    team = TeamInfo.objects.get(team_code=team_code)
                    serializer = Team_main_page(team)
                    team_data = serializer.data
                    team_data.pop('team_host', None)  
                    team_data.pop('team_player', None)
                    team_data.pop('team_area', None)
                    team_data.pop('team_description', None)
                    team_data.pop('team_5_match', None)
                    team_data.pop('team_tier', None)
                    team_data.pop('team_games', None)
                    
                    league_data['teams'].append(team_data)  
                except TeamInfo.DoesNotExist:
                    continue  # 팀 정보가 없는 경우 건너뜁니다.
                
            league_data['matches'] = []
            try:
                match = MatchInfo.objects.get(match_official=code)
                serializer = Match_main_page(match)
                match_data = serializer.data
                
                league_data['matches'].append(match_data)  
                
            except MatchInfo.DoesNotExist:
                league_data['matches'] = []
                
            return Response(league_data, status=status.HTTP_200_OK)
        except LeagueInfo.DoesNotExist:
            return Response({"error": "League not found"}, status=status.HTTP_404_NOT_FOUND)