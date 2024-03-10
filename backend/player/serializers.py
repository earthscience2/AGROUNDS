from rest_framework import serializers
from .models import PlayerInfo

from django.http import JsonResponse

# 플레이어 정보 불러오기
class Player_main_page(serializers.ModelSerializer):
    class Meta:
        model = PlayerInfo
        fields = '__all__'
        
        
        
# 플레이어 정보 불러오기
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
            'player_num' : {'required' : False},
            'player_team' : {'required' : False},
	    }

    def update(self, instance, validated_data):
        instance.player_height = validated_data.get('player_height', instance.player_height)
        instance.player_weight = validated_data.get('player_weight',instance.player_weight)
        instance.player_area = validated_data.get('player_area',instance.player_area)
        instance.player_position = validated_data.get('player_position',instance.player_position)
        instance.player_description = validated_data.get('player_description',instance.player_description)
        instance.player_foot = validated_data.get('player_foot',instance.player_foot)
        instance.player_num = validated_data.get('player_num',instance.player_num)
        instance.player_team = validated_data.get('player_team',instance.player_team)
        instance.save()
        return instance
    