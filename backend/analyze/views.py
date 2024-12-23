from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import json
import os
from django.conf import settings
# Create your views here.

class getAnalyzeResult(APIView):
    def post(self, request):
        data = request.data.copy()

        required_fields = ['match_code', 'user_code']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if field not in data}
        if errors:
            return Response(errors, status=400)
        
        match_code = data['match_code']
        user_code = data['user_code']

        filename = ['analyze.json', 'analyze2.json', 'analyze3.json']

        with open(os.path.join(settings.STATIC_ROOT, filename[self.map_string_to_number(match_code)]), encoding='utf-8') as file:
            data = json.load(file)
            return Response(data)
        
    def map_string_to_number(self, input_string):
        if len(input_string) > 45:
            raise ValueError("입력 문자열은 45자 이하여야 합니다.")

        # 문자열 해시값을 계산하고 0, 1, 2 중 하나로 매핑
        mapped_number = hash(input_string) % 3
        return mapped_number
        
