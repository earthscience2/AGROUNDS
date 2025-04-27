from django.shortcuts import get_object_or_404
from rest_framework import serializers
from DB.models import *
from staticfiles.get_file_url import get_file_url
from staticfiles.make_file_key import *

class Match_Analyze_Result_Serializer(serializers.ModelSerializer):
    quarter = serializers.SerializerMethodField()
    point = serializers.SerializerMethodField()
    active_ratio = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    attack = serializers.SerializerMethodField()
    defense = serializers.SerializerMethodField()
    speed_change = serializers.SerializerMethodField()
    acceleration_change = serializers.SerializerMethodField()

    class Meta:
        model = UserAnalMatch
        fields = ['quarter', 'point', 'active_ratio', 'total', 'attack', 'defense', 'position', 'speed_change', 'acceleration_change']

    def get_quarter(self, obj):
        return obj.quarter_name
    
    def get_point(self, obj):
        return obj.point
    
    def get_active_ratio(self, obj):
        active_ratio = {
            "A_TPT" : obj.A_TPT,
            "D_TPT" : obj.D_TPT
        }
        return active_ratio
    
    def get_speed_change(self, obj):
        speed_change = obj.T_AS_L
        new_speed_change = []
        divider = len(speed_change)/5

        for i in range(0, len(speed_change)):
            if i % divider == 1:
                new_speed_change.append(speed_change[i])

        return new_speed_change

    def get_acceleration_change(self, obj):
        acceleration_change = obj.T_AA_L
        new_acceleration_change = []
        divider = len(acceleration_change)/5

        for i in range(0, len(acceleration_change)):
            if i % divider == 1:
                new_acceleration_change.append(acceleration_change[i])

        return new_acceleration_change

    def get_total(self, obj):
        total = {
            "hitmap": getHitmapUrl(obj.match_code, obj.user_code, obj.quarter_name, "total"),
            "sprintmap": getSprintMapUrl(obj.match_code, obj.user_code, obj.quarter_name),
            "change_direction": getChangeDirectionUrl(obj.match_code, obj.user_code, obj.quarter_name, "total"),
            "T": obj.T_T,
            "D": obj.T_D,
            "DPM": obj.T_DPM,
            "LDT": obj.T_LDT,
            "HDT": obj.T_HDT,
            "MR": obj.T_MR,
            "AS": obj.T_AS,
            "HS": obj.T_HS,
            "AA": obj.T_AA,
            "HA": obj.T_HA,
            "S": obj.T_S,
            "ASD": obj.T_ASD,
            "ASS": obj.T_ASS,
            "ASA": obj.T_ASA,
            "TSD": obj.T_TSD,
            "HSD": obj.T_HSD,
            "LSD": obj.T_LSD,
            "SDPD": obj.T_SDPD
        }
        return total
    
    def get_attack(self, obj):
        attack = {
            "hitmap": getHitmapUrl(obj.match_code, obj.user_code, obj.quarter_name, "attack"),
            "sprintmap": getSprintMapUrl(obj.match_code, obj.user_code, obj.quarter_name),
            "change_direction": getChangeDirectionUrl(obj.match_code, obj.user_code, obj.quarter_name, "attack"),
            "T": obj.A_T,
            "D": obj.A_D,
            "DPM": obj.A_DPM,
            "LDT": obj.A_LDT,
            "HDT": obj.A_HDT,
            "MR": obj.A_MR,
            "AS": obj.A_AS,
            "HS": obj.A_HS,
            "AA": obj.A_AA,
            "HA": obj.A_HA,
            "S": obj.T_S,
            "ASD": obj.T_ASD,
            "ASS": obj.T_ASS,
            "ASA": obj.T_ASA,
            "TSD": obj.T_TSD,
            "HSD": obj.T_HSD,
            "LSD": obj.T_LSD,
            "SDPD": obj.T_SDPD
        }
        return attack
    
    def get_defense(self, obj):
        defense = {
            "hitmap": getHitmapUrl(obj.match_code, obj.user_code, obj.quarter_name, "defense"),
            "sprintmap": getSprintMapUrl(obj.match_code, obj.user_code, obj.quarter_name),
            "change_direction": getChangeDirectionUrl(obj.match_code, obj.user_code, obj.quarter_name, "defense"),
            "T": obj.D_T,
            "D": obj.D_D,
            "DPM": obj.D_DPM,
            "LDT": obj.D_LDT,
            "HDT": obj.D_HDT,
            "MR": obj.D_MR,
            "AS": obj.D_AS,
            "HS": obj.D_HS,
            "AA": obj.D_AA,
            "HA": obj.D_HA,
            "S": obj.T_S,
            "ASD": obj.T_ASD,
            "ASS": obj.T_ASS,
            "ASA": obj.T_ASA,
            "TSD": obj.T_TSD,
            "HSD": obj.T_HSD,
            "LSD": obj.T_LSD,
            "SDPD": obj.T_SDPD
        }
        return defense
