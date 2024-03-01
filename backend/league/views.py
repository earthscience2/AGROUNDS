from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import LeagueInfo
from .serializers import League_info_Serializer
from django.db.models import Q

from datetime import datetime

class makeleague(APIView):
    """
    json 형식
    { 
    "league_host": "u_1sa880533r6rc7", 
    "league_name": "u_1sa880533r6rc7",
    "league_startdate": "2024-02-10",
    "league_enddate": "2024-05-10",
    "league_startjoin": "2024-01-01",
    "league_endjoin": "2024-02-01", 
    "league_team": ["m_1sa882t2qlvaam"],
    "league_area": "test_area",
    "league_logo": "test_logo", 
    "league_winner": "test_winner",
    "league_gametype": "test_gametype",s
    "league_official": "test_official",
    "league_description": "test_description"
    }

    """
    def post(self, request, *args, **kwargs):
        serializer = League_info_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
def determine_league_status(league):
    
    # 현재 날짜를 가져옵니다.
    today = datetime.now().date()
    league_startjoin = datetime.strptime(league.league_startjoin, '%Y-%m-%d').date()
    league_endjoin = datetime.strptime(league.league_endjoin, '%Y-%m-%d').date()
    league_startdate = datetime.strptime(league.league_startdate, '%Y-%m-%d').date()
    league_enddate = datetime.strptime(league.league_enddate, '%Y-%m-%d').date()
    
    # 리그 상태를 결정합니다.
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
        
        status_priority = {
            "모집전": 1,
            "모집중": 2,
            "진행전": 3,
            "진행중": 4,
            "종료": 5,
            "상태 미정": 6
        }

        for league in leagues:
            league_status = determine_league_status(league).lower()  # 상태 결정 함수 사용
            league_data = League_info_Serializer(league).data
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
    
class localleague(APIView):
    def get(self, request, format=None):
        # 관심 있는 지역들을 지정합니다.
        areas = ["전국", "서울특별시", "인천광역시", "대전광역시", "대구광역시",
                 "울산광역시","부산광역시","광주광역시","경기도","강원도","충청북도",
                 "충청남도","경상북도","전라북도","전라남도","세종특별자치시","제주특별자치도"]
        results = []

        for area in areas:
            # 특정 지역에 해당하는 리그만 필터링합니다.
            leagues = LeagueInfo.objects.filter(league_area__iexact=area)
            area_stats = {
                "area": area,
                "total_teams": 0,
                "join_leagues": 0,
                "live_leagues": 0
            }

            for league in leagues:
                # 리그 상태를 결정합니다.
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