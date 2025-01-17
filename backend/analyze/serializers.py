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

    class Meta:
        model = UserAnalMatch
        fields = ['quarter', 'point', 'active_ratio', 'total', 'attack', 'defense']

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
    
    def get_total(self, obj):
        total = {
            "hitmap": getHitmapUrl(obj.match_code, obj.user_code, obj.quarter_name, "total"),
            "high_speed_hitmap": getHighSpeedHitmapUrl(obj.match_code, obj.user_code, obj.quarter_name, "total"),
            "change_direction": getChangeDirectionUrl(obj.match_code, obj.user_code, obj.quarter_name, "total"),
            "speed_change": getSpeedChangeUrl(obj.match_code, obj.user_code, obj.quarter_name, "total"),
            "acceleration_change": getAccelerationChangeUrl(obj.match_code, obj.user_code, obj.quarter_name, "total"),
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
            "high_speed_hitmap": getHighSpeedHitmapUrl(obj.match_code, obj.user_code, obj.quarter_name, "attack"),
            "change_direction": getChangeDirectionUrl(obj.match_code, obj.user_code, obj.quarter_name, "attack"),
            "speed_change": getSpeedChangeUrl(obj.match_code, obj.user_code, obj.quarter_name, "attack"),
            "acceleration_change": getAccelerationChangeUrl(obj.match_code, obj.user_code, obj.quarter_name, "attack"),
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
            "S": obj.A_S,
            "ASD": obj.A_ASD,
            "ASS": obj.A_ASS,
            "ASA": obj.A_ASA,
            "TSD": obj.A_TSD,
            "HSD": obj.A_HSD,
            "LSD": obj.A_LSD,
            "SDPD": obj.A_SDPD
        }
        return attack
    
    def get_defense(self, obj):
        defense = {
            "hitmap": getHitmapUrl(obj.match_code, obj.user_code, obj.quarter_name, "defense"),
            "high_speed_hitmap": getHighSpeedHitmapUrl(obj.match_code, obj.user_code, obj.quarter_name, "defense"),
            "change_direction": getChangeDirectionUrl(obj.match_code, obj.user_code, obj.quarter_name, "defense"),
            "speed_change": getSpeedChangeUrl(obj.match_code, obj.user_code, obj.quarter_name, "defense"),
            "acceleration_change": getAccelerationChangeUrl(obj.match_code, obj.user_code, obj.quarter_name, "defense"),
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
            "S": obj.D_S,
            "ASD": obj.D_ASD,
            "ASS": obj.D_ASS,
            "ASA": obj.D_ASA,
            "TSD": obj.D_TSD,
            "HSD": obj.D_HSD,
            "LSD": obj.D_LSD,
            "SDPD": obj.D_SDPD
        }
        return defense

    

    