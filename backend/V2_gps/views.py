from rest_framework.response import Response
from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework import status
from django.views import View
from .serializers import *
from staticfiles.analyze.gps_normalizetion import gps_normalizetion
import time
import json
import boto3

class teamGpsSSE(View):
    def get(self, request):
        response = StreamingHttpResponse(self.event_stream(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'  # For Nginx buffering
        return response

    def event_stream(self):
        s3_client = boto3.client('s3')
        bucket_name = 'agrounds-image-bucket'
        file_key = 'data/edit_data/edit_data.json'
        
        obj1 = s3_client.get_object(Bucket=bucket_name, Key=file_key)
        content = obj1['Body'].read().decode('utf-8')
        json_data = json.loads(content)
        gps_data = gps_normalizetion(json_data)

        normalized_datas = []

        for player_number in range (0, len(gps_data.player_list)):
            normalized_datas.append(gps_data.normalize_position(player_number))

        max_len = max(len(data) for data in normalized_datas)
        
        for start in range(0, max_len, 1000):
            end = min(start + 1000, max_len)
            res_data = {}
            for player_number in range(len(gps_data.player_list)):
                chunk = normalized_datas[player_number][start:end]
                res_data[gps_data.player_list[player_number]] = chunk if chunk else 0
            yield f'data: {res_data}\n\n'
            time.sleep(0.5)
        yield f'data: end\n\n'