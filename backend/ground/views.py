from django.shortcuts import render
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response

class searchGrounds(APIView):
    def post(self, request):
        keyword =request.data.get('keyword')

        if keyword is None:
            return Response({'error': 'Missing required field: keyword'}, status=400)
        
        result = []
        if "용인" in keyword:
            result = [
                {
                    "ground_code" : "g_0001",
                    "ground_name" : "용인시축구센터",
                    "ground_location" : "용인시 처인구 동백죽전대로 61"
                },
                {
                    "ground_code" : "g_0002",
                    "ground_name" : "탑스타 주니어 스포츠클럽",
                    "ground_location" : "용인시 기흥구 용구대로 2335번길 39"
                },
                {
                    "ground_code" : "g_0003",
                    "ground_name" : "신봉배수지축구장",
                    "ground_location" : "용인시 수지구 신봉2로 182"
                }
            ]
        
        return Response({"result" : result})

class getCoordinate(APIView):
    def post(self, request):
        ground_code =request.data.get('ground_code')

        if ground_code is None:
            return Response({'error': 'Missing required field: keyword'}, status=400)

        return Response({
            "x" : "37.249703911962435",
            "y" : "127.16515904465132"
        }) 