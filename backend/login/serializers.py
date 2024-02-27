from rest_framework import serializers
from .models import UserInfo
from DB.models import PlayerInfo

from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from staticfiles.make_code import make_code

from user.serializers import User_info_Serializer, Player_info_Serializer

import re

class User_info_Serializer(User_info_Serializer):
    class Meta:
        fields = '__all__'
        model = UserInfo
        # password 제외하고 리턴
        extra_kwargs = {
    	    'password' : {'write_only' : True },
            'user_code' : {'required' : False}
	    }


class Player_info_Serializer(Player_info_Serializer):
    class Meta:
        fields = '__all__'
        model = PlayerInfo

        extra_kwargs = {
            'player_height' : {'required' : False},
            'player_weight' : {'required' : False},
            'player_point' : {'required' : False},
            'player_area' : {'required' : False},
            'player_position' : {'required' : False},
            'player_description' : {'required' : False},
            'player_goal' : {'required' : False},
            'player_assist' : {'required' : False},
            'player_foot' : {'required' : False},
	    }