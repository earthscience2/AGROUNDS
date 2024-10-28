from rest_framework import serializers
from staticfiles.get_file_url import get_file_url
from .models import TestAnalyzeData
from staticfiles.makeFileKey import *
from staticfiles.s3 import S3TxtFileReader
import json

baseUrl = "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com"

class AnalyzeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAnalyzeData
        fields = '__all__'

# 매치에 대한 데이터
class MatchAnalyzeSerializer(serializers.ModelSerializer):
    ai_summation = serializers.SerializerMethodField()
    class Meta:
        model = TestAnalyzeData
        fields = ['ai_summation']

    def get_ai_summation(self, obj):
        bucket_name = 'aground-aisdfis'
        file_key = makeGptJosnKey(obj.user_id, obj.match_date, obj.match_number)

        reader = S3TxtFileReader(bucket_name)
        file_content = reader.read(file_key)
        if file_content:
            json_data = json.loads(file_content)
        return json_data
    
# 각 쿼터별 데이터
class QuarterAnalyzeSerializer(serializers.ModelSerializer):
    quarter_name = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    hitmap = serializers.SerializerMethodField()
    high_speed_hitmap = serializers.SerializerMethodField()
    change_direction = serializers.SerializerMethodField()
    speed_change = serializers.SerializerMethodField()
    acceleration_change = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()
    T = serializers.SerializerMethodField()
    D = serializers.SerializerMethodField()
    DPM = serializers.SerializerMethodField()
    LDT = serializers.SerializerMethodField()
    HDT = serializers.SerializerMethodField()
    MR = serializers.SerializerMethodField()
    AS = serializers.SerializerMethodField()
    HS = serializers.SerializerMethodField()
    AA = serializers.SerializerMethodField()
    HA = serializers.SerializerMethodField()
    S = serializers.SerializerMethodField()
    ASD = serializers.SerializerMethodField()
    ASS = serializers.SerializerMethodField()
    ASA = serializers.SerializerMethodField()
    TSD = serializers.SerializerMethodField()
    HSD = serializers.SerializerMethodField()
    LSD = serializers.SerializerMethodField()
    SDPD = serializers.SerializerMethodField()

    class Meta:
        model = TestAnalyzeData
        fields = ['user_id', 'match_date', 'match_number', 'quarter',
            'quarter_name', 'type', 'hitmap', 'high_speed_hitmap', 'change_direction', 
            'speed_change', 'acceleration_change', 'video', 'T', 'D', 'DPM', 'LDT', 
            'HDT', 'MR', 'AS', 'HS', 'AA', 'HA', 'S', 'ASD', 'ASS', 'ASA', 'TSD', 
            'HSD', 'LSD', 'SDPD'
        ]
    
    def get_file_content(self, obj):
        """Helper method to fetch file content only once per instance."""
        if not hasattr(self, '_cached_file_content'):
            bucket_name = 'aground-aisdfis'
            file_key = makeResultJsonKey(obj.user_id, obj.match_date, obj.match_number)

            reader = S3TxtFileReader(bucket_name)
            file_content = reader.read(file_key)
            self._cached_file_content = json.loads(file_content) if file_content else {}
        
        self._cached_file_content[f'{obj.quarter}쿼터']
        return self._cached_file_content

    def get_quarter_name(self, obj):
        json_data = self.get_file_content(obj)
        return ""

    def get_type(self, obj):
        
        return ""

    def get_hitmap(self, obj):
        
        return ""

    def get_high_speed_hitmap(self, obj):
        
        return ""

    def get_change_direction(self, obj):
        
        return ""

    def get_speed_change(self, obj):
        
        return ""

    def get_acceleration_change(self, obj):
        return ""

    def get_video(self, obj):
        return ""

    def get_T(self, obj):
        return ""

    def get_D(self, obj):
        return ""

    def get_DPM(self, obj):
        return ""

    def get_LDT(self, obj):
        return ""

    def get_HDT(self, obj):
        return ""

    def get_MR(self, obj):
        return ""

    def get_AS(self, obj):
        return ""

    def get_HS(self, obj):
        return ""

    def get_AA(self, obj):
        return ""

    def get_HA(self, obj):
        return ""

    def get_S(self, obj):
        return ""

    def get_ASD(self, obj):
        return ""

    def get_ASS(self, obj):
        return ""

    def get_ASA(self, obj):
        return ""

    def get_TSD(self, obj):
        return ""

    def get_HSD(self, obj):
        return ""

    def get_LSD(self, obj):
        return ""

    def get_SDPD(self, obj):
        return ""