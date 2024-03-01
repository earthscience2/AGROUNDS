from django.shortcuts import render
from django.http import JsonResponse
from django.core.paginator import Paginator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import PlayerInfo
from DB.models import UserInfo

import json
from django.forms.models import model_to_dict

from staticfiles.get_info import calculate_age

from drf_yasg.utils import swagger_auto_schema
from .swagger_parameters import *

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
        manual_parameters=[
             test_view_parameter
        ],
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
        player['user_nickname'] = user.user_nickname
        player['age'] = calculate_age(user.user_birth)
        player['user_gender'] = user.user_gender
        return JsonResponse(player, status=200)


class edit_player(APIView):
    def post(self, request, *args, **kwargs):
        try:
            player = PlayerInfo.objects.get(user_code = request.data['user_code'])
        except PlayerInfo.DoesNotExist:
            return JsonResponse({'error': '해당 사용자가 존재하지 않습니다.'}, status=401)
        
class get_all_players(APIView):
    """
    모든 선수를 json을 원소로 가진 배열 형태로 불러옴
    """
    def get(self, request, *args, **kwargs):
        try:
            all_players = PlayerInfo.objects.all()
        except PlayerInfo.DoesNotExist:
            return JsonResponse({'error': '해당 사용자가 존재하지 않습니다.'}, status=401)
        
        page = request.query_params.get("page")
        paginator = Paginator(all_players, 10)
        
        if(page is None or int(page) < 1):
            page = 1
        elif (int(page) > paginator.num_pages):
            page = paginator.num_pages

        page_obj = paginator.page(page)
        print()

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