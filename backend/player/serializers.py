from rest_framework import serializers
from .models import PlayerInfo

from django.http import JsonResponse


class Player_Info_Serializer(serializers.ModelSerializer):
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