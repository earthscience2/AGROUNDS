from rest_framework import serializers
from staticfiles.get_file_url import get_file_url
from .models import TestAnalyzeData
from staticfiles.test_page_make_file_key import *
from staticfiles.s3 import S3TxtFileReader
import json

baseUrl = "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com"

class AnalyzeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAnalyzeData
        fields = '__all__'

# 매치에 대한 데이터(ai요약)
class MatchAnalyzeSerializer(serializers.ModelSerializer):
    ai_summation = serializers.SerializerMethodField()
    class Meta:
        model = TestAnalyzeData
        fields = ['ai_summation']

    def get_ai_summation(self, obj):
        bucket_name = 'aground-aisdfis'
        file_key = makeGptJosnKey(obj.user_id, obj.match_code, obj.match_date, obj.match_number)

        reader = S3TxtFileReader(bucket_name)
        file_content = reader.read(file_key)
        if file_content:
            json_data = json.loads(file_content)
        return json_data