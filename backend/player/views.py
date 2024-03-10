from django.shortcuts import render
from django.http import JsonResponse
from django.core.paginator import Paginator

from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import PlayerInfo
from DB.models import UserInfo
from .serializers import *

import json
from django.forms.models import model_to_dict

from staticfiles.get_info import calculate_age

from drf_yasg.utils import swagger_auto_schema
from .swagger_parameters import *

# 플레이어 상세조회
class get_player_detail(APIView):
    """
    user_code로 선수 데이터를 불러옴

    json 형식
    {
        'user_code' : {string}
    }
    """
    @swagger_auto_schema(
        operation_summary="user_code로 선수 데이터를 불러옴",
        operation_description="user_code를 query_paramter로 받아 선수 데이터를 리턴해줘요",
        manual_parameters=get_player_detail_parameters,
        responses={
            200: "success",
            401: "닉네임을 입력하지 않았을 경우",
            404: "해당 유저가 존재하지 않는 경우",
        },
    )
    def get(self, request, *args, **kwargs):
        try:
            user_code = request.query_params.get("user_code")
            player = PlayerInfo.objects.get(user_code = user_code)
            user = UserInfo.objects.get(user_code = user_code)
        except PlayerInfo.DoesNotExist:
            return JsonResponse({'error': '해당 사용자가 존재하지 않습니다.'}, status=401)
        player = model_to_dict(player)
        player['user_name'] = user.user_name
        player['user_gender'] = user.user_gender
        return JsonResponse(player, status=200)

# 플레이어 수정
class edit_player(APIView):
    '''
    json 형식
    {
        'user_code' : {유저코드},
        'player_height' : 188,
        'player_weight' : 70,
        'player_area' : '서울특별시',
        'player_position' : 'CB',
        'player_description' : '안녕히계세요',
        'player_foot' : '5/1',
        'player_num' : 1,
        'player_team' : {팀코드},
    }
    '''
    def patch(self, request, *args, **kwargs):
        try:
            player = PlayerInfo.objects.get(user_code = request.data['user_code'])
        except PlayerInfo.DoesNotExist:
            return JsonResponse({'error': '해당 사용자가 존재하지 않습니다.'}, status=401)
        serializer = Player_Info_Serializer(player, data=request.data, partial = True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# 플레이어 검색
class searh_players(APIView):
    """
    모든 선수를 json을 원소로 가진 배열 형태로 불러옴
    """
    @swagger_auto_schema(
        operation_summary="position별 선수목록 조회 가능",
        operation_description="position별 선수목록 조회가 가능합니다. position을 입력하지 않으면 전체 선수 목록을 리턴합니다.",
        manual_parameters=searh_players_parameters,
    )
    def get(self, request, *args, **kwargs):
        position = request.query_params.get("position")
        query = Q()
        if position:
            query &= Q(player_position__icontains=position)
        try:
            all_players = PlayerInfo.objects.filter(query)
        except PlayerInfo.DoesNotExist:
            return JsonResponse({'error': '해당 사용자가 존재하지 않습니다.'}, status=401)
        
        page = request.query_params.get("page")
        paginator = Paginator(all_players, 10)
        
        if(page is None or int(page) < 1):
            page = 1
        elif (int(page) > paginator.num_pages):
            page = paginator.num_pages

        page_obj = paginator.page(page)

        serialized_data = []
        for idx, record in enumerate(page_obj):
            try:
                user = UserInfo.objects.get(user_code=record.user_code)
                user_name = getattr(user, 'user_name')
                age = calculate_age(getattr(user, 'user_birth'))
                user_gender = getattr(user, 'user_gender')
            except UserInfo.DoesNotExist:
                user_name = None

            serialized_data.append({
                'index' : idx,
                'user_code': record.user_code,
                'user_name': user_name,
                # 'player_height': record.player_height,
                # 'player_weight' : record.player_weight,
                'player_point' : record.player_point,
                'player_area' : record.player_area,
                'player_position' : record.player_position,
                'player_team' : record.player_team,
                # 'player_description' : record.player_description,
                # 'player_goal' : record.player_goal,
                # 'player_assist' : record.player_assist,
                # 'player_foot' : record.player_foot,
                # 'player_num' : record.num,
                'age' : age,
                # 'user_gender' : user_gender,
            })
        return JsonResponse({'data' : serialized_data, 'num_pages' : paginator.num_pages}, status=200)
    
# 플레이어 지역 조회
class local_players(APIView):
    def get(self, requset, format=None):
        areas = ["전국", "서울특별시", "인천광역시", "대전광역시", "대구광역시",
                 "울산광역시","부산광역시","광주광역시","경기도","강원도","충청북도",
                 "충청남도","경상북도","전라북도","전라남도","세종특별자치시","제주특별자치도"]
        results = []

        for area in areas:
            # 특정 지역에 해당하는 선수만 필터링합니다.
            players = PlayerInfo.objects.filter(player_area__iexact=area)
            area_stats = {
                'area'          : area,
                'total_players' : 0,
                'average_age'   : 0,
                'average_point': 0,
                'most_position' : 0
            }

            sum_of_age = 0
            sum_of_point = 0
            total_players = len(players)

            for player in players:
                try:
                    user = UserInfo.objects.get(user_code = player.user_code)
                except UserInfo.DoesNotExist:
                    print("존재하지 않는 유저정보 code :" + player.user_code)
                    total_players -= 1
                    continue
                   
                age = calculate_age(getattr(user, 'user_birth'))
                sum_of_age += age
                sum_of_point += player.player_point
            
            if(total_players == 0):
                results.append(area_stats)
                continue
            
            area_stats['total_players'] = total_players
            area_stats['average_age'] = sum_of_age/total_players
            area_stats['average_point'] = sum_of_point/total_players

            results.append(area_stats)

        return Response(results, status=status.HTTP_200_OK)

            