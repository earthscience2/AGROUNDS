from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import PlayerInfo
from DB.models import UserInfo

import json
from django.forms.models import model_to_dict

class get_player_by_user_code(APIView):
    """
    user_code로 선수 데이터를 불러옴

    json 형식
    {
        'user_code' : {string}
    }
    """
    def post(self, request, *args, **kwargs):
        try:
            player = PlayerInfo.objects.get(user_code = request.data['user_code'])
            user = UserInfo.objects.get(uesr_code = request.data['user_code'])
        except PlayerInfo.DoesNotExist:
            return JsonResponse({'error': '해당 사용자가 존재하지 않습니다.'}, status=401)
        player = model_to_dict(player)
        player.pop('user_code')
        player['user_nickname'] = user.user_nickname
        return JsonResponse(player, status=200)


class edit_player(APIView):
    def post(self, request, *args, **kwargs):
        try:
            player = PlayerInfo.objects.get(user_code = request.data['user_code'])
        except PlayerInfo.DoesNotExist:
            return JsonResponse({'error': '해당 사용자가 존재하지 않습니다.'}, status=401)